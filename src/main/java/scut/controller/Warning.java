package scut.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.log4j.Logger;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RestController;
import scut.service.SysUserService;
import scut.service.authority.CurrentUser;
import scut.util.Constants;
import scut.util.hbase.HBaseCli;
import scut.util.parser.JsonParser;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;
import com.alibaba.fastjson.JSONArray;

import javax.annotation.Resource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Map;
import java.util.Date;

@Component
@RestController
public class Warning {
    @Resource
    SysUserService sysUserService;

    public static Logger logger = Logger.getLogger(LogManager.class);


    SimpleDateFormat sdf = new SimpleDateFormat("yy/MM/dd HH:mm:ss");
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT,Constants.MYSQL_URL,Constants.MYSQL_USERNAME,Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

    @Scheduled(fixedRate = /*5*60*1000*/ 10*60*1000)
    private void checkSensor() {
        //UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        //model.addAttribute(Constants.CURRENT_USER, currentUser);

        //long userOrganizationId = sysUserService.getUserOrganizationId();
        //String userManageableOrgIdsStr = sysUserService.getUserSelfAndInferiorOrganizationIds()
                //.toString().replace("[", "(").replace("]", ")");
        String sql = String.format("SELECT\n" +
                "sensor_id, sensor_number \n"+
                "FROM\n" +
                "	sensor_info\n" +
                "WHERE type_id = 1 AND sensor_id >=1022");
        String[] fields = new String[]{"sensor_id","sensor_number"};
        JSONArray data = baseDao.queryData(sql, fields);
        for(int i = 0; i < data.size(); i++)
        {
            String sensorId = data.getJSONObject(i).getString("sensor_id");
            String sensor_number = data.getJSONObject(i).getString("sensor_number");
            checkForWarning(sensorId, sensor_number);
        }
    }
    private void checkForWarning(String sensorId, String sensor_number)
    {
        String sql = String.format("SELECT YBYZ FROM sin_sensor_info WHERE sensor_id = " + sensorId);
        String[] fields = new String[]{"YBYZ",};
        JSONArray data = baseDao.queryData(sql, fields);
        float threshold = Float.parseFloat(data.getJSONObject(0).getString("YBYZ"));
        //if (threshold == 0)
        //    return;
        computeThreshold(sensorId, sensor_number, (float)1.1);
    }
    private void computeThreshold(String sensorId, String sensor_number, float preset)
    {
        Calendar nowTime = Calendar.getInstance();
        String hbaseTableName = "CloudBridge:" + sensorId;
        //String hbaseTableName = "CloudBridge:1026";
        int limit = 0;
        int sample = -1;
        JSONArray columnArray = JSON.parseArray("[\"XZYB\"]");
        SimpleDateFormat sdf =new SimpleDateFormat("yyyyMMddHHmmss");
        String endRow = sdf.format(nowTime.getTime());
        nowTime.add(Calendar.HOUR, -12);
        String startRow = sdf.format(nowTime.getTime());
        JSONArray rangeData = HBaseCli.getInstance().query(hbaseTableName,startRow,endRow,columnArray,limit,sample);
        int size = rangeData.size()-1;
        if(size <=2)
            return ;
        boolean isIncreasing = false;
        String XZYB = rangeData.getJSONObject(size - 1).getString("XZYB");
        if(XZYB.equals("*"))
            return;
        float latestStrain = Float.parseFloat(XZYB);
        if(Float.parseFloat(rangeData.getJSONObject(size-2).getString("XZYB")) < latestStrain)
        {
            isIncreasing = true;
        }
        int i = size - 2;
        while(i > 0)
        {
            float cur = Float.parseFloat(rangeData.getJSONObject(i).getString("XZYB"));
            float prev = Float.parseFloat(rangeData.getJSONObject(i - 1).getString("XZYB"));
            if(isIncreasing && cur < prev)
                break;
            else if(!isIncreasing && cur > prev)
                break;
            i--;
        }
        float amplitude = Float.parseFloat(rangeData.getJSONObject(i).getString("XZYB")) - latestStrain;
        if(amplitude < 0)
            amplitude = 0 - amplitude;
        if(preset < amplitude)
        {

            String startTime = rangeData.getJSONObject(i).getString("CLSJ");
            String endTime = rangeData.getJSONObject(size - 1).getString("CLSJ");
            SimpleDateFormat hbkeyformat =new SimpleDateFormat("yyyyMMddHHmmss");
            SimpleDateFormat naturalformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String naturalStartTime = "";
            String naturalEndTime = "";
            String amp = Float.toString(amplitude);
            try {
                naturalStartTime = naturalformat.format(hbkeyformat.parse(startTime));
                naturalEndTime = naturalformat.format(hbkeyformat.parse(endTime));
            } catch (ParseException e) {
                e.printStackTrace();
            }
            String sql = String.format("select w.name from sensor_info as s, watch_box as w where s.box_id = w.box_id" +
                    "and s.sensor_id = %s",sensorId);
            String[] boxFields = new String[]{"name"};
            JSONArray data = baseDao.queryData(sql, boxFields);
            String boxName = data.getJSONObject(0).getString("name");
            sql = String.format("select point.id from sensor_info where sensor_id = %s", sensorId);
            String[] pointFields = new String[]{"point_id"};
            data = baseDao.queryData(sql, pointFields);
            String pointId = data.getJSONObject(0).getString("point_id");
            sql = String.format("select s.name from section as s, watch_point as w where w.section_id = s.section_id and w.point_id = %s",pointId);
            String[] sectionFields = new String[]{"name"};
            data = baseDao.queryData(sql, sectionFields);
            String sectionName = data.getJSONObject(0).getString("name");

            String warning = "自 " + naturalStartTime + " 至 " + naturalEndTime + " 幅值为 " + amp + " 超出阈值！";;
            sql = String.format("INSERT INTO sensor_warning(bridge_name, module_name, sensor_number, " +
                    "section_name ,amplitude, threshold, begin_time, end_time, warning_info) VALUES %s, %s, %s, %s, %s, %s, %s, %s, %s",
                    "肇庆西江大桥", boxName, sensorId, sectionName, amp, "46.3", naturalStartTime, naturalEndTime, warning);
            baseDao.updateData(sql);
        }
        return;
    }

//    private String generateWarning(String sensor_number, String startTime, String endTine, float amplitude) throws ParseException {
//        SimpleDateFormat hbkeyfotmat =new SimpleDateFormat("yyyyMMddHHmmss");
//        SimpleDateFormat sdf =new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        String naturalStartTime = sdf.format(hbkeyfotmat.parse(startTime));
//        String naturalEndTime = sdf.format(hbkeyfotmat.parse(endTine));
//        String amp = Float.toString(amplitude);
//        return "自 " + naturalStartTime + " 至 " + naturalEndTime + " 幅值为 " + amp + " 超出阈值！";
//    }
}

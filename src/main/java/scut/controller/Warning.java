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
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Map;
import java.util.Date;

@Component
public class Warning {
    @Resource
    SysUserService sysUserService;

    public static Logger logger = Logger.getLogger(LogManager.class);

    SimpleDateFormat sdf = new SimpleDateFormat("yy/MM/dd HH:mm:ss");
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT,Constants.MYSQL_URL,Constants.MYSQL_USERNAME,Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

    @Scheduled(fixedRate = /*5*60*1000*/ 10*1000)
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
        String int11 = "11";
        String sensorId = data.getJSONObject(1).getString("sensor_id");
        String sensor_number = data.getJSONObject(1).getString("sensor_number");
        checkForWarning(sensorId, sensor_number);
        JSONObject data1 = new JSONObject();
        String hbaseTableName = "CloudBridge:" + sensorId;
        int sample = -1;




    }
    private void checkForWarning(String sensorId, String sensor_number)
    {
        String sql = String.format("SELECT YBYZ FROM sin_sensor_info WHERE sensor_id = " + sensorId);
        String[] fields = new String[]{"YBYZ",};
        JSONArray data = baseDao.queryData(sql, fields);
        float threshold = Float.parseFloat(data.getJSONObject(0).getString("YBYZ"));
        //if (threshold == 0)
        //    return;
        if(threshold < abs(computeThreshold(sensorId))
        {
            sql = String("INSERT INTO sensor_warning VALUES ("+ sensor_number + ",")
        }



    }
    private float computeThreshold(String sensorId)
    {
        Calendar nowTime = Calendar.getInstance();
        //String hbaseTableName = "CloudBridge:" + sensorId;
        String hbaseTableName = "CloudBridge:1026";
        //String columnList = new String("CLYB");
        int limit = 0;
        int sample = -1;
        JSONArray columnArray = JSON.parseArray("[\"XZYB\"]");
        SimpleDateFormat sdf =new SimpleDateFormat("yyyyMMddHHmmss");
        String endRow = sdf.format(nowTime.getTime());
        nowTime.add(Calendar.HOUR, -12);
        String startRow = sdf.format(nowTime.getTime());
        JSONArray rangeData = HBaseCli.getInstance().query(hbaseTableName,startRow,endRow,columnArray,limit,sample);
        int size = rangeData.size()-4;
        if(size <=2)
            return 0;
        boolean isIncreasing = false;
        float latestStrain = Float.parseFloat(rangeData.getJSONObject(size - 1).getString("XZYB"));
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
        return Float.parseFloat(rangeData.getJSONObject(i).getString("XZYB")) - latestStrain;
    }
}

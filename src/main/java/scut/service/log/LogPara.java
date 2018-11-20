package scut.service.log;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.log4j.Logger;
import scut.util.Constants;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 桥梁参数写入日志的service
 * Created by linjiaqin on 2018/11/08.
 */
public class LogPara {
    public static Logger logger = Logger.getLogger(LogPara.class);
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT, Constants.MYSQL_URL, Constants.MYSQL_USERNAME, Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

    //桥梁的5个参数写入日志
    public int log_bridge_para(JSONObject reqMsg, String username)
    {
        Integer bridge_id = reqMsg.getInteger("bridge_id");
        String E = reqMsg.getString("E");
        String mrc0 = reqMsg.getString("mrc0");
        String src0 = reqMsg.getString("src0");
        String mrt0 = reqMsg.getString("mrt0");
        String srt0 = reqMsg.getString("srt0");

        String sql = String.format("select distinct bridge_name from bridge_info where bridge_id = %d", bridge_id);
        String fields[] = new String[]{"bridge_name"};
        JSONArray data =  baseDao.queryData(sql,fields);
        String bridge_name = data.getJSONObject(0).get("bridge_name").toString();

        String log_info = String.format("修改%s的参数：mrc0:%s, src0:%s, mrt0:%s, srt0:%s, E:%s",
                bridge_name, mrc0, src0, mrt0, srt0, E);

        String log_sql = create_log_sql(username, log_info);

        int ret = 1;
        if (sys_logoption(23))
        {
            ret = baseDao.updateData(log_sql);
        }

        return ret;
    }

    //修改测点参数收缩徐变值写入日志
    public int log_watch_point_para(JSONObject reqMsg, String username)
    {
        Integer watch_point_id = reqMsg.getInteger("watch_point_id");
        String sc = reqMsg.getString("sc");
        String sql = String.format("select d.bridge_name,c.name as section_name,a.name as point_name from watch_point as a " +
                "left join watch_point_para as b on a.point_id = b.watch_point_id " +
                "left join section as c on c.section_id = a.section_id " +
                "left join bridge_info as d on d.bridge_id = c.bridge_id "+
                "where watch_point_id = %d", watch_point_id);
        String fields[] = new String[]{"bridge_name","section_name","point_name"};
        JSONArray data = baseDao.queryData(sql, fields);
        logger.info(data);
        String bridge_name = data.getJSONObject(0).get("bridge_name").toString();
        String section_name = data.getJSONObject(0).get("section_name").toString();
        String watch_point_name = data.getJSONObject(0).get("point_name").toString();
        String log_info = "更改"+bridge_name+"的"+section_name+"的"+watch_point_name+"参数"+
                "测点的收缩徐变值为:"+sc;

        String log_sql = create_log_sql(username, log_info);

        int ret = 1;
        if (sys_logoption(23))
        {
            ret = baseDao.updateData(log_sql);
        }
        return ret;
    }

    /*
     *获取桥梁，系统日志选项是否开启
     * 22代表桥梁，23代表系统
     */
    public boolean sys_logoption(int option_id)
    {
        boolean flag = true;
        String sql = String.format("select option_state from log_option where option_id = %s",option_id);
        String[] field = new String[]{"option_state"};
        String state = baseDao.queryData(sql,field).getJSONObject(0).get("option_state").toString();
        logger.info(state);
        if (!state.equals("checked")) flag = false;
        return flag;
    }

    //生成插入日志的sql语句
    public String create_log_sql(String username, String log_info)
    {
        String curTime = sdf.format(new Date());

        String log_sql = String.format("insert into log_system(username,log_time,log_info) "+
                "values('%s','%s','%s')", username, curTime, log_info);
        logger.info(log_sql);
        return log_sql;
    }
}

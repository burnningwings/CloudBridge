package scut.service.log;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.log4j.Logger;
import scut.util.Constants;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import java.text.SimpleDateFormat;

public class LogPara {
    public static Logger logger = Logger.getLogger(LogPara.class);
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT, Constants.MYSQL_URL, Constants.MYSQL_USERNAME, Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);
    public String log_bridge_para(JSONObject reqMsg)
    {
        String sql = "";

        Integer watch_point_id = reqMsg.getInteger("watch_point_id");
        String sc = reqMsg.getString("sc");
        String count_pointid_sql = String.format("select count(*) as total from watch_point_para where watch_point_id = %d", watch_point_id);
        String[] fields = new String[]{"total"};
        JSONArray data = baseDao.queryData(count_pointid_sql,fields);
        return sql;
    }
    public String log_watch_point_para(JSONObject reqMsg)
    {
        String sql = "";
        return sql;

    }
}

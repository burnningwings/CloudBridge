package scut.service.scheduler;

import com.alibaba.fastjson.JSONObject;
import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.log4j.Logger;
import scut.util.Constants;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Created by Carrod on 2018/5/23.
 */
public class Message {

    public static Logger logger = Logger.getLogger(Scheduler.class);
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT,Constants.MYSQL_URL,Constants.MYSQL_USERNAME,Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);
    private static Message instance = null;

    public static Message getInstance() {
        if(instance == null) {
            synchronized (Scheduler.class) {
                if(instance == null) {
                    instance = new Message();
                }
            }
        }
        return instance;
    }

    private Message() {
    }

    public int update(String key, String source, String target,String status, String param, String errorMessage){
        errorMessage = errorMessage==null?"":errorMessage;
        source = source==null?"":source;
        target = target==null?"":target;
        param = param==null?"":param;
        return this.updateOrInsert(key,source,target,status,param,errorMessage);
    }

    public JSONObject getInfo(String id, String[] columns){
        String selectColumns = String.join(",",columns);
        String sqlFormat = "select %s from message where id='%s'";
        JSONObject data = new JSONObject();
        try {
            baseDao.querySingleObject(String.format(sqlFormat,selectColumns,id),new ResultSetHandler<Void>(){
                @Override
                public Void handle(ResultSet rs) throws SQLException {
                    if(rs.next()){
                        for(String column: columns){
                            data.put(column,rs.getString(column));
                        }
                    }
                    return null;
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return data;
    }

    private int updateOrInsert(String id,String source,String target,String status,String param,String errorLog){
        String sqlFormat = "INSERT INTO message (id,source,target,status,param,error_log) VALUES ('%s','%s','%s','%s','%s','%s') " +
                "ON DUPLICATE KEY UPDATE status='%s',error_log='%s'";
        int ret = 0;
        try {
            status = "FINISHED";
            if(param==null || param.equals(""))
                ret = baseDao.Execute(String.format(sqlFormat,id,source,target,status,param,errorLog,status,errorLog));
            else{
                sqlFormat = sqlFormat + ",param='%s'";
                ret = baseDao.Execute(String.format(sqlFormat,id,source,target,status,param,errorLog,status,errorLog,param));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ret;
    }

    public int delete(String id){
        String sqlFormat = "delete from message where id = '%s'";
        int ret = 0;

        try {
            ret = baseDao.Execute(String.format(sqlFormat,id));
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ret;
    }
}

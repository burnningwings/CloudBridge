package scut.service.scheduler;

import org.apache.log4j.Logger;
import scut.util.Constants;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import java.sql.SQLException;

/**
 * Created by xiaoah on 2018/9/20
 */
public class AnalysisMessage {
    public static Logger logger = Logger.getLogger(Scheduler.class);
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT,Constants.MYSQL_URL,Constants.MYSQL_USERNAME,Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

    private static AnalysisMessage instance = null;
    public static AnalysisMessage getInstance() {
        if(instance == null) {
            synchronized (Scheduler.class) {
                if(instance == null) {
                    instance = new AnalysisMessage();
                }
            }
        }
        return instance;
    }

    private AnalysisMessage(){

    }

    public int update(String key, String source, String target,String status, String type, String errorMessage){
        errorMessage = errorMessage==null?"":errorMessage;
        source = source==null?"":source;
        target = target==null?"":target;
        type = type==null?"":type;
        return this.updateOrInsert(key,source,target,status,type,errorMessage);
    }

    private int updateOrInsert(String id,String source,String target,String status,String type,String errorLog){
        String sqlFormat = "INSERT INTO analysis_message (id,source,target,status,type,error_log)" + " VALUES (\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\") " +
                "ON DUPLICATE KEY UPDATE status='%s',error_log=\"%s\"";
        int ret = 0;
        try {
            ret = baseDao.Execute(String.format(sqlFormat,id,source,target,status,type,errorLog.replace("\"","'"),status,errorLog.replace("\"","'")));
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ret;
    }

}

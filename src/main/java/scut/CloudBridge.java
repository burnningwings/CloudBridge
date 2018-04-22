package scut;

import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import scut.util.Constants;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Created by Carrod on 2018/4/19.
 */

@SpringBootApplication
public class CloudBridge implements EnvironmentAware {

    public static Logger logger = Logger.getLogger(CloudBridge.class);

    public static void main(String[] args) {
        SpringApplication.run(CloudBridge.class, args);
    }

    private static void initCommonConfig(){
        logger.debug("初始化...");
//         数据库查询示例
//        test();
    }

    @Override
    public void setEnvironment(Environment env) {
        // TODO Auto-generated method stub
        try {
            Constants.MYSQL_URL = env.getProperty("spring.datasource.url").toString();
            Constants.MYSQL_USERNAME = env.getProperty("spring.datasource.username").toString();
            Constants.MYSQL_PASSWORD = env.getProperty("spring.datasource.password").toString();
        }catch (Exception e){
            logger.debug("当前MYSQL未配置.");
        }
        this.initCommonConfig();
    }

    public static void test(){
        // MYSQL查询示例
        int maxActive = 100;
        String druid_mysql_url = String.format(Constants.MYSQL_FORMAT,Constants.MYSQL_URL,Constants.MYSQL_USERNAME,Constants.MYSQL_PASSWORD) + "|" + maxActive;
        SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);
        String test = null;
        try {
            test = baseDao.querySingleObject("select * from sys_role",new ResultSetHandler<String>(){
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    while(rs.next()){
                        System.out.println(rs.getString(1));
                    }
                    return null;
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}

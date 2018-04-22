package scut.util.sql;

import com.alibaba.druid.pool.DruidDataSource;
import org.apache.log4j.Logger;
import scut.util.StringUtil;

import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.ConcurrentHashMap;


public class SQLDaoFactory {
    private static final String MYSQL_DRIVER = "com.mysql.jdbc.Driver";
    private static final Map<String, String> TYPE_MAP = new TreeMap<String, String>();
    private static Map<String, SQLBaseDao> sourceMap =
            new ConcurrentHashMap<String, SQLBaseDao>();
    private static Logger LOG = Logger.getLogger(SQLDaoFactory.class);

    static {
        TYPE_MAP.put("mysql", MYSQL_DRIVER);
    }

    public static SQLBaseDao getSQLDaoInstance(String dbConn) {
        SQLBaseDao baseDao = sourceMap.get(dbConn);
        if (baseDao == null) {
            synchronized (SQLDaoFactory.class) {
                baseDao = sourceMap.get(dbConn);
                if (baseDao == null) {
                    DruidDataSource source = createPolledInstance(dbConn);
                    baseDao = new SQLBaseDao(source);
                    sourceMap.put(dbConn, baseDao);
                }
            }
        }
        return baseDao;
    }

    private static DruidDataSource createPolledInstance(String dbConn) {
        String[] params = dbConn.split(StringUtil.STR_DELIMIT_1ST);
        if (params.length < 3) {
            LOG.error(dbConn + " is illegal!");
            return null;
        }
        int maxPoll = 1;
        if (params.length >= 3) {
            maxPoll = Integer.parseInt(params[3]);
        }
        String[] dbUrls = params[0].split(StringUtil.STR_DELIMIT_4TH);
        if (dbUrls.length < 3) {
            LOG.error(dbConn + " is illegal!");
            return null;
        }
        String driverClass = TYPE_MAP.get(dbUrls[1]);
        if (driverClass == null) {
            LOG.error(dbConn + " is illegal!");
            return null;
        }
        DruidDataSource source = new DruidDataSource();
        source.setDriverClassName(driverClass);
        source.setUrl(params[0]);
        source.setUsername(params[1]);
        source.setPassword(params[2]);

        //初始化大小、最小、大最
        source.setMinIdle(1);
        source.setInitialSize(1);
        source.setMaxActive(maxPoll);
        //获取连接超时
        source.setMaxWait(600 * 1000);
        //关闭空闲连接
        source.setTimeBetweenEvictionRunsMillis(60000);
        //最小生存时间
        source.setMinEvictableIdleTimeMillis(300000);

        source.setTestOnBorrow(false);
        source.setTestOnReturn(false);
        source.setTestWhileIdle(true);
        source.setValidationQuery("SELECT 'x'");
        source.setRemoveAbandonedTimeout(1800);
        source.setMaxOpenPreparedStatements(20);
        source.setLogAbandoned(true);
        return source;
    }
}


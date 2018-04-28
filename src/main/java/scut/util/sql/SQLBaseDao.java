package scut.util.sql;

import com.alibaba.druid.pool.DruidDataSource;
import org.apache.commons.dbutils.DbUtils;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.ResultSetHandler;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

/**
 * Created by Administrator on 2017/11/3.
 */
public class SQLBaseDao {
    private DruidDataSource dataSource;
    private QueryRunner runner;

    public SQLBaseDao(DruidDataSource source) {
        this.dataSource = source;
        this.runner = new QueryRunner();
    }

    public <T> T querySingleObject(String sql, ResultSetHandler<T> handler, Object... params) throws SQLException {
        Connection connection = dataSource.getConnection();
        T task;
        try {
            if (params == null) {
                task = runner.query(connection, sql, handler);
            } else {
                task = runner.query(connection, sql, handler, params);
            }
        } finally {
            DbUtils.close(connection);
        }
        return task;
    }

    public <T> List<T> queryObjects(String sql, ResultSetHandler<List<T>> handler,
                                    Object... params) throws SQLException {
        List<T> list;
        Connection connection = dataSource.getConnection();
        try {
            if (params == null) {
                list = runner.query(connection, sql, handler);
            } else {
                list = runner.query(connection, sql, handler, params);
            }
        } finally {
            DbUtils.close(connection);
        }
        return list;
    }

    /**
     * Execute an SQL INSERT, UPDATE, or DELETE query.
     * @param sql
     * @param params
     * @return
     * @throws SQLException
     */
    public int Execute(String sql, Object... params) throws SQLException {
        Connection connection = dataSource.getConnection();
        int ret = -1;
        try {
            if (params == null) {
                ret = runner.update(connection, sql);
            } else {
                ret = runner.update(connection, sql, params);
            }
        } finally {
            DbUtils.close(connection);
        }
        return ret;
    }

    public int[] batch(List<String> sqlList) throws SQLException {
        Connection connection = dataSource.getConnection();
        Statement stmt = null;
        connection.setAutoCommit(false);
        int[] rows = null;
        try {
            stmt = connection.createStatement();
            for (String sql: sqlList) {
                stmt.addBatch(sql);
            }
            rows = stmt.executeBatch();
            connection.commit();
        } finally {
            if (stmt != null) {
                stmt.close();
            }
            DbUtils.close(connection);
        }
        return rows;
    }
}

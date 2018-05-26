package scut.util;

/**
 * Created by Carrod on 2018/4/19.
 */
public class Constants {
    // mysql config
    public static String MYSQL_URL = null;
    public static String MYSQL_USERNAME = null;
    public static String MYSQL_PASSWORD = null;

    public final static String MYSQL_FORMAT = "%s|%s|%s";


    public final static String CURRENT_USER = "CurrentUser";
    public final static String ACCESS_TOKEN = "token";

    // 传感器数据保存根目录
    public static String SENSOR_DATA_ROOT_DIR = null;

    // 上传数据程序路径
    public static String UPLOAD_DATA_BIN_SH = null;

    // 消息状态
    public final static String READY = "READY";
    public final static String RUNNING = "RUNNING";
    public final static String FINISHED = "FINISHED";
    public final static String FAILED = "FAILED";
}

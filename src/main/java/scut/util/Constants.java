package scut.util;

/**
 * Created by Carrod on 2018/4/19.
 * Modified by Mjcr on 2018/9/24
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

    /**
     * 数据分析模块相关路径
     * created by mjcr
     */
    //上传训练文件路径
    public static String OVERWEIGHT_UPLOAD_TRAIN_FILE_DIR = null;
    public static String DAMAGE_UPLOAD_TRAIN_FILE_DIR = null;

    //上传测试文件路径
    public static String OVERWEIGHT_UPLOAD_TEST_FILE_DIR = null;
    public static String DAMAGE_UPLOAD_TEST_FILE_DIR = null;

    //上传训练模型文件路径
    public static String OVERWEIGHT_UPLOAD_TRAIN_MODEL_DIR = null;
    public static String DAMAGE_UPLOAD_TRAIN_MODEL_DIR = null;

    //保存训练好的模型路径
    public static String OVERWEIGHT_SAVE_TRAIN_MODEL_DIR = null;
    public static String DAMAGE_SAVE_TRAIN_MODEL_DIR = null;

    //测试模型程序
    public static String TEST_MODEL_PROGRAM = null;

    //预测文件保存路径
    public static String OVERWEIGHT_PREDICT_FILE_DIR = null;
    public static String DAMAGE_PREDICT_FILE_DIR = null;


    // 消息状态
    public final static String READY = "READY";
    public final static String RUNNING = "RUNNING";
    public final static String FINISHED = "FINISHED";
    public final static String FAILED = "FAILED";
}

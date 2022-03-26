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
    public final static String USER_ROLE = "userRole";
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
    public static String OVERWEIGHT_TRAIN_FILE_MERGED_DIR = null;
    public static String OVERWEIGHT_EVALUATE_FILE_MERGED_DIR = null;
    public static String OVERWEIGHT_TEST_FILE_MERGED_DIR = null;
    public static String DAMAGE_UPLOAD_TRAIN_FILE_DIR = null;
    public static String DAMAGE_TRAIN_FILE_MERGED_DIR = null;
    public static String DAMAGE_EVALUATE_FILE_MERGED_DIR = null;
    public static String DAMAGE_TEST_FILE_MERGED_DIR = null;



    //自定义条件目标文件路径
    public static String DAMAGE_TRAINFILE_TARGET_DIR = null;
    public static String DAMAGE_EVALUATEFILE_TARGET_DIR = null;
    public static String DAMAGE_TESTFILE_TARGET_DIR = null;
    public static String OVERWEIGHT_TRAINFILE_TARGET_DIR = null;
    public static String OVERWEIGHT_EVALUATEFILE_TARGET_DIR = null;
    public static String OVERWEIGHT_TESTFILE_TARGET_DIR = null;
    public static String ASSOCIATION_TARGET_DIR = null;
    public static String RELIABILITY_TARGET_DIR = null;

    //传测试文件路径
    public static String OVERWEIGHT_UPLOAD_TEST_FILE_DIR = null;
    public static String DAMAGE_UPLOAD_TEST_FILE_DIR = null;

    //上传验证文件路径
    public static String OVERWEIGHT_UPLOAD_EVALUATE_FILE_DIR = null;
    public static String DAMAGE_UPLOAD_EVALUATE_FILE_DIR = null;

    //上传训练模型文件路径
    public static String OVERWEIGHT_UPLOAD_TRAIN_MODEL_DIR = null;
    public static String DAMAGE_UPLOAD_TRAIN_MODEL_DIR = null;
    public static String ASSOCIATION_UPLOAD_TRAIN_MODEL_DIR = null;
    public static String RELIABILITY_UPLOAD_TRAIN_MODEL_DIR = null;

    //保存训练好的模型路径
    public static String OVERWEIGHT_SAVE_TRAIN_MODEL_DIR = null;
    public static String DAMAGE_SAVE_TRAIN_MODEL_DIR = null;

    //验证模型程序
    public static String DAMAGE_EVALUATE_MODEL_PROGRAM = null;
    public static String OVERWEIGHT_EVALUATE_MODEL_PROGRAM = null;

    //预测程序
    public static String TEST_MODEL_PROGRAM = null;
    public static String OVERWEIGHT_PREDICT_PROGRAM = null;
    public static String DAMAGE_PREDICT_PROGRAM = null;

    //验证模型结果保存路径
    public static String DAMAGE_EVALUATE_MODEL_RESULT_DIR = null;
    public static String OVERWEIGHT_EVALUATE_MODEL_RESULT_DIR = null;

    //预测文件保存路径
    public static String OVERWEIGHT_PREDICT_FILE_DIR = null;
    public static String DAMAGE_PREDICT_FILE_DIR = null;

    //关联文件保存路径
    public static String ASSOCIATION_FILE_DIR = null;

    //关联分析结果保存路径
    public static String ASSOCIATION_ANALYSIS_RESULT_DIR = null;

    //关联分析程序路径
    public static String ASSOCIATION_ANALYSIS_PROGRAM = null;

    //小波分析文件路径
    public static String WAVELET_ANALYSIS_FILE = null;

    //可靠度分析文件路径
    public static String RELIABILITY_ANALYSIS_FILE = null;

    //可靠度分析程序路径
    public static String RELIABILITY_ANALYSIS_PROGRAM = null;

    //可靠度分析结果保存路径
    public static String RELIABILITY_ANALYSIS_RESULT_DIR = null;

    //python程序执行脚本前缀
    public static String SCRIPT_EXEC_PREFIX = null;

    //模型标签保存路径
    public static String OVERWEIGHT_TRAIN_LABEL = null;
    public static String OVERWEIGHT_EVALUATE_LABEL = null;

    //模型损失函数图像保存路径
    public static String OVERWEIGHT_TRAIN_LOSSIMAGE = null;



  // 消息状态
    public final static String READY = "READY";
    public final static String RUNNING = "RUNNING";
    public final static String FINISHED = "FINISHED";
    public final static String FAILED = "FAILED";
}

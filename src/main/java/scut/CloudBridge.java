package scut;

import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.log4j.Logger;
import org.apache.tomcat.util.bcel.Const;
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
            Constants.SENSOR_DATA_ROOT_DIR = env.getProperty("sensor.data.dir").toString();
            Constants.UPLOAD_DATA_BIN_SH = env.getProperty("upload.bin.sh").toString();
            Constants.OVERWEIGHT_UPLOAD_TRAIN_FILE_DIR = env.getProperty("overweight.upload.trainfile.dir").toString();
            Constants.DAMAGE_UPLOAD_TRAIN_FILE_DIR = env.getProperty("damage.upload.trainfile.dir").toString();
            Constants.OVERWEIGHT_UPLOAD_EVALUATE_FILE_DIR = env.getProperty("overweight.upload.evaluatefile.dir").toString();
            Constants.DAMAGE_UPLOAD_EVALUATE_FILE_DIR = env.getProperty("damage.upload.evaluatefile.dir").toString();
            Constants.OVERWEIGHT_UPLOAD_TEST_FILE_DIR = env.getProperty("overweight.upload.testfile.dir").toString();
            Constants.DAMAGE_EVALUATE_MODEL_RESULT_DIR = env.getProperty("damage.evaluate.result.dir").toString();
            Constants.OVERWEIGHT_EVALUATE_MODEL_RESULT_DIR = env.getProperty("overweight.evaluate.result.dir").toString();
            Constants.DAMAGE_UPLOAD_TEST_FILE_DIR = env.getProperty("damage.upload.testfile.dir").toString();
            Constants.OVERWEIGHT_UPLOAD_TRAIN_MODEL_DIR = env.getProperty("overweight.upload.trainmodel.dir").toString();
            Constants.DAMAGE_UPLOAD_TRAIN_MODEL_DIR = env.getProperty("damage.upload.trainmodel.dir").toString();
            Constants.OVERWEIGHT_SAVE_TRAIN_MODEL_DIR = env.getProperty("overweight.saved.trainmodel.dir").toString();
            Constants.DAMAGE_SAVE_TRAIN_MODEL_DIR = env.getProperty("damage.saved.trainmodel.dir").toString();
            Constants.TEST_MODEL_PROGRAM = env.getProperty("damage.model.test.program").toString();
            Constants.DAMAGE_EVALUATE_MODEL_PROGRAM = env.getProperty("damage.model.evaluate.program").toString();
            Constants.OVERWEIGHT_EVALUATE_MODEL_PROGRAM = env.getProperty("overweight.model.evaluate.program").toString();
            Constants.OVERWEIGHT_PREDICT_FILE_DIR = env.getProperty("overweight.predict.output.dir").toString();
            Constants.DAMAGE_PREDICT_FILE_DIR = env.getProperty("damage.predict.output.dir").toString();
            Constants.ASSOCIATION_FILE_DIR = env.getProperty("association.analysis.dir").toString();
            Constants.ASSOCIATION_ANALYSIS_RESULT_DIR = env.getProperty("association.analysis.result.dir").toString();
            Constants.ASSOCIATION_ANALYSIS_PROGRAM = env.getProperty("association.analysis.program").toString();
            Constants.WAVELET_ANALYSIS_FILE = env.getProperty("wavelet.analysis.file.dir").toString();
            Constants.DAMAGE_TRAIN_FILE_MERGED_DIR = env.getProperty("damage.trainfile.merged.dir").toString();
            Constants.DAMAGE_TRAINFILE_TARGET_DIR = env.getProperty("damage.trainfile.target.dir").toString();
            Constants.DAMAGE_EVALUATE_FILE_MERGED_DIR = env.getProperty("damage.evaluatefile.merged.dir").toString();
            Constants.DAMAGE_EVALUATEFILE_TARGET_DIR = env.getProperty("damage.evaluatefile.target.dir").toString();
            Constants.DAMAGE_TEST_FILE_MERGED_DIR = env.getProperty("damage.testfile.merged.dir").toString();
            Constants.DAMAGE_TESTFILE_TARGET_DIR = env.getProperty("damage.testfile.target.dir").toString();
            Constants.OVERWEIGHT_PREDICT_PROGRAM = env.getProperty("overweight.model.test.program").toString();
            Constants.DAMAGE_PREDICT_PROGRAM = env.getProperty("damage.model.test.program").toString();
            Constants.OVERWEIGHT_TRAIN_FILE_MERGED_DIR = env.getProperty("overweight.trainfile.merged.dir").toString();
            Constants.OVERWEIGHT_TRAINFILE_TARGET_DIR = env.getProperty("overweigh.trainfile.target.dir").toString();
            Constants.OVERWEIGHT_EVALUATE_FILE_MERGED_DIR = env.getProperty("overweigh.evaluatefile.merged.dir").toString();
            Constants.OVERWEIGHT_EVALUATEFILE_TARGET_DIR = env.getProperty("overweigh.evaluatefile.target.dir").toString();
            Constants.OVERWEIGHT_TEST_FILE_MERGED_DIR = env.getProperty("overweigh.testfile.merged.dir").toString();
            Constants.OVERWEIGHT_TESTFILE_TARGET_DIR = env.getProperty("overweigh.testfile.target.dir").toString();
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

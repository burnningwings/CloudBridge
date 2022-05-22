package scut.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import scut.base.HttpResponse;
import scut.service.SysUserService;
import scut.service.scheduler.AnalysisMessage;
import scut.service.scheduler.LogEntity;
import scut.service.scheduler.executor.CommandLineExecutor;
import scut.service.scheduler.executor.Executor;
import scut.util.Constants;
import scut.util.hbase.HBaseCli;
import scut.util.parser.JsonParser;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import javax.annotation.Resource;
import java.io.*;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

/**
 * Created by Xiaoah on 2018/9/13
 */
@RestController
public class OverweightAnalysis {
    public static Logger logger = Logger.getLogger(OverweightAnalysis.class);
    SimpleDateFormat sdf = new SimpleDateFormat("yy/MM/dd HH:mm:ss");
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT,Constants.MYSQL_URL,Constants.MYSQL_USERNAME,Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

    @Resource
    SysUserService sysUserService;

    private Map<String,Object> getDataSchema(String sensorId){
        String sql = "select b.data_schema " +
                "from sensor_info as a " +
                "left join sensor_type as b on a.type_id=b.type_id " +
                "where a.sensor_id='%s'";
        System.out.println(String.format(sql,sensorId));
        Map<String,Object> dataSchema = null;
        try {
            dataSchema = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url).querySingleObject(
                    String.format(sql,sensorId),new ResultSetHandler<Map<String,Object>>(){
                        @Override
                        public Map<String,Object> handle(ResultSet rs) throws SQLException {
                            if(rs.next()){
                                return new JsonParser().parse(rs.getString("data_schema"));
                            }
                            return null;
                        }
                    });
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return dataSchema;
    }
//    @RequestMapping(value = "/overweight-analysis/getPredictResult", method = RequestMethod.GET, produces = "application/json")
//    public JSONObject getPredictResult(String testfile, String testmodel){
//        HttpResponse response = new HttpResponse();
//        JSONObject data = new JSONObject();
//        String targetFileName = testfile.split("\\.")[0] + "_" + testmodel.split("\\.")[0] + ".csv";
//        String targetPath =  Constants.OVERWEIGHT_PREDICT_FILE_DIR + "/" + targetFileName;
//        System.out.println(testfile);
//        System.out.println(testmodel);
//        System.out.println(targetPath);
//        File file = new File(targetPath);
//
//        if(!file.exists()){
//            response.setStatus(HttpResponse.FAIL_STATUS);
//            response.setMsg("预测结果不存在！");
//        }else{
//            try {
//                FileReader fr = new FileReader(file);
//                BufferedReader br = new BufferedReader(fr);
//                ArrayList<Integer> prelist = new ArrayList<Integer>();
//                String header = br.readLine();
//                String content = br.readLine();
//                while (content != null){
//                    String result = content.split(",")[content.split(",").length-1];
//                    int resultID = Integer.valueOf(result);
//                    prelist.add(resultID);
//                    content = br.readLine();
//                }
//                br.close();
//                fr.close();
//                data.put("predictresult", prelist);
//            } catch (FileNotFoundException e) {
//                e.printStackTrace();
//            } catch (IOException e){
//                e.printStackTrace();
//            }
//        }
//        response.setData(data);
//        return response.getHttpResponse();
//
//    }

//    @RequestMapping(value = "/overweight-analysis/train", method = RequestMethod.POST, produces = "application/json")
//    public JSONObject trainModel(@RequestBody JSONObject reqMsg){
//        HttpResponse response = new HttpResponse();
//        JSONObject data = new JSONObject();
//
//        String trainFile = reqMsg.getString("trainfile");
//        String trainModel = reqMsg.getString("trainmodel");
//        String savedModel = reqMsg.getString("savedmodel");
//        String md5 = DigestUtils.md5Hex(trainFile + "_" + trainModel);
//
//        String TRAIN_FILE = Constants.OVERWEIGHT_UPLOAD_TRAIN_FILE_DIR + "/" + trainFile;
//        String MODEL_TRAIN_PROGRAM = Constants.OVERWEIGHT_UPLOAD_TRAIN_MODEL_DIR + "/" + trainModel;
//        String SAVED_MODE = Constants.OVERWEIGHT_SAVE_TRAIN_MODEL_DIR + "/" + savedModel;
//
//        AnalysisMessage.getInstance().update(md5, trainFile, savedModel, Constants.READY, "TRAIN", null);
//        //注意，这里要用绝对路径
//        String execStr = "D:/os_environment/anaconda/python " + MODEL_TRAIN_PROGRAM + " " + TRAIN_FILE + " " + SAVED_MODE;
//        //String execStr = "python D:/tmp/a.py";
//        logger.debug(execStr);
//        Executor executor = new CommandLineExecutor(md5, execStr);
//        //Scheduler.getInstance().runExecutor(executor);
//        LogEntity logentity = ((CommandLineExecutor) executor).execute_analysis();
//
//        logger.debug("exitVal: " + logentity.getExitVal());
//        logger.debug(logentity.toString());
//
//        if (logentity.getExitVal() == 0){
//            data.put("result", "success");
//            AnalysisMessage.getInstance().update(md5,null,null,Constants.FINISHED,null,logentity.toString());
//        }else{
//            data.put("result", "failed");
//            AnalysisMessage.getInstance().update(md5,null,null,Constants.FAILED,null,logentity.toString());
//        }
//
//        //data.put("result", "completed");
//        response.setData(data);
//        return response.getHttpResponse();
//    }

//    @RequestMapping(value = "/overweight-analysis/test", method = RequestMethod.POST, produces = "application/json")
//    public JSONObject test(@RequestBody JSONObject reqMsg){
//        HttpResponse response = new HttpResponse();
//        JSONObject data = new JSONObject();
//
//        String testFile = reqMsg.getString("testfile");
//        String testModel = reqMsg.getString("testmodel");
//
//        System.out.println(testFile);
//        System.out.println(testModel);
//
//        String TEST_FILE = Constants.OVERWEIGHT_UPLOAD_TEST_FILE_DIR + "/" + testFile;
//        String MODEL_TEST_PROGRAM = Constants.OVERWEIGHT_PREDICT_PROGRAM;
//        String TEST_MODE = Constants.OVERWEIGHT_SAVE_TRAIN_MODEL_DIR + "/" + testModel;
//        //String outputFileName = testFile + "_" + testModel;
//        String outputFileName = testFile.split("\\.")[0] + "_" + testModel.split("\\.")[0] + ".csv";
//        String OUTPUT_FILE = Constants.OVERWEIGHT_PREDICT_FILE_DIR + "/" + outputFileName;
//
//        String md5 = DigestUtils.md5Hex(testFile + "_" + testModel);
//
//        AnalysisMessage.getInstance().update(md5, testFile, outputFileName, Constants.READY, "TEST", null);
//        String execStr = "D:/os_environment/anaconda/python " + MODEL_TEST_PROGRAM + " " + TEST_FILE + " " + TEST_MODE + " " + OUTPUT_FILE;
//        //String execStr = "python D:/tmp/a.py";
//        logger.debug(execStr);
//        Executor executor = new CommandLineExecutor(md5, execStr);
//        //Scheduler.getInstance().runExecutor(executor);
//        LogEntity logentity = ((CommandLineExecutor) executor).execute_analysis();
//        if (logentity.getExitVal() == 0){
//            data.put("result", "success");
//            AnalysisMessage.getInstance().update(md5,null,null,Constants.FINISHED,null,logentity.toString());
//        }else{
//            data.put("result", "failed");
//            AnalysisMessage.getInstance().update(md5,null,null,Constants.FAILED,null,logentity.toString());
//        }
//
//        //data.put("result", "completed");
//        response.setData(data);
//        return response.getHttpResponse();
//
//    }

    @RequestMapping(value = "/overweight-analysis/trainfileupload", method = RequestMethod.POST)
    public JSONObject trainFileUpload(@RequestParam("trainfile_upload")MultipartFile file){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        if (!file.isEmpty()){
            try{
                File targetFile = new File(Constants.OVERWEIGHT_UPLOAD_TRAIN_FILE_DIR);
                if(!targetFile.exists()) {
                    targetFile.mkdirs();
                }
                String originFileName = file.getOriginalFilename();
                String fileName = Constants.OVERWEIGHT_UPLOAD_TRAIN_FILE_DIR + "/" + originFileName;
                BufferedOutputStream out = new BufferedOutputStream(
                        new FileOutputStream(new File( fileName)));
                out.write(file.getBytes());
                out.flush();
                out.close();

                //合并文件
//                String mergedFilePath = Constants.OVERWEIGHT_TRAIN_FILE_MERGED_DIR;
//                File mergedFile = new File(mergedFilePath);
//                if(!mergedFile.exists()){
//                    mergedFile.createNewFile();
//                }
//                BufferedOutputStream mergeout = new BufferedOutputStream(new FileOutputStream(mergedFile, true));
//                BufferedInputStream newout = new BufferedInputStream(new FileInputStream(new File(fileName)));
//                int size = 0;
//                byte[] buffer = new byte[10240];
//                while((size=newout.read(buffer)) != -1){
//                    mergeout.write(buffer,0, size);
//                }
//                mergeout.write("\n".getBytes());
//                mergeout.flush();
//                newout.close();
//                mergeout.close();

            }catch (FileNotFoundException e){
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("服务器路径错误！");
            }catch (IOException e){
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("文件上传失败！");
            }

        }else{
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("相关上传参数错误！");
        }
        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/overweight-analysis/update_bridge_dropdown", method = RequestMethod.GET, produces = "application/json")
    public JSONObject UdfBridgeDropdown(){
        long userOrganizationId = sysUserService.getUserOrganizationId();
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();

        //String sql = "select b.bridge_id, b.bridge_name from bridge_info b";
        String sql = String.format("select b.bridge_id,b.bridge_name from bridge_info b " +
                "where b.bridge_id in (" +
                "select bo.bridge_id from bridge_organization bo " +
                "where bo.organization_id = %d)", userOrganizationId);
        try {
            baseDao.querySingleObject(sql, new ResultSetHandler<String>() {
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    while(rs.next()){
                        data.put(rs.getString("bridge_name"),rs.getString("bridge_id"));
                    }
                    return null;
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }
        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/overweight-analysis/testfileupload", method = RequestMethod.POST)
    public JSONObject testFileUpload(@RequestParam("testfile_upload")MultipartFile file){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        if (!file.isEmpty()){
            try{
                File targetFile = new File(Constants.OVERWEIGHT_UPLOAD_TEST_FILE_DIR);
                if(!targetFile.exists()) {
                    targetFile.mkdirs();
                }
                String originFileName = file.getOriginalFilename();
                String fileName = Constants.OVERWEIGHT_UPLOAD_TEST_FILE_DIR + "/" + originFileName;
                BufferedOutputStream out = new BufferedOutputStream(
                        new FileOutputStream(new File( fileName)));
                out.write(file.getBytes());
                out.flush();
                out.close();

                //合并文件
//                String mergedFilePath = Constants.OVERWEIGHT_TEST_FILE_MERGED_DIR;
//                File mergedFile = new File(mergedFilePath);
//                if(!mergedFile.exists()){
//                    mergedFile.createNewFile();
//                }
//                BufferedOutputStream mergeout = new BufferedOutputStream(new FileOutputStream(mergedFile, true));
//                BufferedInputStream newout = new BufferedInputStream(new FileInputStream(new File(fileName)));
//                int size = 0;
//                byte[] buffer = new byte[10240];
//                while((size=newout.read(buffer)) != -1){
//                    mergeout.write(buffer,0, size);
//                }
//                mergeout.write("\n".getBytes());
//                mergeout.flush();
//                newout.close();
//                mergeout.close();
            }catch (FileNotFoundException e){
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("服务器路径错误！");
            }catch (IOException e){
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("文件上传失败！");
            }

        }else{
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("相关上传参数错误！");
        }
        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/overweight-analysis/evaluatefileupload", method = RequestMethod.POST)
    public JSONObject evaluateFileUpload(@RequestParam("evaluatefile_upload")MultipartFile file){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        if (!file.isEmpty()){
            try{
                File targetFile = new File(Constants.OVERWEIGHT_UPLOAD_EVALUATE_FILE_DIR);
                if(!targetFile.exists()) {
                    targetFile.mkdirs();
                }
                String originFileName = file.getOriginalFilename();
                String fileName = Constants.OVERWEIGHT_UPLOAD_EVALUATE_FILE_DIR + "/" + originFileName;
                BufferedOutputStream out = new BufferedOutputStream(
                        new FileOutputStream(new File( fileName)));
                out.write(file.getBytes());
                out.flush();
                out.close();

                //合并文件
//                String mergedFilePath = Constants.OVERWEIGHT_EVALUATE_FILE_MERGED_DIR;
//                File mergedFile = new File(mergedFilePath);
//                if(!mergedFile.exists()){
//                    mergedFile.createNewFile();
//                }
//                BufferedOutputStream mergeout = new BufferedOutputStream(new FileOutputStream(mergedFile, true));
//                BufferedInputStream newout = new BufferedInputStream(new FileInputStream(new File(fileName)));
//                int size = 0;
//                byte[] buffer = new byte[10240];
//                while((size=newout.read(buffer)) != -1){
//                    mergeout.write(buffer,0, size);
//                }
//                mergeout.write("\n".getBytes());
//                mergeout.flush();
//                newout.close();
//                mergeout.close();

            }catch (FileNotFoundException e){
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("服务器路径错误！");
            }catch (IOException e){
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("文件上传失败！");
            }

        }else{
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("相关上传参数错误！");
        }
        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/overweight-analysis/trainmodelupload", method = RequestMethod.POST)
    public JSONObject trainModelUpload(@RequestParam("trainmodel_upload")MultipartFile file){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        if (!file.isEmpty()){
            try{
                File targetFile = new File(Constants.OVERWEIGHT_UPLOAD_TRAIN_MODEL_DIR);
                if(!targetFile.exists()) {
                    targetFile.mkdirs();
                }
                String originFileName = file.getOriginalFilename();
                String fileName = Constants.OVERWEIGHT_UPLOAD_TRAIN_MODEL_DIR + "/" + originFileName;
                BufferedOutputStream out = new BufferedOutputStream(
                        new FileOutputStream(new File( fileName)));
                out.write(file.getBytes());
                out.flush();
                out.close();
            }catch (FileNotFoundException e){
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("服务器路径错误！");
            }catch (IOException e){
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("文件上传失败！");
            }

        }else{
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("相关上传参数错误！");
        }
        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/overweight-analysis/trainlabelupload", method = RequestMethod.POST)
    public JSONObject trainLabelUpload(@RequestParam("trainlabel_upload")MultipartFile file){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        if (!file.isEmpty()){
            try{
                File targetFile = new File(Constants.OVERWEIGHT_TRAIN_LABEL);
                if(!targetFile.exists()) {
                    targetFile.mkdirs();
                }
                String originFileName = file.getOriginalFilename();
                String fileName = Constants.OVERWEIGHT_TRAIN_LABEL + "/" + originFileName;
                BufferedOutputStream out = new BufferedOutputStream(
                        new FileOutputStream(new File( fileName)));
                out.write(file.getBytes());
                out.flush();
                out.close();
            }catch (FileNotFoundException e){
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("服务器路径错误！");
            }catch (IOException e){
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("文件上传失败！");
            }

        }else{
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("相关上传参数错误！");
        }
        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/overweight-analysis/dropdown", method = RequestMethod.GET, produces = "application/json")
    public JSONObject dropDownList(String type){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String targetPath = "";
        switch (type){
            case "trainfile": targetPath = Constants.OVERWEIGHT_UPLOAD_TRAIN_FILE_DIR; break;
            case "testfile" : targetPath = Constants.OVERWEIGHT_UPLOAD_TEST_FILE_DIR; break;
            case "trainmodel" : targetPath = Constants.OVERWEIGHT_UPLOAD_TRAIN_MODEL_DIR; break;
            case "savedmodel" : targetPath = Constants.OVERWEIGHT_SAVE_TRAIN_MODEL_DIR; break;
            case "evaluatefile" : targetPath = Constants.OVERWEIGHT_UPLOAD_EVALUATE_FILE_DIR; break;
            case "trainlabel" : targetPath = Constants.OVERWEIGHT_TRAIN_LABEL; break;
            default: break;
        }
        File dirFile = new File(targetPath);
        if (!dirFile.exists()){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("服务器路径错误！");
        }
        String[] fileList = dirFile.list();
        for(int i = 0;i<fileList.length;i++){
            //System.out.println(fileList[i]);
            data.put(fileList[i],"");
        }
        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/overweight-analysis/getTime", method = RequestMethod.GET, produces = "application/json")
    public JSONObject timeList(String type,String filename){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String targetPath = "";
        switch (type){
            case "trainfile": targetPath = Constants.OVERWEIGHT_UPLOAD_TRAIN_FILE_DIR + "/" + filename; break;
            case "evaluatefile" : targetPath = Constants.OVERWEIGHT_UPLOAD_EVALUATE_FILE_DIR + "/" + filename; break;
            case "testfile" : targetPath = Constants.OVERWEIGHT_UPLOAD_TEST_FILE_DIR + "/" + filename; break;
            default: break;
        }
        File dirFile = new File(targetPath);
//        if (!dirFile.exists()){
//            response.setStatus(HttpResponse.FAIL_STATUS);
//            response.setMsg("服务器路径错误！");
//        }
        BufferedReader br = null;
        long begin_time = 0;
        long end_time = 0;

        try {
            br = new BufferedReader(new FileReader(targetPath));
            String line = "";
            int index = 1;
            while ((line = br.readLine()) != null){
                String[] item = line.split(",");
                if ("testfile".equals(type)){
                    if(!item[16].matches("\\d+")){
                        continue;
                    }
                    if (index == 1){
                        begin_time = Long.parseLong(item[16]);
                    }
                    end_time = Long.parseLong(item[16]);
                    index ++;
                }else if ("trainfile".equals(type) || "evaluatefile".equals(type)){
                    if(!item[17].matches("\\d+")){
                        continue;
                    }
                    if (index == 1){
                        begin_time = Long.parseLong(item[17]);
                    }
                    end_time = Long.parseLong(item[17]);
                    index ++;
                }
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        data.put("begin_time",begin_time);
        data.put("end_time",end_time);
        response.setData(data);
        return response.getHttpResponse();
    }

//    @RequestMapping(value = "/overweight-analysis/evaluate", method = RequestMethod.POST, produces = "application/json")
////    public JSONObject evaluate(@RequestBody JSONObject reqMsg){
////        HttpResponse response = new HttpResponse();
////        JSONObject data = new JSONObject();
////
////        String evaluateFile = reqMsg.getString("evaluatefile");
////        String evaluateModel = reqMsg.getString("evaluatemodel");
////
////        System.out.println(evaluateFile);
////        System.out.println(evaluateModel);
////
////        String EVALUATE_FILE = Constants.OVERWEIGHT_UPLOAD_EVALUATE_FILE_DIR + "/" + evaluateFile;
////        String MODEL_EVALUATE_PROGRAM = Constants.OVERWEIGHT_EVALUATE_MODEL_PROGRAM;
////        String EVALUATE_MODEL = Constants.OVERWEIGHT_SAVE_TRAIN_MODEL_DIR + "/" + evaluateModel;
////        //String outputFileName = testFile + "_" + testModel;
////        String outputFileName = evaluateFile.split("\\.")[0] + "_" + evaluateModel.split("\\.")[0] + ".csv";
////        String OUTPUT_FILE = Constants.OVERWEIGHT_EVALUATE_MODEL_RESULT_DIR + "/" + outputFileName;
////
////        String md5 = DigestUtils.md5Hex(evaluateFile + "_" + evaluateModel);
////
////        AnalysisMessage.getInstance().update(md5, evaluateFile, outputFileName, Constants.READY, "EVALUATE", null);
////        String execStr = "D:/os_environment/anaconda/python " + MODEL_EVALUATE_PROGRAM + " " + EVALUATE_FILE + " " + EVALUATE_MODEL + " " + OUTPUT_FILE;
////        //String execStr = "python D:/tmp/a.py";
////        logger.debug(execStr);
////        Executor executor = new CommandLineExecutor(md5, execStr);
////        //Scheduler.getInstance().runExecutor(executor);
////        LogEntity logentity = ((CommandLineExecutor) executor).execute_analysis();
////        if (logentity.getExitVal() == 0){
////            data.put("result", "success");
////            AnalysisMessage.getInstance().update(md5,null,null,Constants.FINISHED,null,logentity.toString());
////            try{
////                BufferedReader br = new BufferedReader(new FileReader(new File(OUTPUT_FILE)));
////                String header = br.readLine();
////                String content = br.readLine();
////                String[] metrics = content.split(",");
////                br.close();
////                data.put("precision", Float.parseFloat(metrics[0]));
////                data.put("recall", Float.parseFloat(metrics[1]));
////                data.put("f1", Float.parseFloat(metrics[2]));
////
////            }catch(FileNotFoundException e){
////                e.printStackTrace();
////            }catch (IOException e){
////                e.printStackTrace();
////            }
////
////        }else{
////            data.put("result", "failed");
////            AnalysisMessage.getInstance().update(md5,null,null,Constants.FAILED,null,logentity.toString());
////        }
////
////        //data.put("result", "completed");
////        response.setData(data);
////        return response.getHttpResponse();
////
////    }

    @RequestMapping(value = "/overweight-analysis/train", method = RequestMethod.POST, produces = "application/json")
    public JSONObject udfTrainModel(@RequestBody JSONObject reqMsg){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();

        String trainfile = reqMsg.getString("trainfile");
//        String bridge = reqMsg.getString("bridge");
        String trainmodel = reqMsg.getString("trainmodel");
        String savedmodel = reqMsg.getString("savedmodel");
        String beginTime = reqMsg.getString("begintime");
        String endTime = reqMsg.getString("endtime");
        String trainLabel = reqMsg.getString("trainlabel");
        long begintime = Long.parseLong(beginTime);
        long endtime = Long.parseLong(endTime);
        String modelType = reqMsg.getString("trainmodeltype");
        String epochs = reqMsg.getString("epochs");
        String lr = reqMsg.getString("lr");
        String batchSize = reqMsg.getString("batch_size");

        //根据条件过滤数据
        File selectFile = new File(Constants.OVERWEIGHT_UPLOAD_TRAIN_FILE_DIR + "/" +trainfile);
        File labelFile = new File(Constants.OVERWEIGHT_TRAIN_LABEL + "/" +trainLabel);
        if(!selectFile.exists()){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("找不到该训练文件！");
        }else if(!labelFile.exists()) {
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("找不到该训练标签！");
        }else {
            boolean startflag = false;
            boolean endflag = false;
            try {
                File targetFile = new File(Constants.OVERWEIGHT_TRAINFILE_TARGET_DIR);
                if(!targetFile.exists()){
                    targetFile.createNewFile();
                }
                FileOutputStream fos = new FileOutputStream(targetFile);
                OutputStreamWriter osw = new OutputStreamWriter(fos,"UTF-8");
                BufferedWriter bw = new BufferedWriter(osw);
//                bw.write("UY1,UY2,UY3,UY4,UY5,UY6,UY7,UY8,UY9,UY10,UY11,UY12,UY13,UY14,UY15,label,bridge,time" + "\n");
                bw.write("x1,x2,x3,x4,x5,x6,x7,x8,x9,x10,x11,x12,x13,x14,x15" + "\n");

                FileInputStream fis = new FileInputStream(selectFile);
                InputStreamReader isr = new InputStreamReader(fis, "UTF-8");
                BufferedReader br = new BufferedReader(isr);
                String line = "";
                int count = 0;
                while((line = br.readLine()) != null ){

                    String[] split = line.split(",");
                    //System.out.println(split.length);
                    if(split.length == 18){
//                        String current_bridge = split[16];
//                        时间段和桥梁检验
                        if(!split[17].matches("\\d+")){
                            continue;
                        }
                        long current_time = Long.parseLong(split[17]);
//                        检查已有数据是否能覆盖所选时间
                        if(current_time >= endtime){  endflag = true;  }
                        if(current_time <= begintime){   startflag = true; }
//                        if(current_bridge.equals(bridge) && current_time >= begintime && current_time <= endtime){
//                            bw.write(line+"\n");
//                            count ++ ;
//                        }
                        if( current_time >= begintime && current_time <= endtime){
                            String tmpline = "";
                            for (int t=0;t<15;t++){
                                tmpline += split[t];
                                if(t <14) {
                                    tmpline += ",";
                                }
                            }
                            bw.write(tmpline+"\n");
                            count ++ ;
                        }
                    }
                    //使用displacement进行测试
//                    endflag = true;
//                    startflag = true;
//                    bw.write(line+"\n");
//                    count ++ ;

                }
                bw.close();
                osw.close();
                fos.close();
                br.close();
                isr.close();
                fis.close();

                if(count != 0 && endflag && startflag){
                    //调用外部程序
                    String md5 = DigestUtils.md5Hex(trainfile + beginTime + endTime + trainmodel);
                    String TRAIN_FILE = Constants.OVERWEIGHT_TRAINFILE_TARGET_DIR;
                    String MODEL_TRAIN_PROGRAM = Constants.OVERWEIGHT_UPLOAD_TRAIN_MODEL_DIR + "/" + trainmodel + "/" + trainmodel + ".py";
//                    String SAVED_MODE = Constants.OVERWEIGHT_SAVE_TRAIN_MODEL_DIR + "/" + savedmodel;
                    String SAVED_MODE = Constants.OVERWEIGHT_SAVE_TRAIN_MODEL_DIR;
                    String TRAINLABEL = Constants.OVERWEIGHT_TRAIN_LABEL + "/" + trainLabel;
                    String TRAINIMAGE = Constants.OVERWEIGHT_TRAIN_LOSSIMAGE;
                    boolean multi = false;
                    if ("tcnmt".equals(modelType) || "rnnmt".equals(modelType) || "lstmmt".equals(modelType) || "dnnlstmmt".equals(modelType)){
                        multi = true;
                    }
//                    TRAIN_FILE = "D:/tmp/CloudBridge/data_analysis/overweight_analysis/train_file/displacement.csv";
                    AnalysisMessage.getInstance().update(md5, trainfile+beginTime+endTime+trainmodel, savedmodel, Constants.READY, "TRAIN", null);

                    //String execStr = "D:/os_environment/anaconda/python " + MODEL_TRAIN_PROGRAM + " " + TRAIN_FILE + " " + SAVED_MODE;
                    //String execStr = Constants.SCRIPT_EXEC_PREFIX + " " + MODEL_TRAIN_PROGRAM + " " + TRAIN_FILE + " " + SAVED_MODE;
                    String execStr = Constants.SCRIPT_EXEC_PREFIX + " " + MODEL_TRAIN_PROGRAM + " --task_name " + savedmodel + " --model_type " + modelType +" --data " + TRAIN_FILE +
                            " --label " + TRAINLABEL + " --mode train --epochs " + epochs + " --lr " + lr + " --batch_size " + batchSize + " --save_loss_image True --loss_image_dir " +
                             TRAINIMAGE + " --save_model True --model_dir " +SAVED_MODE;
                    if (!multi){
                        execStr += " --multi=False";
                    }
                    //String execStr = "python D:/tmp/a.py";
                    logger.debug(execStr);
                    Executor executor = new CommandLineExecutor(md5, execStr);
//                    Scheduler.getInstance().runExecutor(executor);
                    LogEntity logentity = ((CommandLineExecutor) executor).execute_analysis();

                    logger.debug("exitVal: " + logentity.getExitVal());
                    logger.debug(logentity.toString());

                    if (logentity.getExitVal() == 0 || logentity.getExitVal() == 120){
                        data.put("result", "success");
                        AnalysisMessage.getInstance().update(md5,null,null,Constants.FINISHED,null,logentity.toString());
                    }else{
                        data.put("result", "failed");
                        AnalysisMessage.getInstance().update(md5,null,null,Constants.FAILED,null,logentity.toString());
                    }

                    //data.put("result", "completed");
//                    response.setData(data);
//                    return response.getHttpResponse();
                }else{
                    data.put("result", "nodata");
//                    response.setData(data);
//                    return response.getHttpResponse();
                }




            } catch (FileNotFoundException e) {
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("出错！找不到文件！");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("出错！编码有误!");
            } catch (IOException e){
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("出错！IO 异常");
            }
        }


        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/overweight-analysis/trainCGQ",method = RequestMethod.POST,produces = "application/json")
    public JSONObject trainModelWithCGQ(@RequestBody JSONObject reqMsg){

        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();

        String bridge = reqMsg.getString("bridge");
        String trainmodel = reqMsg.getString("trainmodel");
        String savedmodel = reqMsg.getString("savedmodel");
        String beginTime = reqMsg.getString("begintime");
        String endTime = reqMsg.getString("endtime");
        long begintime = Long.parseLong(beginTime);
        long endtime = Long.parseLong(endTime);

//        TODO: select the sensor from mysql with the bridgeId, and the sensors privode the displacement responnse data
        String sql = "select sensor_id from sensor_info as a " +
                "left join watch_box as b on a.box_id = b.box_id " +
                "left join bridge_info as c on  c.bridge_id = b.bridge_id " +
                "where c.bridge_name = " + bridge;

        ArrayList<Integer> sensorList = new ArrayList<>();
        try {
            baseDao.querySingleObject(sql, new ResultSetHandler<Object>() {
                @Override
                public String handle(ResultSet rs) throws SQLException {

                    while(rs.next()){
                        sensorList.add(rs.getInt("sensor_id"));
                    }

                    return null;
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }

//        TODO: accroding the sensorId, selecting the minitoring data from hbase, and make a csv file
        JSONArray columnArray = new JSONArray();
        columnArray.add("CLYB");
//        JSONArray CGQData = new JSONArray();
        JSONObject CGQData = new JSONObject(true);
        int index = 0;
        for (Integer sensorId : sensorList){
            // 获取所有列
//            Set<String> sensorColumns = getDataSchema(sensorId.toString()).keySet();
//            sensorColumns.remove("CLSJ");

            System.out.println(columnArray);
            String hbaseTableName = "CloudBridge:" + sensorId;
            int sample = -1;
            int limit = 0;
            JSONArray rangeData = HBaseCli.getInstance().query(hbaseTableName,beginTime,endTime,columnArray,limit,sample);
            for (int i = 0;i<rangeData.size();i++){
                JSONObject o = rangeData.getJSONObject(i);
                if (!CGQData.containsKey(o.getString("CLSJ"))){
                    //创建新的一个时间戳行
                    String newRow = "";
                    if (index > 0){
                        for (int j = 0;j<index;j++){
                            newRow += ",";
                        }
                    }
                    newRow += o.getString("CLYB");
                    CGQData.put(o.getString("CLSJ"),newRow);
                }else{
                    CGQData.put(o.getString("CLSJ"),CGQData.getString(o.getString("CLSJ"))+o.getString("CLYB"));
                }
            }
            Set<String> keys = CGQData.keySet();
            for (String key : keys){
                CGQData.put(key,CGQData.getString(key)+",");
            }
            index++;
        }

        int count = 0;
        try {
            File targetFile = new File(Constants.OVERWEIGHT_TRAINFILE_TARGET_DIR);
            if(!targetFile.exists()){
                targetFile.createNewFile();
            }
            FileOutputStream fos = null;
            fos = new FileOutputStream(targetFile);
            OutputStreamWriter osw = new OutputStreamWriter(fos,"UTF-8");
            BufferedWriter bw = new BufferedWriter(osw);
            bw.write("x1,x2,x3,x4,x5,x6,x7,x8,x9,x10,x11,x12,x13,x14,x15" + "\n");
            for(String key : CGQData.keySet()){
                bw.write(CGQData.getString(key)+"\n");
                count++;
            }
            bw.close();
            osw.close();
            fos.close();

            //        TODO: using the test API to train the model, and return the result
            if(count != 0){
                //调用外部程序
                String md5 = DigestUtils.md5Hex(targetFile + beginTime + endTime + trainmodel);
                String TRAIN_FILE = Constants.OVERWEIGHT_TRAINFILE_TARGET_DIR;
                String MODEL_TRAIN_PROGRAM = Constants.OVERWEIGHT_UPLOAD_TRAIN_MODEL_DIR + "/" + trainmodel + "/" + trainmodel;
                String SAVED_MODE = Constants.OVERWEIGHT_SAVE_TRAIN_MODEL_DIR + "/" + savedmodel;
                String TRAINLABEL = Constants.OVERWEIGHT_TRAIN_LABEL;
                String TRAINIMAGE = Constants.OVERWEIGHT_TRAIN_LOSSIMAGE;

                AnalysisMessage.getInstance().update(md5, "hbase:CloudBridge:"+bridge+beginTime+endTime+trainmodel, savedmodel, Constants.READY, "TRAIN", null);

                String execStr = Constants.SCRIPT_EXEC_PREFIX + " " + MODEL_TRAIN_PROGRAM + " --task_name " + savedmodel +" --data " + TRAIN_FILE +
                        " --label " + TRAINLABEL + " --mode train --epochs 25 --lr 0.0005 --batch_size 64 --save_loss_image True --loss_image_dir " +
                        TRAINIMAGE + " --save_model True --model_dir " +SAVED_MODE;
                //String execStr = "python D:/tmp/a.py";
                logger.debug(execStr);
                Executor executor = new CommandLineExecutor(md5, execStr);
//                    Scheduler.getInstance().runExecutor(executor);
                LogEntity logentity = ((CommandLineExecutor) executor).execute_analysis();

                logger.debug("exitVal: " + logentity.getExitVal());
                logger.debug(logentity.toString());

                if (logentity.getExitVal() == 0 || logentity.getExitVal() == 0){
                    data.put("result", "success");
                    AnalysisMessage.getInstance().update(md5,null,null,Constants.FINISHED,null,logentity.toString());
                }else{
                    data.put("result", "failed");
                    AnalysisMessage.getInstance().update(md5,null,null,Constants.FAILED,null,logentity.toString());
                }
            }else{
                data.put("result", "nodata");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/overweight-analysis/evaluate", method = RequestMethod.POST, produces = "application/json")
    public JSONObject udfEvaluateModel(@RequestBody JSONObject reqMsg){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();

        String evaluatefile = reqMsg.getString("evaluatefile");
//        String bridge = reqMsg.getString("bridge");
        String evaluatemodel = reqMsg.getString("evaluatemodel");
        String beginTime = reqMsg.getString("begintime");
        String endTime = reqMsg.getString("endtime");
        long begintime = Long.parseLong(beginTime);
        long endtime = Long.parseLong(endTime);
        String modelType = reqMsg.getString("modelType");

        //根据条件过滤数据
        File selectFile = new File(Constants.OVERWEIGHT_UPLOAD_EVALUATE_FILE_DIR + "/" + evaluatefile);
        if(!selectFile.exists()){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("找不到数据！");
        }else{
            boolean startflag = false;
            boolean endflag = false;
            try {
                File targetFile = new File(Constants.OVERWEIGHT_EVALUATEFILE_TARGET_DIR);
                if(!targetFile.exists()){
                    targetFile.createNewFile();
                }
                File targetLabelFile = new File(Constants.OVERWEIGHT_EVALUATE_LABEL);
                if (!targetLabelFile.exists()){
                    targetLabelFile.createNewFile();
                }
                //写数据文件
                FileOutputStream fos = new FileOutputStream(targetFile);
                OutputStreamWriter osw = new OutputStreamWriter(fos,"UTF-8");
                BufferedWriter bw = new BufferedWriter(osw);
//                bw.write("UY1,UY2,UY3,UY4,UY5,UY6,UY7,UY8,UY9,UY10,UY11,UY12,UY13,UY14,UY15,label,bridge,time" + "\n");
                bw.write("x1,x2,x3,x4,x5,x6,x7,x8,x9,x10,x11,x12,x13,x14,x15" + "\n");
                //写标签文件
                FileOutputStream l_fos = new FileOutputStream(targetLabelFile);
                OutputStreamWriter l_osw = new OutputStreamWriter(l_fos, "UTF-8");
                BufferedWriter l_bw = new BufferedWriter(l_osw);
                l_bw.write("label"+"\n");

                FileInputStream fis = new FileInputStream(selectFile);
                InputStreamReader isr = new InputStreamReader(fis, "UTF-8");
                BufferedReader br = new BufferedReader(isr);
                String line = "";
                int count = 0;
                while((line = br.readLine()) != null ){

                    String[] split = line.split(",");
                    if(split.length == 18){
//                        String current_bridge = split[16];
                        if(!split[17].matches("\\d+")){
                            continue;
                        }
                        long current_time = Long.parseLong(split[17]);
                        if(current_time >= endtime){ endflag = true;}
                        if(current_time <= begintime){ startflag = true;}
//                        if(current_bridge.equals(bridge) && current_time >= begintime && current_time <= endtime){
//                            bw.write(line+"\n");
//                            count ++ ;
//                        }
                        if(current_time >= begintime && current_time <= endtime){
                            String tmpline = "";
                            for (int t=0;t<15;t++){
                                tmpline += split[t];
                                if (t < 14) tmpline += ",";
                            }
                            bw.write(tmpline+"\n");
                            l_bw.write(split[15]+"\n");
                            count ++ ;
                        }
                    }

                }
                bw.close();
                osw.close();
                fos.close();
                l_bw.close();
                l_osw.close();
                l_fos.close();
                br.close();
                isr.close();
                fis.close();

                if(count != 0 && startflag && endflag){
                    //调用外部程序
                    String md5 = DigestUtils.md5Hex(evaluatefile + beginTime + endTime + evaluatemodel);
                    String EVALUATE_FILE = Constants.OVERWEIGHT_EVALUATEFILE_TARGET_DIR;
                    String EVALUATE_LABEL = Constants.OVERWEIGHT_EVALUATE_LABEL;
                    String MODEL_EVALUATE_PROGRAM = Constants.OVERWEIGHT_EVALUATE_MODEL_PROGRAM;
                    String EVALUATE_MODEL = Constants.OVERWEIGHT_SAVE_TRAIN_MODEL_DIR + "/" + evaluatemodel;
                    String outputFileName = evaluatefile.split("\\.")[0] + "_" + beginTime + "_" + endTime + "_" + evaluatemodel.split("\\.")[0] + ".csv";
                    String OUTPUT_FILE = Constants.OVERWEIGHT_EVALUATE_MODEL_RESULT_DIR + "/" + outputFileName;

                    boolean multi = false;
                    if ("tcnmt".equals(modelType) || "rnnmt".equals(modelType) || "lstmmt".equals(modelType) || "dnnlstmmt".equals(modelType)){
                        multi = true;
                    }

                    AnalysisMessage.getInstance().update(md5, evaluatefile+beginTime+endTime+evaluatemodel, outputFileName, Constants.READY, "EVALUATE", null);
                    //String execStr = "D:/os_environment/anaconda/python " + MODEL_EVALUATE_PROGRAM + " " + EVALUATE_FILE + " " + EVALUATE_MODEL + " " + OUTPUT_FILE;
                    String execStr = Constants.SCRIPT_EXEC_PREFIX + " " + MODEL_EVALUATE_PROGRAM + " --data " + EVALUATE_FILE + " --label " + EVALUATE_LABEL + " --mode evaluate --model " + EVALUATE_MODEL + " --evaluate_res_dir " + OUTPUT_FILE;
                    //String execStr = "python D:/tmp/a.py";

                    if (!multi){
                        execStr += " --multi=False";
                    }

                    logger.debug(execStr);
                    Executor executor = new CommandLineExecutor(md5, execStr);
                    //Scheduler.getInstance().runExecutor(executor);
                    LogEntity logentity = ((CommandLineExecutor) executor).execute_analysis();

                    logger.debug("exitVal: " + logentity.getExitVal());
                    logger.debug(logentity.toString());

                    if (logentity.getExitVal() == 0 || logentity.getExitVal() == 120){
                        data.put("result", "success");
                        AnalysisMessage.getInstance().update(md5,null,null,Constants.FINISHED,null,logentity.toString());
                        try{
                            BufferedReader br1 = new BufferedReader(new FileReader(new File(OUTPUT_FILE)));
                            String header = br1.readLine();
                            String content = br1.readLine();
                            String[] metrics = content.split(",");
                            br.close();
                            data.put("precision", Float.parseFloat(metrics[0]));
                            data.put("recall", Float.parseFloat(metrics[1]));
                            data.put("f1", Float.parseFloat(metrics[2]));

                        }catch(FileNotFoundException e){
                            e.printStackTrace();
                        }catch (IOException e){
                            e.printStackTrace();
                        }

                    }else{
                        data.put("result", "failed");
                        AnalysisMessage.getInstance().update(md5,null,null,Constants.FAILED,null,logentity.toString());
                    }

                    //data.put("result", "completed");
//                    response.setData(data);
//                    return response.getHttpResponse();
                }else{
                    data.put("result", "nodata");
//                    response.setData(data);
//                    return response.getHttpResponse();
                }




            } catch (FileNotFoundException e) {
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("出错！找不到文件！");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("出错！编码有误!");
            } catch (IOException e){
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("出错！IO 异常");
            }
        }


        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/overweight-analysis/testCGQ",method = RequestMethod.POST,produces = "application/json")
    public JSONObject testCGQ(@RequestBody JSONObject reqMsg){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();

        String bridge = reqMsg.getString("bridge");
        String testmodel = reqMsg.getString("testmodel");
        String beginTime = reqMsg.getString("begintime");
        String endTime = reqMsg.getString("endtime");
        long begintime = Long.parseLong(beginTime);
        long endtime = Long.parseLong(endTime);
        String modelType = reqMsg.getString("modelType");

//        TODO: select the sensor from mysql with the bridgeId, and the sensors privode the displacement responnse data
        String sql = "select sensor_id from sensor_info as a " +
                "left join watch_box as b on a.box_id = b.box_id " +
                "left join bridge_info as c on  c.bridge_id = b.bridge_id " +
                "where c.bridge_name = " + bridge;

        ArrayList<Integer> sensorList = new ArrayList<>();
        try {
            baseDao.querySingleObject(sql, new ResultSetHandler<Object>() {
                @Override
                public String handle(ResultSet rs) throws SQLException {

                    while(rs.next()){
                        sensorList.add(rs.getInt("sensor_id"));
                    }

                    return null;
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }

//        TODO: accroding the sensorId, selecting the minitoring data from hbase, and make a csv file
        JSONArray columnArray = new JSONArray();
        columnArray.add("CLYB");
//        JSONArray CGQData = new JSONArray();
        JSONObject CGQData = new JSONObject(true);
        int index = 0;
        for (Integer sensorId : sensorList){
            // 获取所有列
//            Set<String> sensorColumns = getDataSchema(sensorId.toString()).keySet();
//            sensorColumns.remove("CLSJ");

            System.out.println(columnArray);
            String hbaseTableName = "CloudBridge:" + sensorId;
            int sample = -1;
            int limit = 0;
            JSONArray rangeData = HBaseCli.getInstance().query(hbaseTableName,beginTime,endTime,columnArray,limit,sample);
            for (int i = 0;i<rangeData.size();i++){
                JSONObject o = rangeData.getJSONObject(i);
                if (!CGQData.containsKey(o.getString("CLSJ"))){
                    //创建新的一个时间戳行
                    String newRow = "";
                    if (index > 0){
                        for (int j = 0;j<index;j++){
                            newRow += ",";
                        }
                    }
                    newRow += o.getString("CLYB");
                    CGQData.put(o.getString("CLSJ"),newRow);
                }else{
                    CGQData.put(o.getString("CLSJ"),CGQData.getString(o.getString("CLSJ"))+o.getString("CLYB"));
                }
            }
            Set<String> keys = CGQData.keySet();
            for (String key : keys){
                CGQData.put(key,CGQData.getString(key)+",");
            }
            index++;
        }

        int count = 0;
        try {
            File targetFile = new File(Constants.OVERWEIGHT_TESTFILE_TARGET_DIR);
            if(!targetFile.exists()){
                targetFile.createNewFile();
            }
            FileOutputStream fos = null;
            fos = new FileOutputStream(targetFile);
            OutputStreamWriter osw = new OutputStreamWriter(fos,"UTF-8");
            BufferedWriter bw = new BufferedWriter(osw);
            bw.write("x1,x2,x3,x4,x5,x6,x7,x8,x9,x10,x11,x12,x13,x14,x15" + "\n");
            for(String key : CGQData.keySet()){
                bw.write(CGQData.getString(key)+"\n");
                count++;
            }
            bw.close();
            osw.close();
            fos.close();

            //        TODO: using the test API to train the model, and return the result
            if(count != 0){
                //调用外部程序
                String TEST_FILE = Constants.OVERWEIGHT_TESTFILE_TARGET_DIR;
                String MODEL_TEST_PROGRAM = Constants.OVERWEIGHT_PREDICT_PROGRAM;
//                    String TEST_MODEL = Constants.OVERWEIGHT_SAVE_TRAIN_MODEL_DIR + "/" + testmodel;
                String TEST_MODEL = Constants.OVERWEIGHT_SAVE_TRAIN_MODEL_DIR + "/" + testmodel;
                String outputFileName = bridge + "_" + beginTime + "_" + endTime + "_" + testmodel.split("\\.")[0] + ".csv";
                String OUTPUT_FILE = Constants.OVERWEIGHT_PREDICT_FILE_DIR + "/" + outputFileName;
                String md5 = DigestUtils.md5Hex( bridge + beginTime + endTime + testmodel);

                boolean multi = false;
                if ("tcnmt".equals(modelType) || "rnnmt".equals(modelType) || "lstmmt".equals(modelType) || "dnnlstmmt".equals(modelType)){
                    multi = true;
                }

                AnalysisMessage.getInstance().update(md5, bridge + beginTime + endTime + testmodel, outputFileName, Constants.READY, "TEST",null);
                //String execStr = "D:/os_environment/anaconda/python " + MODEL_TEST_PROGRAM + " " + TEST_FILE + " " + TEST_MODEL + " " + OUTPUT_FILE;
                String execStr = Constants.SCRIPT_EXEC_PREFIX + " " + MODEL_TEST_PROGRAM + " --data " + TEST_FILE + " --mode test --model " + TEST_MODEL + " --res_dir " + OUTPUT_FILE;
                //String execStr = "python D:/tmp/a.py";

                if (!multi){
                    execStr += " --multi=False";
                }

                logger.debug(execStr);
                Executor executor = new CommandLineExecutor(md5, execStr);
                //Scheduler.getInstance().runExecutor(executor);
                LogEntity logentity = ((CommandLineExecutor) executor).execute_analysis();
                if (logentity.getExitVal() == 0 || logentity.getExitVal() == 120){
                    data.put("result", "success");
                    AnalysisMessage.getInstance().update(md5,null,null,Constants.FINISHED,null,logentity.toString());
                }else{
                    data.put("result", "failed");
                    AnalysisMessage.getInstance().update(md5,null,null,Constants.FAILED,null,logentity.toString());
                }
            }else{
                data.put("result", "nodata");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/overweight-analysis/test", method = RequestMethod.POST, produces = "application/json")
    public JSONObject UdfTestModel(@RequestBody JSONObject reqMsg){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();

        String testfile = reqMsg.getString("testfile");
        String bridge = reqMsg.getString("bridge");
        String testmodel = reqMsg.getString("testmodel");
        String beginTime = reqMsg.getString("begintime");
        String endTime = reqMsg.getString("endtime");
        long begintime = Long.parseLong(beginTime);
        long endtime = Long.parseLong(endTime);
        String modelType = reqMsg.getString("modelType");
        System.out.println("start time-----"+beginTime);
        System.out.println("end time--------"+endTime);
        System.out.println(bridge);

        //根据条件过滤数据
        File selectedFile = new File(Constants.OVERWEIGHT_UPLOAD_TEST_FILE_DIR + "/" + testfile);
        if(!selectedFile.exists()){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("找不到预测文件！");
        }else{
            boolean startflag = false;
            boolean endflag = false;
            try {
                File targetFile = new File(Constants.OVERWEIGHT_TESTFILE_TARGET_DIR);
                if(!targetFile.exists()){
                    targetFile.createNewFile();
                }
                FileOutputStream fos = new FileOutputStream(targetFile);
                OutputStreamWriter osw = new OutputStreamWriter(fos, "UTF-8");
                BufferedWriter bw = new BufferedWriter(osw);
                bw.write("UY1,UY2,UY3,UY4,UY5,UY6,UY7,UY8,UY9,UY10,UY11,UY12,UY13,UY14,UY15,bridge,time" + "\n");
//                bw.write("x1,x2,x3,x4,x5,x6,x7,x8,x9,x10,x11,x12,x13,x14,x15" + "\n");

                FileInputStream fis = new FileInputStream(selectedFile);
                InputStreamReader isr = new InputStreamReader(fis, "UTF-8");
                BufferedReader br = new BufferedReader(isr);
                String line = "";
                int count = 0;
                while((line = br.readLine()) != null ){

                    String[] split = line.split(",");
//                    System.out.println(split.length);
                    if(split.length == 17){
                        String current_bridge = split[15];
                        if(!split[16].matches("\\d+")){
                            continue;
                        }
                        long current_time = Long.parseLong(split[16]);
                        if(current_time >= endtime){ endflag = true; };
                        if(current_time <= begintime){startflag = true;};
//                        if(current_bridge.equals(bridge) && current_time >= begintime && current_time <= endtime){
//                            bw.write(line+"\n");
//                            count ++ ;
//                        }
                        if(current_time >= begintime && current_time <= endtime){
                            bw.write(line+"\n");
                            count ++ ;
                        }
                    }
                    if(split.length == 15){
                        endflag = true;
                        startflag = true;
                        if(!split[14].matches("^(-|\\+)?\\d+(\\.\\d+)")){
                            continue;
                        }
                        bw.write(line+"\n");
                        count ++ ;
                    }
                }
                bw.close();
                osw.close();
                fos.close();
                br.close();
                isr.close();
                fis.close();

                if(count != 0 && startflag && endflag){
                    //调用外部程序
                    String TEST_FILE = Constants.OVERWEIGHT_TESTFILE_TARGET_DIR;
                    String MODEL_TEST_PROGRAM = Constants.OVERWEIGHT_PREDICT_PROGRAM;
//                    String TEST_MODEL = Constants.OVERWEIGHT_SAVE_TRAIN_MODEL_DIR + "/" + testmodel;
                    String TEST_MODEL = Constants.OVERWEIGHT_SAVE_TRAIN_MODEL_DIR + "/" + testmodel;
                    String outputFileName = testfile.split("\\.")[0] + "_" + beginTime + "_" + endTime + "_" + testmodel.split("\\.")[0] + ".csv";
                    String OUTPUT_FILE = Constants.OVERWEIGHT_PREDICT_FILE_DIR + "/" + outputFileName;
                    String md5 = DigestUtils.md5Hex(testfile + bridge + beginTime + endTime + testmodel);
                    boolean multi = false;
                    if ("tcnmt".equals(modelType) || "rnnmt".equals(modelType) || "lstmmt".equals(modelType) || "dnnlstmmt".equals(modelType)){
                        multi = true;
                    }

                    AnalysisMessage.getInstance().update(md5, testfile + bridge + beginTime + endTime + testmodel, outputFileName, Constants.READY, "TEST",null);
                    //String execStr = "D:/os_environment/anaconda/python " + MODEL_TEST_PROGRAM + " " + TEST_FILE + " " + TEST_MODEL + " " + OUTPUT_FILE;
                    String execStr = Constants.SCRIPT_EXEC_PREFIX + " " + MODEL_TEST_PROGRAM + " --data " + TEST_FILE + " --mode test --model " + TEST_MODEL + " --res_dir " + OUTPUT_FILE;
                    //String execStr = "python D:/tmp/a.py";
                    if (!multi){
                        execStr += " --multi=False";
                    }
                    logger.debug(execStr);
                    Executor executor = new CommandLineExecutor(md5, execStr);
                    //Scheduler.getInstance().runExecutor(executor);
                    LogEntity logentity = ((CommandLineExecutor) executor).execute_analysis();
                    if (logentity.getExitVal() == 0 || logentity.getExitVal() == 120){
                        data.put("result", "success");
                        AnalysisMessage.getInstance().update(md5,null,null,Constants.FINISHED,null,logentity.toString());
                    }else{
                        data.put("result", "failed");
                        AnalysisMessage.getInstance().update(md5,null,null,Constants.FAILED,null,logentity.toString());
                    }

                }else{
                    data.put("result","nodata");
                }
            }catch (FileNotFoundException e) {
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("出错！找不到文件！");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("出错！编码有误!");
            } catch (IOException e) {
                e.printStackTrace();
                response.setMsg("出错！IO 异常");
            }
        }
        response.setData(data);
        return response.getHttpResponse();

    }

    @RequestMapping(value = "/overweight-analysis/getPredictResult", method = RequestMethod.GET, produces = "application/json")
    public JSONObject getUDFPredictResult(String testfile, String testmodel, String begintime, String endtime){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String targetFileName = testfile.split("\\.")[0] + "_" + begintime + "_" + endtime + "_" + testmodel.split("\\.")[0] + ".csv";
        System.out.println(targetFileName);
        String targetPath =  Constants.OVERWEIGHT_PREDICT_FILE_DIR + "/" + targetFileName;
        File file = new File(targetPath);
        if(!file.exists()){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("预测结果不存在！");
        }else{
            try{
                FileReader fr = new FileReader(file);
                BufferedReader br = new BufferedReader(fr);
                ArrayList<String> timelist = new ArrayList<String>();
                ArrayList<Integer> overweightlist = new ArrayList<Integer>();
                String header = br.readLine();
                String content = br.readLine();
                while(content != null){
                    String[] split = content.split(",");
                    timelist.add(split[1]);
                    overweightlist.add(Integer.valueOf(split[2]));
                    content = br.readLine();
                }
                br.close();
                fr.close();
                data.put("timelist", timelist);
                data.put("overweightlist", overweightlist);

            }catch (FileNotFoundException e){
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("读取不到文件！");
            }catch (IOException e){
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("IO异常！");
            }
        }

        response.setData(data);
        return response.getHttpResponse();
    }
}

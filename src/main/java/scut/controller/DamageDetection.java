package scut.controller;

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
import scut.service.scheduler.Message;
import scut.service.scheduler.Scheduler;
import scut.service.scheduler.executor.CommandLineExecutor;
import scut.service.scheduler.executor.Executor;
import scut.util.Constants;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import javax.annotation.Resource;
import java.io.*;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

/**
 * Created by Xiaoah on 2018/9/13
 */
@RestController
public class DamageDetection {
    public static Logger logger = Logger.getLogger(OverweightAnalysis.class);
    SimpleDateFormat sdf = new SimpleDateFormat("yy/MM/dd HH:mm:ss");
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT,Constants.MYSQL_URL,Constants.MYSQL_USERNAME,Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);
    @Resource
    SysUserService sysUserService;
//    @RequestMapping(value = "/damage-detection/getPredictResult", method = RequestMethod.GET, produces = "application/json")
//    public JSONObject getPredictResult(String testfile, String testmodel){
//        HttpResponse response = new HttpResponse();
//        JSONObject data = new JSONObject();
//        String targetFileName = testfile.split("\\.")[0] + "_" + testmodel.split("\\.")[0] + ".csv";
//        String targetPath =  Constants.DAMAGE_PREDICT_FILE_DIR + "/" + targetFileName;
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
//                ArrayList<String> timelist = new ArrayList<String>();
//                ArrayList<Integer> locationlist = new ArrayList<Integer>();
//                ArrayList<Integer> levellist = new ArrayList<Integer>();
//                //ArrayList<Integer> prelist = new ArrayList<Integer>();
//                String header = br.readLine();
//                String content = br.readLine();
//                while (content != null){
////                    String result = content.split(",")[content.split(",").length-1];
////                    int resultID = Integer.valueOf(result);
////                    prelist.add(resultID);
//                    String[] split = content.split(",");
//                    timelist.add(split[1]);
//                    locationlist.add(Integer.valueOf(split[2]));
//                    levellist.add(Integer.valueOf(split[3]));
//                    content = br.readLine();
//                }
//                br.close();
//                fr.close();
//                data.put("timelist", timelist);
//                data.put("locationlist", locationlist);
//                data.put("levellist", levellist);
//            } catch (FileNotFoundException e) {
//                e.printStackTrace();
//                response.setStatus(HttpResponse.FAIL_STATUS);
//                response.setMsg("读取不到文件！");
//            } catch (IOException e){
//                e.printStackTrace();
//                response.setStatus(HttpResponse.FAIL_STATUS);
//                response.setMsg("IO异常！");
//            }
//        }
//        response.setData(data);
//        return response.getHttpResponse();
//
//    }

    @RequestMapping(value = "/damage-detection/getUDFPredictResult", method = RequestMethod.GET, produces = "application/json")
    public JSONObject getUDFPredictResult(String testfile, String testmodel, String bridge, String begintime, String endtime){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String targetFileName = testfile + "_" + bridge + "_" + begintime + "_" + endtime + "_" + testmodel.split("\\.")[0] + ".csv";
        System.out.println(targetFileName);
        String targetPath =  Constants.DAMAGE_PREDICT_FILE_DIR + "/" + targetFileName;
        File file = new File(targetPath);
        if(!file.exists()){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("预测结果不存在！");
        }else{
            try{
                FileReader fr = new FileReader(file);
                BufferedReader br = new BufferedReader(fr);
                ArrayList<String> timelist = new ArrayList<String>();
                ArrayList<Integer> locationlist = new ArrayList<Integer>();
                ArrayList<Integer> levellist = new ArrayList<Integer>();
                String header = br.readLine();
                String content = br.readLine();
                while(content != null){
                    String[] split = content.split(",");
                    timelist.add(split[1]);
                    locationlist.add(Integer.valueOf(split[2]));
                    levellist.add(Integer.valueOf(split[3]));
                    content = br.readLine();
                }
                br.close();
                fr.close();
                data.put("timelist", timelist);
                data.put("locationlist", locationlist);
                data.put("levellist", levellist);

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

//    @RequestMapping(value = "/damage-detection/train", method = RequestMethod.POST, produces = "application/json")
//    public JSONObject trainModel(@RequestBody JSONObject reqMsg){
//        HttpResponse response = new HttpResponse();
//        JSONObject data = new JSONObject();
//
//        String trainFile = reqMsg.getString("trainfile");
//        String trainModel = reqMsg.getString("trainmodel");
//        String savedModel = reqMsg.getString("savedmodel");
//        String md5 = DigestUtils.md5Hex(trainFile + "_" + trainModel);
//
//        String TRAIN_FILE = Constants.DAMAGE_UPLOAD_TRAIN_FILE_DIR + "/" + trainFile;
//        String MODEL_TRAIN_PROGRAM = Constants.DAMAGE_UPLOAD_TRAIN_MODEL_DIR + "/" + trainModel;
//        String SAVED_MODE = Constants.DAMAGE_SAVE_TRAIN_MODEL_DIR + "/" + savedModel;
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

//    @RequestMapping(value = "/damage-detection/test", method = RequestMethod.POST, produces = "application/json")
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
//        String TEST_FILE = Constants.DAMAGE_UPLOAD_TEST_FILE_DIR + "/" + testFile;
//        String MODEL_TEST_PROGRAM = Constants.DAMAGE_PREDICT_PROGRAM;
//        String TEST_MODE = Constants.DAMAGE_SAVE_TRAIN_MODEL_DIR + "/" + testModel;
//        //String outputFileName = testFile + "_" + testModel;
//        String outputFileName = testFile.split("\\.")[0] + "_" + testModel.split("\\.")[0] + ".csv";
//        String OUTPUT_FILE = Constants.DAMAGE_PREDICT_FILE_DIR + "/" + outputFileName;
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

//    @RequestMapping(value = "/damage-detection/evaluate", method = RequestMethod.POST, produces = "application/json")
//    public JSONObject evaluate(@RequestBody JSONObject reqMsg){
//        HttpResponse response = new HttpResponse();
//        JSONObject data = new JSONObject();
//
//        String evaluateFile = reqMsg.getString("evaluatefile");
//        String evaluateModel = reqMsg.getString("evaluatemodel");
//
//        System.out.println(evaluateFile);
//        System.out.println(evaluateModel);
//
//        String EVALUATE_FILE = Constants.DAMAGE_UPLOAD_EVALUATE_FILE_DIR + "/" + evaluateFile;
//        String MODEL_EVALUATE_PROGRAM = Constants.DAMAGE_EVALUATE_MODEL_PROGRAM;
//        String EVALUATE_MODEL = Constants.DAMAGE_SAVE_TRAIN_MODEL_DIR + "/" + evaluateModel;
//        //String outputFileName = testFile + "_" + testModel;
//        String outputFileName = evaluateFile.split("\\.")[0] + "_" + evaluateModel.split("\\.")[0] + ".csv";
//        String OUTPUT_FILE = Constants.DAMAGE_EVALUATE_MODEL_RESULT_DIR + "/" + outputFileName;
//
//        String md5 = DigestUtils.md5Hex(evaluateFile + "_" + evaluateModel);
//
//        AnalysisMessage.getInstance().update(md5, evaluateFile, outputFileName, Constants.READY, "EVALUATE", null);
//        String execStr = "D:/os_environment/anaconda/python " + MODEL_EVALUATE_PROGRAM + " " + EVALUATE_FILE + " " + EVALUATE_MODEL + " " + OUTPUT_FILE;
//        //String execStr = "python D:/tmp/a.py";
//        logger.debug(execStr);
//        Executor executor = new CommandLineExecutor(md5, execStr);
//        //Scheduler.getInstance().runExecutor(executor);
//        LogEntity logentity = ((CommandLineExecutor) executor).execute_analysis();
//        if (logentity.getExitVal() == 0){
//            data.put("result", "success");
//            AnalysisMessage.getInstance().update(md5,null,null,Constants.FINISHED,null,logentity.toString());
//            try{
//                BufferedReader br = new BufferedReader(new FileReader(new File(OUTPUT_FILE)));
//                String header = br.readLine();
//                String content = br.readLine();
//                String[] metrics = content.split(",");
//                br.close();
//                data.put("precision", Float.parseFloat(metrics[0]));
//                data.put("recall", Float.parseFloat(metrics[1]));
//                data.put("f1", Float.parseFloat(metrics[2]));
//
//            }catch(FileNotFoundException e){
//                e.printStackTrace();
//            }catch (IOException e){
//                e.printStackTrace();
//            }
//
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

    @RequestMapping(value = "/damage-detection/trainfileupload", method = RequestMethod.POST)
    public JSONObject trainFileUpload(@RequestParam("dd_trainfile_upload")MultipartFile file){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        if (!file.isEmpty()){
            try{
                File targetFile = new File(Constants.DAMAGE_UPLOAD_TRAIN_FILE_DIR);
                if(!targetFile.exists()) {
                    targetFile.mkdirs();
                }
                String originFileName = file.getOriginalFilename();
                String fileName = Constants.DAMAGE_UPLOAD_TRAIN_FILE_DIR + "/" + originFileName;
                BufferedOutputStream out = new BufferedOutputStream(
                        new FileOutputStream(new File(fileName)));
                out.write(file.getBytes());
                out.flush();
                out.close();

                //合并文件
//                String mergedFilePath = Constants.DAMAGE_TRAIN_FILE_MERGED_DIR;
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

    @RequestMapping(value = "/damage-detection/testfileupload", method = RequestMethod.POST)
    public JSONObject testFileUpload(@RequestParam("dd_testfile_upload")MultipartFile file){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        if (!file.isEmpty()){
            try{
                File targetFile = new File(Constants.DAMAGE_UPLOAD_TEST_FILE_DIR);
                if(!targetFile.exists()) {
                    targetFile.mkdirs();
                }
                String originFileName = file.getOriginalFilename();
                String fileName = Constants.DAMAGE_UPLOAD_TEST_FILE_DIR + "/" + originFileName;
                BufferedOutputStream out = new BufferedOutputStream(
                        new FileOutputStream(new File( fileName)));
                out.write(file.getBytes());
                out.flush();
                out.close();

                //合并文件
//                String mergedFilePath = Constants.DAMAGE_TEST_FILE_MERGED_DIR;
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

    @RequestMapping(value = "/damage-detection/evaluatefileupload", method = RequestMethod.POST)
    public JSONObject evaluateFileUpload(@RequestParam("dd_evaluatefile_upload")MultipartFile file){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        if (!file.isEmpty()){
            try{
                File targetFile = new File(Constants.DAMAGE_UPLOAD_EVALUATE_FILE_DIR);
                if(!targetFile.exists()) {
                    targetFile.mkdirs();
                }
                String originFileName = file.getOriginalFilename();
                String fileName = Constants.DAMAGE_UPLOAD_EVALUATE_FILE_DIR + "/" + originFileName;
                BufferedOutputStream out = new BufferedOutputStream(
                        new FileOutputStream(new File( fileName)));
                out.write(file.getBytes());
                out.flush();
                out.close();

                //合并文件
//                String mergedFilePath = Constants.DAMAGE_EVALUATE_FILE_MERGED_DIR;
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

    @RequestMapping(value = "/damage-detection/trainmodelupload", method = RequestMethod.POST)
    public JSONObject trainModelUpload(@RequestParam("dd_trainmodel_upload")MultipartFile file){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        if (!file.isEmpty()){
            try{
                File targetFile = new File(Constants.DAMAGE_UPLOAD_TRAIN_MODEL_DIR);
                if(!targetFile.exists()) {
                    targetFile.mkdirs();
                }
                String originFileName = file.getOriginalFilename();
                String fileName = Constants.DAMAGE_UPLOAD_TRAIN_MODEL_DIR + "/" + originFileName;
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

    @RequestMapping(value = "/damage-detection/dropdown", method = RequestMethod.GET, produces = "application/json")
    public JSONObject dropDownList(String type){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String targetPath = "";
        switch (type){
            case "trainfile": targetPath = Constants.DAMAGE_UPLOAD_TRAIN_FILE_DIR; break;
            case "testfile" : targetPath = Constants.DAMAGE_UPLOAD_TEST_FILE_DIR; break;
            case "trainmodel" : targetPath = Constants.DAMAGE_UPLOAD_TRAIN_MODEL_DIR; break;
            case "savedmodel" : targetPath = Constants.DAMAGE_SAVE_TRAIN_MODEL_DIR; break;
            case "evaluatefile" : targetPath = Constants.DAMAGE_UPLOAD_EVALUATE_FILE_DIR; break;
            case "trainLabel" : targetPath = Constants.DAMAGE_TRAIN_LABEL_DIR;break;
            case "evaluateLabel" : targetPath = Constants.DAMAGE_EVALUATE_LABEL_DIR;break;
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

    @RequestMapping(value = "/damage-detection/trainlabelupload", method = RequestMethod.POST)
    public JSONObject trainLabelUpload(@RequestParam("dd_trainlabel_upload")MultipartFile file){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        if (!file.isEmpty()){
            try{
                File targetFile = new File(Constants.DAMAGE_TRAIN_LABEL_DIR);
                if(!targetFile.exists()) {
                    targetFile.mkdirs();
                }
                String originFileName = file.getOriginalFilename();
                String fileName = Constants.DAMAGE_TRAIN_LABEL_DIR + "/" + originFileName;
                BufferedOutputStream out = new BufferedOutputStream(
                        new FileOutputStream(new File(fileName)));
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

    @RequestMapping(value = "/damage-detection/evaluatelabelupload", method = RequestMethod.POST)
    public JSONObject evaluateLabelUpload(@RequestParam("dd_evaluatelabel_upload")MultipartFile file){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        if (!file.isEmpty()){
            try{
                File targetFile = new File(Constants.DAMAGE_EVALUATE_LABEL_DIR);
                if(!targetFile.exists()) {
                    targetFile.mkdirs();
                }
                String originFileName = file.getOriginalFilename();
                String fileName = Constants.DAMAGE_EVALUATE_LABEL_DIR + "/" + originFileName;
                BufferedOutputStream out = new BufferedOutputStream(
                        new FileOutputStream(new File(fileName)));
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

    @RequestMapping(value = "/damage-detection/udf_bridge_dropdown", method = RequestMethod.GET, produces = "application/json")
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

    @RequestMapping(value = "/damage-detection/train", method = RequestMethod.POST, produces = "application/json")
    public JSONObject udfTrainModel(@RequestBody JSONObject reqMsg){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();

        String trainfile = reqMsg.getString("trainfile");
//        String bridge = reqMsg.getString("bridge");
        String trainmodel = reqMsg.getString("trainmodel");
        String savedmodel = reqMsg.getString("savedmodel");
        String trainlabel = reqMsg.getString("trainlabel");
//        String beginTime = reqMsg.getString("begintime");
//        String endTime = reqMsg.getString("endtime");
//        long begintime = Long.parseLong(beginTime);
//        long endtime = Long.parseLong(endTime);

        //根据条件过滤数据
        File selectedFile = new File(Constants.DAMAGE_UPLOAD_TRAIN_FILE_DIR + "/" + trainfile);
        if(!selectedFile.exists()){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("找不到训练文件！");
        }else{
//            boolean startflag = false;
//            boolean endflag = false;
//            try {
////                File targetFile = new File(Constants.DAMAGE_TRAINFILE_TARGET_DIR);
////                if(!targetFile.exists()){
////                    targetFile.createNewFile();
////                }
////                FileOutputStream fos = new FileOutputStream(targetFile);
////                OutputStreamWriter osw = new OutputStreamWriter(fos,"UTF-8");
////                BufferedWriter bw = new BufferedWriter(osw);
////                bw.write("s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,location,level,bridge,time" + "\n");
////
////                FileInputStream fis = new FileInputStream(selectedFile);
////                InputStreamReader isr = new InputStreamReader(fis, "UTF-8");
////                BufferedReader br = new BufferedReader(isr);
////                String line = "";
////                int count = 0;
////                while((line = br.readLine()) != null ){
////
////                    String[] split = line.split(",");
////                    System.out.println(split.length);
////                    if(split.length == 14){
////                        String current_bridge = split[12];
////                        if(!split[13].matches("\\d+")){
////                            continue;
////                        }
////                        long current_time = Long.parseLong(split[13]);
////                        //检查已有数据是否能覆盖所选时间
//////                        if(current_time >= endtime){  endflag = true;  }
//////                        if(current_time <= begintime){   startflag = true; }
//////                        if(current_bridge.equals(bridge) && current_time >= begintime && current_time <= endtime){
//////                            bw.write(line+"\n");
//////                            count ++ ;
//////                        }
////                    }
////
////                }
////                bw.close();
////                osw.close();
////                fos.close();
////                br.close();
////                isr.close();
////                fis.close();
//
////                if(count != 0 && startflag && endflag){
////                    //调用外部程序
////                    String md5 = DigestUtils.md5Hex(trainfile + bridge + beginTime + endTime + trainmodel);
////                    String TRAIN_FILE = Constants.DAMAGE_TRAINFILE_TARGET_DIR;
////                    String MODEL_TRAIN_PROGRAM = Constants.DAMAGE_UPLOAD_TRAIN_MODEL_DIR + "/" + trainmodel;
////                    String SAVED_MODE = Constants.DAMAGE_SAVE_TRAIN_MODEL_DIR + "/" + savedmodel;
////
////                    AnalysisMessage.getInstance().update(md5, trainfile+bridge+beginTime+endTime+trainmodel, savedmodel, Constants.READY, "TRAIN", null);
////
////                    String execStr = Constants.SCRIPT_EXEC_PREFIX + " " + MODEL_TRAIN_PROGRAM + " " + TRAIN_FILE + " " + SAVED_MODE;
////                    //String execStr = "D:/os_environment/anaconda/python " + MODEL_TRAIN_PROGRAM + " " + TRAIN_FILE + " " + SAVED_MODE;
////                    //String execStr = "python D:/tmp/a.py";
////                    logger.debug(execStr);
////                    Executor executor = new CommandLineExecutor(md5, execStr);
////                    //Scheduler.getInstance().runExecutor(executor);
////                    LogEntity logentity = ((CommandLineExecutor) executor).execute_analysis();
////
////                    logger.debug("exitVal: " + logentity.getExitVal());
////                    logger.debug(logentity.toString());
////
////                    if (logentity.getExitVal() == 0){
////                        data.put("result", "success");
////                        AnalysisMessage.getInstance().update(md5,null,null,Constants.FINISHED,null,logentity.toString());
////                    }else{
////                        data.put("result", "failed");
////                        AnalysisMessage.getInstance().update(md5,null,null,Constants.FAILED,null,logentity.toString());
////                    }
////
////                    //data.put("result", "completed");
//////                    response.setData(data);
//////                    return response.getHttpResponse();
////                }else{
////                    data.put("result", "nodata");
//////                    response.setData(data);
//////                    return response.getHttpResponse();
////                }
//            }
//            catch (FileNotFoundException e) {
//                e.printStackTrace();
//                response.setStatus(HttpResponse.FAIL_STATUS);
//                response.setMsg("出错！找不到文件！");
//            } catch (UnsupportedEncodingException e) {
//                e.printStackTrace();
//                response.setStatus(HttpResponse.FAIL_STATUS);
//                response.setMsg("出错！编码有误!");
//            } catch (IOException e){
//                e.printStackTrace();
//                response.setStatus(HttpResponse.FAIL_STATUS);
//                response.setMsg("出错！IO 异常");
//            }
            //调用外部程序
            String md5 = DigestUtils.md5Hex(trainfile + trainmodel);
//                String TRAIN_FILE = Constants.DAMAGE_TRAINFILE_TARGET_DIR;
            String TRAIN_FILE = Constants.DAMAGE_UPLOAD_TRAIN_FILE_DIR + "/" + trainfile;
            String MODEL_TRAIN_PROGRAM = Constants.DAMAGE_UPLOAD_TRAIN_MODEL_DIR + "/" + trainmodel;
            String SAVED_MODE = Constants.DAMAGE_SAVE_TRAIN_MODEL_DIR;
            String TRAINLABEL = Constants.DAMAGE_TRAIN_LABEL_DIR + "/" + trainlabel;
            String TRAINIMAGE = Constants.DAMAGE_TRAIN_LOSSIMAGE;

            AnalysisMessage.getInstance().update(md5, trainfile+trainmodel, savedmodel, Constants.READY, "TRAIN", null);

//                String execStr = Constants.SCRIPT_EXEC_PREFIX + " " + MODEL_TRAIN_PROGRAM + " " + TRAIN_FILE + " " + SAVED_MODE;
            //String execStr = "D:/os_environment/anaconda/python " + MODEL_TRAIN_PROGRAM + " " + TRAIN_FILE + " " + SAVED_MODE;
            //String execStr = "python D:/tmp/a.py";
            String execStr = Constants.SCRIPT_EXEC_PREFIX + " " + MODEL_TRAIN_PROGRAM + " --task_name " + savedmodel +" --data " + TRAIN_FILE +
                    " --label " + TRAINLABEL + " --mode train --epochs 25 --batch_size 64 --save_loss_image True --loss_image_dir " +
                    TRAINIMAGE + " --save_model True --model_dir " +SAVED_MODE;
            logger.debug(execStr);
            Executor executor = new CommandLineExecutor(md5, execStr);
            //Scheduler.getInstance().runExecutor(executor);
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
        }


        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/damage-detection/evaluate", method = RequestMethod.POST, produces = "application/json")
    public JSONObject udfEvaluateModel(@RequestBody JSONObject reqMsg){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String evaluatefile = reqMsg.getString("evaluatefile");
//        String bridge = reqMsg.getString("bridge");
        String evaluatemodel = reqMsg.getString("evaluatemodel");
        String evaluateLabel = reqMsg.getString("evaluatelabel");
//        String beginTime = reqMsg.getString("begintime");
//        String endTime = reqMsg.getString("endtime");
//        long begintime = Long.parseLong(beginTime);
//        long endtime = Long.parseLong(endTime);

        //根据条件过滤数据
        File selectedFile = new File(Constants.DAMAGE_UPLOAD_EVALUATE_FILE_DIR + "/" + evaluatefile);
        if(!selectedFile.exists()){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("找不到数据！");
        }else{
            boolean startflag = false;
            boolean endflag = false;
//            try {
//                File targetFile = new File(Constants.DAMAGE_EVALUATEFILE_TARGET_DIR);
//                if(!targetFile.exists()){
//                    targetFile.createNewFile();
//                }
//                FileOutputStream fos = new FileOutputStream(targetFile);
//                OutputStreamWriter osw = new OutputStreamWriter(fos,"UTF-8");
//                BufferedWriter bw = new BufferedWriter(osw);
//                bw.write("s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,location,level,bridge,time" + "\n");
//
//                FileInputStream fis = new FileInputStream(selectedFile);
//                InputStreamReader isr = new InputStreamReader(fis, "UTF-8");
//                BufferedReader br = new BufferedReader(isr);
//                String line = "";
//                int count = 0;
//                while((line = br.readLine()) != null ){
//
//                    String[] split = line.split(",");
//                    System.out.println(split.length);
//                    if(split.length == 14){
//                        String current_bridge = split[12];
//                        if(!split[13].matches("\\d+")){
//                            continue;
//                        }
//                        long current_time = Long.parseLong(split[13]);
//                        //检查已有数据是否能覆盖所选时间
//                        if(current_time >= endtime){  endflag = true;  }
//                        if(current_time <= begintime){   startflag = true; }
//                        if(current_bridge.equals(bridge) && current_time >= begintime && current_time <= endtime){
//                            bw.write(line+"\n");
//                            count ++ ;
//                        }
//                    }
//
//                }
//                bw.close();
//                osw.close();
//                fos.close();
//                br.close();
//                isr.close();
//                fis.close();
//
//                if(count != 0 && startflag && endflag){
//                    //调用外部程序
//                    String md5 = DigestUtils.md5Hex(evaluatefile + bridge + beginTime + endTime + evaluatemodel);
//                    String EVALUATE_FILE = Constants.DAMAGE_EVALUATEFILE_TARGET_DIR;
//                    String MODEL_EVALUATE_PROGRAM = Constants.DAMAGE_EVALUATE_MODEL_PROGRAM;
//                    String EVALUATE_MODEL = Constants.DAMAGE_SAVE_TRAIN_MODEL_DIR + "/" + evaluatemodel;
//                    String outputFileName = evaluatefile + "_" + bridge +"_" + beginTime + "_" + endTime + "_" + evaluatemodel.split("\\.")[0] + ".csv";
//                    String OUTPUT_FILE = Constants.DAMAGE_EVALUATE_MODEL_RESULT_DIR + "/" + outputFileName;
//
//                    AnalysisMessage.getInstance().update(md5, evaluatefile+bridge+beginTime+endTime+evaluatemodel, outputFileName, Constants.READY, "EVALUATE", null);
//                    String execStr = Constants.SCRIPT_EXEC_PREFIX + " " + MODEL_EVALUATE_PROGRAM + " " + EVALUATE_FILE + " " + EVALUATE_MODEL + " " + OUTPUT_FILE;
//                    //String execStr = "D:/os_environment/anaconda/python " + MODEL_EVALUATE_PROGRAM + " " + EVALUATE_FILE + " " + EVALUATE_MODEL + " " + OUTPUT_FILE;
//                    //String execStr = "python D:/tmp/a.py";
//                    logger.debug(execStr);
//                    Executor executor = new CommandLineExecutor(md5, execStr);
//                    //Scheduler.getInstance().runExecutor(executor);
//                    LogEntity logentity = ((CommandLineExecutor) executor).execute_analysis();
//
//                    logger.debug("exitVal: " + logentity.getExitVal());
//                    logger.debug(logentity.toString());
//
//                    if (logentity.getExitVal() == 0){
//                        data.put("result", "success");
//                        AnalysisMessage.getInstance().update(md5,null,null,Constants.FINISHED,null,logentity.toString());
//                        try{
//                            BufferedReader br1 = new BufferedReader(new FileReader(new File(OUTPUT_FILE)));
//                            String header = br1.readLine();
//                            String content = br1.readLine();
//                            String[] metrics = content.split(",");
//                            br.close();
//                            data.put("precision", Float.parseFloat(metrics[0]));
//                            data.put("recall", Float.parseFloat(metrics[1]));
//                            data.put("f1", Float.parseFloat(metrics[2]));
//
//                        }catch(FileNotFoundException e){
//                            e.printStackTrace();
//                        }catch (IOException e){
//                            e.printStackTrace();
//                        }
//
//                    }else{
//                        data.put("result", "failed");
//                        AnalysisMessage.getInstance().update(md5,null,null,Constants.FAILED,null,logentity.toString());
//                    }
//
//                    //data.put("result", "completed");
////                    response.setData(data);
////                    return response.getHttpResponse();
//                }else{
//                    data.put("result", "nodata");
////                    response.setData(data);
////                    return response.getHttpResponse();
//                }
//
//
//
//
//            } catch (FileNotFoundException e) {
//                e.printStackTrace();
//                response.setStatus(HttpResponse.FAIL_STATUS);
//                response.setMsg("出错！找不到文件！");
//            } catch (UnsupportedEncodingException e) {
//                e.printStackTrace();
//                response.setStatus(HttpResponse.FAIL_STATUS);
//                response.setMsg("出错！编码有误!");
//            } catch (IOException e){
//                e.printStackTrace();
//                response.setStatus(HttpResponse.FAIL_STATUS);
//                response.setMsg("出错！IO 异常");
//            }

            String md5 = DigestUtils.md5Hex(evaluatefile + evaluatemodel + evaluateLabel);
            String EVALUATE_FILE = Constants.DAMAGE_EVALUATEFILE_TARGET_DIR;
            String MODEL_EVALUATE_PROGRAM = Constants.DAMAGE_EVALUATE_MODEL_PROGRAM;
            String EVALUATE_MODEL = Constants.DAMAGE_SAVE_TRAIN_MODEL_DIR + "/" + evaluatemodel;
            String EVALUATE_LABEL = Constants.DAMAGE_EVALUATE_LABEL_DIR + "/" + evaluateLabel;
            String outputFileName = evaluatefile.split("\\.")[0] + "_" + evaluatemodel.split("\\.")[0] + ".csv";
            String OUTPUT_FILE = Constants.DAMAGE_EVALUATE_MODEL_RESULT_DIR + "/" + outputFileName;

            AnalysisMessage.getInstance().update(md5, evaluatefile+evaluatemodel, outputFileName, Constants.READY, "EVALUATE", null);

            String execStr = Constants.SCRIPT_EXEC_PREFIX + " " + MODEL_EVALUATE_PROGRAM + " --data " + EVALUATE_FILE + " --mode evaluate --model " + EVALUATE_MODEL
                    + " --label " + EVALUATE_LABEL + " --res_dir " + OUTPUT_FILE;
            //String execStr = "D:/os_environment/anaconda/python " + MODEL_EVALUATE_PROGRAM + " " + EVALUATE_FILE + " " + EVALUATE_MODEL + " " + OUTPUT_FILE;
            //String execStr = "python D:/tmp/a.py";
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
                    br1.close();
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
        }


        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/damage-detection/test", method = RequestMethod.POST, produces = "application/json")
    public JSONObject UdfTestModel(@RequestBody JSONObject reqMsg){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String testfile = reqMsg.getString("testfile");
//        String bridge = reqMsg.getString("bridge");
        String testmodel = reqMsg.getString("testmodel");
//        String beginTime = reqMsg.getString("begintime");
//        String endTime = reqMsg.getString("endtime");
//        long begintime = Long.parseLong(beginTime);
//        long endtime = Long.parseLong(endTime);

        //根据条件过滤数据
        File selectedFile = new File(Constants.DAMAGE_UPLOAD_TEST_FILE_DIR + "/" + testfile);
        if(!selectedFile.exists()){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("找不到预测数据！");
        }else{
//            boolean startflag = false;
//            boolean endflag = false;
//            try {
//                File targetFile = new File(Constants.DAMAGE_TESTFILE_TARGET_DIR);
//                if(!targetFile.exists()){
//                    targetFile.createNewFile();
//                }
//                FileOutputStream fos = new FileOutputStream(targetFile);
//                OutputStreamWriter osw = new OutputStreamWriter(fos, "UTF-8");
//                BufferedWriter bw = new BufferedWriter(osw);
//                bw.write("s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,location,level,bridge,time" + "\n");
//
//                FileInputStream fis = new FileInputStream(selectedFile);
//                InputStreamReader isr = new InputStreamReader(fis, "UTF-8");
//                BufferedReader br = new BufferedReader(isr);
//                String line = "";
//                int count = 0;
//                while((line = br.readLine()) != null ){
//
//                    String[] split = line.split(",");
//                    System.out.println(split.length);
//                    if(split.length == 14){
//                        String current_bridge = split[12];
//                        if(!split[13].matches("\\d+")){
//                            continue;
//                        }
//                        long current_time = Long.parseLong(split[13]);
//                        //检查已有数据是否能覆盖所选时间
//                        if(current_time >= endtime){  endflag = true;  }
//                        if(current_time <= begintime){   startflag = true; }
//                        if(current_bridge.equals(bridge) && current_time >= begintime && current_time <= endtime){
//                            bw.write(line+"\n");
//                            count ++ ;
//                        }
//                    }
//                }
//                bw.close();
//                osw.close();
//                fos.close();
//                br.close();
//                isr.close();
//                fis.close();
//
//                if(count != 0 && startflag && endflag){
//                    //调用外部程序
//                    String TEST_FILE = Constants.DAMAGE_TESTFILE_TARGET_DIR;
//                    String MODEL_TEST_PROGRAM = Constants.DAMAGE_PREDICT_PROGRAM;
//                    String TEST_MODEL = Constants.DAMAGE_SAVE_TRAIN_MODEL_DIR + "/" + testmodel;
//                    String outputFileName = testfile + "_" + bridge + "_" + beginTime + "_" + endTime + "_"+ testmodel.split("\\.")[0] + ".csv";
//                    String OUTPUT_FILE = Constants.DAMAGE_PREDICT_FILE_DIR + "/" + outputFileName;
//                    String md5 = DigestUtils.md5Hex(testfile + bridge + beginTime + endTime + testmodel);
//
//                    AnalysisMessage.getInstance().update(md5, testfile+bridge+beginTime+endTime+testmodel, outputFileName, Constants.READY, "TEST",null);
//                    String execStr = Constants.SCRIPT_EXEC_PREFIX + " " + MODEL_TEST_PROGRAM + " " + TEST_FILE + " " + TEST_MODEL + " " + OUTPUT_FILE;
//                    //String execStr = "D:/os_environment/anaconda/python " + MODEL_TEST_PROGRAM + " " + TEST_FILE + " " + TEST_MODEL + " " + OUTPUT_FILE;
//                    //String execStr = "python D:/tmp/a.py";
//                    logger.debug(execStr);
//                    Executor executor = new CommandLineExecutor(md5, execStr);
//                    //Scheduler.getInstance().runExecutor(executor);
//                    LogEntity logentity = ((CommandLineExecutor) executor).execute_analysis();
//                    if (logentity.getExitVal() == 0){
//                        data.put("result", "success");
//                        AnalysisMessage.getInstance().update(md5,null,null,Constants.FINISHED,null,logentity.toString());
//                    }else{
//                        data.put("result", "failed");
//                        AnalysisMessage.getInstance().update(md5,null,null,Constants.FAILED,null,logentity.toString());
//                    }
//
//                }else{
//                    data.put("result","nodata");
//                }
//            }catch (FileNotFoundException e) {
//                e.printStackTrace();
//                response.setStatus(HttpResponse.FAIL_STATUS);
//                response.setMsg("出错！找不到文件！");
//            } catch (UnsupportedEncodingException e) {
//                e.printStackTrace();
//                response.setStatus(HttpResponse.FAIL_STATUS);
//                response.setMsg("出错！编码有误!");
//            } catch (IOException e) {
//                e.printStackTrace();
//                response.setMsg("出错！IO 异常");
//            }
            //调用外部程序
            String TEST_FILE = Constants.DAMAGE_TESTFILE_TARGET_DIR;
            String MODEL_TEST_PROGRAM = Constants.DAMAGE_PREDICT_PROGRAM;
            String TEST_MODEL = Constants.DAMAGE_SAVE_TRAIN_MODEL_DIR + "/" + testmodel;
            String outputFileName = testfile.split("\\.")[0] + "_" + testmodel.split("\\.")[0] + ".csv";
            String OUTPUT_FILE = Constants.DAMAGE_PREDICT_FILE_DIR + "/" + outputFileName;
            String md5 = DigestUtils.md5Hex(testfile + testmodel);

            AnalysisMessage.getInstance().update(md5, testfile+testmodel, outputFileName, Constants.READY, "TEST",null);
            String execStr = Constants.SCRIPT_EXEC_PREFIX + " " + MODEL_TEST_PROGRAM + " --data " + TEST_FILE + " --mode test" + " --model " + TEST_MODEL + " --res_dir " + OUTPUT_FILE;
            //String execStr = "D:/os_environment/anaconda/python " + MODEL_TEST_PROGRAM + " " + TEST_FILE + " " + TEST_MODEL + " " + OUTPUT_FILE;
            //String execStr = "python D:/tmp/a.py";
            logger.debug(execStr);
            Executor executor = new CommandLineExecutor(md5, execStr);
            //Scheduler.getInstance().runExecutor(executor);
            LogEntity logentity = ((CommandLineExecutor) executor).execute_analysis();
            if (logentity.getExitVal() == 0 || logentity.getExitVal() == 0){
                data.put("result", "success");
                AnalysisMessage.getInstance().update(md5,null,null,Constants.FINISHED,null,logentity.toString());
            }else{
                data.put("result", "failed");
                AnalysisMessage.getInstance().update(md5,null,null,Constants.FAILED,null,logentity.toString());
            }
        }
        response.setData(data);
        return response.getHttpResponse();

    }
}

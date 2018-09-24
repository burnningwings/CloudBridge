package scut.controller;

import com.alibaba.fastjson.JSONObject;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import scut.base.HttpResponse;
import scut.service.scheduler.AnalysisMessage;
import scut.service.scheduler.LogEntity;
import scut.service.scheduler.Message;
import scut.service.scheduler.Scheduler;
import scut.service.scheduler.executor.CommandLineExecutor;
import scut.service.scheduler.executor.Executor;
import scut.util.Constants;

import java.io.*;
import java.util.ArrayList;

/**
 * Created by Xiaoah on 2018/9/13
 */
@RestController
public class OverweightAnalysis {
    public static Logger logger = Logger.getLogger(OverweightAnalysis.class);

    @RequestMapping(value = "/overweight-analysis/getPredictResult", method = RequestMethod.GET, produces = "application/json")
    public JSONObject getPredictResult(String testfile, String testmodel){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String targetFileName = testfile.split("\\.")[0] + "_" + testmodel.split("\\.")[0] + ".csv";
        String targetPath =  Constants.OVERWEIGHT_PREDICT_FILE_DIR + "/" + targetFileName;
        System.out.println(testfile);
        System.out.println(testmodel);
        System.out.println(targetPath);
        File file = new File(targetPath);

        if(!file.exists()){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("预测结果不存在！");
        }else{
            try {
                FileReader fr = new FileReader(file);
                BufferedReader br = new BufferedReader(fr);
                ArrayList<Integer> prelist = new ArrayList<Integer>();
                String header = br.readLine();
                String content = br.readLine();
                while (content != null){
                    String result = content.split(",")[content.split(",").length-1];
                    int resultID = Integer.valueOf(result);
                    prelist.add(resultID);
                    content = br.readLine();
                }
                br.close();
                fr.close();
                data.put("predictresult", prelist);
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e){
                e.printStackTrace();
            }
        }
        response.setData(data);
        return response.getHttpResponse();

    }

    @RequestMapping(value = "/overweight-analysis/train", method = RequestMethod.POST, produces = "application/json")
    public JSONObject trainModel(@RequestBody JSONObject reqMsg){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();

        String trainFile = reqMsg.getString("trainfile");
        String trainModel = reqMsg.getString("trainmodel");
        String savedModel = reqMsg.getString("savedmodel");
        String md5 = DigestUtils.md5Hex(trainFile + "_" + trainModel);

        String TRAIN_FILE = Constants.OVERWEIGHT_UPLOAD_TRAIN_FILE_DIR + "/" + trainFile;
        String MODEL_TRAIN_PROGRAM = Constants.OVERWEIGHT_UPLOAD_TRAIN_MODEL_DIR + "/" + trainModel;
        String SAVED_MODE = Constants.OVERWEIGHT_SAVE_TRAIN_MODEL_DIR + "/" + savedModel;

        AnalysisMessage.getInstance().update(md5, trainFile, savedModel, Constants.READY, "TRAIN", null);
        //注意，这里要用绝对路径
        String execStr = "D:/os_environment/anaconda/python " + MODEL_TRAIN_PROGRAM + " " + TRAIN_FILE + " " + SAVED_MODE;
        //String execStr = "python D:/tmp/a.py";
        logger.debug(execStr);
        Executor executor = new CommandLineExecutor(md5, execStr);
        //Scheduler.getInstance().runExecutor(executor);
        LogEntity logentity = ((CommandLineExecutor) executor).execute_analysis();

        logger.debug("exitVal: " + logentity.getExitVal());
        logger.debug(logentity.toString());

        if (logentity.getExitVal() == 0){
            data.put("result", "success");
            AnalysisMessage.getInstance().update(md5,null,null,Constants.FINISHED,null,logentity.toString());
        }else{
            data.put("result", "failed");
            AnalysisMessage.getInstance().update(md5,null,null,Constants.FAILED,null,logentity.toString());
        }

        //data.put("result", "completed");
        response.setData(data);
        return response.getHttpResponse();
    }
    @RequestMapping(value = "/overweight-analysis/test", method = RequestMethod.POST, produces = "application/json")
    public JSONObject test(@RequestBody JSONObject reqMsg){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();

        String testFile = reqMsg.getString("testfile");
        String testModel = reqMsg.getString("testmodel");

        System.out.println(testFile);
        System.out.println(testModel);

        String TEST_FILE = Constants.OVERWEIGHT_UPLOAD_TEST_FILE_DIR + "/" + testFile;
        String MODEL_TEST_PROGRAM = Constants.TEST_MODEL_PROGRAM;
        String TEST_MODE = Constants.OVERWEIGHT_SAVE_TRAIN_MODEL_DIR + "/" + testModel;
        //String outputFileName = testFile + "_" + testModel;
        String outputFileName = testFile.split("\\.")[0] + "_" + testModel.split("\\.")[0] + ".csv";
        String OUTPUT_FILE = Constants.OVERWEIGHT_PREDICT_FILE_DIR + "/" + outputFileName;

        String md5 = DigestUtils.md5Hex(testFile + "_" + testModel);

        AnalysisMessage.getInstance().update(md5, testFile, outputFileName, Constants.READY, "TEST", null);
        String execStr = "D:/os_environment/anaconda/python " + MODEL_TEST_PROGRAM + " " + TEST_FILE + " " + TEST_MODE + " " + OUTPUT_FILE;
        //String execStr = "python D:/tmp/a.py";
        logger.debug(execStr);
        Executor executor = new CommandLineExecutor(md5, execStr);
        //Scheduler.getInstance().runExecutor(executor);
        LogEntity logentity = ((CommandLineExecutor) executor).execute_analysis();
        if (logentity.getExitVal() == 0){
            data.put("result", "success");
            AnalysisMessage.getInstance().update(md5,null,null,Constants.FINISHED,null,logentity.toString());
        }else{
            data.put("result", "failed");
            AnalysisMessage.getInstance().update(md5,null,null,Constants.FAILED,null,logentity.toString());
        }

        //data.put("result", "completed");
        response.setData(data);
        return response.getHttpResponse();

    }

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
}

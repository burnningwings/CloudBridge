package scut.controller;

import com.alibaba.fastjson.JSONObject;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.log4j.Logger;
import org.apache.tomcat.util.bcel.Const;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import scut.base.HttpResponse;
import scut.service.scheduler.AnalysisMessage;
import scut.service.scheduler.LogEntity;
import scut.service.scheduler.executor.CommandLineExecutor;
import scut.service.scheduler.executor.Executor;
import scut.util.Constants;

import java.io.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * created by xiaoah
 * 2018/09/25
 */
@RestController
public class AssociationAnalysis {
    public static Logger logger = Logger.getLogger(AssociationAnalysis.class);

    @RequestMapping(value = "/association-analysis/dropdown", method = RequestMethod.GET, produces = "application/json")
    public JSONObject dropDownList(String type){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String targetPath = "";
        switch (type){
//            case "trainfile": targetPath = Constants.DAMAGE_UPLOAD_TRAIN_FILE_DIR; break;
//            case "testfile" : targetPath = Constants.DAMAGE_UPLOAD_TEST_FILE_DIR; break;
//            case "trainmodel" : targetPath = Constants.DAMAGE_UPLOAD_TRAIN_MODEL_DIR; break;
//            case "savedmodel" : targetPath = Constants.DAMAGE_SAVE_TRAIN_MODEL_DIR; break;
            case "associationfile" : targetPath = Constants.ASSOCIATION_FILE_DIR; break;
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

    @RequestMapping(value = "/association_analysis/associationFileUpload", method = RequestMethod.POST)
    public JSONObject associationFileUpload(@RequestParam("association_file_upload")MultipartFile file){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        if (!file.isEmpty()){
            try{
                File targetFile = new File(Constants.ASSOCIATION_FILE_DIR);
                if(!targetFile.exists()) {
                    targetFile.mkdirs();
                }
                String originFileName = file.getOriginalFilename();
                String fileName = Constants.ASSOCIATION_FILE_DIR + "/" + originFileName;
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

    @RequestMapping(value = "/association-analysis/start-analysis", method = RequestMethod.POST, produces = "application/json")
    public JSONObject trainModel(@RequestBody JSONObject reqMsg){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();

        String associationFile = reqMsg.getString("associationfile");

        String md5 = DigestUtils.md5Hex(associationFile);

        String ASSOCIATION_FILE = Constants.ASSOCIATION_FILE_DIR + "/" + associationFile;
        String ASSOCIATION_ANALYSIS_PROGRAM = Constants.ASSOCIATION_ANALYSIS_PROGRAM ;
        String resutlFileName = associationFile.split("\\.")[0] + "_result.csv";
        String ASSOCIATION_ANALYSIS_RESULT = Constants.ASSOCIATION_ANALYSIS_RESULT_DIR + "/" + resutlFileName;
        System.out.println(ASSOCIATION_FILE);
        System.out.println(ASSOCIATION_ANALYSIS_PROGRAM);
        System.out.println(ASSOCIATION_ANALYSIS_RESULT);

        AnalysisMessage.getInstance().update(md5, associationFile, resutlFileName, Constants.READY, "ANALYSIS", null);
        //注意，这里要用绝对路径
        String execStr = "D:/os_environment/anaconda/python " + ASSOCIATION_ANALYSIS_PROGRAM + " " + ASSOCIATION_FILE + " " + ASSOCIATION_ANALYSIS_RESULT;
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

//    @RequestMapping(value = "/association-analysis/getAnalysisResult", method = RequestMethod.GET, produces = "application/json")
//    public JSONObject getAnalysisResult(String associationfile){
//        HttpResponse response = new HttpResponse();
//        JSONObject data = new JSONObject();
//        String associationfilePath = Constants.ASSOCIATION_FILE_DIR + "/" + associationfile;
//        String analysisResultPath = Constants.ASSOCIATION_ANALYSIS_RESULT_DIR + "/" + associationfile.split("\\.")[0] + "_result.csv";
//        System.out.println(associationfilePath);
//        System.out.println(analysisResultPath);
//
//        File file = new File(associationfilePath);
//        if(!file.exists()){
//            response.setStatus(HttpResponse.FAIL_STATUS);
//            response.setMsg("关联文件不存在！");
//        }else{
//            try {
//                FileReader fr = new FileReader(associationfilePath);
//                BufferedReader br = new BufferedReader(fr);
//                ArrayList<Object> sensor1list = new ArrayList<>();
//                ArrayList<Object> sensor2list = new ArrayList<>();
////                ArrayList<Object> sensor3list = new ArrayList<>();
////                ArrayList<Object> sensor4list = new ArrayList<>();
////                ArrayList<Object> sensor5list = new ArrayList<>();
////                ArrayList<Object> sensor6list = new ArrayList<>();
////                ArrayList<Object> sensor7list = new ArrayList<>();
////                ArrayList<Object> sensor8list = new ArrayList<>();
////                ArrayList<Object> sensor9list = new ArrayList<>();
////                ArrayList<Object> sensor10list = new ArrayList<>();
//
//
//                //String[] header = br.readLine().split(",");
//                String header = br.readLine();
//                String content = br.readLine();
//                while(content != null){
//                    String[] split = content.split(",");
//
//                    float sensor1[] = {Float.parseFloat(split[split.length-1]), Float.parseFloat(split[0])};
//                    float sensor2[] = {Float.parseFloat(split[split.length-1]), Float.parseFloat(split[1])};
////                    float sensor3[] = {Float.parseFloat(split[split.length-1]), Float.parseFloat(split[2])};
////                    float sensor4[] = {Float.parseFloat(split[split.length-1]), Float.parseFloat(split[3])};
////                    float sensor5[] = {Float.parseFloat(split[split.length-1]), Float.parseFloat(split[4])};
////                    float sensor6[] = {Float.parseFloat(split[split.length-1]), Float.parseFloat(split[5])};
////                    float sensor7[] = {Float.parseFloat(split[split.length-1]), Float.parseFloat(split[6])};
////                    float sensor8[] = {Float.parseFloat(split[split.length-1]), Float.parseFloat(split[7])};
////                    float sensor9[] = {Float.parseFloat(split[split.length-1]), Float.parseFloat(split[8])};
////                    float sensor10[] = {Float.parseFloat(split[split.length-1]), Float.parseFloat(split[9])};
//                    sensor1list.add(sensor1);
//                    sensor2list.add(sensor2);
////                    sensor3list.add(sensor1);
////                    sensor4list.add(sensor2);
////                    sensor5list.add(sensor1);
////                    sensor6list.add(sensor2);
////                    sensor7list.add(sensor1);
////                    sensor8list.add(sensor2);
////                    sensor9list.add(sensor1);
////                    sensor10list.add(sensor2);
//                    content = br.readLine();
//                }
//                br.close();
//                fr.close();
//                data.put("sensor1", sensor1list);
//                data.put("sensor2", sensor2list);
////                data.put("sensor3", sensor3list);
////                data.put("sensor4", sensor4list);
////                data.put("sensor5", sensor5list);
////                data.put("sensor6", sensor6list);
////                data.put("sensor7", sensor7list);
////                data.put("sensor8", sensor8list);
////                data.put("sensor9", sensor9list);
////                data.put("sensor10", sensor10list);
//            } catch (FileNotFoundException e) {
//                e.printStackTrace();
//            } catch (IOException e){
//                e.printStackTrace();
//            }
//        }
//
//        response.setData(data);
//        return response.getHttpResponse();
//    }

    @RequestMapping(value = "/association-analysis/getAnalysisResult", method = RequestMethod.GET, produces = "application/json")
    public JSONObject getAnalysisResult1(String associationfile){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String associationfilePath = Constants.ASSOCIATION_FILE_DIR + "/" + associationfile;
        String analysisResultPath = Constants.ASSOCIATION_ANALYSIS_RESULT_DIR + "/" + associationfile.split("\\.")[0] + "_result.csv";
        System.out.println(associationfilePath);
        System.out.println(analysisResultPath);

        //结果文件
        String resutlFileName = associationfile.split("\\.")[0] + "_result.csv";
        String resultFilePath = Constants.ASSOCIATION_ANALYSIS_RESULT_DIR + "/" + resutlFileName;
        File resultfile = new File(resultFilePath);
        File file = new File(associationfilePath);
        if(!file.exists()){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("关联文件不存在！");
        }else if(!resultfile.exists())
        {
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("关联分析结果文件不存在");
        }else{
            try {
                FileReader fr = new FileReader(associationfilePath);
                BufferedReader br = new BufferedReader(fr);
//                ArrayList<Object> sensor1list = new ArrayList<>();
//                ArrayList<Object> sensor2list = new ArrayList<>();

                String[] header = br.readLine().split(",");
                Map<Integer, ArrayList> sensorMap = new HashMap<Integer, ArrayList>();
                Map<Integer, ArrayList> sensorMap1 = new HashMap<Integer, ArrayList>();
                for(int i = 0; i < header.length - 2; i++){
                    sensorMap.put(i, new ArrayList());
                    sensorMap1.put(i, new ArrayList());
                }
                //String header = br.readLine();
                String content = br.readLine();
                while(content != null){
                    String[] split = content.split(",");
                    for(int i =0; i < split.length - 2; i++){
                        float sensor[] = {Float.parseFloat(split[split.length-1]), Float.parseFloat(split[i])};
                        sensorMap.get(i).add(sensor);
                        float sensor1[] = {Float.parseFloat(split[split.length-2]), Float.parseFloat(split[i])};
                        sensorMap1.get(i).add(sensor1);
                    }
                    content = br.readLine();
                }
                br.close();
                fr.close();
                data.put("temp1", sensorMap);
                data.put("temp2", sensorMap1);

                //处理结果文件
                FileReader fr1 = new FileReader(resultFilePath);
                BufferedReader br1 = new BufferedReader(fr1);
                ArrayList<Object> resultlist = new ArrayList<>();
                String resultHeader = br1.readLine();
                String resultContent = br1.readLine();
                while(resultContent != null){
                    String[] resultRecord = resultContent.split(",");
                    System.out.println(resultRecord);
                    resultlist.add(resultRecord);
                    resultContent = br1.readLine();
                }
                br1.close();
                fr1.close();
                data.put("analysisresult", resultlist);

            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e){
                e.printStackTrace();
            }
}

        response.setData(data);
        return response.getHttpResponse();
    }

}

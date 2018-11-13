package scut.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.log4j.Logger;
import org.apache.tomcat.util.bcel.Const;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import scut.base.HttpResponse;
import scut.service.SysUserService;
import scut.service.scheduler.AnalysisMessage;
import scut.service.scheduler.LogEntity;
import scut.service.scheduler.executor.CommandLineExecutor;
import scut.service.scheduler.executor.Executor;
import scut.util.Constants;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import javax.annotation.Resource;
import java.io.*;

import java.sql.ResultSet;
import java.sql.SQLException;
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
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT,Constants.MYSQL_URL,Constants.MYSQL_USERNAME,Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

    @Resource
    SysUserService sysUserService;

    @RequestMapping(value = "/association-analysis/updtate_bridgedroplist")
    public JSONObject updateBridgeDownList(String bridge_id){
        long userOrganizationId = sysUserService.getUserOrganizationId();
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String sql = String.format("select b.bridge_id,b.bridge_name from bridge_info b " +
                "where b.bridge_id in (" +
                "select bo.bridge_id from bridge_organization bo " +
                "where bo.organization_id = %d)", userOrganizationId);
        try{
            baseDao.querySingleObject(sql, new ResultSetHandler<String>() {
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    JSONObject item = new JSONObject();
                    String firstId = bridge_id;
                    while(rs.next()){
                        if(firstId.equalsIgnoreCase("all")) firstId = rs.getString("bridge_id");
                        item.put(rs.getString("bridge_id"), rs.getString("bridge_name"));
                    }
                    data.put("bridge_id", firstId);
                    data.put("bridge", item);
                    return null;
                }
            });
        }catch (SQLException e){
            e.printStackTrace();
        }
        if(data.size() > 0 && !data.get("bridge_id").equals("")){
            sql = "select a.section_id, a.name as section_name , b.point_id, b.name as point_name " +
                    "from section as a left join watch_point as b on a.section_id=b.section_id " +
                    "where a.bridge_id='%s'" +
                    "and a.bridge_id in (" +
                    "select bo.bridge_id from bridge_organization bo " +
                    "where bo.organization_id = " + userOrganizationId + ")";

                try {
                    baseDao.querySingleObject(String.format(sql, data.get("bridge_id")),
                            new ResultSetHandler<String>() {
                                @Override
                                public String handle(ResultSet rs) throws SQLException {
                                    JSONObject bridgeItem = new JSONObject();
                                    while(rs.next()){
                                        String sectionId = rs.getString("section_id");
                                        JSONObject sectionItem = (JSONObject) bridgeItem.getOrDefault(sectionId, new JSONObject());
                                        JSONObject pointItem = (JSONObject) sectionItem.getOrDefault("watchpoint", new JSONObject());
                                        sectionItem.put("name", rs.getString("section_name"));
                                        String pointId = rs.getString("point_id");
                                        if(pointId  != null){
                                            pointItem.put(pointId, rs.getString("point_name"));
                                        }
                                        sectionItem.put("watchpoint", pointItem);
                                        bridgeItem.put(sectionId, sectionItem);
                                    }
                                    data.put("bridge_detail", bridgeItem);
                                    return null;
                                }
                            });
                } catch (SQLException e) {
                    e.printStackTrace();
                }
        }
        response.setData(data);
        return response.getHttpResponse();
    }

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
    public JSONObject waveletAnalysis(@RequestBody JSONObject reqMsg){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String associationFile = reqMsg.getString("associationfile");
        String bridge = reqMsg.getString("bridge");
        String section = reqMsg.getString("section");
        String watchpoint = reqMsg.getString("watchpoint");
        String beginTime = reqMsg.getString("begintime");
        String endTime = reqMsg.getString("endtime");
        System.out.println(bridge);
        System.out.println(section);
        System.out.println(watchpoint);
        long begintime = Long.parseLong(beginTime);
        long endtime = Long.parseLong(endTime);

        //根据条件过滤数据
        File selectedFile = new File(Constants.ASSOCIATION_FILE_DIR + "/" + associationFile);
        if(!selectedFile.exists()){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("找不到文件！");
        }else{
            boolean startflag = false;
            boolean endflag = false;
            try {
                File targetFile = new File(Constants.ASSOCIATION_TARGET_DIR);
                if(!targetFile.exists()){
                    targetFile.createNewFile();
                }
                FileOutputStream fos = new FileOutputStream(targetFile);
                OutputStreamWriter osw = new OutputStreamWriter(fos, "UTF-8");
                BufferedWriter bw = new BufferedWriter(osw);
                bw.write("time,bridge,section,test_point,unknow1,通道,传感器编号,measure_strain,unknow2,单位1,数据2,单位2,电阻值,T,unknow3,S" + "\n");

                FileInputStream fis = new FileInputStream(selectedFile);
                InputStreamReader isr = new InputStreamReader(fis, "UTF-8");
                BufferedReader br = new BufferedReader(isr);
                String line = "";
                int count = 0;
                while((line = br.readLine()) != null){
                    String[] split = line.split(",");
                    System.out.println(split.length);
                    if(split.length == 16){
                        if(!split[0].matches("\\d+")){
                            continue;
                        }
                        long current_time = Long.parseLong(split[0]);
                        String current_bridge = split[1];
                        String current_section = split[2];
                        String current_watechpoint = split[3];
                        System.out.println(current_bridge);
                        System.out.println(current_section);
                        System.out.println(current_watechpoint);
                        //检查已有数据是否能覆盖所选时间
                        if(current_time >= endtime){  endflag = true;  }
                        if(current_time <= begintime){   startflag = true; }
                        if(current_bridge.equals(bridge) && current_section.equals(section) && current_watechpoint.equals(watchpoint) && current_time >= begintime && current_time <= endtime){
                            System.out.println("ok");
                            bw.write(line + "\n");
                            count ++;
                        }
                    }
                }
                bw.close();
                osw.close();
                fos.close();
                br.close();
                isr.close();
                fis.close();

                //调用外部程序
                if(count != 0 && startflag && endflag){
                    String INPUT_FILE = Constants.ASSOCIATION_TARGET_DIR;
                    String WAVELET_PROGRAM = Constants.ASSOCIATION_ANALYSIS_PROGRAM;
                    String outputfileName = bridge + "_" + section + "_" + watchpoint + "_" + beginTime + "_" + endTime + "_result" + ".csv";
                    String OUTPUT_FILE = Constants.ASSOCIATION_ANALYSIS_RESULT_DIR + "/" + outputfileName;
                    String md5 = DigestUtils.md5Hex(associationFile + beginTime + endTime);

                    AnalysisMessage.getInstance().update(md5, bridge + "_" + section + "_" + watchpoint + "_" + beginTime + "_" + endTime,outputfileName, Constants.READY, "WAVELET",null);
                    String execStr = Constants.SCRIPT_EXEC_PREFIX + " " + WAVELET_PROGRAM + " " + INPUT_FILE + " " + OUTPUT_FILE;
                    //String execStr = "D:/os_environment/anaconda/python " + WAVELET_PROGRAM + " " + INPUT_FILE + " " + OUTPUT_FILE;
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
                }else{
                    data.put("result","nodata");
                }

            }catch (IOException e) {
                e.printStackTrace();
            }
        }
        response.setData(data);
        return response.getHttpResponse();
    }

//    @RequestMapping(value = "/association-analysis/start-analysis", method = RequestMethod.POST, produces = "application/json")
//    public JSONObject trainModel(@RequestBody JSONObject reqMsg){
//        HttpResponse response = new HttpResponse();
//        JSONObject data = new JSONObject();
//
//        String associationFile = reqMsg.getString("associationfile");
//
//        String md5 = DigestUtils.md5Hex(associationFile);
//
//        String ASSOCIATION_FILE = Constants.ASSOCIATION_FILE_DIR + "/" + associationFile;
//        String ASSOCIATION_ANALYSIS_PROGRAM = Constants.ASSOCIATION_ANALYSIS_PROGRAM ;
//        String resutlFileName = associationFile.split("\\.")[0] + "_result.csv";
//        String ASSOCIATION_ANALYSIS_RESULT = Constants.ASSOCIATION_ANALYSIS_RESULT_DIR + "/" + resutlFileName;
//        System.out.println(ASSOCIATION_FILE);
//        System.out.println(ASSOCIATION_ANALYSIS_PROGRAM);
//        System.out.println(ASSOCIATION_ANALYSIS_RESULT);
//
//        AnalysisMessage.getInstance().update(md5, associationFile, resutlFileName, Constants.READY, "ANALYSIS", null);
//        //注意，这里要用绝对路径
//        String execStr = "D:/os_environment/anaconda/python " + ASSOCIATION_ANALYSIS_PROGRAM + " " + ASSOCIATION_FILE + " " + ASSOCIATION_ANALYSIS_RESULT;
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
    public JSONObject getAnalysisResult1(String bridge, String section, String watchpoint, String begintime, String endtime){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String resultfileName = bridge + "_" + section + "_" + watchpoint + "_" + begintime + "_" + endtime + "_result" + ".csv";
        String analysisResultPath =Constants.ASSOCIATION_ANALYSIS_RESULT_DIR + "/" + resultfileName;
        System.out.println(analysisResultPath);
        File file = new File(analysisResultPath);
        if(!file.exists()){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("结果不存在");
        }else {
            try {
                FileReader fr = new FileReader(analysisResultPath);
                BufferedReader br = new BufferedReader(fr);
                String header = br.readLine();
                String[] split = header.split(",");
                if(split.length == 19){
                    //7层小波分析
                    ArrayList<String> timeList = new ArrayList<>();
                    ArrayList<Float> strain = new ArrayList<>();
                    ArrayList<Float> sa7 = new ArrayList<>();
                    ArrayList<Float> sd1 = new ArrayList<>();
                    ArrayList<Float> sd2 = new ArrayList<>();
                    ArrayList<Float> sd3 = new ArrayList<>();
                    ArrayList<Float> sd4 = new ArrayList<>();
                    ArrayList<Float> sd5 = new ArrayList<>();
                    ArrayList<Float> sd6 = new ArrayList<>();
                    ArrayList<Float> sd7 = new ArrayList<>();
                    ArrayList<Float> temperature = new ArrayList<>();
                    ArrayList<Float> ta7 = new ArrayList<>();
                    ArrayList<Float> td1 = new ArrayList<>();
                    ArrayList<Float> td2 = new ArrayList<>();
                    ArrayList<Float> td3 = new ArrayList<>();
                    ArrayList<Float> td4 = new ArrayList<>();
                    ArrayList<Float> td5 = new ArrayList<>();
                    ArrayList<Float> td6 = new ArrayList<>();
                    ArrayList<Float> td7 = new ArrayList<>();
                    String content = br.readLine();
                    while(content != null){
                        split = content.split(",");
                        timeList.add(split[0]);
                        strain.add(Float.parseFloat(split[1]));
                        sa7.add(Float.parseFloat(split[2]));
                        sd1.add(Float.parseFloat(split[3]));
                        sd2.add(Float.parseFloat(split[4]));
                        sd3.add(Float.parseFloat(split[5]));
                        sd4.add(Float.parseFloat(split[6]));
                        sd5.add(Float.parseFloat(split[7]));
                        sd6.add(Float.parseFloat(split[8]));
                        sd7.add(Float.parseFloat(split[9]));
                        temperature.add(Float.parseFloat(split[10]));
                        ta7.add(Float.parseFloat(split[11]));
                        td1.add(Float.parseFloat(split[12]));
                        td2.add(Float.parseFloat(split[13]));
                        td3.add(Float.parseFloat(split[14]));
                        td4.add(Float.parseFloat(split[15]));
                        td5.add(Float.parseFloat(split[16]));
                        td6.add(Float.parseFloat(split[17]));
                        td7.add(Float.parseFloat(split[18]));
                        content = br.readLine();
                    }
                    data.put("layer",7);

                    data.put("timeList", timeList);
                    data.put("strain", strain);
                    data.put("sa7", sa7);
                    data.put("sd1", sd1);
                    data.put("sd2", sd2);
                    data.put("sd3", sd3);
                    data.put("sd4", sd4);
                    data.put("sd5", sd5);
                    data.put("sd6", sd6);
                    data.put("sd7", sd7);

                    data.put("temperature", temperature);
                    data.put("ta7", ta7);
                    data.put("td1", td1);
                    data.put("td2", td2);
                    data.put("td3", td3);
                    data.put("td4", td4);
                    data.put("td5", td5);
                    data.put("td6", td6);
                    data.put("td7", td7);
                }else{
                    //4层
                    ArrayList<String> timeList = new ArrayList<>();
                    ArrayList<Float> strain = new ArrayList<>();
                    ArrayList<Float> sa4 = new ArrayList<>();
                    ArrayList<Float> sd1 = new ArrayList<>();
                    ArrayList<Float> sd2 = new ArrayList<>();
                    ArrayList<Float> sd3 = new ArrayList<>();
                    ArrayList<Float> sd4 = new ArrayList<>();
                    ArrayList<Float> temperature = new ArrayList<>();
                    ArrayList<Float> ta4 = new ArrayList<>();
                    ArrayList<Float> td1 = new ArrayList<>();
                    ArrayList<Float> td2 = new ArrayList<>();
                    ArrayList<Float> td3 = new ArrayList<>();
                    ArrayList<Float> td4 = new ArrayList<>();
                    String content = br.readLine();
                    while(content != null){
                        split = content.split(",");
                        timeList.add(split[0]);
                        strain.add(Float.parseFloat(split[1]));
                        sa4.add(Float.parseFloat(split[2]));
                        sd1.add(Float.parseFloat(split[3]));
                        sd2.add(Float.parseFloat(split[4]));
                        sd3.add(Float.parseFloat(split[5]));
                        sd4.add(Float.parseFloat(split[6]));
                        temperature.add(Float.parseFloat(split[7]));
                        ta4.add(Float.parseFloat(split[8]));
                        td1.add(Float.parseFloat(split[9]));
                        td2.add(Float.parseFloat(split[10]));
                        td3.add(Float.parseFloat(split[11]));
                        td4.add(Float.parseFloat(split[12]));
                        content = br.readLine();
                    }
                    data.put("layer", 4);

                    data.put("timeList", timeList);
                    data.put("strain", strain);
                    data.put("sa7", sa4);
                    data.put("sd1", sd1);
                    data.put("sd2", sd2);
                    data.put("sd3", sd3);
                    data.put("sd4", sd4);

                    data.put("temperature", temperature);
                    data.put("ta7", ta4);
                    data.put("td1", td1);
                    data.put("td2", td2);
                    data.put("td3", td3);
                    data.put("td4", td4);

                }
                br.close();
                fr.close();

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

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

/**
 * created by xiaoah
 * 2018/11/9
 */
@RestController
public class ReliabilityAnalysis {
    public static Logger logger = Logger.getLogger(ReliabilityAnalysis.class);
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT,Constants.MYSQL_URL,Constants.MYSQL_USERNAME,Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

    @Resource
    SysUserService sysUserService;

    @RequestMapping(value = "/reliability-analysis/reliabilityFileUpload", method = RequestMethod.POST)
    public JSONObject reliabilityFileUpload(@RequestParam("reliability_file_upload")MultipartFile file){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        if (!file.isEmpty()){
            try{
                File targetFile = new File(Constants.RELIABILITY_ANALYSIS_FILE);
                if(!targetFile.exists()) {
                    targetFile.mkdirs();
                }
                String originFileName = file.getOriginalFilename();
                String fileName = Constants.RELIABILITY_ANALYSIS_FILE + "/" + originFileName;
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

    @RequestMapping(value = "/reliability-analysis/dropdown", method = RequestMethod.GET, produces = "application/json")
    public JSONObject dropDownList(String type){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String targetPath = "";
        switch (type){
//            case "trainfile": targetPath = Constants.DAMAGE_UPLOAD_TRAIN_FILE_DIR; break;
//            case "testfile" : targetPath = Constants.DAMAGE_UPLOAD_TEST_FILE_DIR; break;
//            case "trainmodel" : targetPath = Constants.DAMAGE_UPLOAD_TRAIN_MODEL_DIR; break;
//            case "savedmodel" : targetPath = Constants.DAMAGE_SAVE_TRAIN_MODEL_DIR; break;
            case "reliabilityfile" : targetPath = Constants.RELIABILITY_ANALYSIS_FILE; break;
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

    @RequestMapping(value = "/reliability-analysis/updtate_bridgedroplist")
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

    @RequestMapping(value = "/reliability-analysis/start-analysis", method = RequestMethod.POST, produces = "application/json")
    public JSONObject reliabilityAnalysis(@RequestBody JSONObject reqMsg){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String reliabilityFile = reqMsg.getString("reliabilityfile");
        String bridge = reqMsg.getString("bridge");
        long bridge_id = Long.parseLong(reqMsg.getString("bridge_id"));
        String section = reqMsg.getString("section");
        String watchpoint = reqMsg.getString("watchpoint");
        long watchpoint_id = Long.parseLong(reqMsg.getString("watchpoint_id"));
        String beginTime = reqMsg.getString("begintime");
        String endTime = reqMsg.getString("endtime");
        System.out.println(bridge);
        System.out.println(section);
        System.out.println(watchpoint);
        long begintime = Long.parseLong(beginTime);
        long endtime = Long.parseLong(endTime);


        //传递给python程序的时间参数YYMMDD
        String ParamTimeBegin = beginTime.substring(0, 8);
        String ParamTimeEnd = endTime.substring(0, 8);
        System.out.println(ParamTimeBegin);
        System.out.println(ParamTimeEnd);


        //查询数据库预存参数

        JSONObject paramlist =  new JSONObject();
        String sql = String.format("select b.mRc0, b.sRc0, b.mRt0, b.sRt0, E from bridge_para b where b.bridge_id = %d", bridge_id);
        try {
            baseDao.querySingleObject(sql, new ResultSetHandler<String>() {
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    while(rs.next()){
                        paramlist.put("mRc0", rs.getString("mRc0"));
                        paramlist.put("sRc0", rs.getString("sRc0"));
                        paramlist.put("mRt0", rs.getString("mRt0"));
                        paramlist.put("sRt0", rs.getString("sRt0"));
                        paramlist.put("E", rs.getString("E"));
                    }
                    return  null;
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }
        String sql1 = String.format("select p.sc from watch_point_para p where p.watch_point_id = %d", watchpoint_id);
        try {
            baseDao.querySingleObject(sql1, new ResultSetHandler<String>() {
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    while(rs.next()){
                        paramlist.put("sc", rs.getString("sc"));
                    }
                    return  null;
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }

        String mRc0 = paramlist.getString("mRc0");
        String sRc0 = paramlist.getString("sRc0");
        String mRt0 = paramlist.getString("mRt0");
        String sRt0 = paramlist.getString("sRt0");
        String E = paramlist.getString("E");
        String sc = paramlist.getString("sc");

        if(mRc0 == null || sRc0 == null || mRt0 == null || sRt0 == null || E ==null || sc == null){
            System.out.println("no param");
            data.put("result", "no param");
            response.setData(data);
            return response.getHttpResponse();
        }

        System.out.println(paramlist.getString("mRc0"));
        System.out.println(paramlist.getString("sRc0"));
        System.out.println(paramlist.getString("mRt0"));
        System.out.println(paramlist.getString("sRt0"));
        System.out.println(paramlist.getString("E"));
        System.out.println(paramlist.getString("sc"));


        //根据条件过滤数据
        File selectedFile = new File(Constants.RELIABILITY_ANALYSIS_FILE + "/" + reliabilityFile);
        if(!selectedFile.exists()){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("找不到预测文件！");
        }else{
            boolean startflag = false;
            boolean endflag = false;
            try {
                File targetFile = new File(Constants.RELIABILITY_TARGET_DIR);
                if(!targetFile.exists()){
                    targetFile.createNewFile();
                }
                FileOutputStream fos = new FileOutputStream(targetFile);
                OutputStreamWriter osw = new OutputStreamWriter(fos, "UTF-8");
                BufferedWriter bw = new BufferedWriter(osw);
                bw.write("time,bridge,section,test_point,sensor_num,s" + "\n");                               //写首行

                FileInputStream fis = new FileInputStream(selectedFile);
                InputStreamReader isr = new InputStreamReader(fis, "UTF-8");
                BufferedReader br = new BufferedReader(isr);
                String line = "";
                int count = 0;
                while((line = br.readLine()) != null){
                    String[] split = line.split(",");
                    System.out.println(split.length);
                    if(split.length == 6){                                                          //切分数组长度
                        if(!split[0].matches("\\d+")){                                        //匹配首个是否为数字
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
                    String INPUT_FILE = Constants.RELIABILITY_TARGET_DIR;
                    String RELIABILITY_PROGRAM = Constants.RELIABILITY_ANALYSIS_PROGRAM;
                    String outputfileName = bridge + "_" + section + "_" + watchpoint + "_" + beginTime + "_" + endTime + "_result" + ".csv";
                    String OUTPUT_FILE = Constants.RELIABILITY_ANALYSIS_RESULT_DIR + "/" + outputfileName;
                    String md5 = DigestUtils.md5Hex(reliabilityFile + beginTime + endTime);

                    AnalysisMessage.getInstance().update(md5, bridge + "_" + section + "_" + watchpoint + "_" + beginTime + "_" + endTime,outputfileName, Constants.READY, "RELIABILITY",null);
                    String execStr = "D:/os_environment/anaconda/python " + RELIABILITY_PROGRAM + " " + INPUT_FILE + " "
                            + mRc0 + " " + sRc0 + " " + mRt0 + " " + sRt0 + " " + E + " " + sc + " " + ParamTimeBegin + " " + ParamTimeEnd + " " + OUTPUT_FILE;
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
                    data.put("result","no data");
                }

            }catch (IOException e) {
                e.printStackTrace();
            }
        }
        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/reliability-analysis/getAnalysisResult", method = RequestMethod.GET, produces = "application/json")
    public JSONObject getAnalysisResult1(String bridge, String section, String watchpoint, String begintime, String endtime){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String resultfileName = bridge + "_" + section + "_" + watchpoint + "_" + begintime + "_" + endtime + "_result" + ".csv";
        String analysisResultPath = Constants.RELIABILITY_ANALYSIS_RESULT_DIR + "/" + resultfileName;
        System.out.println(analysisResultPath);
        File file = new File(analysisResultPath);
        if(!file.exists()){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("结果不存在");
        }else{
            try {
                FileReader fr = new FileReader(analysisResultPath);
                BufferedReader br = new BufferedReader(fr);
                String header = br.readLine();
                ArrayList<String> timeList = new ArrayList<>();
                ArrayList<Float> btcList = new ArrayList<>();
                ArrayList<Float> bttList = new ArrayList<>();
                ArrayList<Float> pfcList = new ArrayList<>();
                ArrayList<Float> pftList = new ArrayList<>();
                String content = "";
                while((content = br.readLine()) != null){
                    String[] split = content.split(",");
                    timeList.add(split[0]);
                    btcList.add(Float.parseFloat(split[1]));
                    bttList.add(Float.parseFloat(split[2]));
                    pfcList.add(Float.parseFloat(split[3]));
                    pftList.add(Float.parseFloat(split[4]));
                }
                br.close();
                fr.close();
                data.put("timeList",timeList);
                data.put("btc", btcList);
                data.put("btt", bttList);
                data.put("pfc", pfcList);
                data.put("pft", pftList);
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

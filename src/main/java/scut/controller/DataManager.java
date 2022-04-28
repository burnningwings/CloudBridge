package scut.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.log4j.Logger;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import scut.base.HttpResponse;
import scut.service.SysUserService;
import scut.service.log.LogBase;
import scut.service.scheduler.Message;
import scut.service.scheduler.Scheduler;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Created by Carrod on 2018/4/19.
 */

@RestController
public class DataManager {

    public static Logger logger = Logger.getLogger(DataManager.class);
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT,Constants.MYSQL_URL,Constants.MYSQL_USERNAME,Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

    @Resource
    SysUserService sysUserService;

    public Map<String,Object> getDataSchema(String sensorId){
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

    // 可应用于各类消息通知
    @RequestMapping(value = "/message/log", method = RequestMethod.GET, produces = "application/json")
    public JSONObject getMessageStatus(String id){
        HttpResponse response = new HttpResponse();
        JSONObject data = Message.getInstance().getInfo(id,new String[]{"error_log"});
        response.setData(data);
        return response.getHttpResponse();
    }

    // 重新提交
    @RequestMapping(value = "/upload-data/replay", method = RequestMethod.GET, produces = "application/json")
    public JSONObject replay(String id){
        HttpResponse response = new HttpResponse();
        JSONObject data = Message.getInstance().getInfo(id,new String[]{"param"});
        String param = data.getString("param");
        logger.debug(param);
        if(param==null || param.equals("")){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("内部数据格式错误！");
        }else{
            Map execMap = new JsonParser().parse(param);
            Object execObj = execMap.getOrDefault("exec_str",null);
            if(execObj==null) {
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("内部数据格式错误！");
            }
            else{
                logger.debug(execObj.toString());
                Executor executor = new CommandLineExecutor(id,execObj.toString());
                Message.getInstance().update(id,null,null,Constants.READY,param,null);
                Scheduler.getInstance().runExecutor(executor);
                // TODO: potential bug: hard-coded URL
                data.put("url","http://192.168.0.100:8088/cluster/scheduler");
                // 前端获取该key，可监听上传情况
                data.put("id",id);
            }
        }
        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/upload-data/message/list", method = RequestMethod.GET, produces = "application/json")
    public JSONObject getMessagePage(int page, Integer pageSize){
        String sql = String.format("select a.id,b.bridge_name as bridge,c.name as section," +
//                "d.name as point,e.name as watch_box,g.name as sensor," +
                "d.name as point,g.name as sensor," +
                "a.target,a.source,a.status,a.last_update,a.error_log, " +
                "f.sensor_id as sensor_id " +
                "from message as a " +
                "left join sensor_info as f on a.target=f.sensor_number " +
                "left join sensor_type as g on f.type_id=g.type_id " +
//                "left join watch_box as e on e.box_id=f.box_id " +
                "left join watch_point as d on f.point_id=d.point_id " +
                "left join section as c on c.section_id=d.section_id " +
                "left join bridge_info as b on b.bridge_id=c.bridge_id order by last_update desc limit %s offset %s", pageSize,(page-1)*pageSize);
//        String[] fields = new String[]{"id","bridge","section","point","watch_box","sensor","target","source","status","last_update","error_log"};
        String[] fields = new String[]{"id","bridge","section","point","sensor_id","sensor","target","source","status","last_update","error_log"};
//        String[] fields = new String[]{"id","source","target","status","last_update","error_log"};
        JSONArray data = new JSONArray();
        try {
            baseDao.querySingleObject(sql,new ResultSetHandler<String>(){
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    while(rs.next()){
                        JSONObject item = new JSONObject();
                        for(String filed: fields) {
                            if(filed.equals("sensor_id")){
                                String bsql = String.format("select b.name as watch_box from watch_box as b left join sensor_info as s on s.box_id = b.box_id where s.sensor_id = %d",rs.getObject(filed));
                                String[] f = new String[]{"watch_box"};
                                JSONArray t = baseDao.queryData(bsql,f);
                                item.put("watch_box",t.getJSONObject(0).getString("watch_box"));
                                continue;
                            }
                            Object value = rs.getObject(filed);
                            if(value==null){
                                value = "";
                            }
                            item.put(filed, value.toString());
                        }
                        data.add(item);
                    }
                    return null;
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }
        sql = "select count(*) as count from message";
        JSONObject response = new JSONObject();
        try {
            baseDao.querySingleObject(sql,new ResultSetHandler<String>(){
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    if(rs.next()){
                        response.put("total",rs.getString("count"));
                    }
                    return null;
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }
        response.put("data",data);
        return response;
    }

    @RequestMapping(value = "/upload-data/upload", method = RequestMethod.POST)
    public JSONObject upload(@RequestParam("f_upload") MultipartFile file, String sensor_id, String sensor_number) {
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        if (!file.isEmpty() && sensor_id!=null && !sensor_id.equalsIgnoreCase("null")
                && !sensor_id.equalsIgnoreCase("")) {
            try {



                // 临时文件目录
                File targetFile = new File(Constants.SENSOR_DATA_ROOT_DIR);
                if(!targetFile.exists()){
                    targetFile.mkdirs();
                }
                // 待上传文件完整路径
                String md5 = DigestUtils.md5Hex(file.getInputStream() + sensor_id);
                String originFileName = file.getOriginalFilename();
                String fileName = Constants.SENSOR_DATA_ROOT_DIR + "/" + md5 + "-" + originFileName;
                // 1. 写到本地
                BufferedOutputStream out = new BufferedOutputStream(
                        new FileOutputStream(new File( fileName)));
                out.write(file.getBytes());
                out.flush();
                out.close();
                // 2. 上传到HBase
                String execStr = Constants.UPLOAD_DATA_BIN_SH + " " + sensor_id + " " + fileName;
                logger.debug(execStr);
                Executor executor = new CommandLineExecutor(md5,execStr);
                JSONObject param = new JSONObject();
                param.put("exec_str",execStr);
                Message.getInstance().update(md5,originFileName,sensor_number,Constants.READY,param.toJSONString(),null);
                Scheduler.getInstance().runExecutor(executor);
                data.put("url","http://192.168.0.100:8088/cluster/scheduler");
                // 前端获取该key，可监听上传情况
                data.put("id",md5);

                LogBase logbase = new LogBase();
                boolean logoption = logbase.sys_logoption(23);
                if (logoption)
                {
                    //section相关操作写进数据库
                    UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                    String log_sql = LogBase.log_upload_sensor_data(userDetails.getUsername(), sensor_number, "FINISHED");
                    logger.info(log_sql);
                    baseDao.updateData(log_sql);

                }
            } catch (FileNotFoundException e) {
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("服务器路径错误！");
            } catch (IOException e) {
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("文件上传失败！");
            }
        } else {
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("相关上传参数错误！");
        }
        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/query-data/dropdown", method = RequestMethod.GET, produces = "application/json")
    public JSONObject dropdownList(String bridge_id) {
        long userOrganizationId = sysUserService.getUserOrganizationId();
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String sql = String.format("select b.bridge_id,b.bridge_name from bridge_info b " +
                "where b.bridge_id in (" +
                "select bo.bridge_id from bridge_organization bo " +
                "where bo.organization_id = %d)", userOrganizationId);
        try {
            baseDao.querySingleObject(sql,new ResultSetHandler<String>(){
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    JSONObject item = new JSONObject();
                    String firstId = bridge_id;
                    while(rs.next()){
                        if(firstId.equalsIgnoreCase("all"))
                            firstId = rs.getString("bridge_id");
                        item.put(rs.getString("bridge_id"),rs.getString("bridge_name"));
                    }
                    data.put("bridge_id",firstId);
                    data.put("bridge",item);
                    return null;
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }
        if(data.size()>0 && !data.get("bridge_id").equals("")){
//            sql = "select a.box_id,a.name as box_name,b.sensor_id,b.sensor_number,c.name as sensor_type_name,d.point_id,d.name as point_name,e.section_id,e.name as section_name " +
//                    "from watch_box as a " +
//                    "from watch_box as a " +
//                    "left join sensor_info as b on a.box_id=b.box_id " +
//                    "left join sensor_type as c on b.type_id=c.type_id " +
//                    "left join watch_point as d on b.point_id=d.point_id " +
//                    "left join section as e on d.section_id=e.section_id " +
//                    "where a.bridge_id='%s'" +
//                    "and a.bridge_id in (" +
//                    "select bo.bridge_id from bridge_organization bo " +
//                    "where bo.organization_id = " + userOrganizationId + ")";
            sql = "select a.sensor_id,a.sensor_number,b.name as sensor_type_name,c.point_id,c.name as point_name, d.section_id,d.name as section_name " +
                    "from sensor_info as a " +
                    "left join sensor_type as b on a.type_id = b.type_id " +
                    "left join watch_point as c on a.point_id = c.point_id " +
                    "left join section as d on c.section_id = d.section_id " +
                    "where d.bridge_id ='%s' " +
                    "and d.bridge_id in (" +
                    "select bo.bridge_id from bridge_organization bo " +
                    "where bo.organization_id = " + userOrganizationId + ")";
            try {
                baseDao.querySingleObject(String.format(sql,data.get("bridge_id")),
                        new ResultSetHandler<String>(){
                            @Override
                            public String handle(ResultSet rs) throws SQLException {
                                JSONObject bridgeItem = new JSONObject();
                                while(rs.next()){
                                    String sectionId = rs.getString("section_id");
                                    JSONObject sectionItem = (JSONObject) bridgeItem.getOrDefault(sectionId,new JSONObject());
                                    sectionItem.put("name",rs.getString("section_name"));
                                    String pointId = rs.getString("point_id");
                                    JSONObject pointItem = (JSONObject) sectionItem.getOrDefault(pointId,new JSONObject());
                                    if(pointId!=null){
                                        pointItem.put("name",rs.getString("point_name"));
                                    }
//                                    String boxId = rs.getString("box_id");
//                                    JSONObject boxItem = (JSONObject) pointItem.getOrDefault(boxId,new JSONObject());
//                                    JSONObject sensorItem= (JSONObject) boxItem.getOrDefault("sensor",new JSONObject());
//                                    boxItem.put("name",rs.getString("box_name"));
                                    JSONObject sensorItem = (JSONObject) pointItem.getOrDefault("sensor",new JSONObject());
                                    String sensorId = rs.getString("sensor_id");
                                    if(sensorId!=null) {
                                        sensorItem.put(
                                                sensorId,rs.getString("sensor_number") + " - "
                                                        + rs.getString("sensor_type_name"));
                                    }
//                                    boxItem.put("sensor",sensorItem);
                                    pointItem.put(sectionId,sectionItem);
                                    sectionItem.put(pointId,pointItem);
                                    bridgeItem.put(sectionId,sectionItem);
                                }
                                data.put("bridge_detail",bridgeItem);
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

    /**
     * 基于HBase的异步翻页
     * @param page
     * @param pageSize
     * @param next
     * @param skip
     * @param rowKey
     * @param sensorInfo
     * @return
     */
    @RequestMapping(value = "/query-data/list", method = RequestMethod.GET, produces = "application/json")
    public JSONObject tableList(int page, Integer pageSize, boolean next, int skip, String rowKey, String sensorInfo) {
        long total = 0;
        String nextRowKey = rowKey;
        String currentRowKey = rowKey;
        // 获取数据
        JSONArray data = new JSONArray();
        String[] sensorInfoArray = sensorInfo.split(" - ");
        if(sensorInfoArray.length == 2){
            String sensorId = sensorInfoArray[0];
            String hbaseTableName = "CloudBridge:" + sensorId;
            Map<String,Object> dataSchema = getDataSchema(sensorId);
            System.out.println(dataSchema);
            if(dataSchema!=null){
                dataSchema.remove("CLSJ");
                // 基于hbase的分页
                // 增加每一行的额外信息
                Map<String,String> otherInfo = new HashMap<>();
                otherInfo.put("sensor_id",sensorId);
                otherInfo.put("sensor_number",sensorInfoArray[1]);
                System.out.print(dataSchema.keySet());
                data = HBaseCli.getInstance().getPage(
                        hbaseTableName,
                        pageSize,
                        next,
                        rowKey,
                        true,
                        dataSchema.keySet(),
                        otherInfo);
                if(data.size()>0){
                    System.out.println("next:" + next);
                    System.out.println("rowKey:" + rowKey);
                    System.out.println("data.Size:" + data.size());
                    System.out.println("pageSize:"  + pageSize);
                    System.out.println("skip:"  + skip);
                    if(data.size() > pageSize){
                        JSONObject lastItem = (JSONObject) data.get(data.size()-1);
                        nextRowKey = lastItem.get("CLSJ").toString();
                        data.remove(lastItem);
                        total = skip + data.size() + 1;
                    }else{
                        // 翻到最后一页
                        total = skip + data.size();
                    }
                    JSONObject firstItem = (JSONObject)data.get(0);
                    currentRowKey = firstItem.get("CLSJ").toString();
                }
            }
        }
        JSONObject response = new JSONObject();
        response.put("data",data);
        response.put("total",total);
        response.put("current_row_key",currentRowKey);
        response.put("next_row_key",nextRowKey);
        return response;
    }

    // 传感器不同指标的展示
    @RequestMapping(value = "/query-data/figure", method = RequestMethod.GET, produces = "application/json")
    public JSONObject figure(String sensorList, String columnList,
                             String startRowKey, String endRowKey, int limit) {
        System.out.println(sensorList);
        System.out.println(startRowKey);
        System.out.println(endRowKey);
        System.out.println(limit);
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        JSONArray sensorArray = JSON.parseArray(sensorList);
        JSONArray columnArray = JSON.parseArray(columnList);

        /*if(sensorArray.size()>1 && columnArray.size()>1){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("当前不支持同时获取多传感器多指标！");
        }else */if((startRowKey==null || startRowKey.equals("")) && (endRowKey==null || endRowKey.equals(""))){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("查询参数有误！");
        }else{
            for(Object sensorId: sensorArray){
                System.out.println("size: " + columnArray.size());
                if(columnArray.size()<=0){
                    // 获取所有列
                    Set<String> sensorColumns = getDataSchema(sensorId.toString()).keySet();
                    sensorColumns.remove("CLSJ");
                    columnArray.addAll(sensorColumns);
                    System.out.println(columnArray);
                }
                String hbaseTableName = "CloudBridge:" + sensorId;
                int sample = -1;
                JSONArray rangeData = HBaseCli.getInstance().query(hbaseTableName,startRowKey,endRowKey,columnArray,limit,sample);
                data.put(sensorId.toString(),rangeData);
            }
        }
        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/query-data/sensor_info", method = RequestMethod.GET, produces = "application/json")
    public JSONObject getSensorInfo(String sensor_id, String clsj){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();

        Map<String, Object> dataSchema = getDataSchema(sensor_id);
        System.out.print(dataSchema.keySet());

        response.setData(data);
        return response.getHttpResponse();
    }
    @RequestMapping(value = "/query-data/updateJSDsensor", method = RequestMethod.POST, produces = "application/json")
    public JSONObject updateJSDsensordata(@RequestBody Map<String,Object> reqMsg){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String sensor_id = reqMsg.get("sensor_id").toString();
        String CLSJ = reqMsg.get("CLSJ").toString();
        String JSD = reqMsg.get("JSD").toString();
        String DY = reqMsg.get("DY").toString();

        //检查参数是否为空
        if(sensor_id==null || sensor_id.equals("") || CLSJ==null || CLSJ.equals("")
                || JSD==null || JSD.equals("") || DY==null || DY.equals("")){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("错误，相关参数为空！");
            return response.getHttpResponse();
        }
        //检查参数是否合法
        if(!CLSJ.matches("([1-9]\\d*\\.?\\d*)|(0\\.\\d*)|(0)") || !JSD.matches("([1-9]\\d*\\.?\\d*)|(0\\.\\d*)|(0)") || !DY.matches("([1-9]\\d*\\.?\\d*)|(0\\.\\d*)|(0)")){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("参数类型错误！");
            return response.getHttpResponse();
        }

        String hbaseTable = "CloudBridge:" + sensor_id;
        String rowKey = CLSJ;
        Map<String, String> sensorInfo = new HashMap<>();
        sensorInfo.put("JSD",JSD);
        sensorInfo.put("DY", DY);
        System.out.print(hbaseTable+"-"+rowKey);
        int result = HBaseCli.getInstance().updateRow(hbaseTable, rowKey, sensorInfo);
        if(result != 0){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("修改失败！");
            return response.getHttpResponse();
        }else{
            response.setData(data);
            return response.getHttpResponse();
        }
    }

    @RequestMapping(value = "/query-data/updateGXYBsensor", method = RequestMethod.POST, produces = "application/json")
    public JSONObject updateGXYBsensordata(@RequestBody Map<String,Object> reqMsg){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String sensor_id = reqMsg.get("sensor_id").toString();
        String CLSJ = reqMsg.get("CLSJ").toString();
        String CLBC = reqMsg.get("CLBC").toString();
        String YB = reqMsg.get("YB").toString();

        //检查参数是否为空
        if(sensor_id==null || sensor_id.equals("") || CLSJ==null || CLSJ.equals("")
                || CLBC==null || CLBC.equals("") || YB==null || YB.equals("")){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("错误，相关参数为空！");
            return response.getHttpResponse();
        }
        //检查参数是否合法
        if(!CLSJ.matches("([1-9]\\d*\\.?\\d*)|(0\\.\\d*)|(0)") || !CLBC.matches("([1-9]\\d*\\.?\\d*)|(0\\.\\d*)|(0)") || !YB.matches("([1-9]\\d*\\.?\\d*)|(0\\.\\d*)|(0)")){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("参数类型错误！");
            return response.getHttpResponse();
        }

        String hbaseTable = "CloudBridge:" + sensor_id;
        String rowKey = CLSJ;
        Map<String, String> sensorInfo = new HashMap<>();
        sensorInfo.put("CLBC",CLBC);
        sensorInfo.put("YB", YB);
        System.out.print(hbaseTable+"-"+rowKey);
        int result = HBaseCli.getInstance().updateRow(hbaseTable, rowKey, sensorInfo);
        if(result != 0){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("修改失败！");
            return response.getHttpResponse();
        }else{
            response.setData(data);
            return response.getHttpResponse();
        }
    }

    @RequestMapping(value = "/query-data/updateSLsensor", method = RequestMethod.POST, produces = "application/json")
    public JSONObject updateSLsensordata(@RequestBody Map<String,Object> reqMsg){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String sensor_id = reqMsg.get("sensor_id").toString();
        String CLSJ = reqMsg.get("CLSJ").toString();
        String DY = reqMsg.get("DY").toString();
        String JSD = reqMsg.get("JSD").toString();
        String SL = reqMsg.get("SL").toString();

        //检查参数是否为空
        if(sensor_id==null || sensor_id.equals("") || CLSJ==null || CLSJ.equals("")
                || DY==null || DY.equals("") || JSD==null || JSD.equals("") || SL==null || SL.equals("")){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("错误，相关参数为空！");
            return response.getHttpResponse();
        }
        //检查参数是否合法
        if(!CLSJ.matches("([1-9]\\d*\\.?\\d*)|(0\\.\\d*)|(0)") || !DY.matches("([1-9]\\d*\\.?\\d*)|(0\\.\\d*)|(0)")
                || !JSD.matches("([1-9]\\d*\\.?\\d*)|(0\\.\\d*)|(0)") || !SL.matches("([1-9]\\d*\\.?\\d*)|(0\\.\\d*)|(0)")){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("参数类型错误！");
            return response.getHttpResponse();
        }

        String hbaseTable = "CloudBridge:" + sensor_id;
        String rowKey = CLSJ;
        Map<String, String> sensorInfo = new HashMap<>();
        sensorInfo.put("DY",DY);
        sensorInfo.put("JSD", JSD);
        sensorInfo.put("SL", SL);
        System.out.print(hbaseTable+"-"+rowKey);
        int result = HBaseCli.getInstance().updateRow(hbaseTable, rowKey, sensorInfo);
        if(result != 0){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("修改失败！");
            return response.getHttpResponse();
        }else{
            response.setData(data);
            return response.getHttpResponse();
        }
    }

    @RequestMapping(value = "/query-data/updateGPSsensor", method = RequestMethod.POST, produces = "application/json")
    public JSONObject updateGPSsensordata(@RequestBody Map<String,Object> reqMsg){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String sensor_id = reqMsg.get("sensor_id").toString();
        String CLSJ = reqMsg.get("CLSJ").toString();
        String WXZBX = reqMsg.get("WXZBX").toString();
        String QLZBX = reqMsg.get("QLZBX").toString();
        String WXWYX = reqMsg.get("WXWYX").toString();
        String QLWYX = reqMsg.get("QLWYX").toString();
        String WXZBY = reqMsg.get("WXZBY").toString();
        String QLZBY = reqMsg.get("QLZBY").toString();
        String WXWYY = reqMsg.get("WXWYY").toString();
        String QLWYY = reqMsg.get("QLWYY").toString();
        String WXZBZ = reqMsg.get("WXZBZ").toString();
        String QLZBZ = reqMsg.get("QLZBZ").toString();
        String WXWYZ = reqMsg.get("WXWYZ").toString();
        String QLWZ = reqMsg.get("QLWZ").toString();

        //检查参数是否为空
        if(sensor_id==null || sensor_id.equals("") || CLSJ==null || CLSJ.equals("")
                || WXZBX==null || WXZBX.equals("") || QLZBX==null || QLZBX.equals("") || WXWYX==null || WXWYX.equals("") || QLWYX==null || QLWYX.equals("")
                || WXZBY==null || WXZBY.equals("") || QLZBY==null || QLZBY.equals("") || WXWYY==null || WXWYY.equals("") || QLWYY==null || QLWYY.equals("")
                || WXZBZ==null || WXZBZ.equals("") || QLZBZ==null || QLZBZ.equals("") || WXWYZ==null || WXWYZ.equals("") || QLWZ==null || QLWZ.equals("")){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("错误，相关参数为空！");
            return response.getHttpResponse();
        }
        //检查参数是否合法
        String regex = "([1-9]\\d*\\.?\\d*)|(0\\.\\d*)|(0)";
        if(!CLSJ.matches(regex) || !WXZBX.matches(regex) || !QLZBX.matches(regex) || !WXWYX.matches(regex) || !QLWYX.matches(regex) ||
        !WXZBY.matches(regex) || !QLZBY.matches(regex) || !WXWYY.matches(regex) || !QLWYY.matches(regex) ||
                !WXZBZ.matches(regex) || !QLZBZ.matches(regex) || !WXWYZ.matches(regex) || !QLWZ.matches(regex)){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("参数类型错误！");
            return response.getHttpResponse();
        }

        String hbaseTable = "CloudBridge:" + sensor_id;
        String rowKey = CLSJ;
        Map<String, String> sensorInfo = new HashMap<>();
        sensorInfo.put("WXZBX",WXZBX);
        sensorInfo.put("QLZBX", QLZBX);
        sensorInfo.put("WXWYX", WXWYX);
        sensorInfo.put("QLWYX", QLWYX);
        sensorInfo.put("WXZBY",WXZBY);
        sensorInfo.put("QLZBY", QLZBY);
        sensorInfo.put("WXWYY", WXWYY);
        sensorInfo.put("QLWYY", QLWYY);
        sensorInfo.put("WXZBZ",WXZBZ);
        sensorInfo.put("QLZBZ", QLZBZ);
        sensorInfo.put("WXWYZ", WXWYZ);
        sensorInfo.put("QLWZ", QLWZ);
        System.out.print(hbaseTable+"-"+rowKey);
        int result = HBaseCli.getInstance().updateRow(hbaseTable, rowKey, sensorInfo);
        if(result != 0){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("修改失败！");
            return response.getHttpResponse();
        }else{
            response.setData(data);
            return response.getHttpResponse();
        }
    }

    @RequestMapping(value = "/query-data/updateZXsensor", method = RequestMethod.POST, produces = "application/json")
    public JSONObject updateZXsensordata(@RequestBody Map<String,Object> reqMsg){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String sensor_id = reqMsg.get("sensor_id").toString();
        String CLSJ = reqMsg.get("CLSJ").toString();
        String CLYB = reqMsg.get("CLYB").toString();
        String XZYB = reqMsg.get("XZYB").toString();
        String DZ = reqMsg.get("DZ").toString();
        String CLWD = reqMsg.get("CLWD").toString();

        //检查参数是否为空
        if(sensor_id==null || sensor_id.equals("") || CLSJ==null || CLSJ.equals("")
                || CLYB==null || CLYB.equals("") || XZYB==null || XZYB.equals("")
                || DZ==null || DZ.equals("") || CLWD==null || CLWD.equals("")){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("错误，相关参数为空！");
            return response.getHttpResponse();
        }
        //检查参数是否合法
        if(!CLSJ.matches("([1-9]\\d*\\.?\\d*)|(0\\.\\d*)|(0)") || !CLYB.matches("([1-9]\\d*\\.?\\d*)|(0\\.\\d*)|(0)")
                || !XZYB.matches("([1-9]\\d*\\.?\\d*)|(0\\.\\d*)|(0)") || !DZ.matches("([1-9]\\d*\\.?\\d*)|(0\\.\\d*)|(0)")
                || !CLWD.matches("([1-9]\\d*\\.?\\d*)|(0\\.\\d*)|(0)")){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("参数类型错误！");
            return response.getHttpResponse();
        }

        String hbaseTable = "CloudBridge:" + sensor_id;
        String rowKey = CLSJ;
        Map<String, String> sensorInfo = new HashMap<>();
        sensorInfo.put("CLYB",CLYB);
        sensorInfo.put("XZYB", XZYB);
        sensorInfo.put("DZ", DZ);
        sensorInfo.put("CLWD", CLWD);
        System.out.print(hbaseTable+"-"+rowKey);
        int result = HBaseCli.getInstance().updateRow(hbaseTable, rowKey, sensorInfo);
        if(result != 0){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("修改失败！");
            return response.getHttpResponse();
        }else{
            response.setData(data);
            return response.getHttpResponse();
        }
    }
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/query-data/delete", method = RequestMethod.POST)
    public JSONObject deletesdSensordata(@RequestBody Map<String,Object> reqMsg){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String sensor_id = reqMsg.get("sensor_id").toString();
        String checked = reqMsg.get("checkedList").toString();
        String[] split = checked.split(",");
        ArrayList<String> rowkeys = new ArrayList<>();
        for(int i=0; i<split.length;i++){
            rowkeys.add(split[i]);
        }
        String hbaseTable = "CloudBridge:" + sensor_id;
        int result = HBaseCli.getInstance().deleteRow(hbaseTable, rowkeys);
        if(result != 0){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("删除失败！");
            return response.getHttpResponse();
        }else{
            response.setData(data);
            return response.getHttpResponse();
        }
    }
}

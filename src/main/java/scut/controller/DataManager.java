package scut.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import scut.base.HttpResponse;
import scut.service.scheduler.Message;
import scut.service.scheduler.Scheduler;
import scut.service.scheduler.executor.CommandLineExecutor;
import scut.service.scheduler.executor.Executor;
import scut.util.Constants;
import scut.util.hbase.HBaseCli;
import scut.util.parser.JsonParser;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import java.io.*;
import java.sql.ResultSet;
import java.sql.SQLException;
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
        String sql = String.format("select * from message order by last_update desc limit %s offset %s", pageSize,(page-1)*pageSize);
        String[] fields = new String[]{"id","source","target","status","last_update","error_log"};
        JSONArray data = new JSONArray();
        try {
            baseDao.querySingleObject(sql,new ResultSetHandler<String>(){
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    while(rs.next()){
                        JSONObject item = new JSONObject();
                        for(String filed: fields) {
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
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String sql = "select bridge_id,bridge_name from bridge_info";
        try {
            baseDao.querySingleObject(sql,new ResultSetHandler<String>(){
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    JSONObject item = new JSONObject();
                    String firstId = bridge_id;
                    while(rs.next()){
                        if(firstId.equalsIgnoreCase("all")) firstId = rs.getString("bridge_id");
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
            sql = "select a.box_id,a.name as box_name,b.sensor_id,b.sensor_number,c.name as sensor_type_name " +
                    "from watch_box as a " +
                    "left join sensor_info as b on a.box_id=b.box_id " +
                    "left join sensor_type as c on b.type_id=c.type_id " +
                    "where a.bridge_id='%s'";
            try {
                baseDao.querySingleObject(String.format(sql,data.get("bridge_id")),
                        new ResultSetHandler<String>(){
                            @Override
                            public String handle(ResultSet rs) throws SQLException {
                                JSONObject bridgeItem = new JSONObject();
                                while(rs.next()){
                                    String boxId = rs.getString("box_id");
                                    JSONObject boxItem = (JSONObject) bridgeItem.getOrDefault(boxId,new JSONObject());
                                    JSONObject sensorItem= (JSONObject) boxItem.getOrDefault("sensor",new JSONObject());
                                    boxItem.put("name",rs.getString("box_name"));
                                    String sensorId = rs.getString("sensor_id");
                                    if(sensorId!=null) {
                                        sensorItem.put(
                                                sensorId,rs.getString("sensor_number") + " - "
                                                        + rs.getString("sensor_type_name"));
                                    }
                                    boxItem.put("sensor",sensorItem);
                                    bridgeItem.put(boxId,boxItem);
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
        if(sensorInfoArray.length==3){
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
                    System.out.println("1:" + rowKey);
                    System.out.println("2:" + data.size());
                    System.out.println("3:"  + pageSize);
                    System.out.println("4:"  + skip);
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

        if(sensorArray.size()>1 && columnArray.size()>1){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("当前不支持同时获取多传感器多指标！");
        }else if((startRowKey==null || startRowKey.equals("")) && (endRowKey==null || endRowKey.equals(""))){
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
}
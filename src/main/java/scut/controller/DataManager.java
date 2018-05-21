package scut.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.hadoop.hbase.client.Table;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import scut.base.HttpResponse;
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

    @RequestMapping(value = "/upload-data/upload", method = RequestMethod.POST)
    public JSONObject upload(@RequestParam("f_upload") MultipartFile file, String sensor_id) {
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
                String md5 = DigestUtils.md5Hex(file.getInputStream());
                String fileName = Constants.SENSOR_DATA_ROOT_DIR + "/" + md5 + "-" + file.getOriginalFilename();
                // 1. 写到本地
                BufferedOutputStream out = new BufferedOutputStream(
                        new FileOutputStream(new File( fileName)));
                out.write(file.getBytes());
                out.flush();
                out.close();
                // 2. 上传到HBase
                String execStr = Constants.UPLOAD_DATA_BIN_SH + " " + sensor_id + " " + fileName;
                logger.debug(execStr);
                Executor executor = new CommandLineExecutor(execStr);
                Scheduler.getInstance().runExecutor(executor);
                data.put("url","http://192.168.0.100:8088/cluster/scheduler");
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
            if(dataSchema!=null){
                dataSchema.remove("CLSJ");
                // 基于hbase的分页
                Table hbaseTable = HBaseCli.getInstance().getHBaseTable(hbaseTableName);
                // 增加每一行的额外信息
                Map<String,String> otherInfo = new HashMap<>();
                otherInfo.put("sensor_id",sensorId);
                otherInfo.put("sensor_number",sensorInfoArray[1]);
                data = HBaseCli.getInstance().getPage(
                        hbaseTable,
                        pageSize,
                        next,
                        rowKey,
                        true,
                        dataSchema.keySet(),
                        otherInfo);
                if(data.size()>0){
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
                if(hbaseTable != null){
                    try {
                        hbaseTable.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
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
                Table hbaseTable = HBaseCli.getInstance().getHBaseTable(hbaseTableName);
                int sample = -1;
                JSONArray rangeData = HBaseCli.getInstance().query(hbaseTable,startRowKey,endRowKey,columnArray,limit,sample);
                data.put(sensorId.toString(),rangeData);
            }
            System.out.println(data);
        }
        response.setData(data);
        return response.getHttpResponse();
    }
}

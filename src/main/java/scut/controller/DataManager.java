package scut.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.hadoop.hbase.client.Table;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import scut.base.HttpResponse;
import scut.util.Constants;
import scut.util.hbase.HBaseCli;
import scut.util.parser.JsonParser;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import java.io.IOException;
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

    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT,Constants.MYSQL_URL,Constants.MYSQL_USERNAME,Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

    private Map<String,Object> getDataSchema(String tableName, String CGQBH){
        String sql = "select data_schema from %s where CGQBH='%s'";
        Map<String,Object> dataSchema = null;
        try {
            dataSchema = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url).querySingleObject(
                    String.format(sql,tableName,CGQBH),new ResultSetHandler<Map<String,Object>>(){
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
            sql = "select a.box_id,a.name as box_name,b.CGQBH from watch_box as a left join %s as b " +
                    "on a.box_id=b.box_id where a.bridge_id='%s'";
            try {
                for(String sensorTable: Constants.sensorArray){
                    baseDao.querySingleObject(String.format(sql,sensorTable,data.get("bridge_id")),
                            new ResultSetHandler<String>(){
                                @Override
                                public String handle(ResultSet rs) throws SQLException {
                                    JSONObject bridgeItem = (JSONObject) data.getOrDefault("bridge_detail",new JSONObject());
                                    while(rs.next()){
                                        String boxId = rs.getString("box_id");
                                        JSONObject boxItem = (JSONObject) bridgeItem.getOrDefault(boxId,new JSONObject());
                                        JSONArray sensorArray = (JSONArray) boxItem.getOrDefault("sensor",new JSONArray());
                                        boxItem.put("name",rs.getString("box_name"));
                                        String CGQBH = rs.getString("CGQBH");
                                        if(CGQBH!=null) {
                                            sensorArray.add(CGQBH + " - " + sensorTable);
                                        }
                                        boxItem.put("sensor",sensorArray);
                                        bridgeItem.put(boxId,boxItem);
                                    }
                                    data.put("bridge_detail",bridgeItem);
                                    return null;
                                }
                            });
                }
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
        String sensorId = sensorInfo.split(" - ")[0];
        String tableName = sensorInfo.split(" - ")[1];
        String hbaseTableName = "CloudBridge:" + tableName + "." + sensorId;
        Map<String,Object> dataSchema = getDataSchema(tableName,sensorId);
        if(dataSchema!=null){
            dataSchema.remove("CLSJ");
            // 基于hbase的分页
            Table hbaseTable = HBaseCli.getInstance().getHBaseTable(hbaseTableName);
            // 增加每一行的额外信息
            Map<String,String> otherInfo = new HashMap<>();
            otherInfo.put("sensor_info",sensorInfo);
            otherInfo.put("CGQBH",sensorId);
            otherInfo.put("table_name",tableName);
            data = HBaseCli.getInstance().getPage(
                    hbaseTable,
                    pageSize,
                    next,
                    rowKey,
                    true,
                    dataSchema.keySet(),
                    otherInfo);
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
            if(hbaseTable != null){
                try {
                    hbaseTable.close();
                } catch (IOException e) {
                    e.printStackTrace();
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
    public JSONObject figure(String tableName, String CGQBHList, String columnList,
                             String startRowKey, String endRowKey, int limit) {
        System.out.println(tableName);
        System.out.println(CGQBHList);
        System.out.println(startRowKey);
        System.out.println(endRowKey);
        System.out.println(limit);
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        JSONArray CGQBHArray = JSON.parseArray(CGQBHList);
        JSONArray columnArray = JSON.parseArray(columnList);

        if(CGQBHArray.size()>1 && columnArray.size()>1){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("当前不支持同时获取多传感器多指标！");
        }else if((startRowKey==null || startRowKey.equals("")) && (endRowKey==null || endRowKey.equals(""))){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("查询参数有误！");
        }else{
            for(Object CGQBH: CGQBHArray){
                System.out.println("size: " + columnArray.size());
                if(columnArray.size()<=0){
                    // 获取所有列
                    Set<String> sensorColumns = getDataSchema(tableName, CGQBH.toString()).keySet();
                    sensorColumns.remove("CLSJ");
                    columnArray.addAll(sensorColumns);
                    System.out.println(columnArray);
                }
                String hbaseTableName = "CloudBridge:" + tableName + "." + CGQBH;
                Table hbaseTable = HBaseCli.getInstance().getHBaseTable(hbaseTableName);
                int sample = -1;
                JSONArray rangeData = HBaseCli.getInstance().query(hbaseTable,startRowKey,endRowKey,columnArray,limit,sample);
                data.put(CGQBH.toString(),rangeData);
            }
            System.out.println(data);
        }
        response.setData(data);
        return response.getHttpResponse();
    }
}

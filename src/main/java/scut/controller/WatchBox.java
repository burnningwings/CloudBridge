package scut.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.dbutils.ResultSetHandler;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import scut.base.HttpResponse;
import scut.util.Constants;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Map;

/**
 * Created by Carrod on 2018/4/19.
 */

@RestController
public class WatchBox {

    SimpleDateFormat sdf = new SimpleDateFormat("yy/MM/dd HH:mm:ss");
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT,Constants.MYSQL_URL,Constants.MYSQL_USERNAME,Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

    /**
     * 异步翻页
     * @param page
     * @param pageSize 切换为All时需强制为null，因此必须为Integer
     * @param bridgeName
     * @return
     */
    @RequestMapping(value = "/watch-box/list", method = RequestMethod.GET, produces = "application/json")
    public JSONObject tableList(int page, Integer pageSize, String bridgeName) {
        // 获取数据
        String whereStr = " ";
        if(!bridgeName.equals("全部")){
            whereStr = "where bridge_name='" + bridgeName + "'";
        }
        String sql = String.format(
                "select w.*,b.bridge_name,w_t.name as box_type_name " +
                        "from watch_box as w " +
                        "left join bridge_info as b on w.bridge_id = b.bridge_id " +
                        "left join watch_box_type as w_t on w.type_id = w_t.type_id " +
                        "%s limit %s offset %s"
                ,whereStr, pageSize,(page-1)*pageSize);
        String[] fields = new String[]{"name","box_number","box_type_name","description","node",
                                        "port_id","bridge_name","box_id","bridge_id","type_id"};
        // 获取翻页数据
        JSONArray data = new JSONArray();
        try {
            baseDao.querySingleObject(sql,new ResultSetHandler<String>(){
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    while(rs.next()){
                        JSONObject item = new JSONObject();
                        for(String filed: fields) {
                            item.put(filed, rs.getObject(filed) != null ? rs.getObject(filed) : "");
                        }
                        data.add(item);
                    }
                    return null;
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }
        // 获取总数
        sql = String.format(
                "select count(*) as count " +
                        "from watch_box as w " +
                        "left join bridge_info as b on w.bridge_id = b.bridge_id " +
                        "left join watch_box_type as w_t on w.type_id = w_t.type_id " +
                        "%s"
                ,whereStr);
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

    @RequestMapping(value = "/watch-box/dropdown", method = RequestMethod.GET, produces = "application/json")
    public JSONObject dropDownList() {
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String sql = "select bridge_id,bridge_name from bridge_info";
        try {
            baseDao.querySingleObject(sql,new ResultSetHandler<String>(){
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

    @RequestMapping(value = "/watch-box/info", method = RequestMethod.GET, produces = "application/json")
    public JSONObject createWatchBoxInfo(String watch_box_id) {
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        // 桥梁信息
        String bridgeSql = "select bridge_id,bridge_name from bridge_info";
        JSONObject bridge = new JSONObject();
        try {
            baseDao.querySingleObject(bridgeSql,new ResultSetHandler<String>(){
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    while(rs.next()){
                        bridge.put(rs.getString("bridge_id"),rs.getString("bridge_name"));
                    }
                    return null;
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }
        data.put("bridge_list",bridge);

        // 测控箱类型信息
        JSONObject watchBoxType = new JSONObject();
        String watchBoxTypeSql = "select type_id,name from watch_box_type";
        try {
            baseDao.querySingleObject(watchBoxTypeSql,new ResultSetHandler<String>(){
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    while(rs.next()){
                        watchBoxType.put(rs.getString("type_id"),rs.getString("name"));
                    }
                    return null;
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }
        data.put("watch_box_type_list",watchBoxType);

        // 假如是更新操作
        JSONObject watchBox = new JSONObject();
        if(watch_box_id!=null && !watch_box_id.equals("")){
            String watchBoxSql = "select * from watch_box where box_id='%s'";
            String[] fields = new String[]{"name","description","box_number","node",
                    "port_id","comm_type","comm_address","begin_time","sample_interval","change_time_interval"};
            try {
                baseDao.querySingleObject(String.format(watchBoxSql,watch_box_id),new ResultSetHandler<String>(){
                    @Override
                    public String handle(ResultSet rs) throws SQLException {
                        if(rs.next()){
                            for(String field: fields){
                                watchBox.put(field,rs.getObject(field)!=null?rs.getString(field):"");
                            }
                        }
                        return null;
                    }
                });
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        data.put("watch_box",watchBox);
        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/watch-box/create-or-update", method = RequestMethod.POST, produces = "application/json")
    public JSONObject createWatchBox(@RequestBody Map<String,Object> reqMsg) {
        HttpResponse response = new HttpResponse();
        String operation_type = reqMsg.get("operation_type").toString();
        Object box_id = reqMsg.get("box_id");
        Object comm_address = reqMsg.get("comm_address");
        Object description = reqMsg.get("description");
        Object comm_type = reqMsg.get("comm_type");
        Object port_id = reqMsg.get("port_id");
        Object begin_time = reqMsg.get("begin_time");

        // 避免null转为"null"
        if(comm_address.equals("")){
            comm_address = null;
        }else{
            comm_address = String.format("'%s'",comm_address);
        }

        if(description.equals("")){
            description = null;
        }else{
            description = String.format("'%s'",description);
        }

        if(comm_type.equals("")){
            comm_type = null;
        }else{
            comm_type = String.format("'%s'",comm_type);
        }

        if(port_id.equals("")){
            port_id = null;
        }else{
            port_id = String.format("'%s'",port_id);
        }

        if( begin_time.equals("")){
            begin_time = sdf.format(new Date());
        }

        // 必须参数
        Object bridge_id = reqMsg.get("bridge_id");
        Object type_id = reqMsg.get("type_id");
        Object name = reqMsg.get("name");
        Object box_number = reqMsg.get("box_number");
        Object node = reqMsg.get("node");
        Object sample_interval = reqMsg.get("sample_interval");
        Object change_time_interval = reqMsg.get("change_time_interval");
        // 检查必须参数是否完整
        if(bridge_id==null || bridge_id.equals("")
                || type_id==null || type_id.equals("")
                || name==null || name.equals("")
                || box_number==null || box_number.equals("")
                || node==null || node.equals("")
                || sample_interval==null || sample_interval.equals("")
                || change_time_interval==null || change_time_interval.equals("")){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("错误，相关参数为空！");
            return response.getHttpResponse();
        }

        // 检查参数类型是否合法
        if(!bridge_id.toString().matches("\\d+?") || !type_id.toString().matches("\\d+?")
                || !sample_interval.toString().matches("\\d+?")
                || !change_time_interval.toString().matches("\\d+?")){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("参数类型错误！");
            return response.getHttpResponse();
        }

        JSONObject data = new JSONObject();
        String last_update = sdf.format(new Date());
        String executeWatchBoxSqlFormat = "insert into " +
                "watch_box(box_number,comm_address,description,name,comm_type,port_id,begin_time," +
                    "sample_interval,change_time_interval,node,bridge_id,type_id,last_update) " +
                "values('%s',%s,%s,'%s',%s,%s,'%s',%s,%s,'%s',%s,%s,'%s')";
        String sql = String.format(executeWatchBoxSqlFormat,box_number,comm_address,description,name,comm_type,
                    port_id,begin_time,sample_interval,change_time_interval,node,bridge_id,type_id,last_update);
        if(operation_type!=null && operation_type.equalsIgnoreCase("update")){
            executeWatchBoxSqlFormat = "update watch_box " +
                    "set box_number='%s',comm_address=%s,description=%s,name='%s',comm_type=%s," +
                    "port_id=%s,begin_time='%s',sample_interval=%s,change_time_interval=%s,node='%s'," +
                    "bridge_id=%s,type_id=%s,last_update='%s' where box_id=%s";
            sql = String.format(executeWatchBoxSqlFormat,box_number,comm_address,description,name,comm_type,
                    port_id,begin_time,sample_interval,change_time_interval,node,bridge_id,type_id,last_update,box_id);
        }
        int ret = 0;
        try {
            ret = baseDao.Execute(sql);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        if(ret!=1){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("操作失败！");
        }
        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/watch-box/delete", method = RequestMethod.POST, produces = "application/json")
    public JSONObject deleteWatchBox(@RequestBody Map<String,Object> reqMsg) {
        HttpResponse response = new HttpResponse();
        ArrayList<String> watch_box_checked_list = (ArrayList<String>)reqMsg.get("watch_box_checked_list");
        JSONObject data = new JSONObject();
        String deleteWatchBoxSql = "delete from watch_box where box_id in (%s)";
        int ret = 0;
        try {
            ret = baseDao.Execute(String.format(deleteWatchBoxSql,String.join(",", watch_box_checked_list)));
        } catch (SQLException e) {
            e.printStackTrace();
        }
        if(ret<1){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("删除测控箱失败！");
        }
        response.setData(data);
        return response.getHttpResponse();
    }
}

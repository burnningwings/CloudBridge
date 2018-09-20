package scut.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.log4j.Logger;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import scut.base.HttpResponse;
import scut.service.authority.CurrentUser;
import scut.service.log.LogBase;
import scut.util.Constants;
import scut.util.StringUtil;

import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import java.text.SimpleDateFormat;
import java.util.Date;


/**
 * Created by riverluo on 2018/5/7.
 */
@RestController
public class Bridge {
    public static org.apache.log4j.Logger logger = Logger.getLogger(Bridge.class);
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT, Constants.MYSQL_URL, Constants.MYSQL_USERNAME, Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

    /**
     * 异步翻页
     *
     * @param model
     * @param page
     * @param pageSize 切换为All时需强制为null，因此必须为Integer
     * @return
     */
    @RequestMapping(value = "/bridge/list", method = RequestMethod.GET, produces = "application/json")
    public JSONObject bridgeList(Model model, Integer page, Integer pageSize) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);

        JSONObject response = new JSONObject();
        String sql = String.format("SELECT\n" +
                "	b.bridge_id,\n" +
                "	b.bridge_number,\n" +
                "	b.description,\n" +
                "	b.bridge_name,\n" +
                "	b.organization,\n" +
                "	bt.`name` AS bridge_type_name,\n" +
                "	bt.type_id AS bridge_type_id\n" +
                "FROM\n" +
                "	bridge_info AS b\n" +
                "INNER JOIN bridge_type AS bt ON b.type_id = bt.type_id\n" +
                "LIMIT %s,%s", (page - 1) * pageSize, pageSize);
        String[] fields = new String[]{"bridge_id", "bridge_name", "bridge_number", "organization", "description",
                "bridge_type_id", "bridge_type_name"};
        JSONArray data = baseDao.queryData(sql, fields);
        response.put("data", data);

        sql = "SELECT COUNT(*) AS total FROM bridge_info";
        fields = new String[]{"total"};
        data = baseDao.queryData(sql, fields);
        response.put("total", data.getJSONObject(0).get("total"));
        return response;
    }

    /**
     * 查询指定桥梁信息
     *
     * @param bridgeId 桥梁id 如无则为null
     * @return
     */
    @RequestMapping(value = "/bridge/info", method = RequestMethod.GET, produces = "application/json")
    public JSONObject bridgeInfo(Integer bridgeId) {
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        //查询指定桥梁信息
        if (bridgeId != null) {
            String sql = String.format("SELECT\n" +
                    "	b.bridge_id,\n" +
                    "	b.bridge_number,\n" +
                    "	b.description,\n" +
                    "	b.bridge_name,\n" +
                    "	b.organization,\n" +
                    "	b.type_id AS bridge_type_id\n" +
                    "FROM\n" +
                    "	bridge_info AS b\n" +
                    "WHERE\n" +
                    "	b.bridge_id = %d", bridgeId);
            String[] fields = new String[]{"bridge_name", "bridge_number", "bridge_type_id", "organization", "description"};
            JSONArray bridgeInfo = baseDao.queryData(sql, fields);
            data.put("bridge_info", bridgeInfo);
        }

        //查询桥梁类型列表
        String sql = "SELECT\n" +
                "bt.`name` AS bridge_type_name,\n" +
                "bt.type_id AS bridge_type_id\n" +
                "FROM\n" +
                "bridge_type AS bt";
        String[] fields = new String[]{"bridge_type_id", "bridge_type_name"};
        JSONArray bridgeTypeList = baseDao.queryData(sql, fields);
        data.put("bridge_type_list", bridgeTypeList);

        response.setData(data);
        return response.getHttpResponse();
    }

    /**
     * 新增或修改桥梁信息
     *
     * @param reqMsg 参数
     * @return
     */
    @RequestMapping(value = "/bridge/create-or-update", method = RequestMethod.POST, produces = "application/json")
    public JSONObject createOrUpdateBridge(@RequestBody JSONObject reqMsg) {
        HttpResponse response = new HttpResponse();
        Integer bridgeId = reqMsg.getInteger("bridgeId");
        String operationType = reqMsg.getString("operationType");
        String bridgeName = reqMsg.getString("bridgeName");
        String bridgeNumber = reqMsg.getString("bridgeNumber");
        Integer bridgeTypeId = reqMsg.getInteger("bridgeTypeId");
        String organization = reqMsg.getString("organization");
        String description = reqMsg.getString("description");

        String old_bridgeName = reqMsg.getString("old_bridge_name");
        String old_bridgeNumber = reqMsg.getString("old_bridge_number");
        Integer old_bridgeTypeId = reqMsg.getInteger("old_bridge_type_id");
        String old_organization = reqMsg.getString("old_organization");


        logger.info(reqMsg.toString());

        //检查必须参数
        if (operationType == null || StringUtil.isEmpty(bridgeName) || StringUtil.isEmpty(bridgeNumber) || bridgeTypeId == null) {
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("参数错误！");
            return response.getHttpResponse();
        }

        String curTime = sdf.format(new Date());
        //插入数据语句
        String sql = null;
        if ("insert".equals(operationType)) {
            sql = String.format("INSERT INTO bridge_info(bridge_name,bridge_number,type_id,organization,description,create_time,last_update)" +
                    " VALUES('%s','%s',%s,'%s','%s','%s','%s')", bridgeName, bridgeNumber, bridgeTypeId, organization, description, curTime, curTime);
        }
        //更新数据语句
        if ("update".equals(operationType) && bridgeId != null) {
            sql = String.format("UPDATE bridge_info SET bridge_name='%s',bridge_number='%s',type_id=%s,organization='%s',description='%s',last_update='%s'" +
                    " WHERE bridge_id=%s", bridgeName, bridgeNumber, bridgeTypeId, organization, description, curTime, bridgeId);
        }

        //执行操作
        int ret = 0;
        if (sql != null) {
            ret = baseDao.updateData(sql);
        }
        if (ret != 1) {
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("操作失败！");
        }

        //桥梁修改日志写进数据库
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String log_bridge_sql = LogBase.log_bridge(userDetails.getUsername(),
                bridgeName,old_bridgeName,bridgeNumber,old_bridgeNumber,
                bridgeTypeId,old_bridgeTypeId,organization,old_organization);
        logger.info(log_bridge_sql);
        baseDao.updateData(log_bridge_sql);
        return response.getHttpResponse();
    }

    /**
     * 删除桥梁
     *
     * @param reqMsg 参数
     * @return
     */
    @RequestMapping(value = "/bridge/delete", method = RequestMethod.POST, produces = "application/json")
    public JSONObject deleteBridge(@RequestBody JSONObject reqMsg) {
        HttpResponse response = new HttpResponse();
        String checkedListStr = reqMsg.getString("checkedList");
        if (checkedListStr != null) {
            String sql = String.format("DELETE FROM bridge_info WHERE bridge_id IN (%s)", checkedListStr);
            int ret = baseDao.updateData(sql);
            if (ret > 0) {
                return response.getHttpResponse();
            }
        }

        response.setStatus(HttpResponse.FAIL_STATUS);
        response.setCode(HttpResponse.FAIL_CODE);
        response.setMsg("删除桥梁失败！");
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/bridge/simple-list", method = RequestMethod.GET, produces = "application/json")
    public JSONObject bridgeSimpleList() {
        JSONObject response = new JSONObject();

        String sql = "SELECT b.bridge_id,b.bridge_name FROM bridge_info b";
        String[] fields = new String[]{"bridge_id", "bridge_name"};
        JSONArray data = baseDao.queryData(sql, fields);

        response.put("data", data);
        return response;
    }
}

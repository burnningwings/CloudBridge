package scut.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sun.org.apache.regexp.internal.RE;
import org.springframework.web.bind.annotation.*;
import scut.base.HttpResponse;
import scut.util.Constants;
import scut.util.StringUtil;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by riverluo on 2018/5/10.
 */
@RestController
public class Section {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT, Constants.MYSQL_URL, Constants.MYSQL_USERNAME, Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

    /**
     * 截面信息列表
     *
     * @param page
     * @param pageSize
     * @param bridgeId
     * @return
     */
    @RequestMapping(value = "/section/list", method = RequestMethod.GET, produces = "application/json")
    public JSONObject sectionList(Integer page, Integer pageSize, Integer bridgeId) {
        JSONObject response = new JSONObject();
        String whereStr = "";
        if (bridgeId != null && bridgeId != 0) {
            whereStr = String.format(" WHERE s.bridge_id = %s", bridgeId);
        }
        String sql = String.format("SELECT\n" +
                "	s.section_id,\n" +
                "	s.description,\n" +
                "	s.`name` AS section_name,\n" +
                "	s.position,\n" +
                "	s.section_number,\n" +
                "	b.bridge_id,\n" +
                "	b.bridge_name\n" +
                "FROM\n" +
                "	section AS s\n" +
                "INNER JOIN bridge_info AS b ON s.bridge_id = b.bridge_id\n" +
                " %s LIMIT %s,%s", whereStr, (page - 1) * pageSize, pageSize);

        String[] fields = new String[]{"section_id", "section_name", "section_number", "position", "description", "bridge_id", "bridge_name"};
        JSONArray data = baseDao.queryData(sql, fields);
        response.put("data", data);

        sql = String.format("SELECT COUNT(*) AS total FROM section s %s", whereStr);
        fields = new String[]{"total"};
        data = baseDao.queryData(sql, fields);
        response.put("total", data.getJSONObject(0).get("total"));

        return response;
    }

    /**
     * 截面信息
     *
     * @param sectionId
     * @return
     */
    @RequestMapping(value = "/section/info", method = RequestMethod.GET, produces = "application/json")
    public JSONObject sectionInfo(Integer sectionId) {
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        if (sectionId != null) {
            String sql = String.format("SELECT\n" +
                    "	s.`name` AS section_name,\n" +
                    "	s.section_number,\n" +
                    "	s.bridge_id,\n" +
                    "	s.position,\n" +
                    "	s.description,\n" +
                    "	s.section_id\n" +
                    "FROM\n" +
                    "	section AS s\n" +
                    "WHERE\n" +
                    "	s.section_id = %s", sectionId);
            String[] fields = new String[]{"section_id", "section_name", "section_number", "position", "description", "bridge_id"};
            JSONArray sectionInfo = baseDao.queryData(sql, fields);
            data.put("section_info", sectionInfo);
        }

        String sql = "SELECT\n" +
                "	b.bridge_id,\n" +
                "	b.bridge_name\n" +
                "FROM\n" +
                "	bridge_info AS b";
        String[] fields = new String[]{"bridge_id", "bridge_name"};
        JSONArray bridgeList = baseDao.queryData(sql, fields);
        data.put("bridge_list", bridgeList);

        response.setData(data);
        return response.getHttpResponse();
    }

    /**
     * 新增或者更新截面
     *
     * @param reqMsg
     * @return
     */
    @RequestMapping(value = "/section/create-or-update", method = RequestMethod.POST, produces = "application/json")
    public JSONObject createOrUpdate(@RequestBody JSONObject reqMsg) {
        HttpResponse response = new HttpResponse();
        Integer sectionId = reqMsg.getInteger("sectionId");
        Integer bridgeId = reqMsg.getInteger("bridgeId");
        String operationType = reqMsg.getString("operationType");
        String sectionName = reqMsg.getString("sectionName");
        String sectionNumber = reqMsg.getString("sectionNumber");
        String position = reqMsg.getString("position");
        String description = reqMsg.getString("description");

        //检查必须参数
        if (operationType == null || StringUtil.isEmpty(sectionName) || StringUtil.isEmpty(sectionNumber) || bridgeId == null) {
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("参数错误！");
            return response.getHttpResponse();
        }

        String curTime = sdf.format(new Date());
        //插入数据语句
        String sql = null;
        if ("insert".equals(operationType)) {
            sql = String.format("INSERT INTO section(name,section_number,bridge_id,position,description,last_update)" +
                    " VALUES('%s','%s',%s,'%s','%s','%s')", sectionName, sectionNumber, bridgeId, position, description, curTime);
        }
        //更新数据语句
        if ("update".equals(operationType) && sectionId != null) {
            sql = String.format("UPDATE section SET name='%s',section_number='%s',bridge_id=%s,position='%s',description='%s',last_update='%s'" +
                    " WHERE section_id=%s", sectionName, sectionNumber, bridgeId, position, description, curTime, sectionId);
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
        return response.getHttpResponse();
    }

    /**
     * 删除截面
     *
     * @param reqMsg
     * @return
     */
    @RequestMapping(value = "/section/delete", method = RequestMethod.POST, produces = "application/json")
    public JSONObject delete(@RequestBody JSONObject reqMsg) {
        HttpResponse response = new HttpResponse();
        String checkedListStr = reqMsg.getString("checkedList");
        if (checkedListStr != null) {
            String sql = String.format("DELETE FROM section WHERE section_id IN (%s)", checkedListStr);
            int ret = baseDao.updateData(sql);
            if (ret > 0) {
                return response.getHttpResponse();
            }
        }

        response.setStatus(HttpResponse.FAIL_STATUS);
        response.setCode(HttpResponse.FAIL_CODE);
        response.setMsg("删除截面失败！");
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/section/simple-list", method = RequestMethod.GET, produces = "application/json")
    public JSONObject sectionSimpleList(Integer bridgeId) {
        JSONObject response = new JSONObject();
        if (bridgeId != null) {
            String sql = String.format("SELECT\n" +
                    "	s.section_id,\n" +
                    "	s.`name` AS section_name\n" +
                    "FROM\n" +
                    "	section AS s\n" +
                    "WHERE\n" +
                    "	s.bridge_id = %s", bridgeId);
            String[] fields = new String[]{"section_id", "section_name"};
            JSONArray data = baseDao.queryData(sql, fields);
            response.put("data", data);
        }
        return response;
    }
}

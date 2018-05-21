package scut.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import scut.base.HttpResponse;
import scut.util.Constants;
import scut.util.StringUtil;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by riverluo on 2018/5/11.
 */
@RestController
public class WatchPoint {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT, Constants.MYSQL_URL, Constants.MYSQL_USERNAME, Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

    /**
     * 获取监测点列表
     *
     * @param page
     * @param pageSize
     * @param bridgeId
     * @param sectionId
     * @return
     */
    @RequestMapping(value = "/watch-point/list", method = RequestMethod.GET, produces = "application/json")
    public JSONObject watchPointList(Integer page, Integer pageSize, Integer bridgeId, Integer sectionId) {
        JSONObject response = new JSONObject();
        String whereStr = "";
        if (bridgeId != null && bridgeId != 0) {
            whereStr = String.format(" WHERE b.bridge_id=%s ", bridgeId);
            if (sectionId != null && sectionId != 0) {
                whereStr = String.format(" AND s.section_id=%s ", sectionId);
            }
        }

        String sql = String.format("SELECT\n" +
                "	wp.point_id AS watch_point_id,\n" +
                "	wp.description,\n" +
                "	wp.`name` AS watch_point_name,\n" +
                "	wp.position,\n" +
                "	wp.watch_point_number,\n" +
                "	s.section_id,\n" +
                "	s.`name` AS section_name,\n" +
                "	b.bridge_id,\n" +
                "	b.bridge_name\n" +
                "FROM\n" +
                "	watch_point AS wp\n" +
                "INNER JOIN section AS s ON wp.section_id = s.section_id\n" +
                "INNER JOIN bridge_info AS b ON s.bridge_id = b.bridge_id\n" +
                " %s LIMIT %s,%s", whereStr, (page - 1) * pageSize, pageSize);

        String[] fields = new String[]{"watch_point_id", "watch_point_name", "watch_point_number", "position", "description",
                "section_id", "section_name", "bridge_id", "bridge_name"};
        JSONArray data = baseDao.queryData(sql, fields);
        response.put("data", data);

        sql = String.format("SELECT\n" +
                "	Count(*) AS total\n" +
                "FROM\n" +
                "	watch_point AS wp\n" +
                "INNER JOIN section AS s ON wp.section_id = s.section_id\n" +
                "INNER JOIN bridge_info AS b ON s.bridge_id = b.bridge_id\n" +
                " %s ", whereStr);
        fields = new String[]{"total"};
        data = baseDao.queryData(sql, fields);
        response.put("total", data.getJSONObject(0).get("total"));

        return response;
    }

    /**
     * 获取监测点信息
     *
     * @param watchPointId
     * @param bridgeId
     * @return
     */
    @RequestMapping(value = "/watch-point/info", method = RequestMethod.GET, produces = "application/json")
    public JSONObject watchPointInfo(Integer watchPointId, Integer bridgeId) {
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        if (watchPointId != null) {
            String sql = String.format("SELECT\n" +
                    "	wp.point_id AS watch_point_id,\n" +
                    "	wp.description,\n" +
                    "	wp.`name` AS watch_point_name,\n" +
                    "	wp.position,\n" +
                    "	wp.watch_point_number,\n" +
                    "	wp.position_x,\n" +
                    "	wp.relative_pos,\n" +
                    "	wp.wave_length,\n" +
                    "	wp.wave_length_t,\n" +
                    "	wp.positive_gain,\n" +
                    "	wp.negative_gain,\n" +
                    "	wp.negative_t_gain,\n" +
                    "	wp.positive_t_gain,\n" +
                    "	wp.section_id,\n" +
                    "	s.bridge_id\n" +
                    "FROM\n" +
                    "	watch_point AS wp\n" +
                    "INNER JOIN section AS s ON wp.section_id = s.section_id\n" +
                    "WHERE\n" +
                    "	wp.point_id = %s", watchPointId);
            String[] fields = new String[]{"watch_point_id", "watch_point_name", "watch_point_number", "position", "description",
                    "position_x", "relative_pos", "wave_length", "wave_length_t", "positive_gain", "negative_gain", "negative_t_gain",
                    "positive_t_gain", "section_id", "bridge_id"};
            JSONArray watchPointInfo = baseDao.queryData(sql, fields);
            bridgeId = watchPointInfo.getJSONObject(0).getInteger("bridge_id"); //所属桥梁 TODO:列表为空处理
            data.put("watch_point_info", watchPointInfo);
        }

        //查询桥梁列表
        String sql = "SELECT\n" +
                "	b.bridge_id,\n" +
                "	b.bridge_name\n" +
                "FROM\n" +
                "	bridge_info AS b";
        String[] fields = new String[]{"bridge_id", "bridge_name"};
        JSONArray bridgeList = baseDao.queryData(sql, fields);
        data.put("bridge_list", bridgeList);
        if (bridgeId == null || bridgeId == 0) { //当没有所属桥梁时 取桥梁列表中第一座桥梁作为默认桥梁
            bridgeId = bridgeList.getJSONObject(0).getInteger("bridge_id");//TODO:列表为空处理
        }

        //查询截面列表
        sql = String.format("SELECT\n" +
                "	s.section_id,\n" +
                "	s.`name` AS section_name\n" +
                "FROM\n" +
                "	section AS s\n" +
                "WHERE\n" +
                "	s.bridge_id = %s", bridgeId);
        fields = new String[]{"section_id", "section_name"};
        JSONArray sectionList = baseDao.queryData(sql, fields);
        data.put("section_list", sectionList);

        response.setData(data);
        return response.getHttpResponse();
    }

    /**
     * 新增或修改监测点
     *
     * @param reqMsg
     * @return
     */
    @RequestMapping(value = "/watch-point/create-or-update", method = RequestMethod.POST, produces = "application/json")
    public JSONObject createOrUpdate(@RequestBody JSONObject reqMsg) {
        HttpResponse response = new HttpResponse();
        Integer watchPointId = reqMsg.getInteger("watchPointId");
        String operationType = reqMsg.getString("operationType");
        String watchPointName = reqMsg.getString("watchPointName");
        String watchPointNumber = reqMsg.getString("watchPointNumber");
        Integer bridgeId = reqMsg.getInteger("bridgeId");
        Integer sectionId = reqMsg.getInteger("sectionId");
        String position = reqMsg.getString("position");
        String description = reqMsg.getString("description");
        Double positionX = reqMsg.getDouble("positionX");
        String relativePos = reqMsg.getString("relativePos");
        Double waveLength = reqMsg.getDouble("waveLength");
        Double waveLengthT = reqMsg.getDouble("waveLengthT");
        Double positiveGain = reqMsg.getDouble("positiveGain");
        Double negativeGain = reqMsg.getDouble("negativeGain");
        Double negativeTGain = reqMsg.getDouble("negativeTGain");
        Double positiveTGain = reqMsg.getDouble("positiveTGain");

        //检查必须参数
        if (operationType == null || StringUtil.isEmpty(watchPointName) || StringUtil.isEmpty(watchPointNumber) || bridgeId == null || sectionId == null) {
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("参数错误！");
            return response.getHttpResponse();
        }

        String curTime = sdf.format(new Date());
        //插入数据语句
        String sql = null;
        if ("insert".equals(operationType)) {
            sql = String.format("INSERT INTO watch_point(name,watch_point_number,position,description,section_id,last_update," +
                            "position_x,relative_pos,wave_length,wave_length_t,positive_gain,negative_gain,positive_t_gain,negative_t_gain)" +
                            " VALUES('%s','%s','%s','%s',%d,'%s',%f,'%s',%f,%f,%f,%f,%f,%f)", watchPointName, watchPointNumber, position,
                    description, sectionId, curTime, positionX, relativePos, waveLength, waveLengthT, positiveGain, negativeGain, positiveTGain, negativeTGain);
        }
        //更新数据语句
        if ("update".equals(operationType) && watchPointId != null) {
            sql = String.format("UPDATE watch_point SET name='%s',watch_point_number='%s',position='%s',description='%s',section_id=%d,last_update='%s'," +
                            "position_x=%f,relative_pos='%s',wave_length=%f,wave_length_t=%f,positive_gain=%f,negative_gain=%f,positive_t_gain=%f,negative_t_gain=%f" +
                            " WHERE point_id=%d", watchPointName, watchPointNumber, position, description, sectionId, curTime, positionX, relativePos, waveLength,
                    waveLengthT, positiveGain, negativeGain, positiveTGain, negativeTGain, watchPointId);
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
     * 删除监测点
     *
     * @param reqMsg
     * @return
     */
    @RequestMapping(value = "/watch-point/delete", method = RequestMethod.POST, produces = "application/json")
    public JSONObject delete(@RequestBody JSONObject reqMsg) {
        HttpResponse response = new HttpResponse();
        String checkedListStr = reqMsg.getString("checkedList");
        if (checkedListStr != null) {
            String sql = String.format("DELETE FROM watch_point WHERE point_id IN (%s)", checkedListStr);
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

    @RequestMapping(value = "/watch-point/simple-list", method = RequestMethod.GET, produces = "application/json")
    public JSONObject watchPointSimpleList(Integer sectionId) {
        JSONObject response = new JSONObject();
        if (sectionId != null) {
            String sql = String.format("SELECT\n" +
                    "	wp.point_id AS watch_point_id,\n" +
                    "	wp.`name` AS watch_point_name\n" +
                    "FROM\n" +
                    "	watch_point AS wp\n" +
                    "WHERE\n" +
                    "	wp.section_id = %s", sectionId);
            String[] fields = new String[]{"watch_point_id", "watch_point_name"};
            JSONArray data = baseDao.queryData(sql, fields);
            response.put("data", data);
        }
        return response;
    }
}

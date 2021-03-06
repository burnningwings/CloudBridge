package scut.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import scut.base.HttpResponse;
import scut.service.SysUserService;
import scut.util.Constants;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by riverluo on 2018/5/13.
 */
@RestController
public class Sensor {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT, Constants.MYSQL_URL, Constants.MYSQL_USERNAME, Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

    @Resource
    SysUserService sysUserService;

    /**
     * 传感器信息列表
     *
     * @param page
     * @param pageSize
     * @param bridgeId
     * @param sectionId
     * @param watchPointId
     * @param watchBoxId
     * @return
     */
    @RequestMapping(value = "/sensor/list", method = RequestMethod.GET, produces = "application/json")
    public JSONObject sensorList(Long page, Long pageSize, Long bridgeId, Long sectionId, Long watchPointId, Long watchBoxId) {
        long userOrganizationId = sysUserService.getUserOrganizationId();
        JSONObject response = new JSONObject();

        String whereStr = String.format("WHERE\n" +
            "   b.bridge_id IN (\n" +
            "      SELECT\n" +
            "         bo.bridge_id\n" +
            "      FROM\n" +
            "         bridge_organization AS bo\n" +
            "      WHERE\n" +
            "         bo.organization_id = %d\n" +
            "   )", userOrganizationId);
        if (bridgeId != null && bridgeId != 0) {
            whereStr += String.format(" AND b.bridge_id=%s ", bridgeId);
            if (sectionId != null && sectionId != 0) {
                whereStr += String.format(" AND sec.section_id=%s ", sectionId);
                if (watchPointId != null && watchPointId != 0) {
                    whereStr += String.format(" AND wp.point_id=%s ", watchPointId);
                }
            }
            if (watchBoxId != null && watchBoxId != 0) {
                whereStr += String.format("  AND wb.box_id=%s ", watchBoxId);
            }
        }


        String sql = String.format("SELECT\n" +
            "	s.sensor_id,\n" +
            "	s.`name` AS sensor_name,\n" +
            "	s.sensor_number,\n" +
            "	s.sensor_position,\n" +
            "	st.type_id AS sensor_type_id,\n" +
            "	st.`name` AS sensor_type_name,\n" +
            "	wb.box_id AS watch_box_id,\n" +
            "	wb.`name` AS watch_box_name,\n" +
            "	wp.point_id AS watch_point_id,\n" +
            "	wp.`name` AS watch_point_name,\n" +
            "	sec.section_id,\n" +
            "	sec.`name` AS section_name,\n" +
            "	b.bridge_id,\n" +
            "	b.bridge_name\n" +
            "FROM\n" +
            "	sensor_info AS s\n" +
            "INNER JOIN sensor_type AS st ON s.type_id = st.type_id\n" +
            "INNER JOIN watch_point AS wp ON s.point_id = wp.point_id\n" +
            "INNER JOIN watch_box AS wb ON s.box_id = wb.box_id\n" +
            "INNER JOIN bridge_info AS b ON wb.bridge_id = b.bridge_id\n" +
            "INNER JOIN section AS sec ON sec.bridge_id = b.bridge_id\n" +
            "AND wp.section_id = sec.section_id\n" +
            " %s LIMIT %s,%s", whereStr, (page - 1) * pageSize, pageSize);
        String[] fields = new String[]{"sensor_id", "sensor_name", "sensor_number", "sensor_position", "sensor_type_id", "sensor_type_name",
            "watch_box_id", "watch_box_name", "watch_point_id", "watch_point_name", "section_id", "section_name", "bridge_id", "bridge_name",};
        JSONArray data = baseDao.queryData(sql, fields);
        response.put("data", data);

        sql = String.format("SELECT\n" +
            "	Count(*) AS total\n" +
            "FROM\n" +
            "	sensor_info AS s\n" +
            "INNER JOIN watch_point AS wp ON s.point_id = wp.point_id\n" +
            "INNER JOIN watch_box AS wb ON s.box_id = wb.box_id\n" +
            "INNER JOIN bridge_info AS b ON wb.bridge_id = b.bridge_id\n" +
            "INNER JOIN section AS sec ON sec.bridge_id = b.bridge_id\n" +
            "AND wp.section_id = sec.section_id\n" +
            " %s ", whereStr);
        fields = new String[]{"total"};
        data = baseDao.queryData(sql, fields);
        response.put("total", data.getJSONObject(0).get("total"));

        return response;
    }

    /**
     * 传感器信息
     *
     * @param sensorId
     * @param bridgeId
     * @param sectionId
     * @return
     */
    @RequestMapping(value = "/sensor/info", method = RequestMethod.GET, produces = "application/json")
    public JSONObject sensorInfo(Long sensorId, Long bridgeId, Long sectionId) {
        long userOrganizationId = sysUserService.getUserOrganizationId();
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        Integer sensorTypeId = null;
        //查询传感器信息
        if (sensorId != null) {
            String sql = String.format("SELECT\n" +
                "	s.sensor_id,\n" +
                "	s.`name` AS sensor_name,\n" +
                "	s.sensor_number,\n" +
                "	s.sensor_position,\n" +
                "	s.type_id AS sensor_type_id,\n" +
                "	wp.point_id AS watch_point_id,\n" +
                "	s.box_id AS watch_box_id,\n" +
                "	sec.section_id,\n" +
                "	sec.bridge_id\n" +
                "FROM\n" +
                "	sensor_info AS s\n" +
                "INNER JOIN watch_point AS wp ON s.point_id = wp.point_id\n" +
                "INNER JOIN section AS sec ON wp.section_id = sec.section_id\n" +
                "WHERE\n" +
                "	s.sensor_id = %s\n" +
                "AND\n" +
                "   sec.bridge_id IN (\n" +
                "      SELECT\n" +
                "         bo.bridge_id\n" +
                "      FROM\n" +
                "         bridge_organization AS bo\n" +
                "      WHERE\n" +
                "         bo.organization_id = %d\n" +
                "   )", sensorId, userOrganizationId);
            String[] fields = new String[]{"sensor_id", "sensor_name", "sensor_number", "sensor_position", "sensor_type_id",
                "watch_point_id", "watch_box_id", "section_id", "bridge_id"};
            JSONArray sensorInfo = baseDao.queryData(sql, fields);
            data.put("sensor_info", sensorInfo);
            if (sensorInfo.size() > 0) {
                JSONObject si = sensorInfo.getJSONObject(0);
                bridgeId = si.getLong("bridge_id");
                sectionId = si.getLong("section_id");
                sensorTypeId = si.getInteger("sensor_type_id");
            }
        }
        //查询桥梁列表
        String sql = String.format("SELECT\n" +
            "	b.bridge_id,\n" +
            "	b.bridge_name\n" +
            "FROM\n" +
            "	bridge_info AS b\n" +
            "WHERE\n" +
            "   b.bridge_id IN (\n" +
            "      SELECT\n" +
            "         bo.bridge_id\n" +
            "      FROM\n" +
            "         bridge_organization AS bo\n" +
            "      WHERE\n" +
            "         bo.organization_id = %d\n" +
            "   )", userOrganizationId);
        String[] fields = new String[]{"bridge_id", "bridge_name"};
        JSONArray bridgeList = baseDao.queryData(sql, fields);
        data.put("bridge_list", bridgeList);
        if ((bridgeId == null || bridgeId == 0) && bridgeList.size() > 0) { //新增时未指定桥梁 取桥梁列表中第一座桥梁作为默认桥梁
            bridgeId = bridgeList.getJSONObject(0).getLong("bridge_id");
        }
        //查询截面列表
        sql = String.format("SELECT\n" +
            "	s.section_id,\n" +
            "	s.`name` AS section_name\n" +
            "FROM\n" +
            "	section AS s\n" +
            "WHERE\n" +
            "	s.bridge_id = %s\n" +
            "AND\n" +
            "   s.bridge_id IN (\n" +
            "      SELECT\n" +
            "         bo.bridge_id\n" +
            "      FROM\n" +
            "         bridge_organization AS bo\n" +
            "      WHERE\n" +
            "         bo.organization_id = %d\n" +
            "   )", bridgeId, userOrganizationId);
        fields = new String[]{"section_id", "section_name"};
        JSONArray sectionList = baseDao.queryData(sql, fields);
        data.put("section_list", sectionList);
        if ((sectionId == null || sectionId == 0) && sectionList.size() > 0) {
            sectionId = sectionList.getJSONObject(0).getLong("section_id");
        }
        //查询监测点列表
        sql = String.format("SELECT\n" +
            "	wp.point_id AS watch_point_id,\n" +
            "	wp.`name` AS watch_point_name\n" +
            "FROM\n" +
            "	watch_point AS wp\n" +
            "INNER JOIN\n" +
            "   section AS s\n" +
            "ON\n" +
            "   wp.section_id = s.section_id\n" +
            "WHERE\n" +
            "	wp.section_id = %s\n" +
            "AND\n" +
            "   s.bridge_id IN (\n" +
            "      SELECT\n" +
            "         bo.bridge_id\n" +
            "      FROM\n" +
            "         bridge_organization AS bo\n" +
            "      WHERE\n" +
            "         bo.organization_id = %d\n" +
            "   )", sectionId, userOrganizationId);
        fields = new String[]{"watch_point_id", "watch_point_name"};
        JSONArray watchPointList = baseDao.queryData(sql, fields);
        data.put("watch_point_list", watchPointList);
        //查询控制箱列表
        sql = String.format("SELECT\n" +
            "	wb.box_id AS watch_box_id,\n" +
            "	wb.`name` AS watch_box_name\n" +
            "FROM\n" +
            "	watch_box AS wb\n" +
            "WHERE\n" +
            "	wb.bridge_id = %s\n" +
            "AND\n" +
            "   wb.bridge_id IN (\n" +
            "      SELECT\n" +
            "         bo.bridge_id\n" +
            "      FROM\n" +
            "         bridge_organization AS bo\n" +
            "      WHERE\n" +
            "         bo.organization_id = %d\n" +
            "   )", bridgeId, userOrganizationId);
        fields = new String[]{"watch_box_id", "watch_box_name"};
        JSONArray watchBoxList = baseDao.queryData(sql, fields);
        data.put("watch_box_list", watchBoxList);
        //查询传感器类型类别
        //与 organization 无关
        sql = "SELECT\n" +
            "	st.type_id AS sensor_type_id,\n" +
            "	st.`name` AS sensor_type_name\n" +
            "FROM\n" +
            "	sensor_type AS st";
        fields = new String[]{"sensor_type_id", "sensor_type_name"};
        JSONArray sensorTypeList = baseDao.queryData(sql, fields);
        data.put("sensor_type_list", sensorTypeList);

        //查询传感器详细信息
        if (sensorId != null && sensorTypeId != null) {
            JSONArray sensorFullInfo = getSensorFullInfo(sensorId, sensorTypeId);
            if (sensorFullInfo != null) {
                data.put("sensor_full_info", sensorFullInfo);
            }
        }

        response.setData(data);
        return response.getHttpResponse();
    }

    /**
     * 删除传感器
     *
     * @param reqMsg
     * @return
     */
    // TODO: 检查有没有权限 && 单位是否相符
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/sensor/delete", method = RequestMethod.POST, produces = "application/json")
    public JSONObject deleteSensor(@RequestBody JSONObject reqMsg) {
        HttpResponse response = new HttpResponse();
        String checkedListStr = reqMsg.getString("checkedList");
        if (checkedListStr != null) {
            String sql = String.format("DELETE FROM sensor_info WHERE sensor_id IN (%s)", checkedListStr);
            int ret = baseDao.updateData(sql);
            if (ret > 0) {
                return response.getHttpResponse();
            }
        }

        response.setStatus(HttpResponse.FAIL_STATUS);
        response.setCode(HttpResponse.FAIL_CODE);
        response.setMsg("删除传感器失败！");

        return response.getHttpResponse();
    }


    /**
     * 获取不同类型传感器的详细信息
     *
     * @param sensorId
     * @param sensorTypeId
     * @return
     */
    private JSONArray getSensorFullInfo(Long sensorId, Integer sensorTypeId) {
        JSONArray fullInfo = null;
        if (sensorId != null && sensorTypeId != null) {
            String sql = null;
            String[] fields = null;
            switch (sensorTypeId) {   //传感器类型
                case 1:  //正弦传感器
                    sql = String.format("SELECT\n" +
                        "	ss.CSYB,\n" +
                        "	ss.CSSJ,\n" +
                        "	ss.QLJBZBXYDWD,\n" +
                        "	ss.CSWD,\n" +
                        "	ss.QLJBZBXYDJD,\n" +
                        "	ss.CGQZBX,\n" +
                        "	ss.QLJBZBXYDGC,\n" +
                        "	ss.CGQZBY,\n" +
                        "	ss.CGQZBZ,\n" +
                        "	ss.CGQJD,\n" +
                        "	ss.CGQSSMKLX,\n" +
                        "	ss.CGQSSMKBH,\n" +
                        "	ss.CGQSSMKTDH,\n" +
                        "	ss.sensor_id\n" +
                        "FROM\n" +
                        "	sin_sensor_info AS ss\n" +
                        "WHERE\n" +
                        "	ss.sensor_id = %s", sensorId);
                    fields = new String[]{"CSYB", "CSSJ", "QLJBZBXYDWD", "CSWD", "QLJBZBXYDJD", "CGQZBX", "QLJBZBXYDGC", "CGQZBY",
                        "CGQZBZ", "CGQJD", "CGQSSMKLX", "CGQSSMKBH", "CGQSSMKTDH", "sensor_id"};
                    break;
                case 2:  //光纤应变传感器
                    sql = String.format("SELECT\n" +
                        "	fs.QLJBZBXYDWD,\n" +
                        "	fs.QLJBZBXYDJD,\n" +
                        "	fs.QLJBZBXYDGC,\n" +
                        "	fs.CGQZBX,\n" +
                        "	fs.CGQZBY,\n" +
                        "	fs.CGQZBZ,\n" +
                        "	fs.CGQJD,\n" +
                        "	fs.CSBC,\n" +
                        "	fs.CSSJ,\n" +
                        "	fs.BCXS,\n" +
                        "	fs.CGQSSMKLX,\n" +
                        "	fs.CGQSSMKBH,\n" +
                        "	fs.CGQSSMKTDH,\n" +
                        "	fs.sensor_id\n" +
                        "FROM\n" +
                        "	fiber_sensor_info AS fs\n" +
                        "WHERE\n" +
                        "	fs.sensor_id = %s", sensorId);
                    fields = new String[]{"QLJBZBXYDWD", "QLJBZBXYDJD", "QLJBZBXYDGC", "CGQZBX", "CGQZBY", "CGQZBZ", "CGQJD",
                        "CSBC", "CSSJ", "BCXS", "CGQSSMKLX", "CGQSSMKBH", "CGQSSMKTDH", "sensor_id"};
                    break;
                case 3:  //GPS传感器
                    sql = String.format("SELECT\n" +
                        "	gs.QLJBZBXYDWD,\n" +
                        "	gs.QLJBZBXYDJD,\n" +
                        "	gs.QLJBZBXYDGC,\n" +
                        "	gs.CSZBX,\n" +
                        "	gs.CSZBY,\n" +
                        "	gs.CSZBZ,\n" +
                        "	gs.CGQJD,\n" +
                        "	gs.CSSJ,\n" +
                        "	gs.CGQCDBH,\n" +
                        "	gs.sensor_id\n" +
                        "FROM\n" +
                        "	gps_sensor_info AS gs\n" +
                        "WHERE\n" +
                        "	gs.sensor_id = %s", sensorId);
                    fields = new String[]{"QLJBZBXYDWD", "QLJBZBXYDJD", "QLJBZBXYDGC", "CSZBX", "CSZBY", "CSZBZ", "CGQJD",
                        "CSSJ", "CGQCDBH", "sensor_id"};
                    break;
                case 4:  //加速度传感器
                    sql = String.format("SELECT\n" +
                        "	`as`.QLJBZBXYDWD,\n" +
                        "	`as`.QLJBZBXYDJD,\n" +
                        "	`as`.QLJBZBXYDGC,\n" +
                        "	`as`.CGQZBX,\n" +
                        "	`as`.CGQZBY,\n" +
                        "	`as`.CGQZBZ,\n" +
                        "	`as`.CGQJD,\n" +
                        "	`as`.CSSJ,\n" +
                        "	`as`.JSDXS,\n" +
                        "	`as`.CGQSSMKLX,\n" +
                        "	`as`.CGQSSMKBH,\n" +
                        "	`as`.CGQSSMKTDH,\n" +
                        "	`as`.sensor_id\n" +
                        "FROM\n" +
                        "	acce_sensor_info AS `as`\n" +
                        "WHERE\n" +
                        "	`as`.sensor_id = %s", sensorId);
                    fields = new String[]{"QLJBZBXYDWD", "QLJBZBXYDJD", "QLJBZBXYDGC", "CGQZBX", "CGQZBY", "CGQZBZ", "CGQJD",
                        "CSSJ", "JSDXS", "CGQSSMKLX", "CGQSSMKBH", "CGQSSMKTDH", "sensor_id"};
                    break;
                case 5:  //索力传感器
                    sql = String.format("SELECT\n" +
                        "	cs.QLJBZBXYDWD,\n" +
                        "	cs.QLJBZBXYDJD,\n" +
                        "	cs.QLJBZBXYDGC,\n" +
                        "	cs.CGQZBX,\n" +
                        "	cs.CGQZBY,\n" +
                        "	cs.CGQZBZ,\n" +
                        "	cs.CGQJD,\n" +
                        "	cs.CSSJ,\n" +
                        "	cs.JSDXS,\n" +
                        "	cs.SLXS,\n" +
                        "	cs.CGQSSMKLX,\n" +
                        "	cs.CGQSSMKBH,\n" +
                        "	cs.CGQSSMKTDH,\n" +
                        "	cs.sensor_id\n" +
                        "FROM\n" +
                        "	cable_sensor_info AS cs\n" +
                        "WHERE\n" +
                        "	cs.sensor_id = %s", sensorId);
                    fields = new String[]{"QLJBZBXYDWD", "QLJBZBXYDJD", "QLJBZBXYDGC", "CGQZBX", "CGQZBY", "CGQZBZ", "CGQJD",
                        "CSSJ", "JSDXS", "SLXS", "CGQSSMKLX", "CGQSSMKBH", "CGQSSMKTDH", "sensor_id"};
                    break;
                default:
                    break;
            }

            if (sql != null && fields != null) {
                fullInfo = baseDao.queryData(sql, fields);
            }
        }
        return fullInfo;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/sensor/create-or-update", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public JSONObject createOrUpdate(@RequestBody JSONObject request) {
        HttpResponse response = new HttpResponse();

        String operationType = request.getString("operationType");
        Long sensorId = request.getLong("sensorId");
        Integer sensorTypeId = request.getInteger("sensorTypeId");
        Long watchPointId = request.getLong("watchPointId");
        Long watchBoxId = request.getLong("watchBoxId");
        String sensorName = request.getString("sensorName");
        String sensorNumber = request.getString("sensorNumber");
        String sensorPosition = request.getString("sensorPosition");

        BigDecimal QLJBZBXYDWD;
        BigDecimal QLJBZBXYDJD;
        BigDecimal QLJBZBXYDGC;
        BigDecimal CGQZBX;
        BigDecimal CGQZBY;
        BigDecimal CGQZBZ;
        String CGQJD;
        BigDecimal CSYB;
        BigDecimal CSSJ;
        BigDecimal CSWD;
        BigDecimal CSZBX;
        BigDecimal CSZBY;
        BigDecimal CSZBZ;
        BigDecimal JSDXS;
        BigDecimal SLXS;
        BigDecimal CSBC;
        BigDecimal BCXS;
        String CGQSSMKLX;
        String CGQSSMKBH;
        String CGQSSMKTDH;
        String CGQCDBH;

        QLJBZBXYDWD = request.getBigDecimal("QLJBZBXYDWD");
        CGQJD = request.getString("CGQJD");
        CSSJ = request.getBigDecimal("CSSJ");
        QLJBZBXYDJD = request.getBigDecimal("QLJBZBXYDJD");
        QLJBZBXYDGC = request.getBigDecimal("QLJBZBXYDGC");

        List<String> sql = new ArrayList<>();
        String curTime = sdf.format(new Date());

        if ("insert".equals(operationType)) {
            sql.add(String.format(
                "INSERT INTO " +
                    "`CloudBridge`.`sensor_info` (" +
                    "`name`, " +
                    "`sensor_number`, " +
                    "`sensor_position`, " +
                    "`type_id`, " +
                    "`box_id`, " +
                    "`point_id`, " +
                    "`last_update`" +
                    ") VALUES (" +
                    "'%s', '%s', '%s', %d, %d, %d, '%s'" +
                    ")",
                sensorName, sensorNumber, sensorPosition, sensorTypeId, watchBoxId, watchPointId, curTime
            ));
            sql.add("SET @last_id = last_insert_id()");

            switch (sensorTypeId) { // 传感器类型
                case 1: // 正弦传感器
                    CSYB = request.getBigDecimal("CSYB");
                    CSWD = request.getBigDecimal("CSWD");
                    CGQZBY = request.getBigDecimal("CGQZBY");
                    CGQZBX = request.getBigDecimal("CGQZBX");
                    CGQZBZ = request.getBigDecimal("CGQZBZ");
                    CGQSSMKLX = request.getString("CGQSSMKLX");
                    CGQSSMKTDH = request.getString("CGQSSMKTDH");
                    CGQSSMKBH = request.getString("CGQSSMKBH");

                    sql.add(String.format(
                        "INSERT INTO " +
                            "`CloudBridge`.`sin_sensor_info` (" +
                            "`CSYB`, " +
                            "`CSSJ`, " +
                            "`CSWD`, " +
                            "`QLJBZBXYDWD`, " +
                            "`QLJBZBXYDJD`, " +
                            "`QLJBZBXYDGC`, " +
                            "`CGQZBX`, " +
                            "`CGQZBY`, " +
                            "`CGQZBZ`, " +
                            "`CGQJD`, " +
                            "`CGQSSMKLX`, " +
                            "`CGQSSMKBH`, " +
                            "`CGQSSMKTDH`, " +
                            "`sensor_id`" +
                            ") VALUES (" +
                            "%s, %s, %s, %s, %s, %s, %s, %s, %s, '%s', '%s', '%s', '%s', @last_id" +
                            ")",
                        CSYB, CSSJ, CSWD, QLJBZBXYDWD, QLJBZBXYDJD, QLJBZBXYDGC, CGQZBX, CGQZBY, CGQZBZ,
                        CGQJD, CGQSSMKLX, CGQSSMKBH, CGQSSMKTDH
                    ));
                    break;

                case 2: // 光纤应变传感器
                    CGQZBY = request.getBigDecimal("CGQZBY");
                    CGQZBX = request.getBigDecimal("CGQZBX");
                    CGQZBZ = request.getBigDecimal("CGQZBZ");
                    CSBC = request.getBigDecimal("CSBC");
                    BCXS = request.getBigDecimal("BCXS");
                    CGQSSMKLX = request.getString("CGQSSMKLX");
                    CGQSSMKTDH = request.getString("CGQSSMKTDH");
                    CGQSSMKBH = request.getString("CGQSSMKBH");

                    sql.add(String.format(
                        "INSERT INTO " +
                            "`CloudBridge`.`fiber_sensor_info` (" +
                            "`QLJBZBXYDWD`, " +
                            "`QLJBZBXYDJD`, " +
                            "`QLJBZBXYDGC`, " +
                            "`CGQZBX`, " +
                            "`CGQZBY`, " +
                            "`CGQZBZ`, " +
                            "`CGQJD`, " +
                            "`CSBC`, " +
                            "`CSSJ`, " +
                            "`BCXS`, " +
                            "`CGQSSMKLX`, " +
                            "`CGQSSMKBH`, " +
                            "`CGQSSMKTDH`, " +
                            "`sensor_id`" +
                            ") VALUES (" +
                            "%s, %s, %s, %s, %s, %s, '%s', %s, %s, %s, '%s', '%s', '%s', @last_id" +
                            ")",
                        QLJBZBXYDWD, QLJBZBXYDJD, QLJBZBXYDGC, CGQZBX, CGQZBY, CGQZBZ, CGQJD, CSBC, CSSJ, BCXS,
                        CGQSSMKLX, CGQSSMKBH, CGQSSMKTDH
                    ));
                    break;

                case 3: // GPS传感器
                    CSZBZ = request.getBigDecimal("CSZBZ");
                    CSZBX = request.getBigDecimal("CSZBX");
                    CGQCDBH = request.getString("CGQCDBH");
                    CSZBY = request.getBigDecimal("CSZBY");

                    sql.add(String.format(
                        "INSERT INTO " +
                            "`CloudBridge`.`gps_sensor_info` (" +
                            "`QLJBZBXYDWD`, " +
                            "`QLJBZBXYDJD`, " +
                            "`QLJBZBXYDGC`, " +
                            "`CSZBX`, " +
                            "`CSZBY`, " +
                            "`CSZBZ`, " +
                            "`CGQJD`, " +
                            "`CSSJ`, " +
                            "`CGQCDBH`, " +
                            "`sensor_id`" +
                            ") VALUES (" +
                            "%s, %s, %s, %s, %s, %s, '%s', %s, '%s', @last_id" +
                            ")",
                        QLJBZBXYDWD, QLJBZBXYDJD, QLJBZBXYDGC, CSZBX, CSZBY, CSZBZ, CGQJD,
                        CSSJ, CGQCDBH
                    ));
                    break;

                case 4: // 加速度传感器
                    CGQZBY = request.getBigDecimal("CGQZBY");
                    JSDXS = request.getBigDecimal("JSDXS");
                    CGQZBX = request.getBigDecimal("CGQZBX");
                    CGQZBZ = request.getBigDecimal("CGQZBZ");
                    CGQSSMKLX = request.getString("CGQSSMKLX");
                    CGQSSMKTDH = request.getString("CGQSSMKTDH");
                    CGQSSMKBH = request.getString("CGQSSMKBH");

                    sql.add(String.format(
                        "INSERT INTO " +
                            "`CloudBridge`.`acce_sensor_info` (" +
                            "`QLJBZBXYDWD`, " +
                            "`QLJBZBXYDJD`, " +
                            "`QLJBZBXYDGC`, " +
                            "`CGQZBX`, " +
                            "`CGQZBY`, " +
                            "`CGQZBZ`, " +
                            "`CGQJD`, " +
                            "`CSSJ`, " +
                            "`JSDXS`, " +
                            "`CGQSSMKLX`, " +
                            "`CGQSSMKBH`, " +
                            "`CGQSSMKTDH`, " +
                            "`sensor_id`" +
                            ") VALUES (" +
                            "%s, %s, %s, %s, %s, %s, '%s', %s, %s, '%s', '%s', '%s', @last_id" +
                            ")",
                        QLJBZBXYDWD, QLJBZBXYDJD, QLJBZBXYDGC, CGQZBX, CGQZBY, CGQZBZ, CGQJD, CSSJ,
                        JSDXS, CGQSSMKLX, CGQSSMKBH, CGQSSMKTDH
                    ));
                    break;

                case 5: // 索力传感器
                    CGQZBY = request.getBigDecimal("CGQZBY");
                    JSDXS = request.getBigDecimal("JSDXS");
                    CGQZBX = request.getBigDecimal("CGQZBX");
                    CGQZBZ = request.getBigDecimal("CGQZBZ");
                    SLXS = request.getBigDecimal("SLXS");
                    CGQSSMKLX = request.getString("CGQSSMKLX");
                    CGQSSMKTDH = request.getString("CGQSSMKTDH");
                    CGQSSMKBH = request.getString("CGQSSMKBH");

                    sql.add(String.format(
                        "INSERT INTO " +
                            "`CloudBridge`.`cable_sensor_info` (" +
                            "`QLJBZBXYDWD`, " +
                            "`QLJBZBXYDJD`, " +
                            "`QLJBZBXYDGC`, " +
                            "`CGQZBX`, " +
                            "`CGQZBY`, " +
                            "`CGQZBZ`, " +
                            "`CGQJD`, " +
                            "`CSSJ`, " +
                            "`JSDXS`, " +
                            "`SLXS`, " +
                            "`CGQSSMKLX`, " +
                            "`CGQSSMKBH`, " +
                            "`CGQSSMKTDH`, " +
                            "`sensor_id`" +
                            ") VALUES (" +
                            "%s, %s, %s, %s, %s, %s, '%s', %s, %s, %s, '%s', '%s', '%s', @last_id" +
                            ")",
                        QLJBZBXYDWD, QLJBZBXYDJD, QLJBZBXYDGC, CGQZBX, CGQZBY, CGQZBZ, CGQJD, CSSJ, JSDXS,
                        SLXS, CGQSSMKLX, CGQSSMKBH, CGQSSMKTDH
                    ));
                    break;

                default:
                    break;
            }
        } else if ("update".equals(operationType)) {
            sql.add(String.format(
                "UPDATE " +
                    "`CloudBridge`.`sensor_info` t " +
                    "SET " +
                    "t.`name` = '%s', " +
                    "t.`sensor_number` = '%s', " +
                    "t.`sensor_position` = '%s', " +
                    "t.`type_id` = %d, " +
                    "t.`box_id` = %d, " +
                    "t.`point_id` = %d, " +
                    "t.`last_update` = '%s' " +
                    "WHERE " +
                    "t.`sensor_id` = %d",
                sensorName, sensorNumber, sensorPosition, sensorTypeId, watchBoxId,
                watchPointId, curTime, sensorId
            ));

            switch (sensorTypeId) { // 传感器类型
                case 1: // 正弦传感器
                    CSYB = request.getBigDecimal("CSYB");
                    CSWD = request.getBigDecimal("CSWD");
                    CGQZBY = request.getBigDecimal("CGQZBY");
                    CGQZBX = request.getBigDecimal("CGQZBX");
                    CGQZBZ = request.getBigDecimal("CGQZBZ");
                    CGQSSMKLX = request.getString("CGQSSMKLX");
                    CGQSSMKTDH = request.getString("CGQSSMKTDH");
                    CGQSSMKBH = request.getString("CGQSSMKBH");

                    sql.add(String.format(
                        "UPDATE " +
                            "`CloudBridge`.`sin_sensor_info` t " +
                            "SET " +
                            "t.`CSYB` = %s, " +
                            "t.`CSSJ` = %s, " +
                            "t.`CSWD` = %s, " +
                            "t.`QLJBZBXYDWD` = %s, " +
                            "t.`QLJBZBXYDJD` = %s, " +
                            "t.`QLJBZBXYDGC` = %s, " +
                            "t.`CGQZBX` = %s, " +
                            "t.`CGQZBY` = %s, " +
                            "t.`CGQZBZ` = %s, " +
                            "t.`CGQJD` = '%s', " +
                            "t.`CGQSSMKLX` = '%s', " +
                            "t.`CGQSSMKBH` = '%s', " +
                            "t.`CGQSSMKTDH` = '%s' " +
                            "WHERE " +
                            "t.`sensor_id` = %d",
                        CSYB, CSSJ, CSWD, QLJBZBXYDWD, QLJBZBXYDJD, QLJBZBXYDGC, CGQZBX, CGQZBY, CGQZBZ,
                        CGQJD, CGQSSMKLX, CGQSSMKBH, CGQSSMKTDH, sensorId
                    ));
                    break;

                case 2: // 光纤应变传感器
                    CGQZBY = request.getBigDecimal("CGQZBY");
                    CGQZBX = request.getBigDecimal("CGQZBX");
                    CGQZBZ = request.getBigDecimal("CGQZBZ");
                    CSBC = request.getBigDecimal("CSBC");
                    BCXS = request.getBigDecimal("BCXS");
                    CGQSSMKLX = request.getString("CGQSSMKLX");
                    CGQSSMKTDH = request.getString("CGQSSMKTDH");
                    CGQSSMKBH = request.getString("CGQSSMKBH");

                    sql.add(String.format(
                        "UPDATE " +
                            "`CloudBridge`.`fiber_sensor_info` t " +
                            "SET " +
                            "t.`QLJBZBXYDWD` = %s, " +
                            "t.`QLJBZBXYDJD` = %s, " +
                            "t.`QLJBZBXYDGC` = %s, " +
                            "t.`CGQZBX` = %s, " +
                            "t.`CGQZBY` = %s, " +
                            "t.`CGQZBZ` = %s, " +
                            "t.`CGQJD` = '%s', " +
                            "t.`CSBC` = %s, " +
                            "t.`CSSJ` = %s, " +
                            "t.`BCXS` = %s, " +
                            "t.`CGQSSMKLX` = '%s', " +
                            "t.`CGQSSMKBH` = '%s', " +
                            "t.`CGQSSMKTDH` = '%s' " +
                            "WHERE " +
                            "t.`sensor_id` = %d",
                        QLJBZBXYDWD, QLJBZBXYDJD, QLJBZBXYDGC, CGQZBX, CGQZBY, CGQZBZ, CGQJD, CSBC,
                        CSSJ, BCXS, CGQSSMKLX, CGQSSMKBH, CGQSSMKTDH, sensorId
                    ));
                    break;

                case 3: // GPS传感器
                    CSZBZ = request.getBigDecimal("CSZBZ");
                    CSZBX = request.getBigDecimal("CSZBX");
                    CGQCDBH = request.getString("CGQCDBH");
                    CSZBY = request.getBigDecimal("CSZBY");

                    sql.add(String.format(
                        "UPDATE " +
                            "`CloudBridge`.`gps_sensor_info` t " +
                            "SET " +
                            "t.`QLJBZBXYDWD` = %s, " +
                            "t.`QLJBZBXYDJD` = %s, " +
                            "t.`QLJBZBXYDGC` = %s, " +
                            "t.`CSZBX` = %s, " +
                            "t.`CSZBY` = %s, " +
                            "t.`CSZBZ` = %s, " +
                            "t.`CGQJD` = '%s', " +
                            "t.`CSSJ` = %s, " +
                            "t.`CGQCDBH` = '%s' " +
                            "WHERE " +
                            "t.`sensor_id` = %d",
                        QLJBZBXYDWD, QLJBZBXYDJD, QLJBZBXYDGC, CSZBX, CSZBY, CSZBZ,
                        CGQJD, CSSJ, CGQCDBH, sensorId
                    ));
                    break;

                case 4: // 加速度传感器
                    CGQZBY = request.getBigDecimal("CGQZBY");
                    JSDXS = request.getBigDecimal("JSDXS");
                    CGQZBX = request.getBigDecimal("CGQZBX");
                    CGQZBZ = request.getBigDecimal("CGQZBZ");
                    CGQSSMKLX = request.getString("CGQSSMKLX");
                    CGQSSMKTDH = request.getString("CGQSSMKTDH");
                    CGQSSMKBH = request.getString("CGQSSMKBH");

                    sql.add(String.format(
                        "UPDATE " +
                            "`CloudBridge`.`acce_sensor_info` t " +
                            "SET " +
                            "t.`QLJBZBXYDWD` = %s, " +
                            "t.`QLJBZBXYDJD` = %s, " +
                            "t.`QLJBZBXYDGC` = %s, " +
                            "t.`CGQZBX` = %s, " +
                            "t.`CGQZBY` = %s, " +
                            "t.`CGQZBZ` = %s, " +
                            "t.`CGQJD` = '%s', " +
                            "t.`CSSJ` = %s, " +
                            "t.`JSDXS` = %s, " +
                            "t.`CGQSSMKLX` = '%s', " +
                            "t.`CGQSSMKBH` = '%s', " +
                            "t.`CGQSSMKTDH` = '%s' " +
                            "WHERE " +
                            "t.`sensor_id` = %d",
                        QLJBZBXYDWD, QLJBZBXYDJD, QLJBZBXYDGC, CGQZBX, CGQZBY, CGQZBZ, CGQJD,
                        CSSJ, JSDXS, CGQSSMKLX, CGQSSMKBH, CGQSSMKTDH, sensorId
                    ));
                    break;

                case 5: // 索力传感器
                    CGQZBY = request.getBigDecimal("CGQZBY");
                    JSDXS = request.getBigDecimal("JSDXS");
                    CGQZBX = request.getBigDecimal("CGQZBX");
                    CGQZBZ = request.getBigDecimal("CGQZBZ");
                    SLXS = request.getBigDecimal("SLXS");
                    CGQSSMKLX = request.getString("CGQSSMKLX");
                    CGQSSMKTDH = request.getString("CGQSSMKTDH");
                    CGQSSMKBH = request.getString("CGQSSMKBH");

                    sql.add(String.format(
                        "UPDATE " +
                            "`CloudBridge`.`cable_sensor_info` t " +
                            "SET " +
                            "t.`QLJBZBXYDWD` = %s, " +
                            "t.`QLJBZBXYDJD` = %s, " +
                            "t.`QLJBZBXYDGC` = %s, " +
                            "t.`CGQZBX` = %s, " +
                            "t.`CGQZBY` = %s, " +
                            "t.`CGQZBZ` = %s, " +
                            "t.`CGQJD` = '%s', " +
                            "t.`CSSJ` = %s, " +
                            "t.`JSDXS` = %s, " +
                            "t.`SLXS` = %s, " +
                            "t.`CGQSSMKLX` = '%s', " +
                            "t.`CGQSSMKBH` = '%s', " +
                            "t.`CGQSSMKTDH` = '%s' " +
                            "WHERE " +
                            "t.`sensor_id` = %d",
                        QLJBZBXYDWD, QLJBZBXYDJD, QLJBZBXYDGC, CGQZBX, CGQZBY, CGQZBZ, CGQJD,
                        CSSJ, JSDXS, SLXS, CGQSSMKLX, CGQSSMKBH, CGQSSMKTDH, sensorId
                    ));
                    break;

                default:
                    break;
            }
        }

        try {
            baseDao.batch(sql);
        } catch (SQLException e) {
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("操作失败！");
            e.printStackTrace();
        }
        return response.getHttpResponse();
    }
}

package scut.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import scut.base.HttpResponse;
import scut.service.OrganizationService;
import scut.service.SysUserService;
import scut.domain.Organization;
import scut.util.Constants;
import scut.util.StringUtil;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import javax.annotation.Resource;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by riverluo on 2018/5/10.
 */
@RestController
public class Section {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT, Constants.MYSQL_URL, Constants.MYSQL_USERNAME, Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

    @Resource
    SysUserService sysUserService;

    @Resource
    OrganizationService organizationService;

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
        long userOrganizationId = sysUserService.getUserOrganizationId();
        JSONObject response = new JSONObject();
        String whereStr = String.format(
                "WHERE\n" +
                        "   s.bridge_id IN (\n" +
                        "      SELECT\n" +
                        "         bo.bridge_id\n" +
                        "      FROM\n" +
                        "         bridge_organization bo\n" +
                        "      WHERE\n" +
                        "         bo.organization_id = %d\n" +
                        "   )\n", userOrganizationId);
        if (bridgeId != null && bridgeId != 0) {
            whereStr += String.format(" AND s.bridge_id = %s", bridgeId);
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
        long userOrganizationId = sysUserService.getUserOrganizationId();
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
                    "	s.section_id = %s\n" +
                    "AND\n" +
                    "   s.bridge_id IN (\n" +
                    "      SELECT\n" +
                    "         bo.bridge_id\n" +
                    "      FROM\n" +
                    "         bridge_organization bo\n" +
                    "      WHERE\n" +
                    "         bo.organization_id = %d\n" +
                    "   )", sectionId, userOrganizationId);
            String[] fields = new String[]{"section_id", "section_name", "section_number", "position", "description", "bridge_id"};
            JSONArray sectionInfo = baseDao.queryData(sql, fields);
            data.put("section_info", sectionInfo);
        }

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
                "         bridge_organization bo\n" +
                "      WHERE\n" +
                "         bo.organization_id = %d\n" +
                "   )", userOrganizationId);
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
    @PreAuthorize("hasRole('ADMIN')")
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

        long bridgeDirectOrganizationId = organizationService.getBridgeDirectOrganizationId(bridgeId.longValue());
        if (!sysUserService.getUserOrganizationId().equals(bridgeDirectOrganizationId) &&
                !sysUserService.userInferiorOrganizationContains(bridgeDirectOrganizationId)) {
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("您没有权限新建或修改属于此桥梁的截面！");
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
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/section/delete", method = RequestMethod.POST, produces = "application/json")
    public JSONObject delete(@RequestBody JSONObject reqMsg) {
        HttpResponse response = new HttpResponse();
        String checkedListStr = reqMsg.getString("checkedList");

        List<Long> sectionIds = new ArrayList<>();
        for (String id : checkedListStr.split(",")) {
            sectionIds.add(Long.valueOf(id));
        }
        List<Organization> directOrganizations =
                organizationService.getBridgeDirectOrganizationsBySectionIds(sectionIds);
        for (Organization o : directOrganizations) {
            if (!sysUserService.getUserOrganizationId().equals(o.getId()) &&
                    !sysUserService.userInferiorOrganizationContains(o)) {
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setCode(HttpResponse.FAIL_CODE);
                response.setMsg("删除截面失败，请检查要删除的截面是否都由您的机构或其下级机构管辖！");
                return response.getHttpResponse();
            }
        }

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
        long userOrganizationId = sysUserService.getUserOrganizationId();
        JSONObject response = new JSONObject();
        if (bridgeId != null) {
            String sql = String.format("SELECT\n" +
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
                    "         bridge_organization bo\n" +
                    "      WHERE\n" +
                    "         bo.organization_id = %d\n" +
                    "   )", bridgeId, userOrganizationId);
            String[] fields = new String[]{"section_id", "section_name"};
            JSONArray data = baseDao.queryData(sql, fields);
            response.put("data", data);
        }
        return response;
    }
}

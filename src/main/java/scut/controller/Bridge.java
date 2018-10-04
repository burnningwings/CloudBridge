package scut.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.log4j.Logger;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import scut.base.HttpResponse;
import scut.service.OrganizationService;
import scut.service.authority.CurrentUser;
import scut.service.log.LogBase;
import scut.service.SysUserService;
import scut.domain.Organization;
import scut.util.Constants;
import scut.util.StringUtil;

import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import javax.annotation.Resource;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;


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

    @Resource
    SysUserService sysUserService;

    @Resource
    OrganizationService organizationService;

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
        long userOrganizationId = sysUserService.getUserOrganizationId();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);

        JSONObject response = new JSONObject();
        String sql = String.format("SELECT\n" +
                "    b.bridge_id,\n" +
                "    b.bridge_number,\n" +
                "    b.description,\n" +
                "    b.bridge_name,\n" +
                "    o.name AS organization,\n" +
                "    bt.`name` AS bridge_type_name,\n" +
                "    bt.type_id AS bridge_type_id\n" +
                "FROM\n" +
                "    bridge_info AS b\n" +
                "INNER JOIN\n" +
                "    bridge_organization AS bo ON bo.direct = 1 AND b.bridge_id = bo.bridge_id\n" +
                "INNER JOIN\n" +
                "    organization AS o ON o.id = bo.organization_id\n" +
                "INNER JOIN\n" +
                "    bridge_type AS bt ON b.type_id = bt.type_id\n" +
                "WHERE\n" +
                "    b.bridge_id IN (\n" +
                "        SELECT\n" +
                "            bo.bridge_id\n" +
                "        FROM\n" +
                "            bridge_organization bo\n" +
                "        WHERE\n" +
                "            bo.organization_id = %d\n" +
                "    )\n" +
                "LIMIT\n" +
                "    %s,%s", userOrganizationId, (page - 1) * pageSize, pageSize);
        String[] fields = new String[]{"bridge_id", "bridge_name", "bridge_number", "organization", "description",
                "bridge_type_id", "bridge_type_name"};
        JSONArray data = baseDao.queryData(sql, fields);
        response.put("data", data);

        sql = String.format("SELECT COUNT(*) AS total\n" +
                "FROM\n" +
                "   bridge_info AS b\n" +
                "WHERE\n" +
                "   b.bridge_id IN (" +
                "      SELECT\n" +
                "         bo.bridge_id\n" +
                "      FROM\n" +
                "         bridge_organization bo\n" +
                "      WHERE\n" +
                "         bo.organization_id = %d\n" +
                "   )", userOrganizationId);
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
        long userOrganizationId = sysUserService.getUserOrganizationId();
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        //查询指定桥梁信息
        if (bridgeId != null) {
            String sql = String.format("SELECT\n" +
                    "    b.bridge_id,\n" +
                    "    b.bridge_number,\n" +
                    "    b.description,\n" +
                    "    b.bridge_name,\n" +
                    "    o.name AS organization,\n" +
                    "    b.type_id AS bridge_type_id\n" +
                    "FROM\n" +
                    "    bridge_info AS b\n" +
                    "INNER JOIN\n" +
                    "    bridge_organization bo ON bo.bridge_id = %d AND bo.direct = 1 AND bo.bridge_id = b.bridge_id\n" +
                    "INNER JOIN\n" +
                    "    organization o ON bo.organization_id = o.id\n" +
                    "WHERE\n" +
                    "    b.bridge_id IN (\n" +
                    "        SELECT\n" +
                    "            bo.bridge_id\n" +
                    "        FROM\n" +
                    "            bridge_organization bo\n" +
                    "        WHERE\n" +
                    "            bo.organization_id = %d\n" +
                    "    )", bridgeId, userOrganizationId);
            String[] fields = new String[]{"bridge_name", "bridge_number", "bridge_type_id", "organization", "description"};
            JSONArray bridgeInfo = baseDao.queryData(sql, fields);
            data.put("bridge_info", bridgeInfo);
        }

        //查询桥梁类型列表
        //与 organization 无关
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
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/bridge/create-or-update", method = RequestMethod.POST, produces = "application/json")
    public JSONObject createOrUpdateBridge(@RequestBody JSONObject reqMsg) {
        HttpResponse response = new HttpResponse();
        Integer bridgeId = reqMsg.getInteger("bridgeId");
        String operationType = reqMsg.getString("operationType");
        String bridgeName = reqMsg.getString("bridgeName");
        String bridgeNumber = reqMsg.getString("bridgeNumber");
        Integer bridgeTypeId = reqMsg.getInteger("bridgeTypeId");
        Long organizationId = reqMsg.getLong("organizationId");
        String organization = reqMsg.getString("organization");
        String description = reqMsg.getString("description");

        String old_bridgeName = reqMsg.getString("old_bridge_name");
        String old_bridgeNumber = reqMsg.getString("old_bridge_number");
        Integer old_bridgeTypeId = reqMsg.getInteger("old_bridge_type_id");
        String old_organization = reqMsg.getString("old_organization");

        // TODO: 新增桥梁要不要写日志?
        if ("update".equals(operationType)) {
            logger.info(reqMsg.toString());
        }

        //检查必须参数
        if (operationType == null || StringUtil.isEmpty(bridgeName) || StringUtil.isEmpty(bridgeNumber) || bridgeTypeId == null) {
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("参数错误！");
            return response.getHttpResponse();
        }

        String curTime = sdf.format(new Date());

        Long userOrganizationId = sysUserService.getUserOrganizationId();

        List<String> updateSql = new ArrayList<>();
        if ("insert".equals(operationType)) {
            updateSql.add(String.format(
                    "INSERT INTO\n" +
                            "    bridge_info (\n" +
                            "        bridge_id,\n" +
                            "        bridge_number,\n" +
                            "        create_time,\n" +
                            "        description,\n" +
                            "        bridge_name,\n" +
                            "        last_update,\n" +
                            "        type_id,\n" +
                            "        direct_organization_id\n" +
                            "    )\n" +
                            "VALUES (default, '%s', '%s', '%s', '%s', '%s', %d, %d)",
                    bridgeNumber, curTime, description, bridgeName, curTime, bridgeTypeId, organizationId
            ));
            // executeBatch 不支持 SELECT 语句
            updateSql.add("SET @last_id = last_insert_id()");
            // 新建的桥梁的直属单位不一定和当前用户的单位相同
            // 因此插入时用的是 organizationId 而不是 userOrganizationId
            updateSql.add(String.format(
                    "INSERT INTO \n" +
                            "    bridge_organization (\n" +
                            "        bridge_id,\n" +
                            "        organization_id,\n" +
                            "        direct\n" +
                            "    )\n" +
                            "VALUES (@last_id, %d, 1)",
                    organizationId
            ));
            // 此处仅插入了直接上级单位
            updateSql.add(String.format(
                    "INSERT INTO\n" +
                            "    bridge_organization (\n" +
                            "        bridge_id, \n" +
                            "        organization_id, \n" +
                            "        direct\n" +
                            "    )  \n" +
                            "SELECT @last_id, superior_organization_id, 0\n" +
                            "FROM superior_organization\n" +
                            "WHERE organization_id = %d",
                    organizationId
            ));
        }
        // 更新数据语句
        // 仅允许桥梁的直属单位的上级单位更改“桥梁直属单位”字段
        // 不允许桥梁的直属单位更改“桥梁直属单位”字段
        if ("update".equals(operationType) && bridgeId != null) {
            long bridgeDirectOrganizationId =
                    organizationService.getBridgeDirectOrganization(bridgeId).getId();
            updateSql.add(String.format(
                    "UPDATE\n" +
                            "    bridge_info\n" +
                            "SET\n" +
                            "    bridge_name = '%s',\n" +
                            "    bridge_number = '%s',\n" +
                            "    type_id = %s,\n" +
                            "    description = '%s',\n" +
                            "    last_update = '%s'\n" +
                            "WHERE\n" +
                            "    bridge_id = %s",
                    bridgeName, bridgeNumber, bridgeTypeId, description, curTime, bridgeId
            ));
            // 提交的单位与桥梁所属单位不同，说明需要修改单位
            // 修改单位要检查目标单位是不是用户所属单位的下级单位
            if (bridgeDirectOrganizationId != organizationId &&
                    sysUserService.userInferiorOrganizationContains(organizationId)) {
                updateSql.add(String.format(
                        "UPDATE\n" +
                                "    bridge_info b\n" +
                                "SET\n" +
                                "    b.direct_organization_id = %d\n" +
                                "WHERE\n" +
                                "    b.bridge_id = %d",
                        organizationId, bridgeId
                ));
                updateSql.add(String.format(
                        "UPDATE\n" +
                                "    bridge_organization\n" +
                                "SET\n" +
                                "    direct = 0\n" +
                                "WHERE\n" +
                                "    bridge_id = %d AND organization_id = %d",
                        bridgeId, bridgeDirectOrganizationId
                ));
                // TODO: 修改单位的组织结构后要修改此处的 SQL
                // 目标单位：
                //     - 用户单位
                //     - 用户下级单位
                // 操作：
                //     1. 下级单位修改为用户单位
                //         bridge_organization 删除一条 bridgeDirectOrganizationId 记录
                //     2. 下级单位修改为另一下级单位
                //         bridge_organization 删除一条 bridgeDirectOrganizationId 记录并增加一条 organizationId 记录
                //     3. 用户单位修改为下级单位
                //         bridge_organization 增加一条 organizationId 记录

                // 覆盖第 1、2 种操作
                if (!userOrganizationId.equals(bridgeDirectOrganizationId)) {
                    updateSql.add(String.format(
                            "DELETE FROM\n" +
                                    "    bridge_organization\n" +
                                    "WHERE\n" +
                                    "    bridge_id = %d AND organization_id = %d",
                            bridgeId, bridgeDirectOrganizationId
                    ));
                    // 对于第 2 种操作，这条语句更新 0 条记录
                    updateSql.add(String.format(
                            "UPDATE\n" +
                                    "    bridge_organization\n" +
                                    "SET\n" +
                                    "    direct = 1\n" +
                                    "WHERE\n" +
                                    "    bridge_id = %d AND organization_id = %d",
                            bridgeId, organizationId
                    ));
                }

                // 覆盖第 2、3 种操作
                if (!userOrganizationId.equals(organizationId)) {
                    updateSql.add(String.format(
                            "INSERT INTO\n" +
                                    "    bridge_organization (\n" +
                                    "        bridge_id,\n" +
                                    "        organization_id,\n" +
                                    "        direct\n" +
                                    "    )\n" +
                                    "VALUES (\n" +
                                    "    %d,\n" +
                                    "    %d,\n" +
                                    "    1\n" +
                                    ")",
                            bridgeId, organizationId
                    ));
                }
            }
        }

        int[] ret = {0};
        if (!updateSql.isEmpty()) {
            try {
                ret = baseDao.batch(updateSql);
            } catch (SQLException e) {
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setCode(HttpResponse.FAIL_CODE);
                response.setMsg("操作失败！");
                e.printStackTrace();
            }
        }

        // TODO: 新增桥梁要不要写日志?
        // 新增桥梁的时候 NullPointerException 了
        if ("update".equals(operationType)) {
            //桥梁修改日志写进数据库
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String log_bridge_sql = LogBase.log_bridge(userDetails.getUsername(),
                    bridgeName, old_bridgeName, bridgeNumber, old_bridgeNumber,
                    bridgeTypeId, old_bridgeTypeId, organization, old_organization);
            logger.info(log_bridge_sql);
            baseDao.updateData(log_bridge_sql);
        }
        return response.getHttpResponse();
    }

    /**
     * 删除桥梁
     *
     * @param reqMsg 参数
     * @return
     */
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/bridge/delete", method = RequestMethod.POST, produces = "application/json")
    public JSONObject deleteBridge(@RequestBody JSONObject reqMsg) {
        long userOrganizationId = sysUserService.getUserOrganizationId();
        HttpResponse response = new HttpResponse();
        String checkedListStr = reqMsg.getString("checkedList");

        if (checkedListStr != null) {
            String sql = String.format("DELETE b \n" +
                "FROM bridge_info b\n" +
                "LEFT JOIN bridge_organization bo ON bo.direct = 1 AND b.bridge_id = bo.bridge_id\n" +
                "WHERE b.bridge_id IN (%s)\n" +
                "    AND bo.organization_id IN (\n" +
                "        SELECT so.organization_id\n" +
                "        FROM superior_organization so\n" +
                "        WHERE so.superior_organization_id = %d\n" +
                "        UNION\n" +
                "        SELECT %d\n" +
                "    )",
                checkedListStr, userOrganizationId, userOrganizationId);
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
        long userOrganizationId = sysUserService.getUserOrganizationId();
        JSONObject response = new JSONObject();

        String sql = String.format("SELECT\n" +
                "b.bridge_id,b.bridge_name\n" +
                "FROM\n" +
                "bridge_info b\n" +
                "WHERE\n" +
                "   b.bridge_id IN (" +
                "      SELECT\n" +
                "         bo.bridge_id\n" +
                "      FROM\n" +
                "         bridge_organization bo\n" +
                "      WHERE\n" +
                "         bo.organization_id = %d\n" +
                "   )", userOrganizationId);
        String[] fields = new String[]{"bridge_id", "bridge_name"};
        JSONArray data = baseDao.queryData(sql, fields);

        response.put("data", data);
        return response;
    }
}

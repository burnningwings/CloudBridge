package scut.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.log4j.Logger;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import scut.base.HttpResponse;
import scut.service.OrganizationService;
import scut.service.SysUserService;
import scut.service.authority.CurrentUser;
import scut.service.log.LogBase;
import scut.util.Constants;
import scut.util.StringUtil;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import javax.annotation.Resource;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by linjiaqin on 2018/10/26.
 */
@RestController
public class TypeControl {
    public static org.apache.log4j.Logger logger = Logger.getLogger(TypeControl.class);
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
    @RequestMapping(value = "/bridge_type/list", method = RequestMethod.GET, produces = "application/json")
    public JSONObject bridge_typeList(Model model, Integer page, Integer pageSize) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        long userOrganizationId = sysUserService.getUserOrganizationId();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);

        JSONObject response = new JSONObject();
        //查询桥梁类型列表
        //与 organization 无关
        String sql = "SELECT\n" +
                "bt.`name` AS bridge_type_name,\n" +
                "bt.type_id AS bridge_type_id\n" +
                "FROM\n" +
                "bridge_type AS bt";
        String[] fields = new String[]{"bridge_type_id", "bridge_type_name"};
        JSONArray data = baseDao.queryData(sql, fields);
        response.put("data", data);

        sql = String.format("SELECT COUNT(*) AS total\n" +
                "FROM bridge_type");
        fields = new String[]{"total"};
        data = baseDao.queryData(sql, fields);
        response.put("total", data.getJSONObject(0).get("total"));

        return response;
    }

    /**
     * 查询指定桥梁类型信息
     *
     * @param typeId 桥梁类型id 如无则为null
     * @return
     */
    @RequestMapping(value = "bridge_type/info", method = RequestMethod.GET, produces = "application/json")
    public JSONObject bridge_typeInfo(Integer typeId) {
        long userOrganizationId = sysUserService.getUserOrganizationId();
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        //查询指定桥梁信息
        if (typeId != null) {
            String sql = String.format(
                    "select type_id,name from bridge_type where type_id = %d",
                  typeId );
            String[] fields = new String[]{"type_id","name"};
            JSONArray bridge_typeInfo = baseDao.queryData(sql, fields);
            data.put("bridge_type_info", bridge_typeInfo);
        }
        logger.info(data.toString());

        response.setData(data);
        return response.getHttpResponse();
    }

    /**
     * 更新或创建指定桥梁类型信息
     *
     * @param
     * @return
     */
    @RequestMapping(value = "/bridge_type/create-or-update", method = RequestMethod.POST, produces = "application/json")
    public JSONObject createOrupdatebridge_type(@RequestBody JSONObject reqMsg) {
        long userOrganizationId = sysUserService.getUserOrganizationId();
        HttpResponse response = new HttpResponse();
        Integer typeId = reqMsg.getInteger("typeId");
        String operation_type = reqMsg.getString("operationType");
        String bridge_type_name = reqMsg.getString("bridge_type_name");
        String old_bridge_type_name = "";

        //检查必须参数
        if (operation_type == null || StringUtil.isEmpty(bridge_type_name)) {
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("参数错误！");
            return response.getHttpResponse();
        }

        //查询指定桥梁类型信息
        if (typeId != null) {
            String sql = String.format(
                    "select name from bridge_type where type_id = %d",
                    typeId );
            String[] fields = new String[]{"name"};
            old_bridge_type_name = baseDao.queryData(sql, fields).getJSONObject(0).get("name").toString();
        }

        String curTime = sdf.format(new Date());
        //插入数据语句
        String sql = null;
        if ("create".equals(operation_type)) {
            sql = String.format("INSERT INTO bridge_type(name,last_update)" +
                    " VALUES('%s','%s')", bridge_type_name, curTime);
        }
        //更新数据语句
        if ("update".equals(operation_type) && typeId != null) {
            sql = String.format("update bridge_type set name='%s', last_update='%s' where type_id=%d;",
                    bridge_type_name, curTime,typeId);
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
        //操作写入日志
        LogBase logbase = new LogBase();
        boolean logoption = logbase.sys_logoption(23);
        if (logoption) {

            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String log_sql = LogBase.log_add_bridge_type(userDetails.getUsername(),
                    bridge_type_name, old_bridge_type_name, operation_type
            );
            logger.info(log_sql);
            baseDao.updateData(log_sql);
        }
        return response.getHttpResponse();
    }

    /**
     * 异步翻页
     *
     * @param model
     * @param page
     * @param pageSize 切换为All时需强制为null，因此必须为Integer
     * @return
     */
    @RequestMapping(value = "/watchbox_type/list", method = RequestMethod.GET, produces = "application/json")
    public JSONObject watchbox_typeList(Model model, Integer page, Integer pageSize) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        long userOrganizationId = sysUserService.getUserOrganizationId();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);

        JSONObject response = new JSONObject();
        //查询控制箱类型列表
        //与 organization 无关
        String sql = "SELECT\n" +
                "bt.`name` AS watchbox_type_name,\n" +
                "bt.type_id AS watchbox_type_id\n" +
                "FROM\n" +
                "watch_box_type AS bt";
        String[] fields = new String[]{"watchbox_type_id", "watchbox_type_name"};
        JSONArray data = baseDao.queryData(sql, fields);
        response.put("data", data);

        sql = String.format("SELECT COUNT(*) AS total\n" +
                "FROM watch_box_type");
        fields = new String[]{"total"};
        data = baseDao.queryData(sql, fields);
        response.put("total", data.getJSONObject(0).get("total"));

        return response;
    }

    /**
     * 查询指定控制箱类型信息
     *
     * @param typeId 桥梁类型id 如无则为null
     * @return
     */
    @RequestMapping(value = "watchbox_type/info", method = RequestMethod.GET, produces = "application/json")
    public JSONObject watchbox_typeInfo(Integer typeId) {
        long userOrganizationId = sysUserService.getUserOrganizationId();
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        //查询指定桥梁信息
        if (typeId != null) {
            String sql = String.format(
                    "select type_id,name from watch_box_type where type_id = %d",
                    typeId );
            String[] fields = new String[]{"type_id","name"};
            JSONArray watchbox_typeInfo = baseDao.queryData(sql, fields);
            data.put("watch_box_type_info", watchbox_typeInfo);
        }
        logger.info(data.toString());

        response.setData(data);
        return response.getHttpResponse();
    }

    /**
     * 更新或创建指定控制箱类型信息
     *
     * @param
     * @return
     */
    @RequestMapping(value = "/watchbox_type/create-or-update", method = RequestMethod.POST, produces = "application/json")
    public JSONObject createOrupdateWatchBox_type(@RequestBody JSONObject reqMsg) {
        long userOrganizationId = sysUserService.getUserOrganizationId();
        HttpResponse response = new HttpResponse();
        Integer typeId = reqMsg.getInteger("typeId");
        String operation_type = reqMsg.getString("operationType");
        String watchbox_type_name = reqMsg.getString("watchbox_type_name");
        String old_watchbox_type_name = "";

        logger.info(reqMsg.toString());
        //检查必须参数
        if (operation_type == null || StringUtil.isEmpty(watchbox_type_name)) {
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("参数错误！");
            return response.getHttpResponse();
        }

        //查询指定桥梁类型信息
        if (typeId != null) {
            String sql = String.format(
                    "select name from watch_box_type where type_id = %d",
                    typeId );
            String[] fields = new String[]{"name"};
            old_watchbox_type_name = baseDao.queryData(sql, fields).getJSONObject(0).get("name").toString();
        }

        String curTime = sdf.format(new Date());
        //插入数据语句
        String sql = null;
        if ("create".equals(operation_type)) {
            sql = String.format("INSERT INTO watch_box_type(name,last_update)" +
                    " VALUES('%s','%s')", watchbox_type_name, curTime);
        }
        //更新数据语句
        if ("update".equals(operation_type) && typeId != null) {
            sql = String.format("update watch_box_type set name='%s', last_update='%s' where type_id=%d;",
                    watchbox_type_name, curTime,typeId);
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
        //操作写入日志
        LogBase logbase = new LogBase();
        boolean logoption = logbase.sys_logoption(23);
        if (logoption) {

            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String log_sql = LogBase.log_add_watchbox_type(userDetails.getUsername(),
                    watchbox_type_name, old_watchbox_type_name, operation_type
            );
            logger.info(log_sql);
            baseDao.updateData(log_sql);
        }
        return response.getHttpResponse();
    }
}

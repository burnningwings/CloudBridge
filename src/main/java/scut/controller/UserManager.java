package scut.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.dbutils.ResultSetHandler;
import org.springframework.security.access.prepost.PreAuthorize;
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
import scut.util.Constants;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import javax.annotation.Resource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by xiaoah on 2018/5/7.
 */

@RestController
public class UserManager {
    SimpleDateFormat sdf = new SimpleDateFormat("yy/MM/dd HH:mm:ss");
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
     * @param pageSize       切换为All时需强制为null，因此必须为Integer
     * @param selectUserType
     * @return
     */
    @RequestMapping(value = "/user-manager/list", method = RequestMethod.GET, produces = "application/json")
    public JSONObject userList(Model model, int page, Integer pageSize, String selectUserType, String selectUserContent) {
        // 渲染模板
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);

        Set<Long> userAndInferiorOrganizationIds = sysUserService.getUserInferiorOrganizationIds();
        userAndInferiorOrganizationIds.add(sysUserService.getUserOrganizationId());
        String whereStr = String.format(" where organization_id in %s ", userAndInferiorOrganizationIds
                .toString().replace("[", "(").replace("]", ")"));

        // 获取数据
        if (!selectUserType.equals("all")) {
            switch (selectUserType) {
                case "username":
                    whereStr += " and username='" + selectUserContent + "'";
                    break;
                case "truename":
                    whereStr += " and truename='" + selectUserContent + "'";
                    break;
                case "department":
                    whereStr += " and department='" + selectUserContent + "'";
                    break;
                default:
                    break;
            }
            //whereStr = "where bridge_name='" + bridgeName + "'";
        }

        String sql = String.format("select id as userid,username,truename,department,duty " +
                "from sys_user %s limit %s offset %s", whereStr, pageSize, (page - 1) * pageSize);
        String[] fields = new String[]{"userid", "username", "truename", "department", "duty"};
        JSONArray data = new JSONArray();
        try {
            baseDao.querySingleObject(sql, new ResultSetHandler<String>() {
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    while (rs.next()) {
                        JSONObject item = new JSONObject();
                        for (String filed : fields) {
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

        JSONObject response = new JSONObject();
        response.put("data", data);
        response.put("total", data.size());
        return response;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/user-manager/role-list", method = RequestMethod.GET, produces = "application/json")
    public JSONObject CreateUserInfo() {
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String roleSql = "select id as roleid, name as rolename from sys_role";
        JSONObject rolelist = new JSONObject();
        try {
            baseDao.querySingleObject(roleSql, new ResultSetHandler<String>() {
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    while (rs.next()) {
                        rolelist.put(rs.getString("roleid"), rs.getString("rolename"));
                    }
                    return null;
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }
        data.put("rolelist", rolelist);
        response.setData(data);
        return response.getHttpResponse();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/user-manager/create-user", method = RequestMethod.POST, produces = "application/json")
    public JSONObject CreateUser(@RequestBody Map<String, Object> reqMsg) {
        JSONObject data = new JSONObject();
        HttpResponse response = new HttpResponse();
        String username = reqMsg.get("username").toString();
        String password = reqMsg.get("password").toString();
        String truename = reqMsg.get("truename").toString();
        Long organizationId = Long.valueOf(reqMsg.get("organization_id").toString());
        String department = reqMsg.get("department").toString();
        String duty = reqMsg.get("duty").toString();
        List role_select = (ArrayList) reqMsg.get("role_select");

        String createUserSql = String.format("insert into sys_user (" +
                "username,truename,password,department,duty,organization_id)" +
                " values ('%s','%s','%s','%s','%s',%d)",
                username, truename, password, department, duty, organizationId);
        int ret = 0;
        try {
            ret = baseDao.Execute(createUserSql);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        if (ret != 1) {
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("操作失败！");
            response.setData(data);
            return response.getHttpResponse();
        } else {
            //获取刚刚插入的用户id
            String newroleSql = String.format("select id as userid from sys_user where username = '%s'", username);

            JSONObject newuserid = new JSONObject();
            try {

                baseDao.querySingleObject(newroleSql, new ResultSetHandler<String>() {
                    @Override
                    public String handle(ResultSet rs) throws SQLException {
                        while (rs.next()) {
                            String newuseridstr = rs.getString("userid");
                            newuserid.put("userid", Integer.valueOf(newuseridstr));
                        }
                        return null;
                    }
                });
            } catch (SQLException e) {
                e.printStackTrace();
            }
            int userid = (int) newuserid.get("userid");

            //插入角色用户表
            List<String> createuserSql = new ArrayList<String>();
            for (Object i : role_select) {
                int selectrole = Integer.valueOf(i.toString());
                String sqlrole = String.format("insert into sys_user_roles (sys_user_id,roles_id) values (%s,%s)", userid, selectrole);
                createuserSql.add(sqlrole);
            }
            int[] ret1 = {0};
            try {
                ret1 = baseDao.batch(createuserSql);
            } catch (SQLException e) {
                e.printStackTrace();
            }
            for (int i = 0; i < createuserSql.size(); i++) {
                if (ret1[i] < 1) {
                    response.setStatus(HttpResponse.FAIL_STATUS);
                    response.setCode(HttpResponse.FAIL_CODE);
                    response.setMsg("创建角色失败");
                }
            }
            response.setData(data);
            return response.getHttpResponse();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/user-manager/updateuserinfo", method = RequestMethod.GET, produces = "application/json")
    public JSONObject UpdateUserInfo(String userid) {

            HttpResponse response = new HttpResponse();
            JSONObject data = new JSONObject();
        String rolelistSql = "select id as roleid, name as rolename from sys_role";
        JSONObject rolelist = new JSONObject();
        try {
            baseDao.querySingleObject(rolelistSql, new ResultSetHandler<String>() {
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    while (rs.next()) {
                        rolelist.put(rs.getString("roleid"), rs.getString("rolename"));
                    }
                    return null;
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }
        data.put("rolelist", rolelist);


        String usedroleSql = String.format("select roles_id as roleid, sys_user_id from sys_user_roles where sys_user_id = %s", userid);
        JSONObject usedrole = new JSONObject();
        try {
            baseDao.querySingleObject(usedroleSql, new ResultSetHandler<String>() {
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    while (rs.next()) {
                        usedrole.put(rs.getString("roleid"), rs.getString("sys_user_id"));
                    }
                    return null;
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }
        data.put("usedrole", usedrole);

        String userinfoSql = String.format("select username,password,truename,department,duty from sys_user where id = %s", userid);
        String[] fields = new String[]{"username", "password", "truename", "department", "duty"};
        JSONObject userinfo = new JSONObject();
        try {
            baseDao.querySingleObject(userinfoSql, new ResultSetHandler<String>() {
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    while (rs.next()) {
                        for (String filed : fields) {
                            userinfo.put(filed, rs.getObject(filed) != null ? rs.getObject(filed) : "");
                        }
                    }
                    return null;
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }
        if (userid != null)
            userinfo.put("organization", organizationService.getSysUserDirectOrganizationName(Long.valueOf(userid)));
        data.put("userinfo", userinfo);

        response.setData(data);
        return response.getHttpResponse();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/user-manager/update-user", method = RequestMethod.POST, produces = "application/json")
    public JSONObject UpdateUser(@RequestBody Map<String, Object> reqMsg) {

        JSONObject data = new JSONObject();
        HttpResponse response = new HttpResponse();
        String userid = reqMsg.get("userid").toString();
        String username = reqMsg.get("username").toString();
        String password = reqMsg.get("password").toString();
        String truename = reqMsg.get("truename").toString();
        Long organizationId = Long.valueOf(reqMsg.get("organization_id").toString());
        String department = reqMsg.get("department").toString();
        String duty = reqMsg.get("duty").toString();
        List rolelist = (ArrayList) reqMsg.get("role_list");


        List<String> updateuserSql = new ArrayList<String>();
        String updateUserInfoSql = String.format("update sys_user set username='%s', password='%s', " +
                "truename='%s', department='%s', duty='%s', organization_id=%d " +
                "where id=%s", username, password, truename, department, duty, organizationId, userid);
        String deleteUserRoleSql = String.format("delete from sys_user_roles where sys_user_id='%s'", userid);
        updateuserSql.add(updateUserInfoSql);
        updateuserSql.add(deleteUserRoleSql);
        for (Object i : rolelist) {
            int role = Integer.valueOf(i.toString());
            String updateuserroleSql = String.format("insert into sys_user_roles (sys_user_id,roles_id) values ('%s','%s')", userid, role);
            updateuserSql.add(updateuserroleSql);
        }
        int[] ret = {0};
        try {
            ret = baseDao.batch(updateuserSql);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        for (int i = 0; i < updateuserSql.size(); i++) {

            if(i == 1){continue;}  //排除用户没有角色的情况

            if (ret[i] < 1) {
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setCode(HttpResponse.FAIL_CODE);
                response.setMsg("修改角色失败");
            }
        }
        response.setData(data);
        return response.getHttpResponse();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/user-manager/delete", method = RequestMethod.POST, produces = "application/json")
    public JSONObject DeleteUser(@RequestBody Map<String, Object> reqMsg) {
        HttpResponse response = new HttpResponse();
        ArrayList<String> user_checked_list = (ArrayList<String>) reqMsg.get("user_checked_list");
        JSONObject data = new JSONObject();

        int[] ret = {0, 0};
        String deleteConnRoleSql = String.format("delete from sys_user_roles where sys_user_id in (%s)", String.join(",", user_checked_list));
        String deleteUserSql = String.format("delete from sys_user where id in (%s)", String.join(",", user_checked_list));
        List<String> deleteSql = new ArrayList<String>();
        deleteSql.add(deleteConnRoleSql);            //注意删表顺序，这里两张表有外键约束
        deleteSql.add(deleteUserSql);


        try {
            ret = baseDao.batch(deleteSql);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        if (ret[0] < 1 || ret[1] < 1) {
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("删除角色失败！");
        }
        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/user-manager/search-role", method = RequestMethod.GET, produces = "application/json")
    public JSONObject userList(Model model, int page, Integer pageSize, String userid) {
        // 渲染模板
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);

        // 获取数据

       String selectroleSql = String.format("select r.id as roleid, r.name as rolename, r.description as roledescription from sys_role as r,sys_user_roles as ur where ur.sys_user_id=%s and ur.roles_id=r.id",userid);
       String[] fields = new String[]{"roleid","rolename", "roledescription"};
       JSONArray data = new JSONArray();
        try {
            baseDao.querySingleObject(selectroleSql,new ResultSetHandler<String>(){
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

        JSONObject response = new JSONObject();
        response.put("data",data);
        response.put("total",data.size());
        return response;
    }

}
package scut.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.dbutils.ResultSetHandler;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import scut.base.HttpResponse;
import scut.service.authority.CurrentUser;
import scut.util.Constants;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by xiaoah on 2018/5/7.
 */

@RestController
public class UserManager {
    SimpleDateFormat sdf = new SimpleDateFormat("yy/MM/dd HH:mm:ss");
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT, Constants.MYSQL_URL, Constants.MYSQL_USERNAME, Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

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

        // 获取数据
        String whereStr = "";
        if (!selectUserType.equals("all")) {
            switch (selectUserType) {
                case "id":
                    whereStr = "where accountid='" + selectUserContent + "'";
                    break;
                case "name":
                    whereStr = "where username='" + selectUserContent + "'";
                    break;
                case "department":
                    whereStr = "where department='" + selectUserContent + "'";
                    break;
                default:
                    break;
            }
            //whereStr = "where bridge_name='" + bridgeName + "'";
        }
        String sql = String.format("select userid,accountid,username,department,duty " +
                "from user_info %s limit %s offset %s", whereStr, pageSize, (page - 1) * pageSize);
        String[] fields = new String[]{"userid", "accountid", "username", "department", "duty"};
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

    @RequestMapping(value = "/user-manager/role-list", method = RequestMethod.GET, produces = "application/json")
    public JSONObject CreateUserInfo() {
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String roleSql = "select roleid,rolename from role_info";
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

    @RequestMapping(value = "/user-manager/create-user", method = RequestMethod.POST, produces = "application/json")
    public JSONObject CreateUser(@RequestBody Map<String, Object> reqMsg) {
        JSONObject data = new JSONObject();
        HttpResponse response = new HttpResponse();
        String accountid = reqMsg.get("accountid").toString();
        String password = reqMsg.get("password").toString();
        String username = reqMsg.get("username").toString();
        String department = reqMsg.get("department").toString();
        String duty = reqMsg.get("duty").toString();
        List role_select = (ArrayList) reqMsg.get("role_select");

        String createUserSql = String.format("insert into user_info (accountid,username,password,department,duty)" +
                " values ('%s','%s','%s','%s','%s')", accountid, username, password, department, duty);
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
            String newroleSql = String.format("select userid from user_info where username = '%s'", username);

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
                String sqlrole = String.format("insert into userrole (userid,roleid) values (%s,%s)", userid, selectrole);
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
                    response.setMsg("修改角色失败");
                }
            }
            response.setData(data);
            return response.getHttpResponse();
        }
    }

    @RequestMapping(value = "/user-manager/updateuserinfo", method = RequestMethod.GET, produces = "application/json")
    public JSONObject UpdateUserInfo(String userid) {

        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String rolelistSql = "select roleid,rolename from role_info";
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


        String usedroleSql = String.format("select roleid,connectionid from userrole where userid = %s", userid);
        JSONObject usedrole = new JSONObject();
        try {
            baseDao.querySingleObject(usedroleSql, new ResultSetHandler<String>() {
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    while (rs.next()) {
                        usedrole.put(rs.getString("roleid"), rs.getString("connectionid"));
                    }
                    return null;
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }
        data.put("usedrole", usedrole);

        String userinfoSql = String.format("select accountid,password,username,department,duty from user_info where userid = %s", userid);
        String[] fields = new String[]{"accountid", "password", "username", "department", "duty"};
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
        data.put("userinfo", userinfo);

        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/user-manager/update-user", method = RequestMethod.POST, produces = "application/json")
    public JSONObject UpdateUser(@RequestBody Map<String, Object> reqMsg) {

        JSONObject data = new JSONObject();
        HttpResponse response = new HttpResponse();
        String userid = reqMsg.get("userid").toString();
        String accoutid = reqMsg.get("accountid").toString();
        String password = reqMsg.get("password").toString();
        String username = reqMsg.get("username").toString();
        String department = reqMsg.get("department").toString();
        String duty = reqMsg.get("duty").toString();
        List rolelist = (ArrayList) reqMsg.get("role_list");



        List<String> updateuserSql = new ArrayList<String>();
        String updateUserInfoSql = String.format("update user_info set accountid='%s', password='%s', username='%s', department='%s', duty='%s' " +
                "where userid=%s", accoutid, password, username, department, duty, userid);
        String deleteUserRoleSql = String.format("delete from userrole where userid='%s'", userid);
        updateuserSql.add(updateUserInfoSql);
        updateuserSql.add(deleteUserRoleSql);
        for (Object i : rolelist) {
            int role = Integer.valueOf(i.toString());
            String updateuserroleSql = String.format("insert into userrole (userid,roleid) values ('%s','%s')", userid, role);
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

    @RequestMapping(value = "/user-manager/delete", method = RequestMethod.POST, produces = "application/json")
    public JSONObject DeleteUser(@RequestBody Map<String, Object> reqMsg) {
        HttpResponse response = new HttpResponse();
        ArrayList<String> user_checked_list = (ArrayList<String>) reqMsg.get("user_checked_list");
        JSONObject data = new JSONObject();

        int[] ret = {0, 0};
        String deleteUserSql = String.format("delete from user_info where userid in (%s)", String.join(",", user_checked_list));
        String deleteConnRoleSql = String.format("delete from userrole where userid in (%s)", String.join(",", user_checked_list));
        List<String> deleteSql = new ArrayList<String>();
        deleteSql.add(deleteUserSql);
        deleteSql.add(deleteConnRoleSql);

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

       String selectroleSql = String.format("select r.roleid,r.rolename from role_info as r,userrole as ur where ur.userid=%s and ur.roleid=r.roleid",userid);
       String[] fields = new String[]{"roleid","rolename"};
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
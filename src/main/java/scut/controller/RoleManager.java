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
import scut.service.authority.CurrentUser;
import scut.util.Constants;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import java.sql.Array;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by xiaoah on 2018/5/17.
 */


@RestController
public class RoleManager {

    SimpleDateFormat sdf = new SimpleDateFormat("yy/MM/dd HH:mm:ss");
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT,Constants.MYSQL_URL,Constants.MYSQL_USERNAME,Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

    /**
     * 异步翻页
     * @param model
     * @param page
     * @param pageSize 切换为All时需强制为null，因此必须为Integer
     * @return
     */

    @RequestMapping(value = "/role-manager/list", method = RequestMethod.GET, produces = "application/json")
    public JSONObject watchBoxList(Model model, int page, Integer pageSize, String bridgeName) {
        // 渲染模板
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);

        // 获取数据

        String sql = String.format(
                "select id as roleid,name as rolename, description as roledescription from sys_role limit %s offset %s " , pageSize,(page-1)*pageSize);
        String[] fields = new String[]{"roleid","rolename","roledescription"};
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

        JSONObject response = new JSONObject();
        response.put("data",data);
        response.put("total",data.size());
        return response;
    }

    @RequestMapping(value="/role-manager/privilege-list",method = RequestMethod.GET, produces = "application/json")
    public JSONObject CreateRoleInfo(){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String privilegeSql = "select privilegeid,privilegename from privilege_info";
        JSONObject privilege = new JSONObject();
        try {
            baseDao.querySingleObject(privilegeSql,new ResultSetHandler<String>(){
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    while(rs.next()){
                        privilege.put(rs.getString("privilegeid"),rs.getString("privilegename"));
                    }
                    return null;
                }
            });
        }catch (SQLException e){
            e.printStackTrace();
        }
        data.put("privilegelist",privilege);
        response.setData(data);
        return response.getHttpResponse();
    }


    @RequestMapping(value = "/role-manager/create-role", method = RequestMethod.POST, produces = "application/json")
    public JSONObject CreateRole(@RequestBody Map<String,Object> reqMsg){
        JSONObject data = new JSONObject();
        HttpResponse response = new HttpResponse();
        String rolename = reqMsg.get("roleName").toString();
        List privilegelist = (ArrayList)reqMsg.get("privilegeList");
        //final int newroleid;
        String createRoleSql = String.format("insert into role_info (rolename) values ('%s')",rolename);
        int ret = 0;
        try {
            ret = baseDao.Execute(createRoleSql);
        }catch (SQLException e)
        {
            e.printStackTrace();
        }

        if(ret!=1){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("操作失败！");
            response.setData(data);
            return response.getHttpResponse();
        }else
        {
            //取得刚插入的角色id
            String newroleSql = String.format("select roleid from role_info where rolename='%s'",rolename);

            JSONObject newroleid = new JSONObject();
            try {

                baseDao.querySingleObject(newroleSql,new ResultSetHandler<String>(){
                    @Override
                    public String handle(ResultSet rs) throws SQLException {
                        while(rs.next()){
                            String newroleidstr = rs.getString("roleid");
                            newroleid.put("roleid",Integer.valueOf(newroleidstr));
                        }
                        return null;
                    }
                });
            }catch (SQLException e){
                e.printStackTrace();
            }
            int roleid = (int)newroleid.get("roleid");

            for(Object i : privilegelist){
                int privilege = Integer.valueOf(i.toString());
                String createConnection = String.format("insert into roleprivilege(roleid,privilegeid) values (%s,%s)",roleid,privilege);
                try {
                    ret = baseDao.Execute(createConnection);
                }catch (SQLException e)
                {
                    e.printStackTrace();
                }
                if(ret!=1){
                    response.setStatus(HttpResponse.FAIL_STATUS);
                    response.setCode(HttpResponse.FAIL_CODE);
                    response.setMsg("操作失败！");
                    response.setData(data);
                    return response.getHttpResponse();
                }
            }
            response.setData(data);
            return response.getHttpResponse();
        }

    }

    @RequestMapping(value="/role-manager/privilege-usedandall",method = RequestMethod.GET, produces = "application/json")
    public JSONObject UpdateRoleInfo(String roleid){

        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String privilegeSql = "select privilegeid,privilegename from privilege_info";
        JSONObject privilege = new JSONObject();
        try {
            baseDao.querySingleObject(privilegeSql,new ResultSetHandler<String>(){
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    while(rs.next()){
                        privilege.put(rs.getString("privilegeid"),rs.getString("privilegename"));
                    }
                    return null;
                }
            });
        }catch (SQLException e){
            e.printStackTrace();
        }
        data.put("privilegelist",privilege);

        String usedprivilegeSql = String.format("select privilegeid,connectionid from roleprivilege where roleid = %s", roleid);
        JSONObject usedprivilege = new JSONObject();
        try {
            baseDao.querySingleObject(usedprivilegeSql, new ResultSetHandler<String>() {
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    while (rs.next()) {
                        usedprivilege.put(rs.getString("privilegeid"), rs.getString("connectionid"));
                    }
                    return null;
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }
        data.put("usedprivilege", usedprivilege);

        String roleselectSql = String.format("select roleid,rolename from role_info where roleid = %s",roleid);
        JSONObject roleinfo = new JSONObject();
        try {
            baseDao.querySingleObject(roleselectSql,new ResultSetHandler<String>(){
                @Override
                public String handle(ResultSet rs) throws SQLException {
                    while(rs.next()){
                        roleinfo.put(rs.getString("roleid"),rs.getString("rolename"));
                       // System.out.println(rs.getString("roleid")+"||"+rs.getString("rolename"));
                    }
                    return null;
                }
            });
        }catch (SQLException e){
            e.printStackTrace();
        }
        data.put("roleinfo",roleinfo);


        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/role-manager/update-role", method = RequestMethod.POST, produces = "application/json")
    public JSONObject UpdateRole(@RequestBody Map<String,Object> reqMsg){
        JSONObject data = new JSONObject();
        HttpResponse response = new HttpResponse();
        String roleid = reqMsg.get("roleid").toString();
        String rolename = reqMsg.get("roleName").toString();

        List privilegelist = (ArrayList)reqMsg.get("privilegeList");
        int numPrivilege = privilegelist.size();
        List<String> updateSql = new ArrayList<String>();
        String updateRoleInfoSql = String.format("update role_info set rolename = '%s' where roleid = %s",rolename,roleid);
        String deleteRolePrivilegeSql = String.format("delete from roleprivilege where roleid = %s",roleid);
        updateSql.add(updateRoleInfoSql);
        updateSql.add(deleteRolePrivilegeSql);
        for(Object i : privilegelist){
            int privilege = Integer.valueOf(i.toString());
            String rolePrivilegeSql = String.format("insert into roleprivilege (roleid,privilegeid) values (%s,%s)",roleid,privilege);
            updateSql.add(rolePrivilegeSql);
        }
        int[] ret = {0};
        try {
            ret = baseDao.batch(updateSql);
        }catch (SQLException e)
        {
            e.printStackTrace();
        }
        for(int i=0;i<numPrivilege+2;i++){
            if(ret[i]<1){
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setCode(HttpResponse.FAIL_CODE);
                response.setMsg("修改角色失败");
            }
        }

        response.setData(data);
        return response.getHttpResponse();
    }



    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/role-manager/delete", method = RequestMethod.POST, produces = "application/json")
    public JSONObject DeleteWatchBox(@RequestBody Map<String,Object> reqMsg) {
        HttpResponse response = new HttpResponse();
        ArrayList<String> role_checked_list = (ArrayList<String>)reqMsg.get("role_checked_list");
        JSONObject data = new JSONObject();

        int[] ret = {0,0,0} ;
        String deleteRoleSql = String.format("delete from role_info where roleid in (%s)",String.join(",", role_checked_list));
        String deleteConnPriviSql = String .format("delete from roleprivilege where roleid in (%s)",String.join(",", role_checked_list));
        String deleteConnUserSql = String.format("delete from userrole where roleid in (%s)",String.join(",", role_checked_list));
        List<String> deleteSql = new ArrayList<String>();
        deleteSql.add(deleteRoleSql);
        deleteSql.add(deleteConnPriviSql);
        deleteSql.add(deleteConnUserSql);

        try {
            ret = baseDao.batch(deleteSql);
        }catch (SQLException e)
        {
            e.printStackTrace();
        }
        if(ret[0]<1 || ret[1]<1 ){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("删除角色失败！");
        }
        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/role-manager/search-user", method = RequestMethod.GET, produces = "application/json")
    public JSONObject userList(Model model, int page, Integer pageSize, String roleid) {
        // 渲染模板
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);

        // 获取数据

        String sql = String.format("select u.id as userid,u.username,u.truename,u.department,u.duty from sys_user as u,"+
                            "sys_user_roles as ur where ur.roles_id=%s and ur.sys_user_id = u.id limit %s offset %s",roleid,pageSize,(page-1)*pageSize);
        String[] fields = new String[]{"userid","username","truename","department","duty"};
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

        JSONObject response = new JSONObject();
        response.put("data",data);
        response.put("total",data.size());
        return response;
    }

}

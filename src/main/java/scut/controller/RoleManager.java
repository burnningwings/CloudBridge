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
                "select roleid,rolename from role_info limit %s offset %s " , pageSize,(page-1)*pageSize);
        String[] fields = new String[]{"roleid","rolename"};
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
                System.out.println(i);
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

}

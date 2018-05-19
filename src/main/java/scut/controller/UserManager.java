package scut.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.dbutils.ResultSetHandler;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import scut.service.authority.CurrentUser;
import scut.util.Constants;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;

/**
 * Created by xiaoah on 2018/5/7.
 */

@RestController
public class UserManager {
    SimpleDateFormat sdf = new SimpleDateFormat("yy/MM/dd HH:mm:ss");
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT,Constants.MYSQL_URL,Constants.MYSQL_USERNAME,Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

    /**
     * 异步翻页
     * @param model
     * @param page
     * @param pageSize 切换为All时需强制为null，因此必须为Integer
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
        if(!selectUserType.equals("all")){
            switch (selectUserType){
                case "id" : whereStr = "where accountid='"+ selectUserContent +"'";break;
                case "name" : whereStr = "where username='" + selectUserContent +"'";break;
                case "department" : whereStr = "where department='" + selectUserContent+"'";break;
                default:break;
            }
            //whereStr = "where bridge_name='" + bridgeName + "'";
        }
        String sql = String.format("select userid,accountid,username,department,duty " +
                        "from user_info %s limit %s offset %s", whereStr,pageSize,(page-1)*pageSize);
        String[] fields = new String[]{"userid","accountid","username","department","duty"};
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

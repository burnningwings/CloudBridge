package scut.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.log4j.Logger;
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

@RestController
public class LogManager {
    public static Logger logger = Logger.getLogger(DataManager.class);

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

    @RequestMapping(value = "/log_bridge/list", method = RequestMethod.GET, produces = "application/json")
    public JSONObject log_bridgeList(Model model, int page, Integer pageSize) {
        // 渲染模板
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);

        JSONObject response = new JSONObject();
        // 获取数据

        //因为用到stringformat的缘故，需要使用%%对%进行转义，然后datttime也要转成string的形式才能显示
        String sql = String.format(
                "select log_id, bridge_name, username, DATE_FORMAT(log_time,\"%%Y-%%m-%%d %%H:%%i:%%s\") as log_time, log_info from log_bridge limit %s,%s " , (page-1)*pageSize, pageSize);
        String[] fields = new String[]{"log_id","bridge_name","username","log_time","log_info"};
        JSONArray data = baseDao.queryData(sql, fields);

        response.put("data", data);
        logger.info(data.toString());
        sql = "SELECT COUNT(*) AS total FROM log_bridge";
        fields = new String[]{"total"};
        data = baseDao.queryData(sql, fields);
        response.put("total", data.getJSONObject(0).get("total"));
        return response;
    }

    /**
     * 删除桥梁修改日志
     *
     * @param reqMsg 参数
     * @return
     */
    @RequestMapping(value = "/log_bridge/delete", method = RequestMethod.POST, produces = "application/json")
    public JSONObject deleteBridge(@RequestBody JSONObject reqMsg) {
        HttpResponse response = new HttpResponse();
        String checkedListStr = reqMsg.getString("checkedList");
        if (checkedListStr != null) {
            String sql = String.format("DELETE FROM log_bridge WHERE log_id IN (%s)", checkedListStr);
            int ret = baseDao.updateData(sql);
            if (ret > 0) {
                return response.getHttpResponse();
            }
        }

        response.setStatus(HttpResponse.FAIL_STATUS);
        response.setCode(HttpResponse.FAIL_CODE);
        response.setMsg("删除桥梁修改日志失败！");
        return response.getHttpResponse();
    }


}

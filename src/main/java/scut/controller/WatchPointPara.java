package scut.controller;


import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.log4j.Logger;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import scut.base.HttpResponse;
import scut.service.OrganizationService;
import scut.service.SysUserService;
import scut.util.Constants;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import javax.annotation.Resource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;

/**
 * Created by linjiaqin on 2018/11/08.
 */
@RestController
public class WatchPointPara {
    public static org.apache.log4j.Logger logger = Logger.getLogger(WatchPointPara.class);
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
     * @param page
     * @param pageSize 切换为All时需强制为null，因此必须为Integer
     * @param bridgeId
     * @return
     */
    @RequestMapping(value = "/watch-point-para/list", method = RequestMethod.GET, produces = "application/json")
    public JSONObject tableList(int page, Integer pageSize, Integer bridgeId, Integer sectionId) {
        long userOrganizationId = sysUserService.getUserOrganizationId();
        // 获取数据
        JSONObject response = new JSONObject();
        String whereStr = String.format(" where d.bridge_id in ( " +
            "select bo.bridge_id " +
            "from bridge_organization bo " +
            "where bo.organization_id = %d " +
            ") ", userOrganizationId);
        if (bridgeId != 0 && sectionId == 0)
            whereStr += String.format(" and c.bridge_id = %d" , bridgeId);
        if (bridgeId == 0 && sectionId != 0)
            whereStr += String.format(" and a.section_id = %d" , sectionId);
        if (sectionId != 0 && bridgeId != 0)
            whereStr += String.format(" and c.bridge_id = %d and a.section_id = %d", bridgeId, sectionId);

        String sql = String.format(" select c.bridge_id,d.bridge_name,a.section_id,c.name as section_name,a.point_id,a.name as point_name,b.sc from watch_point as a " +
                "left join watch_point_para as b on a.point_id = b.watch_point_id " +
                "left join section as c on c.section_id = a.section_id " +
                "left join bridge_info as d on d.bridge_id = c.bridge_id " +
                "%s limit %s offset %s",
            whereStr, pageSize, (page - 1) * pageSize
        );

        logger.info(bridgeId+","+sectionId);
        logger.info(sql);
        String[] fields = new String[]{"point_id","bridge_name","section_name","point_name","sc"};
        //JSONObject data = new JSONObject();
        JSONArray data = baseDao.queryData(sql, fields);
        logger.info(data.toString());
        response.put("data", data);

        // 获取总数
        sql = String.format(
            "select count(*) as total " +
                "from watch_point as a " +
                "left join watch_point_para as b on a.point_id = b.watch_point_id " +
                "left join section as c on c.section_id = a.section_id " +
                "left join bridge_info as d on d.bridge_id = c.bridge_id " +
                "%s", whereStr);

        fields = new String[]{"total"};
        data = baseDao.queryData(sql, fields);
        response.put("total", data.getJSONObject(0).get("total"));
        logger.info(data.toString());
        return response;

    }

    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/watch-point-para/update", method = RequestMethod.POST, produces = "application/json")
    public JSONObject updateWatchPointPara(@RequestBody JSONObject reqMsg) {
        long userOrganizationId = sysUserService.getUserOrganizationId();
        HttpResponse response = new HttpResponse();
        Integer watch_point_id = reqMsg.getInteger("watch_point_id");
        String sc = reqMsg.getString("sc");
        String count_pointid_sql = String.format("select count(*) as total from watch_point_para where watch_point_id = %d", watch_point_id);
        String[] fields = new String[]{"total"};
        JSONArray data = baseDao.queryData(count_pointid_sql,fields);
        int poindid_sums = Integer.parseInt(data.getJSONObject(0).get("total").toString());
        String sql = "";
        if (poindid_sums != 0) sql = String.format("update watch_point_para set sc = %s where watch_point_id = %d", sc, watch_point_id);
        else sql = String.format("insert into watch_point_para values(%d,%s) ",watch_point_id, sc);
        logger.info(sc);
        logger.info(sql);
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

    @RequestMapping(value = "/watch-point-para/info", method = RequestMethod.GET, produces = "application/json")
    public JSONObject WatchPointParaInfo(Integer watch_point_id) {
        long userOrganizationId = sysUserService.getUserOrganizationId();
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String sql = String.format("select sc from watch_point_para where watch_point_id = %d", watch_point_id);
        String[] fields = new String[]{"sc"};
        JSONArray sclist = baseDao.queryData(sql,fields);
        logger.info(sclist);
        if (sclist.size() != 0) data = sclist.getJSONObject(0);
        response.setData(data);
        logger.info(data.toString());
        return response.getHttpResponse();
    }

    /**
     * 异步翻页
     * @param page
     * @param pageSize 切换为All时需强制为null，因此必须为Integer
     * @return
     */
    @RequestMapping(value = "/bridge-para/list", method = RequestMethod.GET, produces = "application/json")
    public JSONObject bridgeParaList(int page, Integer pageSize) {
        long userOrganizationId = sysUserService.getUserOrganizationId();
        // 获取数据
        JSONObject response = new JSONObject();

        String sql = String.format("select bridge_info.bridge_id,bridge_name,mRc0,sRc0,mRt0,sRt0,E " +
                "from bridge_info " +
                "left join bridge_para on bridge_info.bridge_id = bridge_para.bridge_id " +
                "where bridge_info.bridge_id in ( " +
                "   select bo.bridge_id " +
                "   from bridge_organization bo " +
                "   where bo.organization_id = %d " +
                ") " +
                "limit %s offset %s",
            userOrganizationId, pageSize, (page - 1) * pageSize
        );
        logger.info(sql);
        String[] fields = new String[]{"bridge_id","bridge_name","mRc0","sRc0","mRt0","sRt0","E"};
        JSONArray data = baseDao.queryData(sql, fields);
        logger.info(data.toString());
        response.put("data", data);

        // 获取总数
        sql = String.format(
            "select count(*) as total " +
                "from bridge_info " +
                "left join bridge_para on bridge_info.bridge_id = bridge_para.bridge_id " +
                "where bridge_info.bridge_id in ( " +
                "   select bo.bridge_id " +
                "   from bridge_organization bo " +
                "   where bo.organization_id = %d " +
                ") ",
            userOrganizationId
        );

        fields = new String[]{"total"};
        data = baseDao.queryData(sql, fields);
        response.put("total", data.getJSONObject(0).get("total"));
        logger.info(data.toString());
        return response;

    }

    @RequestMapping(value = "/bridge-para/info", method = RequestMethod.GET, produces = "application/json")
    public JSONObject bridgeParaInfo(Integer bridge_id) {
        long userOrganizationId = sysUserService.getUserOrganizationId();
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String sql = String.format("select mRc0,sRc0,mRt0,sRt0,E from bridge_para where bridge_id = %d", bridge_id);
        String[] fields = new String[]{"mRc0","sRc0","mRt0","sRt0","E"};
        JSONArray list = baseDao.queryData(sql,fields);
        logger.info(list);
        if (list.size() != 0) data = list.getJSONObject(0);
        response.setData(data);
        logger.info(data.toString());
        return response.getHttpResponse();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/bridge-para/update", method = RequestMethod.POST, produces = "application/json")
    public JSONObject updateBridgePara(@RequestBody JSONObject reqMsg) {
        long userOrganizationId = sysUserService.getUserOrganizationId();
        HttpResponse response = new HttpResponse();
        Integer bridge_id = reqMsg.getInteger("bridge_id");
        String E = reqMsg.getString("E");
        String mrc0 = reqMsg.getString("mrc0");
        String src0 = reqMsg.getString("src0");
        String mrt0 = reqMsg.getString("mrt0");
        String srt0 = reqMsg.getString("srt0");
        logger.info(reqMsg.toString());
        String opreatype_sql = String.format("select count(*) as total from bridge_para where bridge_id = %d",bridge_id);
        String[] fields = new String[]{"total"};
        JSONArray data = baseDao.queryData(opreatype_sql, fields);
        int bridge_id_count = Integer.parseInt(data.getJSONObject(0).get("total").toString());
        String sql = "";
        if (bridge_id_count == 0)
        {
            sql = String.format("insert into bridge_para values(%d,%s,%s,%s,%s,%s)",
                    bridge_id,mrc0,src0,mrt0,srt0,E);
        }
        else
        {
            sql = String.format("update bridge_para set E = %s, " +
                    "mRc0 = %s, sRc0 = %s, mRt0 = %s, sRt0 = %s " +
                    "where bridge_id = %d",E,mrc0,src0,mrt0,srt0,bridge_id);
        }

        logger.info(sql);
        //执行操作
        int ret = 0;
        if (sql != null)
        {
            ret = baseDao.updateData(sql);
        }
        if (ret != 1)
        {
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("操作失败！");
        }
        return response.getHttpResponse();
    }
}

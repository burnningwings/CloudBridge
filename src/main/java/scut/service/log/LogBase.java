package scut.service.log;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.log4j.Logger;
import scut.util.Constants;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;


/**
 * Created by linjiaqin on 2018/9/19.
 */
public class LogBase {

    public static Logger logger = Logger.getLogger(LogBase.class);
    public String findBridgeName(Integer bridgeId)
    {
        int maxActive = 100;
        String druid_mysql_url = String.format(Constants.MYSQL_FORMAT, Constants.MYSQL_URL, Constants.MYSQL_USERNAME, Constants.MYSQL_PASSWORD) + "|" + maxActive;
        SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

        String findbridgesql = String.format("select bridge_name from bridge_info where bridge_id = %s",bridgeId);
        String[] field = new String[]{"bridge_name"};
        String bridgename = baseDao.queryData(findbridgesql,field).getJSONObject(0).get("bridge_name").toString();
        logger.info(bridgename);
        return bridgename.toString();
    }

    public String findBridgeNameList(String checkedList)
    {
        int maxActive = 100;
        String druid_mysql_url = String.format(Constants.MYSQL_FORMAT, Constants.MYSQL_URL, Constants.MYSQL_USERNAME, Constants.MYSQL_PASSWORD) + "|" + maxActive;
        SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

        String findsql = String.format("select bridge_name from bridge_info where bridge_id in (%s)",checkedList);
        String[] field = new String[]{"bridge_name"};
        logger.info(findsql);
        String res = "";

        JSONArray bridgenames = baseDao.queryData(findsql,field);//.getJSONObject(0).get("name").toString();
        for(int i=0;i<bridgenames.size()-1;i++)
        {
            // 遍历 jsonarray 数组，把每一个对象转成 json 对象
            JSONObject job = bridgenames.getJSONObject(i);
            res += job.get("bridge_name").toString()+",";
        }
        res += bridgenames.getJSONObject(bridgenames.size()-1).get("bridge_name").toString();
        logger.info(res);
        return res;
    }

    public String findSectionName(Integer sectionId)
    {
        int maxActive = 100;
        String druid_mysql_url = String.format(Constants.MYSQL_FORMAT, Constants.MYSQL_URL, Constants.MYSQL_USERNAME, Constants.MYSQL_PASSWORD) + "|" + maxActive;
        SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

        String finsectionsql = String.format("select name from section where section_id = %s",sectionId);
        String[] field = new String[]{"name"};
        String sectionname = baseDao.queryData(finsectionsql,field).getJSONObject(0).get("name").toString();
        logger.info(sectionname);
        return sectionname.toString();
    }

    public String findBoxtypeName(Integer boxtypeId)
    {
        int maxActive = 100;
        String druid_mysql_url = String.format(Constants.MYSQL_FORMAT, Constants.MYSQL_URL, Constants.MYSQL_USERNAME, Constants.MYSQL_PASSWORD) + "|" + maxActive;
        SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

        String finsectionsql = String.format("select name from watch_box_type where type_id = %s",boxtypeId);
        String[] field = new String[]{"name"};
        String sectionname = baseDao.queryData(finsectionsql,field).getJSONObject(0).get("name").toString();
        logger.info(sectionname);
        return sectionname.toString();
    }

    public String findBoxName(String checkedList)
    {
        int maxActive = 100;
        String druid_mysql_url = String.format(Constants.MYSQL_FORMAT, Constants.MYSQL_URL, Constants.MYSQL_USERNAME, Constants.MYSQL_PASSWORD) + "|" + maxActive;
        SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

        String findboxnamesql = String.format("select name from watch_box where box_id in (%s)",checkedList);
        logger.info(findboxnamesql);
        String[] field = new String[]{"name"};
        JSONArray watchboxnames = baseDao.queryData(findboxnamesql,field);//.getJSONObject(0).get("name").toString();
        String res = "";
        for(int i=0;i<watchboxnames.size()-1;i++)
        {
            // 遍历 jsonarray 数组，把每一个对象转成 json 对象
            JSONObject job = watchboxnames.getJSONObject(i);
            res += job.get("name").toString()+",";
        }
        res += watchboxnames.getJSONObject(watchboxnames.size()-1).get("name").toString();
        logger.info(res);

        return res;
    }

    public String findWatchPointNameList(String checkedList)
    {
        int maxActive = 100;
        String druid_mysql_url = String.format(Constants.MYSQL_FORMAT, Constants.MYSQL_URL, Constants.MYSQL_USERNAME, Constants.MYSQL_PASSWORD) + "|" + maxActive;
        SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

        String finsectionsql = String.format("select name from watch_point where point_id in (%s)",checkedList);
        String[] field = new String[]{"name"};
        logger.info(finsectionsql);
        String res = "";

        JSONArray watchpointnames = baseDao.queryData(finsectionsql,field);//.getJSONObject(0).get("name").toString();
        for(int i=0;i<watchpointnames.size()-1;i++)
        {
            // 遍历 jsonarray 数组，把每一个对象转成 json 对象
            JSONObject job = watchpointnames.getJSONObject(i);
            res += job.get("name").toString()+",";
        }
        res += watchpointnames.getJSONObject(watchpointnames.size()-1).get("name").toString();
        logger.info(res);
        return res;
    }

    public String findSectionNameList(String checkedList)
    {
        int maxActive = 100;
        String druid_mysql_url = String.format(Constants.MYSQL_FORMAT, Constants.MYSQL_URL, Constants.MYSQL_USERNAME, Constants.MYSQL_PASSWORD) + "|" + maxActive;
        SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

        String findsql = String.format("select name from section where section_id in (%s)",checkedList);
        String[] field = new String[]{"name"};
        logger.info(findsql);
        String res = "";

        JSONArray sectiontnames = baseDao.queryData(findsql,field);//.getJSONObject(0).get("name").toString();
        for(int i=0;i<sectiontnames.size()-1;i++)
        {
            // 遍历 jsonarray 数组，把每一个对象转成 json 对象
            JSONObject job = sectiontnames.getJSONObject(i);
            res += job.get("name").toString()+",";
        }
        res += sectiontnames.getJSONObject(sectiontnames.size()-1).get("name").toString();
        logger.info(res);
        return res;
    }

    public static String convertToBridgeType(Integer bridgeTypeId)
    {
        String res = "";
        switch(bridgeTypeId)
        {
            case 1: res = "钢架桥"; break;
            case 2: res = "混凝土简支桥"; break;
        }
        return res;
    }

    //生成桥梁日志的sql语句
    public static String log_bridge(
            String username,
            String bridgeName,String old_bridge_name,
            String bridgeNumber,String old_bridge_number,
            Integer bridge_type_id,Integer old_bridge_type_id,
            String organization,String old_organization,
            String operation_type)
    {
        String info = "";
        if(operation_type.equals("insert"))
        {
            info += "创建了桥梁："+bridgeName+",桥梁编号："+bridgeNumber+"，桥梁类型：" + convertToBridgeType(bridge_type_id)
            +",所属单位："+organization+"。";
        }
        else if (operation_type.equals("update"))
        {
            if (!bridgeName.equals(old_bridge_name))
            {
                info += "修改桥梁名称:"+old_bridge_name+"->"+bridgeName+"; ";
            }
            if (!bridgeNumber.equals(old_bridge_number))
            {
                info += "修改编号:"+old_bridge_number+"->"+bridgeNumber+"; ";
            }
            if (bridge_type_id!=old_bridge_type_id)
            {
                info += "修改桥梁类型:"
                        +convertToBridgeType(old_bridge_type_id)+"->"
                        +convertToBridgeType(bridge_type_id)+"; ";
            }
            if (!organization.equals(old_organization))
            {
                info += "修改所属单位:"+old_organization+"->"+organization;
            }
        }

        //当前时间可以由系统获得，不需要传参
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String curTime = sdf.format(new Date());

        String ressql = String.format("insert into log_bridge(bridge_name,username,log_time,log_info) " +
                "values('%s','%s','%s','%s')",bridgeName,username,curTime,info);
        return ressql;
    }

    //生成截面的操作日志的sql语句
    public static String log_section(JSONObject reqMsg, String username, String bridgename, String old_bridgename)
    {
        Integer sectionId = reqMsg.getInteger("sectionId");
        Integer bridgeId = reqMsg.getInteger("bridgeId");
        String operationType = reqMsg.getString("operationType");
        String sectionName = reqMsg.getString("sectionName");
        String sectionNumber = reqMsg.getString("sectionNumber");
        String position = reqMsg.getString("position");
        String description = reqMsg.getString("description");
        Integer old_bridgeId = reqMsg.getInteger("old_bridgeId");
        String old_sectionName = reqMsg.getString("old_sectionName");
        String old_sectionNumber = reqMsg.getString("old_sectionNumber");
        String old_position = reqMsg.getString("old_position");
        String old_description = reqMsg.getString("old_description");


        String info = "";
        //当前时间可以由系统获得，不需要传参
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String curTime = sdf.format(new Date());
        if ("insert".equals(operationType)) {
            info += "创建了名为:"+sectionName+"位于"+bridgename+"的"+position+"的截面";
        }
        else if ("update".equals(operationType)) {
            info += "被修改的截面为："+ sectionName + ".\n";
            if (!sectionName.equals(old_sectionName))
            {
                info += "修改截面名称："+old_sectionName+"->"+sectionName+";";
            }
            if (!sectionNumber.equals(old_sectionNumber))
            {
                info += "修改截面编号："+old_sectionNumber+"->"+sectionNumber+";";
            }
            if (!position.equals(old_position))
            {
                info += "修改截面位置："+old_position+"->"+position+";";
            }
            if (bridgeId != old_bridgeId)
            {
                info += "修改所属桥梁："+old_bridgename+"->"+bridgename+";";
            }
        }
        String ressql = String.format("insert into log_system(username,log_time,log_info) " +
                "values('%s','%s','%s')",username,curTime,info);

        return ressql;
    }

    //生成测点的操作日志的sql语句
    public static String log_watchpoint(
            JSONObject reqMsg,
            String username,
            String bridgename,String old_bridgename,
            String sectionname,String old_sectionname
    )
    {
        Integer watchPointId = reqMsg.getInteger("watchPointId");
        String operationType = reqMsg.getString("operationType");
        String watchPointName = reqMsg.getString("watchPointName");
        String watchPointNumber = reqMsg.getString("watchPointNumber");
        String old_watchPointName = reqMsg.getString("old_watchPointName");
        String old_watchPointNumber = reqMsg.getString("old_watchPointNumber");

        String info = "";
        //当前时间可以由系统获得，不需要传参
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String curTime = sdf.format(new Date());
        if ("insert".equals(operationType)) {
            info += "创建了名为:"+watchPointName+"的测点，所属桥梁为："+bridgename+",所属截面为："
                    +sectionname+"。";
        }
        else if ("update".equals(operationType)) {
            info += "被修改的测点为："+ watchPointName + ".\n";

            if (!watchPointName.equals(old_watchPointName))
            {
                info += "修改测点名称："+old_watchPointName+"->"+watchPointName+";";
            }
            if (!bridgename.equals(old_bridgename))
            {
                info += "修改所属桥梁："+old_bridgename+"->"+bridgename+";";
            }
            if (!watchPointNumber.equals(old_watchPointNumber))
            {
                info += "修改测点编号："+old_watchPointNumber+"->"+watchPointNumber+";";
            }
            if (!sectionname.equals(old_sectionname))
            {
                info += "修改所属截面："+old_sectionname+"->"+sectionname+";";
            }

        }
        String ressql = String.format("insert into log_system(username,log_time,log_info) " +
                "values('%s','%s','%s')",username,curTime,info);

        return ressql;
    }

    /*
     *记录删除测点的日志
     */
    public static String log_del_watchpoint(String username,String watchpointnames)
    {
        String info = "删除测点："+watchpointnames;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String curTime = sdf.format(new Date());
        String ressql = String.format("insert into log_system(username,log_time,log_info) " +
                "values('%s','%s','%s')",username,curTime,info);;
        return ressql;
    }

    /*
     *记录删除控制箱的日志
     */
    public static String log_del_watchbox(String username,String watchboxnames)
    {
        String info = "删除控制箱："+watchboxnames;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String curTime = sdf.format(new Date());
        String ressql = String.format("insert into log_system(username,log_time,log_info) " +
                "values('%s','%s','%s')",username,curTime,info);;
        return ressql;
    }

    /*
     *删除截面的日志
     */

    public static String log_del_section(String username,String sectionnames)
    {
        String info = "删除截面："+sectionnames;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String curTime = sdf.format(new Date());
        String ressql = String.format("insert into log_system(username,log_time,log_info) " +
                "values('%s','%s','%s')",username,curTime,info);;
        return ressql;
    }

    public static String log_del_bridge(String username,String bridgenames)
    {
        String info = "删除桥梁："+bridgenames;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String curTime = sdf.format(new Date());
        String ressql = String.format("insert into log_bridge(username,log_time,log_info) " +
                "values('%s','%s','%s')",username,curTime,info);;
        return ressql;
    }

    //生成的控制箱操作日志的sql语句
    public static String log_watchbox(
            Map<String,Object> reqMsg,
            String username,
            String bridgename, String old_bridgename,
            String boxtypename, String old_boxtypename
    )
    {
        String operationType = reqMsg.get("operation_type").toString();
        Object bridge_id = reqMsg.get("bridge_id");
        Object type_id = reqMsg.get("type_id");
        Object name = reqMsg.get("name");
        Object box_number = reqMsg.get("box_number");
        Object node = reqMsg.get("node");
        Object sample_interval = reqMsg.get("sample_interval");
        Object change_time_interval = reqMsg.get("change_time_interval");

        String old_bridge_id = reqMsg.get("old_bridge_id").toString();
        String old_watch_box_type_id = reqMsg.get("old_watch_box_type_id").toString();
        String old_watch_box_name = reqMsg.get("old_watch_box_name").toString();
        String old_box_number = reqMsg.get("old_box_number").toString();
        String old_node = reqMsg.get("old_node").toString();
        String old_sample_interval = reqMsg.get("old_sample_interval").toString();
        String old_change_time_interval = reqMsg.get("old_change_time_interval").toString();

        String info = "";
        //当前时间可以由系统获得，不需要传参
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String curTime = sdf.format(new Date());
        if ("insert".equals(operationType)) {
            info += "创建了名为:"+name+"的控制箱，所属桥梁为："+bridgename+",类型为："
                    +boxtypename+"。";
        }
        else if ("update".equals(operationType)) {
            info += "被修改的控制箱为："+ name + ".\n";

            if (!name.equals(old_watch_box_name))
            {
                info += "修改控制箱名称："+old_watch_box_name+"->"+name+";";
            }
            if (!bridgename.equals(old_bridgename))
            {
                info += "修改所属桥梁："+old_bridgename+"->"+bridgename+";";
            }
            if (!boxtypename.equals(old_boxtypename))
            {
                info += "修改控制箱类型："+old_boxtypename+"->"+boxtypename+";";
            }
            if (!box_number.equals(old_box_number))
            {
                info += "修改控制箱号："+old_box_number+"->"+box_number+";";
            }
            if (!node.equals(old_node))
            {
                info += "修改所属节点："+old_node+"->"+node+";";
            }
            if (!old_sample_interval.equals(sample_interval))
            {
                info += "修改采集间隔："+old_sample_interval+"->"+sample_interval+";";
            }
            if (!old_change_time_interval.equals(change_time_interval))
            {
                info += "修改时间同步间隔："+old_change_time_interval+"->"+change_time_interval+";";
            }

        }
        String ressql = String.format("insert into log_system(username,log_time,log_info) " +
                "values('%s','%s','%s')",username,curTime,info);

        return ressql;
    }

    /*
     *获取桥梁，系统日志选项是否开启
     * 22代表桥梁，23代表系统
     */
    public boolean sys_logoption(int option_id)
    {
        boolean flag = true;
        int maxActive = 100;
        String druid_mysql_url = String.format(Constants.MYSQL_FORMAT, Constants.MYSQL_URL, Constants.MYSQL_USERNAME, Constants.MYSQL_PASSWORD) + "|" + maxActive;
        SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

        String sql = String.format("select option_state from log_option where option_id = %s",option_id);
        String[] field = new String[]{"option_state"};
        String state = baseDao.queryData(sql,field).getJSONObject(0).get("option_state").toString();
        logger.info(state);
        if (!state.equals("checked")) flag = false;
        return flag;
    }


    public static String log_sensor(String username)
    {
        String ressql = "";

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String curTime = sdf.format(new Date());
        return ressql;
    }

    /*
     *记录增加修改桥梁类型的日志
     */
    public static String log_add_bridge_type(
            String username,
            String bridge_type_name,String old_bridge_type_name,
            String operation_type)
    {
        String info = "";
        if (operation_type.equals("create"))
        {
            info = "创建新的桥梁类型："+bridge_type_name;
        }
        else if (operation_type.equals("update"))
        {
            if (!old_bridge_type_name.equals(bridge_type_name))
            {
                info = old_bridge_type_name+" 修改为 "+bridge_type_name;
            }
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String curTime = sdf.format(new Date());
        String ressql = String.format("insert into log_system(username,log_time,log_info) " +
                "values('%s','%s','%s')",username,curTime,info);
        return ressql;
    }

    /*
     * 记录删除桥梁类型的日志
     */
    public static String log_del_bridge_type(
            String username,
            JSONArray res)
    {
        StringBuilder info = new StringBuilder();
        for (int n=0;n<res.size();n++){

            JSONObject r = res.getJSONObject(n);
            if (1 == Integer.parseInt((String)r.get("ret"))){
                info.append("删除\"").append(r.get("type_name\"")).append("桥梁类型成功\n");
            }else {
                info.append("删除\"").append(r.get("type_name\"")).append("桥梁类型失败\n");
            }
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String curTime = sdf.format(new Date());
        String ressql = String.format("insert into log_system(username,log_time,log_info) " +
                "values('%s','%s','%s')",username,curTime, info.toString());
        return ressql;
    }

    /*
     * 记录删除模型的日志
     */
    public static String log_del_module_info(
            String username,
            JSONArray res)
    {
        StringBuilder info = new StringBuilder();
        for (int n=0;n<res.size();n++){

            JSONObject r = res.getJSONObject(n);
            if (1 == Integer.parseInt((String)r.get("ret"))){
                info.append("删除\"").append(r.get("name\"")).append("模型成功\n");
            }else {
                info.append("删除\"").append(r.get("name\"")).append("模型失败\n");
            }
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String curTime = sdf.format(new Date());
        String ressql = String.format("insert into log_system(username,log_time,log_info) " +
                "values('%s','%s','%s')",username,curTime, info.toString());
        return ressql;
    }

    /*
     * 记录删除控制箱类型的日志
     */
    public static String log_del_watchbox_type(
            String username,
            JSONArray res)
    {
        StringBuilder info = new StringBuilder();
        for (int n=0;n<res.size();n++){

            JSONObject r = res.getJSONObject(n);
            if (1 == Integer.parseInt((String)r.get("ret"))){
                info.append("删除\"").append(r.get("type_name\"")).append("控制箱类型成功\n");
            }else {
                info.append("删除\"").append(r.get("type_name\"")).append("控制箱类型失败\n");
            }
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String curTime = sdf.format(new Date());
        String ressql = String.format("insert into log_system(username,log_time,log_info) " +
                "values('%s','%s','%s')",username,curTime, info.toString());
        return ressql;
    }

    /*
     *记录增加修改控制箱类型的日志
     */
    public static String log_add_watchbox_type(
            String username,
            String watchbox_type_name,String old_watchbox_type_name,
            String operation_type)
    {
        String info = "";
        if (operation_type.equals("create"))
        {
            info = "创建新的控制箱类型："+watchbox_type_name;
        }
        else if (operation_type.equals("update"))
        {
            if (!old_watchbox_type_name.equals(watchbox_type_name))
            {
                info = old_watchbox_type_name+" 修改为 "+watchbox_type_name;
            }
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String curTime = sdf.format(new Date());
        String ressql = String.format("insert into log_system(username,log_time,log_info) " +
                "values('%s','%s','%s')",username,curTime,info);;
        return ressql;
    }

    /*
     *记录上传传感器数据的日志
     */
    public static String log_upload_sensor_data(
            String username,
            String sensor_number,String status)
    {
        String info = "";
        if (status.equals("FINISHED"))
        {
            info = "上传传感器"+sensor_number +"数据文件成功";
        }
        else if (status.equals("FAILED"))
        {
            info = "上传传感器"+sensor_number +"数据文件失败";
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String curTime = sdf.format(new Date());
        String ressql = String.format("insert into log_system(username,log_time,log_info) " +
                "values('%s','%s','%s')",username,curTime,info);;
        return ressql;
    }

    /*
     *记录删除传感器数据的日志
     */
    public static String log_delete_sensor_data(
            String username,
            String sensor_number,String status)
    {
        String info = "";
        if (status.equals("FINISHED"))
        {
            info = "删除传感器"+sensor_number +"数据文件成功";
        }
        else if (status.equals("FAILED"))
        {
            info = "删除传感器"+sensor_number +"数据文件失败";
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String curTime = sdf.format(new Date());
        String ressql = String.format("insert into log_system(username,log_time,log_info) " +
                "values('%s','%s','%s')",username,curTime,info);;
        return ressql;
    }
}


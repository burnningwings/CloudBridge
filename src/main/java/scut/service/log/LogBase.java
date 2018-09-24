package scut.service.log;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by linjiaqin on 2018/9/19.
 */
public class LogBase {

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

    public static String log_bridge(
            String username,
            String bridgeName,String old_bridge_name,
            String bridgeNumber,String old_bridge_number,
            Integer bridge_type_id,Integer old_bridge_type_id,
            String organization,String old_organization)
            //String description, String old_description
    {
        String info = "";
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
        //当前时间可以由系统获得，不需要传参
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String curTime = sdf.format(new Date());

        String ressql = String.format("insert into log_bridge(bridge_name,username,log_time,log_info) " +
                "values('%s','%s','%s','%s')",bridgeName,username,curTime,info);
        return ressql;
    }
}

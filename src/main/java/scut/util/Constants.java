package scut.util;

/**
 * Created by Carrod on 2018/4/19.
 */
public class Constants {
    // mysql config
    public static String MYSQL_URL = null;
    public static String MYSQL_USERNAME = null;
    public static String MYSQL_PASSWORD = null;

    public final static String MYSQL_FORMAT = "%s|%s|%s";


    public final static String CURRENT_USER = "CurrentUser";
    public final static String ACCESS_TOKEN = "token";

//    public final static Map<String, String> sensorMap = new HashMap<String, String>();
//    static {
//        sensorMap.put("加速度传感器", "acce_sensor_info");
//        sensorMap.put("索力传感器", "cable_sensor_info");
//        sensorMap.put("光纤传感器", "fiber_sensor_info");
//        sensorMap.put("GPS传感器", "gps_sensor_info");
//        sensorMap.put("正弦传感器", "sin_sensor_info");
//    };

    public final static String[] sensorArray = new String[]{
            "acce_sensor_info","cable_sensor_info","fiber_sensor_info","gps_sensor_info","sin_sensor_info"};
}

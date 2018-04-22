package scut.util;


public class StringUtil {

    public static boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
    
    public static final String STR_DELIMIT_1ST = "\\|";
    public static final String STR_DELIMIT_4TH = ":";

}

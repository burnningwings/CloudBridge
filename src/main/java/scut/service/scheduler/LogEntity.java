package scut.service.scheduler;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Carrod on 2017/11/19.
 */
public class LogEntity {
    private StringBuilder logSb = new StringBuilder();
    private int exitVal = -1000;
    private boolean status = false;

    public void add(String message){
        logSb.append(message).append("\n");
    }

    public void setExitVal(int exitVal){
        this.exitVal = exitVal;
    }

    public int getExitVal(){
        return exitVal;
    }

    @Override
    public String toString(){
        return logSb.toString();
    }

    /**
     * Author: liujun
     * @return res
     */
    public String[] getDamageResult() {
        String[] res = {"",""};
        Matcher loc = Pattern.compile("loc: \\d+").matcher(this.logSb);
        Matcher degree = Pattern.compile("degree: \\d+").matcher(this.logSb);

        if (loc.find()){
            res[0] = loc.group(0);
        }
        if (degree.find()){
            res[1] = degree.group(0);
        }
        return res;
    }
}

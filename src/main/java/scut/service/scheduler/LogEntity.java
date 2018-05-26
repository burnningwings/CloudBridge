package scut.service.scheduler;

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

    public String toString(){
        return logSb.toString();
    }
}

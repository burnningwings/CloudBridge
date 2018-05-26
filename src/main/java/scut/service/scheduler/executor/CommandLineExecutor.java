package scut.service.scheduler.executor;

import org.apache.log4j.Logger;
import scut.service.scheduler.LogEntity;
import scut.service.scheduler.Message;
import scut.util.Constants;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * Created by Carrod on 2018/5/21.
 */
public class CommandLineExecutor implements Executor {

    public static Logger logger = Logger.getLogger(CommandLineExecutor.class);
    private String execStr = null;
    private String key = null;
    private String status = Constants.READY;
    public CommandLineExecutor(String key, String execStr){
        this.key = key;
        this.execStr = execStr;
    }

    @Override
    public String getKey() {
        return key;
    }

    @Override
    public String getStatus() {
        return null;
    }

    @Override
    public LogEntity execute() {
        LogEntity logEntity = new LogEntity();
        try{
            Process process = Runtime.getRuntime().exec(execStr);
            InputStream stdin = process.getInputStream();
            InputStreamReader isr = new InputStreamReader(stdin);
            BufferedReader br = new BufferedReader(isr);
            String line = "";
            this.status = Constants.RUNNING;
            Message.getInstance().update(key,null,null,status,null,logEntity.toString());
            while ((line = br.readLine()) != null) {
                logEntity.add(line);
            }
            int exitVal = process.waitFor();
            logEntity.setExitVal(exitVal);
        }catch (IOException e) {
            e.printStackTrace();
            logEntity.add(e.toString());
        }catch (InterruptedException e){
            e.printStackTrace();
            logEntity.add(e.toString());
        }
        return logEntity;
    }
}

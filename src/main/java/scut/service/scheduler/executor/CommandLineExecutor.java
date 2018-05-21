package scut.service.scheduler.executor;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * Created by Carrod on 2018/5/21.
 */
public class CommandLineExecutor implements Executor {

    private String execStr = null;
    public CommandLineExecutor(String execStr){
        this.execStr = execStr;
    }

    @Override
    public int execute() throws Exception {
        Process process = Runtime.getRuntime().exec(execStr);
        InputStream stdin = process.getInputStream();
        InputStreamReader isr = new InputStreamReader(stdin);
        BufferedReader br = new BufferedReader(isr);
        int exitVal = process.waitFor();
        return exitVal;
    }
}

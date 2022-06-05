package scut.service.scheduler.executor;

import org.apache.log4j.Logger;
import scut.service.scheduler.AnalysisMessage;
import scut.service.scheduler.LogEntity;
import scut.service.scheduler.Message;
import scut.util.Constants;

import java.io.*;
import java.nio.charset.StandardCharsets;

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

    public LogEntity execute_analysis() {
        LogEntity logEntity = new LogEntity();
        try{
//            System.out.println("start analyse");
            Process process = Runtime.getRuntime().exec(execStr);

            process.getOutputStream().close();
//            process.getErrorStream().close();

            new Thread(){
                public void run(){
                    super.run();
                    String line;
                    try{
                        BufferedReader stderr = new BufferedReader(new InputStreamReader(process.getErrorStream(),StandardCharsets.UTF_8));
                        while ((line = stderr.readLine()) != null){
                            System.out.println(line);
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }.start();


            InputStream stdin = process.getInputStream();
            InputStreamReader isr = new InputStreamReader(stdin);
            BufferedReader br = new BufferedReader(isr);

//            InputStream errorStream = process.getErrorStream();;
//            InputStreamReader inputStreamReader = new InputStreamReader(errorStream);
//            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            String line = "";
            while ((line = br.readLine()) != null) {
                logEntity.add(line);
                System.out.println(line);
            }


//            String errline = "";
//            while ((errline = bufferedReader.readLine()) != null) {
//                logEntity.add(errline);
//                System.out.println(errline);
//            }

            this.status = Constants.RUNNING;
            AnalysisMessage.getInstance().update(key,null,null,status,null,logEntity.toString());
            int exitVal = process.waitFor();
//            System.out.println(System.err);
//            while ((line = br.readLine()) != null) {
//                logEntity.add(line);
//                System.out.println(line);
//            }
//            while ((errline = brerr.readLine()) != null) {
//                logEntity.add(errline);
//                System.out.println(errline);
//            }
//            int exitVal = process.waitFor();
//            System.out.println("end analyse");
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

    public LogEntity execute_for_association_relability(){
        LogEntity logEntity = new LogEntity();
        String[] split = execStr.split(" ");
        String[] cmd = {split[0],split[1] + ";" + split[2]};
        try{
            Process process = Runtime.getRuntime().exec(cmd[0]);

//            process.getOutputStream().close();
            process.getErrorStream().close();
            OutputStream os = process.getOutputStream();
            os.write(cmd[1].getBytes(StandardCharsets.UTF_8));
            os.close();


            InputStream stdin = process.getInputStream();
            InputStreamReader isr = new InputStreamReader(stdin);
            BufferedReader br = new BufferedReader(isr);

            String line = "";
            while ((line = br.readLine()) != null) {
                logEntity.add(line);
//                System.out.println(line);
            }

            this.status = Constants.RUNNING;
            AnalysisMessage.getInstance().update(key,null,null,status,null,logEntity.toString());
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

    public LogEntity execute_nolog() {
        LogEntity logEntity = new LogEntity();
        try{
            Process process = Runtime.getRuntime().exec(execStr);
            InputStream stdin = process.getInputStream();
            InputStreamReader isr = new InputStreamReader(stdin);
            BufferedReader br = new BufferedReader(isr);
            String line = "";
            this.status = Constants.RUNNING;
            //AnalysisMessage.getInstance().update(key,null,null,status,null,logEntity.toString());
            while ((line = br.readLine()) != null) {
                logEntity.add(line);
                System.out.println(line);
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

package scut.service.scheduler;

import org.apache.log4j.Logger;
import scut.service.scheduler.executor.Executor;
import scut.util.Constants;

import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;

/**
 * Created by Carrod on 2018/5/21.
 */
public class Scheduler {

    public static Logger logger = Logger.getLogger(Scheduler.class);
    private static Scheduler instance = null;

    public static Scheduler getInstance() {
        if(instance == null) {
            synchronized (Scheduler.class) {
                if(instance == null) {
                    instance = new Scheduler();
                }
            }
        }
        return instance;
    }

    private Scheduler() {
    }

    public void runExecutor(Executor executor){
        Callable<Integer> callable = new Callable<Integer>() {
            public Integer call() throws Exception {
                String key = executor.getKey();
                LogEntity logEntity = executor.execute();
                if(logEntity.getExitVal() == 0)
                    Message.getInstance().update(key,null,null,Constants.FINISHED,null,logEntity.toString());
                else
                    Message.getInstance().update(key,null,null,Constants.FAILED,null,logEntity.toString());
                logger.debug("exitVal: " + logEntity.getExitVal());
                logger.debug(logEntity.toString());
                return logEntity.getExitVal();
            }
        };
        FutureTask<Integer> future = new FutureTask<Integer>(callable);
        new Thread(future).start();
    }
}

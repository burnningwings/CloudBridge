package scut.service.scheduler;

import org.apache.log4j.Logger;
import scut.service.scheduler.executor.Executor;

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
                int retVal = executor.execute();
                // TODO:消息通知对应用户
                logger.debug("retVal: " + retVal);
                return retVal;
            }
        };
        FutureTask<Integer> future = new FutureTask<Integer>(callable);
        new Thread(future).start();
    }
}

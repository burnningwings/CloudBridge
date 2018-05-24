package scut.service.scheduler.executor;

import scut.service.scheduler.LogEntity;

/**
 * Created by Carrod on 2018/5/21.
 */
public interface Executor {
    String getKey();
    String getStatus();
    LogEntity execute();
}

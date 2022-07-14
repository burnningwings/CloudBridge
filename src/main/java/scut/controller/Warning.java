package scut.controller;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class Warning {
    @Scheduled(fixedRate = /*5*60*1000*/ 10*1000)
    private void checkSensor() {
        System.out.println("执行静态定时任务时间: ");
    }
}

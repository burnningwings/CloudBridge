# CloudBridge

## 概述

- 基于原版bridge的功能重构;
- 定位为对大数据功能应用的微服务。

## 基本框架

- 后台：springboot + spring security + jpa + thymeleaf
- 前端：Bootstrap + jquery + ......
- 数据库：元数据和结果缓存用MySQL，OLAP基于SparkSQL，由大数据服务系统提供

## 部署方法

### start

chmod u+x bin/start.sh && bin/start.sh

### stop

chmod u+x bin/stop.sh && bin/stop.sh
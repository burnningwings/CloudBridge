package scut.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import jdk.nashorn.internal.ir.RuntimeNode;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.log4j.Logger;
import org.springframework.http.HttpRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import scut.base.HttpResponse;
import scut.service.SysUserService;
import scut.service.authority.CurrentUser;
import scut.service.log.LogBase;
import scut.service.scheduler.AnalysisMessage;
import scut.service.scheduler.LogEntity;
import scut.service.scheduler.Message;
import scut.service.scheduler.Scheduler;
import scut.service.scheduler.executor.CommandLineExecutor;
import scut.service.scheduler.executor.Executor;
import scut.util.Constants;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

@RestController
public class ModuleManager {

    public static Logger logger = Logger.getLogger(ModuleManager.class);
    SimpleDateFormat sdf = new SimpleDateFormat("yy/MM/dd HH:mm:ss");
    int maxActive = 100;
    String druid_mysql_url = String.format(Constants.MYSQL_FORMAT,Constants.MYSQL_URL,Constants.MYSQL_USERNAME,Constants.MYSQL_PASSWORD) + "|" + maxActive;
    SQLBaseDao baseDao = SQLDaoFactory.getSQLDaoInstance(druid_mysql_url);

    @Resource
    SysUserService sysUserService;

    @RequestMapping(value = "/module-manager/trainmodelupload",method = RequestMethod.POST)
    public JSONObject trainModelUpload(@RequestParam("trainmodel_upload") MultipartFile file, String uploader_name, String feature){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        if (!file.isEmpty()){
            try{
                File targetFile = null;
                switch (feature){
                    case "超重车识别" :
                        targetFile = new File(Constants.OVERWEIGHT_UPLOAD_TRAIN_MODEL_DIR);
                        break;
                    case "损伤识别" :
                        targetFile = new File(Constants.DAMAGE_UPLOAD_TRAIN_MODEL_DIR);
                        break;
                    case "关联性分析" :
                        targetFile = new File(Constants.ASSOCIATION_UPLOAD_TRAIN_MODEL_DIR);
                        break;
                    case "可靠度分析" :
                        targetFile = new File(Constants.RELIABILITY_UPLOAD_TRAIN_MODEL_DIR);
                        break;
                    default :
                        break;
                }
                if(!targetFile.exists()) {
                    targetFile.mkdirs();
                }
                String originFileName = file.getOriginalFilename();
                String fileName = Constants.OVERWEIGHT_UPLOAD_TRAIN_MODEL_DIR + "/" + originFileName;
                BufferedOutputStream out = new BufferedOutputStream(
                        new FileOutputStream(new File( fileName)));
                out.write(file.getBytes());
                out.flush();
                out.close();
//                // 2. 上传到HBase
//                String execStr = Constants.UPLOAD_DATA_BIN_SH + " " + sensor_id + " " + fileName;
//                logger.debug(execStr);
//                Executor executor = new CommandLineExecutor(md5,execStr);
//                JSONObject param = new JSONObject();
//                param.put("exec_str",execStr);
//                Message.getInstance().update(md5,originFileName,sensor_number,Constants.READY,param.toJSONString(),null);
//                Scheduler.getInstance().runExecutor(executor);
//                data.put("url","http://192.168.0.100:8088/cluster/scheduler");
//                // 前端获取该key，可监听上传情况
//                data.put("id",md5);
                //将模型信息更新到mysql
//                String[] split = moduleInfo.split(" - ");
                //文件位置暂时设为本地
                String sql = String.format("insert into module (name,uploader_id,uploader_name,upload_time,location,feature)" +
                        " values (\"%s\",(select userId from user where account = \"%s\"),\"%s\",NOW(),\"%s\",\"%s\")",originFileName,uploader_name,uploader_name,fileName,feature);
                int res = baseDao.updateData(sql);
                //TODO:需要将模型操作上传日志?
            }catch (FileNotFoundException e){
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("服务器路径错误！");
            }catch (IOException e){
                e.printStackTrace();
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setMsg("文件上传失败！");
            }

        }else{
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("相关上传参数错误！");
        }
        response.setData(data);
        return response.getHttpResponse();
    }

    /**
     * 获得模型相关信息列表
     * @param page
     * @param pageSize
     * @return
     */
    @RequestMapping(value = "/module_manager/list", method = RequestMethod.GET, produces = "application/json")
    public JSONObject moduleManagerList(Integer page, Integer pageSize) {

        JSONObject response = new JSONObject();
        //查询桥梁类型列表
        //与 organization 无关
        String sql = "SELECT\n" +
                "id,name,uploader_id,uploader_name,upload_time,location,feature\n" +
                "FROM\n" +
                "module";
        String[] fields = new String[]{"id", "name","uploader_name","upload_time","location","feature"};
        JSONArray data = baseDao.queryData(sql, fields);
        response.put("data", data);

        sql = String.format("SELECT COUNT(*) AS total\n" +
                "FROM module");
        fields = new String[]{"total"};
        data = baseDao.queryData(sql, fields);
        response.put("total", data.getJSONObject(0).get("total"));

        return response;
    }

    /**
     * 下载指定模型
     *
     * @param
     * @return
     * @Author: liujun
     */
    @RequestMapping(value = "/module_manger/download", method = RequestMethod.POST, produces = "application/json")
    public JSONObject moduleDownload(@RequestBody JSONObject reqMsg) {
        HttpResponse response = new HttpResponse();
        String moduleInfo = reqMsg.getString("moduleInfo");
        JSONArray module_info = JSON.parseArray(moduleInfo);
        String module_name = reqMsg.getString("name");

        Integer[] typeId = new Integer[module_info.size()];
        //检查必须参数
        if (module_info == null) {
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setCode(HttpResponse.FAIL_CODE);
            response.setMsg("参数错误！");
            return response.getHttpResponse();
        }

        String curTime = sdf.format(new Date());
        JSONObject objects = new JSONObject();
        JSONObject data = new JSONObject();
        for (int n = 0;n<module_info.size();n++){

            JSONObject o = module_info.getJSONObject(n);
            //查询文件所在位置
            String sql = String.format("select location FROM module WHERE id=%d;",Integer.parseInt((String)o.get("id")));
            //执行操作
//            try {
//                String[] location = new String[module_info.size()];
//                final int[] count = {0};
//                baseDao.querySingleObject(sql, new ResultSetHandler<String>() {
//
//                    @Override
//                    public String handle(ResultSet resultSet) throws SQLException {
//                        while (resultSet.next()){
//                            location[count[0]] = resultSet.getString("location");
//                            count[0]++;
//                        }
//                        return null;
//                    }
//                });
//
//            } catch (SQLException e) {
//                e.printStackTrace();
//            }
            String[] fields = new String[]{"location"};
            data.put(o.getString("name"),baseDao.queryData(sql, fields).getJSONObject(0).getString("location"));
        }
        response.setData(data);
        return response.getHttpResponse();
    }
}

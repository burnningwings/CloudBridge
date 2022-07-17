package scut.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.log4j.Logger;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;
import scut.base.HttpResponse;
import scut.service.SysUserService;
import scut.service.log.LogBase;
import scut.util.Constants;
import scut.util.sql.SQLBaseDao;
import scut.util.sql.SQLDaoFactory;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
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
    public Object moduleDownload(@RequestBody JSONObject reqMsg) {
        HttpResponse response = new HttpResponse();
        String moduleInfo = reqMsg.getString("moduleInfo");
        JSONArray module_info = JSON.parseArray(moduleInfo);
        String module_name = reqMsg.getString("name");

        Integer[] typeId = new Integer[module_info.size()];
        //检查必须参数
        if (module_info == null) {
            HttpResponse response1 = new HttpResponse();
            response1.setStatus(HttpResponse.FAIL_STATUS);
            response1.setCode(HttpResponse.FAIL_CODE);
            response1.setMsg("参数错误！");
            return response1.getHttpResponse();
        }

        String curTime = sdf.format(new Date());
        JSONObject objects = new JSONObject();
        JSONObject data = new JSONObject();
        for (int n = 0;n<module_info.size();n++){

            JSONObject o = module_info.getJSONObject(n);
            //查询文件所在位置
            String sql = String.format("select location FROM module WHERE id=%d;",Integer.parseInt((String)o.get("id")));

            String[] fields = new String[]{"location"};
            String location = baseDao.queryData(sql,fields).getJSONObject(0).getString("location");
//            data.put(o.getString("name"),baseDao.queryData(sql, fields).getJSONObject(0).getString("location"));

            ServletRequestAttributes sra = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            HttpServletResponse response2 = sra.getResponse();
            URL urlFile = null;
            HttpURLConnection httpURLConnection = null;
            FileInputStream in = null;
            ServletOutputStream out = null;
            try {
                File file = new File(location);
                if (!file.exists()){
                    return null;
                }
                response2.setContentType("application/octet-stream");
                response2.setHeader("Content-Disposition","attachment;filename=" + o.getString("name"));

                in = new FileInputStream(location);
                out = response2.getOutputStream();
                int len = 0;
                byte[] bytes = new byte[1024 * 10];
                while ((len = in.read(bytes)) != -1){
                    out.write(bytes,0,len);
                }
                out.flush();

            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }finally {
                try {
                    if (out != null && in != null){
                        in.close();
                        out.close();
                    }

                } catch (IOException e) {
                    e.printStackTrace();
                }

            }
            response2.setStatus(0);
            return response2;

        }
        response.setData(data);
        return response.getHttpResponse();
    }

    /**
     * 删除指定模型信息
     *
     * @param
     * @return
     * @Author: liujun
     */
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/module_manger/delete", method = RequestMethod.POST, produces = "application/json")
    public JSONObject deleteBridgeType(@RequestBody JSONObject reqMsg) {
        long userOrganizationId = sysUserService.getUserOrganizationId();
        HttpResponse response = new HttpResponse();
        String moduleInfo = reqMsg.getString("moduleInfo");
        JSONArray module_info = JSON.parseArray(moduleInfo);

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
        for (int n = 0;n<module_info.size();n++){

            JSONObject o = module_info.getJSONObject(n);

            //TODO:删除相应文件地址


            //删除mysql数据语句
            String del_sql = String.format("DELETE FROM module WHERE id=%d;",Integer.parseInt((String)o.get("id")));
            //执行操作
            int ret = 0;
            if (del_sql != null) {
                ret = baseDao.updateData(del_sql);
                o.put("ret",String.valueOf(ret));
            }

            if (ret != 1) {
                response.setStatus(HttpResponse.FAIL_STATUS);
                response.setCode(HttpResponse.FAIL_CODE);
                response.setMsg("操作失败！");
            }
        }
        //操作写入日志
        LogBase logbase = new LogBase();
        boolean logoption = logbase.sys_logoption(23);
        if (logoption) {

            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String log_sql = LogBase.log_del_module_info(userDetails.getUsername(),
                    module_info
            );
            logger.info(log_sql);
            baseDao.updateData(log_sql);
        }
        return response.getHttpResponse();
    }
}

package scut.controller;


import com.alibaba.fastjson.JSONObject;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import scut.base.HttpResponse;
import scut.util.Constants;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * created by xiaoah
 * 2018/10/01
 */
@RestController
public class WaveletAnalysis {
    public static Logger logger =Logger.getLogger(WaveletAnalysis.class);

    @RequestMapping(value = "/wavelet-analysis/dropdown", method = RequestMethod.GET, produces = "application/json")
    public JSONObject dropDownList(String type){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        String targetPath = "";
        switch (type){
//            case "trainfile": targetPath = Constants.DAMAGE_UPLOAD_TRAIN_FILE_DIR; break;
//            case "testfile" : targetPath = Constants.DAMAGE_UPLOAD_TEST_FILE_DIR; break;
//            case "trainmodel" : targetPath = Constants.DAMAGE_UPLOAD_TRAIN_MODEL_DIR; break;
//            case "savedmodel" : targetPath = Constants.DAMAGE_SAVE_TRAIN_MODEL_DIR; break;
//            case "associationfile" : targetPath = Constants.ASSOCIATION_FILE_DIR; break;
            case "waveletfile" : targetPath = Constants.WAVELET_ANALYSIS_FILE; break;
            default: break;
        }

        File dirFile = new File(targetPath);
        if (!dirFile.exists()){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("服务器路径错误！");
        }
        String[] fileList = dirFile.list();
        for(int i = 0;i<fileList.length;i++){
            //System.out.println(fileList[i]);
            data.put(fileList[i],"");
        }
        response.setData(data);
        return response.getHttpResponse();
    }

    @RequestMapping(value = "/wavelet_analysis/waveletFileUpload", method = RequestMethod.POST)
    public JSONObject waveletFileUpload(@RequestParam("wavelet_file_upload")MultipartFile file){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();
        if (!file.isEmpty()){
            try{
                File targetFile = new File(Constants.WAVELET_ANALYSIS_FILE);
                if(!targetFile.exists()) {
                    targetFile.mkdirs();
                }
                String originFileName = file.getOriginalFilename();
                String fileName = Constants.WAVELET_ANALYSIS_FILE + "/" + originFileName;
                BufferedOutputStream out = new BufferedOutputStream(
                        new FileOutputStream(new File( fileName)));
                out.write(file.getBytes());
                out.flush();
                out.close();
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

    @RequestMapping(value = "/wavelet-analysis/getWaveletResult", method = RequestMethod.GET, produces = "application/json")
    public JSONObject getWaveletResult1(String waveletfile, String waveletlayer, String starttime, String endtime){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();

        System.out.println(waveletfile);
        System.out.println(waveletlayer);
        System.out.println(starttime);
        System.out.println(endtime);

        String waveletFilePath = Constants.WAVELET_ANALYSIS_FILE + "/" + waveletfile;
        System.out.print(waveletFilePath);
        File file = new File(waveletFilePath);
        if(!file.exists()){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("小波分析文件不存在！");
        }else{
            try {
                int tempIndex = 1;
                int strandIndex = tempIndex + 9;
                switch (waveletlayer){
                    case "origin" : tempIndex = 1; strandIndex = tempIndex + 9; break;
                    case "A7" : tempIndex = 2; strandIndex = tempIndex + 9; break;
                    case "D7" : tempIndex = 3; strandIndex = tempIndex + 9; break;
                    case "D6" : tempIndex = 4; strandIndex = tempIndex + 9; break;
                    case "D5" : tempIndex = 5; strandIndex = tempIndex + 9; break;
                    case "D4" : tempIndex = 6; strandIndex = tempIndex + 9; break;
                    case "D3" : tempIndex = 7; strandIndex = tempIndex + 9; break;
                    case "D2" : tempIndex = 8; strandIndex = tempIndex + 9; break;
                    case "D1" : tempIndex = 9; strandIndex = tempIndex + 9; break;
                    default :   break;
                }
                ArrayList<String> timeList = new ArrayList<>();
                ArrayList<Float> temperatureList = new ArrayList<>();
                ArrayList<Float> strainList = new ArrayList<>();

                FileReader fr = new FileReader(waveletFilePath);
                BufferedReader br = new BufferedReader(fr);
                String header = br.readLine();
                String content = br.readLine();
                while(content != null){
                    String[] split = content.split(",");
                    timeList.add(split[0]);
                    temperatureList.add(Float.parseFloat(split[tempIndex]));
                    strainList.add(Float.parseFloat(split[strandIndex]));
                    content = br.readLine();
                }
                br.close();
                fr.close();
                data.put("timeList", timeList);
                data.put("temperatureList", temperatureList);
                data.put("strainList", strainList);

            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e){
                e.printStackTrace();
            }
        }

        response.setData(data);
        return response.getHttpResponse();
    }

    /*
    附加时间范围条件,要求小波分析文件的首列为时间戳格式yyyyMMddHHmmssSS
     */

    @RequestMapping(value = "/wavelet-analysis/getWaveletResultTimeRange", method = RequestMethod.GET, produces = "application/json")
    public JSONObject getWaveletResult1TimeRange(String waveletfile, String waveletlayer, String starttime, String endtime){
        HttpResponse response = new HttpResponse();
        JSONObject data = new JSONObject();

        System.out.println(waveletfile);
        System.out.println(waveletlayer);
        System.out.println(starttime);
        System.out.println(endtime);

        String waveletFilePath = Constants.WAVELET_ANALYSIS_FILE + "/" + waveletfile;
        System.out.print(waveletFilePath);
        File file = new File(waveletFilePath);
        if(!file.exists()){
            response.setStatus(HttpResponse.FAIL_STATUS);
            response.setMsg("小波分析文件不存在！");
        }else{
            try {
                Long startTime = Long.valueOf(starttime);
                Long endTime = Long.valueOf(endtime);
                int tempIndex = 1;
                int strandIndex = tempIndex + 9;
                switch (waveletlayer){
                    case "origin" : tempIndex = 1; strandIndex = tempIndex + 9; break;
                    case "A7" : tempIndex = 2; strandIndex = tempIndex + 9; break;
                    case "D7" : tempIndex = 3; strandIndex = tempIndex + 9; break;
                    case "D6" : tempIndex = 4; strandIndex = tempIndex + 9; break;
                    case "D5" : tempIndex = 5; strandIndex = tempIndex + 9; break;
                    case "D4" : tempIndex = 6; strandIndex = tempIndex + 9; break;
                    case "D3" : tempIndex = 7; strandIndex = tempIndex + 9; break;
                    case "D2" : tempIndex = 8; strandIndex = tempIndex + 9; break;
                    case "D1" : tempIndex = 9; strandIndex = tempIndex + 9; break;
                    default :   break;
                }
                ArrayList<String> timeList = new ArrayList<>();
                ArrayList<Float> temperatureList = new ArrayList<>();
                ArrayList<Float> strainList = new ArrayList<>();

                FileReader fr = new FileReader(waveletFilePath);
                BufferedReader br = new BufferedReader(fr);
                String header = br.readLine();
                String content = br.readLine();
                while(content != null){
                    String[] split = content.split(",");
                    Long currentTime = Long.valueOf(split[0]);
                    if(currentTime >= startTime && currentTime <= endTime){
                        timeList.add(split[0]);
                        temperatureList.add(Float.parseFloat(split[tempIndex]));
                        strainList.add(Float.parseFloat(split[strandIndex]));
                    }
                    content = br.readLine();
                }
                br.close();
                fr.close();
                data.put("timeList", timeList);
                data.put("temperatureList", temperatureList);
                data.put("strainList", strainList);

            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e){
                e.printStackTrace();
            }
        }

        response.setData(data);
        return response.getHttpResponse();
    }

}

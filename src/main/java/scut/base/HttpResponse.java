package scut.base;

import com.alibaba.fastjson.JSONObject;

/**
 * Created by Carrod on 2018/4/20.
 */
public class HttpResponse {

    public HttpResponse(JSONObject data, String msg,Integer status, String code){
        this.setData(data);
        this.setMsg(msg);
        this.setStatus(status);
        this.setCode(code);
    }

    public HttpResponse(){
        this.setData(null);
        this.setMsg("");
        this.setStatus(SUCCESS_STATUS);
        this.setCode(SUCCESS_CODE);
    }

    JSONObject jsonObject = new JSONObject();
    /**
     * 成功
     */
    public final static Integer SUCCESS_STATUS = 0;
    /**
     * 失败
     */
    public final static Integer FAIL_STATUS = 1;

    /**
     * 成功
     */
    public final static String SUCCESS_CODE = "00";
    /**
     * 失败码1
     */
    public final static String FAIL_CODE = "01";

    public JSONObject getHttpResponse(){
        return jsonObject;
    }

    public JSONObject getData() {
        return (JSONObject) jsonObject.get("data");
    }

    public void setData(JSONObject jsonData) {
        jsonObject.put("data",jsonData);
    }

    public Integer getStatus() {
        return (Integer) jsonObject.get("status");
    }

    public void setStatus(Integer status) {
        jsonObject.put("status",status);
    }

    public String getMsg() {
        return jsonObject.get("msg").toString();
    }

    public void setMsg(String msg) {
        jsonObject.put("msg",msg);
    }

    public String getCode() {
        return jsonObject.get("code").toString();
    }

    public void setCode(String code) {
        jsonObject.put("code",code);
    }
}

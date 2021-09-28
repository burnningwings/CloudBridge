package scut.util;

import com.alibaba.fastjson.JSONObject;
import org.springframework.stereotype.Component;
import scut.base.HttpResponse;

@Component
public class HttpResponseBuilder {
    public JSONObject getFailedHttpResponse(String message) {
        HttpResponse response = new HttpResponse();
        response.setStatus(HttpResponse.FAIL_STATUS);
        response.setCode(HttpResponse.FAIL_CODE);
        response.setMsg(message);
        return response.getHttpResponse();
    }
}

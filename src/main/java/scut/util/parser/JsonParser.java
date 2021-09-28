package scut.util.parser;

import com.google.gson.*;
import com.google.gson.reflect.TypeToken;

import java.util.HashMap;
import java.util.Map;

public class JsonParser extends Parser {

	@SuppressWarnings("unchecked")
	@Override
	public Map<String, Object> parse(String content) {
		// TODO Auto-generated method stub

      Map<String, Object> ret = new GsonBuilder()
      .enableComplexMapKeySerialization().create().fromJson(content,
              new TypeToken<HashMap<String, Object>>() {
              }.getType());

		return ret;
	}
}

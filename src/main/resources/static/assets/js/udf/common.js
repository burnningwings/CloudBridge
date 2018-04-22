function setToken(token){
    $.cookie("token",token)
}


// HTTP request
function webRequest(url,requestType,async,data,callback){
    var response = null;
    var d = null;
    if(requestType=="POST"){
        $.ajax({
            type: requestType,
            async: async,
            url: url,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            dataType: "json",
            beforeSend: function () {
                var content = '' +
                    ' <img alt="loadding" src="/assets/imag/loading.gif" /> \
                    '
                d = dialog({
                    content: content
                });
                d.showModal();
            },
            success: function (message) {
                console.log(message)
                if(callback){
                    console.log("post callback");
                    callback(message);
                }else{
                    response = message;
                }
            },
            complete:function () {
                if (d != null) {
                    d.close().remove();
                }
            },
            error: function (message) {
                alert("提交数据失败！");
            }
        });
    } else {
        $.ajaxSettings.async = async;
        $.getJSON(url, data, function(message){
            if(callback){
                callback(message);
            }else{
                response = message;
            }
        }).done(function() {

        }).fail(function() {
            alert( "请求失败！" );
        }).always(function() {

        });
    }
    return response;
}
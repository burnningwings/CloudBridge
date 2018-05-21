function setToken(token){
    $.cookie("token",token)
}

// 短暂提示框
function showTransientDialog(content) {
    var d = dialog({
        content: content
    });
    d.show();
    setTimeout(function () {
        d.close().remove();
    }, 2000);
}

// 警告对话框，点击确定则只需callback
function showAlertDialog(content,ok_callback) {
    var d = dialog({
        title: "警告",
        content: content,
        okValue: '确定',
        ok: function () {
            return ok_callback();
        },
        cancelValue: '取消',
        cancel: function() {
        }
    });
    d.show();
}

// HTTP request
function webRequest(url,requestType,async,data,callback){
    var response = null;
    var d = null;
    if(requestType=="POST"){
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        $(document).ajaxSend(function(e, xhr, options) {
            xhr.setRequestHeader(header, token);
        });
        $.ajax({
            type: requestType,
            async: async,
            url: url,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            dataType: "json",
            beforeSend: function () {
                var content = '' +
                    ' <img alt="loadding" src="/assets/img/loading.gif" /> \
                    '
                d = dialog({
                    content: content
                });
                d.showModal();
            },
            success: function (message) {
                if(callback){
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
                console.log(message);
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

//模态弹窗
function showModalDialog(title, custom_content, ok_callback, width, height) {
    var d = dialog({
        title: title,
        content: custom_content,
        okValue: '确定',
        ok: function () {
            return ok_callback();
        },
        cancelValue: '取消',
        cancel: function () {
        }
    });
    d.width(width | 605).height(height | 300).showModal();
    $(".ui-dialog-content").mCustomScrollbar({
        axis: "y",
        advanced: {autoExpandHorizontalScroll: true},
        theme: "minimal-dark"
    });
}

var sensor_metadata_map = {
    "sin_sensor_info":{
        "name": "正弦传感器",
        "data_schema": {
            "CLSJ":"float",
            "CLYB":"float",
            "CLWD":"float",
            "DZ":"float",
            "XZYB":"float"
        }
    },
    "fiber_sensor_info":{
        "name": "光纤应变传感器",
        "data_schema": {
            "CLSJ":"float",
            "CLBC":"float",
            "YB":"float"
        }
    },
    "gps_sensor_info":{
        "name": "GPS传感器",
        "data_schema": {
            "CLSJ":"float",
            "WXZBX":"float",
            "QLZBX":"float",
            "WXWYX":"float",
            "QLWYX":"float",
            "WXZBY":"float",
            "QLZBY":"float",
            "WXWYY":"float",
            "QLWYY":"float",
            "WXZBZ":"float",
            "QLZBZ":"float",
            "WXWYZ":"float",
            "QLWZ":"float",
        }
    },
    "acce_sensor_info":{
        "name": "加速度传感器",
        "data_schema": {
            "CLSJ":"float",
            "DY":"float",
            "JSD":"float"
        }
    },
    "cable_sensor_info":{
        "name": "索力传感器",
        "data_schema": {
            "CLSJ":"float",
            "DY":"float",
            "JSD":"float",
            "SL":"float"
        }
    }
}

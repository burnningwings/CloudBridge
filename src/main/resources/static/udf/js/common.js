function setToken(token) {
    $.cookie("token", token)
}

// 短暂提示框
function showTransientDialog(content) {
    var d = dialog({
        width : 200,
        content: content,
    });
    d.show();
    setTimeout(function () {
        d.close().remove();
    }, 3000);
}

function showDialog(content) {
    var d = dialog({
        width : 200,
        content: content,
        okValue: '确定',
        ok: function () {
        }
    });
    d.show();
    // setTimeout(function () {
    //     d.close().remove();
    // }, 2000);
}

// 警告对话框，点击确定则只需callback
function showAlertDialog(content, ok_callback) {
    var d = dialog({
        title: "警告",
        content: content,
        okValue: '确定',
        ok: function () {
            return ok_callback();
        },
        cancelValue: '取消',
        cancel: function () {
        }
    });
    d.show();
}

// HTTP request
function webRequest(url, requestType, async, data, callback) {
    var response = null;
    var d = null;
    if (requestType == "POST") {
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        $(document).ajaxSend(function (e, xhr, options) {
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
                if (callback) {
                    callback(message);
                } else {
                    response = message;
                }
            },
            complete: function () {
                if (d != null) {
                    d.close().remove();
                }
            },
            // error: function (message) {
            //     console.log(message);
            //     alert("提交数据失败！");
            // }
            error: function (xhr) {
                if (xhr.status == 403) {
                    alert("对不起，您没有权限");
                } else {
                    alert("提交数据失败");
                }
            }
        });
    } else {
        $.ajaxSettings.async = async;
        $.getJSON(url, data, function (message) {
            if (callback) {
                callback(message);
            } else {
                response = message;
            }
        }).done(function () {

            // }).fail(function() {
            //     alert( "请求失败！" );
        }).fail(function (xhr) {
            if (xhr.status == 403) {
                alert("对不起，您没有权限");
            } else {
                alert("提交数据失败");
            }
        }).always(function () {

        });
    }
    return response;
}

function showModalDialogWithoutOK(title, custom_content, width, height) {
    var d = dialog({
        title: title,
        content: custom_content
    });
    if (width == null || width == "") width = 605;
    if (height == null || height == "") height = 300;
    d.width(width).height(height).showModal();
    $(".ui-dialog-content").mCustomScrollbar({
        axis: "y",
        advanced: {autoExpandHorizontalScroll: true},
        theme: "minimal-dark"
    });
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
    if (width == null || width == "") width = 605;
    if (height == null || height == "") height = 300;
    d.width(width).height(height).showModal();
    $(".ui-dialog-content").mCustomScrollbar({
        axis: "y",
        advanced: {autoExpandHorizontalScroll: true},
        theme: "minimal-dark"
    });
    //增加桥梁参数
    $('#add_bridge_select').change(function () {
        var section_option ="";
        var response1 = webRequest("/section/simple-list", "GET", false, {'bridgeId': $('#add_bridge_select').val()});
        if (response1 != null && response1['data']) {
            var data = response1["data"];
            for (var i = 0; i < data.length; i++) {
                section_option += "<option value='" + data[i]['section_id'] + "'>" + data[i]['section_name'] + "</option>";
            }
            $('#add_section_select').empty();
            $('#add_section_select').append(section_option);
            $('#add_section_select').trigger("change");
            $('.selectpicker').selectpicker('refresh');
        }
    })
    $('#add_section_select').change(function (){
        var point_option ="";
        var response1 = webRequest("/watch-point/simple-list", "GET", false, {'sectionId': $('#add_section_select').val()});
        if (response1 != null && response1['data']) {
            var data = response1["data"];
            for (var i = 0; i < data.length; i++) {
                point_option += "<option value='" + data[i]['watch_point_id'] + "'>" + data[i]['watch_point_name'] + "</option>";
            }
            $('#add_point_select').empty();
            $('#add_point_select').append(point_option);
            $('.selectpicker').selectpicker('refresh');
        }
    })
}

//模态弹窗-拥有水平滚动条
function showMessageDialog(title, custom_content, ok_callback, width, height) {
    if (width == null || width == "") width = 605;
    if (height == null || height == "") height = 300;
    var d = dialog({
        title: title,
        content: custom_content,
        width: width,
        height: height,
        okValue: '确定',
        ok: function () {
            return ok_callback();
        },
        cancelValue: '取消',
        cancel: function () {
        }
    });
    $(".ui-dialog-content").mCustomScrollbar({
        axis: "yx",
        advanced: {autoExpandHorizontalScroll: true},
        theme: "minimal-dark"
    });
    d.showModal();
}

var sensor_metadata_map = {
    "振弦传感器": {
        "name": "sin_sensor_info",
        "data_schema": {
            "CLSJ": "float",
            "CLYB": "float",
            "CLWD": "float",
            "DZ": "float",
            "XZYB": "float"
        }
    },
    "光纤应变传感器": {
        "name": "fiber_sensor_info",
        "data_schema": {
            "CLSJ": "float",
            "CLBC": "float",
            "YB": "float"
        }
    },
    "GPS传感器": {
        "name": "gps_sensor_info",
        "data_schema": {
            "CLSJ": "float",
            "WXZBX": "float",
            "QLZBX": "float",
            "WXWYX": "float",
            "QLWYX": "float",
            "WXZBY": "float",
            "QLZBY": "float",
            "WXWYY": "float",
            "QLWYY": "float",
            "WXZBZ": "float",
            "QLZBZ": "float",
            "WXWYZ": "float",
            "QLWZ": "float",
        }
    },
    "加速度传感器": {
        "name": "acce_sensor_info",
        "data_schema": {
            "CLSJ": "float",
            "DY": "float",
            "JSD": "float"
        }
    },
    "索力传感器": {
        "name": "cable_sensor_info",
        "data_schema": {
            "CLSJ": "float",
            "DY": "float",
            "JSD": "float",
            "SL": "float"
        }
    }
};

var sensor_data_schema = {
    "振弦传感器": {
        "name": "sin_sensor_info",
        "data_schema": {
            "测量时间": "float",
            "测量应变": "float",
            "测量温度": "float",
            "电阻": "float",
            "修正应变": "float"
        }
    },
    "光纤应变传感器": {
        "name": "fiber_sensor_info",
        "data_schema": {
            "测量时间": "float",
            "测量波长": "float",
            "应变": "float"
        }
    },
    "GPS传感器": {
        "name": "gps_sensor_info",
        "data_schema": {
            "测量时间": "float",
            "测量卫星坐标X": "float",
            "测量局部坐标X": "float",
            "卫星X方向位移": "float",
            "局部X方向位移": "float",
            "测量卫星坐标Y": "float",
            "测量局部坐标Y": "float",
            "卫星Y方向位移": "float",
            "局部Y方向位移": "float",
            "测量卫星坐标Z": "float",
            "测量局部坐标Z": "float",
            "卫星Z方向位移": "float",
            "局部Z方向位移": "float",
        }
    },
    "加速度传感器": {
        "name": "acce_sensor_info",
        "data_schema": {
            "测量时间": "float",
            "电压": "float",
            "加速度": "float"
        }
    },
    "索力传感器": {
        "name": "cable_sensor_info",
        "data_schema": {
            "测量时间": "float",
            "电压": "float",
            "加速度": "float",
            "索力": "float"
        }
    }
};

var sensor_metrics_CN = {
    "CLSJ" : "测量时间",
    "DY" : "电压",
    "JSD" : "加速度",
    "SL" : "索力",
    "WXZBX": "测量卫星坐标X",
    "QLZBX": "测量局部坐标X",
    "WXWYX": "卫星X方向位移",
    "QLWYX": "局部X方向位移",
    "WXZBY": "测量卫星坐标Y",
    "QLZBY": "测量局部坐标Y",
    "WXWYY": "卫星Y方向位移",
    "QLWYY": "局部Y方向位移",
    "WXZBZ": "测量卫星坐标Z",
    "QLZBZ": "测量局部坐标Z",
    "WXWYZ": "卫星Z方向位移",
    "QLWZ": "局部Z方向位移",
    "CLBC": "测量波长",
    "YB": "应变",
    "CLYB": "测量应变",
    "CLWD": "测量温度",
    "DZ": "电阻",
    "XZYB": "修正应变"

}

function getUserRole() {
    return $('meta[name=role]').attr("content");
}

function isCommonRole(role) {
    return role === 'ROLE_USER';
}

function isAdminRole(role) {
    return role === 'ROLE_ADMIN';
}

function getDetailCol(role) {
    if (!isAdminRole(role)) {
        return {
            title: "详情",
            buttonText: "查看",
            buttonClass: "btn btn-success"
        }
    } else {
        return {
            title: "修改",
            buttonText: "修改",
            buttonClass: "btn btn-warning"
        }
    }
}
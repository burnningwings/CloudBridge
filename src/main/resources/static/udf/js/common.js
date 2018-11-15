function setToken(token) {
    $.cookie("token", token)
}

// 短暂提示框
function showTransientDialog(content) {
    var d = dialog({
        content: content,
    });
    d.show();
    setTimeout(function () {
        d.close().remove();
    }, 2000);
}

function showDialog(content) {
    var d = dialog({
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
    "正弦传感器": {
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
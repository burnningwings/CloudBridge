//更新传感器信息列表
function updateSensorGrid(bridge_id, section_id, watch_point_id, watch_box_id) {
    var detailCol = getDetailCol(getUserRole()),
        detailTitle = detailCol['title'],
        detailBtnText = detailCol['buttonText'],
        detailBtnClass = detailCol['buttonClass'];

    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                type: "get",
                url: "/sensor/list",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (options, operation) {
                if (operation == "read") {
                    var parameter = {
                        page: options.page,
                        pageSize: options.pageSize,
                        bridgeId: bridge_id | 0,
                        sectionId: section_id | 0,
                        watchPointId: watch_point_id | 0,
                        watchBoxId: watch_box_id | 0
                    };
                    return parameter;
                }
            }
        },
        batch: true,
        pageSize: 10,
        schema: {
            data: function (d) {
                return d.data;
            },
            total: function (d) {
                return d.total;
            }
        },
        serverPaging: true
    });

    $("#sensor-grid").empty();    //主要为了清空已绑定的事件
    $("#sensor-grid").kendoGrid({
        dataSource: dataSource,
        pageable: {
            pageSizes: [10, 25, 50, 100],
            buttonCount: 5,
            messages: {
                display: "{0} - {1} 共 {2} 条数据",
                empty: "没有数据",
                page: "页",
                of: "/ {0}",
                itemsPerPage: "条每页",
                first: "第一页",
                previous: "前一页",
                next: "下一页",
                last: "最后一页",
                refresh: "刷新"
            }
        },
        columns: [
            {
                template: '<input type="checkbox" class="checkbox" name="sensor-checkbox" value="#:sensor_id#" />',
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"},
                width: '30px'
            },
            {
                field: "sensor_name",
                title: "名称",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                field: "sensor_number",
                title: "编号",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                field: "sensor_type_name",
                title: "类型",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                field: "watch_point_name",
                title: "所属监测点",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                field: "watch_box_name",
                title: "所属控制箱",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                field: "section_name",
                title: "所属截面",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                field: "bridge_name",
                title: "所属桥梁",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                template: "<a class='" + detailBtnClass + "' id='modify-#:sensor_id#' onclick='modifySensorInfo(#:sensor_id#)'/>" + detailBtnText + "</a>",
                title: detailTitle,
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }
        ]
    });
}

//弹窗
function showSensorDialog(title, operationType, sensorId, bridgeId, sectionId, watchPointId, watchBoxId) {
    var url = '/sensor/info';
    var params = {
        'sensorId': sensorId,
        'bridgeId': bridgeId,
        'sectionId': sectionId
    };
    var response = webRequest(url, 'GET', false, params);
    var bridge_options = "";
    var section_options = "";
    var watch_point_options = "";
    var watch_box_options = "";
    var sensor_type_options = "";

    var full_content = "";

    var sensor_type_id = "";
    var sensor_name = "";
    var sensor_number = "";

    if (response.status == 0) {
        var data = response.data;
        if (data['sensor_info'] && data['sensor_info'].length > 0) {
            var si = data['sensor_info'][0];
            bridgeId = si["bridge_id"];
            sectionId = si["section_id"];
            watchPointId = si["watch_point_id"];
            watchBoxId = si["watch_box_id"];
            sensor_name = si["sensor_name"];
            sensor_number = si["sensor_number"];
            sensor_type_id = si["sensor_type_id"];
        }
        //桥梁下拉框
        for (var i = 0; i < data['bridge_list'].length; i++) {
            var b = data['bridge_list'][i];
            if (b['bridge_id'] == bridgeId) {
                bridge_options += '<option value="' + b['bridge_id'] + '" selected="selected">' + b['bridge_name'] + '</option>';
            } else {
                bridge_options += '<option value="' + b['bridge_id'] + '">' + b['bridge_name'] + '</option>';
            }
        }
        //截面下拉框
        for (i = 0; i < data['section_list'].length; i++) {
            var s = data['section_list'][i];
            if (s['section_id'] == sectionId) {
                section_options += '<option value="' + s['section_id'] + '" selected="selected">' + s['section_name'] + '</option>';
            } else {
                section_options += '<option value="' + s['section_id'] + '">' + s['section_name'] + '</option>';
            }
        }
        //监测点下拉框
        for (i = 0; i < data['watch_point_list'].length; i++) {
            var wp = data['watch_point_list'][i];
            if (wp['watch_point_id'] == watchPointId) {
                watch_point_options += '<option value="' + wp['watch_point_id'] + '" selected="selected">' + wp['watch_point_name'] + '</option>';
            } else {
                watch_point_options += '<option value="' + wp['watch_point_id'] + '">' + wp['watch_point_name'] + '</option>';
            }
        }
        //控制箱下拉框
        for (i = 0; i < data['watch_box_list'].length; i++) {
            var wb = data['watch_box_list'][i];
            if (wb['watch_box_id'] == watchBoxId) {
                watch_box_options += '<option value="' + wb['watch_box_id'] + '" selected="selected">' + wb['watch_box_name'] + '</option>';
            } else {
                watch_box_options += '<option value="' + wb['watch_box_id'] + '">' + wb['watch_box_name'] + '</option>';
            }
        }
        //传感器类型下拉框
        for (i = 0; i < data['sensor_type_list'].length; i++) {
            var st = data['sensor_type_list'][i];
            if (st['sensor_type_id'] == sensor_type_id) {
                sensor_type_options += '<option value="' + st['sensor_type_id'] + '" selected="selected">' + st['sensor_type_name'] + '</option>';
            } else {
                sensor_type_options += '<option value="' + st['sensor_type_id'] + '">' + st['sensor_type_name'] + '</option>';
            }
        }

        if (data['sensor_full_info'] && data['sensor_full_info'].length > 0) {
            full_content = sensorFullInfo(sensor_type_id, data['sensor_full_info'][0]);
        }
    }

    var content = '\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">所属桥梁:</label>  \
            <div class="col-sm-8">  \
                <select class="form-control" id="bridge_sel">' + bridge_options + '</select>  \
            </div> \
            <span class="text-danger mt5 fl">*</span>\
        </div>\
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">所属截面:</label>  \
            <div class="col-sm-8">  \
                <select class="form-control" id="section_sel">' + section_options + '</select>  \
            </div> \
            <span class="text-danger mt5 fl">*</span>\
        </div>\
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">所属监测点:</label>  \
            <div class="col-sm-8">  \
                <select class="form-control" id="watch_point_sel">' + watch_point_options + '</select>  \
            </div> \
            <span class="text-danger mt5 fl">*</span>\
        </div>\
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">所属控制箱:</label>  \
            <div class="col-sm-8">  \
                <select class="form-control" id="watch_box_sel">' + watch_box_options + '</select>  \
            </div> \
            <span class="text-danger mt5 fl">*</span>\
        </div>\
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">传感器名称:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="sensor_name" placeholder="请输入传感器名称" value="' + sensor_name + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">传感器编号:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="sensor_number" placeholder="请输入传感器编号" value="' + sensor_number + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">传感器类型:</label>  \
            <div class="col-sm-8">  \
                <select class="form-control" id="sensor_type_sel">' + sensor_type_options + '</select>  \
            </div> \
            <span class="text-danger mt5 fl">*</span>\
        </div>\
        <br>\
        ';
    if (!full_content) {
        full_content = sensorFullInfo();
    }
    content += full_content;
    content = '<div id="sensor_form">' + content + '</div>';

    if (!isAdminRole(getUserRole())) {
        showModalDialogWithoutOK(title, content, 605, 330);
        $('div.form-inline-custom').find('input,select,textarea').attr('disabled', 'disabled');
    } else {
        showModalDialog(title, content, function () {
            //必须参数
            var bridgeId = $('#bridge_sel').val();
            var sectionId = $('#section_sel').val();
            var watchPointId = $('#watch_point_sel').val();
            var watchBoxId = $('#watch_box_sel').val();
            var sensorName = $('#sensor_name').val();
            var sensorNumber = $('#sensor_number').val();
            var sensorTypeId = parseInt($('#sensor_type_sel').val());
            var QLJBZBXYDWD = "";
            var QLJBZBXYDJD = "";
            var QLJBZBXYDGC = "";
            var CGQZBX = "";
            var CGQZBY = "";
            var CGQZBZ = "";
            var CGQJD = "";
            var CSYB = "";
            var CSSJ = "";
            var CSWD = "";
            var CSZBX = "";
            var CSZBY = "";
            var CSZBZ = "";
            var JSDXS = "";
            var SLXS = "";
            var CSBC = "";
            var BCXS = "";
            var CGQSSMKLX = "";
            var CGQSSMKBH = "";
            var CGQSSMKTDH = "";
            var CGQCDBH = "";

            var float_10_3 = /^(0|[1-9]\d{0,6})(\.\d{1,3})?$/;
            var varchar_200 = /^[^\s]{1,200}$/;

            var QLJBZBXYDWDPattern = /^(0|[1-9]\d{0,10})(\.\d{1,2})?$/;
            var QLJBZBXYDJDPattern = /^(0|[1-9]\d{0,11})(\.\d{1,2})?$/;
            var QLJBZBXYDGCPattern = float_10_3;
            var CGQZBXPattern = float_10_3;
            var CGQZBYPattern = float_10_3;
            var CGQZBZPattern = float_10_3;
            var CGQJDPattern = varchar_200;
            var CSYBPattern = float_10_3;
            var CSSJPattern = /^(?:(?!0000)[0-9]{4}(?:(?:0[1-9]|1[0-2])(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])(?:29|30)|(?:0[13578]|1[02])31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)0229)([01][0-9]|2[0-3])[0-5][0-9][0-5][0-9]\.\d{1,3}$/;
            var CSWDPattern = float_10_3;
            var CSZBXPattern = float_10_3;
            var CSZBYPattern = float_10_3;
            var CSZBZPattern = float_10_3;
            var JSDXSPattern = float_10_3;
            var SLXSPattern = float_10_3;
            var CSBCPattern = float_10_3;
            var BCXSPattern = float_10_3;
            var CGQSSMKLXPattern = varchar_200;
            var CGQSSMKBHPattern = varchar_200;
            var CGQSSMKTDHPattern = varchar_200;
            var CGQCDBHPattern = varchar_200;

            switch (sensorTypeId) { // 传感器类型
                case 1: // 正弦传感器
                    QLJBZBXYDWD = $('#QLJBZBXYDWD').val();
                    QLJBZBXYDJD = $('#QLJBZBXYDJD').val();
                    QLJBZBXYDGC = $('#QLJBZBXYDGC').val();
                    CGQZBX = $('#CGQZBX').val();
                    CGQZBY = $('#CGQZBY').val();
                    CGQZBZ = $('#CGQZBZ').val();
                    CGQJD = $('#CGQJD').val();
                    CSYB = $('#CSYB').val();
                    CSSJ = $('#CSSJ').val();
                    CSWD = $('#CSWD').val();
                    CGQSSMKLX = $('#CGQSSMKLX').val();
                    CGQSSMKBH = $('#CGQSSMKBH').val();
                    CGQSSMKTDH = $('#CGQSSMKTDH').val();

                    if (!QLJBZBXYDWDPattern.test(QLJBZBXYDWD)) {
                        showTransientDialog('“桥梁局部坐标系原点纬度” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!QLJBZBXYDJDPattern.test(QLJBZBXYDJD)) {
                        showTransientDialog('“桥梁局部坐标系原点经度” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!QLJBZBXYDGCPattern.test(QLJBZBXYDGC)) {
                        showTransientDialog('“桥梁局部坐标系原点高程” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQZBXPattern.test(CGQZBX)) {
                        showTransientDialog('“传感器坐标X” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQZBYPattern.test(CGQZBY)) {
                        showTransientDialog('“传感器坐标Y” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQZBZPattern.test(CGQZBZ)) {
                        showTransientDialog('“传感器坐标Z” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQJDPattern.test(CGQJD)) {
                        showTransientDialog('“传感器精度” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CSYBPattern.test(CSYB)) {
                        showTransientDialog('“初始应变” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CSSJPattern.test(CSSJ)) {
                        showTransientDialog('“初始应变测量时间” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CSWDPattern.test(CSWD)) {
                        showTransientDialog('“初始温度” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQSSMKLXPattern.test(CGQSSMKLX)) {
                        showTransientDialog('“传感器所属模块类型” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQSSMKBHPattern.test(CGQSSMKBH)) {
                        showTransientDialog('“传感器所属模块编号” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQSSMKTDHPattern.test(CGQSSMKTDH)) {
                        showTransientDialog('“传感器所属模块通道号” 未填写或有误，请重新检查');
                        return false;
                    }

                    break;
                case 2: // 光纤应变传感器
                    QLJBZBXYDWD = $('#QLJBZBXYDWD').val();
                    QLJBZBXYDJD = $('#QLJBZBXYDJD').val();
                    QLJBZBXYDGC = $('#QLJBZBXYDGC').val();
                    CGQZBX = $('#CGQZBX').val();
                    CGQZBY = $('#CGQZBY').val();
                    CGQZBZ = $('#CGQZBZ').val();
                    CGQJD = $('#CGQJD').val();
                    CSBC = $('#CSBC').val();
                    CSSJ = $('#CSSJ').val();
                    CGQSSMKLX = $('#CGQSSMKLX').val();
                    CGQSSMKBH = $('#CGQSSMKBH').val();
                    CGQSSMKTDH = $('#CGQSSMKTDH').val();
                    BCXS = $('#BCXS').val();

                    if (!QLJBZBXYDWDPattern.test(QLJBZBXYDWD)) {
                        showTransientDialog('“桥梁局部坐标系原点纬度” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!QLJBZBXYDJDPattern.test(QLJBZBXYDJD)) {
                        showTransientDialog('“桥梁局部坐标系原点经度” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!QLJBZBXYDGCPattern.test(QLJBZBXYDGC)) {
                        showTransientDialog('“桥梁局部坐标系原点高程” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQZBXPattern.test(CGQZBX)) {
                        showTransientDialog('“传感器坐标X” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQZBYPattern.test(CGQZBY)) {
                        showTransientDialog('“传感器坐标Y” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQZBZPattern.test(CGQZBZ)) {
                        showTransientDialog('“传感器坐标Z” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQJDPattern.test(CGQJD)) {
                        showTransientDialog('“传感器精度” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CSBCPattern.test(CSBC)) {
                        showTransientDialog('“初始波长” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CSSJPattern.test(CSSJ)) {
                        showTransientDialog('“初始测量时间” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQSSMKLXPattern.test(CGQSSMKLX)) {
                        showTransientDialog('“传感器所属模块类型” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQSSMKBHPattern.test(CGQSSMKBH)) {
                        showTransientDialog('“传感器所属模块编号” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQSSMKTDHPattern.test(CGQSSMKTDH)) {
                        showTransientDialog('“传感器所属模块通道号” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!BCXSPattern.test(BCXS)) {
                        showTransientDialog('“波长系数” 未填写或有误，请重新检查');
                        return false;
                    }

                    break;
                case 3: // GPS传感器
                    CGQCDBH = $('#CGQCDBH').val();
                    QLJBZBXYDWD = $('#QLJBZBXYDWD').val();
                    QLJBZBXYDJD = $('#QLJBZBXYDJD').val();
                    QLJBZBXYDGC = $('#QLJBZBXYDGC').val();
                    CGQJD = $('#CGQJD').val();
                    CSZBX = $('#CSZBX').val();
                    CSZBY = $('#CSZBY').val();
                    CSZBZ = $('#CSZBZ').val();
                    CSSJ = $('#CSSJ').val();

                    if (!CGQCDBHPattern.test(CGQCDBH)) {
                        showTransientDialog('“传感器测点编号” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!QLJBZBXYDWDPattern.test(QLJBZBXYDWD)) {
                        showTransientDialog('“桥梁局部坐标系原点纬度” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!QLJBZBXYDJDPattern.test(QLJBZBXYDJD)) {
                        showTransientDialog('“桥梁局部坐标系原点经度” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!QLJBZBXYDGCPattern.test(QLJBZBXYDGC)) {
                        showTransientDialog('“桥梁局部坐标系原点高程” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQJDPattern.test(CGQJD)) {
                        showTransientDialog('“传感器精度” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CSZBXPattern.test(CSZBX)) {
                        showTransientDialog('“初始坐标X” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CSZBYPattern.test(CSZBY)) {
                        showTransientDialog('“初始坐标Y” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CSZBZPattern.test(CSZBZ)) {
                        showTransientDialog('“初始坐标Z” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CSSJPattern.test(CSSJ)) {
                        showTransientDialog('“初始值测量时间” 未填写或有误，请重新检查');
                        return false;
                    }

                    break;
                case 4: // 加速度传感器
                    QLJBZBXYDWD = $('#QLJBZBXYDWD').val();
                    QLJBZBXYDJD = $('#QLJBZBXYDJD').val();
                    QLJBZBXYDGC = $('#QLJBZBXYDGC').val();
                    CGQZBX = $('#CGQZBX').val();
                    CGQZBY = $('#CGQZBY').val();
                    CGQZBZ = $('#CGQZBZ').val();
                    CGQJD = $('#CGQJD').val();
                    CSSJ = $('#CSSJ').val();
                    CGQSSMKLX = $('#CGQSSMKLX').val();
                    CGQSSMKBH = $('#CGQSSMKBH').val();
                    CGQSSMKTDH = $('#CGQSSMKTDH').val();
                    JSDXS = $('#JSDXS').val();

                    if (!QLJBZBXYDWDPattern.test(QLJBZBXYDWD)) {
                        showTransientDialog('“桥梁局部坐标系原点纬度” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!QLJBZBXYDJDPattern.test(QLJBZBXYDJD)) {
                        showTransientDialog('“桥梁局部坐标系原点经度” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!QLJBZBXYDGCPattern.test(QLJBZBXYDGC)) {
                        showTransientDialog('“桥梁局部坐标系原点高程” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQZBXPattern.test(CGQZBX)) {
                        showTransientDialog('“传感器坐标X” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQZBYPattern.test(CGQZBY)) {
                        showTransientDialog('“传感器坐标Y” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQZBZPattern.test(CGQZBZ)) {
                        showTransientDialog('“传感器坐标Z” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQJDPattern.test(CGQJD)) {
                        showTransientDialog('“传感器精度” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CSSJPattern.test(CSSJ)) {
                        showTransientDialog('“初始测量时间” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQSSMKLXPattern.test(CGQSSMKLX)) {
                        showTransientDialog('“传感器所属模块类型” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQSSMKBHPattern.test(CGQSSMKBH)) {
                        showTransientDialog('“传感器所属模块编号” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQSSMKTDHPattern.test(CGQSSMKTDH)) {
                        showTransientDialog('“传感器所属模块通道号” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!JSDXSPattern.test(JSDXS)) {
                        showTransientDialog('“加速度系数” 未填写或有误，请重新检查');
                        return false;
                    }

                    break;
                case 5: // 索力传感器
                    QLJBZBXYDWD = $('#QLJBZBXYDWD').val();
                    QLJBZBXYDJD = $('#QLJBZBXYDJD').val();
                    QLJBZBXYDGC = $('#QLJBZBXYDGC').val();
                    CGQZBX = $('#CGQZBX').val();
                    CGQZBY = $('#CGQZBY').val();
                    CGQZBZ = $('#CGQZBZ').val();
                    CGQJD = $('#CGQJD').val();
                    CSSJ = $('#CSSJ').val();
                    CGQSSMKLX = $('#CGQSSMKLX').val();
                    CGQSSMKBH = $('#CGQSSMKBH').val();
                    CGQSSMKTDH = $('#CGQSSMKTDH').val();
                    SLXS = $('#SLXS').val();
                    JSDXS = $('#JSDXS').val();

                    if (!QLJBZBXYDWDPattern.test(QLJBZBXYDWD)) {
                        showTransientDialog('“桥梁局部坐标系原点纬度” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!QLJBZBXYDJDPattern.test(QLJBZBXYDJD)) {
                        showTransientDialog('“桥梁局部坐标系原点经度” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!QLJBZBXYDGCPattern.test(QLJBZBXYDGC)) {
                        showTransientDialog('“桥梁局部坐标系原点高程” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQZBXPattern.test(CGQZBX)) {
                        showTransientDialog('“传感器坐标X” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQZBYPattern.test(CGQZBY)) {
                        showTransientDialog('“传感器坐标Y” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQZBZPattern.test(CGQZBZ)) {
                        showTransientDialog('“传感器坐标Z” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQJDPattern.test(CGQJD)) {
                        showTransientDialog('“传感器精度” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CSSJPattern.test(CSSJ)) {
                        showTransientDialog('“初始测量时间” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQSSMKLXPattern.test(CGQSSMKLX)) {
                        showTransientDialog('“传感器所属模块类型” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQSSMKBHPattern.test(CGQSSMKBH)) {
                        showTransientDialog('“传感器所属模块编号” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!CGQSSMKTDHPattern.test(CGQSSMKTDH)) {
                        showTransientDialog('“传感器所属模块通道号” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!SLXSPattern.test(SLXS)) {
                        showTransientDialog('“索力系数” 未填写或有误，请重新检查');
                        return false;
                    }
                    if (!JSDXSPattern.test(JSDXS)) {
                        showTransientDialog('“加速度系数” 未填写或有误，请重新检查');
                        return false;
                    }

                    break;
                default:
                    break;
            }

            if (!operationType || !sensorTypeId || !bridgeId ||
                !sensorName || !sensorNumber || !sectionId ||
                !watchPointId || !watchBoxId) {
                showTransientDialog("必填项不能为空！");
                return false;
            } else {
                var url = '/sensor/create-or-update';
                var params = {
                    "operationType": operationType,
                    "sensorId": sensorId,
                    "sensorTypeId": sensorTypeId,
                    "watchPointId": watchPointId,
                    "watchBoxId": watchBoxId,
                    "sensorName": sensorName,
                    "sensorNumber": sensorNumber,
                    "QLJBZBXYDWD": QLJBZBXYDWD,
                    "QLJBZBXYDJD": QLJBZBXYDJD,
                    "QLJBZBXYDGC": QLJBZBXYDGC,
                    "CGQZBX": CGQZBX,
                    "CGQZBY": CGQZBY,
                    "CGQZBZ": CGQZBZ,
                    "CGQJD": CGQJD,
                    "CSYB": CSYB,
                    "CSSJ": CSSJ,
                    "CSWD": CSWD,
                    "CSZBX": CSZBX,
                    "CSZBY": CSZBY,
                    "CSZBZ": CSZBZ,
                    "JSDXS": JSDXS,
                    "SLXS": SLXS,
                    "CSBC": CSBC,
                    "BCXS": BCXS,
                    "CGQSSMKLX": CGQSSMKLX,
                    "CGQSSMKBH": CGQSSMKBH,
                    "CGQSSMKTDH": CGQSSMKTDH,
                    "CGQCDBH": CGQCDBH
                };
                console.log(params);

                var response = webRequest(url, 'POST', false, params);
                if (response != null && response.status == 0) {
                    refreshData();
                    showTransientDialog("操作成功！");
                    return true;
                } else {
                    showTransientDialog(response.msg);
                    return false;
                }
            }
        }, 605, 330);
    }

    //选择桥梁后-截面、监测点和控制箱列表联动
    $('#bridge_sel').on('change', function () {
        //截面列表联动
        var section_options = "";
        if ($(this).val()) {
            var url = "/section/simple-list";
            var response = webRequest(url, 'GET', false, {'bridgeId': $(this).val()});
            var section_list = response['data'];//格式：[{'section_id':1,'section_name':''},{...}]
            if (section_list) {
                for (var i = 0; i < section_list.length; i++) {
                    section_options += '<option value="' + section_list[i]['section_id'] + '">' + section_list[i]['section_name'] + '</option>'
                }
            }
        }
        $('#section_sel').empty();
        $('#section_sel').append(section_options);
        //监测点列表联动
        var watch_point_options = "";
        if ($('#section_sel').val()) {
            url = "/watch-point/simple-list";
            response = webRequest(url, 'GET', false, {'sectionId': $('#section_sel').val()});
            var watch_point_list = response['data'];
            if (watch_point_list) {
                for (i = 0; i < watch_point_list.length; i++) {
                    watch_point_options += '<option value="' + watch_point_list[i]['watch_point_id'] + '">' + watch_point_list[i]['watch_point_name'] + '</option>'
                }
            }
        }
        $('#watch_point_sel').empty();
        $('#watch_point_sel').append(watch_point_options);
        //控制箱列表联动
        var watch_box_options = "";
        if ($(this).val()) {
            url = "/watch-box/simple-list";
            response = webRequest(url, 'GET', false, {'bridgeId': $(this).val()});
            var watch_box_list = response['data'];
            if (watch_box_list) {
                for (i = 0; i < watch_box_list.length; i++) {
                    watch_box_options += '<option value="' + watch_box_list[i]['watch_box_id'] + '">' + watch_box_list[i]['watch_box_name'] + '</option>'
                }
            }
        }
        $('#watch_box_sel').empty();
        $('#watch_box_sel').append(watch_box_options);
    });
    //选择截面后-监测点列表联动
    $('#section_sel').on('change', function () {
        var watch_point_options = "";
        if ($(this).val()) {
            var url = "/watch-point/simple-list";
            var response = webRequest(url, 'GET', false, {'sectionId': $(this).val()});
            var watch_point_list = response['data'];
            if (watch_point_list) {
                for (i = 0; i < watch_point_list.length; i++) {
                    watch_point_options += '<option value="' + watch_point_list[i]['watch_point_id'] + '">' + watch_point_list[i]['watch_point_name'] + '</option>'
                }
            }
        }
        $('#watch_point_sel').empty();
        $('#watch_point_sel').append(watch_point_options);
    });
    //选择传感器类型后-详细信息列表联动
    $('#sensor_type_sel').on('change', function () {
        var sel_type_id = $(this).val();
        $('#sensor_type_block').replaceWith(sensorFullInfo(sel_type_id));
    });

    //处理handle undefined
    function h(obj) {
        var val = '';
        if (typeof(obj) != 'undefined') {
            val = obj;
        }
        return val;
    }

    //传感器完整信息
    function sensorFullInfo(sensor_type_id, sensor_full_info) {
        var content = "";
        var sf = sensor_full_info ? sensor_full_info : {};
        sensor_type_id = sensor_type_id ? sensor_type_id : 1;
        sensor_type_id = parseInt(sensor_type_id);//switch结构用的整形 因此这里也要转成整形
        switch (sensor_type_id) {
            case 1:
                content = '\
                    <div id="sensor_type_block">\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">桥梁局部坐标系原点纬度:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="QLJBZBXYDWD" placeholder="请输入桥梁局部坐标系原点纬度" value="' + h(sf['QLJBZBXYDWD']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">桥梁局部坐标系原点经度:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="QLJBZBXYDJD" placeholder="请输入桥梁局部坐标系原点经度" value="' + h(sf['QLJBZBXYDJD']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">桥梁局部坐标系原点高程:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="QLJBZBXYDGC" placeholder="请输入桥梁局部坐标系原点高程" value="' + h(sf['QLJBZBXYDGC']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器坐标X:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQZBX" placeholder="请输入传感器坐标X" value="' + h(sf['CGQZBX']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器坐标Y:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQZBY" placeholder="请输入传感器坐标Y" value="' + h(sf['CGQZBY']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器坐标Z:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQZBZ" placeholder="请输入传感器坐标Z" value="' + h(sf['CGQZBZ']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器精度:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQJD" placeholder="请输入传感器精度" value="' + h(sf['CGQJD']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">初始应变:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CSYB" placeholder="请输入初始应变" value="' + h(sf['CSYB']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">初始应变测量时间:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CSSJ" placeholder="请输入初始应变测量时间" value="' + h(sf['CSSJ']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">初始温度:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CSWD" placeholder="请输入初始温度" value="' + h(sf['CSWD']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器所属模块类型:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQSSMKLX" placeholder="请输入传感器所属模块类型" value="' + h(sf['CGQSSMKLX']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器所属模块编号:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQSSMKBH" placeholder="请输入传感器所属模块编号" value="' + h(sf['CGQSSMKBH']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器所属模块通道号:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQSSMKTDH" placeholder="请输入传感器所属模块通道号" value="' + h(sf['CGQSSMKTDH']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                    </div>\
                    ';
                break;
            case 2:
                content = '\
                    <div id="sensor_type_block">\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">桥梁局部坐标系原点纬度:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="QLJBZBXYDWD" placeholder="请输入桥梁局部坐标系原点纬度" value="' + h(sf['QLJBZBXYDWD']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">桥梁局部坐标系原点经度:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="QLJBZBXYDJD" placeholder="请输入桥梁局部坐标系原点经度" value="' + h(sf['QLJBZBXYDJD']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">桥梁局部坐标系原点高程:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="QLJBZBXYDGC" placeholder="请输入桥梁局部坐标系原点高程" value="' + h(sf['QLJBZBXYDGC']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器坐标X:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQZBX" placeholder="请输入传感器坐标X" value="' + h(sf['CGQZBX']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器坐标Y:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQZBY" placeholder="请输入传感器坐标Y" value="' + h(sf['CGQZBY']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器坐标Z:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQZBZ" placeholder="请输入传感器坐标Z" value="' + h(sf['CGQZBZ']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器精度:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQJD" placeholder="请输入传感器精度" value="' + h(sf['CGQJD']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">初始波长:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CSBC" placeholder="请输入初始波长" value="' + h(sf['CSBC']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">初始测量时间:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CSSJ" placeholder="请输入初始测量时间" value="' + h(sf['CSSJ']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器所属模块类型:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQSSMKLX" placeholder="请输入传感器所属模块类型" value="' + h(sf['CGQSSMKLX']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器所属模块编号:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQSSMKBH" placeholder="请输入传感器所属模块编号" value="' + h(sf['CGQSSMKBH']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器所属模块通道号:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQSSMKTDH" placeholder="请输入传感器所属模块通道号" value="' + h(sf['CGQSSMKTDH']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">波长系数:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="BCXS" placeholder="请输入波长系数" value="' + h(sf['BCXS']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                    </div>\
                    ';
                break;
            case 3:
                content = '\
                    <div id="sensor_type_block">\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器测点编号:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQCDBH" placeholder="请输入传感器测点编号" value="' + h(sf['CGQCDBH']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">桥梁局部坐标系原点纬度:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="QLJBZBXYDWD" placeholder="请输入桥梁局部坐标系原点纬度" value="' + h(sf['QLJBZBXYDWD']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">桥梁局部坐标系原点经度:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="QLJBZBXYDJD" placeholder="请输入桥梁局部坐标系原点经度" value="' + h(sf['QLJBZBXYDJD']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">桥梁局部坐标系原点高程:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="QLJBZBXYDGC" placeholder="请输入桥梁局部坐标系原点高程" value="' + h(sf['QLJBZBXYDGC']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器精度:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQJD" placeholder="请输入传感器精度" value="' + h(sf['CGQJD']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">初始坐标X:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CSZBX" placeholder="请输入初始坐标X" value="' + h(sf['CSZBX']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">初始坐标Y:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CSZBY" placeholder="请输入初始坐标Y" value="' + h(sf['CSZBY']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">初始坐标Z:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CSZBZ" placeholder="请输入初始坐标Z" value="' + h(sf['CSZBZ']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">初始值测量时间:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CSSJ" placeholder="请输入初始值测量时间" value="' + h(sf['CSSJ']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                    </div>\
                    ';
                break;
            case 4:
                content = '\
                    <div id="sensor_type_block">\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">桥梁局部坐标系原点纬度:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="QLJBZBXYDWD" placeholder="请输入桥梁局部坐标系原点纬度" value="' + h(sf['QLJBZBXYDWD']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">桥梁局部坐标系原点经度:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="QLJBZBXYDJD" placeholder="请输入桥梁局部坐标系原点经度" value="' + h(sf['QLJBZBXYDJD']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">桥梁局部坐标系原点高程:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="QLJBZBXYDGC" placeholder="请输入桥梁局部坐标系原点高程" value="' + h(sf['QLJBZBXYDGC']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器坐标X:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQZBX" placeholder="请输入传感器坐标X" value="' + h(sf['CGQZBX']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器坐标Y:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQZBY" placeholder="请输入传感器坐标Y" value="' + h(sf['CGQZBY']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器坐标Z:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQZBZ" placeholder="请输入传感器坐标Z" value="' + h(sf['CGQZBZ']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器精度:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQJD" placeholder="请输入传感器精度" value="' + h(sf['CGQJD']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">初始测量时间:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CSSJ" placeholder="请输入初始测量时间" value="' + h(sf['CSSJ']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器所属模块类型:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQSSMKLX" placeholder="请输入传感器所属模块类型" value="' + h(sf['CGQSSMKLX']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器所属模块编号:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQSSMKBH" placeholder="请输入传感器所属模块编号" value="' + h(sf['CGQSSMKBH']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器所属模块通道号:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQSSMKTDH" placeholder="请输入传感器所属模块通道号" value="' + h(sf['CGQSSMKTDH']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">加速度系数:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="JSDXS" placeholder="请输入加速度系数" value="' + h(sf['JSDXS']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                    </div>\
                    ';
                break;
            case 5:
                content = '\
                    <div id="sensor_type_block">\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">桥梁局部坐标系原点纬度:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="QLJBZBXYDWD" placeholder="请输入桥梁局部坐标系原点纬度" value="' + h(sf['QLJBZBXYDWD']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">桥梁局部坐标系原点经度:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="QLJBZBXYDJD" placeholder="请输入桥梁局部坐标系原点经度" value="' + h(sf['QLJBZBXYDJD']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">桥梁局部坐标系原点高程:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="QLJBZBXYDGC" placeholder="请输入桥梁局部坐标系原点高程" value="' + h(sf['QLJBZBXYDGC']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器坐标X:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQZBX" placeholder="请输入传感器坐标X" value="' + h(sf['CGQZBX']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器坐标Y:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQZBY" placeholder="请输入传感器坐标Y" value="' + h(sf['CGQZBY']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器坐标Z:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQZBZ" placeholder="请输入传感器坐标Z" value="' + h(sf['CGQZBZ']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器精度:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQJD" placeholder="请输入传感器精度" value="' + h(sf['CGQJD']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">初始测量时间:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CSSJ" placeholder="请输入初始测量时间" value="' + h(sf['CSSJ']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器所属模块类型:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQSSMKLX" placeholder="请输入传感器所属模块类型" value="' + h(sf['CGQSSMKLX']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器所属模块编号:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQSSMKBH" placeholder="请输入传感器所属模块编号" value="' + h(sf['CGQSSMKBH']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">传感器所属模块通道号:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="CGQSSMKTDH" placeholder="请输入传感器所属模块通道号" value="' + h(sf['CGQSSMKTDH']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">索力系数:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="SLXS" placeholder="请输入索力系数" value="' + h(sf['SLXS']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                        <div class="form-inline-custom">\
                            <label class="col-sm-3 control-label">加速度系数:</label>\
                            <div class="col-sm-8"> \
                                <input type="text" class="form-control" id="JSDXS" placeholder="请输入加速度系数" value="' + h(sf['JSDXS']) + '"> \
                            </div>\
                            <span class="text-danger mt5 fl">*</span>\
                        </div> \
                        <br>\
                    </div>\
                    ';
                break;
            default:
                break;
        }
        return content;
    }
}

//修改桥梁信息
function modifySensorInfo(sensor_id) {
    showSensorDialog("传感器信息", 'update', sensor_id);
}

//重新读取并刷新数据
function refreshData() {
    var $sensor_grid = $("#sensor-grid");
    $sensor_grid.data("kendoGrid").dataSource.read();
    $sensor_grid.data("kendoGrid").refresh();
}

//桥梁列表下拉框
function bridgeListDropdown() {
    var url = "/bridge/simple-list";
    var response = webRequest(url, "GET", false, {});
    var options = "<option value='0'>全部桥梁</option>";
    if (response != null && response['data']) {
        var data = response["data"];
        for (var i = 0; i < data.length; i++) {
            options += "<option value='" + data[i]['bridge_id'] + "'>" + data[i]['bridge_name'] + "</option>";
        }
    }
    var $dropdownMenu1 = $("#dropdownMenu1");
    $dropdownMenu1.append(options);
    $dropdownMenu1.selectpicker('val', $dropdownMenu1.attr('init-value'));
    $dropdownMenu1.on("changed.bs.select", function () {
        sectionListDropdown($(this).val()); //更新截面列表
        watchPointListDropdown($('#dropdownMenu2').val());
        watchBoxListDropdown($(this).val());
        updateSensorGrid($('#dropdownMenu1').val(), $('#dropdownMenu2').val(), $('#dropdownMenu3').val(), $('#dropdownMenu4').val()); //更新表格
    });
}

//截面列表下拉框
function sectionListDropdown(bridgeId, init_value) {
    var options = "<option value='0'>全部截面</option>";
    if (bridgeId != 0) {  //为全部桥梁时不需要获取截面列表
        var url = "/section/simple-list";
        var response = webRequest(url, "GET", false, {'bridgeId': bridgeId});
        if (response != null && response['data']) {
            var data = response["data"];
            for (var i = 0; i < data.length; i++) {
                options += "<option value='" + data[i]['section_id'] + "'>" + data[i]['section_name'] + "</option>";
            }
        }
    }
    var $dropdownMenu2 = $("#dropdownMenu2");
    $dropdownMenu2.empty();
    $dropdownMenu2.append(options);
    $dropdownMenu2.selectpicker('refresh');
    if (init_value) { //有初始值 则进行赋值
        $dropdownMenu2.selectpicker('val', init_value);
    }

    $dropdownMenu2.off('changed.bs.select').on("changed.bs.select", function () {
        watchPointListDropdown($(this).val());
        updateSensorGrid($('#dropdownMenu1').val(), $('#dropdownMenu2').val(), $('#dropdownMenu3').val(), $('#dropdownMenu4').val());//更新表格
    });

}

//监测点下拉列表
function watchPointListDropdown(sectionId, init_value) {
    var options = "<option value='0'>全部监测点</option>";
    if (sectionId != 0) {  //为全部截面时不需要获取监测点列表
        var url = "/watch-point/simple-list";
        var response = webRequest(url, "GET", false, {'sectionId': sectionId});
        if (response != null && response['data']) {
            var data = response["data"];
            for (var i = 0; i < data.length; i++) {
                options += "<option value='" + data[i]['watch_point_id'] + "'>" + data[i]['watch_point_name'] + "</option>";
            }
        }
    }
    var $dropdownMenu3 = $("#dropdownMenu3");
    $dropdownMenu3.empty();
    $dropdownMenu3.append(options);
    $dropdownMenu3.selectpicker('refresh');
    if (init_value) { //有初始值 则进行赋值
        $dropdownMenu3.selectpicker('val', init_value);
    }

    $dropdownMenu3.off('changed.bs.select').on("changed.bs.select", function () {
        updateSensorGrid($('#dropdownMenu1').val(), $('#dropdownMenu2').val(), $('#dropdownMenu3').val(), $('#dropdownMenu4').val());//更新表格
    });
}

//控制箱下拉列表
function watchBoxListDropdown(bridgeId, init_value) {
    var options = "<option value='0'>全部控制箱</option>";
    if (bridgeId != 0) {  //为全部桥梁时不需要获取控制箱列表
        var url = "/watch-box/simple-list";
        var response = webRequest(url, "GET", false, {'bridgeId': bridgeId});
        if (response != null && response['data']) {
            var data = response["data"];
            for (var i = 0; i < data.length; i++) {
                options += "<option value='" + data[i]['watch_box_id'] + "'>" + data[i]['watch_box_name'] + "</option>";
            }
        }
    }
    var $dropdownMenu4 = $("#dropdownMenu4");
    $dropdownMenu4.empty();
    $dropdownMenu4.append(options);
    $dropdownMenu4.selectpicker('refresh');
    if (init_value) { //有初始值 则进行赋值
        $dropdownMenu4.selectpicker('val', init_value);
    }

    $dropdownMenu4.off('changed.bs.select').on("changed.bs.select", function () {
        updateSensorGrid($('#dropdownMenu1').val(), $('#dropdownMenu2').val(), $('#dropdownMenu3').val(), $('#dropdownMenu4').val());//更新表格
    });
}

$(function () {
    $('#add_sensor').click(function () {
        showSensorDialog('新增传感器', 'insert', null, $('#dropdownMenu1').val(), $('#dropdownMenu2').val(), $('#dropdownMenu3').val(), $('#dropdownMenu4').val());
    });

    $('#delete_sensor').click(function () {
        var checked_list = [];
        $('[name=sensor-checkbox]').each(function (index, ele) {
            if ($(ele).prop("checked")) {
                checked_list.push($(ele).val())
            }
        });
        var checked_len = checked_list.length;
        if (checked_len <= 0) {
            showTransientDialog("请选择传感器！");
        } else {
            showAlertDialog("确定删除 " + checked_len + " 个传感器？", function () {
                var url = '/sensor/delete';
                var params = {
                    'checkedList': checked_list.join(',')
                };
                var response = webRequest(url, 'POST', false, params);
                if (response != null && response.status == 0) {
                    refreshData();
                    showTransientDialog("删除 " + checked_len + " 个传感器成功！");
                } else {
                    showTransientDialog(response.msg);
                }
            });
        }
    });
});

//表格初始化
$(function () {
    bridgeListDropdown();
    sectionListDropdown($('#dropdownMenu1').val(), $("#dropdownMenu2").attr('init-value'));
    watchPointListDropdown($('#dropdownMenu2').val(), $("#dropdownMenu3").attr('init-value'));
    watchBoxListDropdown($('#dropdownMenu1').val(), $("#dropdownMenu4").attr('init-value'));
    updateSensorGrid($('#dropdownMenu1').val(), $('#dropdownMenu2').val(), $('#dropdownMenu3').val(), $('#dropdownMenu4').val());
});

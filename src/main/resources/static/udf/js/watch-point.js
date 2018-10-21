//更新截面信息列表
function updateWatchPointGrid(bridge_id, section_id) {
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                type: "get",
                url: "/watch-point/list",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (options, operation) {
                if (operation == "read") {
                    var parameter = {
                        page: options.page,
                        pageSize: options.pageSize,
                        bridgeId: bridge_id | 0,
                        sectionId: section_id | 0
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

    $("#watch-point-grid").empty();    //主要为了清空已绑定的事件
    $("#watch-point-grid").kendoGrid({
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
                template: '<input type="checkbox" class="checkbox" name="watch-point-checkbox" value="#:watch_point_id#" />',
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"},
                width: '30px'
            },
            {
                field: "watch_point_name",
                title: "名称",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                field: "watch_point_number",
                title: "编号",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                field: "position",
                title: "位置",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                field: "description",
                title: "说明",
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
                template: "<a class='btn btn-warning' id='modify-#:watch_point_id#' onclick='modifyWatchPointInfo(#:watch_point_id#)'/>修改</a>",
                title: "修改",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                template: "<a class='btn btn-success' id='picture-#:watch_point_id#' onclick=''/>管理</a>",
                title: "位置图片",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                template: "<a class='btn btn-success' id='sensor-#:watch_point_id#' href='sensor?bridgeId=#:bridge_id#&sectionId=#:section_id#&watchPointId=#:watch_point_id#'/>查看</a>",
                title: "传感器",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }
        ]
    });
}

//弹窗
function showSectionDialog(title, operation_type, watch_point_id, bridge_id, section_id) {
    var url = '/watch-point/info';
    var params = {
        'watchPointId': watch_point_id,
        'bridgeId': bridge_id
    };
    var response = webRequest(url, 'GET', false, params);
    var bridge_options = "";
    var section_options = "";
    var relative_pos_options = "";
    var watch_point_name = "";
    var watch_point_number = "";
    var position = "";
    var description = "";
    var position_x = "";
    var relative_pos = "";
    var wave_length = "";
    var wave_length_t = "";
    var positive_gain = "";
    var negative_gain = "";
    var negative_t_gain = "";
    var positive_t_gain = "";
    bridge_id = bridge_id | "";
    section_id = section_id | "";
    var old_bridge_id = "";
    var old_section_id = "";
    var old_watch_point_number = "";
    var old_watch_point_name = "";

    if (response.status == 0) {
        var data = response.data;
        if (data['watch_point_info']) {
            var wpi = data['watch_point_info'][0]; //TODO:列表为空处理
            watch_point_name = wpi["watch_point_name"];
            watch_point_number = wpi["watch_point_number"];
            position = wpi["position"];
            description = wpi["description"];
            position_x = wpi["position_x"];
            relative_pos = wpi["relative_pos"];
            wave_length = wpi["wave_length"];
            wave_length_t = wpi["wave_length_t"];
            positive_gain = wpi["positive_gain"];
            negative_gain = wpi["negative_gain"];
            negative_t_gain = wpi["negative_t_gain"];
            positive_t_gain = wpi["positive_t_gain"];
            bridge_id = wpi["bridge_id"];
            section_id = wpi["section_id"];
            old_bridge_id = wpi["bridge_id"];
            old_section_id = wpi["section_id"];
            old_watch_point_number = wpi["watch_point_number"];
            old_watch_point_name = wpi["watch_point_name"];
        }

        for (var i = 0; i < data['bridge_list'].length; i++) {
            var b = data['bridge_list'][i];
            if (b['bridge_id'] == bridge_id) {
                bridge_options += '<option value="' + b['bridge_id'] + '" selected="selected">' + b['bridge_name'] + '</option>';
            } else {
                bridge_options += '<option value="' + b['bridge_id'] + '">' + b['bridge_name'] + '</option>';
            }
        }

        for (i = 0; i < data['section_list'].length; i++) {
            var s = data['section_list'][i];
            if (s['section_id'] == section_id) {
                section_options += '<option value="' + s['section_id'] + '" selected="selected">' + s['section_name'] + '</option>';
            } else {
                section_options += '<option value="' + s['section_id'] + '">' + s['section_name'] + '</option>';
            }
        }

        var relative_pos_list = ['左上', '中上', '右上', '左下', '中下', '右下'];
        relative_pos_options += '<option value="">无</option>';
        for (i = 0; i < relative_pos_list.length; i++) {
            var rpl = relative_pos_list[i];
            if (rpl == relative_pos) {
                relative_pos_options += '<option value="' + rpl + '" selected="selected">' + rpl + '</option>';
            } else {
                relative_pos_options += '<option value="' + rpl + '">' + rpl + '</option>';
            }
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
            <label class="col-sm-3 control-label">监测点名称:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="watch_point_name" placeholder="请输入监测点名称" value="' + watch_point_name + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">监测点编号:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="watch_point_number" placeholder="请输入监测点编号" value="' + watch_point_number + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">位置:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="position" placeholder="请输入位置" value="' + position + '"> \
            </div>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">说明:</label>\
            <div class="col-sm-8"> \
                <textarea class="form-control" rows="3" id="description">' + description + '</textarea>\
            </div>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">坐标:</label>\
            <div class="col-sm-8"> \
                <input type="number" class="form-control" id="position_x" placeholder="请输入坐标" value="' + position_x + '"> \
            </div>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">相对位置:</label>\
            <div class="col-sm-8"> \
                <select class="form-control" id="relative_pos_sel">' + relative_pos_options + '</select>  \
            </div>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">理论荷载应变:</label>\
            <div class="col-sm-8"> \
                <input type="number" class="form-control" id="wave_length" placeholder="请输入理论荷载应变" value="' + wave_length + '"> \
            </div>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">荷载正增益:</label>\
            <div class="col-sm-8"> \
                <input type="number" class="form-control" id="positive_gain" placeholder="请输入荷载正增益" value="' + positive_gain + '"> \
            </div>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">荷载负增益:</label>\
            <div class="col-sm-8"> \
                <input type="number" class="form-control" id="negative_gain" placeholder="请输入荷载负增益" value="' + negative_gain + '"> \
            </div>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">理论温补应变:</label>\
            <div class="col-sm-8"> \
                <input type="number" class="form-control" id="wave_length_t" placeholder="请输入理论温补应变" value="' + wave_length_t + '"> \
            </div>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">温度正增益:</label>\
            <div class="col-sm-8"> \
                <input type="number" class="form-control" id="positive_t_gain" placeholder="请输入温度正增益" value="' + positive_t_gain + '"> \
            </div>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">温度负增益:</label>\
            <div class="col-sm-8"> \
                <input type="number" class="form-control" id="negative_t_gain" placeholder="请输入温度负增益" value="' + negative_t_gain + '"> \
            </div>\
        </div> \
        <br>\
        ';

    showModalDialog(title, content, function () {
        //必须参数
        var bridge_id = $('#bridge_sel').val();
        var section_id = $('#section_sel').val();
        var watch_point_name = $('#watch_point_name').val();
        var watch_point_number = $('#watch_point_number').val();
        //非必须参数
        var position = $('#position').val();
        var description = $('#description').val();
        var position_x = $('#position_x').val();
        var relative_pos = $('#relative_pos_sel').val();
        var wave_length = $('#wave_length').val();
        var wave_length_t = $('#wave_length_t').val();
        var positive_gain = $('#positive_gain').val();
        var negative_gain = $('#negative_gain').val();
        var negative_t_gain = $('#negative_t_gain').val();
        var positive_t_gain = $('#positive_t_gain').val();

        if (!watch_point_name || !watch_point_number || !bridge_id || !section_id) {
            showTransientDialog("必填项不能为空！");
            return false;
        } else {
            var url = '/watch-point/create-or-update';
            var params = {
                'watchPointId': watch_point_id,
                'operationType': operation_type,
                'watchPointName': watch_point_name,
                'watchPointNumber': watch_point_number,
                'bridgeId': bridge_id,
                'sectionId': section_id,
                'position': position,
                'description': description,
                'positionX': position_x,
                'relativePos': relative_pos,
                'waveLength': wave_length,
                'waveLengthT': wave_length_t,
                'positiveGain': positive_gain,
                'negativeGain': negative_gain,
                'negativeTGain': negative_t_gain,
                'positiveTGain': positive_t_gain,
                'old_watchPointName': old_watch_point_name,
                'old_bridge_id': old_bridge_id,
                'old_section_id': old_section_id,
                'old_watchPointNumber': old_watch_point_number
            };
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

    //选择桥梁后 截面联动
    $('#bridge_sel').on('change', function () {
        var url = "/section/simple-list";
        var response = webRequest(url, 'GET', false, {'bridgeId': $(this).val()});
        var section_options = "";
        var section_list = response['data'];//格式：[{'section_id':1,'section_name':''},{...}]
        if (section_list) {
            for (var i = 0; i < section_list.length; i++) {
                section_options += '<option value="' + section_list[i]['section_id'] + '">' + section_list[i]['section_name'] + '</option>'
            }
        }
        $('#section_sel').empty();
        $('#section_sel').append(section_options);
    });
}

//重新读取并刷新数据
function refreshData() {
    var $watch_point_grid = $("#watch-point-grid");
    $watch_point_grid.data("kendoGrid").dataSource.read();
    $watch_point_grid.data("kendoGrid").refresh();
}

//修改桥梁信息
function modifyWatchPointInfo(watch_point_id) {
    showSectionDialog("修改监测点信息", 'update', watch_point_id);
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
        updateWatchPointGrid($('#dropdownMenu1').val(), $('#dropdownMenu2').val()); //更新表格
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
        updateWatchPointGrid($('#dropdownMenu1').val(), $('#dropdownMenu2').val());//更新表格
    });

}

$(function () {
    $('#add_watch-point').click(function () {
        showSectionDialog("新增监测点", 'insert', null, $('#dropdownMenu1').val(), $('#dropdownMenu2').val());
    });

    $('#delete_watch-point').click(function () {
        var checked_list = [];
        $('[name=watch-point-checkbox]').each(function (index, ele) {
            if ($(ele).prop("checked")) {
                checked_list.push($(ele).val())
            }
        });
        var checked_len = checked_list.length;
        if (checked_len <= 0) {
            showTransientDialog("请选择监测点！");
        } else {
            showAlertDialog("确定删除 " + checked_len + " 个监测点？", function () {
                var url = '/watch-point/delete';
                var params = {
                    'checkedList': checked_list.join(',')
                };
                var response = webRequest(url, 'POST', false, params);
                if (response != null && response.status == 0) {
                    refreshData();
                    showTransientDialog("删除 " + checked_len + " 个监测点成功！");
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
    updateWatchPointGrid($('#dropdownMenu1').val(), $('#dropdownMenu2').val());
});
////更新截面信息列表
//function updateWatchPointGrid(bridge_id, section_id) {
//    var dataSource = new kendo.data.DataSource({
//        transport: {
//            read: {
//                type: "get",
//                url: "/watch-point/list",
//                dataType: "json",
//                contentType: "application/json; charset=utf-8"
//            },
//            parameterMap: function (options, operation) {
//                if (operation == "read") {
//                    var parameter = {
//                        page: options.page,
//                        pageSize: options.pageSize,
//                        bridgeId: bridge_id | 0,
//                        sectionId: section_id | 0
//                    };
//                    return parameter;
//                }
//            }
//        },
//        batch: true,
//        pageSize: 10,
//        schema: {
//            data: function (d) {
//                return d.data;
//            },
//            total: function (d) {
//                return d.total;
//            }
//        },
//        serverPaging: true
//    });
//
//    $("#watch-point-grid").empty();    //主要为了清空已绑定的事件
//    $("#watch-point-grid").kendoGrid({
//        dataSource: dataSource,
//        pageable: {
//            pageSizes: [10, 25, 50, 100],
//            buttonCount: 5,
//            messages: {
//                display: "{0} - {1} 共 {2} 条数据",
//                empty: "没有数据",
//                page: "页",
//                of: "/ {0}",
//                itemsPerPage: "条每页",
//                first: "第一页",
//                previous: "前一页",
//                next: "下一页",
//                last: "最后一页",
//                refresh: "刷新"
//            }
//        },
//        columns: [
//            {
//                template: '<input type="checkbox" class="checkbox" name="watch-point-checkbox" value="#:watch_point_id#" />',
//                headerAttributes: {style: "text-align:center"},
//                attributes: {class: "text-center"},
//                width: '30px'
//            },
//            {
//                field: "watch_point_name",
//                title: "名称",
//                headerAttributes: {style: "text-align:center"},
//                attributes: {class: "text-center"}
//            }, {
//                field: "watch_point_number",
//                title: "编号",
//                headerAttributes: {style: "text-align:center"},
//                attributes: {class: "text-center"}
//            }, {
//                field: "position",
//                title: "位置",
//                headerAttributes: {style: "text-align:center"},
//                attributes: {class: "text-center"}
//            }, {
//                field: "description",
//                title: "说明",
//                headerAttributes: {style: "text-align:center"},
//                attributes: {class: "text-center"}
//            }, {
//                field: "section_name",
//                title: "所属截面",
//                headerAttributes: {style: "text-align:center"},
//                attributes: {class: "text-center"}
//            }, {
//                field: "bridge_name",
//                title: "所属桥梁",
//                headerAttributes: {style: "text-align:center"},
//                attributes: {class: "text-center"}
//            }, {
//                template: "<a class='btn btn-warning' id='modify-#:watch_point_id#' onclick='modifyWatchPointInfo(#:watch_point_id#)'/>修改</a>",
//                title: "修改",
//                headerAttributes: {style: "text-align:center"},
//                attributes: {class: "text-center"}
//            }, {
//                template: "<a class='btn btn-success' id='picture-#:watch_point_id#' onclick=''/>管理</a>",
//                title: "位置图片",
//                headerAttributes: {style: "text-align:center"},
//                attributes: {class: "text-center"}
//            }, {
//                template: "<a class='btn btn-success' id='sensor-#:watch_point_id#' href='sensor?bridgeId=#:bridge_id#&sectionId=#:section_id#&watchPointId=#:watch_point_id#'/>查看</a>",
//                title: "传感器",
//                headerAttributes: {style: "text-align:center"},
//                attributes: {class: "text-center"}
//            }
//        ]
//    });
//}
//
////弹窗
//function showSectionDialog(title, operation_type, watch_point_id, bridge_id, section_id) {
//    var url = '/watch-point/info';
//    var params = {
//        'watchPointId': watch_point_id,
//        'bridgeId': bridge_id
//    };
//    var response = webRequest(url, 'GET', false, params);
//    var bridge_options = "";
//    var section_options = "";
//    var relative_pos_options = "";
//    var watch_point_name = "";
//    var watch_point_number = "";
//    var position = "";
//    var description = "";
//    var position_x = "";
//    var relative_pos = "";
//    var wave_length = "";
//    var wave_length_t = "";
//    var positive_gain = "";
//    var negative_gain = "";
//    var negative_t_gain = "";
//    var positive_t_gain = "";
//    bridge_id = bridge_id | "";
//    section_id = section_id | "";
//
//    if (response.status == 0) {
//        var data = response.data;
//        if (data['watch_point_info']) {
//            var wpi = data['watch_point_info'][0]; //TODO:列表为空处理
//            watch_point_name = wpi["watch_point_name"];
//            watch_point_number = wpi["watch_point_number"];
//            position = wpi["position"];
//            description = wpi["description"];
//            position_x = wpi["position_x"];
//            relative_pos = wpi["relative_pos"];
//            wave_length = wpi["wave_length"];
//            wave_length_t = wpi["wave_length_t"];
//            positive_gain = wpi["positive_gain"];
//            negative_gain = wpi["negative_gain"];
//            negative_t_gain = wpi["negative_t_gain"];
//            positive_t_gain = wpi["positive_t_gain"];
//            bridge_id = wpi["bridge_id"];
//            section_id = wpi["section_id"];
//        }
//
//        for (var i = 0; i < data['bridge_list'].length; i++) {
//            var b = data['bridge_list'][i];
//            if (b['bridge_id'] == bridge_id) {
//                bridge_options += '<option value="' + b['bridge_id'] + '" selected="selected">' + b['bridge_name'] + '</option>';
//            } else {
//                bridge_options += '<option value="' + b['bridge_id'] + '">' + b['bridge_name'] + '</option>';
//            }
//        }
//
//        for (i = 0; i < data['section_list'].length; i++) {
//            var s = data['section_list'][i];
//            if (s['section_id'] == section_id) {
//                section_options += '<option value="' + s['section_id'] + '" selected="selected">' + s['section_name'] + '</option>';
//            } else {
//                section_options += '<option value="' + s['section_id'] + '">' + s['section_name'] + '</option>';
//            }
//        }
//
//        var relative_pos_list = ['左上', '中上', '右上', '左下', '中下', '右下'];
//        relative_pos_options += '<option value="">无</option>';
//        for (i = 0; i < relative_pos_list.length; i++) {
//            var rpl = relative_pos_list[i];
//            if (rpl == relative_pos) {
//                relative_pos_options += '<option value="' + rpl + '" selected="selected">' + rpl + '</option>';
//            } else {
//                relative_pos_options += '<option value="' + rpl + '">' + rpl + '</option>';
//            }
//        }
//    }
//
//    var content = '\
//        <div class="form-inline-custom">\
//            <label class="col-sm-3 control-label">所属桥梁:</label>  \
//            <div class="col-sm-8">  \
//                <select class="form-control" id="bridge_sel">' + bridge_options + '</select>  \
//            </div> \
//            <span class="text-danger mt5 fl">*</span>\
//        </div>\
//        <br>\
//        <div class="form-inline-custom">\
//            <label class="col-sm-3 control-label">所属截面:</label>  \
//            <div class="col-sm-8">  \
//                <select class="form-control" id="section_sel">' + section_options + '</select>  \
//            </div> \
//            <span class="text-danger mt5 fl">*</span>\
//        </div>\
//        <br>\
//        <div class="form-inline-custom">\
//            <label class="col-sm-3 control-label">监测点名称:</label>\
//            <div class="col-sm-8"> \
//                <input type="text" class="form-control" id="watch_point_name" placeholder="请输入监测点名称" value="' + watch_point_name + '"> \
//            </div>\
//            <span class="text-danger mt5 fl">*</span>\
//        </div> \
//        <br>\
//        <div class="form-inline-custom">\
//            <label class="col-sm-3 control-label">监测点编号:</label>\
//            <div class="col-sm-8"> \
//                <input type="text" class="form-control" id="watch_point_number" placeholder="请输入监测点编号" value="' + watch_point_number + '"> \
//            </div>\
//            <span class="text-danger mt5 fl">*</span>\
//        </div> \
//        <br>\
//        <div class="form-inline-custom">\
//            <label class="col-sm-3 control-label">位置:</label>\
//            <div class="col-sm-8"> \
//                <input type="text" class="form-control" id="position" placeholder="请输入位置" value="' + position + '"> \
//            </div>\
//        </div> \
//        <br>\
//        <div class="form-inline-custom">\
//            <label class="col-sm-3 control-label">说明:</label>\
//            <div class="col-sm-8"> \
//                <textarea class="form-control" rows="3" id="description">' + description + '</textarea>\
//            </div>\
//        </div> \
//        <br>\
//        <div class="form-inline-custom">\
//            <label class="col-sm-3 control-label">坐标:</label>\
//            <div class="col-sm-8"> \
//                <input type="number" class="form-control" id="position_x" placeholder="请输入坐标" value="' + position_x + '"> \
//            </div>\
//        </div> \
//        <br>\
//        <div class="form-inline-custom">\
//            <label class="col-sm-3 control-label">相对位置:</label>\
//            <div class="col-sm-8"> \
//                <select class="form-control" id="relative_pos_sel">' + relative_pos_options + '</select>  \
//            </div>\
//        </div> \
//        <br>\
//        <div class="form-inline-custom">\
//            <label class="col-sm-3 control-label">理论荷载应变:</label>\
//            <div class="col-sm-8"> \
//                <input type="number" class="form-control" id="wave_length" placeholder="请输入理论荷载应变" value="' + wave_length + '"> \
//            </div>\
//        </div> \
//        <br>\
//        <div class="form-inline-custom">\
//            <label class="col-sm-3 control-label">荷载正增益:</label>\
//            <div class="col-sm-8"> \
//                <input type="number" class="form-control" id="positive_gain" placeholder="请输入荷载正增益" value="' + positive_gain + '"> \
//            </div>\
//        </div> \
//        <br>\
//        <div class="form-inline-custom">\
//            <label class="col-sm-3 control-label">荷载负增益:</label>\
//            <div class="col-sm-8"> \
//                <input type="number" class="form-control" id="negative_gain" placeholder="请输入荷载负增益" value="' + negative_gain + '"> \
//            </div>\
//        </div> \
//        <br>\
//        <div class="form-inline-custom">\
//            <label class="col-sm-3 control-label">理论温补应变:</label>\
//            <div class="col-sm-8"> \
//                <input type="number" class="form-control" id="wave_length_t" placeholder="请输入理论温补应变" value="' + wave_length_t + '"> \
//            </div>\
//        </div> \
//        <br>\
//        <div class="form-inline-custom">\
//            <label class="col-sm-3 control-label">温度正增益:</label>\
//            <div class="col-sm-8"> \
//                <input type="number" class="form-control" id="positive_t_gain" placeholder="请输入温度正增益" value="' + positive_t_gain + '"> \
//            </div>\
//        </div> \
//        <br>\
//        <div class="form-inline-custom">\
//            <label class="col-sm-3 control-label">温度负增益:</label>\
//            <div class="col-sm-8"> \
//                <input type="number" class="form-control" id="negative_t_gain" placeholder="请输入温度负增益" value="' + negative_t_gain + '"> \
//            </div>\
//        </div> \
//        <br>\
//        ';
//
//    showModalDialog(title, content, function () {
//        //必须参数
//        var bridge_id = $('#bridge_sel').val();
//        var section_id = $('#section_sel').val();
//        var watch_point_name = $('#watch_point_name').val();
//        var watch_point_number = $('#watch_point_number').val();
//        //非必须参数
//        var position = $('#position').val();
//        var description = $('#description').val();
//        var position_x = $('#position_x').val();
//        var relative_pos = $('#relative_pos_sel').val();
//        var wave_length = $('#wave_length').val();
//        var wave_length_t = $('#wave_length_t').val();
//        var positive_gain = $('#positive_gain').val();
//        var negative_gain = $('#negative_gain').val();
//        var negative_t_gain = $('#negative_t_gain').val();
//        var positive_t_gain = $('#positive_t_gain').val();
//
//        if (!watch_point_name || !watch_point_number || !bridge_id || !section_id) {
//            showTransientDialog("必填项不能为空！");
//            return false;
//        } else {
//            var url = '/watch-point/create-or-update';
//            var params = {
//                'watchPointId': watch_point_id,
//                'operationType': operation_type,
//                'watchPointName': watch_point_name,
//                'watchPointNumber': watch_point_number,
//                'bridgeId': bridge_id,
//                'sectionId': section_id,
//                'position': position,
//                'description': description,
//                'positionX': position_x,
//                'relativePos': relative_pos,
//                'waveLength': wave_length,
//                'waveLengthT': wave_length_t,
//                'positiveGain': positive_gain,
//                'negativeGain': negative_gain,
//                'negativeTGain': negative_t_gain,
//                'positiveTGain': positive_t_gain
//            };
//            var response = webRequest(url, 'POST', false, params);
//            if (response != null && response.status == 0) {
//                refreshData();
//                showTransientDialog("操作成功！");
//                return true;
//            } else {
//                showTransientDialog(response.msg);
//                return false;
//            }
//        }
//    }, 605, 330);
//
//    //选择桥梁后 截面联动
//    $('#bridge_sel').on('change', function () {
//        var url = "/section/simple-list";
//        var response = webRequest(url, 'GET', false, {'bridgeId': $(this).val()});
//        var section_options = "";
//        var section_list = response['data'];//格式：[{'section_id':1,'section_name':''},{...}]
//        if (section_list) {
//            for (var i = 0; i < section_list.length; i++) {
//                section_options += '<option value="' + section_list[i]['section_id'] + '">' + section_list[i]['section_name'] + '</option>'
//            }
//        }
//        $('#section_sel').empty();
//        $('#section_sel').append(section_options);
//    });
//}
//
////重新读取并刷新数据
//function refreshData() {
//    var $watch_point_grid = $("#watch-point-grid");
//    $watch_point_grid.data("kendoGrid").dataSource.read();
//    $watch_point_grid.data("kendoGrid").refresh();
//}
//
////修改桥梁信息
//function modifyWatchPointInfo(watch_point_id) {
//    showSectionDialog("修改监测点信息", 'update', watch_point_id);
//}
//
////桥梁列表下拉框
//function bridgeListDropdown() {
//    var url = "/bridge/simple-list";
//    var response = webRequest(url, "GET", false, {});
//    var options = "<option value='0'>全部桥梁</option>";
//    if (response != null && response['data']) {
//        var data = response["data"];
//        for (var i = 0; i < data.length; i++) {
//            options += "<option value='" + data[i]['bridge_id'] + "'>" + data[i]['bridge_name'] + "</option>";
//        }
//    }
//    var $dropdownMenu1 = $("#dropdownMenu1");
//    $dropdownMenu1.append(options);
//    $dropdownMenu1.selectpicker('val', $dropdownMenu1.attr('init-value'));
//    $dropdownMenu1.on("changed.bs.select", function () {
//        sectionListDropdown($(this).val()); //更新截面列表
//        updateWatchPointGrid($('#dropdownMenu1').val(), $('#dropdownMenu2').val()); //更新表格
//    });
//}
//
////截面列表下拉框
//function sectionListDropdown(bridgeId, init_value) {
//    var options = "<option value='0'>全部截面</option>";
//    if (bridgeId != 0) {  //为全部桥梁时不需要获取截面列表
//        var url = "/section/simple-list";
//        var response = webRequest(url, "GET", false, {'bridgeId': bridgeId});
//        if (response != null && response['data']) {
//            var data = response["data"];
//            for (var i = 0; i < data.length; i++) {
//                options += "<option value='" + data[i]['section_id'] + "'>" + data[i]['section_name'] + "</option>";
//            }
//        }
//    }
//    var $dropdownMenu2 = $("#dropdownMenu2");
//    $dropdownMenu2.empty();
//    $dropdownMenu2.append(options);
//    $dropdownMenu2.selectpicker('refresh');
//    if (init_value) { //有初始值 则进行赋值
//        $dropdownMenu2.selectpicker('val', init_value);
//    }
//
//    $dropdownMenu2.off('changed.bs.select').on("changed.bs.select", function () {
//        updateWatchPointGrid($('#dropdownMenu1').val(), $('#dropdownMenu2').val());//更新表格
//    });
//
//}
//
//$(function () {
//    $('#add_watch-point').click(function () {
//        showSectionDialog("新增监测点", 'insert', null, $('#dropdownMenu1').val(), $('#dropdownMenu2').val());
//    });
//
//    $('#delete_watch-point').click(function () {
//        var checked_list = [];
//        $('[name=watch-point-checkbox]').each(function (index, ele) {
//            if ($(ele).prop("checked")) {
//                checked_list.push($(ele).val())
//            }
//        });
//        var checked_len = checked_list.length;
//        if (checked_len <= 0) {
//            showTransientDialog("请选择监测点！");
//        } else {
//            showAlertDialog("确定删除 " + checked_len + " 个监测点？", function () {
//                var url = '/watch-point/delete';
//                var params = {
//                    'checkedList': checked_list.join(',')
//                };
//                var response = webRequest(url, 'POST', false, params);
//                if (response != null && response.status == 0) {
//                    refreshData();
//                    showTransientDialog("删除 " + checked_len + " 个监测点成功！");
//                } else {
//                    showTransientDialog(response.msg);
//                }
//            });
//        }
//    });
//});
//
////表格初始化
//$(function () {
//    bridgeListDropdown();
//    sectionListDropdown($('#dropdownMenu1').val(), $("#dropdownMenu2").attr('init-value'));
//    updateWatchPointGrid($('#dropdownMenu1').val(), $('#dropdownMenu2').val());
//});
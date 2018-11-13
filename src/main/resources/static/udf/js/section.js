//更新截面信息列表
function updateSectionInfoGrid(bridge_id) {
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                type: "get",
                url: "/section/list",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (options, operation) {
                if (operation == "read") {
                    var parameter = {
                        page: options.page,
                        pageSize: options.pageSize,
                        bridgeId: bridge_id | 0
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

    $("#section-grid").empty();    //主要为了清空已绑定的事件
    $("#section-grid").kendoGrid({
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
                template: '<input type="checkbox" class="checkbox" name="section-checkbox" value="#:section_id#" />',
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"},
                width: '30px'
            },
            {
                field: "section_name",
                title: "名称",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                field: "section_number",
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
                field: "bridge_name",
                title: "所属桥梁",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                template: "<a class='btn btn-warning' id='modify-#:section_id#' onclick='modifySectionInfo(#:section_id#)'/>修改</a>",
                title: "修改",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                template: "<a class='btn btn-success' id='picture-#:section_id#' href='/section/image/#:section_id#'/>管理</a>",
                title: "截面图片",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                template: "<a class='btn btn-success' id='point-#:section_id#' href='watch-point?bridgeId=#:bridge_id#&sectionId=#:section_id#'/>查看</a>",
                title: "测点",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                template: "<a class='btn btn-success' id='sensor-#:section_id#' href='sensor?bridgeId=#:bridge_id#&sectionId=#:section_id#'/>查看</a>",
                title: "传感器",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }
        ]
    });
}

//弹窗
function showSectionDialog(title, operation_type, section_id) {
    //alert("I am an alert box!!");
    var url = '/section/info';
    var params = {
        'sectionId': section_id
    };
    var response = webRequest(url, 'GET', false, params);
    var bridge_options = "";
    var old_section_name = "";
    var old_section_number = "";
    var old_position = "";
    var old_description = "";
    var old_bridge_id = $('#dropdownMenu1').val(); //新增截面时 所属桥梁为当前下拉框中的桥梁

    if (response.status == 0) {
        var data = response.data;
        if (data['section_info']) {
            var si = data['section_info'][0];
            old_section_name = si['section_name'];
            old_section_number = si['section_number'];
            old_position = si['position'];
            old_description = si['description'];
            old_bridge_id = si['bridge_id'];
        }

        for (var i = 0; i < data['bridge_list'].length; i++) {
            var b = data['bridge_list'][i];
            if (b['bridge_id'] == old_bridge_id) {
                bridge_options += '<option value="' + b['bridge_id'] + '" selected="selected">' + b['bridge_name'] + '</option>';
            } else {
                bridge_options += '<option value="' + b['bridge_id'] + '">' + b['bridge_name'] + '</option>';
            }
        }
    }

    var content = '\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">所属桥梁:</label>  \
            <div class="col-sm-8">  \
                <select class="form-control" id="bridge_sel"">' + bridge_options + '</select>  \
            </div> \
            <span class="text-danger mt5 fl">*</span>\
        </div>\
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">截面名称:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="section_name" placeholder="请输入截面名称" value="' + old_section_name + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">截面编号:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="section_number" placeholder="请输入截面编号" value="' + old_section_number + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">位置:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="position" placeholder="请输入位置" value="' + old_position + '"> \
            </div>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">说明:</label>\
            <div class="col-sm-8"> \
                <textarea class="form-control" rows="3" id="description">' + old_description + '</textarea>\
            </div>\
        </div> \
        <br>\
        ';

    showModalDialog(title, content, ok_callback, 605, 330);

    //回调函数
    function ok_callback() {
        //必须参数
        var section_name = $('#section_name').val();
        var section_number = $('#section_number').val();
        var bridge_id = $('#bridge_sel').val();
        //非必须参数
        var position = $('#position').val();
        var description = $('#description').val();
        if (!section_name || !section_number || !bridge_id) {
            showTransientDialog("必填项不能为空！");
            return false;
        } else {
            var url = '/section/create-or-update';
            var params = {
                'sectionId': section_id,
                'operationType': operation_type,
                'sectionName': section_name,
                'sectionNumber': section_number,
                'bridgeId': bridge_id,
                'position': position,
                'description': description,
                'old_sectionName': old_section_name,
                'old_sectionNumber' :old_section_number,
                'old_position' : old_position,
                'old_description' : old_description,
                'old_bridgeId' : old_bridge_id
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
    }
}

//修改截面信息
function modifySectionInfo(section_id) {
    showSectionDialog("修改截面信息", 'update', section_id);
}

//重新读取并刷新数据
function refreshData() {
    var $section_grid = $("#section-grid");
    $section_grid.data("kendoGrid").dataSource.read();
    $section_grid.data("kendoGrid").refresh();
}

//其他初始化
$(function () {
    //生成桥梁下拉列表
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
    $dropdownMenu1.val($dropdownMenu1.attr('init-value'));
    $dropdownMenu1.on("change", function () {
        updateSectionInfoGrid($(this).val());
    });

    //新增截面
    $('#add_section').click(function () {
        showSectionDialog('新增截面', 'insert');
    });

    //删除截面
    $('#delete_section').click(function () {
        var checked_list = [];
        $('[name=section-checkbox]').each(function (index, ele) {
            if ($(ele).prop("checked")) {
                checked_list.push($(ele).val())
            }
        });
        var checked_len = checked_list.length;
        if (checked_len <= 0) {
            showTransientDialog("请选择截面！");
        } else {
            showAlertDialog("确定删除 " + checked_len + " 个截面？", function () {
                var url = '/section/delete';
                var params = {
                    'checkedList': checked_list.join(',')
                };
                var response = webRequest(url, 'POST', false, params);
                if (response != null && response.status == 0) {
                    refreshData();
                    showTransientDialog("删除 " + checked_len + " 个截面成功！");
                } else {
                    showTransientDialog(response.msg);
                }
            });
        }
    });

});

//初始化表格
$(function () {
    updateSectionInfoGrid($("#dropdownMenu1").val())
});
////更新截面信息列表
//function updateSectionInfoGrid(bridge_id) {
//    var dataSource = new kendo.data.DataSource({
//        transport: {
//            read: {
//                type: "get",
//                url: "/section/list",
//                dataType: "json",
//                contentType: "application/json; charset=utf-8"
//            },
//            parameterMap: function (options, operation) {
//                if (operation == "read") {
//                    var parameter = {
//                        page: options.page,
//                        pageSize: options.pageSize,
//                        bridgeId: bridge_id | 0
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
//    $("#section-grid").empty();    //主要为了清空已绑定的事件
//    $("#section-grid").kendoGrid({
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
//                template: '<input type="checkbox" class="checkbox" name="section-checkbox" value="#:section_id#" />',
//                headerAttributes: {style: "text-align:center"},
//                attributes: {class: "text-center"},
//                width: '30px'
//            },
//            {
//                field: "section_name",
//                title: "名称",
//                headerAttributes: {style: "text-align:center"},
//                attributes: {class: "text-center"}
//            }, {
//                field: "section_number",
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
//                field: "bridge_name",
//                title: "所属桥梁",
//                headerAttributes: {style: "text-align:center"},
//                attributes: {class: "text-center"}
//            }, {
//                template: "<a class='btn btn-warning' id='modify-#:section_id#' onclick='modifySectionInfo(#:section_id#)'/>修改</a>",
//                title: "修改",
//                headerAttributes: {style: "text-align:center"},
//                attributes: {class: "text-center"}
//            }, {
//                template: "<a class='btn btn-success' id='picture-#:section_id#' onclick=''/>管理</a>",
//                title: "截面图片",
//                headerAttributes: {style: "text-align:center"},
//                attributes: {class: "text-center"}
//            }, {
//                template: "<a class='btn btn-success' id='point-#:section_id#' href='watch-point?bridgeId=#:bridge_id#&sectionId=#:section_id#'/>查看</a>",
//                title: "测点",
//                headerAttributes: {style: "text-align:center"},
//                attributes: {class: "text-center"}
//            }, {
//                template: "<a class='btn btn-success' id='sensor-#:section_id#' href='sensor?bridgeId=#:bridge_id#&sectionId=#:section_id#'/>查看</a>",
//                title: "传感器",
//                headerAttributes: {style: "text-align:center"},
//                attributes: {class: "text-center"}
//            }
//        ]
//    });
//}
//
////弹窗
//function showSectionDialog(title, operation_type, section_id) {
//    var url = '/section/info';
//    var params = {
//        'sectionId': section_id
//    };
//    var response = webRequest(url, 'GET', false, params);
//    var bridge_options = "";
//    var section_name = "";
//    var section_number = "";
//    var position = "";
//    var description = "";
//    var bridge_id = $('#dropdownMenu1').val(); //新增截面时 所属桥梁为当前下拉框中的桥梁
//
//    if (response.status == 0) {
//        var data = response.data;
//        if (data['section_info']) {
//            var si = data['section_info'][0];
//            section_name = si['section_name'];
//            section_number = si['section_number'];
//            position = si['position'];
//            description = si['description'];
//            bridge_id = si['bridge_id'];
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
//    }
//
//    var content = '\
//        <div class="form-inline-custom">\
//            <label class="col-sm-3 control-label">所属桥梁:</label>  \
//            <div class="col-sm-8">  \
//                <select class="form-control" id="bridge_sel"">' + bridge_options + '</select>  \
//            </div> \
//            <span class="text-danger mt5 fl">*</span>\
//        </div>\
//        <br>\
//        <div class="form-inline-custom">\
//            <label class="col-sm-3 control-label">截面名称:</label>\
//            <div class="col-sm-8"> \
//                <input type="text" class="form-control" id="section_name" placeholder="请输入截面名称" value="' + section_name + '"> \
//            </div>\
//            <span class="text-danger mt5 fl">*</span>\
//        </div> \
//        <br>\
//        <div class="form-inline-custom">\
//            <label class="col-sm-3 control-label">截面编号:</label>\
//            <div class="col-sm-8"> \
//                <input type="text" class="form-control" id="section_number" placeholder="请输入截面编号" value="' + section_number + '"> \
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
//        ';
//
//    showModalDialog(title, content, ok_callback, 605, 330);
//
//    //回调函数
//    function ok_callback() {
//        //必须参数
//        var section_name = $('#section_name').val();
//        var section_number = $('#section_number').val();
//        var bridge_id = $('#bridge_sel').val();
//        //非必须参数
//        var position = $('#position').val();
//        var description = $('#description').val();
//        if (!section_name || !section_number || !bridge_id) {
//            showTransientDialog("必填项不能为空！");
//            return false;
//        } else {
//            var url = '/section/create-or-update';
//            var params = {
//                'sectionId': section_id,
//                'operationType': operation_type,
//                'sectionName': section_name,
//                'sectionNumber': section_number,
//                'bridgeId': bridge_id,
//                'position': position,
//                'description': description
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
//    }
//}
//
////修改桥梁信息
//function modifySectionInfo(section_id) {
//    showSectionDialog("修改截面信息", 'update', section_id);
//}
//
////重新读取并刷新数据
//function refreshData() {
//    var $section_grid = $("#section-grid");
//    $section_grid.data("kendoGrid").dataSource.read();
//    $section_grid.data("kendoGrid").refresh();
//}
//
////其他初始化
//$(function () {
//    //生成桥梁下拉列表
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
//    $dropdownMenu1.val($dropdownMenu1.attr('init-value'));
//    $dropdownMenu1.on("change", function () {
//        updateSectionInfoGrid($(this).val());
//    });
//
//    //新增截面
//    $('#add_section').click(function () {
//        showSectionDialog('新增截面', 'insert');
//    });
//
//    //删除截面
//    $('#delete_section').click(function () {
//        var checked_list = [];
//        $('[name=section-checkbox]').each(function (index, ele) {
//            if ($(ele).prop("checked")) {
//                checked_list.push($(ele).val())
//            }
//        });
//        var checked_len = checked_list.length;
//        if (checked_len <= 0) {
//            showTransientDialog("请选择截面！");
//        } else {
//            showAlertDialog("确定删除 " + checked_len + " 个截面？", function () {
//                var url = '/section/delete';
//                var params = {
//                    'checkedList': checked_list.join(',')
//                };
//                var response = webRequest(url, 'POST', false, params);
//                if (response != null && response.status == 0) {
//                    refreshData();
//                    showTransientDialog("删除 " + checked_len + " 个截面成功！");
//                } else {
//                    showTransientDialog(response.msg);
//                }
//            });
//        }
//    });
//
//});
//
////初始化表格
//$(function () {
//    updateSectionInfoGrid($("#dropdownMenu1").val())
//});
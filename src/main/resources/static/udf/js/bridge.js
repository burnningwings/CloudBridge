//更新桥梁列表
function updateBridgeInfoGrid() {
    var detailCol = getDetailCol(getUserRole()),
        detailTitle = detailCol['title'],
        detailBtnText = detailCol['buttonText'],
        detailBtnClass = detailCol['buttonClass'];

    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                type: "get",
                url: "/bridge/list",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (options, operation) {
                if (operation == "read") {
                    var parameter = {
                        page: options.page,
                        pageSize: options.pageSize
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
    dataSource.sort({field: "bridge_number", dir: "asc"})

    $("#bridge-grid").empty();
    $("#bridge-grid").kendoGrid({
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
                template: '<input type="checkbox" class="checkbox" name="bridge-checkbox" value="#:bridge_id#" />',
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"},
                width: '30px'
            },
             {
                field: "bridge_number",
                title: "编号",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            },{
                field: "bridge_name",
                title: "名称",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                field: "bridge_type_name",
                title: "类型",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            },
            // {
            //     field: "organization",
            //     title: "单位",
            //     headerAttributes: {style: "text-align:center"},
            //     attributes: {class: "text-center"}
            // }, {
            //     field: "description",
            //     title: "说明",
            //     headerAttributes: {style: "text-align:center"},
            //     attributes: {class: "text-center"}
            // },
            {
                template: "<a class='btn btn-success' id='section-#:bridge_id#' href='section?bridgeId=#:bridge_id#'/>查看</a>",
                title: "截面",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                template: "<a class='btn btn-success'  id='point-#:bridge_id#' href='watch-point?bridgeId=#:bridge_id#'/>查看</a>",
                title: "测点",
                 headerAttributes: {style: "text-align:center"},
                 attributes: {class: "text-center"}
            }, {
                template: "<a class='btn btn-success' id='watchbox-#:bridge_id#' href='watch-box?bridgeId=#:bridge_id#'/>查看</a>",
                title: "控制箱",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
               template: "<a class='btn btn-success' id='sensor-#:bridge_id#' href='sensor?bridgeId=#:bridge_id#'/>查看</a>",
               title: "传感器",
               headerAttributes: {style: "text-align:center"},
               attributes: {class: "text-center"}
            },{
                template: "<a class='btn btn-success' id='picture-#:bridge_id#' href='/bridge/image/#:bridge_id#'/>管理</a>",
                title: "图片",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                template: "<a class='" + detailBtnClass + "' id='modify-#:bridge_id#' onclick='modifyBridgeInfo(#:bridge_id#)'/>" + detailBtnText + "</a>",
                title: detailTitle,
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }
        ]
    });
}

//修改桥梁信息
function modifyBridgeInfo(bridge_id) {
    showBridgeDialog("桥梁信息", 'update', bridge_id);
}

//弹窗
function showBridgeDialog(title, operation_type, bridge_id) {
    var url = "/bridge/info";
    var params = {
        "bridgeId": bridge_id
    };
    var response = webRequest(url, "GET", false, params);
    var bridge_type_options = "";
    var old_bridge_name = "";
    var old_bridge_number = "";
    var old_bridge_type_id = "";
    var old_organization = "";
    var old_description = "";

    if (response.status == 0) {
        var data = response.data;
        if (data["bridge_info"]) {
            var bi = data["bridge_info"][0];
            old_bridge_name = bi["bridge_name"];
            old_bridge_number = bi["bridge_number"];
            old_bridge_type_id = bi["bridge_type_id"];
            old_organization = bi["organization"];
            old_description = bi["description"];
        }
        for (var i = 0; i < data["bridge_type_list"].length; i++) {
            var bt = data["bridge_type_list"][i];
            if (bt['bridge_type_id'] == old_bridge_type_id) {
                bridge_type_options += "<option value='" + bt["bridge_type_id"] + "' selected='selected'>" + bt["bridge_type_name"] + "</option>";
            } else {
                bridge_type_options += "<option value='" + bt["bridge_type_id"] + "'>" + bt["bridge_type_name"] + "</option>";
            }
        }
    }

    var organization_options = getOrganizationOptionsHTML(old_organization);

    <!--尽管报错，但是不能删去-->
    var content = '\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">桥梁名称:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="bridge_name" placeholder="请输入桥梁名称" value="' + old_bridge_name + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">桥梁编号:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="bridge_number" placeholder="请输入桥梁编号" value="' + old_bridge_number + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">桥梁类型: </label>  \
            <div class="col-sm-8">\
                <select class="form-control" id="bridge_type_sel">' + bridge_type_options + '</select>  \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div>\
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">所属单位:</label>\
            <div class="col-sm-8">\
                <select class="form-control" id="organization_id">' + organization_options + '</select>\
            </div>\
            <span class="text-danger mt5 fl">*</span>\
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

    if (!isAdminRole(getUserRole())) {
        showModalDialogWithoutOK(title, content, 605, 330);
        $('div.form-inline-custom').find('input,select,textarea').attr('disabled', 'disabled');
    } else {
        showModalDialog(title, content, ok_callback, 605, 330);
    }

    //回调函数
    function ok_callback() {
        //必须参数
        var bridge_name = $('#bridge_name').val();
        var bridge_number = $('#bridge_number').val();
        var bridge_type_id = $('#bridge_type_sel').val();
        var organization_id = $('#organization_id').val();
        //非必须参数
        var organization = $('#organization_id option:selected').text();
        var description = $('#description').val();

        if (!bridge_name || !bridge_number || !bridge_type_id || !organization_id) {
            showTransientDialog("必填项不能为空！");
            return false;
        } else {
            var url = '/bridge/create-or-update';
            var params = {
                'bridgeId': bridge_id,
                'operationType': operation_type,
                'bridgeName': bridge_name,
                'bridgeNumber': bridge_number,
                'bridgeTypeId': bridge_type_id,
                'organizationId': organization_id,
                'description': description,
                'organization': organization,
                'old_bridge_name' : old_bridge_name,
                'old_bridge_number': old_bridge_number,
                'old_bridge_type_id':old_bridge_type_id,
                'old_organization':old_organization,
                'old_description':old_description
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

//重新读取并刷新数据
function refreshData() {
    var $bridge_grid = $("#bridge-grid");
    $bridge_grid.data("kendoGrid").dataSource.read();
    $bridge_grid.data("kendoGrid").refresh();
}

//其他初始化
$(function () {
    $('#add_bridge').click(function () {
        showBridgeDialog('新增桥梁', 'insert');
    });
    $('#delete_bridge').click(function () {
        var checked_list = [];
        $('[name=bridge-checkbox]').each(function (index, ele) {
            if ($(ele).prop("checked")) {
                checked_list.push($(ele).val())
            }
        });
        var checked_len = checked_list.length;
        if (checked_len <= 0) {
            showTransientDialog("请选择桥梁！");
        } else {
            showAlertDialog("确定删除 " + checked_len + " 座桥梁？", function () {
                var url = '/bridge/delete';
                var params = {
                    'checkedList': checked_list.join(',')
                };
                var response = webRequest(url, 'POST', false, params);
                if (response != null && response.status == 0) {
                    refreshData();
                    showTransientDialog("删除 " + checked_len + " 座桥梁成功！");
                } else {
                    showTransientDialog(response.msg);
                }
            });
        }
    });
});

// 表格初始化
$(function () {
    updateBridgeInfoGrid();
});

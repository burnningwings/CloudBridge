//更新系统操作日志列表
function updateBridgeTypeGrid(){
    var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    type: "get",
                    url: "/bridge_type/list",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                },
                parameterMap: function (options, operation) {
                    if (operation == "read") {
                        var parameter = {
                            page: options.page,
                            pageSize: options.pageSize,
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

                $("#system-grid").empty();
                    $("#system-grid").kendoGrid({
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
                                template: '<input type="checkbox" class="checkbox" name="system-checkbox" value="#:bridge_type_id#" />',
                                headerAttributes: {style: "text-align:center"},
                                attributes: {class: "text-center"},
                                width: '30px'
                            },{
                                field: "bridge_type_name",
                                title: "桥梁类型名称",
                                headerAttributes: {style: "text-align:center"},
                                attributes: {class: "text-center"}
                             }, {
                             //onclick='modifyBridgeInfo(#:bridge_type_id#)'
                                template: "<a class='btn btn-warning' id='modify-#:bridge_type_id#' onclick='modifyBridgeInfo(#:bridge_type_id#)'/>修改</a>",
                                title: "修改",
                                headerAttributes: {style: "text-align:center"},
                                attributes: {class: "text-center"}
                                }
                             ]
                        });
}
//删除日志后需要重新读取并刷新数据
function refreshData() {
    var $system_grid = $("#system-grid");
    $system_grid.data("kendoGrid").dataSource.read();
    $system_grid.data("kendoGrid").refresh();
}

//修改桥梁类型信息
function modifyBridgeInfo(bridge_id) {
    showBridgeDialog("修改桥梁类型信息", 'update', bridge_id);
}

//弹窗
function showBridgeDialog(title, operation_type, type_id) {
    var url = "/bridge_type/info";
    var params = {
        "typeId": type_id
    };
    var response = webRequest(url, "GET", false, params);
    var bridge_type_id = "";
    var bridge_type_name = "";

    if (response.status == 0) {
        var data = response.data;
        if (data["bridge_type_info"]) {
            var bi = data["bridge_type_info"][0];
            bridge_type_id = bi["type_id"];
            bridge_type_name = bi["name"];
        }
    }

    <!--尽管报错，但是不能删去-->
    var content = '\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">桥梁类型名称:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="bridge_type_name" placeholder="请输入桥梁类型名称" value="' + bridge_type_name + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        ';

    showModalDialog(title, content, ok_callback, 605, 330);

    //回调函数
    function ok_callback() {
        //必须参数
        var bridge_type_name = $('#bridge_type_name').val();


        if (!bridge_type_name) {
            showTransientDialog("必填项不能为空！");
            return false;
        } else {
            var url = '/bridge_type/create-or-update';
            var params = {
                'typeId': bridge_type_id,
                'operationType': operation_type,
                'bridge_type_name': bridge_type_name,
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

function del_bridge_type(){
    console.clear();
    var url = "/bridge_type/delete";
    obj = document.getElementsByName("system-checkbox");
    var type_info = [];
    for(k in obj){
        if(obj[k].checked){
            var type = {};
            type.type_id = obj[k].value.toString();
            type.type_name = $(obj[k]).closest("tr").find('td:nth-child(2)').text().toString();
            console.log($(obj[k]).closest("tr").find('td:nth-child(2)').text());
            type_info.push(type);
        }
    }
    info = JSON.stringify(type_info);
    var params = {
        "typeInfo": info
    };
    var response = webRequest(url, "POST", false, params);

    if (response != null && response.status == 0) {
        refreshData();
        showTransientDialog("操作成功！");
        return true;
    } else {
        showTransientDialog(response.msg);
        return false;
    }
}

//初始化增加桥梁类型按钮事件
$(function(){
    $('#add_bridge_type').click(function () {
        showBridgeDialog('新增桥梁类型', 'create');
    });

    $('#delete_bridge_type').click(function(){
        del_bridge_type();
    })
})

//初始化
$(function () {
    updateBridgeTypeGrid();
});

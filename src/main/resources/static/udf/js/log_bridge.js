//更新桥梁修改日志列表
function updateBridgeLogGrid(){
    var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    type: "get",
                    url: "/log_bridge/list",
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
                                template: '<input type="checkbox" class="checkbox" name="bridge-checkbox" value="#:log_id#" />',
                                headerAttributes: {style: "text-align:center"},
                                attributes: {class: "text-center"},
                                width: '30px'
                            },
                             {
                                field: "bridge_name",
                                title: "被修改的桥梁名称",
                                headerAttributes: {style: "text-align:center"},
                                attributes: {class: "text-center"}
                             }, {
                                field: "username",
                                title: "操作人员帐号",
                                headerAttributes: {style: "text-align:center"},
                                attributes: {class: "text-center"}
                             }, {
                                field: "log_time",
                                title: "日志时间",
                                headerAttributes: {style: "text-align:center"},
                                attributes: {class: "text-center"}
                             }, {
                                field: "log_info",
                                title: "日志信息",
                                headerAttributes: {style: "text-align:center"},
                                attributes: {class: "text-center"}
                             }]
                        });
}
//重新读取并刷新数据
function refreshData() {
    var $bridge_grid = $("#bridge-grid");
    $bridge_grid.data("kendoGrid").dataSource.read();
    $bridge_grid.data("kendoGrid").refresh();
}
//初始化删除日志按钮事件
$(function(){
    $('#delete_bridgelog').click(function () {
          var checked_list = [];
          $('[name=bridge-checkbox]').each(function (index, ele) {
              if ($(ele).prop("checked")) {
                  checked_list.push($(ele).val())
              }
          });
          var checked_len = checked_list.length;
          if (checked_len <= 0) {
                    showTransientDialog("请选择日志！");
        } else {
                showAlertDialog("确定删除 " + checked_len + " 条日志?", function () {
                var url = '/log_bridge/delete';
                var params = {
                    'checkedList': checked_list.join(',')
                };
                var response = webRequest(url, 'POST', false, params);
                if (response != null && response.status == 0) {
                    refreshData();
                    showTransientDialog("删除 " + checked_len + " 条日志成功！");
                } else {
                    showTransientDialog(response.msg);
               }
           });
       }
   });
});

function searchByBridgeNameGrid()
{

}
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
//        updateBridgeLogGrid($(this).val());
//    });
//}
//just for test
function init(){
    var logs=[{"bridge_name":"粤港澳大桥","user_name":"admin","log_time":"2018-09-18 15:26:53","log_info":"test1"},
      {"bridge_name":"广济桥","user_name":"admin","log_time":"2018-09-18 15:59:01","log_info":"test2"}];

        $("#bridge-grid").kendoGrid({
            dataSource: {
                data: logs,
                schema: {
                    model: {
                        fields: {
                            bridge_name: { type: "string" },
                            user_name: { type: "string" },
                            log_time: { type: "string" },
                            log_info: { type: "string" }
                        }
                    }
                },
                pageSize: 10
            },
            pageable: {
                input: true,
                numeric: false,
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
                field: "bridge_name",
                title: "被修改的桥梁名称",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                field: "user_name",
                title: "操作人员帐号",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                field: "log_time",
                title: "日志时间",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                field: "log_info",
                title: "日志信息",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }
            ]
        });
}


//初始化
$(function () {
    updateBridgeLogGrid();
});

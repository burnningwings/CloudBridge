//更新日志选项列表
function updateLogOptionGrid(){
    var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    type: "get",
                    url: "/log_option/list",
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

        $("#option-grid").empty();
        $("#option-grid").kendoGrid({
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
                 field: "option_name",
                 title: "日志列表",
                 headerAttributes: {style: "text-align:center"},
                 attributes: {class: "text-center"}
              },

              {
                 template : '<div class="form-inline-custom">\
                             <input type="checkbox" class="checkbox" name="option-checkbox" value="#:option_id#" #=option_state#>开启 </input> \
                             </div>',
                 field: "option_state",
                 title: "选项",
                 headerAttributes: {style: "text-align:center"},
                 attributes: {class: "text-center"}
             }
             ]
            });
}



//删除日志后需要重新读取并刷新数据
//function refreshData() {
//    var $system_grid = $("#option-grid");
//    $system_grid.data("kendoGrid").dataSource.read();
//    $system_grid.data("kendoGrid").refresh();
//}

//初始化保存日志选项按钮事件
$(function(){
    $('#save_option').click(function () {
          var checked_list = [];
           $('[name=option-checkbox]').each(function (index, ele) {
                  if ($(ele).prop("checked"))
                  {
                      checked_list.push($(ele).val())
                  }
           });

           var url = "/log_option/save";
           var params = {
                  'checkedList': checked_list.join(',')
           };
           var response = webRequest(url, 'POST', false, params);
           if (response != null && response.status == 0) {
               showTransientDialog("操作成功！");
               return true;
           } else {
               showTransientDialog(response.msg);
               return false;
           }
   });
})



//初始化
$(function () {
    updateLogOptionGrid();
});


//初始化日志选项的gird
function init(){
    var logs=[{"log_name":"桥梁修改日志","option":""},
      {"log_name":"系统操作日志","option":""}];

        $("#option-grid").kendoGrid({
            dataSource: {
                data: logs,
                schema: {
                    model: {
                        fields: {
                            log_name: { type: "string" },
                            option: { type: "string" }
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
                field: "log_name",
                title: "日志列表",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            },
            {
                template : '<div class="form-inline-custom">\
                            <input type="checkbox" class="checkbox" name="option-checkbox" >开启 </input> \
                            </div>',
                            //'<input type="radio" name = "no"> 开启 <input type="radio" name="off" > 关闭',
                            //'<td><input type="checkbox" class="checkbox" name="bridge-checkbox" /> 开启</td>',
                           //'<td> <input type="radio" name="meta" value="1" > 图片 </td>',
                           //'<td> <input type="radio" name="meta" value="2" > 视频 </td>',
                field: "option",
                title: "选项",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }
            ]
        });
}

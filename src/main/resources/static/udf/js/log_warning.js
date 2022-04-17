//更新报警日志列表
function updateWarningLogGrid(sensor_name){
    var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    type: "get",
                    url: "/log_warning/list",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                },
                parameterMap: function (options, operation) {
                    if (operation == "read") {
                        var parameter = {
                            page: options.page,
                            pageSize: options.pageSize,
                            //sensor_name: sensor_name
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

                $("#warning-grid").empty();
                    $("#warning-grid").kendoGrid({
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
                                field: "sensor_number",
                                title: "传感器编号",
                                headerAttributes: {style: "text-align:center"},
                                attributes: {class: "text-center"}
                             }, {
                                field: "end_time",
                                title: "报警时间",
                                headerAttributes: {style: "text-align:center"},
                                attributes: {class: "text-center"}
                             }, {
                                field: "warning_info",
                                title: "报警信息",
                                headerAttributes: {style: "text-align:center"},
                                attributes: {class: "text-center"}
                             }]
                        });
}
//删除日志后需要重新读取并刷新数据
function refreshData() {
    var $warning_grid = $("#warning-grid");
    $warning_grid.data("kendoGrid").dataSource.read();
    $warning_grid.data("kendoGrid").refresh();
}

//初始化
$(function () {
    updateWarningLogGrid("全部");
});

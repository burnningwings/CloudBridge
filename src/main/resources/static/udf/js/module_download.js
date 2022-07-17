function updateBridgeTypeGrid(){
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                type: "get",
                url: "/module_manager/list",
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
                template: '<input type="checkbox" class="checkbox" name="system-checkbox" value="#:id#" />',
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"},
                width: '30px'
            },{
                field: "name",
                title: "模型名称",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            },{
                field: "uploader_name",
                title: "上传者",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                field: "upload_time",
                title: "上传时间",
                template: function (item){
                    var upload_time = item.upload_time;
                    var year = upload_time.year;
                    var month = upload_time.monthValue <10?"0"+upload_time.monthValue.toString():upload_time.monthValue;
                    var day = upload_time.dayOfMonth<10?"0"+upload_time.dayOfMonth.toString():upload_time.dayOfMonth;
                    var hour = upload_time.hour<10?"0"+upload_time.hour.toString():upload_time.hour;
                    var minute = upload_time.minute<10?"0"+upload_time.minute.toString():upload_time.minute;
                    var second = upload_time.second<10?"0"+upload_time.second.toString():upload_time.second;
                    return year+ "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
                    // return upload_time.year + "-" + upload_time.monthValue + "-" + upload_time.dayOfMonth + " " + upload_time.hour + ":" + upload_time.minute + ":" + upload_time.second;
                },
                // template: '#= upload_time.year + "-" + upload_time.monthValue + "-" + upload_time.dayOfMonth + " " + upload_time.hour + ":" + upload_time.minute + ":" + upload_time.second #',
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }, {
                field: "feature",
                title: "所属功能",
                headerAttributes: {style: "text-align:center"},
                attributes: {class: "text-center"}
            }
        ]
    });
}

function download_module(URL,moduleName){
    var aEle = document.createElement("a");
    aEle.download = moduleName;
    aEle.href = URL;
    aEle.click();
}

//初始化
$(function () {
    updateBridgeTypeGrid();

    $('#download_module').click(function (){
        console.log("download")
        var url = "/module_manger/download";
        obj = document.getElementsByName("system-checkbox");
        var module_info = [];
        for(k in obj){
            if(obj[k].checked){
                var module = {};
                module.id = obj[k].value.toString();
                module.name = $(obj[k]).closest("tr").find('td:nth-child(2)').text().toString();
                console.log($(obj[k]).closest("tr").find('td:nth-child(2)').text());
                module_info.push(module);
            }
        }
        info = JSON.stringify(module_info);
        var params = {
            "moduleInfo": info
        };
        // var response = webRequest(url, "POST", false, params);
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        $(document).ajaxSend(function(e, xhr, options) {
            xhr.setRequestHeader(header, token);
        });
        $.ajax({
            url: "/module_manger/download",
            type: "POST",
            async: true,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(params),
            dataType: "text",
            beforeSend: function () {

            },
            success: function(response) {
                var str = response;
                console.log(str)
                var url = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
                var link = document.createElement("a");
                link.href = url;
                link.download = module.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return true;
            },
            complete:function () {
            },
            error: function(response) {
                alert("提交任务失败");
            }

        });


    });
});
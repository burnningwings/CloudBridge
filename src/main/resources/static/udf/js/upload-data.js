
function updateDropdownMenu(response){
    var data = null
    var bridge_options = "";
    var sensor_type_options = "";
    var sensor_options = "";
    var sensor_info = {};
    if(response!=null && response.status==0){
        data = response.data;
        console.log(data)
        bridge_options = bridge_options + "<option value='" + data["bridge_id"] + "'>" + data["bridge"][data["bridge_id"]] + "</option>";
        for(var key in data["bridge"]){
            if(key==data["bridge_id"]) continue;
            bridge_options = bridge_options + "<option value='" + key + "'>" + data["bridge"][key] + "</option>";
        }
        for(var key in data["bridge_detail"]){
            var sensor_dict = data["bridge_detail"][key]["sensor"];
            for(var sensor_id in sensor_dict){
                var sensor_name = sensor_dict[sensor_id];
                var sensor_name_list = sensor_name.split(" - ");
                var sensor_number = sensor_name_list[0];
                var sensor_type = sensor_name_list[1];
                if(sensor_info.hasOwnProperty(sensor_type)){
                    sensor_info[sensor_type].push([sensor_id,sensor_number]);
                }else{
                    sensor_info[sensor_type] = [[sensor_id,sensor_number]];
                }
            }
        }
        // key为传感器类型
        console.log(sensor_info)
        for(var key in sensor_info){
            sensor_type_options = sensor_type_options + "<option value='" + key + "'>" + key + "</option>";
        }
    }

    $("#bridge_menu").empty();
    $("#sensor_type_menu").empty();
    $("#sensor_menu").empty();

    $("#bridge_menu").append(bridge_options);
    $("#sensor_type_menu").append(sensor_type_options);
    var sensor_type_selected = $("#sensor_type_menu").val();
    if(sensor_type_selected && !(sensor_type_selected.match(/^\s*$/))){
        var sensor_list = sensor_info[sensor_type_selected];
        for(var key in sensor_list){
            sensor_options = sensor_options + "<option value='" + sensor_list[key][0] + "'>" + sensor_list[key][1] + "</option>";
        }
    }
    $("#sensor_menu").append(sensor_options);
    if(sensor_list && sensor_list.length){
        $("#sensor_menu").selectpicker('val', sensor_list[0][0]);
        $('#f_upload').prop("disabled", false);
    }else{
        $('#f_upload').prop("disabled", true);
    }
    $('.selectpicker').selectpicker('refresh');
    console.log(sensor_info)
    return sensor_info;
}

function updateMessageGrid(){
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                type: "get",
                url: "/upload-data/message/list",
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

    $("#message-grid").kendoGrid({
        dataSource: dataSource,
        pageable: {
            // pageSizes: true,
            pageSizes: [5,10,20],
            buttonCount: 1, // 限制其不能点击对应页
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
                field: "id",
                title: "ID",
                width: "280px",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "source",
                title: "原文件名称",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "target",
                title: "传感器编号",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "status",
                title: "上传状态",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            },{
                field: "last_update",
                title: "最近更新时间",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                title: "操作",
                template: '<button class="btn btn-primary" title="重新上传" type="button" onclick="reUpload(\'#: id #\')"/><i class="fa fa-fw fa-repeat"></i></button>&nbsp;<button class="btn btn-success" type="button" onclick="browseUploadLog(\'#: id #\')"/>查看日志</button>',
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }
        ]
    });
}

function reUpload(id){
    function callback(){
        var response = webRequest("/upload-data/replay","GET",false,{"id":id});
        console.log(response)
        if(response!=null && response.status==0){
            updateMessageGrid();
            showModalDialog("提示", "<div style='text-align:center;'>文件正在上传...</div>",function(){},120,40);
        }else{
            showTransientDialog(response.msg);
        }
    }
    showAlertDialog("确定重新上传？",callback);
}

function browseUploadLog(id){
    var response = webRequest("/message/log","GET",false,{"id":id});
    console.log(response)
    if(response!=null && response.status==0){
        // 替换所有换行符
        showMessageDialog("日志", response.data["error_log"].replace(/\n/g,"<br>"), function(){},400,100);
    }else{
        showTransientDialog(response.msg);
    }
}

// 其它初始化
$(function () {
    var url = "/query-data/dropdown";
    var response = webRequest(url,"GET",false,{"bridge_id":"all"})
    var data = updateDropdownMenu(response);
    $('#bridge_menu').change(function(){
        var id = $(this).children('option:selected').val();
        var response = webRequest(url,"GET",false,{"bridge_id":id})
        data = updateDropdownMenu(response);
    })

    $('#sensor_type_menu').change(function(){
        var sensor_type_selected = $(this).children('option:selected').val();
        var sensor_options = "";
        var sensor_list = data[sensor_type_selected];
        for(var key in sensor_list){
            sensor_options = sensor_options + "<option value='" + sensor_list[key][0] + "'>" + sensor_list[key][1] + "</option>";
        }
        $("#sensor_menu").empty();
        $("#sensor_menu").append(sensor_options);
        if(sensor_list.length){
            $("#sensor_menu").selectpicker('val', sensor_list[0][0]);
        }
        $('.selectpicker').selectpicker('refresh');
    })

    $("#dataschema_tips_btn").click(function(){
        var popoverEl = $("#dataschema_tips_btn");
        popoverEl.popover("destroy");
        var sensor_type_selected = $("#sensor_type_menu").val();
        var content = "";
        if(sensor_type_selected && !(sensor_type_selected.match(/^\s*$/))){
            var schema = sensor_metadata_map[sensor_type_selected]["data_schema"];
            content = content + "{"
            var sep = "";
            for(var key in schema){
                content = content + sep + "<br>&nbsp;&nbsp;&nbsp;&nbsp;" + key + ": " + schema[key];
                sep = ","
            }
            content = content + "<br>}"
            popoverEl.attr("data-content", content);
            popoverEl.popover("show");
        }else{
            showTransientDialog("未选择传感器类型！");
        }
    });

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    $(document).ajaxSend(function(e, xhr, options) {
        xhr.setRequestHeader(header, token);
    });

    $("#f_upload").fileinput({
        allowedFileExtensions: ['csv'],
        uploadUrl: "upload-data/upload",
        language: 'zh',
        uploadAsync: true,
        showUpload: true,
        maxFileCount: 1,
        autoReplace: true,
        showPreview: false,
        maxFileSize: 512000, // KB,当前限制为50MB
        maxPreviewFileSize: 1,
        uploadExtraData: function() {
            return {
                "sensor_id": $("#sensor_menu").val(),
                "sensor_number": $("#sensor_menu option:selected").text()
            };
        }
    }).on("fileuploaded", function (event, data, previewId, index) {
        var response = data.response;
        console.log(response)
        if(response.status!=0){
            showTransientDialog(response.msg);
        }else{
            updateMessageGrid();
            showModalDialog("提示", "<div style='text-align:center;'>文件正在上传...</div>",function(){},120,40);
        }
    }).on('fileuploaderror', function(event, data, msg) {
        var response = data.response;
        console.log(data)
        var msg = "仅支持csv且单文件大小不超过50MB！";
        if(response!=null && response.msg!="") msg = response.msg;
        showTransientDialog(msg);
    });
    // 获取消息列表
    updateMessageGrid();
});


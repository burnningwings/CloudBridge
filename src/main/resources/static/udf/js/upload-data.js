
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
        uploadAsync: true,
        showUpload: true,
        maxFileCount: 1,
        autoReplace: true,
        showPreview: false,
        maxFileSize: 512000, // KB,当前限制为50MB
        maxPreviewFileSize: 1,
        uploadExtraData: function() {
            return {
                "sensor_id": $("#sensor_menu").val()
            };
        }
    }).on("fileuploaded", function (event, data, previewId, index) {
        var response = data.response;
        console.log(response)
        if(response.status!=0){
            showTransientDialog(response.msg);
        }else{
            function ok_callback(){
                window.open(response.data["url"]);
            }
            showModalDialog("提示", "<div style='text-align:center;'>文件正在上传！<br>查看上传情况？</div>", ok_callback,100,40)
        }
    }).on('fileuploaderror', function(event, data, msg) {
        var response = data.response;
        console.log(data)
        showTransientDialog("仅支持csv且单文件大小不超过50MB！");
    });
});


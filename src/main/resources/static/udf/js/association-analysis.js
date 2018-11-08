function updateDropdownMenu(response) {
    var data = null;
    var bridge_options = "";
    var section_options = "";
    var point_options = "";
    if(response != null && response.status==0){
        data = response.data;
        console.log(data);
        bridge_options = bridge_options + "<option value='" + data["bridge_id"] + "'>" + data["bridge"][data["bridge_id"]] + "</option>>";
        for(var key in data["bridge"]){
            if(key==data["bridge_id"]) continue;
            bridge_options = bridge_options + "<option value='" + key + "'>" + data["bridge"][key] + "</option>>";
        }
        for(var key in data["bridge_detail"]){
            section_options = section_options + "<option value='" + key + "'>" + data["bridge_detail"][key]["name"] + "</option>";
        }
    }
    $("#association_bridge").empty();
    $("#association_section").empty();
    $("#association_watchpoint").empty();

    $("#association_bridge").append(bridge_options);
    $("#association_section").append(section_options);
    var section_selected = $("#association_section").val();
    if(section_selected && !(section_selected.match(/^\s*$/))){
        var point_info = data["bridge_detail"][section_selected]["watchpoint"];
        for(var key in point_info){
            point_options = point_options + "<option value='" + key + "'>" + point_info[key] + "</option>>";
        }
    }
    $("#association_watchpoint").append(point_options);
    $('.selectpicker').selectpicker('refresh');
    return data;
}

function updateDropdownListAssociationFile(){
    $("#association_file_selected").empty();
    var url = "/association-analysis/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "associationfile"});
    var options ="<option value=\'\' disabled selected>请选择分析文件</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key + "</option>";
        }
    }
    $("#association_file_selected").append(options);
    $("#association_file_selected").selectpicker('refresh');
    // $("#train_file_selected").on('shown.bs.select',function(e){
    //      console.log('展开');
    // })
}

function getAndshowAnalysisResult(figure_id, current_dialog, params){
    function successCallback(message) {
        console.log(message);
        current_dialog.button('reset').dequeue();
        var status = message["status"];
        if(status != 0){
            $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/warning.png'/>");
            showTransientDialog(message["msg"]);
            return;
        }else{
            // var sensor1 = message["data"]["sensor1"];
            // var sensor2 = message["data"]["sensor2"];
            // console.log(sensor1);
            // console.log(sensor2);
            // showAnalysisResultChart(figure_id, sensor1, sensor2);
            var layer = message["data"]["layer"];
            if(layer == 7){
                var timeList = message["data"]["timeList"];
                var strain = message["data"]["strain"];
                var sa7 = message["data"]["sa7"];
                var sd1 = message["data"]["sd1"];
                var sd2 = message["data"]["sd2"];
                var sd3 = message["data"]["sd3"];
                var sd4 = message["data"]["sd4"];
                var sd5 = message["data"]["sd5"];
                var sd6 = message["data"]["sd6"];
                var sd7 = message["data"]["sd7"];
                var temperature = message["data"]["temperature"];
                var ta7 = message["data"]["ta7"];
                var td1 = message["data"]["td1"];
                var td2 = message["data"]["td2"];
                var td3 = message["data"]["td3"];
                var td4 = message["data"]["td4"];
                var td5 = message["data"]["td5"];
                var td6 = message["data"]["td6"];
                var td7 = message["data"]["td7"];
                // console.log("timeList", timeList);
                // console.log("strand", strain);
                // console.log("sa7", sa7);
                // console.log("sd1", sd1);
                // console.log("td7", td7);
                showAnalysisResultChart_sevenlayer(figure_id, timeList, strain, sa7, sd1, sd2, sd3, sd4, sd5, sd6, sd7, temperature, ta7, td1, td2, td3, td4, td5, td6, td7);
            }else{
                var timeList = message["data"]["timeList"];
                var strain = message["data"]["strain"];
                var sa7 = message["data"]["sa7"];
                var sd1 = message["data"]["sd1"];
                var sd2 = message["data"]["sd2"];
                var sd3 = message["data"]["sd3"];
                var sd4 = message["data"]["sd4"];
                var temperature = message["data"]["temperature"];
                var ta7 = message["data"]["ta7"];
                var td1 = message["data"]["td1"];
                var td2 = message["data"]["td2"];
                var td3 = message["data"]["td3"];
                var td4 = message["data"]["td4"];
                showAnalysisResultChart_fourlayer(figure_id, timeList, strain, sa7, sd1, sd2, sd3, sd4, temperature, ta7, td1, td2, td3, td4);
            }

        }
    }

    var url = "/association-analysis/getAnalysisResult";
    webRequest(url, "GET", true, params, successCallback)
}

//初始化
$(function () {

    updateDropdownListAssociationFile();

    var url ="/association-analysis/updtate_bridgedroplist";
    var response = webRequest(url, "GET", false, {"bridge_id" : "all"})
    var data1 = updateDropdownMenu(response);

    $('#association_bridge').change(function () {
        var id = $(this).children('option:selected').val();
        var url = "/association-analysis/updtate_bridgedroplist";
        var response = webRequest(url, "GET", false, {"bridge_id" : id})
        data1 = updateDropdownMenu(response);
    })

    $('#association_section').change(function () {
        var id = $(this).children('option:selected').val();
        var point_info = data1["bridge_detail"][id]["watchpoint"];
        var point_options = "";
        for(var key in point_info){
            point_options = point_options + "<option value='" + key + "'>" + point_info[key] + "</option>";
        }
        $("#association_watchpoint").empty();
        $("#association_watchpoint").append(point_options);
        $(".selectpicker").selectpicker('refresh');
    })

    var data_format_str = 'yyyy-MM-dd HH:mm:ss';
    var current_time = new Date().format(data_format_str);
    var t_begin = new Date(2006,10,03,12,00,00).format(data_format_str);
    var t_end = new Date(2006,10,31,22,00,00).format(data_format_str);
    $('#association_begin_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#association_end_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#association_begin_time').val(t_begin);
    $('#association_end_time').val(t_end);

    $("#association_file_dataformat").click(function(){
        var popoverEl = $("#association_file_dataformat");
        popoverEl.popover("destroy");
        var content = "{<br/>"+
            "sensor1, sensor2, sensor3, ..., t1, t2<br/>"+
            "}";
        popoverEl.attr("data-content", content);
        popoverEl.popover("show");

    });

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    $(document).ajaxSend(function(e, xhr, options) {
        xhr.setRequestHeader(header, token);
    });

    $("#association_file_upload").fileinput({
        allowedFileExtensions: ['csv'],
        uploadUrl: "association_analysis/associationFileUpload",
        language: 'zh',
        uploadAsync: true,
        showUpload: true,
        maxFileCount: 1,
        autoReplace: true,
        showPreview: false,
        maxFileSize: 512000, // KB,当前限制为50MB
        maxPreviewFileSize: 1
    }).on("fileuploaded",function (event, data, previewId, index) {
        var response = data.response;
        console.log(response)
        if(response.status != 0){
            showTransientDialog(response.msg);
        }else{
            showModalDialog("提示", "<div style='text-align:center;'>文件正在上传...</div>",function(){},120,40);
        }
        //更新下拉列表
        updateDropdownListAssociationFile();
    }).on('fileuploaderror', function (event, data, msg) {
        var response = data.response;
        console.log("data");
        console.log(data);
        var msg = "仅支持csv且单文件大小不超过50MB！";
        if(response!=null && response.msg!="") msg = response.msg;
        console.log(msg);
        showTransientDialog(msg);
    });

    $("#association_analysis_start").click(function () {
        var association_file = $("#association_file_selected").val();
        var associatin_bridge = $("#association_bridge option:selected").text();
        var association_section = $("#association_section option:selected").text();
        var association_watchpoint = $("#association_watchpoint option:selected").text();

        if (association_file == null){
            showTransientDialog("请选择分析文件");
            //showDialog("请选择训练文件");
            return;
        }
        if(associatin_bridge == null){
            showTransientDialog("请选择分析桥梁");
            return;
        }
        if(association_section == null){
            showTransientDialog("请选择桥梁截面");
            return;
        }
        if(association_watchpoint == null){
            showTransientDialog("请选择观测点");
            return;
        }

        var begin_time = $("#association_begin_time").val();
        var end_time = $("#association_end_time").val();
        if(begin_time >= end_time){
            showTransientDialog("开始时间必须小于截止时间");
            return;
        }

        var response = null;
        var d = null;
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        $(document).ajaxSend(function(e, xhr, options) {
            xhr.setRequestHeader(header, token);
        });
        $.ajax({
            url: "/association-analysis/start-analysis",
            type: "POST",
            async: true,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "associationfile" : association_file,
                "bridge" : associatin_bridge,
                "section" : association_section,
                "watchpoint" : association_watchpoint,
                "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                "endtime" :  new Date(end_time).format('yyyyMMddHHmmss')
            }),
            dataType: "json",
            beforeSend: function () {
                $("#association_analysis_start").text('分析中...');
                $("#association_analysis_process").removeAttr("value");
                // var content = '' +
                //     ' <img alt="loadding" src="/assets/img/loading.gif" /> \
                //     '
                // d = dialog({
                //     content: content
                // });
                // d.showModal();
            },
            success: function(response) {
                var data = response.data;
                var result = data['result'];
                if (result == 'success') {
                    //showTransientDialog('训练完成!')
                    //showModalDialog("提示", "训练完成")
                    //showAlertDialog('训练完成')
                    showDialog("分析完成")
                } else {
                    showTransientDialog('分析失败！')
                }
            },
            complete:function () {
                $("#association_analysis_start").text("开始分析");
                $("#association_analysis_process").attr("value", "100");

                // if (d != null) {
                //     d.close().remove();
                // }
            },
            error: function(response) {
                //showTransientDialog('调用失败！')
                alert("提交任务失败");
            }

        });
    });

    $("#result_association_analysis").click(function () {
        var association_file = $("#association_file_selected").val();
        var associatin_bridge = $("#association_bridge option:selected").text();
        var association_section = $("#association_section option:selected").text();
        var association_watchpoint = $("#association_watchpoint option:selected").text();

        if (association_file == null){
            showTransientDialog("请选择分析文件");
            //showDialog("请选择训练文件");
            return;
        }
        if(associatin_bridge == null){
            showTransientDialog("请选择分析桥梁");
            return;
        }
        if(association_section == null){
            showTransientDialog("请选择桥梁截面");
            return;
        }
        if(association_watchpoint == null){
            showTransientDialog("请选择观测点");
            return;
        }

        var begin_time = $("#association_begin_time").val();
        var end_time = $("#association_end_time").val();
        if(begin_time >= end_time){
            showTransientDialog("开始时间必须小于截止时间");
            return;
        }

        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        $(document).ajaxSend(function(e, xhr, options) {
            xhr.setRequestHeader(header, token);
        });
        var figure_id = "association_show_result_figure";
        $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/loading.gif'/>");
        $(this).button("loading").delay(1000).queue(function () {
            var param ={
                "bridge" : associatin_bridge,
                "section" : association_section,
                "watchpoint" : association_watchpoint,
                "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                "endtime" :  new Date(end_time).format('yyyyMMddHHmmss')
            }
            var current_dialog = $(this);
            getAndshowAnalysisResult(figure_id, current_dialog, param);
        })

    });
    
})
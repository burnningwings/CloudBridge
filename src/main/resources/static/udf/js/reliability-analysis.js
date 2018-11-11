function updateDropdownListReliabilityFile(){
    $("#reliability_file_selected").empty();
    var url = "/reliability-analysis/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "reliabilityfile"});
    var options ="<option value=\'\' disabled selected>请选择分析文件</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key + "</option>";
        }
    }
    $("#reliability_file_selected").append(options);
    $("#reliability_file_selected").selectpicker('refresh');
    // $("#train_file_selected").on('shown.bs.select',function(e){
    //      console.log('展开');
    // })
}

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
    $("#reliability_bridge").empty();
    $("#reliability_section").empty();
    $("#reliability_watchpoint").empty();

    $("#reliability_bridge").append(bridge_options);
    $("#reliability_section").append(section_options);
    var section_selected = $("#reliability_section").val();
    if(section_selected && !(section_selected.match(/^\s*$/))){
        var point_info = data["bridge_detail"][section_selected]["watchpoint"];
        for(var key in point_info){
            point_options = point_options + "<option value='" + key + "'>" + point_info[key] + "</option>>";
        }
    }
    $("#reliability_watchpoint").append(point_options);
    $('.selectpicker').selectpicker('refresh');
    return data;
}

function getAndshowReliabilityAnalysisResult(figure_id, current_dialog, params){
    function successCallback(message) {
        console.log(message);
        current_dialog.button('reset').dequeue();
        var status = message["status"];
        if(status != 0){
            $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/warning.png'/>");
            showTransientDialog(message["msg"]);
            return;
        }else{
            var timeList = message["data"]["timeList"];
            var btcList = message["data"]["btc"];
            var bttList = message["data"]["btt"];
            var pfcList = message["data"]["pfc"];
            var pftList = message["data"]["pft"];

            showReliabilityResultChart(figure_id, timeList, btcList, bttList, pfcList, pftList);
        }
    }
    var url = "/reliability-analysis/getAnalysisResult";
    webRequest(url, "GET", true, params, successCallback)
}

//初始化
$(function () {

    updateDropdownListReliabilityFile();

    var url ="/reliability-analysis/updtate_bridgedroplist";
    var response = webRequest(url, "GET", false, {"bridge_id" : "all"})
    var data1 = updateDropdownMenu(response);

    $('#reliability_bridge').change(function () {
        var id = $(this).children('option:selected').val();
        var url = "/reliability-analysis/updtate_bridgedroplist";
        var response = webRequest(url, "GET", false, {"bridge_id" : id})
        data1 = updateDropdownMenu(response);
    })

    $('#reliability_section').change(function () {
        var id = $(this).children('option:selected').val();
        var point_info = data1["bridge_detail"][id]["watchpoint"];
        var point_options = "";
        for(var key in point_info){
            point_options = point_options + "<option value='" + key + "'>" + point_info[key] + "</option>";
        }
        $("#reliability_watchpoint").empty();
        $("#reliability_watchpoint").append(point_options);
        $(".selectpicker").selectpicker('refresh');
    })

    var data_format_str = 'yyyy-MM-dd HH:mm:ss';
    var current_time = new Date().format(data_format_str);
    var t_begin = new Date(2006,10,01,00,00,00).format(data_format_str);
    var t_end = new Date(2010,09,04,00,00,00).format(data_format_str);
    $('#reliability_begin_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#reliability_end_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#reliability_begin_time').val(t_begin);
    $('#reliability_end_time').val(t_end);

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    $(document).ajaxSend(function(e, xhr, options) {
        xhr.setRequestHeader(header, token);
    });

    //upload file
    $("#reliability_file_upload").fileinput({
        allowedFileExtensions: ['csv'],
        uploadUrl: "reliability-analysis/reliabilityFileUpload",
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
        updateDropdownListReliabilityFile();
    }).on('fileuploaderror', function (event, data, msg) {
        var response = data.response;
        console.log("data");
        console.log(data);
        var msg = "仅支持csv且单文件大小不超过50MB！";
        if(response!=null && response.msg!="") msg = response.msg;
        console.log(msg);
        showTransientDialog(msg);
    });

    $("#reliability_file_dataformat").click(function(){
        var popoverEl = $("#reliability_file_dataformat");
        popoverEl.popover("destroy");
        var content = "{<br/>"+
            "time, bridge, section, point, measure_data....<br/>"+
            "}";
        popoverEl.attr("data-content", content);
        popoverEl.popover("show");

    });

    $("#reliability_analysis_start").click(function () {
        var reliability_file = $("#reliability_file_selected").val();
        var reliability_bridge_id = $("#reliability_bridge").val();
        var reliability_watchpoint_id = $("#reliability_watchpoint").val();
        var reliability_bridge = $("#reliability_bridge option:selected").text();
        var reliability_section = $("#reliability_section option:selected").text();
        var reliability_watchpoint = $("#reliability_watchpoint option:selected").text();

        if (reliability_file == null){
            showTransientDialog("请选择分析文件");
            //showDialog("请选择训练文件");
            return;
        }
        if(reliability_bridge == null){
            showTransientDialog("请选择分析桥梁");
            return;
        }
        if(reliability_section == null){
            showTransientDialog("请选择桥梁截面");
            return;
        }
        if(reliability_watchpoint == null){
            showTransientDialog("请选择观测点");
            return;
        }

        var begin_time = $("#reliability_begin_time").val();
        var end_time = $("#reliability_end_time").val();
        if(begin_time >= end_time){
            showTransientDialog("开始时间必须小于截止时间");
            return;
        }
        //时间间隔要等于大于6个月
        var time1 = new Date(begin_time).getTime();
        var time2 = new Date(end_time).getTime();
        var timeCha = time2 - time1;
        console.log(timeCha);
        if(timeCha < 15552000000){
            showTransientDialog("可靠度分析的时间间隔不能少于半年");
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
            url: "/reliability-analysis/start-analysis",
            type: "POST",
            async: true,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "reliabilityfile" : reliability_file,
                "bridge" : reliability_bridge,
                "section" : reliability_section,
                "watchpoint" : reliability_watchpoint,
                "bridge_id" : reliability_bridge_id,
                "watchpoint_id" : reliability_watchpoint_id,
                "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                "endtime" :  new Date(end_time).format('yyyyMMddHHmmss')
            }),
            dataType: "json",
            beforeSend: function () {
                $("#reliability_analysis_start").text('分析中...');
                $("#reliability_analysis_process").removeAttr("value");
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
                } else if(result == 'no param'){
                    showTransientDialog('找不到该桥和测点的预置参数！');
                } else if(result == 'no data'){
                    showTransientDialog('没有符合条件的数据');
                } else{
                    showTransientDialog('分析失败');
                }
            },
            complete:function () {
                $("#reliability_analysis_start").text("开始分析");
                $("#reliability_analysis_process").attr("value", "100");

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

    $("#result_reliability_analysis").click(function () {
        var reliability_file = $("#reliability_file_selected").val();
        var associatin_bridge = $("#reliability_bridge option:selected").text();
        var reliability_section = $("#reliability_section option:selected").text();
        var reliability_watchpoint = $("#reliability_watchpoint option:selected").text();

        if (reliability_file == null){
            showTransientDialog("请选择分析文件");
            //showDialog("请选择训练文件");
            return;
        }
        if(associatin_bridge == null){
            showTransientDialog("请选择分析桥梁");
            return;
        }
        if(reliability_section == null){
            showTransientDialog("请选择桥梁截面");
            return;
        }
        if(reliability_watchpoint == null){
            showTransientDialog("请选择观测点");
            return;
        }

        var begin_time = $("#reliability_begin_time").val();
        var end_time = $("#reliability_end_time").val();
        if(begin_time >= end_time){
            showTransientDialog("开始时间必须小于截止时间");
            return;
        }
        //时间间隔要等于大于6个月
        var time1 = new Date(begin_time).getTime();
        var time2 = new Date(end_time).getTime();
        var timeCha = time2 - time1;
        console.log(timeCha);
        if(timeCha < 15552000000){
            showTransientDialog("可靠度分析的时间间隔不能少于半年");
            return;
        }

        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        $(document).ajaxSend(function(e, xhr, options) {
            xhr.setRequestHeader(header, token);
        });
        var figure_id = "reliability_show_result_figure";
        $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/loading.gif'/>");
        $(this).button("loading").delay(1000).queue(function () {
            var param ={
                "bridge" : associatin_bridge,
                "section" : reliability_section,
                "watchpoint" : reliability_watchpoint,
                "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                "endtime" :  new Date(end_time).format('yyyyMMddHHmmss')
            }
            var current_dialog = $(this);
            getAndshowReliabilityAnalysisResult(figure_id, current_dialog, param);
        })

    });
})
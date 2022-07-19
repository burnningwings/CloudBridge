function updateDropdownMenu(response) {
    var data = null;
    var region_options = "<option value='-1'>未指定桥梁</option>"
    var bridge_options = "<option value='-1'>请选择桥梁</option>";
    var section_options = "<option value='-1'>请选择截面</option>";
    var point_options = "<option value='-1'>请选择测点</option>";
    var box_options = "<option value='-1'>请选择控制箱</option>"
    var sensor_options = "<option value='-1'>请选择传感器</option>"
    if(response != null && response.status==0){
        data = response.data;
        console.log(data);
        bridge_options = bridge_options + "<option value='" + data["bridge_id"] + "'>" + data["bridge"][data["bridge_id"]] + "</option>>";
        for(var key in data["bridge"]){
            if(key==data["bridge_id"]) continue;
            bridge_options = bridge_options + "<option value='" + key + "'>" + data["bridge"][key] + "</option>>";
            region_options = region_options + "<option value='"+ key + "'>" + data["region"][key] + "</option>";
        }
        for(var key in data["bridge_detail"]){
            section_options = section_options + "<option value='" + key + "'>" + data["bridge_detail"][key]["name"] + "</option>";
        }
        for(var key in data["box_sensor"]){
            box_options = box_options + "<option value='" + key + "'>" + data["box_sensor"][key]["name"] + "</option>"
        }
    }
    $("#association_bridge").empty();
    $("#association_section").empty();
    $("#association_watchpoint").empty();
    $("#association_box_selected").empty();
    $("#association_region_selected").empty();
    $("#association_sensor_selected").empty();

    $("#association_bridge").append(bridge_options);
    $("#association_section").append(section_options);
    $("#association_box_selected").append(box_options);
    $("#association_region_selected").append(region_options);
    $("#association_sensor_selected").append(sensor_options)
    // var section_selected = $("#association_section").val();
    // if(section_selected && !(section_selected.match(/^\s*$/))){
    //     var point_info = data["bridge_detail"][section_selected]["watchpoint"];
    //     for(var key in point_info){
    //         point_options = point_options + "<option value='" + key + "'>" + point_info[key] + "</option>>";
    //     }
    // }
    $("#association_watchpoint").append(point_options);
    $('.selectpicker').selectpicker('refresh');
    return data;
}

function updateDropdownMenu1(response) {
    var data = null;
    // var organ_options = "<option value='-1'>请选择地区</option>"
    // var bridge_options = "<option value='-1'>请选择桥梁</option>";
    var section_options = "<option value='-1'>请选择截面</option>";
    var point_options = "<option value='-1'>请选择测点</option>";
    var box_options = "<option value='-1'>请选择控制箱</option>"
    var sensor_options = "<option value='-1'>请选择传感器</option>"
    if(response != null && response.status==0){
        data = response.data;
        console.log(data);
        // bridge_options = bridge_options + "<option value='" + data["bridge_id"] + "'>" + data["bridge"][data["bridge_id"]] + "</option>>";
        // for(var key in data["bridge"]){
        //     if(key==data["bridge_id"]) continue;
        //     bridge_options = bridge_options + "<option value='" + key + "'>" + data["bridge"][key] + "</option>>";
        // }
        for(var key in data["bridge_detail"]){
            section_options = section_options + "<option value='" + key + "'>" + data["bridge_detail"][key]["name"] + "</option>";
        }
        for(var key in data["box_sensor"]){
            box_options = box_options + "<option value='" + key + "'>" + data["box_sensor"][key]["name"] + "</option>"
        }
    }


    // $("#association_bridge").empty();
    $("#association_section").empty();
    $("#association_watchpoint").empty();
    $("#association_box_selected").empty();
    // $("#reliability_organization_selected").empty();
    $("#association_sensor_selected").empty();

    // $("#association_bridge").append(bridge_options);
    $("#association_section").append(section_options);
    $("#association_box_selected").append(box_options);
    // $("#reliability_organization_selected").append(organ_options);
    $("#association_sensor_selected").append(sensor_options)
    // var section_selected = $("#association_section").val();
    // if(section_selected && !(section_selected.match(/^\s*$/))){
    //     var point_info = data["bridge_detail"][section_selected]["watchpoint"];
    //     for(var key in point_info){
    //         point_options = point_options + "<option value='" + key + "'>" + point_info[key] + "</option>>";
    //     }
    // }
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
            options = options + "<option>" + key.substring(0, key.lastIndexOf(".")) + "</option>";
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
            // if(layer == 7){
            //     var timeList = message["data"]["timeList"];
            //     var strain = message["data"]["strain"];
            //     var sa7 = message["data"]["sa7"];
            //     var sd1 = message["data"]["sd1"];
            //     var sd2 = message["data"]["sd2"];
            //     var sd3 = message["data"]["sd3"];
            //     var sd4 = message["data"]["sd4"];
            //     var sd5 = message["data"]["sd5"];
            //     var sd6 = message["data"]["sd6"];
            //     var sd7 = message["data"]["sd7"];
            //     var temperature = message["data"]["temperature"];
            //     var ta7 = message["data"]["ta7"];
            //     var td1 = message["data"]["td1"];
            //     var td2 = message["data"]["td2"];
            //     var td3 = message["data"]["td3"];
            //     var td4 = message["data"]["td4"];
            //     var td5 = message["data"]["td5"];
            //     var td6 = message["data"]["td6"];
            //     var td7 = message["data"]["td7"];
            //     // console.log("timeList", timeList);
            //     // console.log("strand", strain);
            //     // console.log("sa7", sa7);
            //     // console.log("sd1", sd1);
            //     // console.log("td7", td7);
            //     showAnalysisResultChart_sevenlayer(figure_id, timeList, strain, sa7, sd1, sd2, sd3, sd4, sd5, sd6, sd7, temperature, ta7, td1, td2, td3, td4, td5, td6, td7);
            // }else{
            //     var timeList = message["data"]["timeList"];
            //     var strain = message["data"]["strain"];
            //     var sa7 = message["data"]["sa7"];
            //     var sd1 = message["data"]["sd1"];
            //     var sd2 = message["data"]["sd2"];
            //     var sd3 = message["data"]["sd3"];
            //     var sd4 = message["data"]["sd4"];
            //     var temperature = message["data"]["temperature"];
            //     var ta7 = message["data"]["ta7"];
            //     var td1 = message["data"]["td1"];
            //     var td2 = message["data"]["td2"];
            //     var td3 = message["data"]["td3"];
            //     var td4 = message["data"]["td4"];
            //     showAnalysisResultChart_fourlayer(figure_id, timeList, strain, sa7, sd1, sd2, sd3, sd4, temperature, ta7, td1, td2, td3, td4);
            // }
            if(layer == 3){
                var timeList = message["data"]["timeList"];
                var sa7 = message["data"]["sa4"];
                var sd3 = message["data"]["sd3"];
                var sd4 = message["data"]["sd4"];
                var ta7 = message["data"]["ta4"];
                var td3 = message["data"]["td3"];
                var td4 = message["data"]["td4"];
                showAnalysisResultChart_threelayer(figure_id, timeList, sa7, sd3, sd4, ta7, td3, td4);
            }

        }
    }

    var url = "/association-analysis/getAnalysisResult";
    webRequest(url, "GET", true, params, successCallback)
}

function getAndshowSpyAnalysisResult(figure_id, current_dialog, params){
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
            // if(layer == 7){
            //     var timeList = message["data"]["timeList"];
            //     var strain = message["data"]["strain"];
            //     var sa7 = message["data"]["sa7"];
            //     var sd1 = message["data"]["sd1"];
            //     var sd2 = message["data"]["sd2"];
            //     var sd3 = message["data"]["sd3"];
            //     var sd4 = message["data"]["sd4"];
            //     var sd5 = message["data"]["sd5"];
            //     var sd6 = message["data"]["sd6"];
            //     var sd7 = message["data"]["sd7"];
            //     var temperature = message["data"]["temperature"];
            //     var ta7 = message["data"]["ta7"];
            //     var td1 = message["data"]["td1"];
            //     var td2 = message["data"]["td2"];
            //     var td3 = message["data"]["td3"];
            //     var td4 = message["data"]["td4"];
            //     var td5 = message["data"]["td5"];
            //     var td6 = message["data"]["td6"];
            //     var td7 = message["data"]["td7"];
            //     // console.log("timeList", timeList);
            //     // console.log("strand", strain);
            //     // console.log("sa7", sa7);
            //     // console.log("sd1", sd1);
            //     // console.log("td7", td7);
            //     showAnalysisResultChart_sevenlayer(figure_id, timeList, strain, sa7, sd1, sd2, sd3, sd4, sd5, sd6, sd7, temperature, ta7, td1, td2, td3, td4, td5, td6, td7);
            // }else{
            //     var timeList = message["data"]["timeList"];
            //     var strain = message["data"]["strain"];
            //     var sa7 = message["data"]["sa7"];
            //     var sd1 = message["data"]["sd1"];
            //     var sd2 = message["data"]["sd2"];
            //     var sd3 = message["data"]["sd3"];
            //     var sd4 = message["data"]["sd4"];
            //     var temperature = message["data"]["temperature"];
            //     var ta7 = message["data"]["ta7"];
            //     var td1 = message["data"]["td1"];
            //     var td2 = message["data"]["td2"];
            //     var td3 = message["data"]["td3"];
            //     var td4 = message["data"]["td4"];
            //     showAnalysisResultChart_fourlayer(figure_id, timeList, strain, sa7, sd1, sd2, sd3, sd4, temperature, ta7, td1, td2, td3, td4);
            // }
            if(layer == 3){
                var timeList = message["data"]["timeList"];
                var sa7 = message["data"]["sa4"];
                var sd3 = message["data"]["sd3"];
                var sd4 = message["data"]["sd4"];
                var ta7 = message["data"]["ta4"];
                var td3 = message["data"]["td3"];
                var td4 = message["data"]["td4"];
                showAnalysisResultChart_threelayer(figure_id, timeList, sa7, sd3, sd4, ta7, td3, td4);
            }

        }
    }

    var url = "/association-analysis/getAnalysisResult_spy";
    webRequest(url, "GET", true, params, successCallback)
}

function selectIsExitItem(objSelect,objItemValue){
    var isExit = false;
    console.log(objSelect["0"])
    for(var i = 0;i < objSelect["0"].options.length;i++){
        if (objSelect[0].options[i].value == objItemValue){
            isExit = true;
            break
        }
    }
    return isExit;
}

//初始化
$(function () {

    updateDropdownListAssociationFile();

    $("#image").hide()

    $("#association_file_dataformat").click(function(){
        // var popoverEl = $("#association_file_dataformat");
        // popoverEl.popover("destroy");
        // // var content = "{<br/>"+
        // //     "feature1,feature2,feature3<br/>"+
        // //     "}";
        // var content = "time : string<br/>" + "bridge : string<br/>" + "section : string<br/>" + "watch_point : point<br/>" +
        //             "unknow1 : float<br/>" + "通道 : string<br/>" + "传感器编号 : string<br/>" + "measure_strain : float<br/>" +
        //             "unknow2 : float<br/>" + "单位1 : string<br/>" + "数据 : float<br/>" + "单位2 : string<br/>" +
        //             "电阻值 : float<br/>" + "T : float<br/>" + "unknow3 : float<br/>" + "S : float"
        // popoverEl.attr("data-content", content);
        // popoverEl.popover("show");


        var popoverEl = $("#association_file_dataformat");
        popoverEl.popover("destroy");

        var str = "date,air_temp,strain\n";
        var url = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
        var link = document.createElement("a");
        link.href = url;
        link.download = '关联性分析数据模板.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    });

    var url ="/association-analysis/updtate_bridgedroplist";
    var response = webRequest(url, "GET", false, {"bridge_id" : "all"})
    var data1 = updateDropdownMenu(response);

    $('#association_bridge').change(function () {
        var id = $(this).children('option:selected').val();
        var url = "/association-analysis/updtate_bridgedroplist";
        var response = webRequest(url, "GET", false, {"bridge_id" : id})
        $("#bridge_image").attr("src","/bridge/image/" + id + "/1.png");
        $("#image").show()
        $("#association_region_selected").val(id)
        data1 = updateDropdownMenu1(response);
    })

    $('#association_section').change(function () {
        var id = $(this).children('option:selected').val();
        var sensor_info = data1["bridge_detail"][id]["sensor"];
        var sensor_options = "";
        for(var key in sensor_info){
            sensor_options = sensor_options + "<option value='" + key + "'>" + sensor_info[key] + "</option>";
        }
        var $dropdownMenu2 = $("#association_section");
        if (selectIsExitItem($dropdownMenu2,"-2")){
            for (var i =0;i<$dropdownMenu2["0"].options.length;i++){
                if ($dropdownMenu2["0"].options[i].value == "-2"){
                    $dropdownMenu2["0"].remove(i);
                    break;
                }
            }
        }
        $("#association_sensor_selected").empty();
        $("#association_sensor_selected").append(sensor_options);
        if (!selectIsExitItem($("#association_box_selected"),"-2")) {
            var box_options = "<option value='-2'>未选中</option>";
            $("#association_box_selected").append(box_options);
            $("#association_box_selected").val("-2")
        }
        $(".selectpicker").selectpicker('refresh');
    })

    $('#association_box_selected').change(function () {
        var id = $(this).children('option:selected').val();
        var sensor_info = data1["box_sensor"][id]["sensor"];
        var sensor_options = "";
        for(var key in sensor_info){
            sensor_options = sensor_options + "<option value='" + key + "'>" + sensor_info[key] + "</option>";
        }
        var $dropdownMenu2 = $("#association_box_selected");
        if (selectIsExitItem($dropdownMenu2,"-2")){
            for (var i =0;i<$dropdownMenu2["0"].options.length;i++){
                if ($dropdownMenu2["0"].options[i].value == "-2"){
                    $dropdownMenu2["0"].remove(i);
                    break;
                }
            }
        }
        $("#association_sensor_selected").empty();
        $("#association_sensor_selected").append(sensor_options);
        if (!selectIsExitItem($("#association_section"),"-2")) {
            var box_options = "<option value='-2'>未选中</option>";
            $("#association_section").append(box_options);
            $("#association_section").val("-2")
        }
        $(".selectpicker").selectpicker('refresh');
    })

    var spy_data_format_str = 'yyyy-MM-dd HH:mm:ss';
    var spy_current_time = new Date().format(spy_data_format_str);
    $('#spy_association_begin_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#spy_association_end_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#spy_association_begin_time').val(spy_current_time);
    $('#spy_association_end_time').val(spy_current_time);

    var data_format_str = 'yyyy-MM-dd HH:mm:ss';
    var current_time = new Date().format(data_format_str);
    var t_begin = new Date(2016,01,03,12,00,00).format(data_format_str);
    var t_end = new Date(2016,05,31,22,00,00).format(data_format_str);
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

    $("#spy_association_analysis_start").click(function () {
       var sensor_id = $("#association_sensor_selected").val();
       if(sensor_id == null){
           showTransientDialog("请选择传感器");
           return;
       }
        var begin_time = $("#spy_association_begin_time").val();
        var end_time = $("#spy_association_end_time").val();
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
            url: "/association-analysis/start-analysis-spy",
            type: "POST",
            async: true,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "sensor_id" : sensor_id,
                "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                "endtime" :  new Date(end_time).format('yyyyMMddHHmmss')
            }),
            dataType: "json",
            beforeSend: function () {

                $("#spy_association_analysis_start").text('分析中...');
                $("#spy_association_analysis_process").removeAttr("value");
                $("#spy_association_analysis_computing").show();
            },
            success: function(response) {
                $("#spy_association_analysis_computing").hide();
                var data = response.data;
                var result = data['result'];
                if (result == 'success') {
                    $("#spy_result_association_analysis").trigger("click")
                    showDialog("分析完成")
                } else if(result == 'nodata'){
                    showTransientDialog('没有符合条件的数据！')
                } else{
                    showTransientDialog('分析失败!');
                }
            },
            complete:function () {
                $("#spy_association_analysis_start").text("开始分析");
                $("#spy_association_analysis_process").attr("value", "100");
            },
            error: function(response) {
                alert("提交任务失败");
            }

        });
    });

    $("#association_analysis_start").click(function () {
        var association_file = $("#association_file_selected").val();
        var association_bridge = $("#association_bridge option:selected").text();
        var association_section = $("#association_section option:selected").text();
        var association_watchpoint = $("#association_watchpoint option:selected").text();

        if (association_file == null){
            showTransientDialog("请选择分析文件");
            //showDialog("请选择训练文件");
            return;
        }
        if(association_bridge == null){
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
                "associationfile" : association_file + ".csv",
                "bridge" : association_bridge,
                "section" : association_section,
                "watchpoint" : association_watchpoint,
                "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                "endtime" :  new Date(end_time).format('yyyyMMddHHmmss')
            }),
            dataType: "json",
            beforeSend: function () {

                $("#association_analysis_start").text('分析中...');
                $("#association_analysis_process").removeAttr("value");
                $("#association_analysis_computing").show();
                // var content = '' +
                //     ' <img alt="loadding" src="/assets/img/loading.gif" /> \
                //     '
                // d = dialog({
                //     content: content
                // });
                // d.showModal();
            },
            success: function(response) {
                $("#association_analysis_computing").hide();
                var data = response.data;
                var result = data['result'];
                if (result == 'success') {
                    //showTransientDialog('训练完成!')
                    //showModalDialog("提示", "训练完成")
                    //showAlertDialog('训练完成')
                    $("#result_association_analysis").trigger("click")
                    showDialog("分析完成")
                } else if(result == 'nodata'){
                    showTransientDialog('没有符合条件的数据！')
                } else{
                    showTransientDialog('分析失败!');
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
        // var associatin_bridge = $("#association_bridge option:selected").text();
        // var association_section = $("#association_section option:selected").text();
        // var association_watchpoint = $("#association_watchpoint option:selected").text();

        if (association_file == null){
            showTransientDialog("请选择分析文件");
            //showDialog("请选择训练文件");
            return;
        }
        // if(associatin_bridge == null){
        //     showTransientDialog("请选择分析桥梁");
        //     return;
        // }
        // if(association_section == null){
        //     showTransientDialog("请选择桥梁截面");
        //     return;
        // }
        // if(association_watchpoint == null){
        //     showTransientDialog("请选择观测点");
        //     return;
        // }

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
                // "bridge" : associatin_bridge,
                // "section" : association_section,
                // "watchpoint" : association_watchpoint,
                "filename" : association_file + ".csv",
                "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                "endtime" :  new Date(end_time).format('yyyyMMddHHmmss')
            }
            var current_dialog = $(this);
            getAndshowAnalysisResult(figure_id, current_dialog, param);
        })

    });

    $("#spy_result_association_analysis").click(function () {
        var sensor_id = $("#association_sensor_selected").val();
        if (sensor_id == null){
            showTransientDialog("请选择传感器");
            return;
        }

        var begin_time = $("#spy_association_begin_time").val();
        var end_time = $("#spy_association_end_time").val();
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
                "sensor_id" : sensor_id,
                "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                "endtime" :  new Date(end_time).format('yyyyMMddHHmmss')
            }
            var current_dialog = $(this);
            getAndshowSpyAnalysisResult(figure_id, current_dialog, param);
        })

    });
    
})
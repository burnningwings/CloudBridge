//初始化
// $(function () {
//     $("#run_train").click(function () {           //获取id为run_train的元素
//         var url = "/overweight-analysis/test";
//         var params = {};
//         var response = webRequest(url, "GET", false, params);
//         if (response!=null && response.status == 0) {
//             var data = response.data;
//             var result = data['result'];
//             if (result == 'completed') {
//                 showTransientDialog('训练完成!')
//             } else {
//                 showTransientDialog('训练失败！')
//             }
//         } else {
//             showTransientDialog('调用失败！')
//         }
//     });
// })

function countNumOverweight(timelist, overweightlist) {
    if(timelist.length == 0){
        return;
    }else{
        var start_time = Date.parse(new Date(timelist[0])) / 1000;
        var end_time = Date.parse(new Date(timelist[timelist.length-1])) / 1000;
        var interval = end_time - start_time;
        console.log("interval:",interval);
        if(interval <= 3600){   //间隔一个小时
            var count = countPerMin(timelist, overweightlist);
            console.log("count by min")
            return count;
        }else if(interval <= 86400){     //间隔一天
            console.log("count by hour")
            var count =  countPerHour(timelist, overweightlist);
            return count;
        }else if(interval <=2592000){    //间隔一个月
            console.log("count by day");
            var count = countPerDay(timelist, overweightlist);
            return count;
        }else if(interval <= 31104000){  //间隔一年
            console.log("count by month");
            var count = countPerMonth(timelist, overweightlist);
            return count;
        }else{
            console.log("count by year")
            var count = countPerYear();
            return count;
        }
    }
}

function countPerHour(timelist, overweight) {
    var count = new Map();
    for(var i = 0; i < timelist.length; i++){
        if(overweight[i] == 1){
            var newtime = timelist[i].substring(0,14) + "00:00";
            if(count.get(newtime)){
                var v = count.get(newtime) + 1;
                count.set(newtime, v);
            }else{
                count.set(newtime, 1);
            }
        }
    }
    return count;
}

function countPerMin(timelist, overweight) {
    var count = new Map();
    for (var i = 0; i < timelist.length; i++) {
        if (overweight[i] == 1) {
            var newtime = timelist[i].substr(0, 17) + "00";
            if (count.get(newtime)) {
                var v = count.get(newtime) + 1;
                count.set(newtime, v);
            } else {
                count.set(newtime, 1);
            }
        }
    }
    return count;
}

function countPerDay(timelist, overweight) {
    var count = new Map();
    for(var i = 0; i < timelist.length; i++){
        if(overweight[i] == 1){
            var newtime = timelist[i].substring(0,11) + "00:00:00";
            if(count.get(newtime)){
                var v = count.get(newtime) + 1;
                count.set(newtime, v);
            }else{
                count.set(newtime, 1);
            }
        }
    }
    return count;
}

function countPerMonth(timelist, overweight) {
    var count = new Map();
    for(var i = 0; i < timelist.length; i++){
        if(overweight[i] == 1){
            var newtime = timelist[i].substring(0,8) + "00 00:00:00";
            if(count.get(newtime)){
                var v = count.get(newtime) + 1;
                count.set(newtime, v);
            }else{
                count.set(newtime, 1);
            }
        }
    }
    return count;
}

function countPerYear(timelist, overweight) {
    var count = new Map();
    for(var i = 0; i < timelist.length; i++){
        if(overweight[i] == 1){
            var newtime = timelist[i].substring(0,5) + "00-00 00:00:00";
            if(count.get(newtime)){
                var v = count.get(newtime) + 1;
                count.set(newtime, v);
            }else{
                count.set(newtime, 1);
            }
        }
    }
    return count;
}


function getAndshowPredictResult(figure_id, current_dialog, params) {
    function successCaller(message) {
        console.log(message)
        current_dialog.button('reset').dequeue();
        var status = message["status"];
        if (status!=0) {
            $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/warning.png'/>");
            showTransientDialog(message["msg"]);
            return;
        }else{
            var timelist = message["data"]["timelist"];
            var overweightlist = message["data"]["overweightlist"];
            showPredictUDFResultChart_OVERWEIGHT(figure_id, timelist, overweightlist);
        }
    }
    var url = "/overweight-analysis/getPredictResult";
    webRequest(url, "GET", true, params,successCaller);
}

function  getAndshowPredictUDFResult(figure_id, current_dialog, params) {

    function successCaller(message) {
        console.log(message);
        current_dialog.button('reset').dequeue();
        var status = message["status"];
        if(status != 0){
            $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/warning.png'/>");
            showTransientDialog(message["msg"]);
            return;
        }else{
            var timelist = message["data"]["timelist"];
            var overweightlist = message["data"]["overweightlist"];
            showPredictUDFResultChart_OVERWEIGHT(figure_id, timelist, overweightlist);
        }
    }
    var url = "/overweight-analysis/getUDFPredictResult";
    webRequest(url, "GET", true, params, successCaller);
}

function updateDropdownListTrainFile(){
    $("#train_file_selected").empty();
    var url = "/overweight-analysis/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "trainfile"});
    var options ="<option value=\'\' disabled selected>请选择训练文件</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key + "</option>";
        }
    }
    $("#train_file_selected").append(options);
    $("#train_file_selected").selectpicker('refresh');
    // $("#train_file_selected").on('shown.bs.select',function(e){
    //      console.log('展开');
    // })

}

function updateDropdownListTestFile(){
    $("#test_file_selected").empty();
    var url = "/overweight-analysis/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "testfile"});
    var options ="<option value=\'\' disabled selected>请选择预测文件</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key + "</option>";
        }
    }
    $("#test_file_selected").append(options);
    $("#test_file_selected").selectpicker('refresh');
}

function updateDropdownListTrainModel(){
    $("#train_model_selected").empty();
    var url = "/overweight-analysis/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "trainmodel"});
    var options ="<option value=\'\' disabled selected>请选择训练模型</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key + "</option>";
        }
    }
    $("#train_model_selected").append(options);
    $("#train_model_selected").selectpicker('refresh');
}

function updateDropdownListSavedModel(){
    $("#test_model_selected").empty();
    var url = "/overweight-analysis/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "savedmodel"});
    var options ="<option value=\'\' disabled selected>请选择预测模型</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key + "</option>";
        }
    }
    $("#test_model_selected").append(options);
    $("#test_model_selected").selectpicker('refresh');
}

function updateDropdownListEvaluateFile(){
    $("#evaluate_file_selected").empty();
    var url = "/overweight-analysis/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "evaluatefile"});
    var options ="<option value=\'\' disabled selected>请选择验证文件</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key + "</option>";
        }
    }
    $("#evaluate_file_selected").append(options);
    $("#evaluate_file_selected").selectpicker('refresh');
}

function updateDropdownListEvaluateModel(){
    $("#evaluate_model_selected").empty();
    var url = "/overweight-analysis/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "savedmodel"});
    var options ="<option value=\'\' disabled selected>请选择验证模型</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key + "</option>";
        }
    }
    $("#evaluate_model_selected").append(options);
    $("#evaluate_model_selected").selectpicker('refresh');
}

// function updateDropdownListUdfTrainModel(){
//     $("#udf_train_model_selected").empty();
//     var url = "/overweight-analysis/dropdown";
//     var response = webRequest(url, "GET", false, {"type" : "trainmodel"});
//     var options ="<option value=\'\' disabled selected>请选择训练模型</option>"
//     if(response!=null && response.status==0){
//         var data = response.data;
//         for(var key in data){
//             options = options + "<option>" + key + "</option>";
//         }
//     }
//     $("#udf_train_model_selected").append(options);
//     $("#udf_train_model_selected").selectpicker('refresh');
// }

// function updateDropdownListUdfEvaluateModel(){
//     $("#udf_evaluate_model_selected").empty();
//     var url = "/overweight-analysis/dropdown";
//     var response = webRequest(url, "GET", false, {"type" : "savedmodel"});
//     var options ="<option value=\'\' disabled selected>请选择验证模型</option>"
//     if(response!=null && response.status==0){
//         var data = response.data;
//         for(var key in data){
//             options = options + "<option>" + key + "</option>";
//         }
//     }
//     $("#udf_evaluate_model_selected").append(options);
//     $("#udf_evaluate_model_selected").selectpicker('refresh');
// }

// function updateDropdownListTrainBridge(){
//     $("#train_bridge_selected").empty();
//     var url = "/overweight-analysis/udf_bridge_dropdown";
//     var response = webRequest(url, "GET", false, {});
//     var options = "<option value='' disabled selected>请选择分析的桥梁</option>";
//     if(response != null && response.status==0){
//         var data = response.data;
//         for(var key in data){
//             options = options + "<option>" + key +"</option>";
//         }
//     }
//     $("#train_bridge_selected").append(options);
//     $("#train_bridge_selected").selectpicker('refresh');
// }

function updateDropdownListTrainBridge(){
    $("#train_bridge_selected").empty();
    var url = "/overweight-analysis/update_bridge_dropdown";
    var response = webRequest(url, "GET", false, {});
    var options = "<option value='' disabled selected>请选择分析的桥梁</option>";
    if(response != null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key +"</option>";
        }
    }
    $("#train_bridge_selected").append(options);
    $("#train_bridge_selected").selectpicker('refresh');
}
function updateDropdownListEvaluateBridge(){
    $("#evaluate_bridge_selected").empty();
    var url = "/overweight-analysis/update_bridge_dropdown";
    var response = webRequest(url, "GET", false, {});
    var options = "<option value='' disabled selected>请选择分析的桥梁</option>";
    if(response != null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key +"</option>";
        }
    }
    $("#evaluate_bridge_selected").append(options);
    $("#evaluate_bridge_selected").selectpicker('refresh');
}
function updateDropdownListTestBridge(){
    $("#test_bridge_selected").empty();
    var url = "/overweight-analysis/update_bridge_dropdown";
    var response = webRequest(url, "GET", false, {});
    var options = "<option value='' disabled selected>请选择分析的桥梁</option>";
    if(response != null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key +"</option>";
        }
    }
    $("#test_bridge_selected").append(options);
    $("#test_bridge_selected").selectpicker('refresh');
}

// function updateDropdownListUdfEvaluateBridge(){
//     $("#evaluate_bridge_selected").empty();
//     var url = "/overweight-analysis/udf_bridge_dropdown";
//     var response = webRequest(url, "GET", false, {});
//     var options = "<option value='' disabled selected>请选择分析的桥梁</option>";
//     if(response != null && response.status==0){
//         var data = response.data;
//         for(var key in data){
//             options = options + "<option>" + key +"</option>";
//         }
//     }
//     $("#evaluate_bridge_selected").append(options);
//     $("#evaluate_bridge_selected").selectpicker('refresh');
// }

// function updateDropdownListUdfTestModel(){
//     $("#udf_test_model_selected").empty();
//     var url = "/overweight-analysis/dropdown";
//     var response = webRequest(url, "GET", false, {"type" : "savedmodel"});
//     var options ="<option value=\'\' disabled selected>请选择预测模型</option>"
//     if(response!=null && response.status==0){
//         var data = response.data;
//         for(var key in data){
//             options = options + "<option>" + key + "</option>";
//         }
//     }
//     $("#udf_test_model_selected").append(options);
//     $("#udf_test_model_selected").selectpicker('refresh');
// }

// function updateDropdownListUdfTestBridge(){
//     $("#test_bridge_selected").empty();
//     var url = "/overweight-analysis/udf_bridge_dropdown";
//     var response = webRequest(url, "GET", false, {});
//     var options = "<option value='' disabled selected>请选择分析的桥梁</option>";
//     if(response != null && response.status==0){
//         var data = response.data;
//         for(var key in data){
//             options = options + "<option>" + key +"</option>";
//         }
//     }
//     $("#test_bridge_selected").append(options);
//     $("#test_bridge_selected").selectpicker('refresh');
// }
//初始化
$(function () {
    // $("#train_file_selected").selectpicker({
    //     noneSelectedText: "请选择训练数据"
    // });
    //
    // $("#train_model_selected").selectpicker({
    //     noneSelectedText: "请选择训练模型"
    // });

    // var url = "/overweight-analysis/dropdown";
    // var response = webRequest(url, "GET", false, {"type" : "trainfile"});
    // var options ="<option value=\'\' disabled selected>请选择训练文件</option>"
    // if(response!=null && response.status==0){
    //     var data = response.data;
    //     for(var key in data){
    //         options = options + "<option>" + key + "</option>";
    //     }
    // }
    // $("#train_file_selected").append(options);

    updateDropdownListTrainFile();
    updateDropdownListTestFile()
    updateDropdownListTrainModel();
    updateDropdownListSavedModel();
    updateDropdownListEvaluateFile();
    updateDropdownListEvaluateModel();
    updateDropdownListTrainBridge();
    updateDropdownListEvaluateBridge();
    updateDropdownListTestBridge();

   // updateDropdownListUdfTrainModel();
   // updateDropdownListUdfTrainBridge();
   // updateDropdownListUdfEvaluateModel();
   // updateDropdownListUdfEvaluateBridge();
   // updateDropdownListUdfTestBridge();
   // updateDropdownListUdfTestModel();
    //$("#train_file_selected").on('shown.bs.select', updateDropdownListTrainFile());
    // $("#train_file_selected").click(function () {
    //     var url = "/overweight-analysis/dropdown";
    //     var response = webRequest(url, "GET", false, {"type" : "trainfile"});
    //     var options ="<option value=\'\' disabled selected>请选择训练文件</option>"
    //     if(response!=null && response.status==0){
    //         var data = response.data;
    //         for(var key in data){
    //             options = options + "<option>" + key + "</option>";
    //         }
    //     }
    //     $("#train_file_selected").empty();
    //     $("#train_file_selected").append(options);
    //     $('#train_file_selected').selectpicker('refresh');
    // })

    // $("#description_model").click(function(){
    //     var popoverEl = $("#description_model");
    //     popoverEl.popover("destroy");
    //     //var content = "贝叶斯超级厉害的<br/>超级超级厉害的<br/>" +
    //     //            "没有什么模型比贝叶斯更厉害了<br/>关你什么事<br/>";
    //     content = "";
    //     popoverEl.attr("data-content", content);
    //     popoverEl.popover("show");
    //
    // });

    var data_format_str = 'yyyy-MM-dd HH:mm:ss';
    var current_time = new Date().format(data_format_str);
    $('#train_begin_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#train_end_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#train_begin_time').val(current_time);
    $('#train_end_time').val(current_time);

    $('#evaluate_begin_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#evaluate_end_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#evaluate_begin_time').val(current_time);
    $('#evaluate_end_time').val(current_time);

    $('#test_begin_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#test_end_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#test_begin_time').val(current_time);
    $('#test_end_time').val(current_time);


    $("#description_train_dataformat").click(function(){
        var popoverEl = $("#description_train_dataformat");
        popoverEl.popover("destroy");
        var content = "{<br/>"+
            "feature1,feature2,feature3,label<br/>"+
            "}";
        popoverEl.attr("data-content", content);
        popoverEl.popover("show");

    });

    $("#description_evaluate_dataformat").click(function(){
        var popoverEl = $("#description_evaluate_dataformat");
        popoverEl.popover("destroy");
        var content = "{<br/>"+
            "feature1,feature2,feature3,label<br/>"+
            "}";
        popoverEl.attr("data-content", content);
        popoverEl.popover("show");

    });

    $("#description_test_dataformat").click(function(){
        var popoverEl = $("#description_test_dataformat");
        popoverEl.popover("destroy");
        var content = "{<br/>"+
            "feature1,feature2,feature3<br/>"+
            "}";
        popoverEl.attr("data-content", content);
        popoverEl.popover("show");

    });

    $("#description_modelformat").click(function(){
        var popoverEl = $("#description_modelformat");
        popoverEl.popover("destroy");
        var content = "{<br/>"+
            "python文件<br/>"+
            "param1 : 训练文件路径<br/>"+
            "param2 : 模型保存路径<br/>"+
            "}";
        popoverEl.attr("data-content", content);
        popoverEl.popover("show");

    });


    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    $(document).ajaxSend(function(e, xhr, options) {
        xhr.setRequestHeader(header, token);
    });

    $("#trainfile_upload").fileinput({
        allowedFileExtensions: ['csv'],
        uploadUrl: "overweight-analysis/trainfileupload",
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
        updateDropdownListTrainFile();
    }).on('fileuploaderror', function (event, data, msg) {
        var response = data.response;
        console.log("data");
        console.log(data);
        var msg = "仅支持csv且单文件大小不超过50MB！";
        if(response!=null && response.msg!="") msg = response.msg;
        console(msg);
        showTransientDialog(msg);
    });

    $("#trainmodel_upload").fileinput({
        allowedFileExtensions: ['py'],
        uploadUrl: "overweight-analysis/trainmodelupload",
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
        updateDropdownListTrainModel();
        //updateDropdownListUdfTrainModel();
    }).on('fileuploaderror', function (event, data, msg) {
        var response = data.response;
        console.log("data");
        console.log(data);
        var msg = "仅支持py且单文件大小不超过50MB！";
        if(response!=null && response.msg!="") msg = response.msg;
        console(msg);
        showTransientDialog(msg);
    });

    $("#testfile_upload").fileinput({
        allowedFileExtensions: ['csv'],
        uploadUrl: "overweight-analysis/testfileupload",
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
        updateDropdownListTestFile();
    }).on('fileuploaderror', function (event, data, msg) {
        var response = data.response;
        console.log("data");
        console.log(data);
        var msg = "仅支持csv且单文件大小不超过50MB！";
        if(response!=null && response.msg!="") msg = response.msg;
        console(msg);
        showTransientDialog(msg);
    });

    // $("#train_start").click(function () {           //获取id为run_train的元素
    //     var url = "/overweight-analysis/test";
    //     var params = {};
    //     var response = webRequest(url, "GET", true, params);  //这里用异步的话，response接收到的为空
    //     if (response!=null && response.status == 0) {
    //         var data = response.data;
    //         var result = data['result'];
    //         if (result == 'success') {
    //             showTransientDialog('训练完成!')
    //         } else {
    //             showTransientDialog('训练失败！')
    //         }
    //     } else {
    //         showTransientDialog('调用失败！')
    //     }
    // });

    $("#evaluatefile_upload").fileinput({
        allowedFileExtensions: ['csv'],
        uploadUrl: "overweight-analysis/evaluatefileupload",
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
        updateDropdownListEvaluateFile();
    }).on('fileuploaderror', function (event, data, msg) {
        var response = data.response;
        console.log("data");
        console.log(data);
        var msg = "仅支持csv且单文件大小不超过50MB！";
        if(response!=null && response.msg!="") msg = response.msg;
        console.log(msg);
        showTransientDialog(msg);
    });

    $("#train_start").click(function () {
        var train_file = $("#train_file_selected").val();
        var train_model = $("#train_model_selected").val();
        var train_bridge = $("#train_bridge_selected").val();
        var saved_model = $("#saved_model").val();
        //console.log(saved_model);
        if (train_file == null){
            showTransientDialog("请选择训练文件");
            //showDialog("请选择训练文件");
            return;
        }
        if(train_model == null){
            showTransientDialog("请选择训练模型");
            //showDialog("请选择训练模型");
            return;
        }
        if(train_bridge == null){
            showTransientDialog("请选择分析桥梁");
            //showDialog("请选择训练模型");
            return;
        }
        if(!saved_model){
            showTransientDialog("请输入保存模型名称");
            //showDialog("请输入保存模型名称");
            return;
        }
        var begin_time = $("#train_begin_time").val();
        var end_time = $("#train_end_time").val();
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
            url: "/overweight-analysis/train",
            type: "POST",
            async: true,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "trainfile" : train_file,
                "trainmodel" : train_model,
                "savedmodel" : saved_model,
                "bridge" : train_bridge,
                "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                "endtime" : new Date(end_time).format("yyyyMMddHHmmss")
            }),
            dataType: "json",
            beforeSend: function () {
                $("#train_start").text('训练中...');
                $("#train_process").removeAttr("value");
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
                    showDialog("训练完成")
                } else if(result == 'failed'){
                    showTransientDialog('训练失败！')
                } else{
                    showTransientDialog('没有符合条件的数据！');
                }
            },
            complete:function () {
                $("#train_start").text("开始训练");
                $("#train_process").attr("value", "100");
                updateDropdownListSavedModel();
                updateDropdownListEvaluateModel();


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

    // $("#test_start").click(function () {
    //     var test_file = $("#test_file_selected").val();
    //     var test_model = $("#test_model_selected").val();
    //     //console.log(saved_model);
    //     if (test_file == null){
    //         showTransientDialog("请选择预测文件");
    //         //showDialog("请选择训练文件");
    //         return;
    //     }
    //     if(test_model == null){
    //         showTransientDialog("请选择预测模型");
    //         //showDialog("请选择训练模型");
    //         return;
    //     }
    //
    //     var response = null;
    //     var d = null;
    //     var token = $("meta[name='_csrf']").attr("content");
    //     var header = $("meta[name='_csrf_header']").attr("content");
    //     $(document).ajaxSend(function(e, xhr, options) {
    //         xhr.setRequestHeader(header, token);
    //     });
    //     $.ajax({
    //         url: "/overweight-analysis/test",
    //         type: "POST",
    //         async: true,
    //         contentType: "application/json; charset=utf-8",
    //         data: JSON.stringify({
    //             "testfile" : test_file,
    //             "testmodel" : test_model
    //         }),
    //         dataType: "json",
    //         beforeSend: function () {
    //             $("#test_start").text('预测中...');
    //             $("#test_process").removeAttr("value");
    //             // var content = '' +
    //             //     ' <img alt="loadding" src="/assets/img/loading.gif" /> \
    //             //     '
    //             // d = dialog({
    //             //     content: content
    //             // });
    //             // d.showModal();
    //         },
    //         success: function(response) {
    //             var data = response.data;
    //             var result = data['result'];
    //             if (result == 'success') {
    //                 //showTransientDialog('训练完成!')
    //                 //showModalDialog("提示", "训练完成")
    //                 //showAlertDialog('训练完成')
    //                 showDialog("预测完成")
    //             } else {
    //                 showTransientDialog('预测失败！')
    //             }
    //         },
    //         complete:function () {
    //             $("#test_start").text("开始预测");
    //             $("#test_process").attr("value", "100");
    //
    //             // if (d != null) {
    //             //     d.close().remove();
    //             // }
    //         },
    //         error: function(response) {
    //             //showTransientDialog('调用失败！')
    //             alert("提交任务失败");
    //         }
    //
    //     });
    // });

    // $("#evaluate_start").click(function () {
    //     var evaluate_file = $("#evaluate_file_selected").val();
    //     var evaluate_model = $("#evaluate_model_selected").val();
    //     //console.log(saved_model);
    //     if (evaluate_file == null){
    //         showTransientDialog("请选择测试文件");
    //         //showDialog("请选择训练文件");
    //         return;
    //     }
    //     if(evaluate_model == null){
    //         showTransientDialog("请选择验证模型");
    //         //showDialog("请选择训练模型");
    //         return;
    //     }
    //
    //     var response = null;
    //     var d = null;
    //     var token = $("meta[name='_csrf']").attr("content");
    //     var header = $("meta[name='_csrf_header']").attr("content");
    //     $(document).ajaxSend(function(e, xhr, options) {
    //         xhr.setRequestHeader(header, token);
    //     });
    //     $.ajax({
    //         url: "/overweight-analysis/evaluate",
    //         type: "POST",
    //         async: true,
    //         contentType: "application/json; charset=utf-8",
    //         data: JSON.stringify({
    //             "evaluatefile" : evaluate_file,
    //             "evaluatemodel" : evaluate_model
    //         }),
    //         dataType: "json",
    //         beforeSend: function () {
    //             $("#evaluate_start").text('验证中...');
    //             $("#evaluate_process").removeAttr("value");
    //             // var content = '' +
    //             //     ' <img alt="loadding" src="/assets/img/loading.gif" /> \
    //             //     '
    //             // d = dialog({
    //             //     content: content
    //             // });
    //             // d.showModal();
    //         },
    //         success: function(response) {
    //             var data = response.data;
    //             var result = data['result'];
    //             if (result == 'success') {
    //                 //showTransientDialog('训练完成!')
    //                 //showModalDialog("提示", "训练完成")
    //                 //showAlertDialog('训练完成')
    //                 var p = data['precision'];
    //                 var r = data['recall'];
    //                 var f1 = data['f1'];
    //                 // var p = 0.9;
    //                 // var r = 0.9;
    //                 // var f1 = 0.9;
    //                 var content = "验证完成！<br/> 准确率为"+p+"<br/>召回率为"+r + "</br>f1值为"+f1;
    //                 showDialog(content);
    //             } else {
    //                 showTransientDialog('验证失败！')
    //             }
    //         },
    //         complete:function () {
    //             $("#evaluate_start").text("模型验证");
    //             $("#evaluate_process").attr("value", "100");
    //
    //             // if (d != null) {
    //             //     d.close().remove();
    //             // }
    //         },
    //         error: function(response) {
    //             //showTransientDialog('调用失败！')
    //             alert("提交任务失败");
    //         }
    //
    //     });
    // });

  //  $("#train_file_selected").onclick(updateDropdownListTrainFile())
  //   $("#result_overweight").click(function () {
  //       var test_file = $("#test_file_selected").val();
  //       var test_model = $("#test_model_selected").val();
  //       if(test_file == null){
  //           showTransientDialog("请选择预测文件");
  //           return;
  //       }
  //       if(test_model == null){
  //           showTransientDialog("请选择预测模型");
  //           return;
  //       }
  //
  //       var token = $("meta[name='_csrf']").attr("content");
  //       var header = $("meta[name='_csrf_header']").attr("content");
  //       $(document).ajaxSend(function(e, xhr, options) {
  //           xhr.setRequestHeader(header, token);
  //       });
  //       var figure_id = "show_result_figure";
  //       $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/loading.gif'/>");
  //       $(this).button("loading").delay(1000).queue(function () {
  //           var param ={
  //                   "testfile" : test_file,
  //                   "testmodel" : test_model
  //               }
  //           var current_dialog = $(this);
  //           getAndshowPredictResult(figure_id, current_dialog, param);
  //       })
  //       // var response = null;
  //       // var param ={
  //       //     "testfile" : JSON.stringify(test_file),
  //       //     "testmodel" : JSON.stringify(test_model)
  //       // }
  //
  //       // $.ajax({
  //       //     url: "/overweight-analysis/result_show",
  //       //     type: "GET",
  //       //     async: true,
  //       //     contentType: "application/json; charset=utf-8",
  //       //     data: JSON.stringify({
  //       //         "testfile" : test_file,
  //       //         "testmodel" : test_model
  //       //     }),
  //       //     dataType: "json",
  //       //     beforeSend: function () {
  //       //
  //       //     },
  //       //     success: function(response) {
  //       //
  //       //     },
  //       //     complete:function () {
  //       //
  //       //     },
  //       //     error: function(response) {
  //       //         alert("提交任务失败");
  //       //     }
  //       // });
  //   });

    // $("#udf_train_start").click(function () {
    //     var train_model = $("#udf_train_model_selected").val();
    //     var bridge = $("#train_bridge_selected").val();
    //     var saved_model = $("#udf_saved_model").val();
    //
    //     if(train_model == null){
    //         showTransientDialog("请选择训练模型");
    //         //showDialog("请选择训练模型");
    //         return;
    //     }
    //     if(bridge == null){
    //         showTransientDialog("请选择分析桥梁");
    //         return;
    //     }
    //     if(!saved_model){
    //         showTransientDialog("请输入保存模型名称");
    //         //showDialog("请输入保存模型名称");
    //         return;
    //     }
    //     var begin_time = $("#train_udf_begin_time").val();
    //     var end_time = $("#train_udf_end_time").val();
    //     if(begin_time >= end_time){
    //         showTransientDialog("开始时间必须小于截止时间");
    //         return;
    //     }
    //     var token = $("meta[name='_csrf']").attr("content");
    //     var header = $("meta[name='_csrf_header']").attr("content");
    //     $(document).ajaxSend(function(e, xhr, options) {
    //         xhr.setRequestHeader(header, token);
    //     });
    //
    //     $.ajax({
    //         url: "/overweight-analysis/train-udf",
    //         type: "POST",
    //         async: true,
    //         contentType: "application/json; charset=utf-8",
    //         data: JSON.stringify({
    //             "bridge" : bridge,
    //             "trainmodel" : train_model,
    //             "savedmodel" : saved_model,
    //             "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
    //             "endtime" : new Date(end_time).format("yyyyMMddHHmmss")
    //         }),
    //         dataType: "json",
    //         beforeSend: function () {
    //             $("#udf_train_start").text('训练中...');
    //             $("#udf_train_process").removeAttr("value");
    //             // var content = '' +
    //             //     ' <img alt="loadding" src="/assets/img/loading.gif" /> \
    //             //     '
    //             // d = dialog({
    //             //     content: content
    //             // });
    //             // d.showModal();
    //         },
    //         success: function(response) {
    //             var data = response.data;
    //             var result = data['result'];
    //             if (result == 'success') {
    //                 //showTransientDialog('训练完成!')
    //                 //showModalDialog("提示", "训练完成")
    //                 //showAlertDialog('训练完成')
    //                 showDialog("训练完成")
    //             } else if(result == 'failed') {
    //                 showTransientDialog('训练失败！')
    //             } else{
    //                 showTransientDialog("没有符合条件的数据！")
    //             }
    //         },
    //         complete:function () {
    //             $("#udf_train_start").text("开始训练");
    //             $("#udf_train_process").attr("value", "100");
    //             updateDropdownListSavedModel();
    //             updateDropdownListEvaluateModel();
    //             updateDropdownListUdfEvaluateModel();
    //             updateDropdownListUdfTestModel();
    //             // if (d != null) {
    //             //     d.close().remove();
    //             // }
    //         },
    //         error: function(response) {
    //             //showTransientDialog('调用失败！')
    //             alert("提交任务失败");
    //         }
    //
    //     });
    // })

    $("#evaluate_start").click(function () {
        var evaluate_file = $("#evaluate_file_selected").val();
        var evaluate_model = $("#evaluate_model_selected").val();
        var bridge = $("#evaluate_bridge_selected").val();

        if(evaluate_file == null){
            showTransientDialog("请选择验证文件");
            return;
        }
        if(evaluate_model == null){
            showTransientDialog("请选择验证模型");
            //showDialog("请选择训练模型");
            return;
        }
        if(bridge == null){
            showTransientDialog("请选择分析桥梁");
            return;
        }
        var begin_time = $("#evaluate_begin_time").val();
        var end_time = $("#evaluate_end_time").val();
        if(begin_time >= end_time){
            showTransientDialog("开始时间必须小于截止时间");
            return;
        }
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        $(document).ajaxSend(function(e, xhr, options) {
            xhr.setRequestHeader(header, token);
        });
        $.ajax({
            url: "/overweight-analysis/evaluate",
            type: "POST",
            async: true,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "evaluatefile" : evaluate_file,
                "bridge" : bridge,
                "evaluatemodel" : evaluate_model,
                "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                "endtime" : new Date(end_time).format("yyyyMMddHHmmss")
            }),
            dataType: "json",
            beforeSend: function () {
                $("#evaluate_start").text('验证中...');
                $("#evaluate_process").removeAttr("value");
            },
            success: function(response) {
                var data = response.data;
                var result = data['result'];
                if(result == 'success'){
                    var p = data['precision'];
                    var r = data['recall'];
                    var f1 = data['f1'];
                    var content = "验证完成！<br/> 准确率为"+p+"<br/>召回率为"+r + "</br>f1值为"+f1;
                    showDialog(content);
                }else if(result == 'failed'){
                    showTransientDialog('训练失败！')
                }else{
                    showTransientDialog("没有符合条件的数据！")
                }
            },
            complete:function () {
                $("#evaluate_start").text("验证模型");
                $("#evaluate_process").attr("value", "100");
                //updateDropdownListSavedModel();
                //updateDropdownListEvaluateModel();
                //updateDropdownListUdfEvaluateModel();
                //updateDropdownListUdfTestModel();
            },
            error: function(response) {
                alert("提交任务失败");
            }

        });
    })

    $("#test_start").click(function () {
        var test_file = $("#test_file_selected").val();
        var test_model = $("#test_model_selected").val();
        var bridge = $("#test_bridge_selected").val();

        if(test_file == null){
            showTransientDialog("请选择预测文件");
            return;
        }
        if(test_model == null){
            showTransientDialog("请选择预测模型");
            //showDialog("请选择训练模型");
            return;
        }
        if(bridge == null){
            showTransientDialog("请选择分析桥梁");
            return;
        }
        var begin_time = $("#test_begin_time").val();
        var end_time = $("#test_end_time").val();
        if(begin_time >= end_time){
            showTransientDialog("开始时间必须小于截止时间");
            return;
        }
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        $(document).ajaxSend(function(e, xhr, options) {
            xhr.setRequestHeader(header, token);
        });

        $.ajax({
            url: "/overweight-analysis/test",
            type: "POST",
            async: true,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "testfile" : test_file,
                "bridge" : bridge,
                "testmodel" : test_model,
                "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                "endtime" : new Date(end_time).format("yyyyMMddHHmmss")
            }),
            dataType: "json",
            beforeSend: function () {
                $("#test_start").text('预测中...');
                $("#test_process").removeAttr("value");
            },
            success: function(response) {
                var data = response.data;
                var result = data['result'];
                if (result == 'success') {
                    showTransientDialog("预测完成");
                } else if(result == 'failed'){
                    showTransientDialog('预测失败！');
                } else{
                    showTransientDialog('没有符合条件的数据!');
                }

            },
            complete:function () {
                $("#test_start").text("开始预测");
                $("#test_process").attr("value", "100");
            },
            error: function(response) {
                alert("提交任务失败");
            }

        });
    })

    $("#result_overweight").click(function () {
        var test_file = $("#test_file_selected").val();
        var test_model = $("#test_model_selected").val();
        var bridge = $("#test_bridge_selected").val();
        var begin_time = $("#test_begin_time").val();
        var end_time = $("#test_end_time").val();

        if(test_file == null){
            showTransientDialog("请选择预测文件");
            return;
        }
        if(test_model == null){
            showTransientDialog("请选择预测模型");
            //showDialog("请选择训练模型");
            return;
        }
        if(bridge == null){
            showTransientDialog("请选择分析桥梁");
            return;
        }
        if(begin_time >= end_time){
            showTransientDialog("开始时间必须小于截止时间");
            return;
        }

        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        $(document).ajaxSend(function(e, xhr, options) {
            xhr.setRequestHeader(header, token);
        });

        var figure_id = "show_result_figure";
        $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/loading.gif'/>");
        $(this).button("loading").delay(1000).queue(function () {
            var param ={
                "testfile" : test_file,
                "testmodel" : test_model,
                "bridge" : bridge,
                "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                "endtime" : new Date(end_time).format('yyyyMMddHHmmss')
            }
            var current_dialog = $(this);
            getAndshowPredictResult(figure_id, current_dialog, param);
        })
    })
    // var stringTime = "2018-10-23 16:13:30";
    // console.log(stringTime.substring(0,14) + "00:00");
    // var timestamp = Date.parse(new Date(stringTime));
    // console.log(timestamp);
    // console.log(timestamp/1000);
    //
    // var counttt = new Map();
    // counttt.set("a",1);
    // counttt.set("b",2);
    // console.log(counttt);
    //
    // counttt.forEach(function (value, key, map) {
    //     console.log(value);
    //     console.log(key);
    //})
});
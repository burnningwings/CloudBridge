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

// function getAndshowPredictResult(figure_id, current_dialog, params) {
//     function successCaller(message) {
//         console.log(message)
//         current_dialog.button('reset').dequeue();
//         var status = message["status"];
//         if (status!=0) {
//             $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/warning.png'/>");
//             showTransientDialog(message["msg"]);
//             return;
//         }else{
//             // var data = message["data"]["predictresult"];
//             // console.log(data);
//             // var index = [];
//             // for(var i=0; i<data.length;i++)
//             // {
//             //     index.push(i+1);
//             // }
//             // console.log(index);
//             // showPredictResultChart(figure_id, data, index);
//             var timelist = message["data"]["timelist"];
//             var locationlist = message["data"]["locationlist"];
//             var levellist = message["data"]["levellist"];
//             showPredictUDFResultChart(figure_id, timelist, locationlist, levellist);
//         }
//     }
//     var url = "/damage-detection/getPredictResult";
//     webRequest(url, "GET", true, params,successCaller);
// }

    function  getAndshowPredictResult(figure_id, current_dialog, params) {

    function successCaller(message) {
        console.log(message);
        current_dialog.button('reset').dequeue();
        var status = message["status"];
        if(status != 0){
            $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/warning.png'/>");
            showTransientDialog(message["msg"]);
            return;
        }else{
            // var timelist = message["data"]["timelist"];
            var locationlist = message["data"]["locationlist"];
            var levellist = message["data"]["levellist"];
            var loca_test = message["data"]["loc_test"];
            var lv_test = message["data"]["level_test"];
            showPredictDDResultChart(figure_id, locationlist, levellist,loca_test,lv_test);
        }
    }
    var url = "/damage-detection/getUDFPredictResult";
    webRequest(url, "GET", true, params, successCaller);
}

function updateDropdownListTrainFile(){
    $("#dd_train_file_selected").empty();
    var url = "/damage-detection/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "trainfile"});
    var options ="<option value=\'\' disabled selected>请选择训练文件</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key.substring(0, key.lastIndexOf(".")) + "</option>";
        }
    }
    $("#dd_train_file_selected").append(options);
    $("#dd_train_file_selected").selectpicker('refresh');
    // $("#train_file_selected").on('shown.bs.select',function(e){
    //      console.log('展开');
    // })

}

function updateDropdownListTestFile(){
    $("#dd_test_file_selected").empty();
    var url = "/damage-detection/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "testfile"});
    var options ="<option value=\'\' disabled selected>请选择识别文件</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key.substring(0, key.lastIndexOf(".")) + "</option>";
        }
    }
    $("#dd_test_file_selected").append(options);
    $("#dd_test_file_selected").selectpicker('refresh');
}

function updateDropdownListTrainModel(){
    $("#dd_train_model_selected").empty();
    var url = "/damage-detection/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "trainmodel"});
    var options ="<option value=\'\' disabled selected>请选择训练模型</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key + "</option>";
        }
    }
    $("#dd_train_model_selected").append(options);
    $("#dd_train_model_selected").selectpicker('refresh');
}

function updateDropdownListSavedModel(){
    $("#dd_test_model_selected").empty();
    $("#spy_dd_test_model_selected").empty();
    var url = "/damage-detection/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "savedmodel"});
    var options ="<option value=\'\' disabled selected>请选择识别模型</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key.substring(0, key.lastIndexOf(".")) + "</option>";
        }
    }
    $("#dd_test_model_selected").append(options);
    $("#spy_dd_test_model_selected").append(options);
    $("#dd_test_model_selected").selectpicker('refresh');
    $('#spy_dd_test_model_selected').selectpicker('refresh');
}

function updateDropdownListEvaluateFile(){
    $("#dd_evaluate_file_selected").empty();
    var url = "/damage-detection/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "evaluatefile"});
    var options ="<option value=\'\' disabled selected>请选择验证文件</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key.substring(0, key.lastIndexOf(".")) + "</option>";
        }
    }
    $("#dd_evaluate_file_selected").append(options);
    $("#dd_evaluate_file_selected").selectpicker('refresh');
}

function updateDropdownListEvaluateModel(){
    $("#dd_evaluate_model_selected").empty();
    var url = "/damage-detection/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "savedmodel"});
    var options ="<option value=\'\' disabled selected>请选择验证模型</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key.substring(0, key.lastIndexOf(".")) + "</option>";
        }
    }
    $("#dd_evaluate_model_selected").append(options);
    $("#dd_evaluate_model_selected").selectpicker('refresh');
}

// function updateDropdownListUdfTrainModel(){
//     $("#dd_udf_train_model_selected").empty();
//     var url = "/damage-detection/dropdown";
//     var response = webRequest(url, "GET", false, {"type" : "trainmodel"});
//     var options ="<option value=\'\' disabled selected>请选择训练模型</option>"
//     if(response!=null && response.status==0){
//         var data = response.data;
//         for(var key in data){
//             options = options + "<option>" + key + "</option>";
//         }
//     }
//     $("#dd_udf_train_model_selected").append(options);
//     $("#dd_udf_train_model_selected").selectpicker('refresh');
// }

function updateDropdownListTrainBridge(){
    $("#dd_train_bridge_selected").empty();
    var url = "/damage-detection/udf_bridge_dropdown";
    var response = webRequest(url, "GET", false, {});
    var options = "<option value='' disabled selected>请选择分析的桥梁</option>";
    if(response != null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key +"</option>";
        }
    }
    $("#dd_train_bridge_selected").append(options);
    $("#dd_train_bridge_selected").selectpicker('refresh');
}

// function updateDropdownListUdfEvaluateModel(){
//     $("#dd_udf_evaluate_model_selected").empty();
//     var url = "/damage-detection/dropdown";
//     var response = webRequest(url, "GET", false, {"type" : "savedmodel"});
//     var options ="<option value=\'\' disabled selected>请选择验证模型</option>"
//     if(response!=null && response.status==0){
//         var data = response.data;
//         for(var key in data){
//             options = options + "<option>" + key + "</option>";
//         }
//     }
//     $("#dd_udf_evaluate_model_selected").append(options);
//     $("#dd_udf_evaluate_model_selected").selectpicker('refresh');
// }

function updateDropdownListEvaluateBridge(){
    $("#dd_evaluate_bridge_selected").empty();
    var url = "/damage-detection/udf_bridge_dropdown";
    var response = webRequest(url, "GET", false, {});
    var options = "<option value='' disabled selected>请选择分析的桥梁</option>";
    if(response != null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key +"</option>";
        }
    }
    $("#dd_evaluate_bridge_selected").append(options);
    $("#dd_evaluate_bridge_selected").selectpicker('refresh');
}

// function updateDropdownListUdfTestModel(){
//     $("#dd_udf_test_model_selected").empty();
//     var url = "/damage-detection/dropdown";
//     var response = webRequest(url, "GET", false, {"type" : "savedmodel"});
//     var options ="<option value=\'\' disabled selected>请选择识别模型</option>"
//     if(response!=null && response.status==0){
//         var data = response.data;
//         for(var key in data){
//             options = options + "<option>" + key + "</option>";
//         }
//     }
//     $("#dd_udf_test_model_selected").append(options);
//     $("#dd_udf_test_model_selected").selectpicker('refresh');
// }

function updateDropdownListTestBridge(){
    $("#dd_test_bridge_selected").empty();
    $('#spy_dd_test_bridge_selected').empty();
    var url = "/damage-detection/udf_bridge_dropdown";
    var response = webRequest(url, "GET", false, {});
    var options = "<option value='' disabled selected>请选择分析的桥梁</option>";
    if(response != null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key +"</option>";
        }
    }
    $("#dd_test_bridge_selected").append(options);
    $('#spy_dd_test_bridge_selected').append(options);
    $("#dd_test_bridge_selected").selectpicker('refresh');
    $('#spy_dd_test_bridge_selected').selectpicker('refresh');
}

function updateDropdownListTrainLabel(){
    $("#dd_train_label_selected").empty();
    var url = "/damage-detection/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "trainLabel"});
    var options ="<option value=\'\' disabled selected>请选择测试标签</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key.substring(0, key.lastIndexOf(".")) + "</option>";
        }
    }
    $("#dd_train_label_selected").append(options);
    $("#dd_train_label_selected").selectpicker('refresh');
}

function updateDropdownListEvaluateLabel(){
    $("#dd_evaluate_label_selected").empty();
    var url = "/damage-detection/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "evaluateLabel"});
    var options ="<option value=\'\' disabled selected>请选择测试标签</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key.substring(0, key.lastIndexOf(".")) + "</option>";
        }
    }
    $("#dd_evaluate_label_selected").append(options);
    $("#dd_evaluate_label_selected").selectpicker('refresh');
}

function updateDropdownListTrainModelType(){
    $("#dd_train_modeltype_selected").empty();
    var options ="<option value=\'\' disabled selected>请选择算法模型</option>"
    var single = {
        "AttBiLSTM": "基于注意力机制和双向长短时记忆网络的桥梁损伤识别算法",
        "1dcnn": "基于一维卷积神经网络的桥梁损伤识别算法",
        "HCG": "基于分层卷积神经网络和门控循环单元的桥梁损伤识别算法"
    }

    for(var key in single){
        options = options + "<option value='" + key + "'>" + single[key] + "</option>";
    }

    $("#dd_train_modeltype_selected").append(options);
    $(".selectpicker").selectpicker('refresh');
}
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
    updateDropdownListTestFile();
    updateDropdownListTrainModel();
    updateDropdownListSavedModel();
    updateDropdownListEvaluateFile();
    updateDropdownListEvaluateModel();
    updateDropdownListTrainBridge();
    updateDropdownListEvaluateBridge();
    updateDropdownListTestBridge();
    // updateDropdownListTrainLabel();
    // updateDropdownListEvaluateLabel();
    updateDropdownListTrainModelType()

    // updateDropdownListUdfTrainModel();
    // updateDropdownListUdfTrainBridge();
    // updateDropdownListUdfEvaluateModel();
    // updateDropdownListUdfEvaluateBridge();
    // updateDropdownListUdfTestModel();
    // updateDropdownListUdfTestBridge();

    var data_format_str = 'yyyy-MM-dd HH:mm:ss';
    var current_time = new Date().format(data_format_str);
    var t_begin_train = new Date(2014,05,14,00,00,00).format(data_format_str);
    var t_end_train = new Date(2018,05,12,18,00,00).format(data_format_str);
    // $('#dd_train_begin_time').datetimepicker({
    //     timeFormat: "HH:mm:ss",
    //     dateFormat: "yy-mm-dd"
    // });
    // $('#dd_train_end_time').datetimepicker({
    //     timeFormat: "HH:mm:ss",
    //     dateFormat: "yy-mm-dd"
    // });
    // $('#dd_train_begin_time').val(t_begin_train);
    // $('#dd_train_end_time').val(t_end_train);
    //
    // $('#dd_evaluate_begin_time').datetimepicker({
    //     timeFormat: "HH:mm:ss",
    //     dateFormat: "yy-mm-dd"
    // });
    // $('#dd_evaluate_end_time').datetimepicker({
    //     timeFormat: "HH:mm:ss",
    //     dateFormat: "yy-mm-dd"
    // });
    // var t_begin_evaluate = new Date(2018,05,13,00,00,00).format(data_format_str);
    // var t_end_evaluate = new Date(2018,08,10,18,00,00).format(data_format_str);
    // $('#dd_evaluate_begin_time').val(t_begin_evaluate);
    // $('#dd_evaluate_end_time').val(t_end_evaluate);

    $('#dd_test_begin_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    var t_begin_test = new Date(2018,08,11,00,00,00).format(data_format_str);
    var t_end_test = new Date(2018,09,10,18,00,00).format(data_format_str);
    $('#dd_test_end_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#dd_test_begin_time').val(t_begin_test);
    $('#dd_test_end_time').val(t_end_test);

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

    $("#dd_description_train_dataformat").click(function(){
        // var popoverEl = $("#dd_description_train_dataformat");
        // popoverEl.popover("destroy");
        // // var content = "{<br/>"+
        // //     "feature1,feature2,feature3,label<br/>"+
        // //     "}";
        // var content = "data1 : float<br/>" + "data2 : float<br/>" + "data3 : float<br/>" + "data4 : float<br/>" + "data5 : float<br/>"+
        //               "data6 : float<br/>" + "data7 : float<br/>" + "data8 : float<br/>" + "data9 : float<br/>" + "data10 : float<br/>"+
        //               "location : integer<br/>" + "level : integer<br/>" + "bridge : string<br/>" + "time : string";
        // popoverEl.attr("data-content", content);
        // popoverEl.popover("show");
        var popoverEl = $("#dd_description_train_dataformat");
        popoverEl.popover("destroy");
        var str = "s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14,s15,s16,s17,s18,s19,s20,s21,s22,s23,s24,s25,s26,s27,s28,s29,s30,temp,loc,quant\n";
        var url = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
        var link = document.createElement("a");
        link.href = url;
        link.download = 'example_train.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    });

    $("#dd_description_evaluate_dataformat").click(function(){
        // var popoverEl = $("#dd_description_evaluate_dataformat");
        // popoverEl.popover("destroy");
        // // var content = "{<br/>"+
        // //     "feature1,feature2,feature3,label<br/>"+
        // //     "}";
        // var content = "data1 : float<br/>" + "data2 : float<br/>" + "data3 : float<br/>" + "data4 : float<br/>" + "data5 : float<br/>"+
        //     "data6 : float<br/>" + "data7 : float<br/>" + "data8 : float<br/>" + "data9 : float<br/>" + "data10 : float<br/>"+
        //     "location : integer<br/>" + "level : integer<br/>" + "bridge : string<br/>" + "time : string";
        // popoverEl.attr("data-content", content);
        // popoverEl.popover("show");
        var popoverEl = $("#dd_description_evaluate_dataformat");
        popoverEl.popover("destroy");
        var str = "s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14,s15,s16,s17,s18,s19,s20,s21,s22,s23,s24,s25,s26,s27,s28,s29,s30,temp,loc,quant\n";
        var url = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
        var link = document.createElement("a");
        link.href = url;
        link.download = 'example_train.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    });

    $("#dd_description_test_dataformat").click(function(){
        // var popoverEl = $("#dd_description_test_dataformat");
        // popoverEl.popover("destroy");
        // var content = "{<br/>"+
        //     "feature1,feature2,feature3<br/>"+
        //     "}";
        // var content = "data1 : float<br/>" + "data2 : float<br/>" + "data3 : float<br/>" + "data4 : float<br/>" + "data5 : float<br/>"+
        //     "data6 : float<br/>" + "data7 : float<br/>" + "data8 : float<br/>" + "data9 : float<br/>" + "data10 : float<br/>"+
        //     "bridge : string<br/>" + "time : string";
        // popoverEl.attr("data-content", content);
        // popoverEl.popover("show");
        var popoverEl = $("#dd_description_test_dataformat");
        popoverEl.popover("destroy");
        var str = "s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14,s15,s16,s17,s18,s19,s20,s21,s22,s23,s24,s25,s26,s27,s28,s29,s30,temp,loc,quant\n";
        var url = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
        var link = document.createElement("a");
        link.href = url;
        link.download = 'example_train.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    });


    $("#dd_description_modelformat").click(function(){
        var popoverEl = $("#dd_description_modelformat");
        popoverEl.popover("destroy");
        var content = "{<br/>"+
            "python文件<br/>"+
            "param1 : 训练文件路径<br/>"+
            "param2 : 模型保存路径<br/>"+
            "}";
        popoverEl.attr("data-content", content);
        popoverEl.popover("show");

    });

    $("#dd_description_labelformat").click(function () {
        var popoverEl = $("#dd_description_labelformat");
        popoverEl.popover("destroy");
        var str = "loc,degree\n";
        var url = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
        var link = document.createElement("a");
        link.href = url;
        link.download = 'label.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    $("#dd_description_evaluate_labelformat").click(function () {
        var popoverEl = $("#dd_description_evaluate_labelformat");
        popoverEl.popover("destroy");
        var str = "loc,degree\n";
        var url = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
        var link = document.createElement("a");
        link.href = url;
        link.download = 'label.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    $(document).ajaxSend(function(e, xhr, options) {
        xhr.setRequestHeader(header, token);
    });

    $("#dd_trainfile_upload").fileinput({
        allowedFileExtensions: ['csv'],
        uploadUrl: "damage-detection/trainfileupload",
        language: 'zh',
        uploadAsync: true,
        showUpload: true,
        maxFileCount: 1,
        autoReplace: true,
        showPreview: false,
        maxFileSize: 51200000, // KB,当前限制为5GB
        maxPreviewFileSize: 1
    }).on("fileuploaded",function (event, data, previewId, index) {
        var response = data.response;
        console.log(response)
        if(response.status != 0){
            showTransientDialog(response.msg);
        }else{
            showModalDialog("提示", "<div style='text-align:center;'>文件正在上传...</div>",function(){},150,40);
        }
        //更新下拉列表
        updateDropdownListTrainFile();
    }).on('fileuploaderror', function (event, data, msg) {
        var response = data.response;
        console.log("data");
        console.log(data);
        var msg = "仅支持npy且单文件大小不超过5GB！";
        if(response!=null && response.msg!="") msg = response.msg;
        console.log(msg);
        showTransientDialog(msg);
    });

    $("#dd_trainmodel_upload").fileinput({
        allowedFileExtensions: ['py'],
        uploadUrl: "damage-detection/trainmodelupload",
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
            showModalDialog("提示", "<div style='text-align:center;'>文件正在上传...</div>",function(){},150,40);
        }
        updateDropdownListTrainModel();
       // updateDropdownListUdfTrainModel();
    }).on('fileuploaderror', function (event, data, msg) {
        var response = data.response;
        console.log("data");
        console.log(data);
        var msg = "仅支持py且单文件大小不超过50MB！";
        if(response!=null && response.msg!="") msg = response.msg;
        console.log(msg);
        showTransientDialog(msg);
    });

    $("#dd_trainlabel_upload").fileinput({
        allowedFileExtensions: ['csv'],
        uploadUrl: "damage-detection/trainlabelupload",
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
            showModalDialog("提示", "<div style='text-align:center;'>文件正在上传...</div>",function(){},150,40);
        }
        updateDropdownListTrainModel();
        // updateDropdownListUdfTrainModel();
    }).on('fileuploaderror', function (event, data, msg) {
        var response = data.response;
        console.log("data");
        console.log(data);
        var msg = "仅支持csv且单文件大小不超过50MB！";
        if(response!=null && response.msg!="") msg = response.msg;
        console.log(msg);
        showTransientDialog(msg);
    });

    $("#dd_evaluatefile_upload").fileinput({
        allowedFileExtensions: ['csv'],
        uploadUrl: "damage-detection/evaluatefileupload",
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
            showModalDialog("提示", "<div style='text-align:center;'>文件正在上传...</div>",function(){},150,40);
        }
        //更新下拉列表
        updateDropdownListEvaluateFile();
    }).on('fileuploaderror', function (event, data, msg) {
        var response = data.response;
        console.log("data");
        console.log(data);
        var msg = "仅支持npy且单文件大小不超过50MB！";
        if(response!=null && response.msg!="") msg = response.msg;
        console(msg);
        showTransientDialog(msg);
    });

    $("#dd_evaluatelabel_upload").fileinput({
        allowedFileExtensions: ['csv'],
        uploadUrl: "damage-detection/evaluatelabelupload",
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
            showModalDialog("提示", "<div style='text-align:center;'>文件正在上传...</div>",function(){},150,40);
        }
        //更新下拉列表
        updateDropdownListEvaluateFile();
    }).on('fileuploaderror', function (event, data, msg) {
        var response = data.response;
        console.log("data");
        console.log(data);
        var msg = "仅支持csv且单文件大小不超过50MB！";
        if(response!=null && response.msg!="") msg = response.msg;
        console(msg);
        showTransientDialog(msg);
    });

    $("#dd_testfile_upload").fileinput({
        allowedFileExtensions: ['csv'],
        uploadUrl: "damage-detection/testfileupload",
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
            showModalDialog("提示", "<div style='text-align:center;'>文件正在上传...</div>",function(){},150,40);
        }
        //更新下拉列表
        updateDropdownListTestFile();
    }).on('fileuploaderror', function (event, data, msg) {
        var response = data.response;
        console.log("data");
        console.log(data);
        var msg = "仅支持npy且单文件大小不超过50MB！";
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

    // $("#dd_train_start").click(function () {
    //     var train_file = $("#dd_train_file_selected").val();
    //     var train_model = $("#dd_train_model_selected").val();
    //     var saved_model = $("#dd_saved_model").val();
    //     //console.log(saved_model);
    //     if (train_file == null){
    //         showTransientDialog("请选择训练文件");
    //         //showDialog("请选择训练文件");
    //         return;
    //     }
    //     if(train_model == null){
    //         showTransientDialog("请选择训练模型");
    //         //showDialog("请选择训练模型");
    //         return;
    //     }
    //     if(!saved_model){
    //         showTransientDialog("请输入保存模型名称");
    //         //showDialog("请输入保存模型名称");
    //         return;
    //     }
    //     var response = null;
    //     var d = null;
    //     var token = $("meta[name='_csrf']").attr("content");
    //     var header = $("meta[name='_csrf_header']").attr("content");
    //     $(document).ajaxSend(function(e, xhr, options) {
    //         xhr.setRequestHeader(header, token);
    //     });
    //     $.ajax({
    //         url: "/damage-detection/train",
    //         type: "POST",
    //         async: true,
    //         contentType: "application/json; charset=utf-8",
    //         data: JSON.stringify({
    //             "trainfile" : train_file,
    //             "trainmodel" : train_model,
    //             "savedmodel" : saved_model
    //         }),
    //         dataType: "json",
    //         beforeSend: function () {
    //             $("#dd_train_start").text('训练中...');
    //             $("#dd_train_process").removeAttr("value");
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
    //             } else {
    //                 showTransientDialog('训练失败！')
    //             }
    //         },
    //         complete:function () {
    //             $("#dd_train_start").text("开始训练");
    //             $("#dd_train_process").attr("value", "100");
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
    // });

    // $("#dd_test_start").click(function () {
    //     var test_file = $("#dd_test_file_selected").val();
    //     var test_model = $("#dd_test_model_selected").val();
    //     //console.log(saved_model);
    //     if (test_file == null){
    //         showTransientDialog("请选择识别文件");
    //         //showDialog("请选择训练文件");
    //         return;
    //     }
    //     if(test_model == null){
    //         showTransientDialog("请选择识别模型");
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
    //         url: "/damage-detection/test",
    //         type: "POST",
    //         async: true,
    //         contentType: "application/json; charset=utf-8",
    //         data: JSON.stringify({
    //             "testfile" : test_file,
    //             "testmodel" : test_model
    //         }),
    //         dataType: "json",
    //         beforeSend: function () {
    //             $("#dd_test_start").text('识别中...');
    //             $("#dd_test_process").removeAttr("value");
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
    //                 showDialog("识别完成")
    //             } else {
    //                 showTransientDialog('识别失败！')
    //             }
    //         },
    //         complete:function () {
    //             $("#dd_test_start").text("开始识别");
    //             $("#dd_test_process").attr("value", "100");
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

    // $("#dd_evaluate_start").click(function () {
    //     var evaluate_file = $("#dd_evaluate_file_selected").val();
    //     var evaluate_model = $("#dd_evaluate_model_selected").val();
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
    //         url: "/damage-detection/evaluate",
    //         type: "POST",
    //         async: true,
    //         contentType: "application/json; charset=utf-8",
    //         data: JSON.stringify({
    //             "evaluatefile" : evaluate_file,
    //             "evaluatemodel" : evaluate_model
    //         }),
    //         dataType: "json",
    //         beforeSend: function () {
    //             $("#dd_evaluate_start").text('验证中...');
    //             $("#dd_evaluate_process").removeAttr("value");
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
    //             $("#dd_evaluate_start").text("模型验证");
    //             $("#dd_evaluate_process").attr("value", "100");
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
    // $("#dd_result_damagedetection").click(function () {
    //     var test_file = $("#dd_test_file_selected").val();
    //     var test_model = $("#dd_test_model_selected").val();
    //     if(test_file == null){
    //         showTransientDialog("请选择识别文件");
    //         return;
    //     }
    //     if(test_model == null){
    //         showTransientDialog("请选择识别模型");
    //         return;
    //     }
    //
    //     var token = $("meta[name='_csrf']").attr("content");
    //     var header = $("meta[name='_csrf_header']").attr("content");
    //     $(document).ajaxSend(function(e, xhr, options) {
    //         xhr.setRequestHeader(header, token);
    //     });
    //     var figure_id = "dd_show_result_figure";
    //     $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/loading.gif'/>");
    //     $(this).button("loading").delay(1000).queue(function () {
    //         var param ={
    //             "testfile" : test_file,
    //             "testmodel" : test_model
    //         }
    //         var current_dialog = $(this);
    //         getAndshowPredictResult(figure_id, current_dialog, param);
    //     })
    //
    // });
    $("#dd_train_start").click(function () {
        var train_file = $("#dd_train_file_selected").val();
        var train_model = $("#dd_train_model_selected").val();
        // var bridge = $("#dd_train_bridge_selected").val();
        var saved_model = $("#dd_saved_model").val();
        // var train_label = $("#dd_train_label_selected").val();
        var model_type = $("#dd_train_modeltype_selected option:selected").val();
        var epochs = $("#epochs").val();
        var batch_size = $("#batch_size").val();
        var sample = $("#sample").val();

        if(train_file == null){
            showTransientDialog("请选择训练文件");
            return;
        }
        if(train_model == null){
            showTransientDialog("请选择训练模型");
            //showDialog("请选择训练模型");
            return;
        }
        // if(bridge == null){
        //     showTransientDialog("请选择分析桥梁");
        //     return;
        // }
        // if (train_label == null){
        //     showTransientDialog("请选择训练标签")
        // }
        if(!saved_model){
            showTransientDialog("请输入保存模型名称");
            //showDialog("请输入保存模型名称");
            return;
        }
        if(!model_type){
            showTransientDialog("请选择模型类型");
            return;
        }
        if (!epochs || !sample || !batch_size){
            showTransientDialog("请输入参数")
            return;
        }
        // var begin_time = $("#dd_train_begin_time").val();
        // var end_time = $("#dd_train_end_time").val();
        // if(begin_time >= end_time){
        //     showTransientDialog("开始时间必须小于截止时间");
        //     return;
        // }
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        $(document).ajaxSend(function(e, xhr, options) {
            xhr.setRequestHeader(header, token);
        });

        $.ajax({
            url: "/damage-detection/train",
            type: "POST",
            async: true,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                // "bridge" : bridge,
                "trainfile" : train_file + ".csv",
                "trainmodel" : train_model,
                "savedmodel" : saved_model,
                // "trainlabel" : train_label,
                // "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                // "endtime" : new Date(end_time).format("yyyyMMddHHmmss")
                "modelType" : model_type,
                "epochs" : epochs,
                "batch_size" : batch_size,
                "sample" : sample,
            }),
            dataType: "json",
            beforeSend: function () {
                $("#dd_train_start").text('训练中...');
                $("#dd_train_process").removeAttr("value");
                $("#dd_train_computing").show();
                // var content = '' +
                //     ' <img alt="loadding" src="/assets/img/loading.gif" /> \
                //     '
                // d = dialog({
                //     content: content
                // });
                // d.showModal();
            },
            success: function(response) {
                $("#dd_train_computing").hide();
                var data = response.data;
                var result = data['result'];
                if (result == 'success') {
                    //showTransientDialog('训练完成!')
                    //showModalDialog("提示", "训练完成")
                    //showAlertDialog('训练完成')
                    showDialog("训练完成")
                } else if(result == 'failed') {
                    showTransientDialog('训练失败！')
                } else{
                    showTransientDialog("没有符合条件的数据！")
                }
            },
            complete:function () {
                $("#dd_train_start").text("开始训练");
                $("#dd_train_process").attr("value", "100");
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


    })

    $("#dd_evaluate_start").click(function () {
        var evaluate_file = $("#dd_evaluate_file_selected").val();
        var evaluate_model = $("#dd_evaluate_model_selected").val();
        // var bridge = $("#dd_evaluate_bridge_selected").val();
        // var evaluate_label = $("#dd_evaluate_label_selected").val();

        if(evaluate_file == null){
            showTransientDialog("请选择验证文件");
            return;
        }
        if(evaluate_model == null){
            showTransientDialog("请选择验证模型");
            //showDialog("请选择训练模型");
            return;
        }
        // if(bridge == null){
        //     showTransientDialog("请选择分析桥梁");
        //     return;
        // }
        // if (evaluate_label == null){
        //     showTransientDialog("请选择验证标签");
        //     return;
        // }
        // var begin_time = $("#dd_evaluate_begin_time").val();
        // var end_time = $("#dd_evaluate_end_time").val();
        // if(begin_time >= end_time){
        //     showTransientDialog("开始时间必须小于截止时间");
        //     return;
        // }
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        $(document).ajaxSend(function(e, xhr, options) {
            xhr.setRequestHeader(header, token);
        });
        $.ajax({
            url: "/damage-detection/evaluate",
            type: "POST",
            async: true,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "evaluatefile" : evaluate_file + ".csv",
                // "bridge" : bridge,
                "evaluatemodel" : evaluate_model + ".h5",
                // "evaluatelabel" : evaluate_label,
                // "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                // "endtime" : new Date(end_time).format("yyyyMMddHHmmss")
            }),
            dataType: "json",
            beforeSend: function () {
                $("#dd_evaluate_start").text('验证中...');
                $("#dd_evaluate_process").removeAttr("value");
                $("#dd_evaluate_computing").show();
            },
            success: function(response) {
                $("#dd_evaluate_computing").hide();
                var data = response.data;
                var result = data['result'];
                if(result == 'success'){
                    var p = data['precision'];
                    var r = data['recall'];
                    var f1 = data['f1'];
                    var content = "验证完成！<br/> 准确率为"+p+"<br/>召回率为"+r + "</br>f1值为"+f1;
                    showDialog(content);
                }else if(result == 'failed'){
                    showTransientDialog('验证失败！')
                }else{
                    showTransientDialog("没有符合条件的数据！")
                }
            },
            complete:function () {
                $("#dd_evaluate_start").text("模型验证");
                $("#dd_evaluate_process").attr("value", "100");
                //updateDropdownListSavedModel();
                //updateDropdownListEvaluateModel();
                //updateDropdownListUdfEvaluateModel();
                //updateDropdownListUdfTestModel();
            },
            error: function(response) {
                alert("提交任务失败");
            }

        });
    });

    var test_mode = 0;
    $('#test-tab li').click(function () {
        test_mode = $(this).index();
    });
    $("#dd_test_start").click(function () {
        if (test_mode == 0){
            var test_file = $("#dd_test_file_selected").val();
            var test_model = $("#dd_test_model_selected").val();
            // var bridge = $("#dd_test_bridge_selected").val();

            if(test_file == null){
                showTransientDialog("请选择识别文件");
                return;
            }
            if(test_model == null){
                showTransientDialog("请选择识别模型");
                //showDialog("请选择训练模型");
                return;
            }
            // if(bridge == null){
            //     showTransientDialog("请选择分析桥梁");
            //     return;
            // }
            // var begin_time = $("#dd_test_begin_time").val();
            // var end_time = $("#dd_test_end_time").val();
            // if(begin_time >= end_time){
            //     showTransientDialog("开始时间必须小于截止时间");
            //     return;
            // }
            var token = $("meta[name='_csrf']").attr("content");
            var header = $("meta[name='_csrf_header']").attr("content");
            $(document).ajaxSend(function(e, xhr, options) {
                xhr.setRequestHeader(header, token);
            });

            $.ajax({
                url: "/damage-detection/test",
                type: "POST",
                async: true,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    "testfile" : test_file +".csv",
                    // "bridge" : bridge,
                    "testmodel" : test_model + ".h5",
                    // "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                    // "endtime" : new Date(end_time).format("yyyyMMddHHmmss")
                }),
                dataType: "json",
                beforeSend: function () {
                    $("#dd_test_start").text('识别中...');
                    $("#dd_test_process").removeAttr("value");
                    $("#dd_test_computing").show();
                },
                success: function(response) {
                    $("#dd_test_computing").hide();
                    var data = response.data;
                    var result = data['result'];
                    if (result == 'success') {
                        showTransientDialog("识别完成");
                    } else if(result == 'failed'){
                        showTransientDialog('识别失败！');
                    } else{
                        showTransientDialog('没有符合条件的数据!');
                    }

                },
                complete:function () {
                    $("#dd_test_start").text("开始识别");
                    $("#dd_test_process").attr("value", "100");
                },
                error: function(response) {
                    alert("提交任务失败");
                }

            });
        }else if (test_mode == 1){
            // var test_file = $("#dd_test_file_selected").val();
            var test_model = $("#spy_dd_test_model_selected").val();
            var bridge = $("#spy_dd_test_bridge_selected").val();

            // if(test_file == null){
            //     showTransientDialog("请选择训练文件");
            //     return;
            // }
            if(test_model == null){
                showTransientDialog("请选择识别模型");
                //showDialog("请选择训练模型");
                return;
            }
            if(bridge == null){
                showTransientDialog("请选择分析桥梁");
                return;
            }
            // var begin_time = $("#dd_test_begin_time").val();
            // var end_time = $("#dd_test_end_time").val();
            // if(begin_time >= end_time){
            //     showTransientDialog("开始时间必须小于截止时间");
            //     return;
            // }
            var token = $("meta[name='_csrf']").attr("content");
            var header = $("meta[name='_csrf_header']").attr("content");
            $(document).ajaxSend(function(e, xhr, options) {
                xhr.setRequestHeader(header, token);
            });

            $.ajax({
                url: "/damage-detection/testCGQ",
                type: "POST",
                async: true,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    // "testfile" : test_file,
                    "bridge" : bridge,
                    "testmodel" : test_model + ".h5",
                    // "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                    // "endtime" : new Date(end_time).format("yyyyMMddHHmmss")
                }),
                dataType: "json",
                beforeSend: function () {
                    $("#dd_test_start").text('识别中...');
                    $("#dd_test_process").removeAttr("value");
                    $("#dd_test_computing").show();
                },
                success: function(response) {
                    $("#dd_test_computing").hide();
                    var data = response.data;
                    var result = data['result'];
                    if (result == 'success') {
                        showTransientDialog("识别完成");
                    } else if(result == 'failed'){
                        showTransientDialog('识别失败！');
                    } else{
                        showTransientDialog('没有符合条件的数据!');
                    }

                },
                complete:function () {
                    $("#dd_test_start").text("开始识别");
                    $("#dd_test_process").attr("value", "100");
                },
                error: function(response) {
                    alert("提交任务失败");
                }

            });
        }

    })

    $("#dd_show_result_figure").hide();
    $("#dd_result_damagedetection").click(function () {
        var test_file = $("#dd_test_file_selected").val();
        var test_model = $("#dd_test_model_selected").val();
        // var bridge = $("#dd_test_bridge_selected").val();
        // var begin_time = $("#dd_test_begin_time").val();
        // var end_time = $("#dd_test_end_time").val();

        if(test_file == null){
            showTransientDialog("请选择训练文件");
            return;
        }
        if(test_model == null){
            showTransientDialog("请选择识别模型");
            //showDialog("请选择训练模型");
            return;
        }
        // if(bridge == null){
        //     showTransientDialog("请选择分析桥梁");
        //     return;
        // }
        // if(begin_time >= end_time){
        //     showTransientDialog("开始时间必须小于截止时间");
        //     return;
        // }

        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        $(document).ajaxSend(function(e, xhr, options) {
            xhr.setRequestHeader(header, token);
        });

        var figure_id = "dd_show_result_figure";
        $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/loading.gif'/>");
        $(this).button("loading").delay(1000).queue(function () {
            var param ={
                "testfile" : test_file + ".csv",
                "testmodel" : test_model + ".h5",
                // "bridge" : bridge,
                // "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                // "endtime" : new Date(end_time).format('yyyyMMddHHmmss')
            }
            var current_dialog = $(this);
            $("#dd_show_result_figure").show();
            getAndshowPredictResult(figure_id, current_dialog, param);
        })
    })
});
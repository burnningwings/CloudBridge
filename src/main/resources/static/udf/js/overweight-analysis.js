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



function set_progress(flag) {
    var current = $("#train_process").val();
    // if (current == 100){
    //     $("#train_process").attr("value", "0");
    // }
    console.log(typeof (current))
    console.log(current);
    $("#train_process").val(current + 1);
}

function sleep(delay) {
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
        continue;
    }
}

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
            options = options + "<option>" + key.substring(0, key.lastIndexOf(".")) + "</option>";
        }
    }
    $("#train_file_selected").append(options);
    $("#train_file_selected").selectpicker('refresh');
    // $("#train_file_selected").on('shown.bs.select',function(e){
    //      console.log('展开');
    // })

}

function updateDropdownListTrainLabel(){
    $("#train_label_selected").empty();
    $('#spy_train_label_selected').empty();
    var url = "/overweight-analysis/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "trainlabel"});
    var options ="<option value=\'\' disabled selected>请选择训练标签</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key.substring(0, key.lastIndexOf(".")) + "</option>";
        }
    }
    $("#train_label_selected").append(options);
    $('#spy_train_label_selected').append(options)
    $("#train_file_selected").selectpicker('refresh');
    // $("#train_file_selected").on('shown.bs.select',function(e){
    //      console.log('展开');
    // })

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

function updateDropdownListTrainModelType(){
    $("#train_single_model_type_selected").empty();
    $('#train_multi_model_type_selected').empty();
    var single_options ="<option value=\'\' disabled selected>请选择单任务算法模型</option>"
    var multi_options ="<option value=\'\' disabled selected>请选择多任务算法模型</option>"
    var single = {
        "tcn": "基于时间卷积网络的超重车动态识别算法",
        "dnn": "基于深度神经网络的超重车动态识别算法",
        "rnn": "基于循环神经网络的超重车动态识别算法",
        "lstm": "基于长短时记忆网络的超重车动态识别算法",
        "gru": "基于门控循环单元的超重车动态识别算法",
        "dnnlstm": "基于深度神经网络和长短时记忆网络的超重车动态识别算法"
    }
    var multi = {
        "tcnmt": "基于时间卷积网络的多任务学习超重车动态识别算法",
        "rnnmt": "基于循环神经网络的多任务学习超重车动态识别算法",
        "lstmmt": "基于长短时记忆网络的多任务学习超重车动态识别算法",
        "dnnlstmmt": "基于深度神经网络和长短时记忆网络的多任务学习超重车动态识别算法"
    }

    for(var key in single){
        single_options = single_options + "<option value='" + key + "'>" + single[key] + "</option>";
    }

    for(var key in multi){
        multi_options = multi_options + "<option value='" + key +"'>" + multi[key] + "</option>";
    }

    $("#train_single_model_type_selected").append(single_options);
    $('#train_multi_model_type_selected').append(multi_options)
    $(".selectpicker").selectpicker('refresh');

    var $dropmenu1 = $('#train_single_model_type_selected')
    var $dropmenu2 = $('#train_multi_model_type_selected')

    $dropmenu1.off('changed.bs.select').on("changed.bs.select", function () {
        if (selectIsExitItem($dropmenu1,"-1")){
            for (var i =0;i<$dropmenu1["0"].options.length;i++){
                if ($dropmenu1["0"].options[i].value == "-1"){
                    $dropmenu1["0"].remove(i);
                    break;
                }
            }
        }
        if (!selectIsExitItem($dropmenu2,"-1")){
            var em = "<option value='-1'>未选中</option>";
            $dropmenu2.append(em)
            $dropmenu2.val("-1")
        }
        $('.selectpicker').selectpicker('refresh');
    });

    $dropmenu2.off('changed.bs.select').on("changed.bs.select", function () {
        if (selectIsExitItem($dropmenu2,"-1")){
            for (var i =0;i<$dropmenu2["0"].options.length;i++){
                if ($dropmenu2["0"].options[i].value == "-1"){
                    $dropmenu2["0"].remove(i);
                    break;
                }
            }
        }
        if (!selectIsExitItem($dropmenu1,"-1")){
            var em = "<option value='-1'>未选中</option>";
            $dropmenu1.append(em)
            $dropmenu1.val("-1")
        }
        $('.selectpicker').selectpicker('refresh');
    });


}

function updateDropdownListEvaluateModelType(){
    $("#evaluate_single_model_type_selected").empty();
    $('#evaluate_multi_model_type_selected').empty();
    var single_options ="<option value=\'\' disabled selected>请选择单任务算法模型</option>"
    var multi_options ="<option value=\'\' disabled selected>请选择多任务算法模型</option>"
    var single = {
        "tcn": "基于时间卷积网络的超重车动态识别算法",
        "dnn": "基于深度神经网络的超重车动态识别算法",
        "rnn": "基于循环神经网络的超重车动态识别算法",
        "lstm": "基于长短时记忆网络的超重车动态识别算法",
        "gru": "基于门控循环单元的超重车动态识别算法",
        "dnnlstm": "基于深度神经网络和长短时记忆网络的超重车动态识别算法"
    }
    var multi = {
        "tcnmt": "基于时间卷积网络的多任务学习超重车动态识别算法",
        "rnnmt": "基于循环神经网络的多任务学习超重车动态识别算法",
        "lstmmt": "基于长短时记忆网络的多任务学习超重车动态识别算法",
        "dnnlstmmt": "基于深度神经网络和长短时记忆网络的多任务学习超重车动态识别算法"
    }

    for(var key in single){
        single_options = single_options + "<option value='" + key + "'>" + single[key] + "</option>";
    }

    for(var key in multi){
        multi_options = multi_options + "<option value='" + key +"'>" + multi[key] + "</option>";
    }

    $("#evaluate_single_model_type_selected").append(single_options);
    $('#evaluate_multi_model_type_selected').append(multi_options)
    $(".selectpicker").selectpicker('refresh');

    var $dropmenu1 = $('#evaluate_single_model_type_selected')
    var $dropmenu2 = $('#evaluate_multi_model_type_selected')

    $dropmenu1.off('changed.bs.select').on("changed.bs.select", function () {
        if (selectIsExitItem($dropmenu1,"-1")){
            for (var i =0;i<$dropmenu1["0"].options.length;i++){
                if ($dropmenu1["0"].options[i].value == "-1"){
                    $dropmenu1["0"].remove(i);
                    break;
                }
            }
        }
        if (!selectIsExitItem($dropmenu2,"-1")){
            var em = "<option value='-1'>未选中</option>";
            $dropmenu2.append(em)
            $dropmenu2.val("-1")
        }
        $('.selectpicker').selectpicker('refresh');
    });

    $dropmenu2.off('changed.bs.select').on("changed.bs.select", function () {
        if (selectIsExitItem($dropmenu2,"-1")){
            for (var i =0;i<$dropmenu2["0"].options.length;i++){
                if ($dropmenu2["0"].options[i].value == "-1"){
                    $dropmenu2["0"].remove(i);
                    break;
                }
            }
        }
        if (!selectIsExitItem($dropmenu1,"-1")){
            var em = "<option value='-1'>未选中</option>";
            $dropmenu1.append(em)
            $dropmenu1.val("-1")
        }
        $('.selectpicker').selectpicker('refresh');
    });
}

function updateDropdownListTestModelType(){
    $("#test_single_model_type_selected").empty();
    $('#test_multi_model_type_selected').empty();
    var single_options ="<option value=\'\' disabled selected>请选择单任务算法模型</option>"
    var multi_options ="<option value=\'\' disabled selected>请选择多任务算法模型</option>"
    var single = {
        "tcn": "基于时间卷积网络的超重车动态识别算法",
        "dnn": "基于深度神经网络的超重车动态识别算法",
        "rnn": "基于循环神经网络的超重车动态识别算法",
        "lstm": "基于长短时记忆网络的超重车动态识别算法",
        "gru": "基于门控循环单元的超重车动态识别算法",
        "dnnlstm": "基于深度神经网络和长短时记忆网络的超重车动态识别算法"
    }
    var multi = {
        "tcnmt": "基于时间卷积网络的多任务学习超重车动态识别算法",
        "rnnmt": "基于循环神经网络的多任务学习超重车动态识别算法",
        "lstmmt": "基于长短时记忆网络的多任务学习超重车动态识别算法",
        "dnnlstmmt": "基于深度神经网络和长短时记忆网络的多任务学习超重车动态识别算法"
    }

    for(var key in single){
        single_options = single_options + "<option value='" + key + "'>" + single[key] + "</option>";
    }

    for(var key in multi){
        multi_options = multi_options + "<option value='" + key +"'>" + multi[key] + "</option>";
    }

    $("#test_single_model_type_selected").append(single_options);
    $('#test_multi_model_type_selected').append(multi_options)
    $(".selectpicker").selectpicker('refresh');

    var $dropmenu1 = $('#test_single_model_type_selected')
    var $dropmenu2 = $('#test_multi_model_type_selected')

    $dropmenu1.off('changed.bs.select').on("changed.bs.select", function () {
        if (selectIsExitItem($dropmenu1,"-1")){
            for (var i =0;i<$dropmenu1["0"].options.length;i++){
                if ($dropmenu1["0"].options[i].value == "-1"){
                    $dropmenu1["0"].remove(i);
                    break;
                }
            }
        }
        if (!selectIsExitItem($dropmenu2,"-1")){
            var em = "<option value='-1'>未选中</option>";
            $dropmenu2.append(em)
            $dropmenu2.val("-1")
        }
        $('.selectpicker').selectpicker('refresh');
    });

    $dropmenu2.off('changed.bs.select').on("changed.bs.select", function () {
        if (selectIsExitItem($dropmenu2,"-1")){
            for (var i =0;i<$dropmenu2["0"].options.length;i++){
                if ($dropmenu2["0"].options[i].value == "-1"){
                    $dropmenu2["0"].remove(i);
                    break;
                }
            }
        }
        if (!selectIsExitItem($dropmenu1,"-1")){
            var em = "<option value='-1'>未选中</option>";
            $dropmenu1.append(em)
            $dropmenu1.val("-1")
        }
        $('.selectpicker').selectpicker('refresh');
    });
}

function updateDropdownListSpyTestModelType(){
    $("#spy_test_single_model_type_selected").empty();
    $('#spy_test_multi_model_type_selected').empty();
    var single_options ="<option value=\'\' disabled selected>请选择单任务算法模型</option>"
    var multi_options ="<option value=\'\' disabled selected>请选择多任务算法模型</option>"
    var single = {
        "tcn": "基于时间卷积网络的超重车动态识别算法",
        "dnn": "基于深度神经网络的超重车动态识别算法",
        "rnn": "基于循环神经网络的超重车动态识别算法",
        "lstm": "基于长短时记忆网络的超重车动态识别算法",
        "gru": "基于门控循环单元的超重车动态识别算法",
        "dnnlstm": "基于深度神经网络和长短时记忆网络的超重车动态识别算法"
    }
    var multi = {
        "tcnmt": "基于时间卷积网络的多任务学习超重车动态识别算法",
        "rnnmt": "基于循环神经网络的多任务学习超重车动态识别算法",
        "lstmmt": "基于长短时记忆网络的多任务学习超重车动态识别算法",
        "dnnlstmmt": "基于深度神经网络和长短时记忆网络的多任务学习超重车动态识别算法"
    }

    for(var key in single){
        single_options = single_options + "<option value='" + key + "'>" + single[key] + "</option>";
    }

    for(var key in multi){
        multi_options = multi_options + "<option value='" + key +"'>" + multi[key] + "</option>";
    }

    $("#spy_test_single_model_type_selected").append(single_options);
    $('#spy_test_multi_model_type_selected').append(multi_options)
    $(".selectpicker").selectpicker('refresh');

    var $dropmenu1 = $('#spy_test_single_model_type_selected')
    var $dropmenu2 = $('#spy_test_multi_model_type_selected')

    $dropmenu1.off('changed.bs.select').on("changed.bs.select", function () {
        if (selectIsExitItem($dropmenu1,"-1")){
            for (var i =0;i<$dropmenu1["0"].options.length;i++){
                if ($dropmenu1["0"].options[i].value == "-1"){
                    $dropmenu1["0"].remove(i);
                    break;
                }
            }
        }
        if (!selectIsExitItem($dropmenu2,"-1")){
            var em = "<option value='-1'>未选中</option>";
            $dropmenu2.append(em)
            $dropmenu2.val("-1")
        }
        $('.selectpicker').selectpicker('refresh');
    });

    $dropmenu2.off('changed.bs.select').on("changed.bs.select", function () {
        if (selectIsExitItem($dropmenu2,"-1")){
            for (var i =0;i<$dropmenu2["0"].options.length;i++){
                if ($dropmenu2["0"].options[i].value == "-1"){
                    $dropmenu2["0"].remove(i);
                    break;
                }
            }
        }
        if (!selectIsExitItem($dropmenu1,"-1")){
            var em = "<option value='-1'>未选中</option>";
            $dropmenu1.append(em)
            $dropmenu1.val("-1")
        }
        $('.selectpicker').selectpicker('refresh');
    });
}

function updateDropdownListTestFile(){
    $("#test_file_selected").empty();
    var url = "/overweight-analysis/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "testfile"});
    var options ="<option value=\'\' disabled selected>请选择识别文件</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key.substring(0, key.lastIndexOf(".")) + "</option>";
        }
    }
    $("#test_file_selected").append(options);
    $("#test_file_selected").selectpicker('refresh');
}

function updateDropdownListTrainModel(){
    $("#train_model_selected").empty();
    $('#spy_train_model_selected').empty();
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
    $('#spy_train_model_selected').append(options);
    $("#train_model_selected").selectpicker('refresh');
}

function updateDropdownListSavedModel(){
    $("#test_model_selected").empty();
    $("#spy_test_model_selected").empty();
    var url = "/overweight-analysis/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "savedmodel"});
    var options ="<option value=\'\' disabled selected>请选择识别模型</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key.substring(0, key.lastIndexOf(".")) + "</option>";
        }
    }
    $("#test_model_selected").append(options);
    $("#spy_test_model_selected").append(options);
    $("#test_model_selected").selectpicker('refresh');
    $("#spy_test_model_selected").selectpicker('refresh');
}

function updateDropdownListEvaluateFile(){
    $("#evaluate_file_selected").empty();
    var url = "/overweight-analysis/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "evaluatefile"});
    var options ="<option value=\'\' disabled selected>请选择验证文件</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key.substring(0, key.lastIndexOf(".")) + "</option>";
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
            options = options + "<option>" + key.substring(0, key.lastIndexOf(".")) + "</option>";
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
    $('#spy_train_bridge_selected').empty();
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
    $('#spy_train_bridge_selected').append(options);
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
    $("#spy_test_bridge_selected").empty();
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
    $("#spy_test_bridge_selected").append(options);

    $("#test_bridge_selected").selectpicker('refresh');
    $("#spy_test_bridge_selected").selectpicker('refresh');
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
//     var options ="<option value=\'\' disabled selected>请选择识别模型</option>"
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

// function CGQTrain(){
//     var token = $("meta[name='_csrf']").attr("content");
//     var header = $("meta[name='_csrf_header']").attr("content");
//     $(document).ajaxSend(function(e, xhr, options) {
//         xhr.setRequestHeader(header, token);
//     });
//     $.ajax({
//         url: "/overweight-analysis/trainCGQ",
//         type: "POST",
//         async: true,
//         contentType: "application/json; charset=utf-8",
//         data: JSON.stringify({
//             "trainmodel" : "train_model",
//             "savedmodel" : "saved_model",
//             "bridgeId" : 29,
//             "begintime" : "20060511102122",
//             "endtime" : new Date().format("yyyyMMddHHmmss")
//         }),
//         dataType: "json",
//         beforeSend: function () {
//
//         },
//         success: function(response) {
//
//         },
//         error: function(response) {
//
//         }
//     });
// }
//初始化
$(function () {
    var timer;

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
    updateDropdownListTrainLabel();
    updateDropdownListTrainModelType();
    updateDropdownListEvaluateModelType();
    updateDropdownListTestModelType();
    updateDropdownListSpyTestModelType();
    // CGQTrain();

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

    var t_begin_train = new Date(2018,09,11,00,00,00).format(data_format_str);
    var t_end_train = new Date(2018,09,11,23,59,59).format(data_format_str);

    $('#train_begin_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#train_end_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#train_begin_time').val(t_begin_train);
    $('#train_end_time').val(t_end_train);

    $('#train_begin_time').change(function () {
        var file = $("#train_file_selected").children('option:selected').val();
        var url = "/overweight-analysis/getExampleCount";
        var begin_time = $("#train_begin_time").val();
        var end_time = $("#train_end_time").val();

        var response = webRequest(url, "GET", false, {"type" : "trainfile","filename":file+".csv","beginTime": new Date(begin_time).format('yyyyMMddHHmmss'),"endTime": new Date(end_time).format('yyyyMMddHHmmss')});
        if(response!=null && response.status==0){
            var data = response.data;
            for(var key in data){
                $("#train_example_count").text("样本数：" + data["example_count"])
                $("#train_example_count").refresh()
            }
        }
    });

    $('#train_end_time').change(function () {
        var file = $("#train_file_selected").children('option:selected').val();
        var url = "/overweight-analysis/getExampleCount";
        var begin_time = $("#train_begin_time").val();
        var end_time = $("#train_end_time").val();

        var response = webRequest(url, "GET", false, {"type" : "trainfile","filename":file+".csv","beginTime": new Date(begin_time).format('yyyyMMddHHmmss'),"endTime": new Date(end_time).format('yyyyMMddHHmmss')});
        if(response!=null && response.status==0){
            var data = response.data;
            for(var key in data){
                $("#train_example_count").text("样本数：" + data["example_count"])
                $("#train_example_count").refresh()
            }
        }
    });


    $('#train_file_selected').change(function(){
        var file = $(this).children('option:selected').val();
        var url = "/overweight-analysis/getTime";
        var response = webRequest(url, "GET", false, {"type" : "trainfile","filename":file+".csv"});
        if(response!=null && response.status==0){
            var data = response.data;
            for(var key in data){
                if (key == "begin_time"){
                    t_begin_train = new Date(year=parseInt(data[key].toString().substring(0,4)),month=parseInt(data[key].toString().substring(4,6))-1,date=parseInt(data[key].toString().substring(6,8)),hours=parseInt(data[key].toString().substring(8,10)),minutes=parseInt(data[key].toString().substring(10,12)),seconds=parseInt(data[key].toString().substring(12))).format(data_format_str);
                }else if (key == "end_time"){
                    t_end_train = new Date(parseInt(data[key].toString().substring(0,4)),parseInt(data[key].toString().substring(4,6))-1,parseInt(data[key].toString().substring(6,8)),parseInt(data[key].toString().substring(8,10)),parseInt(data[key].toString().substring(10,12)),parseInt(data[key].toString().substring(12))).format(data_format_str);
                }
                $('#train_begin_time').val(t_begin_train);
                $('#train_end_time').val(t_end_train);
                $("#train_example_count").text("样本数：" + data["example_count"])
                $('.datetimepicker').datetimepicker('refresh');
            }
        }
    });



    var t_begin_evaluate = new Date(2018,09,12,00,00,00).format(data_format_str);
    var t_end_evaluate = new Date(2018,09,12,23,59,59).format(data_format_str);
    $('#evaluate_begin_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#evaluate_end_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#evaluate_begin_time').val(t_begin_evaluate);
    $('#evaluate_end_time').val(t_end_evaluate);

    $('#evaluate_file_selected').change(function () {
        var file = $(this).children('option:selected').val();
        var url = "/overweight-analysis/getTime";
        var response = webRequest(url, "GET", false, {"type" : "evaluatefile","filename":file+".csv"});
        if(response!=null && response.status==0){
            var data = response.data;
            for(var key in data){
                if (key == "begin_time"){
                    console.log(data[key].toString().substring(0,4));
                    t_begin_evaluate = new Date(parseInt(data[key].toString().substring(0,4)),parseInt(data[key].toString().substring(4,6))-1,parseInt(data[key].toString().substring(6,8)),parseInt(data[key].toString().substring(8,10)),parseInt(data[key].toString().substring(10,12)),parseInt(data[key].toString().substring(12))).format(data_format_str);
                }else if (key == "end_time"){
                    t_end_evaluate = new Date(parseInt(data[key].toString().substring(0,4)),parseInt(data[key].toString().substring(4,6))-1,parseInt(data[key].toString().substring(6,8)),parseInt(data[key].toString().substring(8,10)),parseInt(data[key].toString().substring(10,12)),parseInt(data[key].toString().substring(12))).format(data_format_str);
                }
                $('#evaluate_begin_time').val(t_begin_evaluate);
                $('#evaluate_end_time').val(t_end_evaluate);
                $('.datetimepicker').datetimepicker('refresh');
            }
        }
    });

    var t_begin_test = new Date(2018,09,13,00,00,00).format(data_format_str);
    var t_end_test = new Date(2018,09,13,23,59,59).format(data_format_str);
    $('#test_begin_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#test_end_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#test_begin_time').val(t_begin_test);
    $('#test_end_time').val(t_end_test);

    $('#test_file_selected').change(function () {
        var file = $(this).children('option:selected').val();
        var url = "/overweight-analysis/getTime";
        var response = webRequest(url, "GET", false, {"type" : "testfile","filename":file+".csv"});
        if(response!=null && response.status==0){
            var data = response.data;
            for(var key in data){
                if (key == "begin_time"){
                    console.log(data[key].toString().substring(0,4));
                    t_begin_test = new Date(parseInt(data[key].toString().substring(0,4)),parseInt(data[key].toString().substring(4,6))-1,parseInt(data[key].toString().substring(6,8)),parseInt(data[key].toString().substring(8,10)),parseInt(data[key].toString().substring(10,12)),parseInt(data[key].toString().substring(12))).format(data_format_str);
                }else if (key == "end_time"){
                    t_end_test = new Date(parseInt(data[key].toString().substring(0,4)),parseInt(data[key].toString().substring(4,6))-1,parseInt(data[key].toString().substring(6,8)),parseInt(data[key].toString().substring(8,10)),parseInt(data[key].toString().substring(10,12)),parseInt(data[key].toString().substring(12))).format(data_format_str);
                }
                $('#test_begin_time').val(t_begin_test);
                $('#test_end_time').val(t_end_test);
                $('.datetimepicker').datetimepicker('refresh');
            }
        }
    });


    $("#description_train_dataformat").click(function(){
        var popoverEl = $("#description_train_dataformat");
        popoverEl.popover("destroy");
        // var content = "{<br/>"+
        //     "feature1,feature2,feature3,label<br/>"+
        //     "}";
        // var content = "data1 : float<br/>" + "data2 : float<br/>" + "data3 : float<br/>" + "data4 : float<br/>" + "data5 : float<br/>"
        //             + "data6 : float<br/>" + "data7 : float<br/>" + "data8 : float<br/>" + "data9 : float<br/>" + "data10 : float<br/>"
        //             + "data11 : float<br/>" + "data12 : float<br/>" + "data13 : float<br/>" + "data14 : float<br/>" + "data15 : float<br/>"
        //             + "label : integer<br/>" + "bridge : string<br/>" + "time : string"
        // popoverEl.attr("data-content", content);
        // popoverEl.popover("show");
        var str = "UY1,UY2,UY3,UY4,UY5,UY6,UY7,UY8,UY9,UY10,UY11,UY12,UY13,UY14,UY15,label,bridge,time\n";
        var url = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
        var link = document.createElement("a");
        link.href = url;
        link.download = 'example_train.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    });

    $("#description_label_format").click(function(){
        var popoverEl = $("#description_label_format");
        popoverEl.popover("destroy");
        // var content = "{<br/>"+
        //     "feature1,feature2,feature3,label<br/>"+
        //     "}";
        // var content = "data1 : float<br/>" + "data2 : float<br/>" + "data3 : float<br/>" + "data4 : float<br/>" + "data5 : float<br/>"
        //             + "data6 : float<br/>" + "data7 : float<br/>" + "data8 : float<br/>" + "data9 : float<br/>" + "data10 : float<br/>"
        //             + "data11 : float<br/>" + "data12 : float<br/>" + "data13 : float<br/>" + "data14 : float<br/>" + "data15 : float<br/>"
        //             + "label : integer<br/>" + "bridge : string<br/>" + "time : string"
        // popoverEl.attr("data-content", content);
        // popoverEl.popover("show");
        var str = "s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14,s15\n";
        var url = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
        var link = document.createElement("a");
        link.href = url;
        link.download = 'example_label.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    });

    $("#description_evaluate_dataformat").click(function(){
        var popoverEl = $("#description_evaluate_dataformat");
        popoverEl.popover("destroy");
        // var content = "{<br/>"+
        //     "feature1,feature2,feature3,label<br/>"+
        //     "}";
        // var content = "data1 : float<br/>" + "data2 : float<br/>" + "data3 : float<br/>" + "data4 : float<br/>" + "data5 : float<br/>"
        //     + "data6 : float<br/>" + "data7 : float<br/>" + "data8 : float<br/>" + "data9 : float<br/>" + "data10 : float<br/>"
        //     + "data11 : float<br/>" + "data12 : float<br/>" + "data13 : float<br/>" + "data14 : float<br/>" + "data15 : float<br/>"
        //     + "label : integer<br/>" + "bridge : string<br/>" + "time : string";
        // popoverEl.attr("data-content", content);
        // popoverEl.popover("show");
        var str = "UY1,UY2,UY3,UY4,UY5,UY6,UY7,UY8,UY9,UY10,UY11,UY12,UY13,UY14,UY15,label,bridge,time\n";
        var url = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
        var link = document.createElement("a");
        link.href = url;
        link.download = 'example_evaluate.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    });

    $("#description_test_dataformat").click(function(){
        var popoverEl = $("#description_test_dataformat");
        popoverEl.popover("destroy");
        // var content = "{<br/>"+
        //     "feature1,feature2,feature3<br/>"+
        //     "}";
        // var content = "data1 : float<br/>" + "data2 : float<br/>" + "data3 : float<br/>" + "data4 : float<br/>" + "data5 : float<br/>"
        //     + "data6 : float<br/>" + "data7 : float<br/>" + "data8 : float<br/>" + "data9 : float<br/>" + "data10 : float<br/>"
        //     + "data11 : float<br/>" + "data12 : float<br/>" + "data13 : float<br/>" + "data14 : float<br/>" + "data15 : float<br/>"
        //     + "bridge : string<br/>" + "time : string";
        // popoverEl.attr("data-content", content);
        // popoverEl.popover("show");
        var str = "UY1,UY2,UY3,UY4,UY5,UY6,UY7,UY8,UY9,UY10,UY11,UY12,UY13,UY14,UY15,bridge,time\n";
        var url = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
        var link = document.createElement("a");
        link.href = url;
        link.download = 'example_test.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    });

    $("#description_modelformat").click(function(){
        var popoverEl = $("#description_modelformat");
        popoverEl.popover("destroy");
        var content =
            "python文件<br/>"+
            "param1 : 训练文件路径<br/>"+
            "param2 : 模型保存路径<br/>";
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
            showModalDialog("提示", "<div style='text-align:center;'>文件正在上传...</div>",function(){},150,40);
        }
        //更新下拉列表
        updateDropdownListTrainFile();
    }).on('fileuploaderror', function (event, data, msg) {
        var response = data.response;
        console.log("data");
        console.log(data);
        var msg = "仅支持csv且单文件大小不超过50MB！";
        if(response!=null && response.msg!="") msg = response.msg;
        console.log(msg);
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
            showModalDialog("提示", "<div style='text-align:center;'>文件正在上传...</div>",function(){},150,40);
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

    $("#trainlabel_upload").fileinput({
        allowedFileExtensions: ['csv'],
        uploadUrl: "overweight-analysis/trainlabelupload",
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
        // updateDropdownListTrainModel();
    }).on('fileuploaderror', function (event, data, msg) {
        var response = data.response;
        console.log("data");
        console.log(data);
        var msg = "仅支持csv且单文件大小不超过50MB！";
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
        maxFileSize: 512000, // KB,当前限制为50MB, 如果为0则不限制
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
        console.log(msg);
        showTransientDialog(msg);
    });

    var train_mode = 0;
    $('#train-tab li').click(function () {
        train_mode = $(this).index();
    });

    $("#train_start").click(function () {
        if (train_mode == 0){
            var train_file = $("#train_file_selected").val();
            var train_model = $("#train_model_selected").val();
            // var train_bridge = $("#train_bridge_selected").val();
            var saved_model = $("#saved_model").val();
            var train_label = $("#train_label_selected").val()
            var model_type = $("#train_single_model_type_selected").val() != -1?$("#train_single_model_type_selected option:selected").val():$("#train_multi_model_type_selected option:selected").val()
            var epochs = $("#epochs").val()
            var lr = $("#lr").val()
            var batch_size = $("#batch_size").val()
            console.log(model_type);
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
            // if(train_bridge == null){
            //     showTransientDialog("请选择分析桥梁");
            //     //showDialog("请选择训练模型");
            //     return;
            // }
            if(!saved_model){
                showTransientDialog("请输入保存模型名称");
                //showDialog("请输入保存模型名称");
                return;
            }
            if(!train_label){
                showTransientDialog("请选择训练标签");
                return;
            }
            if(!model_type){
                showTransientDialog("请选择模型类型");
                return;
            }
            if (!epochs || !lr || !batch_size){
                showTransientDialog("请输入参数")
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
                    "trainfile" : train_file + ".csv",
                    "trainmodel" : train_model,
                    "savedmodel" : saved_model,
                    // "bridge" : train_bridge,
                    "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                    "endtime" : new Date(end_time).format("yyyyMMddHHmmss"),
                    "trainlabel" : train_label +".csv",
                    "trainmodeltype" : model_type,
                    "epochs" : epochs,
                    "lr" : lr,
                    "batch_size" : batch_size,
                }),
                dataType: "json",
                beforeSend: function () {
                    $("#train_start").text('训练中...');
                    $("#train_process").removeAttr("value");
                    $("#ov_train_computing").show();

                    // set_progress();
                    // timer = setInterval("set_progress()", 10000);

                    // function set_progress() {
                    //     var current = $("#train_process").val();
                    //     $("#train_process").val(current + 5);
                    // }
                    // var content = '' +
                    //     ' <div style="width: 200px; text-align:center;"><img alt="loadding" src="/assets/img/loading.gif" style="margin-bottom: 20px;"/><p>计算中，请耐心等待...</p></div> \
                    //     '
                    // d = dialog({
                    //     content: content
                    // });
                    // d.showModal();
                },
                success: function(response) {
                    $("#ov_train_computing").hide();
                    // d.close();
                    // window.clearInterval(timer);
                    // timer = setInterval("set_progress()", 10);
                    // // // sleep(2000);
                    // window.clearInterval(timer);
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
                    // alert("提交任务失败");
                }

            });
        }
        else if (train_mode == 1){
            var train_model = $("#spy_train_model_selected").val();
            var train_bridge = $("#spy_train_bridge_selected").val();
            var saved_model = $("#saved_model").val();
            var train_label = $('#spy_train_label_selected').val()
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
            if(!train_label){
                showTransientDialog("请选择训练标签");
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
                url: "/overweight-analysis/trainCGQ",
                type: "POST",
                async: true,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    "trainmodel" : train_model,
                    "savedmodel" : saved_model,
                    "bridge" : train_bridge,
                    "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                    "endtime" : new Date(end_time).format("yyyyMMddHHmmss"),
                    "trainlabel" :train_label,
                }),
                dataType: "json",
                beforeSend: function () {
                    $("#train_start").text('训练中...');
                    $("#train_process").removeAttr("value");
                    $("#ov_train_computing").show();
                },
                success: function(response) {
                    $("#ov_train_computing").hide();
                    var data = response.data;
                    var result = data['result'];
                    if (result == 'success') {
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

                },
                error: function(response) {
                    //showTransientDialog('调用失败！')
                    alert("提交任务失败");
                }

            });
        }

    });

    // $("#test_start").click(function () {
    //     var test_file = $("#test_file_selected").val();
    //     var test_model = $("#test_model_selected").val();
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
    //             $("#test_start").text('识别中...');
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
    //                 showDialog("识别完成")
    //             } else {
    //                 showTransientDialog('识别失败！')
    //             }
    //         },
    //         complete:function () {
    //             $("#test_start").text("开始识别");
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
  //           showTransientDialog("请选择识别文件");
  //           return;
  //       }
  //       if(test_model == null){
  //           showTransientDialog("请选择识别模型");
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
        var model_type = $("#evaluate_single_model_type_selected").val() != -1?$("#evaluate_single_model_type_selected option:selected").val():$("#evaluate_multi_model_type_selected option:selected").val();

        // var bridge = $("#evaluate_bridge_selected").val();

        if(evaluate_file == null){
            showTransientDialog("请选择验证文件");
            return;
        }
        if(evaluate_model == null){
            showTransientDialog("请选择验证模型");
            //showDialog("请选择训练模型");
            return;
        }
        if(model_type == null){
            showTransientDialog("请选择模型类型")
            return;
        }
        // if(bridge == null){
        //     showTransientDialog("请选择分析桥梁");
        //     return;
        // }
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
                "evaluatefile" : evaluate_file + ".csv",
                // "bridge" : bridge,
                "evaluatemodel" : evaluate_model + ".h5",
                "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                "endtime" : new Date(end_time).format("yyyyMMddHHmmss"),
                "modelType" : model_type,
            }),
            dataType: "json",
            beforeSend: function () {
                $("#evaluate_start").text('验证中...');
                $("#evaluate_process").removeAttr("value");
                $("#ov_evaluate_computing").show();
            },
            success: function(response) {
                $("#ov_evaluate_computing").hide();
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

    var test_mode = 0;
    $('#test-tab li').click(function () {
        test_mode = $(this).index();
    });

    $("#test_start").click(function () {
        if (test_mode == 0){
            var test_file = $("#test_file_selected").val();
            var test_model = $("#test_model_selected").val();
            var bridge = $("#test_bridge_selected").val();
            var model_type = $("#test_single_model_type_selected").val() != 0?$("#test_single_model_type_selected option:selected").val():$("#test_multi_model_type_selected option:selected").val()

            if(test_file == null){
                showTransientDialog("请选择识别文件");
                return;
            }
            if(test_model == null){
                showTransientDialog("请选择识别模型");
                //showDialog("请选择训练模型");
                return;
            }
            if (model_type == null){
                showTransientDialog("请选择模型类型");
                return;
            }
            // if(bridge == null){
            //     showTransientDialog("请选择分析桥梁");
            //     return;
            // }
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
                    "testfile" : test_file + ".csv",
                    // "bridge" : bridge,
                    "testmodel" : test_model + ".h5",
                    "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                    "endtime" : new Date(end_time).format("yyyyMMddHHmmss"),
                    "modelType" : model_type,
                }),
                dataType: "json",
                beforeSend: function () {
                    $("#test_start").text('识别中...');
                    $("#test_process").removeAttr("value");
                    $("#ov_test_computing").show();
                },
                success: function(response) {
                    $("#ov_test_computing").hide();
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
                    $("#test_start").text("开始识别");
                    $("#test_process").attr("value", "100");
                },
                error: function(response) {
                    alert("提交任务失败");
                }

            });
        }else if (test_mode == 1){
            // var test_bridge = $("#spy_test_bridge_selected").val();
            var test_model = $("#spy_test_model_selected").val();
            var bridge = $("#spy_test_bridge_selected").val();
            var model_type = $("#spy_test_single_model_type_selected").val() != -1?$("#spy_test_single_model_type_selected option:selected").val():$("#spy_test_multi_model_type_selected option:selected").val()

            // if(test_file == null){
            //     showTransientDialog("请选择识别文件");
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
            if(model_type == null){
                showTransientDialog("请选择模型类型");
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
                url: "/overweight-analysis/testCGQ",
                type: "POST",
                async: true,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    // "testfile" : test_file,
                    "bridge" : bridge,
                    "testmodel" : test_model,
                    "begintime" : new Date(begin_time).format('yyyyMMddHHmmss'),
                    "endtime" : new Date(end_time).format("yyyyMMddHHmmss"),
                    "modelType" : model_type,
                }),
                dataType: "json",
                beforeSend: function () {
                    $("#test_start").text('识别中...');
                    $("#test_process").removeAttr("value");
                    $("#ov_test_computing").show();
                },
                success: function(response) {
                    $("#ov_test_computing").hide();
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
                    $("#test_start").text("开始识别");
                    $("#test_process").attr("value", "100");
                },
                error: function(response) {
                    alert("提交任务失败");
                }

            });
        }

    })

    $("#result_overweight").click(function () {
        var test_file = $("#test_file_selected").val();
        var test_model = $("#test_model_selected").val();
        // var bridge = $("#test_bridge_selected").val();
        var begin_time = $("#test_begin_time").val();
        var end_time = $("#test_end_time").val();

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
                "testfile" : test_file +".csv",
                "testmodel" : test_model +".h5",
                // "bridge" : bridge,
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
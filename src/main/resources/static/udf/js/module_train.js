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

function updateDropdownListTrainFileDD(){
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

function updateDropdownListTrainModelDD(){
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

function updateDropdownListSavedModelDD(){
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

function updateDropdownListTrainBridgeDD(){
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

function updateDropdownListTrainLabelDD(){
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

function updateDropdownListTrainModelTypeDD(){
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
    var timer;

    // 超重车
    updateDropdownListTrainFile();
    updateDropdownListTrainModel();
    updateDropdownListSavedModel();
    updateDropdownListTrainBridge();
    updateDropdownListTrainLabel();
    updateDropdownListTrainModelType();

    updateDropdownListTrainFileDD();
    updateDropdownListTrainModelDD();
    updateDropdownListSavedModelDD();
    updateDropdownListTrainBridgeDD();
    updateDropdownListTrainModelTypeDD()

    // 超重车
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

    $("#description_train_dataformat").click(function(){
        var popoverEl = $("#description_train_dataformat");
        popoverEl.popover("destroy");
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
        var str = "s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14,s15\n";
        var url = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
        var link = document.createElement("a");
        link.href = url;
        link.download = 'example_label.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

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
                    alert("提交任务失败");
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


    //损伤
    $("#dd_description_train_dataformat").click(function(){
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

    $("#dd_train_start").click(function () {
        var train_file = $("#dd_train_file_selected").val();
        var train_model = $("#dd_train_model_selected").val();
        var saved_model = $("#dd_saved_model").val();
        var model_type = $("#dd_train_modeltype_selected option:selected").val();
        var epochs = $("#dd_epochs").val();
        var batch_size = $("#dd_batch_size").val();
        var sample = $("#dd_sample").val();

        if(train_file == null){
            showTransientDialog("请选择训练文件");
            return;
        }
        if(train_model == null){
            showTransientDialog("请选择训练模型");
            return;
        }
        if(!saved_model){
            showTransientDialog("请输入保存模型名称");
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
            },
            success: function(response) {
                $("#dd_train_computing").hide();
                var data = response.data;
                var result = data['result'];
                if (result == 'success') {
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
                updateDropdownListSavedModelDD();
            },
            error: function(response) {
                alert("提交任务失败");
            }
        });
    })
});
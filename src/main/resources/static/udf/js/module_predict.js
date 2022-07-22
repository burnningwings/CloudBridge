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

//损伤
function updateDropdownListTestFileDD(){
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

function updateDropdownListTestBridgeDD(){
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


//初始化
$(function () {
    var timer;

    updateDropdownListTestFile()
    updateDropdownListSavedModel();
    updateDropdownListTestBridge();
    updateDropdownListTestModelType();
    updateDropdownListSpyTestModelType();

    updateDropdownListTestFileDD();
    updateDropdownListSavedModelDD();
    updateDropdownListTestBridgeDD();

    var data_format_str = 'yyyy-MM-dd HH:mm:ss';
    var current_time = new Date().format(data_format_str);
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



    $("#description_test_dataformat").click(function(){
        var popoverEl = $("#description_test_dataformat");
        popoverEl.popover("destroy");
        var str = "UY1,UY2,UY3,UY4,UY5,UY6,UY7,UY8,UY9,UY10,UY11,UY12,UY13,UY14,UY15,bridge,time\n";
        var url = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
        var link = document.createElement("a");
        link.href = url;
        link.download = 'example_test.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    });



    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    $(document).ajaxSend(function(e, xhr, options) {
        xhr.setRequestHeader(header, token);
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

    //损伤
    var data_format_str = 'yyyy-MM-dd HH:mm:ss';
    var current_time = new Date().format(data_format_str);
    var t_begin_train = new Date(2014,05,14,00,00,00).format(data_format_str);
    var t_end_train = new Date(2018,05,12,18,00,00).format(data_format_str);

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

    $("#dd_description_test_dataformat").click(function(){
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

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    $(document).ajaxSend(function(e, xhr, options) {
        xhr.setRequestHeader(header, token);
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

    var dd_test_mode = 0;
    $('#dd_test-tab li').click(function () {
        dd_test_mode = $(this).index();
    });
    $("#dd_test_start").click(function () {
        if (dd_test_mode == 0){
            var test_file = $("#dd_test_file_selected").val();
            var test_model = $("#dd_test_model_selected").val();
            // var bridge = $("#dd_test_bridge_selected").val();

            if(test_file == null){
                showTransientDialog("请选择识别文件");
                return;
            }
            if(test_model == null){
                showTransientDialog("请选择识别模型");
                return;
            }
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
                    "testmodel" : test_model + ".h5",
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
        }else if (dd_test_mode == 1){
            var test_model = $("#spy_dd_test_model_selected").val();
            var bridge = $("#spy_dd_test_bridge_selected").val();
            if(test_model == null){
                showTransientDialog("请选择识别模型");
                return;
            }
            if(bridge == null){
                showTransientDialog("请选择分析桥梁");
                return;
            }
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
                    "bridge" : bridge,
                    "testmodel" : test_model + ".h5",
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

});
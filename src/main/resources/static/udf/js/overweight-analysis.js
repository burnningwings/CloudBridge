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
            var data = message["data"]["predictresult"];
            console.log(data);
            var index = [];
            for(var i=0; i<data.length;i++)
            {
                index.push(i+1);
            }
            console.log(index);
            showPredictResultChart(figure_id, data, index);
        }
    }
    var url = "/overweight-analysis/getPredictResult";
    webRequest(url, "GET", true, params,successCaller);
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

    $("#description_model").click(function(){
        var popoverEl = $("#description_model");
        popoverEl.popover("destroy");
        //var content = "贝叶斯超级厉害的<br/>超级超级厉害的<br/>" +
        //            "没有什么模型比贝叶斯更厉害了<br/>关你什么事<br/>";
        content = "";
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

    $("#train_start").click(function () {
        var train_file = $("#train_file_selected").val();
        var train_model = $("#train_model_selected").val();
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
        if(!saved_model){
            showTransientDialog("请输入保存模型名称");
            //showDialog("请输入保存模型名称");
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
                "savedmodel" : saved_model
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
                } else {
                    showTransientDialog('训练失败！')
                }
            },
            complete:function () {
                $("#train_start").text("开始训练");
                $("#train_process").attr("value", "100");
                updateDropdownListSavedModel();
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

    $("#test_start").click(function () {
        var test_file = $("#test_file_selected").val();
        var test_model = $("#test_model_selected").val();
        //console.log(saved_model);
        if (test_file == null){
            showTransientDialog("请选择预测文件");
            //showDialog("请选择训练文件");
            return;
        }
        if(test_model == null){
            showTransientDialog("请选择预测模型");
            //showDialog("请选择训练模型");
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
            url: "/overweight-analysis/test",
            type: "POST",
            async: true,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "testfile" : test_file,
                "testmodel" : test_model
            }),
            dataType: "json",
            beforeSend: function () {
                $("#test_start").text('预测中...');
                $("#test_process").removeAttr("value");
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
                    showDialog("预测完成")
                } else {
                    showTransientDialog('预测失败！')
                }
            },
            complete:function () {
                $("#test_start").text("开始预测");
                $("#test_process").attr("value", "100");

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

  //  $("#train_file_selected").onclick(updateDropdownListTrainFile())
    $("#result_overweight").click(function () {
        var test_file = $("#test_file_selected").val();
        var test_model = $("#test_model_selected").val();
        if(test_file == null){
            showTransientDialog("请选择预测文件");
            return;
        }
        if(test_model == null){
            showTransientDialog("请选择预测模型");
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
                    "testmodel" : test_model
                }
            var current_dialog = $(this);
            getAndshowPredictResult(figure_id, current_dialog, param);
        })
        // var response = null;
        // var param ={
        //     "testfile" : JSON.stringify(test_file),
        //     "testmodel" : JSON.stringify(test_model)
        // }

        // $.ajax({
        //     url: "/overweight-analysis/result_show",
        //     type: "GET",
        //     async: true,
        //     contentType: "application/json; charset=utf-8",
        //     data: JSON.stringify({
        //         "testfile" : test_file,
        //         "testmodel" : test_model
        //     }),
        //     dataType: "json",
        //     beforeSend: function () {
        //
        //     },
        //     success: function(response) {
        //
        //     },
        //     complete:function () {
        //
        //     },
        //     error: function(response) {
        //         alert("提交任务失败");
        //     }
        // });
    });
});
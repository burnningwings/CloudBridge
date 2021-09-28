function updateDropdownListAssociationFile(){
    $("#association_file_selected").empty();
    var url = "/association-analysis/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "associationfile"});
    var options ="<option value=\'\' disabled selected>请选择关联文件</option>"
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
            var temp1 = message["data"]["temp1"];
            var temp2 = message["data"]["temp2"];
            var analysisresult = message["data"]["analysisresult"];
            console.log(temp1);
            console.log(temp2);
            console.log(analysisresult);
            showAnalysisResultChart(figure_id, temp1, temp2, analysisresult);
        }
    }

    var url = "/association-analysis/getAnalysisResult";
    webRequest(url, "GET", true, params, successCallback)
}

//初始化
$(function () {

    updateDropdownListAssociationFile();

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
        //console.log(saved_model);
        if (association_file == null){
            showTransientDialog("请选择关联文件");
            //showDialog("请选择训练文件");
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
                "associationfile" : association_file
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

        if(association_file == null){
            showTransientDialog("请选择关联文件");
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
                "associationfile" : association_file
            }
            var current_dialog = $(this);
            getAndshowAnalysisResult(figure_id, current_dialog, param);
        })

    });
    
})
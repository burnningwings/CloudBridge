function updateDropdownListWaveletFile(){
    $("#wavelet_file_selected").empty();
    var url = "/wavelet-analysis/dropdown";
    var response = webRequest(url, "GET", false, {"type" : "waveletfile"});
    var options ="<option value=\'\' disabled selected>请选择文件</option>"
    if(response!=null && response.status==0){
        var data = response.data;
        for(var key in data){
            options = options + "<option>" + key + "</option>";
        }
    }
    $("#wavelet_file_selected").append(options);
    $("#wavelet_file_selected").selectpicker('refresh');

}

function getAndshowWaveletFigure(figure_id, current_dialog, params){

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
            var temperatureList = message["data"]["temperatureList"];
            var strainList = message["data"]["strainList"];
            showWaveletResultChart(figure_id, timeList, temperatureList, strainList);
        }
    }
    console.log(params);
    var url ="/wavelet-analysis/getWaveletResult";
    webRequest(url, "GET", true, params, successCallback);
}

$(function () {

    updateDropdownListWaveletFile();

    //初始化时间选择器
    var data_format_str = 'yyyy-MM-dd HH:mm:ss';
    var current_time = new Date().format(data_format_str);

    $('#wavelet_begin_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#wavelet_end_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#wavelet_begin_time').val(current_time);
    $('#wavelet_end_time').val(current_time)

    $("#wavelet_file_dataformat").click(function(){
        var popoverEl = $("#wavelet_file_dataformat");
        popoverEl.popover("destroy");
        var content = "{<br/>"+
            "time,strain,A7,strain-D7,D6,65,D4,D3,D2,D1,T,A7,Temperature-D7,D6,D5,D4,D3,D2,D1<br/>"+
            "}";
        popoverEl.attr("data-content", content);
        popoverEl.popover("show");

    });

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    $(document).ajaxSend(function(e, xhr, options) {
        xhr.setRequestHeader(header, token);
    });

    $("#wavelet_file_upload").fileinput({
        allowedFileExtensions: ['csv'],
        uploadUrl: "wavelet_analysis/waveletFileUpload",
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
        updateDropdownListWaveletFile();
    }).on('fileuploaderror', function (event, data, msg) {
        var response = data.response;
        console.log("data");
        console.log(data);
        var msg = "仅支持csv且单文件大小不超过50MB！";
        if(response!=null && response.msg!="") msg = response.msg;
        console.log(msg);
        showTransientDialog(msg);
    });

    $("#wavelet_analysis_result").click(function () {
        var wavelet_file =$("#wavelet_file_selected").val();
        var wavelet_layer = $("#wavelet_layer_selected").val();

        if (wavelet_file == null){
            showTransientDialog("请选择文件");
            return;
        }else if(wavelet_layer == null){
            showTransientDialog("请选择层数");
            return;
        }else{
            // var token = $("meta[name='_csrf']").attr("content");
            // var header = $("meta[name='_csrf_header']").attr("content");
            // $(document).ajaxSend(function(e, xhr, options) {
            //     xhr.setRequestHeader(header, token);
            // });
            var figure_id = "wavelet_show_result_figure";
            $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/loading.gif'/>");
            $(this).button('loading').delay(1000).queue(function() {
                // 访问数据
                var begin_time = $('#wavelet_begin_time').val();
                var end_time = $('#wavelet_end_time').val();
                if(begin_time>=end_time){
                    $(this).button('reset').dequeue();
                    $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/warning.png'/>");
                    showTransientDialog("开始时间必须小于截止时间！");
                    return;
                }
                console.log(wavelet_layer)
                console.log(new Date(begin_time).format('yyyyMMddHHmmssSS'))
                var params = {
                    "waveletfile": wavelet_file,
                    "waveletlayer": wavelet_layer,
                    "starttime": new Date(begin_time).format('yyyyMMddHHmmssSS'),
                    "endtime": new Date(end_time).format('yyyyMMddHHmmssSS'),
                };

                // 返回后调用
                var current_dialog = $(this);
                getAndshowWaveletFigure(figure_id,current_dialog,params);
            });
        }


    })
})
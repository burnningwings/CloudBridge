

function updateDropdownListTrainModel(){
    $("#mu_model").empty();
    var options ="<option value=\'\' disabled selected>请选择模型功能</option>" +
        "<option value='1'>超重车识别</optionva>" +
        "<option value='2'>损伤识别</option>" +
        "<option value='3'>关联性分析</option>" +
        "<option value='4'>可靠度分析</option>"
    $("#mu_model").append(options);
    $("#mu_model").selectpicker('refresh');
}

function bridgeListDropdown() {
    var url = "/bridge/simple-list";
    var response = webRequest(url, "GET", false, {});
}

function testUpload() {
    var url = "module-manager/trainmodelupload";
    var response = webRequest(url, "GET", false, {});
}

//初始化
$(function () {

    updateDropdownListTrainModel();
    bridgeListDropdown();
    // testUpload();

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    $(document).ajaxSend(function(e, xhr, options) {
        xhr.setRequestHeader(header, token);
    });

    $("#trainmodel_upload").fileinput({
        allowedFileExtensions: ['py'],
        uploadUrl: "/module-manager/trainmodelupload",
        language: 'zh',
        uploadAsync: true,
        showUpload: true,
        maxFileCount: 1,
        autoReplace: true,
        // showPreview: false,
        maxFileSize: 512000, // KB,当前限制为50MB
        maxPreviewFileSize: 1,
        // dropZoneEnabled: false
        uploadExtraData: function() {
            return {
                uploader_name : $('#username').text(),
                feature : $('#mu_model option:selected').text()
            };
        }
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
});
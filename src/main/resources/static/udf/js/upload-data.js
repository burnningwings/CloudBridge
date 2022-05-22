
function updateDropdownMenu(response){
    var data = null
    var bridge_options = "";
    var section_options = "";
    var point_options = "";
    var box_options = "";
    var sensor_type_options = "";
    var sensor_options = "";
    var sensor_info = {};
    if(response!=null && response.status==0){
        data = response.data;
        console.log(data)
        bridge_options = bridge_options + "<option value='" + data["bridge_id"] + "'>" + data["bridge"][data["bridge_id"]] + "</option>";
        for(var key in data["bridge"]){
            if(key==data["bridge_id"]) continue;
            bridge_options = bridge_options + "<option value='" + key + "'>" + data["bridge"][key] + "</option>";
        }
        for(var key in data["bridge_detail"]){
            section_options += '<option value="' + key +'">' + data["bridge_detail"][key]["name"] + "</option>";
        }
        $('#section_menu').empty();
        $('#section_menu').append(section_options);

        var section_selected = $('#section_menu').val();
        for(var key in data["bridge_detail"][section_selected]){
            if(key=="name") continue;
            point_options += '<option value="' + key +'">' + data["bridge_detail"][section_selected][key]["name"] + "</option>";
        }
        $('#point_menu').empty();
        $('#point_menu').append(point_options);

        var point_selected = $('#point_menu').val();
        for(var key in data["bridge_detail"][section_selected][point_selected]){
            if(key == "name") continue;
            box_options = box_options + "<option value='" + key +"'>" + data["bridge_detail"][section_selected][point_selected][key]["name"] + "</option>";
        }
        $('#box_menu').empty();
        $('#box_menu').append(box_options);

        var box_selected = $('#box_menu').val();
        var sensor_dict = data["bridge_detail"][section_selected][point_selected][box_selected]["sensor"];
        for(var sensor_id in sensor_dict){
            var sensor_name = sensor_dict[sensor_id];
            var sensor_name_list = sensor_name.split(" - ");
            var sensor_number = sensor_name_list[0];
            var sensor_type = sensor_name_list[1];
            if(sensor_info.hasOwnProperty(sensor_type)){
                sensor_info[sensor_type].push([sensor_id,sensor_number]);
            }else{
                sensor_info[sensor_type] = [[sensor_id,sensor_number]];
            }
        }
        // for(var key in data["bridge_detail"][section_selected][point_selected]){
        //     var sensor_dict = data["bridge_detail"][section_selected][point_selected][box_selected]["sensor"];
        //     for(var sensor_id in sensor_dict){
        //         var sensor_name = sensor_dict[sensor_id];
        //         var sensor_name_list = sensor_name.split(" - ");
        //         var sensor_number = sensor_name_list[0];
        //         var sensor_type = sensor_name_list[1];
        //         if(sensor_info.hasOwnProperty(sensor_type)){
        //             sensor_info[sensor_type].push([sensor_id,sensor_number]);
        //         }else{
        //             sensor_info[sensor_type] = [[sensor_id,sensor_number]];
        //         }
        //     }
        // }
        // key为传感器类型
        console.log(sensor_info)
        for(var key in sensor_info){
            sensor_type_options = sensor_type_options + "<option value='" + key + "'>" + key + "</option>";
        }
    }

    $("#bridge_menu").empty();
    $("#sensor_type_menu").empty();
    $("#sensor_menu").empty();

    $("#bridge_menu").append(bridge_options);
    $("#sensor_type_menu").append(sensor_type_options);
    var sensor_type_selected = $("#sensor_type_menu").val();
    if(sensor_type_selected && !(sensor_type_selected.match(/^\s*$/))){
        var sensor_list = sensor_info[sensor_type_selected];
        for(var key in sensor_list){
            sensor_options = sensor_options + "<option value='" + sensor_list[key][0] + "'>" + sensor_list[key][1] + "</option>";
        }
    }
    $("#sensor_menu").append(sensor_options);
    if(sensor_list && sensor_list.length){
        $("#sensor_menu").selectpicker('val', sensor_list[0][0]);
        $('#f_upload').prop("disabled", false);
    }else{
        $('#f_upload').prop("disabled", true);
    }
    $('.selectpicker').selectpicker('refresh');
    console.log(sensor_info)
    return sensor_info;
}

function updateMessageGrid(){
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                type: "get",
                url: "/upload-data/message/list",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (options, operation) {

                if (operation == "read") {
                    var parameter = {
                        page: options.page,
                        pageSize: options.pageSize
                    };
                    return parameter;
                }
            }
        },
        batch: true,
        pageSize: 10,
        schema: {
            data: function (d) {
                return d.data;
            },
            total: function (d) {
                return d.total;
            }
        },
        serverPaging: true
    });

    $("#message-grid").kendoGrid({
        dataSource: dataSource,
        pageable: {
            // pageSizes: true,
            pageSizes: [5,10,20],
            buttonCount: 1, // 限制其不能点击对应页
            messages: {
                display: "{0} - {1} 共 {2} 条数据",
                empty: "没有数据",
                page: "页",
                of: "/ {0}",
                itemsPerPage: "条每页",
                first: "第一页",
                previous: "前一页",
                next: "下一页",
                last: "最后一页",
                refresh: "刷新"
            }
        },
        columns: [
            {
                field: "bridge",
                title: "桥梁",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "section",
                title: "截面",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "point",
                title: "测点",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "watch_box",
                title: "控制箱",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "sensor",
                title: "传感器类型",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "target",
                title: "传感器编号",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "source",
                title: "原文件名称",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "status",
                title: "上传状态",
                template: '#if(status == "FINISHED") {# ' + '完成'+ '# } else { #' + '失败' + '# } #',
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            },{
                field: "last_update",
                title: "最近更新时间",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                title: "操作",
                template: '<button class="btn btn-primary" title="删除" type="button" onclick="deleteSensor(\'#: id #\',\'#: target #\',\'#: source #\')"/>删除</button>&nbsp;',
                // template: '<button class="btn btn-primary" title="重新上传" type="button" onclick="reUpload(\'#: id #\')"/>上传</button>&nbsp;<button class="btn btn-success" type="button" onclick="browseUploadLog(\'#: id #\')"/>查看日志</button>',
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }
        ]
    });
}

function deleteSensor(id,target,source){
    function callback(){
        var response = webRequest("/upload-data/delete","GET",false,{"id":id,"originFileName":source,"sensor_number":target});
        console.log(response)
        if(response!=null && response.status==0){
            updateMessageGrid();
            showModalDialog("提示", "<div style='text-align:center;'>文件正在删除...</div>",function(){},120,40);
        }else{
            showTransientDialog(response.msg);
        }
    }
    showAlertDialog("确定删除？",callback);
}
function reUpload(id){
    function callback(){
        var response = webRequest("/upload-data/upload","GET",false,{"id":id});
        console.log(response)
        if(response!=null && response.status==0){
            updateMessageGrid();
            showModalDialog("提示", "<div style='text-align:center;'>文件正在上传...</div>",function(){},120,40);
        }else{
            showTransientDialog(response.msg);
        }
    }
    showAlertDialog("确定重新上传？",callback);
}

function browseUploadLog(id){
    var response = webRequest("/message/log","GET",false,{"id":id});
    console.log(response)
    if(response!=null && response.status==0){
        // 替换所有换行符
        showMessageDialog("日志", response.data["error_log"].replace(/\n/g,"<br>"), function(){},400,100);
    }else{
        showTransientDialog(response.msg);
    }
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

//桥梁列表下拉框
function BridgeListDropdown() {
    var url = "/bridge/simple-list";
    var response = webRequest(url, "GET", false, {});
    var options = "<option value='0'>全部桥梁</option>";
    if (response != null && response['data']) {
        var data = response["data"];
        for (var i = 0; i < data.length; i++) {
            options += "<option value='" + data[i]['bridge_id'] + "'>" + data[i]['bridge_name'] + "</option>";
        }
    }
    var $dropdownMenu1 = $("#bridge_menu");
    $dropdownMenu1.append(options);
    $dropdownMenu1.selectpicker('val', $dropdownMenu1.attr('init-value'));
    $dropdownMenu1.on("changed.bs.select", function () {
        SectionListDropdown($(this).val()); //更新截面列表
        WatchPointListDropdown($('#section_menu').val());
        WatchBoxListDropdown($(this).val());
        SensorListDropdown($(this).val(),$('#section_menu').val(),$('#point_menu').val(),$('#box_menu').val());
    });
}

//截面列表下拉框
function SectionListDropdown(bridgeId, init_value) {
    var options = "<option value='0'>全部截面</option>";
    if (bridgeId != 0) {  //为全部桥梁时不需要获取截面列表
        var url = "/section/simple-list";
        var response = webRequest(url, "GET", false, {'bridgeId': bridgeId});
        if (response != null && response['data']) {
            var data = response["data"];
            for (var i = 0; i < data.length; i++) {
                options += "<option value='" + data[i]['section_id'] + "'>" + data[i]['section_name'] + "</option>";
            }
        }
    }
    var $dropdownMenu2 = $("#section_menu");
    $dropdownMenu2.empty();
    $dropdownMenu2.append(options);
    $dropdownMenu2.selectpicker('refresh');
    if (init_value) { //有初始值 则进行赋值
        $dropdownMenu2.selectpicker('val', init_value);
    }

    $dropdownMenu2.off('changed.bs.select').on("changed.bs.select", function () {

        if (selectIsExitItem($dropdownMenu2,"-1")){
            for (var i =0;i<$dropdownMenu2["0"].options.length;i++){
                if ($dropdownMenu2["0"].options[i].value == "-1"){
                    $dropdownMenu2["0"].remove(i);
                    break;
                }
            }
        }
        if (!selectIsExitItem($('#box_menu'),"-1")){
            var em = "<option value='-1'>未选中</option>";
            $('#box_menu').append(em)
            $('#box_menu').val("-1")
        }
        WatchPointListDropdown($(this).val());

        SensorListDropdown($('#bridge_menu').val(),$('#section_menu').val(),$('#point_menu').val(),0);
    });

}

//监测点下拉列表
function WatchPointListDropdown(sectionId, init_value) {
    var options = "<option value='0'>全部监测点</option>";
    if (sectionId != 0) {  //为全部截面时不需要获取监测点列表
        var url = "/watch-point/simple-list";
        var response = webRequest(url, "GET", false, {'sectionId': sectionId});
        if (response != null && response['data']) {
            var data = response["data"];
            for (var i = 0; i < data.length; i++) {
                options += "<option value='" + data[i]['watch_point_id'] + "'>" + data[i]['watch_point_name'] + "</option>";
            }
        }
    }
    var $dropdownMenu3 = $("#point_menu");
    $dropdownMenu3.empty();
    $dropdownMenu3.append(options);
    $dropdownMenu3.selectpicker('refresh');
    if (init_value) { //有初始值 则进行赋值
        $dropdownMenu3.selectpicker('val', init_value);
    }

    $dropdownMenu3.off('changed.bs.select').on("changed.bs.select", function () {

        if (selectIsExitItem($dropdownMenu3,"-1")){
            for (var i =0;i<$dropdownMenu3["0"].options.length;i++){
                if ($dropdownMenu3["0"].options[i].value == "-1"){
                    $dropdownMenu3["0"].remove(i);
                    break;
                }
            }
        }
        if (!selectIsExitItem($('#box_menu'),"-1")){
            var em = "<option value='-1'>未选中</option>";
            $('#box_menu').append(em)
            $('#box_menu').val("-1")
        }
        SensorListDropdown($('#bridge_menu').val(),$('#section_menu').val(),$('#point_menu').val(),0);
    });
}

//控制箱下拉列表
function WatchBoxListDropdown(bridgeId, init_value) {
    var options = "<option value='0'>全部控制箱</option>";
    if (bridgeId != 0) {  //为全部桥梁时不需要获取控制箱列表
        var url = "/watch-box/simple-list";
        var response = webRequest(url, "GET", false, {'bridgeId': bridgeId});
        if (response != null && response['data']) {
            var data = response["data"];
            for (var i = 0; i < data.length; i++) {
                options += "<option value='" + data[i]['watch_box_id'] + "'>" + data[i]['watch_box_name'] + "</option>";
            }
        }
    }
    var $dropdownMenu4 = $("#box_menu");
    $dropdownMenu4.empty();
    $dropdownMenu4.append(options);
    $dropdownMenu4.selectpicker('refresh');
    if (init_value) { //有初始值 则进行赋值
        $dropdownMenu4.selectpicker('val', init_value);
    }

    $dropdownMenu4.off('changed.bs.select').on("changed.bs.select", function () {

        if (selectIsExitItem($dropdownMenu4,"-1")){
            for (var i =0;i<$dropdownMenu4["0"].options.length;i++){
                if ($dropdownMenu4["0"].options[i].value == "-1"){
                    $dropdownMenu4["0"].remove(i);
                    break;
                }
            }
        }
        if (!selectIsExitItem($('#section_menu'),"-1")){
            var em = "<option value='-1'>未选中</option>";
            $('#section_menu').append(em)
            $('#section_menu').val("-1")
        }
        if (!selectIsExitItem($('#point_menu'),"-1")){
            var em = "<option value='-1'>未选中</option>";
            $('#point_menu').append(em)
            $('#point_menu').val("-1")
        }
        SensorListDropdown($('#bridge_menu').val(),0,0,$('#box_menu').val());
    });
}

//传感器相关下拉列表
function SensorListDropdown(bridge_id, section_id, watch_point_id, watch_box_id, init_value) {
    var url = "/sensor/list";
    if(section_id == -1) section_id = 0;
    if(watch_point_id == -1) watch_point_id = 0;
    if(watch_box_id == -1) watch_box_id = 0;
    var response = webRequest(url, "GET", false, {
        page: 1,
        pageSize: 9223372036854770,
        bridgeId: bridge_id | 0,
        sectionId: section_id | 0,
        watchPointId: watch_point_id | 0,
        watchBoxId: watch_box_id | 0
    });

    if (response != null && response['data']) {
        sensor_detail = {}//清空
        var data = response["data"];
        // var options = "<option value='0'>全部传感器类型</option>";
        var options = "";
        for (var i = 0; i < data.length; i++) {

            // options += "<option value='" + data[i]['sensor_type_name'] + "'>" + data[i]['sensor_number'] + "--" + data[i]['sensor_type_name'] + "</option>";
            // options += "<option value='" + data[i]['sensor_type_name'] + "'>" + data[i]['sensor_type_name'] + "</option>"
            if (!sensor_detail.hasOwnProperty(data[i]['sensor_type_name']))
                sensor_detail[data[i]['sensor_type_name']] = new Array()
            sensor_detail[data[i]['sensor_type_name']][data[i]['sensor_id']] = data[i]['sensor_number'];
        }
        for (key in sensor_detail){
            options += "<option value='" + key +"'>" + key + "</option>"
        }
    } else {
        options += "<option value='0'>无</option>";
    }
    console.log(sensor_detail)
    var $dropdownMenu2 = $("#sensor_type_menu");
    $dropdownMenu2.empty();
    $dropdownMenu2.append(options);
    SensorNumberDropdown($('#sensor_type_menu').children('option:selected').text())
    $dropdownMenu2.selectpicker('refresh');
    if (init_value) { //有初始值 则进行赋值
        $dropdownMenu2.selectpicker('val', init_value);
    }
}

function SensorNumberDropdown(sensor_type,init_value) {
    var options = "<option value='0'>全部传感器</option>";
    for(key in sensor_detail[sensor_type]){
        options += "<option value='" + key + "'>" + sensor_detail[sensor_type][key] + "</option>"
    }
    var $dropdownMenu6 = $('#sensor_menu');
    $dropdownMenu6.empty();
    $dropdownMenu6.append(options);
    $dropdownMenu6.selectpicker('refresh');
    if (init_value){
        $dropdownMenu6.selectpicker('val',init_value);
    }
}

//声明一个全局变量存储传感器详细数据
var sensor_detail = new Array();

// 其它初始化
$(function () {
    // var url = "/query-data/dropdown";
    // var response = webRequest(url,"GET",false,{"bridge_id":"all"})
    // var data = updateDropdownMenu(response);
    // var data_menu = response.data;
    // $('#bridge_menu').change(function(){
    //     var id = $(this).children('option:selected').val();
    //     var response = webRequest(url,"GET",false,{"bridge_id":id})
    //     data_menu = response.data;
    //     data = updateDropdownMenu(response);
    // })
    //
    // $('#section_menu').change(function(){
    //     var section_selected = $(this).children('option:selected').val();
    //     var point_options = "";
    //     for (var key in data_menu["bridge_detail"][section_selected]){
    //         if(key == "name") continue;
    //         point_options = point_options + "<option value='" + key + "'>" + data_menu["bridge_detail"][section_selected][key]["name"] + "</option>";
    //     }
    //     $('#point_menu').empty();
    //     $('#point_menu').append(point_options);
    //     $('#point_menu').trigger("change");
    //     $('.selectpicker').selectpicker('refresh');
    // })
    //
    // $('#point_menu').change(function(){
    //     var section_selected = $('#section_menu').children('option:selected').val();
    //     var point_selected = $(this).children('option:selected').val();
    //     var box_options = "";
    //     for(var key in data_menu["bridge_detail"][section_selected][point_selected]){
    //         if(key == "name") continue;
    //         box_options = box_options + "<option value='" + key + "'>" + data_menu["bridge_detail"][section_selected][point_selected][key]["name"];
    //     }
    //     $('#box_menu').empty();
    //     $('#box_menu').append(box_options);
    //     $('#box_menu').trigger("change");
    //     $('.selectpicker').selectpicker('refresh');
    // })
    //
    // $('#box_menu').change(function(){
    //     var section_selected = $('#section_menu').children('option:selected').val();
    //     var point_selected = $('#point_menu').children('option:selected').val();
    //     var box_selected = $(this).children('option:selected').val()
    //     var sensor_dict = data_menu["bridge_detail"][section_selected][point_selected][box_selected]["sensor"];
    //     var sensor_info = {};
    //     var sensor_type_options = "";
    //     for(var sensor_id in sensor_dict){
    //         var sensor_name = sensor_dict[sensor_id];
    //         var sensor_name_list = sensor_name.split(" - ");
    //         var sensor_number = sensor_name_list[0];
    //         var sensor_type = sensor_name_list[1];
    //         if(sensor_info.hasOwnProperty(sensor_type)){
    //             sensor_info[sensor_type].push([sensor_id,sensor_number]);
    //         }else{
    //             sensor_info[sensor_type] = [[sensor_id,sensor_number]];
    //         }
    //     }
    //     for(var key in sensor_info){
    //         sensor_type_options = sensor_type_options + "<option value='" + key + "'>" + key + "</option>";
    //     }
    //
    //     $("#sensor_type_menu").empty();
    //     $('#sensor_type_menu').append(sensor_type_options);
    //     $('#sensor_type_menu').trigger("change");
    //     data = sensor_info;
    //     $('.selectpicker').selectpicker('refresh');
    // })
    //
    // $('#sensor_type_menu').change(function(){
    //     var sensor_type_selected = $(this).children('option:selected').val();
    //     var sensor_options = "";
    //     var sensor_list = data[sensor_type_selected];
    //     for(var key in sensor_list){
    //         sensor_options = sensor_options + "<option value='" + sensor_list[key][0] + "'>" + sensor_list[key][1] + "</option>";
    //     }
    //     $("#sensor_menu").empty();
    //     $("#sensor_menu").append(sensor_options);
    //     if(sensor_list.length){
    //         $("#sensor_menu").selectpicker('val', sensor_list[0][0]);
    //     }
    //     $('.selectpicker').selectpicker('refresh');
    // })

    BridgeListDropdown();
    SectionListDropdown($('#bridge_menu').val(), $("#section_menu").attr('init-value'));
    WatchPointListDropdown($('#section_menu').val(), $("#point_menu").attr('init-value'));
    WatchBoxListDropdown($('#bridge_menu').val(), $("#watch_box_menu").attr('init-value'));
    SensorListDropdown($('#bridge_menu').val(), $('#section_menu').val(), $('#point_menu').val(), $('#watch_box_menu').val())

    //选择桥梁后-截面、监测点和控制箱列表联动
    $('#bridge_menu').on('change', function () {
        //截面列表联动
        var section_options = "";
        if ($(this).val()) {
            var url = "/section/simple-list";
            var response = webRequest(url, 'GET', false, {'bridgeId': $(this).val()});
            var section_list = response['data'];//格式：[{'section_id':1,'section_name':''},{...}]
            if (section_list) {
                section_options += "<option value='0'>全部截面</option>";
                for (var i = 0; i < section_list.length; i++) {
                    section_options += '<option value="' + section_list[i]['section_id'] + '">' + section_list[i]['section_name'] + '</option>'
                }
            } else {
                section_options += "<option value='0'>无</option>";
            }
        }
        $('#section_menu').empty();
        $('#section_menu').append(section_options);
        //监测点列表联动
        var watch_point_options = "";
        if ($('#section_menu').val()) {
            url = "/watch-point/simple-list";
            response = webRequest(url, 'GET', false, {'sectionId': $('#section_menu').val()});
            var watch_point_list = response['data'];
            if (watch_point_list) {
                watch_point_options += "<option value='0'>全部监测点</option>";
                for (i = 0; i < watch_point_list.length; i++) {
                    watch_point_options += '<option value="' + watch_point_list[i]['watch_point_id'] + '">' + watch_point_list[i]['watch_point_name'] + '</option>'
                }
            } else {
                watch_point_options += "<option value='0'>无</option>";
            }
        }
        $('#point_menu').empty();
        $('#point_menu').append(watch_point_options);
        //控制箱列表联动
        var watch_box_options = "";
        if ($(this).val()) {
            url = "/watch-box/simple-list";
            response = webRequest(url, 'GET', false, {'bridgeId': $(this).val()});
            var watch_box_list = response['data'];
            if (watch_box_list) {
                watch_box_options += "<option value='0'>全部控制箱</option>";
                for (i = 0; i < watch_box_list.length; i++) {
                    watch_box_options += '<option value="' + watch_box_list[i]['watch_box_id'] + '">' + watch_box_list[i]['watch_box_name'] + '</option>'
                }
            } else {
                watch_box_options += "<option value='0'>无</option>";
            }
        }
        $('#box_menu').empty();
        $('#box_menu').append(watch_box_options);
        //传感器下拉框联动
        SensorListDropdown($(this).val(),$('#section_menu').val(),$('#point_menu').val(),$('#box_menu').val());
        $('.selectpicker').selectpicker('refresh');
    });
    //选择截面后-监测点列表联动
    $('#section_menu').on('change', function () {
        var watch_point_options = "";
        if ($(this).val()) {
            var url = "/watch-point/simple-list";
            var response = webRequest(url, 'GET', false, {'sectionId': $(this).val()});
            var watch_point_list = response['data'];
            if (watch_point_list) {
                watch_point_options += "<option value='0'>全部监测点</option>";
                for (i = 0; i < watch_point_list.length; i++) {
                    watch_point_options += '<option value="' + watch_point_list[i]['watch_point_id'] + '">' + watch_point_list[i]['watch_point_name'] + '</option>'
                }
            } else {
                watch_point_options += "<option value='0'>无</option>";
            }
        }
        $('#point_menu').empty();
        $('#point_menu').append(watch_point_options);
        //传感器下拉框联动
        SensorListDropdown($('#bridge_menu').val(),$('#section_menu').val(),$('#point_menu').val(),0);
        $('.selectpicker').selectpicker('refresh');
    });
    //选择测点后，传感器联动
    $('#point_menu').on('change',function () {
        //传感器下拉框联动
        SensorListDropdown($('#bridge_menu').val(),$('#section_menu').val(),$('#point_menu').val(),0);
        $('.selectpicker').selectpicker('refresh');
    });
    //选择监测箱后传感器联动
    $('#box_menu').on('change',function (){
        //传感器下拉框联动
        SensorListDropdown($('#bridge_menu').val(),0,0,$('#box_menu').val());
        $('.selectpicker').selectpicker('refresh');
    });
    $('#sensor_type_menu').on('change',function () {
        SensorNumberDropdown($(this).children('option:selected').text());
        $('.selectpicker').selectpicker('refresh');
    })


    $("#dataschema_tips_btn").click(function(){
        var popoverEl = $("#dataschema_tips_btn");
        popoverEl.popover("destroy");
        var sensor_type_selected = $("#sensor_type_menu").val();
        var content = "";
        if(sensor_type_selected && !(sensor_type_selected.match(/^\s*$/))){
            var schema = sensor_data_schema[sensor_type_selected]["data_schema"];
            // content = content + "{"
            // var sep = "";
            var str = "";
            for(var key in schema){
                // content = content + sep + "<br>&nbsp;&nbsp;&nbsp;&nbsp;" + key + ": " + schema[key];
                // sep = ","
                str += key + ",";
            }
            str += "\n";
            var url = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
            var link = document.createElement("a");
            link.href = url;
            link.download = sensor_type_selected + '.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // content = content + "<br>}"
            // popoverEl.attr("data-content", content);
            // popoverEl.popover("show");
        }else{
            showTransientDialog("未选择传感器类型！");
        }
    });

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    $(document).ajaxSend(function(e, xhr, options) {
        xhr.setRequestHeader(header, token);
    });

    $("#f_upload").fileinput({
        allowedFileExtensions: ['csv'],
        uploadUrl: "upload-data/upload",
        language: 'zh',
        uploadAsync: true,
        showUpload: true,
        maxFileCount: 1,
        autoReplace: true,
        showPreview: false,
        maxFileSize: 512000, // KB,当前限制为50MB
        maxPreviewFileSize: 1,
        uploadExtraData: function() {
            return {
                "sensor_id": $("#sensor_menu").val(),
                "sensor_number": $("#sensor_menu option:selected").text()
            };
        }
    }).on('filebatchpreupload',function (){
        var sn = $("#sensor_menu option:selected").index()
        if (sn == 0){
            showTransientDialog("请先选择传感器")
            $("#f_upload").fileinput('clear').fileinput('unlock')
            $("#f_upload").parent().siblings('.fileinput-remove').hide()
            return {
                message: "请先选择传感器",
            }
        }
    }).on("fileuploaded", function (event, data, previewId, index) {
        var response = data.response;
        console.log(response)
        if(response.status!=0){
            showTransientDialog(response.msg);
        }else{
            updateMessageGrid();
            showModalDialog("提示", "<div style='text-align:center;'>文件正在上传...</div>",function(){},120,40);
        }
    }).on('fileuploaderror', function(event, data, msg) {
        var response = data.response;
        console.log(data)
        var msg = "仅支持csv且单文件大小不超过50MB！";
        if(response!=null && response.msg!="") msg = response.msg;
        showTransientDialog(msg);
    });
    // 获取消息列表
    updateMessageGrid();
});


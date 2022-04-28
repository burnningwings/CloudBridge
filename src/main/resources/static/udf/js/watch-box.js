
function selectBridgeOnchange(obj){
    var bridge_id = obj.value;
    updateBoxGrid(bridge_id);
}

function updateBoxGrid(bridge_id){
    var detailCol = getDetailCol(getUserRole()),
        detailTitle = detailCol['title'],
        detailBtnText = detailCol['buttonText'],
        detailBtnClass = detailCol['buttonClass'];

    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                type: "get",
                url: "/watch-box/list",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (options, operation) {

                if (operation == "read") {
                    var parameter = {
                        page: options.page,
                        pageSize: options.pageSize,
                        bridgeId: bridge_id | 0
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

    $("#watch-box-grid").kendoGrid({
        dataSource: dataSource,
        pageable: {
            // pageSizes: true,
            pageSizes: [10,25,50,100],
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
                template:'<input type="checkbox" class="checkbox" name=box-"#: box_id #" value="#: box_id #" />',
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            },{
                field: "box_number",
                title: "控制箱编号",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            },{
                field: "name",
                title: "名称",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "box_type_name",
                title: "类型",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "bridge_name",
                title: "所属桥梁",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            },{
                field: "port_id",
                title: "连接端口",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            },{
                field: "node",
                title: "连接节点",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            },{
                field: "description",
                title: "说明",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                title: "传感器",
                //template: "<a href='/sensor/#: box_id #' />查看传感器</a>",
                template: "<a href='/sensor?watchBoxId=#: box_id #&bridgeId=#: bridge_id #' />查看</a>",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            },{
                title: detailTitle,
                template: "<button class='" + detailBtnClass + "' type='button' id='modify-#: box_id #' onclick='modifyWatchBox(#: box_id #,#: bridge_id #,#: type_id #)'/>" + detailBtnText + "</button>",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }
        ]
    });
}

function modifyWatchBox(watch_box_id,bridge_id,watch_box_type_id){
    showWatchBoxDialog("测控箱信息","update",bridge_id,watch_box_id,watch_box_type_id)
}

function showModalDialog(title,custom_content,ok_callback){
    var d = dialog({
        title: title,
        content: custom_content,
        okValue: '确定',
        ok: function () {
            return ok_callback();
        },
        cancelValue: '取消',
        cancel: function() {
        }
    });
    d.width(605).height(300).showModal();
    $(".ui-dialog-content").mCustomScrollbar({
        axis:"y",
        advanced:{autoExpandHorizontalScroll:true},
        theme:"minimal-dark"
    });
}

function showWatchBoxDialog(title,operation_type,bridge_id,watch_box_id,watch_box_type_id){
    // 获取所有大桥 & 所有控制箱
    var url = "/watch-box/info";
    var params = {
        "watch_box_id": watch_box_id
    }
    var response = webRequest(url,"GET",false,params)
    var bridge_options = "";
    var watch_box_type_options = "";
    // start 填补参数
    var watch_box_name = "";
    var description = "";
    var box_number = "";
    var node = "";
    var port_id = "";
    var comm_type = "";
    var comm_address = "";
    var begin_time = "";
    var sample_interval = "3600";
    var change_time_interval = "86400";

    var old_bridge_id = "";
    var old_watch_box_type_id = "";
    var old_watch_box_name = "";
    var old_box_number = "";
    var old_node = "";
    var old_sample_interval ="";
    var old_change_time_interval = "";

    // end 填补参数
    if(response.status==0){
        var data = response.data;
        if(watch_box_id!=null && bridge_id!=null && watch_box_type_id!=null){
            bridge_options = bridge_options + "<option value='" + bridge_id + "'>" + data["bridge_list"][bridge_id] + "</option>";
            watch_box_type_options = watch_box_type_options + "<option value='" + watch_box_type_id + "'>" + data["watch_box_type_list"][watch_box_type_id] + "</option>";
            var watch_box_info = data["watch_box"];
            if(Object.keys(data["watch_box"]).length>0){
                watch_box_name = watch_box_info["name"];
                description = watch_box_info["description"];
                box_number = watch_box_info["box_number"];
                node = watch_box_info["node"];
                port_id = watch_box_info["port_id"];
                comm_type = watch_box_info["comm_type"];
                comm_address = watch_box_info["comm_address"];
                begin_time = watch_box_info["begin_time"];
                sample_interval = watch_box_info["sample_interval"];
                change_time_interval = watch_box_info["change_time_interval"];

                old_bridge_id = bridge_id;
                old_watch_box_type_id = watch_box_type_id;
                old_watch_box_name = watch_box_name;
                old_box_number = box_number;
                old_node = node;
                old_sample_interval = sample_interval;
                old_change_time_interval = change_time_interval;
            }
        }
        for (var key in data["bridge_list"]) {
            if (key == bridge_id) {
                bridge_options = bridge_options + '<option value="' + key + '" selected="selected">' +
                    data["bridge_list"][key] + '</option>';
            } else {
                bridge_options = bridge_options + '<option value="' + key + '">' + data["bridge_list"][key] + '</option>';
            }
        }
        for(var key in data["watch_box_type_list"]){
            if(key!=watch_box_type_id)
                watch_box_type_options = watch_box_type_options + "<option value='" + key + "'>" + data["watch_box_type_list"][key] + "</option>";
        }
    }
    var content = '  \
            <div class="form-inline-custom">\
                <label class="col-sm-3 control-label">所属大桥:</label>  \
                <div class="col-sm-8">  \
                    <select class="form-control" id="dropdown_bridge"">  '
                        + bridge_options +
                    '</select>  \
                </div> \
                <span class="text-danger mt5 fl">*</span>\
            </div>\
            <br>\
            <div class="form-inline-custom">\
                <label class="col-sm-3 control-label">类型:</label>  \
                <div class="col-sm-8">  \
                    <select class="form-control" id="dropdown_box_type">  '
                        + watch_box_type_options +
                    '</select>  \
                </div> \
                <span class="text-danger mt5 fl">*</span>\
            </div>\
            <br>\
            <div class="form-inline-custom">\
                <label class="col-sm-3 control-label">名称:</label>\
                <div class="col-sm-8"> \
                    <input type="text" class="form-control" id="watch_box_name" placeholder="请输入测控箱名称" value="'
                    + watch_box_name +
                    '"> \
                </div>\
                <span class="text-danger mt5 fl">*</span>\
            </div> \
            <br>\
            <div class="form-inline-custom">\
                <label class="col-sm-3 control-label">说明:</label>\
                <div class="col-sm-8"> \
                    <textarea class="form-control" rows="3" id="watch_box_description" value="'
                        + description +
                    '"></textarea>\
                </div>\
            </div> \
            <br>\
            <div class="form-inline-custom">\
                <label class="col-sm-3 control-label">控制箱号:</label>\
                <div class="col-sm-8"> \
                    <input type="text" class="form-control" id="watch_box_number" value="'
                        + box_number +
                    '">\
                </div>\
                <span class="text-danger mt5 fl">*</span>\
            </div> \
            <br>\
            <div class="form-inline-custom">\
                <label class="col-sm-3 control-label">所属节点:</label>\
                <div class="col-sm-8"> \
                    <input type="text" class="form-control" id="watch_box_node" value="'
                        + node +
                    '">\
                </div>\
                <span class="text-danger mt5 fl">*</span>\
            </div> \
            <br>\
            <div class="form-inline-custom">\
                <label class="col-sm-3 control-label">连接端口:</label>\
                <div class="col-sm-8"> \
                    <input type="text" class="form-control" id="watch_box_port_id" value="'
                    + port_id +
                    '">\
                </div>\
            </div> \
            <br>\
            <div class="form-inline-custom">\
                <label class="col-sm-3 control-label">通讯方式:</label>\
                <div class="col-sm-8"> \
                    <input type="text" class="form-control" id="comm_type" value="'
                    + comm_type +
                    '">\
                </div>\
            </div> \
            <br>\
            <div class="form-inline-custom">\
                <label class="col-sm-3 control-label">通讯地址:</label>\
                <div class="col-sm-8"> \
                    <input type="text" class="form-control" id="comm_address" value="'
                    + comm_address +
                    '">\
                </div>\
            </div> \
            <br>\
            <div class="form-inline-custom">\
                <label class="col-sm-3 control-label">开始采集时间:</label>\
                <div class="col-sm-8"> \
                    <input type="text" class="form-control" id="begin_time" value="'
                    + begin_time +
                    '"> \
                    <span class="mt5 fl">（定时采集时第一次开始采集的时间。系统启动时：1、如果时间还未到来，将等待此时间到来；2、如果时间已过，则（下一次采样时间 = 时间 + n×采样间隔），下一次采样时间在系统当前时间之后；3、如果不设置此时间，则使用启动时系统当前时间作为第一次采样时间。格式：yyyy-MM-dd HH:mm:ss.S，如：2010-03-04 16:00:00.0）</span>\
                </div>\
            </div> \
            <br>\
            <div class="form-inline-custom">\
                <label class="col-sm-3 control-label">采集间隔（秒）:</label>\
                <div class="col-sm-8"> \
                    <input type="text" class="form-control" id="sample_interval" value="'
                    + sample_interval +
                    '">\
                </div>\
                <span class="text-danger mt5 fl">*</span>\
            </div> \
            <br>\
            <div class="form-inline-custom">\
                <label class="col-sm-3 control-label">时间同步间隔（秒）:</label>\
                <div class="col-sm-8"> \
                    <input type="text" class="form-control" id="change_time_interval" value="'
                    + change_time_interval +
                    '">\
                </div>\
                <span class="text-danger mt5 fl">*</span>\
            </div> \
        ';
    function ok_callback(){
        // 必须参数
        var dropdown_bridge = $("#dropdown_bridge").val();
        var dropdown_box_type = $("#dropdown_box_type").val();
        var watch_box_name = $("#watch_box_name").val();
        var watch_box_number = $("#watch_box_number").val();
        var watch_box_node = $("#watch_box_node").val();
        var sample_interval = $("#sample_interval").val();
        var change_time_interval = $("#change_time_interval").val();
        // 非必须参数
        var watch_box_description = $("#watch_box_description").val();
        var watch_box_port_id = $("#watch_box_port_id").val();
        var comm_type = $("#comm_type").val();
        var comm_address = $("#comm_address").val();
        var begin_time = $("#begin_time").val();

        if(!dropdown_bridge || !dropdown_box_type || !watch_box_name || !watch_box_number || !watch_box_node || !sample_interval || !change_time_interval
            || dropdown_bridge.match(/^\s*$/) || dropdown_box_type.match(/^\s*$/) || watch_box_name.match(/^\s*$/) || watch_box_number.match(/^\s*$/)
            || watch_box_node.match(/^\s*$/) || sample_interval.match(/^\s*$/) || change_time_interval.match(/^\s*$/)){
            showTransientDialog("必须参数不为空！");
            return false;
        }else{
            // 创建新测控箱记录并刷新
            var url = "/watch-box/create-or-update";
            var params = {
                "operation_type": operation_type,
                "box_id": watch_box_id,
                "box_number":watch_box_number,
                "comm_address": comm_address,
                "description": watch_box_description,
                "name": watch_box_name,
                "comm_type": comm_type,
                "port_id": watch_box_port_id,
                "begin_time": begin_time,
                "sample_interval": sample_interval,
                "change_time_interval": change_time_interval,
                "node": watch_box_node,
                "bridge_id": dropdown_bridge,
                "type_id": dropdown_box_type,
                "old_bridge_id":old_bridge_id,
                "old_watch_box_type_id":old_watch_box_type_id,
                "old_watch_box_name":old_watch_box_name,
                "old_box_number":old_box_number,
                "old_node":old_node,
                "old_sample_interval":old_sample_interval,
                "old_change_time_interval":old_change_time_interval

            }
            var response = webRequest(url,"POST",false,params)
            if(response!=null && response.status==0){
                updateBoxGrid($("#bridge_menu").val());
                showTransientDialog("操作成功！");
                return true;
            }else{
                showTransientDialog(response.msg);
                return false;
            }
        }
    }

    if (!isAdminRole(getUserRole())) {
        showModalDialogWithoutOK(title, content, 605, 330);
        $('div.form-inline-custom').find('input,select,textarea').attr('disabled', 'disabled');
    } else {
        showModalDialog(title, content, ok_callback, 605, 330);
    }
}

// 其它初始化
$(function () {
    var url = "/watch-box/dropdown";
    var response = webRequest(url, "GET", false, {});
    var options = '<option value="0">全部</option>';
    if (response != null && response.status == 0) {
        var data = response.data;
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                options = options + '<option value="' + data[key] + '">' + key + '</option>';
            }
        }
    }
    var bridge_menu = $("#bridge_menu");
    bridge_menu
        .append(options)
        .on('shown.bs.select', function (e) {
            // console.log('展开');
        })
        .selectpicker('val', bridge_menu.attr('init-value'));

    // 增加测控箱事件绑定
    $("#add_box").click(function() {
        console.log(bridge_menu.attr('init-value'));
        showWatchBoxDialog("创建测控箱信息", "insert", bridge_menu.attr('init-value'));
    });

    // 删除测控箱事件绑定
    $("#delete_box").click(function() {
        function callback(){
            // var grid = $("#watch-box-grid").data("kendoGrid");
            var watch_box_checked_list = [];
            $("#watch-box-grid").find("input:checked").each(function(){
                var box_id = this.value;
                watch_box_checked_list.push(box_id)
            })

            if(watch_box_checked_list.length<=0) return;

            var url = "/watch-box/delete";
            var params = {
                "watch_box_checked_list": watch_box_checked_list
            }
            var response = webRequest(url,"POST",false,params)
            if(response!=null && response.status==0){
                updateBoxGrid($("#bridge_menu").val());
                showTransientDialog("删除测控箱成功！");
            }else{
                showTransientDialog(response.msg);
            }
        }
        showAlertDialog("确定删除？",callback);
    });
});


// 表格初始化
$(function () {
    updateBoxGrid($("#bridge_menu").val());
});

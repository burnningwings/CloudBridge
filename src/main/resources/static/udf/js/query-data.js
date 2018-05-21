
var sensor_map = {
    "加速度传感器": [
        {
            template:'<input type="checkbox" class="checkbox" name=sensordata-"#: sensor_id #" value="#: sensor_id #" />',
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        },
        {
            title: "传感器编号",
            template: '<a href="javascript: void(0);" onclick="sensorFigure(\'#: sensor_id #\',\'#: sensor_number #\')"/>#: sensor_number #</button>',
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "DY",
            title: "电压",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "JSD",
            title: "加速度",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "CLSJ",
            title: "测量时间",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            title: "修改",
            template: "<button class='btn btn-success' type='button' id='modify-#: sensor_id #' onclick='modifySensorData()'/>修改</button>",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }
    ],
    "索力传感器":[
        {
            template:'<input type="checkbox" class="checkbox" name=sensordata-"#: sensor_id #" value="#: sensor_id #" />',
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        },
        {
            title: "传感器编号",
            template: '<a href="javascript: void(0);" onclick="sensorFigure(\'#: sensor_id #\',\'#: sensor_number #\')"/>#: sensor_number #</button>',
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "DY",
            title: "电压",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "JSD",
            title: "加速度",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "SL",
            title: "索力",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "CLSJ",
            title: "测量时间",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            title: "修改",
            template: "<button class='btn btn-success' type='button' id='modify-#: sensor_id #' onclick='modifySensorData()'/>修改</button>",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }
    ],
    "光纤传感器":[
        {
            template:'<input type="checkbox" class="checkbox" name=sensordata-"#: sensor_info #" value="#: sensor_info #" />',
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        },
        {
            title: "传感器编号",
            template: '<a href="javascript: void(0);" onclick="sensorFigure(\'#: sensor_id #\',\'#: sensor_number #\')"/>#: sensor_number #</button>',
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "CLBC",
            title: "测量波长",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "YB",
            title: "应变",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "CLSJ",
            title: "测量时间",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            title: "修改",
            template: "<button class='btn btn-success' type='button' id='modify-#: sensor_id #' onclick='modifySensorData()'/>修改</button>",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }
    ],
    "GPS传感器":[
        {
            template:'<input type="checkbox" class="checkbox" name=sensordata-"#: sensor_info #" value="#: sensor_info #" />',
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        },
        {
            title: "传感器编号",
            template: '<a href="javascript: void(0);" onclick="sensorFigure(\'#: sensor_id #\',\'#: sensor_number #\')"/>#: sensor_number #</button>',
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "WXZBX",
            title: "卫星坐标X",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "CLZBX",
            title: "局部坐标X",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "WXWYX",
            title: "卫星位移X",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "QLWYX",
            title: "局部位移X",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "WXZBY",
            title: "卫星坐标Y",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "CLZBY",
            title: "局部坐标Y",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "WXWYY",
            title: "卫星位移Y",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "QLWYY",
            title: "局部位移Y",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "WXZBZ",
            title: "卫星坐标Z",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "CLZBZ",
            title: "局部坐标Z",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "WXWYZ",
            title: "卫星位移Z",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "QLWYZ",
            title: "局部位移Z",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "CLSJ",
            title: "测量时间",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            title: "修改",
            template: "<button class='btn btn-success' type='button' id='modify-#: sensor_id #' onclick='modifySensorData()'/>修改</button>",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }
    ],
    "正弦传感器":[
        {
            template:'<input type="checkbox" class="checkbox" name=sensordata-"#: sensor_info #" value="#: sensor_info #" />',
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        },
        {
            title: "传感器编号",
            template: '<a href="javascript: void(0);" onclick="sensorFigure(\'#: sensor_id #\',\'#: sensor_number #\')"/>#: sensor_number #</button>',
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "CLYB",
            title: "测量值",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "XZYB",
            title: "修正后的值",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "CLWD",
            title: "测量温度",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "DZ",
            title: "电阻",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "CLSJ",
            title: "测量时间",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            title: "修改",
            template: "<button class='btn btn-success' type='button' id='modify-#: sensor_id #' onclick='modifySensorData()'/>修改</button>",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }
    ]
}

function getAndshowSensorFigure(figure_id,sensor_id_array,sensor_number_array,current_dialog,params,single){
    function successCallback(message) {
        console.log(message)
        current_dialog.button('reset').dequeue();
        var status = message["status"];
        if (status!=0) {
            $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/warning.png'/>");
            showTransientDialog(message["msg"]);
            return;
        }
        var xAxis_data = {};
        var series_data = {};
        for(var index in sensor_id_array){
            var sensor_id = sensor_id_array[index];
            var sensor_number = sensor_number_array[index];
            // 对于每一个传感器
            var data = message["data"][sensor_id];
            if (data.length <= 0) {
                $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/warning.png'/>");
                showTransientDialog("传感器" + sensor_number + "对应时间区间数据不存在！");
                continue;
            }
            // 开始展示
            var xAxis_type = "time";
            var current_legend_array = []
            Object.keys(data[0]).forEach(function(key){
                if(key!="CLSJ") {
                    series_data[sensor_number + "-" + key] = [];
                    xAxis_data[sensor_number + "-" + key] = [];
                    current_legend_array.push(sensor_number + "-" + key);
                }
            });
            for(var i in data){
                // 对于每一行数据
                var row_key = data[i]["CLSJ"];
                var time = new Date(
                    row_key.substring(0,4),      // 年
                    parseInt(row_key.substring(4,6))-1,      // 月
                    row_key.substring(6,8),      // 日
                    row_key.substring(8,10),     // 时
                    row_key.substring(10,12),    // 分
                    row_key.substring(12,14),    // 秒
                    row_key.substring(14,16)     // 毫秒
                );
                for(var index in current_legend_array){
                    // 对于每一个指标
                    var legend = current_legend_array[index];
                    var metric_name = legend.split("-")[1];
                    series_data[legend].push(data[i][metric_name]);
                    xAxis_data[legend].push(time)
                }
            }
        }
        if(Object.keys(series_data).length<=0) return;
        showTimeLineChart(figure_id,xAxis_data,series_data,single);
    }
    var url = "/query-data/figure";
    webRequest(url,"GET",true,params,successCallback)
}

function sensorFigure(sensor_id,sensor_number){
    var title = "传感器-" + sensor_number;
    var data_format_str = 'yyyy-MM-dd HH:mm:ss';
    var current_time = new Date().format(data_format_str);
    var content = ' \
            <nav class="cm-navbar cm-navbar-default cm-navbar-slideup"> \
                <div class="cm-flex"> \
                    <div class="nav-tabs-container" id="grid_sensor_tab"> \
                        <ul class="nav nav-tabs"> \
                            <li class="active"><a href="#latest_time" data-toggle="tab">最近时间查询</a></li> \
                            <li><a href="#latest_count" data-toggle="tab">最近条数查询</a></li> \
                            <li><a href="#time_range" data-toggle="tab">自定义查询</a></li> \
                        </ul> \
                    </div> \
                </div> \
            </nav> \
            <div class="tab-content"> \
                <div class="tab-pane fade in active" id="latest_time" style="margin-top:20px"> \
                    <div class="form-inline"> \
                        <select class="form-control" id="latest_time_menu"> \
                            <option value="one_week">最近一周</option> \
                            <option value="one_month">最近一个月</option> \
                            <option value="three_month">最近三个月</option> \
                            <option value="six_month">最近半年</option> \
                            <option value="one_year">最近一年</option> \
                        </select> \
                        <button id="latest_time_btn" type="button" class="btn btn-l btn-primary">查询</button> \
                        <div> \
                        <div align="center" id="latest_time_figure" height="360" data-width="60%" style="position:relative;margin-top:20px; height: 360px;"></div> \
                        </div> \
                     </div> \
                </div> \
                <div class="tab-pane fade" id="latest_count" style="margin-top:20px"> \
                    <div class="form-inline"> \
                        <select class="form-control" id="latest_item_menu"> \
                            <option value="10">10</option> \
                            <option value="30">30</option> \
                            <option value="100">100</option> \
                            <option value="200">200</option> \
                        </select> \
                        <button id="latest_item_btn" type="button" class="btn btn-l btn-primary">查询</button> \
                        <div> \
                        <div align="center" id="latest_item_figure" height="360" data-width="60%" style="position:relative;margin-top:20px; height: 360px;"></div> \
                        </div> \
                     </div> \
                </div> \
                <div class="tab-pane fade" id="time_range" style="margin-top:20px"> \
                    <div class="form-inline"> \
                        <input size="17" type="text" id="latest_udf_begin_time"  class="btn btn-default" value="'+ current_time+'" readonly="readonly"> \
                        <span style="line-height: 30px;">&nbsp;&nbsp;<label class="form-label">至</label>&nbsp;&nbsp;</span> \
                        <input size="17" type="text" id="latest_udf_end_time" class="btn btn-default" value="'+ current_time+'" readonly="readonly"> \
                        <button id="latest_udf_btn" type="button" class="btn btn-l btn-primary">查询</button> \
                    </div> \
                    <div align="center" id="latest_udf_figure" height="360" data-width="60%" style="position:relative;margin-top:20px; height: 360px;"></div> \
                </div> \
            </div> \
    ';
    function ok_callback(){
    }
    showModalDialog(title,content,ok_callback);
    $('#grid_sensor_tab a').click(function(e) {
        e.preventDefault();
        var target = $(e.target).attr("href") // activated tab
        if(target=="#time_range"){
            console.log(target);;
        }
    });
    $('#latest_udf_begin_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#latest_udf_end_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $("#latest_time_btn").click(function(){
        var figure_id = "latest_time_figure";
        // 刷新中
        $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/loading.gif'/>");
        $(this).button('loading').delay(1000).queue(function() {
            // 访问数据
            var latest_time = $('#latest_time_menu').val();
            // 根据选择条件获取查询条件
            var query_condition = getQueryCondition("","",latest_time)
            var params = {
                "sensorList": JSON.stringify([sensor_id]),
                "columnList": JSON.stringify([]),
                "startRowKey": query_condition["startRowKey"],
                "endRowKey": query_condition["endRowKey"],
                "limit": query_condition["limit"]
            }
            // params["startRowKey"] = "2018050222000110";
            // params["endRowKey"] = "2018050222001010";
            // 返回后调用
            var current_dialog = $(this);
            getAndshowSensorFigure(figure_id,[sensor_id],[sensor_number],current_dialog,params,true);
        });
    });


    $("#latest_item_btn").click(function(){
        var figure_id = "latest_item_figure";
        // 刷新中
        $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/loading.gif'/>");
        $(this).button('loading').delay(1000).queue(function() {
            // 访问数据
            var item = $('#latest_item_menu').val();
            // 根据选择条件获取查询条件

            var end_row_key = new Date().format('yyyyMMddHHmmssSS');
            var params = {
                "sensorList": JSON.stringify([sensor_id]),
                "columnList": JSON.stringify([]),
                "startRowKey": "",
                "endRowKey": end_row_key,
                "limit": item
            }
            // 返回后调用
            var current_dialog = $(this);
            getAndshowSensorFigure(figure_id,[sensor_id],[sensor_number],current_dialog,params,true);
        });
    });

    $("#latest_udf_btn").click(function(){
        var figure_id = "latest_udf_figure";
        // 刷新中
        $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/loading.gif'/>");
        $(this).button('loading').delay(1000).queue(function() {
            // 访问数据
            var begin_time = $('#latest_udf_begin_time').val();
            var end_time = $('#latest_udf_end_time').val();
            if(begin_time>=end_time){
                $(this).button('reset').dequeue();
                $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/warning.png'/>");
                showTransientDialog("开始时间必须小于截止时间！");
                return;
            }
            // 根据选择条件获取查询条件
            var end_row_key = new Date().format('yyyyMMddHHmmssSS');
            var params = {
                "sensorList": JSON.stringify([sensor_id]),
                "columnList": JSON.stringify([]),
                "startRowKey": new Date(begin_time).format('yyyyMMddHHmmssSS'),
                "endRowKey": new Date(end_time).format('yyyyMMddHHmmssSS'),
                "limit": 0
            }
            // 返回后调用
            var current_dialog = $(this);
            getAndshowSensorFigure(figure_id,[sensor_id],[sensor_number],current_dialog,params,true);
        });
    });
}

var next_row_key = "";
var current_row_key = "";
var row_key = "";
var skip = 0;

function updateGrid(bridge_id,box_id,sensor_info){
    // 根据传感器类型初始化列表项
    console.log(bridge_id,box_id,sensor_info)
    if(sensor_info==null || sensor_info=="") return;
    var sensor_info_list = sensor_info.split(" - ");
    console.log(sensor_info)
    var table_columns = sensor_map[sensor_info_list[2]];
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                type: "get",
                url: "/query-data/list",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (options, operation) {
                if (operation == "read") {
                    var next = true;
                    if(options.skip==0){
                        next_row_key = "";
                        current_row_key = "";
                        skip = 0;
                    }
                    if(options.skip >= skip){
                        // 下一页
                        // 返回后start_row_key成为当前第一行row_key
                        row_key = next_row_key;
                    }else{
                        // 上一页
                        row_key = current_row_key;
                        next = false;
                    }
                    skip = options.skip;
                    var parameter = {
                        next: next,
                        skip: skip,
                        rowKey: row_key,
                        page: options.page,
                        pageSize: options.pageSize,
                        sensorInfo: sensor_info
                    };
                    return parameter;
                }
            }
        },
        requestStart: function(e) {
            // kendo.ui.progress($("#query_data_grid"), true);
            // kendo.ui.progress($("#query_data_grid"), false);
        },
        requestEnd: function () {
            setTimeout(function(){
                $("a.k-pager-last").addClass("k-state-disabled");
            }, 100);
        },
        change: function(e) {
            $("a.k-pager-last").addClass("k-state-disabled");
        },
        batch: true,
        pageSize: 5,
        schema: {
            data: function (d) {
                console.log(d)
                next_row_key = d.next_row_key;
                current_row_key = d.current_row_key;
                // 取消最后一页
                $("a.k-pager-last").addClass("k-state-disabled");
                return d.data;
            },
            total: function (d) {
                return d.total;
            }
        },
        serverPaging: true
    });

    $("#query_data_grid").kendoGrid({
        dataSource: dataSource,
        pageable: {
            // pageSizes: true,
            pageSizes: [5,10,25,50,100],
            buttonCount: 1, // 限制其不能点击对应页
            messages: {
                display: "第 {0} - {1} 条",
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
        columns: table_columns
    });
    $("a.k-pager-last").addClass("k-state-disabled");
}

function modifySensorData(watch_box_id,bridge_id,watch_box_type_id){
    // showWatchBoxDialog("修改测控箱信息","update",watch_box_id,bridge_id,watch_box_type_id)
}

function showModalDialog(title,custom_content,ok_callback){
    var d = dialog({
        title: title,
        content: custom_content,
        okValue: '关闭',
        ok: function () {
            return ok_callback();
        }
    });
    d.width(620).height(400).showModal();
    $(".ui-dialog-content").mCustomScrollbar({
        axis:"y",
        advanced:{autoExpandHorizontalScroll:true},
        theme:"minimal-dark"
    });
}

function updateDropdownMenu1(response){
    var data = null
    var bridge_options = "";
    var watch_box_options = "";
    var sensor_options = "";
    if(response!=null && response.status==0){
        data = response.data;
        console.log(data)
        bridge_options = bridge_options + "<option value='" + data["bridge_id"] + "'>" + data["bridge"][data["bridge_id"]] + "</option>";
        for(var key in data["bridge"]){
            if(key==data["bridge_id"]) continue;
            bridge_options = bridge_options + "<option value='" + key + "'>" + data["bridge"][key] + "</option>";
        }
        for(var key in data["bridge_detail"]){
            watch_box_options = watch_box_options + "<option value='" + key + "'>" + data["bridge_detail"][key]["name"] + "</option>";
        }
    }
    $("#bridge_menu").empty();
    $("#watch_box_menu").empty();
    $("#sensor_menu").empty();

    $("#bridge_menu").append(bridge_options);
    $("#watch_box_menu").append(watch_box_options);
    var watch_box_selected = $("#watch_box_menu").val();
    if(watch_box_selected && !(watch_box_selected.match(/^\s*$/))){
        var sensor_info = data["bridge_detail"][watch_box_selected]["sensor"];
        for(var key in sensor_info){
            sensor_options = sensor_options + "<option value='" + (key + " - " + sensor_info[key]) + "'>" + sensor_info[key] + "</option>";
        }
    }
    $("#sensor_menu").append(sensor_options);
    $('.selectpicker').selectpicker('refresh');
    console.log(data)
    return data;
}

function updateDropdownMenu2(response){
    var data = null
    var bridge_options = "";
    var sensor_type_options = "";
    var metric_options = "";
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
            var sensor_dict = data["bridge_detail"][key]["sensor"];
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
        }
        // key为传感器类型
        console.log(sensor_info)
        for(var key in sensor_info){
            sensor_type_options = sensor_type_options + "<option value='" + key + "'>" + key + "</option>";
        }
    }

    $("#query_bridge_menu").empty();
    $("#query_sensor_type_menu").empty();
    $("#query_metric_menu").empty();
    $("#query_group_sensor_menu").empty();

    $("#query_bridge_menu").append(bridge_options);
    $("#query_sensor_type_menu").append(sensor_type_options);
    var sensor_type_selected = $("#query_sensor_type_menu").val();
    if(sensor_type_selected && !(sensor_type_selected.match(/^\s*$/))){
        for(var key in sensor_metadata_map[sensor_type_selected]["data_schema"]){
            if(key=="CLSJ") continue;
            metric_options = metric_options + "<option value='" + key + "'>" + key + "</option>";
        }
        var sensor_list = sensor_info[sensor_type_selected];
        for(var key in sensor_list){
            sensor_options = sensor_options + "<option value='" + sensor_list[key][0] + "'>" + sensor_list[key][1] + "</option>";
        }
    }
    $("#query_metric_menu").append(metric_options);
    $("#query_group_sensor_menu").append(sensor_options);
    if(sensor_list && sensor_list.length){
        $("#query_group_sensor_menu").selectpicker('val', sensor_list[0][0]);
    }
    $('.selectpicker').selectpicker('refresh');
    console.log(sensor_info)
    return sensor_info;
}

// 其它初始化
$(function () {
    // begin
    // 表格操作
    var url = "/query-data/dropdown";
    var response = webRequest(url,"GET",false,{"bridge_id":"all"})
    var data1 = updateDropdownMenu1(response);

    // begin
    //初始化表格
    updateGrid($("#bridge_menu").val(),$("#watch_box_menu").val(),$("#sensor_menu").val());
    // end

    $('#bridge_menu').change(function(){
        var id = $(this).children('option:selected').val();
        var url = "/query-data/dropdown";
        var response = webRequest(url,"GET",false,{"bridge_id":id})
        data1 = updateDropdownMenu1(response);
    })

    $('#watch_box_menu').change(function(){
        var id = $(this).children('option:selected').val();
        var sensor_info = data1["bridge_detail"][id]["sensor"];
        var sensor_options = "";
        for(var key in sensor_info){
            sensor_options = sensor_options + "<option value='" + (key + " - " + sensor_info[key]) + "'>" + sensor_info[key] + "</option>";
        }
        $("#sensor_menu").empty();
        $("#sensor_menu").append(sensor_options);
        $('.selectpicker').selectpicker('refresh');
    })

    // 点击查询
    $("#query_grid_btn").click(function(){
        $(this).button('loading').delay(1000).queue(function() {
            var bridge_id = $("#bridge_menu").val();
            var box_id = $("#watch_box_menu").val();
            var sensor_info = $("#sensor_menu").val();
            if(!bridge_id || !box_id || !sensor_info || bridge_id.match(/^\s*$/) || box_id.match(/^\s*$/) || sensor_info.match(/^\s*$/)){
                showTransientDialog("没有符合条件的查询！");
            }else{
                updateGrid(bridge_id,box_id,sensor_info);
            }
            $(this).button('reset').dequeue();
        });
    });
    // end

    // begin
    // 数据图示
    // 初始化图示的tab
    var data_format_str = 'yyyy-MM-dd HH:mm:ss';
    var current_time = new Date().format(data_format_str);
    $('#query_latest_udf_begin_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#query_latest_udf_end_time').datetimepicker({
        timeFormat: "HH:mm:ss",
        dateFormat: "yy-mm-dd"
    });
    $('#query_latest_udf_begin_time').val(current_time);
    $('#query_latest_udf_end_time').val(current_time)

    var data2 = updateDropdownMenu2(response);
    $('#query_bridge_menu').change(function(){
        var id = $(this).children('option:selected').val();
        var url = "/query-data/dropdown";
        var response = webRequest(url,"GET",false,{"bridge_id":id})
        data2 = updateDropdownMenu2(response);
    })

    $('#query_sensor_type_menu').change(function(){
        var sensor_type_selected = $(this).children('option:selected').val();
        var metric_options = ""
        var sensor_options = "";
        for(var key in sensor_metadata_map[sensor_type_selected]["data_schema"]){
            if(key=="CLSJ") continue;
            metric_options = metric_options + "<option value='" + key + "'>" + key + "</option>";
        }
        var sensor_list = data2[sensor_type_selected];
        for(var key in sensor_list){
            sensor_options = sensor_options + "<option value='" + sensor_list[key][0] + "'>" + sensor_list[key][1] + "</option>";
        }
        $("#query_metric_menu").empty();
        $("#query_group_sensor_menu").empty();
        $("#query_metric_menu").append(metric_options);
        $("#query_group_sensor_menu").append(sensor_options);
        if(sensor_list.length){
            $("#query_group_sensor_menu").selectpicker('val', sensor_list[0][0]);
        }
        $('.selectpicker').selectpicker('refresh');
    })

    // 点击查询
    $("#query_latest_time_btn").click(function(){
        var sensor_type = $("#query_sensor_type_menu").val();
        var metric = $("#query_metric_menu").val();
        var sensor_id_array = [];
        var sensor_number_array = [];
        $("#query_group_sensor_menu option:selected").each(function() {
            sensor_id_array.push($(this).val());
            sensor_number_array.push($(this).text());
        });
        console.log(sensor_id_array,sensor_number_array)
        if(!sensor_type || !metric || !sensor_id_array || sensor_type.match(/^\s*$/) || metric.match(/^\s*$/) || sensor_id_array.length<=0){
            showTransientDialog("没有符合条件的查询！");
        }else{
            var figure_id = "query_latest_time_figure";
            // 刷新中
            $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/loading.gif'/>");
            $(this).button('loading').delay(1000).queue(function() {
                // 访问数据
                var latest_time = $('#query_latest_time_menu').val();
                // 根据选择条件获取查询条件
                var query_condition = getQueryCondition("","",latest_time)
                var params = {
                    "sensorList": JSON.stringify(sensor_id_array),
                    "columnList": JSON.stringify([metric]),
                    "startRowKey": query_condition["startRowKey"],
                    "endRowKey": query_condition["endRowKey"],
                    "limit": query_condition["limit"]
                }
                // 返回后调用
                var current_dialog = $(this);
                getAndshowSensorFigure(figure_id,sensor_id_array,sensor_number_array,current_dialog,params,false);
            });
        }
    });


    $("#query_latest_item_btn").click(function(){
        var sensor_type = $("#query_sensor_type_menu").val();
        var metric = $("#query_metric_menu").val();
        var sensor_id_array = [];
        var sensor_number_array = [];
        $("#query_group_sensor_menu option:selected").each(function() {
            sensor_id_array.push($(this).val());
            sensor_number_array.push($(this).text());
        });
        console.log(sensor_id_array,sensor_number_array)
        console.log(sensor_type,metric)
        if(!sensor_type || !metric || !sensor_id_array || sensor_type.match(/^\s*$/) || metric.match(/^\s*$/) || sensor_id_array.length<=0){
            showTransientDialog("没有符合条件的查询！");
        }else{
            var figure_id = "query_latest_item_figure";
            // 刷新中
            $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/loading.gif'/>");
            $(this).button('loading').delay(1000).queue(function() {
                // 访问数据
                var item = $('#query_latest_item_menu').val();
                // 根据选择条件获取查询条件

                var end_row_key = new Date().format('yyyyMMddHHmmssSS');
                var params = {
                    "sensorList": JSON.stringify(sensor_id_array),
                    "columnList": JSON.stringify([metric]),
                    "startRowKey": "",
                    "endRowKey": end_row_key,
                    "limit": item
                }
                // 返回后调用
                var current_dialog = $(this);
                getAndshowSensorFigure(figure_id,sensor_id_array,sensor_number_array,current_dialog,params,false);
            });
        }
    });

    $("#query_latest_udf_btn").click(function(){
        var sensor_type = $("#query_sensor_type_menu").val();
        var metric = $("#query_metric_menu").val();
        var sensor_id_array = [];
        var sensor_number_array = [];
        $("#query_group_sensor_menu option:selected").each(function() {
            sensor_id_array.push($(this).val());
            sensor_number_array.push($(this).text());
        });
        console.log(sensor_id_array,sensor_number_array)
        console.log(sensor_type,metric)
        if(!sensor_type || !metric || !sensor_id_array || sensor_type.match(/^\s*$/) || metric.match(/^\s*$/) || sensor_id_array.length<=0){
            showTransientDialog("没有符合条件的查询！");
        }else{
            var figure_id = "query_latest_udf_figure";
            // 刷新中
            $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/loading.gif'/>");
            $(this).button('loading').delay(1000).queue(function() {
                // 访问数据
                var begin_time = $('#query_latest_udf_begin_time').val();
                var end_time = $('#query_latest_udf_end_time').val();
                if(begin_time>=end_time){
                    $(this).button('reset').dequeue();
                    $("#" + figure_id).html("<img style='margin-top:120px;' src='assets/img/warning.png'/>");
                    showTransientDialog("开始时间必须小于截止时间！");
                    return;
                }
                // 根据选择条件获取查询条件
                var end_row_key = new Date().format('yyyyMMddHHmmssSS');
                var params = {
                    "sensorList": JSON.stringify(sensor_id_array),
                    "columnList": JSON.stringify([metric]),
                    "startRowKey": new Date(begin_time).format('yyyyMMddHHmmssSS'),
                    "endRowKey": new Date(end_time).format('yyyyMMddHHmmssSS'),
                    "limit": 0
                }
                // 返回后调用
                var current_dialog = $(this);
                getAndshowSensorFigure(figure_id,sensor_id_array,sensor_number_array,current_dialog,params,false);
            });
        }
    });
    // end
});


//传感器映射，选项卡按映射的来，只要读取传感器id
//西江大桥：桥梁id，截面，控制箱，传感器号
let sensor_map1 = [
    [29, "2G1#", "34160086", "244018"],
    [29, "2G1#", "34160086", "244044"],
    [29, "2G9#", "34160086", "244031"],
    [29, "2G9#", "34160086", "244038"],
    [29, "2-3MID", "34160086", "244064"],
    [29, "2-3MID", "34160086", "244065"],
    [29, "3Z9#", "34160086", "244047"],
    [29, "3Z9#", "34160086", "244037"],
    [29, "3Z1#", "34160086", "244053"],
    [29, "3Z1#", "34160086", "244054"],
    [29, "3G1#", "34160086", "244063"],
    [29, "3G1#", "34160086", "244028"],
    [29, "3G1#", "34160086", "244072"],
    [29, "3G1#", "34160086", "244030"],
    [29, "3G1#", "34160086", "244019"],
    [29, "3G1#", "34160086", "244013"],
    [29, "3G1#", "34160086", "244042"],
    [29, "3G1#", "34160086", "241334"],
    [29, "3G1#", "34160086", "242719"],
    [29, "3G1#", "34160086", "244073"],
    [29, "3G9#", "34160086", "244051"],
    [29, "3G9#", "34160086", "244022"],
    [29, "3G9#", "34160086", "244080"],
    [29, "3G9#", "34160086", "244058"],
    [29, "3G9#", "34160086", "244014"],
    [29, "3G9#", "34160086", "244075"],
    [29, "3G9#", "34160086", "244011"],
    [29, "3G9#", "34160086", "244048"],
    [29, "3-4MID", "34160087", "244035"],
    [29, "3-4MID", "34160087", "244052"],
    [29, "3-4MID", "34160087", "244021"],
    [29, "3-4MID", "34160087", "244045"],
    [29, "3-4MID", "34160087", "244036"],
    [29, "3-4MID", "34160087", "244060"],
    [29, "4Z9#", "34160087", "244029"],
    [29, "4Z9#", "34160087", "244027"],
    [29, "4Z1#", "34160087", "242119"],
    [29, "4Z1#", "34160087", "244076"],
    [29, "4G1#", "34160087", "244071"],
    [29, "4G1#", "34160087", "242078"],
    [29, "4G9#", "34160087", "244040"],
    [29, "4G9#", "34160087", "244059"],
    [29, "4-5MID", "34160087", "244050"],
    [29, "4-5MID", "34160087", "254537"],
    [29, "5Z9#", "34160087", "244033"],
    [29, "5Z9#", "34160087", "244081"],
    [29, "5Z1#", "34160087", "244068"],
    [29, "5Z1#", "34160087", "244057"],
    [29, "5G1#", "34160087", "244074"],
    [29, "5G1#", "34160087", "244066"],
    [29, "5G9#", "34160087", "244032"],
    [29, "5-6MID", "34160087", "244067"],
    [29, "5-6MID", "34160087", "244041"],
    [29, "5G9#", "34160087", "244049"],
    [29, "6Z9#", "34160087", "244039"],
    [29, "6Z9#", "34160087", "244034"],
    [29, "6Z1#", "34160087", "242117"],
    [29, "6Z1#", "34160087", "244056"],
    [29, "D1", "34160086", "244005"],
    [29, "D1", "34160086", "244004"],
    [29, "D2", "34160086", "244009"],
]
//阅江大桥
let sensor_map2 = [
    [98, "1", "06170021", "80210101"],
    [98, "1", "06170021", "80210106"],
    [98, "2", "06170021", "80210114"],
    [98, "2", "06170021", "80210099"],
    [98, "3", "06170021", "80210093"],
    [98, "3", "06170021", "80210125"],
    [98, "4", "06170021", "80210116"],
    [98, "4", "06170021", "80210119"],
    [98, "5", "06170021", "80210082"],
    [98, "5", "06170021", "80210128"],
    [98, "6", "06170021", "80210089"],
    [98, "6", "06170021", "80210113"],
    [98, "7", "06170022", "80210109"],
    [98, "7", "06170022", "80210091"],
    [98, "8", "06170022", "80210085"],
    [98, "8", "06170022", "80210108"],
    [98, "9", "06170022", "80210118"],
    [98, "9", "06170022", "80210090"],
    [98, "10", "06170022", "80210092"],
    [98, "10", "06170022", "80210112"],
    [98, "11", "06170022", "80210115"],
    [98, "11", "06170022", "80210117"],
    [98, "12", "06170022", "80210094"],
    [98, "12", "06170022", "80210126"],
    [98, "13", "06170024", "80210087"],
    [98, "13", "06170024", "80210095"],
    [98, "14", "06170024", "80210084"],
    [98, "14", "06170024", "80210102"],
    [98, "15", "06170024", "80210122"],
    [98, "15", "06170024", "80210105"],
    [98, "16", "06170024", "80210111"],
    [98, "16", "06170024", "80210097"],
    [98, "17", "06170024", "80210121"],
    [98, "17", "06170024", "80210103"],
    [98, "18", "06170024", "80210110"],
    [98, "18", "06170024", "80210088"],
    [98, "19", "06170025", "80210098"],
    [98, "19", "06170025", "80210086"],
    [98, "20", "06170025", "80210127"],
    [98, "20", "06170025", "80210096"],
    [98, "21", "06170025", "80210100"],
    [98, "21", "06170025", "80210107"],
    [98, "22", "06170025", "80210104"],
    [98, "22", "06170025", "80210124"],
    [98, "23", "06170025", "80210083"],
    [98, "23", "06170025", "80210123"],
    [98, "24", "06170025", "80210110"],
    [98, "24", "06170025", "80210081"],
]

//分别筛选出两座大桥的截面与控制箱种类，字符串呢？直接在本地调试
let section1 = [];
let section2 = [];
let watchbox1 = [];
let watchbox2 = [];
for (let i = 0; i < sensor_map1.length; i++) {
    if (!section1.includes(sensor_map1[i][1])) {
        section1 += [sensor_map1[i][1] + ","];
    }
    if (!watchbox1.includes(sensor_map1[i][2])) {
        watchbox1 += [sensor_map1[i][2] + ","];
    }
}
section1 = section1.substring(0, section1.length - 1).split(",");
watchbox1 = watchbox1.substring(0, watchbox1.length - 1).split(",");

for (let i = 0; i < sensor_map2.length; i++) {
    if (!section2.includes(sensor_map2[i][1])) {
        section2 += [sensor_map2[i][1] + ","];
    }
    if (!watchbox2.includes(sensor_map2[i][2])) {
        watchbox2 += [sensor_map2[i][2] + ","];
    }
}
section2 = section2.substring(0, section2.length - 1).split(",");
watchbox2 = watchbox2.substring(0, watchbox2.length - 1).split(",");

//桥梁列表下拉框
function queryBridgeListDropdown() {
    let url = "/bridge/simple-list";
    let response = webRequest(url, "GET", false, {});
    let options = "<option value='-1'>全部桥梁</option>";
    if (response != null && response['data']) {
        let data = response["data"];
        for (let i = 0; i < data.length; i++) {
            if (i == 2 || i == 4) {
                options += "<option value='" + data[i]['bridge_id'] + "'>" + data[i]['bridge_name'] + "</option>";
            }
        }
    }
    let $dropdownMenu1 = $("#query_bridge_menu");
    $dropdownMenu1.append(options);
    $dropdownMenu1.selectpicker('val', $dropdownMenu1.attr('init-value'));
    $dropdownMenu1.on("changed.bs.select", function () {
        querySectionListDropdown($(this).val()); //更新截面列表
        queryWatchBoxListDropdown($(this).val()); //更新控制箱列表
        querySensorListDropdown($(this).val(), $('#query_section_menu').val(), $('#query_box_menu').val(), -1); //更新传感器列表
    });
}

//截面列表下拉框
function querySectionListDropdown(bridgeId, init_value) {
    let options = "<option value='-1'>未选中</option>";
    if (bridgeId != 0) {  //为全部桥梁时不需要获取截面列表
        if (bridgeId == 29) {
            for (let i = 0; i < section1.length; i++) {
                options += "<option value='" + i + "'>" + section1[i] + "</option>";
            }
        } else if (bridgeId == 98) {
            for (let i = 0; i < section2.length; i++) {
                options += "<option value='" + i + "'>" + section2[i] + "</option>";
            }
        }
    }
    let $dropdownMenu2 = $("#query_section_menu");
    $dropdownMenu2.empty();
    $dropdownMenu2.append(options);
    $dropdownMenu2.selectpicker('refresh');
    if (init_value) { //有初始值 则进行赋值
        $dropdownMenu2.selectpicker('val', init_value);
    }
    $dropdownMenu2.on("changed.bs.select", function () {
        $("#query_box_menu").empty();
        let box_options = "<option value='-1'>未选中</option>";
        $('#query_box_menu').append(box_options);
        $('.selectpicker').selectpicker('refresh');

        if ($('#query_section_menu').val() == -1) {
            queryWatchBoxListDropdown($('#query_bridge_menu').val(), -1);
        }
        querySensorListDropdown($('#query_bridge_menu').val(), $('#query_section_menu').val(), $('#query_box_menu').val(), -1);
    });
}

//控制箱下拉列表；将截面恢复
function queryWatchBoxListDropdown(bridgeId, init_value) {
    let options = "<option value='-1'>未选中</option>";
    if (bridgeId != 0) {  //为全部桥梁时不需要获取截面列表
        if (bridgeId == 29) {
            for (let i = 0; i < watchbox1.length; i++) {
                options += "<option value='" + i + "'>" + watchbox1[i] + "</option>";
            }
        } else if (bridgeId == 98) {
            for (let i = 0; i < watchbox2.length; i++) {
                options += "<option value='" + i + "'>" + watchbox2[i] + "</option>";
            }
        }
    }
    let $dropdownMenu4 = $("#query_box_menu");
    $dropdownMenu4.empty();
    $dropdownMenu4.append(options);
    $dropdownMenu4.selectpicker('refresh');
    if (init_value) { //有初始值 则进行赋值
        $dropdownMenu4.selectpicker('val', init_value);
    }

    $dropdownMenu4.on("changed.bs.select", function () {
        $('#query_section_menu').empty();
        let section_options = "<option value='-1'>未选中</option>";
        $('#query_section_menu').append(section_options);
        $('.selectpicker').selectpicker('refresh');

        //恢复未选中时
        if ($('#query_box_menu').val() == -1) {
            querySectionListDropdown($('#query_bridge_menu').val(), -1);
        }
        querySensorListDropdown($('#query_bridge_menu').val(), $('#query_section_menu').val(), $('#query_box_menu').val(), -1);
    });
}

//传感器相关下拉列表，写一个映射表，倒推传感器id，metric指定，data选定。如果一次只能查一个，那就分两次查。否则全扔到一个array里。
function querySensorListDropdown(bridge_id, section_id, watch_box_id, init_value) {
    let options;
    let name;
    //要么只有桥梁，要么桥梁+俩其中一个
    if (bridge_id != -1) {
        options = "<option value='-1'>未选中</option>";
        if (bridge_id == 29) {
            name = "振弦传感器";
            if (section_id != -1 || watch_box_id != -1) {
                for (let i = 0; i < sensor_map1.length; i++) {
                    if (sensor_map1[i].includes(section1[section_id]) || sensor_map1[i].includes(watchbox1[watch_box_id])) {
                        options += "<option value='" + i + "'>" + sensor_map1[i][3] + "--" + name + "</option>";
                    }
                }
            } else {
                for (let i = 0; i < sensor_map1.length; i++) {
                    options += "<option value='" + i + "'>" + sensor_map1[i][3] + "--" + name + "</option>";
                }
            }
        } else if (bridge_id == 98) {
            name = "索力传感器"
            if (section_id != -1 || watch_box_id != -1) {
                for (let i = 0; i < sensor_map2.length; i++) {
                    if (sensor_map2[i].includes(section2[section_id]) || sensor_map2[i].includes(watchbox2[watch_box_id])) {
                        options += "<option value='" + i + "'>" + sensor_map2[i][3] + "--" + name + "</option>";
                    }
                }
            } else {
                for (let i = 0; i < sensor_map2.length; i++) {
                    options += "<option value='" + i + "'>" + sensor_map2[i][3] + "--" + name + "</option>"
                }
            }
        }
    } else {
        options += "<option value='-1'>无</option>";
    }

    let $dropdownMenu3 = $("#query_sensor_type_menu");
    $dropdownMenu3.empty();
    $dropdownMenu3.append(options);
    $dropdownMenu3.selectpicker('refresh');
    if (init_value) { //有初始值 则进行赋值
        $dropdownMenu3.selectpicker('val', init_value);
    }
}

//时间初始化
function time_init() {
    // begin
    // 数据图示
    // 初始化图示的tab
    let data_format_str = 'yyyy-MM-dd HH:mm:ss';
    let current_time = new Date().format(data_format_str);
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
}

//metric:CLYB(应变),CLWD(温度);SL(索力)
//数据查询，试一下数据查询，再决定选项卡；再做桥梁图片替换
//从数据库里读出来，作一个反向映射；先按我的方式选到传感器，之后匹配id再找到相关信息（有全部传感器这种读法的吧；有），但实际匹配机制我自己写
function Read_Data() {
    //构造查询信息
    //1、读取传感器数据并匹配，取出对应id。索力有两个传感器，西江一个传感器对应两个metric（数据）
    let url = "/sensor/list";
    let bridge_id = $('#query_bridge_menu').val();
    console.log(bridge_id);
    let response = webRequest(url, "GET", false, {
        page: 1,
        pageSize: 9223372036854770,
        bridgeId: bridge_id | 0,
        sectionId: 0,
        watchPointId: 0,
        watchBoxId: 0
    });
    let data;
    let sensor_id = [];
    let sensor_number = [];
    if (response != null && response['data']) {
        data = response["data"]; //从数据库中读出所有传感器
    }
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        sensor_id += [data[i]['sensor_id'] + ","];
        sensor_number += [data[i]['sensor_number'] + ","];
    }
    if (sensor_id.length > 0) {
        sensor_id = sensor_id.substring(0, sensor_id.length - 1).split(",");
        sensor_number = sensor_number.substring(0, sensor_number.length - 1).split(",");
    } else {
        showTransientDialog("请先选择传感器");
    }

    let sensor_number_array = [];
    let sensor_id_array = []
    let metric = [];
    $('#query_sensor_type_menu option:selected').each(function () {
        sensor_number_array.push($(this).text().split("--")[0])
    });

    if ($('#query_bridge_menu').val() == 29) {
        metric = ["CLYB", "CLWD"];
    } else if ($('#query_bridge_menu').val() == 98) {
        metric = ["SL"];
        //把另一个传感器也加上
        let section_id;
        for (let i = 0; i < sensor_map2.length; i++) {
            if (sensor_map2[i].includes(sensor_number_array[0])) {
                section_id = sensor_map2[i][1]
            }
        }
        for (let i = 0; i < sensor_map2.length; i++) {
            if (sensor_map2[i].includes(section_id) && !sensor_map2[i].includes(sensor_number_array[0])) {
                sensor_number_array += ["," + sensor_map2[i][3]];
                break; //找到另一个，跳出
            }
        }
        sensor_number_array = sensor_number_array.split(",");
    }
    //如索力，多个传感器
    for (let j = 0; j < sensor_number_array.length; j++) {
        for (let i = 0; i < sensor_number.length; i++) {
            if (sensor_number[i] == sensor_number_array[j]) {
                sensor_id_array += [sensor_id[i] + ","];
                break;
            }
        }
    }
    //存在多个传感器
    if (sensor_id_array.includes(",")) {
        sensor_id_array = sensor_id_array.substring(0, sensor_id_array.length - 1).split(",");
    }
    console.log(sensor_id_array);
    console.log(metric);

    //2、报错机制及请求构建，数据读取
    if (metric.length == 0 || sensor_id_array.length == 0 || metric[0].match(/^\s*$/)) {
        showTransientDialog("请先选择传感器");
    } else {
        let figure_id;
        // 刷新中，更换图片
        $('#query_btn').button('loading').delay(1000).queue(function () {
            // 时间限制
            let begin_time = $('#query_latest_udf_begin_time').val();
            let end_time = $('#query_latest_udf_end_time').val();
            if (begin_time >= end_time) {
                $('#query_btn').button('reset').dequeue();
                showTransientDialog("开始时间必须小于截止时间！");
                return;
            }
            var end_row_key = new Date().format('yyyyMMddHHmmssSS');
            console.log(new Date(begin_time).format('yyyyMMddHHmmssSS'));
            console.log(new Date(begin_time).format('yyyyMMddHHmmss'));
            console.log(typeof (sensor_id_array[0]));
            console.log(typeof (sensor_id_array));
            console.log(typeof (metric[0]));
            // 分情况构建查询信息，并作图
            if(bridge_id == 29) {
                //读两次数据，作两幅图
                figure_id = "query_figure1";
                let params = {
                    "sensorList": JSON.stringify(sensor_id_array),
                    "columnList": JSON.stringify([metric[0]]),
                    "startRowKey": new Date(begin_time).format('yyyyMMddHHmmss'),
                    "endRowKey": new Date(end_time).format('yyyyMMddHHmmss'),
                    "limit": 0
                };
                console.log(params);
                // 返回后调用
                let current_dialog = $(this);
                console.log("it's ok")
                let url = "/query-data/figure";
                //let response = webRequest(url, "GET", true, params);
                //successCallback(response,sensor_id_array,sensor_number_array,figure_id);
                Draw_Figure(figure_id, ['2022-07-17-12:05','2022-07-17-12:15'], [14,37]);

                //第二次读数据，并作图
                figure_id = "query_figure2";
                params = {
                    "sensorList": JSON.stringify(sensor_id_array),
                    "columnList": JSON.stringify([metric[1]]),
                    "startRowKey": new Date(begin_time).format('yyyyMMddHHmmss'),
                    "endRowKey": new Date(end_time).format('yyyyMMddHHmmss'),
                    "limit": 0
                };
                //console.log(params);
                response = webRequest(url, "GET", true, params);
                console.log(response);
                //successCallback(response,sensor_id_array,sensor_number_array,figure_id);
                current_dialog.button('reset').dequeue();
                Draw_Figure(figure_id, [2,4,6,8,10,12,14,16], [3,6,4,7,9,13,17,5]);
                refresh_figure();

            } else if(bridge_id == 98){
                figure_id = "query_figure1";
                let params = {
                    "sensorList": JSON.stringify([sensor_id_array[0]]),
                    "columnList": JSON.stringify([metric[0]]),
                    "startRowKey": new Date(begin_time).format('yyyyMMddHHmmss'),
                    "endRowKey": new Date(end_time).format('yyyyMMddHHmmss'),
                    "limit": 0
                };
                console.log(params);
                // 返回后调用
                let current_dialog = $('#query_btn');
                console.log("it's ok")
                //let url = "/query-data/figure";
                //let response = webRequest(url, "GET", true, params);
                //successCallback(response,sensor_id_array,sensor_number_array,figure_id);
                Draw_Figure(figure_id, [2,4,6,8,10,12,14,16], [3,6,4,7,9,13,17,5]);

                //第二次读数据，并作图
                figure_id = "query_figure2";
                params = {
                    "sensorList": JSON.stringify([sensor_id_array[1]]),
                    "columnList": JSON.stringify([metric[0]]),
                    "startRowKey": new Date(begin_time).format('yyyyMMddHHmmss'),
                    "endRowKey": new Date(end_time).format('yyyyMMddHHmmss'),
                    "limit": 0
                };
                //console.log(params);
                //webRequest(url, "GET", true, params, successCallback);
                //successCallback(response,sensor_id_array,sensor_number_array,figure_id);
                current_dialog.button('reset').dequeue();
                //refresh_figure();
                Draw_Figure(figure_id, [2,4,6], [8,10,12]);
            }
        });
    }
}

$("#query_btn").click(function (){
    Read_Data();
});

//数据获取与处理
function successCallback(message,sensor_id_array,sensor_number_array,figure_id) {
    console.log(message);
    let status = message["status"];
    if (status != 0) {
        showTransientDialog(message["msg"]);
        return;
    }
    let xAxis_data = {}; //时间作横坐标
    let series_data = {}; //传感器指标作纵坐标
    for (let index in sensor_id_array) {
        let sensor_id = sensor_id_array[index];
        let sensor_number = sensor_number_array[index];
        // 对于每一个传感器
        let data = message["data"][sensor_id];
        console.log(data)
        if (data.length <= 0) {
            showTransientDialog("传感器" + sensor_number + "对应时间区间数据不存在！");
            continue;
        }
        // 开始展示
        let xAxis_type = "time"; //横坐标轴为时间
        let current_legend_array = []
        Object.keys(data[0]).forEach(function (key) {
            if (key != "CLSJ") {
                series_data[sensor_number + "-" + key] = [];
                xAxis_data[sensor_number + "-" + key] = [];
                current_legend_array.push(sensor_number + "-" + key);
            }
        });
        for (let i in data) {
            // 对于每一行数据
            let row_key = data[i]["CLSJ"];
            let time = new Date(
                row_key.substring(0, 4),      // 年
                parseInt(row_key.substring(4, 6)) - 1,      // 月
                row_key.substring(6, 8),      // 日
                row_key.substring(8, 10),     // 时
                row_key.substring(10, 12),    // 分
                row_key.substring(12, 14),    // 秒
                row_key.substring(14, 16)     // 毫秒
            );
            for (let index in current_legend_array) {
                // 对于每一个指标
                let legend = current_legend_array[index];
                let metric_name = legend.split("-")[1];
                series_data[legend].push(data[i][metric_name]);
                xAxis_data[legend].push(time)
            }
        }
    }
    if (Object.keys(series_data).length <= 0) return;
    console.log(xAxis_data);
    console.log(series_data);
    //showTimeLineChart(figure_id, xAxis_data, series_data, single);
    //我自己的作图
    Draw_Figure(figure_id, xAxis_data, series_data);
}

//作图函数（showTimeLineChart也是用的echarts，应该同理可得）
function Draw_Figure(figure_id, xAxis_data, series_data){
    let charDom = document.getElementById(figure_id);
    let myChart = echarts.init(charDom);
    let option;

    option = {
        xAxis: {
            type: 'category',
            data: xAxis_data
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: series_data,
                type: 'line'
            }
        ]
    };

    //只在option不为空时，才设置并画图
    option && myChart.setOption(option);
}

let it;
//窗口设置定时执行某函数
function refresh_figure(){
    clearInterval(it);
    it = setInterval("Read_Data()", 1000*10);
}

//初始化及选项卡联动
$(function () {
    queryBridgeListDropdown();
    time_init();

    //桥梁选择联动，更换图片（PS：其实也可以放到上边去）
    $('#query_bridge_menu').on('change', function () {
        let bridge_id = $(this).val();
        let content;
        if (bridge_id == 98) {
            content = "<p style='text-align: center;height: 200px;width: 100%'><img src='/images/阅江大桥.png' style='height: auto;width: auto;max-height: 100%;max-width: 100%'></p>";
        } else if (bridge_id == 29) {
            content = "<p style='text-align: center;height: 200px;width: 100%'><img src='/images/西江大桥.png' style='height: auto;width: auto;max-height: 100%;max-width: 100%'></p>";
        } else {
            content = "<p style='text-align: center;height: 200px;width: 100%'></p>";
        }
        $('#bridge-photo').html(content)
    });

});
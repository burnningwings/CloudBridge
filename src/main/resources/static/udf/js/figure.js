// e.g.
// start_time.format('yyyyMMddHHmmss');
Date.prototype.format = function(fmt){
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "H+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S+"  : this.getMilliseconds()             //毫秒，+表示保留两位
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

// 查询条件的映射关系，毫秒
var condition_map = {
    "one_week": 7 * 24 * 3600000,
    "one_month": 30 * 24 * 3600000,
    "three_month": 90 * 24 * 3600000,
    "six_month": 180 * 7 * 24 * 3600000,
    "one_year": 365 * 24 * 3600000,
}

function getQueryCondition(start_time,end_time,condition){
    var time_format = 'yyyyMMddHHmmssSS';
    if(condition!=null && condition!=""){
        var limit = 0;
        var current_time = new Date();
        var start_time = new Date(current_time.getTime() - condition_map[condition]);
        var start_row_key = start_time.format(time_format);
        var end_row_key = current_time.format(time_format);
        console.log(start_row_key,end_row_key)
    }else{

    }
    var query_condition = {
        "startRowKey": start_row_key,
        "endRowKey": end_row_key,
        "limit": limit
    }
    return query_condition;
}

// 画出折线图
// e.g. showLineChart("myid","category",["1","2"],{"legend1":["11","12"],"legend2":["21","22"]})
function showLineChart(figure_id,xAxis_type,xAxis_data,series_data){
    console.log(figure_id,xAxis_type,xAxis_data,series_data)
    var series = [];
    var legend_data = [];
    for(var key in series_data){
        legend_data.push(key);
        series.push({
            name: key,
            data: series_data[key],
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            smooth: true
        });
    }
    var option = {
        legend: {
            left: 'center',
            data: legend_data
        },
        tooltip : {
            trigger: 'item',
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: xAxis_type,
            data: xAxis_data,
            splitLine: {
                show: true
            }
        },
        yAxis: {
            type: 'value'
        },
        toolbox: {
            show: true,
            right: '5%',
            feature: {
                dataView: {
                    readOnly: true,
                    // lang: ['数据视图', '关闭'],
                    optionToContent: function (opt) {
                        let axisData = opt.xAxis[0].data; //坐标数据
                        let series = opt.series; //折线图数据
                        let tdHeads = '<td  style="padding: 0 10px">时间</td>'; //表头
                        let tdBodys = ''; //数据
                        series.forEach(function (item) {
                            //组装表头
                            tdHeads += `<td style="padding: 0 10px">${item.name}</td>`;
                        });
                        let table = `<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>${tdHeads} </tr>`;
                        for (let i = 0, l = axisData.length; i < l; i++) {
                            for (let j = 0; j < series.length; j++) {
                                //组装表数据
                                tdBodys += `<td>${series[j].data[i]}</td>`;
                            }
                            table += `<tr><td style="padding: 0 10px">${axisData[i]}</td>${tdBodys}</tr>`;
                            tdBodys = '';
                        }
                        table += '</tbody></table>';
                        return table;
                    }
                },
                // restore: {
                //     show: false
                // },
                saveAsImage: {
                    show: true
                }
            }
        },
        series: series
    };
    var chart = echarts.init(document.getElementById(figure_id));
    chart.setOption(option);
}

// 画出时间折线图
// e.g. showLineChart("myid",{"legend1":time_array_1,"legend2":time_array_2},{"legend1":["11","12"],"legend2":["21","22"]})
function showTimeLineChart(figure_id,time_array,series_data,single){
    console.log(figure_id, time_array,series_data,single);
    var series = [];
    var legend_data = [];
    for(var key in series_data){
        console.log(key);
        legend_data.push(key);
        var temp = [];
        for(var index in series_data[key]){
            temp.push({
                name:time_array[key][index].toString(),
                value: [
                    time_array[key][index].format('yyyy-MM-dd HH:mm:ss.SS'),
                    series_data[key][index]
                ]
            })
        }
        series.push({
            name: key,
            data: temp,
            type: 'line',
            barMaxWidth:'25',
            smooth: true
        });
    }
    var option = {
        legend: {
            left: 'center',
            data: legend_data
        },
        tooltip : {
            trigger: 'item',
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: "time",
            splitLine: {
                show: true
            }
        },
        yAxis: {
            type: 'value'
        },
        toolbox: {
            show: true,
            right: '5%',
            feature: {
                dataView: {
                    readOnly: true,
                    // lang: ['数据视图', '关闭'],
                    optionToContent: function (opt) {
                        let table_series = null;
                        if(single || opt.series.length==1){
                            table_series = opt.series; //折线图数据
                        }else{
                            showTransientDialog("当前仅支持显示一种传感器.");
                            table_series = [opt.series[0]]; //折线图数据
                        }
                        let axisData = time_array[table_series[0].name]; //坐标数据
                        let tdHeads = '<td  style="padding: 0 10px">时间</td>'; //表头
                        let tdBodys = ''; //数据
                        table_series.forEach(function (item) {
                            //组装表头
                            tdHeads += `<td style="padding: 0 10px">${item.name}</td>`;
                        });
                        let table = `<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>${tdHeads} </tr>`;
                        for (let i = 0, l = axisData.length; i < l; i++) {
                            // i表示同一条线
                            for (let j = 0; j < table_series.length; j++) {
                                //组装表
                                tdBodys += `<td>${table_series[j].data[i]["value"][1]}</td>`;
                            }
                            // 时间
                            table += `<tr><td style="padding: 0 10px">${axisData[i].format('yyyy-MM-dd HH:mm:ss.SS')}</td>${tdBodys}</tr>`;
                            tdBodys = '';
                        }
                        table += '</tbody></table>';
                        return table;
                    }
                },
                // restore: {
                //     show: false
                // },
                saveAsImage: {
                    pixelRatio:2,
                    show: true
                },
                magicType: {
                    show: true,
                    type: ['line','bar']
                },
            }
        },
        series: series
    };
    var chart = echarts.init(document.getElementById(figure_id));
    chart.setOption(option);
}

function showPredictResultChart(figure_id, predict_list, index_list) {
    console.log('show figure result');

    var option = {
        title : {
            text : '预测结果'
        },
        tooltip: {},
        legend: {
            data : ['损伤位置']
        },
        xAxis :{
            data : index_list,
            show : false
            //type : 'value'
        },
        yAxis : {
            type : 'value',
            min : 0,
            max : 40,
            interval : 5
        },
        toolbox : {
            show : true,
            right : '5% ',
            feature :{
                dataView:{
                    readOnly: true,
                    optionToContent: function (opt) {
                        var series = opt.series[0].data;
                        var index = opt.xAxis[0].data;
                        var tdHeads = '<td  style="padding: 0 10px">记录编号</td>'
                                        +'<td  style="padding: 0 10px">预测损伤位置</td>'; //表头
                        var table = '<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>'+tdHeads+'</tr>';
                        var tdBody = '';
                        for(var i = 0; i < series.length;i++)
                        {
                            table += '<tr><td style="padding: 0 10px">'+index[i]+'</td><td style="padding: 0 10px">'+series[i]+'</td></tr>';
                        }
                        table += '</tbody></table>';
                        return table;
                    }
                },
                saveAsImage: {
                    pixelRatio:2,
                    show: true
                },
                // magicType: {
                //     show: true,
                //     type: ['scatter','line']
                // },
            }

        },
        series : [{
            name : '损伤位置',
            type : 'scatter',
            data : predict_list
        }]
    };
    var chart = echarts.init(document.getElementById(figure_id));
    chart.setOption(option);
}


function showPredictResultChart_OVERWEIGHT(figure_id, predict_list, index_list) {
    console.log('show figure result');

    var option = {
        title : {
            text : '预测结果'
        },
        tooltip: {},
        legend: {
            data : ['超重情况']
        },
        xAxis :{
            data : index_list,
            show : false
            //type : 'value'
        },
        yAxis : {
            type : 'value',
            min : 0,
            max : 1,
            interval : 1
        },
        toolbox : {
            show : true,
            right : '5% ',
            feature :{
                dataView:{
                    readOnly: true,
                    optionToContent: function (opt) {
                        var series = opt.series[0].data;
                        var index = opt.xAxis[0].data;
                        var tdHeads = '<td  style="padding: 0 10px">记录编号</td>'
                            +'<td  style="padding: 0 10px">预测超重情况</td>'; //表头
                        var table = '<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>'+tdHeads+'</tr>';
                        var tdBody = '';
                        for(var i = 0; i < series.length;i++)
                        {
                            table += '<tr><td style="padding: 0 10px">'+index[i]+'</td><td style="padding: 0 10px">'+series[i]+'</td></tr>';
                        }
                        table += '</tbody></table>';
                        return table;
                    }
                },
                saveAsImage: {
                    pixelRatio:2,
                    show: true
                },
                // magicType: {
                //     show: true,
                //     type: ['scatter','line']
                // },
            }

        },
        series : [{
            name : '超重情况',
            type : 'scatter',
            data : predict_list
        }]
    };
    var chart = echarts.init(document.getElementById(figure_id));
    chart.setOption(option);
}

// function showAnalysisResultChart(figure_id, sensor1, sensor2) {
//     var option = {
//         title : {
//             text : "关联分析"
//         },
//         tooltip : {
//
//         },
//         legend : {
//             data : ['sensor1', 'sensor2']
//         },
//         xAxis: {
//             min : 20,
//             max : 30
//         },
//         yAxis: {
//
//         },
//         series: [
//             {
//                 name : 'sensor1',
//                 type : 'line',
//                 //data : [[21.3,0.003], [22.3,0.004], [23.3,0.002], [23.4,0.004], [23.0,0.001], [22.8,0.004], [22.2,0.002]]
//                 data: sensor1
//             },
//             {
//                 name : 'sensor2',
//                 type : 'line',
//                // data : [[21.3,0.001], [22.3,0.001], [23.3,0.002], [23.4,0.002], [23.0,0.001], [22.8,0.002], [22.2,0.001]]
//                 data : sensor2
//             }
//             // {
//             //     name : 'sensor3',
//             //     type : 'line',
//             //     data : [[21.3,0.005], [22.3,0.006], [23.3,0.006], [23.4,0.007], [23.0,0.008], [22.8,0.009], [22.2,0.009]]
//             // }
//         ]
//     };
//     var chart = echarts.init(document.getElementById(figure_id));
//     chart.setOption(option);
// }

// function showAnalysisResultChart(figure_id, temp1) {
//     var num_sensor = Object.keys(temp1).length
//     console.log(num_sensor);
//     var sensorlist = [];
//     var series = [];
//     for(var key in temp1){
//
//         var sensor_id = 'sensor'+key;
//         sensorlist.push(sensor_id);
//         series.push({
//             name : sensor_id,
//             type : "line",
//             data : temp1[key]
//         })
//
//     }
//     console.log(sensorlist);
//     console.log(series);
//
//     var option = {
//         title : {
//             text : "关联分析"
//         },
//         tooltip : {
//
//         },
//         legend : {
//             data : sensorlist
//         },
//         xAxis: {
//             min : 'dataMin',
//             max : 'dataMax'
//         },
//         yAxis: {
//
//         },
//         series: series
//     };
//     var chart = echarts.init(document.getElementById(figure_id));
//     chart.setOption(option);
// }

function showAnalysisResultChart(figure_id, temp1, temp2, analysisresult) {

    var resultlist = analysisresult;
    var num_sensor = Object.keys(temp1).length
    console.log(num_sensor);
    var sensorlist = [];
    var series = [];
    var series1 = [];
    for(var key in temp1){

        var sensor_id = 'sensor'+key;
        sensorlist.push(sensor_id);
        series.push({
            xAxisIndex : 0,
            yAxisIndex : 0,
            name : sensor_id,
            type : "line",
            data : temp1[key]
        })
    }
    for(var key in temp2){

        var sensor_id = 'sensor'+key;
        sensorlist.push(sensor_id);
        series1.push({
            xAxisIndex : 1,
            yAxisIndex : 1,
            name : sensor_id,
            type : "line",
            data : temp2[key],

        })
    }
    series_merge = series.concat(series1);


    console.log(sensorlist);
    console.log(series);

    var option = {
        title : [{
            text : "温度与桥顶传感器变化关系",
            x : 380,
            y : 35,
        },{
            text : "温度与桥底传感器变化关系",
            x : 380,
            y : 310,
        }
        ],
        grid:[
            { x : '17%', y : '7%', height : '40%', width : '70%'},
            { x : '17%', y2 : '7%', height : '40%', width : '70%'}
        ],
        tooltip : {

        },
        toolbox : {
            show : true,
            right : '5% ',
            feature :{
                dataView:{
                    readOnly: true,
                    optionToContent: function (opt) {
                        // var series = opt.series[0].data;
                        // var index = opt.xAxis[0].data;
                        var tdHeads = '<td  style="padding: 0 10px">测量温度位置</td>'
                            +'<td  style="padding: 0 10px">传感器编号</td>'
                            +'<td  style="padding: 0 10px">k值</td>'
                            +'<td  style="padding: 0 10px">b值</td>>'; //表头
                        var table = '<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>'+tdHeads+'</tr>';
                        var tdBody = '';
                        for(var i = 0; i < resultlist.length;i++)
                        {
                            table += '<tr><td style="padding: 0 10px">'+resultlist[i][0]+
                                '</td><td style="padding: 0 10px">'+resultlist[i][1]+
                                '</td><td style="padding: 0 10px">'+resultlist[i][2]+
                                '</td><td style="padding: 0 10px">'+resultlist[i][3]+'</tr>';
                        }
                        table += '</tbody></table>';
                        return table;
                    }
                },
                saveAsImage: {
                    pixelRatio:2,
                    show: true
                },

            }

        },
        legend : [
            { data : sensorlist , left : '10%'},
            { data : sensorlist , left : '10%'}
        ],
        xAxis: [
            {
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 0
            },
            {
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 1
            }
        ],
        yAxis: [
            { gridIndex : 0},
            { gridIndex : 1}
        ],
        series: series_merge
    };
    var chart = echarts.init(document.getElementById(figure_id));
    chart.setOption(option);
}

function  showWaveletResultChart(figure_id, timeList, temperatureList, strainList) {
    console.log(timeList)
    console.log(temperatureList)
    console.log(strainList)
    // var option = {
    //     title : {
    //         text : '小波分析图',
    //         x: 'center'
    //     },
    //     grid : {},
    //     toolbox : {
    //         show : true,
    //         right : '5% ',
    //         feature :{
    //             saveAsImage: {
    //                 pixelRatio:2,
    //                 show: true
    //             },
    //
    //         }
    //     },
    //     tooltip : {
    //
    //     },
    //     legend : {
    //         data : ['温度', '应变'],
    //         x : 'left'
    //     },
    //     xAxis: {
    //         min : 'dataMin',
    //         max : 'dataMax',
    //     },
    //     yAxis:[
    //         {
    //             name : '温度',
    //             yAxisIndex : 0,
    //         },
    //         {
    //             name : '应变',
    //             yAxisIndex : 1
    //
    //         }
    //     ],
    //     series : [
    //         {
    //             name : '温度',
    //             type : 'line',
    //             data : [[1,3],[2,2],[3.5,4],[4,3]],
    //             yAxisIndex : 0
    //         },
    //         {
    //             name : '应变',
    //             type : 'line',
    //             data : [[1,23],[2,34],[3.5,67],[4,76]],
    //             yAxisIndex : 1
    //         }
    //     ]
    // };

        // var option = {
        //     title : {
        //         text : '小波分析图',
        //         x: 'center'
        //     },
        //     grid : {},
        //     toolbox : {
        //         show : true,
        //         right : '5% ',
        //         feature :{
        //             saveAsImage: {
        //                 pixelRatio:2,
        //                 show: true
        //             },
        //
        //         }
        //     },
        //     tooltip : {
        //
        //     },
        //     legend : {
        //         data : ['温度', '应变'],
        //         x : 'left'
        //     },
        //     xAxis: {
        //         min : 'dataMin',
        //         max : 'dataMax',
        //     },
        //     yAxis:[
        //         {
        //             name : '温度',
        //             yAxisIndex : 0,
        //         },
        //         {
        //             name : '应变',
        //             yAxisIndex : 1
        //
        //         }
        //     ],
        //     series : [
        //         {
        //             name : '温度',
        //             type : 'line',
        //             data : [[1,3],[2,2],[3.5,4],[4,3]],
        //             yAxisIndex : 0
        //         },
        //         {
        //             name : '应变',
        //             type : 'line',
        //             data : [[1,23],[2,34],[3.5,67],[4,76]],
        //             yAxisIndex : 1
        //         }
        //     ]
        // };
        var option = {
            title : {
                text : '小波分析图',
                x: 'center'
            },
            grid : {},
            toolbox : {
                show : true,
                right : '5% ',
                feature :{
                    saveAsImage: {
                        pixelRatio:2,
                        show: true
                    },

                }
            },
            tooltip : {

            },
            legend : {
                data : ['温度', '应变'],
                x : 'left'
            },
            xAxis: {
                name : '时间',
                type : 'category',
                data : timeList
            },
            yAxis:[
                {
                    name : '温度',
                    yAxisIndex : 0,
                    min : 'dataMin',
                    max : 'dataMax',
                },
                {
                    name : '应变',
                    yAxisIndex : 1,
                    min : 'dataMin',
                    max : 'dataMax',
                }
            ],
            series : [
                {
                    name : '温度',
                    type : 'line',
                    data : temperatureList,
                    yAxisIndex : 0
                },
                {
                    name : '应变',
                    type : 'line',
                    data : strainList,
                    yAxisIndex : 1
                }
            ]
        };
        var chart = echarts.init(document.getElementById(figure_id));
        chart.setOption(option);
}
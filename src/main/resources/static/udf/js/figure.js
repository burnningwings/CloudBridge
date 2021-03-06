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
    var time_format = 'yyyyMMddHHmmss';
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
            name: key.split("-")[0],
            //name: key,
            data: temp,
            type: 'line',
            barMaxWidth:'25',
            smooth: true
        });
    }
    //console.log(legend_data[0].split("-")[1])
    var legend_cn = [];
    for(var j=0, len=legend_data.length; j<len;j++){
        legend_cn.push(legend_data[j].split("-")[0]);
    }
    console.log(legend_cn)
    console.log(legend_data)

    var option = {
        legend: {
            left: 'center',
            data: legend_cn
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
            type: 'value',
            scale: true
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

// function showPredictUDFResultChart(figure_id, timelist, locationlist, levellist) {
//     console.log(timelist);
//     console.log(locationlist);
//     console.log(levellist);
//     // var three = [];
//     // for(var i=0;i<locationlist.length;i++){
//     //     three.push([timelist[i], locationlist[i],levellist[i]]);
//     // }
//     // console.log(three);
//
//     //three = [['1',13,20],['2',25,50],['3',16,40],['4',25,60]];
//     // var two = [];
//     // for(var i = 0; i < locationlist.length; i++){
//     //     two[i] = [locationlist[i],levellist[i]];
//     // }
//     // console.log(two);
//     var option = {
//         title : {
//             text : '预测结果'
//         },
//         tooltip: {},
//         legend: {
//             data : ['损伤位置']
//         },
//         xAxis :{
//             data : timelist,
//             show : true,
//             name : '时间'
//             //type : 'value'
//         },
//         yAxis : {
//             type : 'value',
//             min : 0,
//             max : 40,
//             interval : 1,
//             name : "损伤位置"
//         },
//         // visualMAP : [
//         //     {
//         //         min : 0,
//         //         max: 100,
//         //         splitNumber : 10,
//         //        // dimension : 1
//         //
//         //     }
//         // ],
//         dataZoom : [
//             {
//                 type : 'slider',
//                 show : true,
//                 start : 0,
//                 end : 30,
//                 handleSize : 8,
//                 height : 10
//             },
//             {
//                 type : 'inside',
//                 start : 0,
//                 end : 30
//             },
//             {
//                 type : 'slider',
//                 show : true,
//                 yAxisIndex : 0,
//                 filterMode : 'empty',
//                 width : 10,
//                 height : '70%',
//                 handleSize : 8,
//                 showDataShadow : false,
//                 left : '93%',
//                 start : 0,
//                 end : 30
//             }
//         ],
//         toolbox : {
//             show : true,
//             right : '5% ',
//             feature :{
//                 dataView:{
//                     readOnly: true,
//                     optionToContent: function (opt) {
//                         var series = opt.series[0].data;
//                         var index = opt.xAxis[0].data;
//                         var tdHeads = '<td  style="padding: 0 10px">测量时间</td>'
//                             +'<td  style="padding: 0 10px">预测损伤位置</td>'
//                             +'<td  style="padding: 0 10px">预测损伤级别</td>'; //表头
//                         var table = '<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>'+tdHeads+'</tr>';
//                         var tdBody = '';
//                         for(var i = 0; i < series.length;i++)
//                         {
//                             table += '<tr><td style="padding: 0 10px">'+index[i]+'</td><td style="padding: 0 10px">'+series[i]+'</td><td  style="padding: 0 10px">'+levellist[i]+'</td></tr>';
//                         }
//                         table += '</tbody></table>';
//                         return table;
//                     }
//                 },
//                 saveAsImage: {
//                     pixelRatio:2,
//                     show: true
//                 },
//                 // magicType: {
//                 //     show: true,
//                 //     type: ['scatter','line']
//                 // },
//             }
//
//         },
//         series : [{
//             name : '损伤位置',
//             type : 'scatter',
//             data : locationlist
//             //data : three
//         }]
//     };
//     var chart = echarts.init(document.getElementById(figure_id));
//     chart.setOption(option);
// }

function showPredictUDFResultChart(figure_id, timelist, locationlist, levellist) {

    // var databj = [[0,12,30],[1,14,20],[2,15,40]];
    var three = [];
    for(var i=0;i<locationlist.length;i++){
        three.push( [i, locationlist[i],levellist[i] ]);
    }
    console.log(three);

    // var itemStyle = {
    //     normal: {
    //         opacity: 0.8,
    //         shadowBlur: 10,
    //         shadowOffsetX: 0,
    //         shadowOffsetY: 0,
    //         shadowColor: 'rgba(0, 0, 0, 0.5)'
    //     }
    // };
    option = {
        // backgroundColor : '#404a59',
        // grid : {
        //     x : '10%',
        //     x2 : 150,
        //     y : '18%',
        //     y2 : '10%'
        // },
        title : {
            text : '预测结果'
        },
        tooltip: {},
        legend: {
            data : ['损伤位置']
        },
        xAxis : {
            type : 'category',
            data : timelist,
            name : '时间',
            show : true,
            splitLine : {
                show : true,
                lineStyle : {
                    width:1,
                    type:'solid',
                }
            }
            // splitLine : {
            //     show : false
            // },
            // axisLine: {
            //     lineStyle : {
            //         color : '#eee'
            //     }
            // }
        },
        yAxis : {
            type : 'value',
            name : '损伤位置',
            min : 0,
            max : 40,
            interval : 1
            // nameTextStyle: {
            //     color: '#fff',
            //     fontSize: 16
            // },
            // axisLine: {
            //     lineStyle: {
            //         color: '#eee'
            //     }
            // },
            // splitLine: {
            //     show: false
            // }
        },
        visualMap : [
            {
                //left : 'right',
                right : '0%',
                bottom : '5%',
                dimension : 2,
                min : 0,
                max : 100,
                itemHeight : 120,
                calculable : true,
                text : ['明暗 : 损伤级别'],
                textGap : 30

            }
        ],
        dataZoom : [
            {
                type : 'slider',
                show : true,
                start : 0,
                end : 30,
                handleSize : 8,
                height : 10
            },
            {
                type : 'inside',
                start : 0,
                end : 30
            },
            {
                type : 'slider',
                show : true,
                yAxisIndex : 0,
                filterMode : 'empty',
                width : 10,
                height : '70%',
                handleSize : 8,
                showDataShadow : false,
                left : '90%',
                start : 0,
                end : 30
            }
        ],
        toolbox : {
            show : true,
            right : '5% ',
            feature :{
                dataView:{
                    readOnly: true,
                    optionToContent: function (opt) {
                        var series = opt.series[0].data;
                        var index = opt.xAxis[0].data;
                        var tdHeads = '<td  style="padding: 0 10px">测量时间</td>'
                            +'<td  style="padding: 0 10px">预测损伤位置</td>'
                            +'<td  style="padding: 0 10px">预测损伤级别</td>'; //表头
                        var table = '<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>'+tdHeads+'</tr>';
                        var tdBody = '';
                        for(var i = 0; i < series.length;i++)
                        {
                            table += '<tr><td style="padding: 0 10px">'+index[i]+'</td><td style="padding: 0 10px">'+locationlist[i]+'</td><td  style="padding: 0 10px">'+levellist[i]+'</td></tr>';
                        }
                        table += '</tbody></table>';
                        return table;
                    }
                },
                restore: {show : true},

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
        series : [
            {
                name : '损伤位置',
                type : 'scatter',
                //itemStyle : itemStyle,
                data : three
            }
        ]
    };
    var chart = echarts.init(document.getElementById(figure_id));
    chart.setOption(option);

}

function showPredictDDResultChart(figure_id, locationlist, levellist,loc,lv) {

    const x = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50];
    const y = [1,2,3,4,5];

    var test_data = [];
    if (loc.length > 0 && lv.length>0){
        for (var i=0;i<5;i++){
            for (var j=0;j<50;j++){
                test_data.push([i,j,0])
            }
        }
        for(var i=0;i<loc.length;i++){
            test_data[parseInt(loc[i])][2] = parseInt(lv[i])/100
        }
        console.log(test_data)
        test_data = test_data.map(function (item) {
            return [item[1],item[0],item[2] || '-']
        });
        console.log(test_data)
    }

    var data = [];
    for (var i=0;i<5;i++){
        for (var j=0;j<50;j++){
            data.push([i,j,0])
        }
    }
    for(var i=0;i<locationlist.length;i++){
        data[parseInt(locationlist[i])][2] = parseInt(levellist[i])/100
    }
    console.log(data)
    data = data.map(function (item) {
        return [item[1],item[0],item[2] || '-']
    });
    console.log(data)

    option = {
        tooltip: {
            position: 'top'
        },
        title: [
            {
                text: "模拟简支梁桥",
                top: '6%',
                left: 'center',
                textStyle: {
                    fontFamily: 'SimSun',
                }
            },
            {
                text: "损伤识别结果",
                top: '41%',
                left: 'center',
                textStyle: {
                    fontFamily: 'SimSun',
                },
            }
        ],
        grid: [
            {
                id: 0,
                height: "25%",
                top: "10%"
            },
            {
                id: 1,
                height: '25%',
                top: '45%'
            },
        ],
        xAxis: [
            {
                type: 'category',
                data: x,
                gridIndex: 0,
                splitArea: {
                    show: true
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            },
            {

                type: 'category',
                data: x,
                gridIndex: 1,
                splitArea: {
                    show: true
                }
            },
        ],
        yAxis: [
            {
                type: 'category',
                data: y,
                gridIndex: 0,
                splitArea: {
                    show: true
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            },
            {
                type: 'category',
                data: y,
                gridIndex: 1,
                splitArea: {
                    show: true
                }
            }
        ],
        visualMap: [
            {
                min: 0,
                max: 1,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '15%'
            },
            {
                min: 0,
                max: 1,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '15%'
            }
        ],
        series: [
            {
                name: '实际损伤位置',
                type: 'heatmap',
                // data: test_data,
                xAxisIndex: 0,
                yAxisIndex: 0,
                label: {
                    normal: {
                        show: true,
                    }
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            },
            {
                name: '损伤位置',
                type: 'heatmap',
                data: data,
                xAxisIndex: 1,
                yAxisIndex: 1,
                label: {
                    normal: {
                        show: true,
                    }
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
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
                            table += '<tr><td style="padding: 0 10px">'+series[i]+'</td></tr>';
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

function showPredictUDFResultChart_OVERWEIGHT(figure_id, timelist, overweightlist){

    var count = countNumOverweight(timelist, overweightlist);
    var countTime = [];
    var countOverweight = [];
    count.forEach(function (value, key, map) {
        countTime.push(key);
        countOverweight.push(parseInt(value / 6));
    })
    console.log(countTime)
    console.log(countOverweight);


    var option = {
        title : [{
            text : '识别结果',
            left : 'center'
            },
            {
                text : '每个时段超重车辆统计',
                left : 'center',
                top : '52%'
            }],
        tooltip: {},
        // legend: {
        //     data : ['超重情况 0:正常，1:超重']
        // },
        grid:[
            { x : '17%', y : '7%', height : '39%', width : '70%'},
            { x : '17%', y2 : '5%', height : '39%', width : '70%'}
        ],
        xAxis :[
            {
            name : '时间',
            data : timelist,
            show : true,
            gridIndex : 0
            //type : 'value'
            },
            {
                name : '时间',
                data : countTime,
                show : true,
                gridIndex : 1
            }
        ],
        yAxis : [
            {
            name : '超重情况 [1:超重，0:正常]',
            type : 'value',
            min : 0,
            max : 1,
            interval : 1,
            gridIndex : 0
            },
            {
                name : '超重车数量',
                type : 'value',
                gridIndex : 1
            }
        ],
        dataZoom : [
            {
                type : 'slider',
                show : true,
                start : 0,
                end : 0.1,
                handleSize : 8 ,
                height : 10,
                xAxisIndex : 0,
                top : '50%'
            },
            {
                type : 'slider',
                show : true,
                yAxisIndex : 0,
                width : 15,
                height : '37%',
                handleSize : 8,
                showDataShadow : false,
                left : '90%',
                start : 0,
                end : 100,

            },
            {
                type : 'inside',
                start : 0,
                end : 30,
               // xAxisIndex: 1,
               // yAxisIndex: 1
            },
            {
                type : 'slider',
                show : true,
                start : 0,
                end : 100,
                // handleSize : '50%' ,
                height : 10,
                xAxisIndex : 1,
                top : '98%'
            },
            {
                type : 'inside',
                start : 0,
                end : 30,
                xAxisIndex: 1
            },
            {
                type : 'slider',
                show : true,
                yAxisIndex : 1,
                width : 15,
                height : '37%',
                handleSize : 8,
                showDataShadow : false,
                left : '90%',
                top : '55%',
                start : 0,
                end : 100,

            }
            // {
            //     type : 'slider',
            //     show : true,
            //     yAxisIndex : 0,
            //     filterMode : 'empty',
            //     width : 10,
            //     //height : '70%',
            //     //handleSize : 8,
            //     showDataShadow : false,
            //     //left : '90%',
            //     start : 0,
            //     end : 100,
            //     //xAxisIndex : 0,
            //     yAxisIndex : 0
            // }
        ],
        toolbox : {
            show : true,
            right : '10% ',
            feature :{
                dataView:{
                    readOnly: true,
                    optionToContent: function (opt) {
                        var series = opt.series[0].data;
                        var index = opt.xAxis[0].data;
                        var tdHeads = '<td  style="padding: 0 10px">测量时间</td>'
                            +'<td  style="padding: 0 10px">识别是否超重</td>'; //表头
                        var table = '<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>'+tdHeads+'</tr>';
                        var tdBody = '';
                        for(var i = 0; i < series.length;i++)
                        {
                            table += '<tr><td style="padding: 0 10px">'+timelist[i]+'</td><td style="padding: 0 10px">'+series[i]+'</td></tr>';
                        }
                        table += '</tbody></table>';
                        return table;
                    }
                },
                saveAsImage: {
                    pixelRatio:2,
                    show: true
                },
                restore: {show : true},
                // magicType: {
                //     show: true,
                //     type: ['bar'],
                //     option : {
                //         xAxis :{
                //             type : 'category',
                //             data : countTime
                //         },
                //         yAxis: {
                //             type : 'value'
                //         },
                //         series : [
                //             {
                //                 data : countOverweight,
                //                 type : 'bar'
                //             }
                //             ]
                //     }
                //     // option: {
                //     //     bar : {
                //     //         xAxis :{
                //     //             type : 'category',
                //     //             data : countTime
                //     //         },
                //     //         yAxis: {
                //     //             type : 'value'
                //     //         },
                //     //         series : [
                //     //             {
                //     //                 data : countOverweight,
                //     //                 type : 'bar'
                //     //             }
                //     //         ]
                //     //     }
                //     // }
                //
                //     // seriesIndex : {
                //     //     bar : [['a',32],['b',31],['c',12]]
                //     // }
                // },
            }

        },
        series : [
            {
                name : '超重情况',
                type : 'scatter',
                data : overweightlist,
                xAxisIndex : 0,
                yAxisIndex : 0
            },
            {
                name : '统计',
                type : 'bar',
                data : countOverweight,
                xAxisIndex : 1,
                yAxisIndex : 1
            }
        ]
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

// function showAnalysisResultChart(figure_id, temp1, temp2, analysisresult) {
//
//     var resultlist = analysisresult;
//     var num_sensor = Object.keys(temp1).length
//     console.log(num_sensor);
//     var sensorlist = [];
//     var series = [];
//     var series1 = [];
//     for(var key in temp1){
//
//         var sensor_id = 'sensor'+key;
//         sensorlist.push(sensor_id);
//         series.push({
//             xAxisIndex : 0,
//             yAxisIndex : 0,
//             name : sensor_id,
//             type : "line",
//             data : temp1[key]
//         })
//     }
//     for(var key in temp2){
//
//         var sensor_id = 'sensor'+key;
//         sensorlist.push(sensor_id);
//         series1.push({
//             xAxisIndex : 1,
//             yAxisIndex : 1,
//             name : sensor_id,
//             type : "line",
//             data : temp2[key],
//
//         })
//     }
//     series_merge = series.concat(series1);
//
//
//     console.log(sensorlist);
//     console.log(series);
//
//     var option = {
//         title : [{
//             text : "温度与桥顶传感器变化关系",
//             x : 380,
//             y : 35,
//         },{
//             text : "温度与桥底传感器变化关系",
//             x : 380,
//             y : 310,
//         }
//         ],
//         grid:[
//             { x : '17%', y : '7%', height : '40%', width : '70%'},
//             { x : '17%', y2 : '7%', height : '40%', width : '70%'}
//         ],
//         tooltip : {
//
//         },
//         toolbox : {
//             show : true,
//             right : '5% ',
//             feature :{
//                 dataView:{
//                     readOnly: true,
//                     optionToContent: function (opt) {
//                         // var series = opt.series[0].data;
//                         // var index = opt.xAxis[0].data;
//                         var tdHeads = '<td  style="padding: 0 10px">测量温度位置</td>'
//                             +'<td  style="padding: 0 10px">传感器编号</td>'
//                             +'<td  style="padding: 0 10px">k值</td>'
//                             +'<td  style="padding: 0 10px">b值</td>>'; //表头
//                         var table = '<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>'+tdHeads+'</tr>';
//                         var tdBody = '';
//                         for(var i = 0; i < resultlist.length;i++)
//                         {
//                             table += '<tr><td style="padding: 0 10px">'+resultlist[i][0]+
//                                 '</td><td style="padding: 0 10px">'+resultlist[i][1]+
//                                 '</td><td style="padding: 0 10px">'+resultlist[i][2]+
//                                 '</td><td style="padding: 0 10px">'+resultlist[i][3]+'</tr>';
//                         }
//                         table += '</tbody></table>';
//                         return table;
//                     }
//                 },
//                 saveAsImage: {
//                     pixelRatio:2,
//                     show: true
//                 },
//
//             }
//
//         },
//         legend : [
//             { data : sensorlist , left : '10%'},
//             { data : sensorlist , left : '10%'}
//         ],
//         xAxis: [
//             {
//                 min : 'dataMin',
//                 max : 'dataMax',
//                 gridIndex : 0
//             },
//             {
//                 min : 'dataMin',
//                 max : 'dataMax',
//                 gridIndex : 1
//             }
//         ],
//         yAxis: [
//             { gridIndex : 0},
//             { gridIndex : 1}
//         ],
//         series: series_merge
//     };
//     var chart = echarts.init(document.getElementById(figure_id));
//     chart.setOption(option);
// }

function showAnalysisResultChart_sevenlayer(figure_id, timeList, strain, sa7, sd1, sd2, sd3, sd4, sd5, sd6, sd7, temperature, ta7, td1, td2, td3, td4, td5, td6, td7){
    var option = {
        title : [
            {
                left : 'center',
                text : '原始温度/原始应变',
                top : '1%'
             },
            {
                top : '12%',
                left : 'center',
                text : '小波a7层温度/小波a7层应变'
            },
            {
                top: '23%',
                left : 'center',
                text : '小波d1层温度/小波d1层应变'
            },
            {
                top: '34%',
                left : 'center',
                text : '小波d2层温度/小波d2层应变'
            },
            {
                top: '45%',
                left : 'center',
                text : '小波d3层温度/小波d3层应变'
            },
            {
                top: '56%',
                left : 'center',
                text : '小波d4层温度/小波d4层应变'
            },
            {
                top: '67%',
                left : 'center',
                text : '小波d5层温度/小波d5层应变'
            },
            {
                top: '78%',
                left : 'center',
                text : '小波d6层温度/小波d6层应变'
            },
            {
                top: '89%',
                left : 'center',
                text : '小波d7层温度/小波d7层应变'
            }
        ],
        tooltip: {},
        grid : [
            {
                id : 0,
               // top : '1%',
                height : '8%'
              },
            {
                 id : 1,
                 top : '13%',
                 height : '8%'
             },
            {
                id : 2,
                top : '24%',
                height : '8%'
            },
            {
                id : 3,
                top : '35%',
                height : '8%'
            },
            {
                id : 4,
                top : '46%',
                height : '8%'
            },
            {
                id : 5,
                top : '57%',
                height : '8%'
            },
            {
                id : 6,
                top : '68%',
                height : '8%'
            },
            {
                id : 7,
                top : '79%',
                height : '8%'
            },
            {
                id : 8,
                top : '90%',
                height : '8%'
            }
        ],
        legend : [
            {
                data : ['应变','温度'],
                x : 'left',
                top : 'top'
            },
            // {
            //     data : ['应变','温度'],
            //     x : 'left'
            // }
        ],
        dataZoom : [
            {
                type : 'inside',
                xAxisIndex : 0,
                //yAxisIndex : [0,1]
                filterMode : 'empty',
            },
            {
                type : 'slider',
                show : false,
                xAxisIndex : 0,
                // yAxisIndex : [0,1]
                filterMode : 'empty',
            },
            {
                type : 'slider',
                yAxisIndex : [0,1],
                width : 12,
                left : '95%',
                filterMode : 'empty'
            },
            {
                type : 'inside',
                xAxisIndex : 1,
                // yAxisIndex : [2,3]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                show : false,
                xAxisIndex : 1,
                // yAxisIndex : [2,3]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                yAxisIndex : [2,3],
                width : 12,
                left : '95%',
                filterMode : 'empty'
            },
            {
                type : 'inside',
                xAxisIndex : 2,
                // yAxisIndex : [4,5]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                show : false,
                xAxisIndex : 2,
                // yAxisIndex : [4,5]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                yAxisIndex : [4,5],
                width : 12,
                left : '95%',
                filterMode : 'empty'
            },
            {
                type : 'inside',
                xAxisIndex : 3,
                // yAxisIndex : [6,7]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                show : false,
                xAxisIndex : 3,
                // yAxisIndex : [6,7]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                yAxisIndex : [6,7],
                width : 12,
                left : '95%',
                filterMode : 'empty'
            },
            {
                type : 'inside',
                xAxisIndex : 4,
                filterMode : 'empty'
                // yAxisIndex : [8,9]
            },
            {
                type : 'slider',
                show : false,
                xAxisIndex : 4,
                filterMode : 'empty'
                // yAxisIndex : [8,9]
            },
            {
                type : 'slider',
                yAxisIndex : [8,9],
                width : 12,
                left : '95%',
                filterMode : 'empty'
            },
            {
                type : 'inside',
                xAxisIndex : 5,
                // yAxisIndex : [10,11]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                show : false,
                xAxisIndex : 5,
                // yAxisIndex : [10,11]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                yAxisIndex : [10,11],
                width : 12,
                left : '95%',
                filterMode : 'empty'
            },
            {
                type : 'inside',
                xAxisIndex : 6,
                // yAxisIndex : [12,13]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                show : false,
                xAxisIndex : 6,
                // yAxisIndex : [12,13]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                yAxisIndex : [12,13],
                width : 12,
                left : '95%',
                filterMode : 'empty'
            },
            {
                type : 'inside',
                xAxisIndex : 7,
                //yAxisIndex : [14,15]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                show : false,
                xAxisIndex : 7,
                //yAxisIndex : [14,15]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                yAxisIndex : [14,15],
                width : 12,
                left : '95%',
                filterMode : 'empty'
            },
            {
                type : 'inside',
                xAxisIndex : 8,
                // yAxisIndex : [16,17]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                show : false,
                xAxisIndex : 8,
                // yAxisIndex : [16,17]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                yAxisIndex : [16,17],
                width : 12,
                left : '95%',
                filterMode : 'empty'
            },
        ],
        xAxis: [
            {
                name : '时间',
                data : timeList,
                id : 0,
                gridIndex : 0,
                nameLocation : 'middle',
                nameGap : 23
            },
            {
                name : '时间',
                data : timeList,
                id : 1,
                gridIndex : 1,
                nameLocation : 'middle',
                nameGap : 23
            },
            {
                name : '时间',
                data : timeList,
                id : 2,
                gridIndex : 2,
                nameLocation : 'middle',
                nameGap : 23
            },
            {
                name : '时间',
                data : timeList,
                id : 3,
                gridIndex : 3,
                nameLocation : 'middle',
                nameGap : 23
            },
            {
                name : '时间',
                data : timeList,
                id : 4,
                gridIndex : 4,
                nameLocation : 'middle',
                nameGap : 23
            },
            {
                name : '时间',
                data : timeList,
                id : 5,
                gridIndex : 5,
                nameLocation : 'middle',
                nameGap : 23
            },
            {
                name : '时间',
                data : timeList,
                id : 6,
                gridIndex : 6,
                nameLocation : 'middle',
                nameGap : 23
            },
            {
                name : '时间',
                data : timeList,
                id : 7,
                gridIndex : 7,
                nameLocation : 'middle',
                nameGap : 23
            },
            {
                name : '时间',
                data : timeList,
                id : 8,
                gridIndex : 8,
                nameLocation : 'middle',
                nameGap : 23
            },
        ],
        yAxis: [
            {
                name : '应变',
                id : 0,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 0
            },{
                name : '温度/℃',
                id : 1,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 0
            },{
                name : '应变',
                id : 2,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 1
            },{
                name : '温度/℃',
                id : 3,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 1
            },{
                name : '应变',
                id : 4,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 2
            },{
                name : '温度/℃',
                id : 5,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 2
            },{
                name : '应变',
                id : 6,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 3
            },{
                name : '温度/℃',
                id : 7,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 3
            },{
                name : '应变',
                id : 8,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 4
            },{
                name : '温度/℃',
                id : 9,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 4
            },{
                name : '应变',
                id : 10,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 5
            },{
                name : '温度/℃',
                id : 11,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 5
            },{
                name : '应变',
                id : 12,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 6
            },{
                name : '温度/℃',
                id : 13,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 6
            },{
                name : '应变',
                id : 14,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 7
            },{
                name : '温度/℃',
                id : 15,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 7
            },{
                name : '应变',
                id : 16,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 8
            },{
                name : '温度/℃',
                id : 17,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 8
            },
        ],
        series : [
            {
                name : '应变',
                type : 'line',
                data : strain,
                yAxisIndex : 0
            },
            {
                name : '温度',
                type : 'line',
                data : temperature,
                yAxisIndex : 1
            },
            {
                name : '应变',
                type : 'line',
                data : sa7,
                xAxisIndex : 1,
                yAxisIndex : 2
            },
            {
                name : '温度',
                type : 'line',
                data : ta7,
                xAxisIndex : 1,
                yAxisIndex : 3
            },
            {
                name : '应变',
                type : 'line',
                data : sd1,
                xAxisIndex : 2,
                yAxisIndex : 4
            },
            {
                name : '温度',
                type : 'line',
                data : td1,
                xAxisIndex : 2,
                yAxisIndex : 5
            },
            {
                name : '应变',
                type : 'line',
                data : sd2,
                xAxisIndex : 3,
                yAxisIndex : 6
            },
            {
                name : '温度',
                type : 'line',
                data : td2,
                xAxisIndex : 3,
                yAxisIndex : 7
            },
            {
                name : '应变',
                type : 'line',
                data : sd3,
                xAxisIndex : 4,
                yAxisIndex : 8
            },
            {
                name : '温度',
                type : 'line',
                data : td3,
                xAxisIndex : 4,
                yAxisIndex : 9
            },
            {
                name : '应变',
                type : 'line',
                data : sd4,
                xAxisIndex : 5,
                yAxisIndex : 10
            },
            {
                name : '温度',
                type : 'line',
                data : td4,
                xAxisIndex : 5,
                yAxisIndex : 11
            },
            {
                name : '应变',
                type : 'line',
                data : sd5,
                xAxisIndex : 6,
                yAxisIndex : 12
            },
            {
                name : '温度',
                type : 'line',
                data : td5,
                xAxisIndex : 6,
                yAxisIndex : 13
            },
            {
                name : '应变',
                type : 'line',
                data : sd6,
                xAxisIndex : 7,
                yAxisIndex : 14
            },
            {
                name : '温度',
                type : 'line',
                data : td6,
                xAxisIndex : 7,
                yAxisIndex : 15
            },
            {
                name : '应变',
                type : 'line',
                data : sd7,
                xAxisIndex : 8,
                yAxisIndex : 16
            },
            {
                name : '温度',
                type : 'line',
                data : td7,
                xAxisIndex : 8,
                yAxisIndex : 17
            },
        ]
    }
    var chart = echarts.init(document.getElementById(figure_id));
    chart.setOption(option);
}

function showAnalysisResultChart_fourlayer(figure_id, timeList, strain, sa4, sd1, sd2, sd3, sd4, temperature, ta4, td1, td2, td3, td4){
    var option = {
        title : [
            {
                left : 'center',
                text : '原始温度/原始应变',
                top : '1%'
            },
            {
                top : '16%',
                left : 'center',
                text : '小波a4层温度/小波a4层应变'
            },
            {
                top: '31%',
                left : 'center',
                text : '小波d1层温度/小波d1层应变'
            },
            {
                top: '46%',
                left : 'center',
                text : '小波d2层温度/小波d2层应变'
            },
            {
                top: '61%',
                left : 'center',
                text : '小波d3层温度/小波d3层应变'
            },
            {
                top: '76%',
                left : 'center',
                text : '小波d4层温度/小波d4层应变'
            }
        ],
        tooltip: {},
        grid : [
            {
                id : 0,
                // top : '1%',
                height : '12%'
            },
            {
                id : 1,
                top : '17%',
                height : '12%'
            },
            {
                id : 2,
                top : '32%',
                height : '12%'
            },
            {
                id : 3,
                top : '47%',
                height : '12%'
            },
            {
                id : 4,
                top : '62%',
                height : '12%'
            },
            {
                id : 5,
                top : '77%',
                height : '12%'
            }
        ],
        legend : [
            {
                data : ['应变','温度'],
                x : 'left',
                top : 'top'
            },
            // {
            //     data : ['应变','温度'],
            //     x : 'left'
            // }
        ],
        dataZoom : [
            {
                type : 'inside',
                xAxisIndex : 0,
                filterMode : 'empty',
                // yAxisIndex : null
            },
            {
                type : 'slider',
                show : false,
                xAxisIndex : 0,
                filterMode : 'empty',
                // yAxisIndex : null
            },
            {
                type : 'slider',
                yAxisIndex : [0,1],
                width : 12,
                left : '95%',
                filterMode : 'empty'
            },
            {
                type : 'inside',
                xAxisIndex : 1,
                //yAxisIndex : [2,3]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                show : false,
                xAxisIndex : 1,
                // yAxisIndex : [2,3]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                yAxisIndex : [2,3],
                width : 12,
                left : '95%',
                filterMode : 'empty'
            },
            {
                type : 'inside',
                xAxisIndex : 2,
                // yAxisIndex : [4,5]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                show : false,
                xAxisIndex : 2,
                // yAxisIndex : [4,5]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                yAxisIndex : [4,5],
                width : 12,
                left : '95%',
                filterMode : 'empty'
            },
            {
                type : 'inside',
                xAxisIndex : 3,
                // yAxisIndex : [6,7]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                show : false,
                xAxisIndex : 3,
                // yAxisIndex : [6,7]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                yAxisIndex : [6,7],
                width : 12,
                left : '95%',
                filterMode : 'empty'
            },
            {
                type : 'inside',
                xAxisIndex : 4,
                // yAxisIndex : [8,9]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                show : false,
                xAxisIndex : 4,
                // yAxisIndex : [8,9]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                yAxisIndex : [8,9],
                width : 12,
                left : '95%',
                filterMode : 'empty'
            },
            {
                type : 'inside',
                xAxisIndex : 5,
                // yAxisIndex : [10,11]
            },
            {
                type : 'slider',
                show : false,
                xAxisIndex : 5,
                // yAxisIndex : [10,11]
            },
            {
                type : 'slider',
                yAxisIndex : [10,11],
                width : 12,
                left : '95%',
                filterMode : 'empty'
            },
        ],
        xAxis: [
            {
                name : '时间',
                data : timeList,
                id : 0,
                gridIndex : 0,
                nameLocation : 'middle',
                nameGap : 23
            },
            {
                name : '时间',
                data : timeList,
                id : 1,
                gridIndex : 1,
                nameLocation : 'middle',
                nameGap : 23
            },
            {
                name : '时间',
                data : timeList,
                id : 2,
                gridIndex : 2,
                nameLocation : 'middle',
                nameGap : 23
            },
            {
                name : '时间',
                data : timeList,
                id : 3,
                gridIndex : 3,
                nameLocation : 'middle',
                nameGap : 23
            },
            {
                name : '时间',
                data : timeList,
                id : 4,
                gridIndex : 4,
                nameLocation : 'middle',
                nameGap : 23
            },
            {
                name : '时间',
                data : timeList,
                id : 5,
                gridIndex : 5,
                nameLocation : 'middle',
                nameGap : 23
            },

        ],
        yAxis: [
            {
                name : '应变',
                id : 0,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 0
            },{
                name : '温度/℃',
                id : 1,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 0
            },{
                name : '应变',
                id : 2,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 1
            },{
                name : '温度/℃',
                id : 3,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 1
            },{
                name : '应变',
                id : 4,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 2
            },{
                name : '温度/℃',
                id : 5,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 2
            },{
                name : '应变',
                id : 6,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 3
            },{
                name : '温度/℃',
                id : 7,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 3
            },{
                name : '应变',
                id : 8,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 4
            },{
                name : '温度/℃',
                id : 9,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 4
            },{
                name : '应变',
                id : 10,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 5
            },{
                name : '温度/℃',
                id : 11,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 5
            },
        ],
        series : [
            {
                name : '应变',
                type : 'line',
                data : strain,
                yAxisIndex : 0
            },
            {
                name : '温度',
                type : 'line',
                data : temperature,
                yAxisIndex : 1
            },
            {
                name : '应变',
                type : 'line',
                data : sa4,
                xAxisIndex : 1,
                yAxisIndex : 2
            },
            {
                name : '温度',
                type : 'line',
                data : ta4,
                xAxisIndex : 1,
                yAxisIndex : 3
            },
            {
                name : '应变',
                type : 'line',
                data : sd1,
                xAxisIndex : 2,
                yAxisIndex : 4
            },
            {
                name : '温度',
                type : 'line',
                data : td1,
                xAxisIndex : 2,
                yAxisIndex : 5
            },
            {
                name : '应变',
                type : 'line',
                data : sd2,
                xAxisIndex : 3,
                yAxisIndex : 6
            },
            {
                name : '温度',
                type : 'line',
                data : td2,
                xAxisIndex : 3,
                yAxisIndex : 7
            },
            {
                name : '应变',
                type : 'line',
                data : sd3,
                xAxisIndex : 4,
                yAxisIndex : 8
            },
            {
                name : '温度',
                type : 'line',
                data : td3,
                xAxisIndex : 4,
                yAxisIndex : 9
            },
            {
                name : '应变',
                type : 'line',
                data : sd4,
                xAxisIndex : 5,
                yAxisIndex : 10
            },
            {
                name : '温度',
                type : 'line',
                data : td4,
                xAxisIndex : 5,
                yAxisIndex : 11
            },

        ]
    }
    var chart = echarts.init(document.getElementById(figure_id));
    chart.setOption(option);
}

function showAnalysisResultChart_threelayer(figure_id, timeList, sa4, sd3, sd4, ta4, td3, td4){
    var d = new Array();
    for(var i =0;i<sd4.length;i++){
        d[i] = new Array();
        d[i][0] = td4[i];
        d[i][1] = sd4[i]
    }
    console.log(d);
    var option1 = {
        title : [
            {
                top: '1%',
                left : 'center',
                text : '日温-应变',
                textStyle: {
                    fontFamily: 'SimSun'
                },
            },
        ],
        color: ['red','blue','green'],
        xAxis: [
            {
                name : '日期',
                data : timeList,
                id : 0,
                gridIndex : 0,
                nameLocation : 'middle',
                nameTextStyle: 'SimSun',
                nameGap : 23,
                axisLabel: {
                  fontFamily: 'Times New Roman'
                },
            },
            {
                name: '温度',
                id: 1,
                gridIndex: 1,
                nameLocation: 'middle',
                nameTextStyle: 'SimSun',
                nameGap: 23,
                axisLabel: {
                    fontFamily: 'Times New Roman',
                },
                max: 40,
                min: -40,

            },
        ],
        yAxis: [
            {
                name : '应变',
                id : 0,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 0,
                nameTextStyle: 'SimSun',
                axisLabel: {
                    fontFamily: 'Times New Roman'
                },
            },{
                name : '温度/℃',
                id : 1,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 0,
                nameTextStyle: 'SimSun',
                axisLabel: {
                    fontFamily: 'Times New Roman'
                },
            },{
                name: '应变',
                id: 2,
                gridIndex: 1,
                nameTextStyle: 'SimSun',
                axisLabel: {
                    fontFamily: 'Times New Roman',
                },
                nameLocation: 'middle'
            }
        ],
        grid : [
            {
                id : 0,
                top : '5%',
                height : '40%'
            },{
                id: 1,
                top: '55%',
                height: '40%'
            }
        ],
        legend : [
            {
                data : ['应变','温度'],
                x : 'left',
                top : 'top'
            },
        ],
        dataZoom : [
            {
                type : 'inside',
                xAxisIndex : 0,
                filterMode : 'empty'
            },
            {
                type : 'slider',
                show : false,
                xAxisIndex : 0,
                filterMode : 'empty'
            },
            {
                type : 'slider',
                yAxisIndex : [0,1],
                width : 12,
                left : '95%',
                filterMode : 'empty',
                show: false
            },
            {
                type : 'inside',
                xAxisIndex : 1,
                filterMode : 'empty'
            }
        ],
        series : [
            {
                name : '应变',
                type : 'line',
                data : sd4,
                xAxisIndex : 0,
                yAxisIndex : 0
            },
            {
                name : '温度',
                type : 'line',
                data : td4,
                xAxisIndex : 0,
                yAxisIndex : 1
            },{
                symbolSize: 10,
                data: d,
                type: 'scatter',
                xAxisIndex: 1,
                yAxisIndex: 2,
            }
        ]
    }
    var option = {
        title : [
            // {
            //     left : 'center',
            //     text : '原始温度/原始应变',
            //     top : '1%'
            // },
            // {
            //     top : '16%',
            //     left : 'center',
            //     text : '小波a4层温度/小波a4层应变'
            // },
            // {
            //     top: '31%',
            //     left : 'center',
            //     text : '小波d1层温度/小波d1层应变'
            // },
            // {
            //     top: '46%',
            //     left : 'center',
            //     text : '小波d2层温度/小波d2层应变'
            // },
            // {
            //     top: '1%',
            //     left : 'center',
            //     text : '小波d3层温度/小波d3层应变(T=12h)'
            // },
            {
                top: '1%',
                left : 'center',
                text : '日温-应变'
            }
        ],
        tooltip: {},
        grid : [
            // {
            //     id : 0,
            //     // top : '1%',
            //     height : '12%'
            // },
            // {
            //     id : 1,
            //     top : '17%',
            //     height : '12%'
            // },
            // {
            //     id : 2,
            //     top : '32%',
            //     height : '12%'
            // },
            // {
            //     id : 3,
            //     top : '47%',
            //     height : '12%'
            // },
            // {
            //     id : 4,
            //     top : '1%',
            //     height : '12%'
            // },
            {
                id : 5,
                top : '1%',
                height : '40%'
            }
        ],
        textStyle: {
            fontFamily: "SimSun",
        },
        legend : [
            {
                data : ['应变','温度'],
                x : 'left',
                top : 'top'
            },
            // {
            //     data : ['应变','温度'],
            //     x : 'left'
            // }
        ],
        dataZoom : [
            // {
            //     type : 'inside',
            //     xAxisIndex : 0,
            //     filterMode : 'empty',
            //     // yAxisIndex : null
            // },
            // {
            //     type : 'slider',
            //     show : false,
            //     xAxisIndex : 0,
            //     filterMode : 'empty',
            //     // yAxisIndex : null
            // },
            // {
            //     type : 'slider',
            //     yAxisIndex : [0,1],
            //     width : 12,
            //     left : '95%',
            //     filterMode : 'empty'
            // },
            {
                type : 'inside',
                xAxisIndex : 1,
                //yAxisIndex : [2,3]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                show : false,
                xAxisIndex : 1,
                // yAxisIndex : [2,3]
                filterMode : 'empty'
            },
            {
                type : 'slider',
                yAxisIndex : [2,3],
                width : 12,
                left : '95%',
                filterMode : 'empty'
            },
            // {
            //     type : 'inside',
            //     xAxisIndex : 2,
            //     // yAxisIndex : [4,5]
            //     filterMode : 'empty'
            // },
            // {
            //     type : 'slider',
            //     show : false,
            //     xAxisIndex : 2,
            //     // yAxisIndex : [4,5]
            //     filterMode : 'empty'
            // },
            // {
            //     type : 'slider',
            //     yAxisIndex : [4,5],
            //     width : 12,
            //     left : '95%',
            //     filterMode : 'empty'
            // },
            // {
            //     type : 'inside',
            //     xAxisIndex : 3,
            //     // yAxisIndex : [6,7]
            //     filterMode : 'empty'
            // },
            // {
            //     type : 'slider',
            //     show : false,
            //     xAxisIndex : 3,
            //     // yAxisIndex : [6,7]
            //     filterMode : 'empty'
            // },
            // {
            //     type : 'slider',
            //     yAxisIndex : [6,7],
            //     width : 12,
            //     left : '95%',
            //     filterMode : 'empty'
            // },
            // {
            //     type : 'inside',
            //     xAxisIndex : 4,
            //     // yAxisIndex : [8,9]
            //     filterMode : 'empty'
            // },
            // {
            //     type : 'slider',
            //     show : false,
            //     xAxisIndex : 4,
            //     // yAxisIndex : [8,9]
            //     filterMode : 'empty'
            // },
            // {
            //     type : 'slider',
            //     yAxisIndex : [8,9],
            //     width : 12,
            //     left : '95%',
            //     filterMode : 'empty'
            // },
            // {
            //     type : 'inside',
            //     xAxisIndex : 5,
            //     // yAxisIndex : [10,11]
            // },
            // {
            //     type : 'slider',
            //     show : false,
            //     xAxisIndex : 5,
            //     // yAxisIndex : [10,11]
            // },
            // {
            //     type : 'slider',
            //     yAxisIndex : [10,11],
            //     width : 12,
            //     left : '95%',
            //     filterMode : 'empty'
            // },
        ],
        xAxis: [
            // {
            //     name : '时间',
            //     data : timeList,
            //     id : 0,
            //     gridIndex : 0,
            //     nameLocation : 'middle',
            //     nameGap : 23
            // },
            {
                name : '时间',
                data : timeList,
                id : 1,
                gridIndex : 1,
                nameLocation : 'middle',
                nameGap : 23
            },
            // {
            //     name : '时间',
            //     data : timeList,
            //     id : 2,
            //     gridIndex : 2,
            //     nameLocation : 'middle',
            //     nameGap : 23
            // },
            // {
            //     name : '时间',
            //     data : timeList,
            //     id : 3,
            //     gridIndex : 3,
            //     nameLocation : 'middle',
            //     nameGap : 23
            // },
            // {
            //     name : '时间',
            //     data : timeList,
            //     id : 4,
            //     gridIndex : 4,
            //     nameLocation : 'middle',
            //     nameGap : 23
            // },
            // {
            //     name : '时间',
            //     data : timeList,
            //     id : 5,
            //     gridIndex : 5,
            //     nameLocation : 'middle',
            //     nameGap : 23
            // },

        ],
        yAxis: [
            // {
            //     name : '应变',
            //     id : 0,
            //     min : 'dataMin',
            //     max : 'dataMax',
            //     gridIndex : 0
            // },{
            //     name : '温度/℃',
            //     id : 1,
            //     min : 'dataMin',
            //     max : 'dataMax',
            //     gridIndex : 0
            // },
            {
                name : '应变',
                id : 2,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 1
            },{
                name : '温度/℃',
                id : 3,
                min : 'dataMin',
                max : 'dataMax',
                gridIndex : 1
            },
            // {
            //     name : '应变',
            //     id : 4,
            //     min : 'dataMin',
            //     max : 'dataMax',
            //     gridIndex : 2
            // },{
            //     name : '温度/℃',
            //     id : 5,
            //     min : 'dataMin',
            //     max : 'dataMax',
            //     gridIndex : 2
            // },{
            //     name : '应变',
            //     id : 6,
            //     min : 'dataMin',
            //     max : 'dataMax',
            //     gridIndex : 3
            // },{
            //     name : '温度/℃',
            //     id : 7,
            //     min : 'dataMin',
            //     max : 'dataMax',
            //     gridIndex : 3
            // },{
            //     name : '应变',
            //     id : 8,
            //     min : 'dataMin',
            //     max : 'dataMax',
            //     gridIndex : 4
            // },{
            //     name : '温度/℃',
            //     id : 9,
            //     min : 'dataMin',
            //     max : 'dataMax',
            //     gridIndex : 4
            // },{
            //     name : '应变',
            //     id : 10,
            //     min : 'dataMin',
            //     max : 'dataMax',
            //     gridIndex : 5
            // },{
            //     name : '温度/℃',
            //     id : 11,
            //     min : 'dataMin',
            //     max : 'dataMax',
            //     gridIndex : 5
            // },
        ],
        series : [
            {
                name : '应变',
                type : 'line',
                data : sd3,
                yAxisIndex : 0
            },
            {
                name : '温度',
                type : 'line',
                data : td3,
                yAxisIndex : 1
            },
            {
                name : '应变',
                type : 'line',
                data : sd4,
                xAxisIndex : 1,
                yAxisIndex : 2
            },
            {
                name : '温度',
                type : 'line',
                data : td4,
                xAxisIndex : 1,
                yAxisIndex : 3
            },
            // {
            //     name : '应变',
            //     type : 'line',
            //     data : sd1,
            //     xAxisIndex : 2,
            //     yAxisIndex : 4
            // },
            // {
            //     name : '温度',
            //     type : 'line',
            //     data : td1,
            //     xAxisIndex : 2,
            //     yAxisIndex : 5
            // },
            // {
            //     name : '应变',
            //     type : 'line',
            //     data : sd2,
            //     xAxisIndex : 3,
            //     yAxisIndex : 6
            // },
            // {
            //     name : '温度',
            //     type : 'line',
            //     data : td2,
            //     xAxisIndex : 3,
            //     yAxisIndex : 7
            // },
            // {
            //     name : '应变',
            //     type : 'line',
            //     data : sd3,
            //     xAxisIndex : 4,
            //     yAxisIndex : 8
            // },
            // {
            //     name : '温度',
            //     type : 'line',
            //     data : td3,
            //     xAxisIndex : 4,
            //     yAxisIndex : 9
            // },
            // {
            //     name : '应变',
            //     type : 'line',
            //     data : sd4,
            //     xAxisIndex : 5,
            //     yAxisIndex : 10
            // },
            // {
            //     name : '温度',
            //     type : 'line',
            //     data : td4,
            //     xAxisIndex : 5,
            //     yAxisIndex : 11
            // },

        ]
    }
    var chart = echarts.init(document.getElementById(figure_id));
    chart.setOption(option1);
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

function showReliabilityResultChart(figure_id, timeList, btcList, bttList, pfcList, pftList){

    console.log(btcList)
    console.log(bttList)
    //notice the Math.max.apply() is a recursion function, and if there are a lot data,the stack will exceeded
    // var bmax = Math.max(Math.max.apply(Math,btcList),Math.max.apply(Math,bttList))
    // var bmin = Math.min(Math.min.apply(Math,btcList),Math.min.apply(Math,bttList))
    // var pmax = Math.max(Math.max.apply(Math,pfcList),Math.max.apply(Math,pftList))
    // var pmin = Math.min(Math.min.apply(Math,pfcList),Math.min.apply(Math,pftList))
    var bmax = -Infinity
    var bmin = Infinity
    var pmax = -Infinity
    var pmin = Infinity
    for (var i = 0; i<btcList.length;i++){
        if (btcList[i] > bmax) bmax = btcList[i]
        if (btcList[i] < bmin) bmin = btcList[i]
        if (bttList[i] > bmax) bmax = bttList[i]
        if (bttList[i] < bmin) bmin = bttList[i]
        if (pfcList[i] > pmax) pmax = pfcList[i]
        if (pfcList[i] < pmin) pmin = pfcList[i]
        if (pftList[i] > pmax) pmax = pftList[i]
        if (pftList[i] < pmin) pmin = pftList[i]
    }

    var option = {
        title : [
            {
                left : 'center',
                top : '1%',
                text : '传感器位置对应的时变可靠指标监测值和预测值',

            },
            {
                left : 'center',
                top : '51%',
                text : '传感器位置对应的时变失效概率监测值和预测值'
            },
            // {
            //     left : '22%',
            //     top : '51%',
            //     text : '抗压失效概率'
            // },
            // {
            //     left : '72%',
            //     top : '51%',
            //     text : '抗拉失效概率'
            // }
        ],
        tooltip: {},
        legend: [
            {
                left: '10%',
                data: [
                    {
                        name: '监测可靠度',
                    }
                ]
            },
            {
                left: '20%',
                data: [
                    {
                        name: '时变可靠度指标',
                    }
                ]
            },
            {
                left: '10%',
                top: '52%',
                data: [
                    {
                        name: '监测失效概率',
                    }
                ]
            },
            {
                left: '20%',
                top: '52%',
                data: [
                    {
                        name: '时变失效概率',
                    }
                ]
            }
        ],
        grid : [
            {
                id : 0,
                height : '40%',
                // width : '40%',
                left : '4%'
            },
            {
                id : 1,
                height : '40%',
                // width : '40%',
                // left : '53%'
                top : '56%',
                left : '4%'
            },
            // {
            //     id : 2,
            //     height : '40%',
            //     width : '40%',
            //     top : '54%',
            //     left : '4%'
            // },
            // {
            //     id : 3,
            //     height : '40%',
            //     width : '40%',
            //     top : '54%',
            //     left : '53%'
            // }
        ],
        dataZoom : [
            {
                type : 'inside',
                xAxisIndex : 0,
                //yAxisIndex : 0
                filterMode : 'empty',
            },
            // {
            //     type : 'slider',
            //     show : false,
            //     xAxisIndex : 0,
            //   //  yAxisIndex : 0
            //     filterMode : 'empty',
            // },
            // {
            //     type : 'slider',
            //     show : true,
            //     //xAxisIndex : 0,
            //     yAxisIndex : 0,
            //     left : '47%',
            //     width : 10,
            //     filterMode : 'empty',
            // },
            {
                type : 'inside',
                xAxisIndex : 1,
               // yAxisIndex : 1,
                filterMode : 'empty',
            },
            // {
            //     type : 'slider',
            //     show : false,
            //     xAxisIndex : 1,
            //    // yAxisIndex : 1,
            //     filterMode : 'empty',
            // },
            // {
            //     type : 'slider',
            //     show : true,
            //     //xAxisIndex : 0,
            //     yAxisIndex : 1,
            //     left : '96%',
            //     width : 10,
            //     filterMode : 'empty',
            // },
            // {
            //     type : 'inside',
            //     xAxisIndex : 2,
            //     //yAxisIndex : 2
            //     filterMode : 'empty',
            // },
            // {
            //     type : 'slider',
            //     show : false,
            //     xAxisIndex : 2,
            //    // yAxisIndex : 2
            //     filterMode : 'empty',
            // },
            // {
            //     type : 'slider',
            //     show : true,
            //     //xAxisIndex : 0,
            //     yAxisIndex : 2,
            //     left : '47%',
            //     width : 10,
            //     filterMode : 'empty',
            // },
            // {
            //     type : 'inside',
            //     xAxisIndex : 3,
            //     filterMode : 'empty',
            // },
            // {
            //     type : 'slider',
            //     show : false,
            //     xAxisIndex : 3,
            //     filterMode : 'empty',
            //   //  yAxisIndex : 3
            // },
            // {
            //     type : 'slider',
            //     show : true,
            //     //xAxisIndex : 0,
            //     yAxisIndex : 3,
            //     left : '96%',
            //     width : 10,
            //     filterMode : 'empty',
            // },
        ],
        toolbox : {
            show : true,
            right : '5%',
            feature : {
                // dataView : {
                //     readOnly : true,
                //     optionToContent: function (opt) {
                //         var series = opt.series[0].data;
                //         var index = opt.xAxis[0].data;
                //         var tdHeads = '<td  style="padding: 0 10px">时间段</td>'
                //             +'<td  style="padding: 0 10px">抗压可靠度</td>'
                //             +'<td  style="padding: 0 10px">抗拉可靠度</td>'
                //             +'<td  style="padding: 0 10px">抗压失效概率</td>'
                //             +'<td  style="padding: 0 10px">抗拉失效概率</td>'; //表头
                //         var table = '<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>'+tdHeads+'</tr>';
                //         var tdBody = '';
                //         for(var i = 0; i < timeList.length;i++)
                //         {
                //             table += '<tr><td style="padding: 0 10px">'+timeList[i]+
                //                 '</td><td style="padding: 0 10px">'+btcList[i]+
                //                 '</td><td style="padding: 0 10px">'+bttList[i]+
                //                 '</td><td style="padding: 0 10px">'+pfcList[i]+
                //                 '</td><td style="padding: 0 10px">'+pftList[i]+'</td></tr>';
                //         }
                //         table += '</tbody></table>';
                //         return table;
                //
                //     }
                // },
                saveAsImage: {
                    pixelRatio:2,
                    show: true
                },
            }
        },
        xAxis: [
            {
                name : '时间段',
                data : timeList.map((str) => {
                    return str.substring(0,4) + "-" + str.substring(4,6) + "-" + str.substring(6,8) + " " + str.substring(8,10) + ":" + str.substring(10,12) + ":" + str.substring(12)
                }),
                id : 0,
                gridIndex : 0
            },
            {
                name : '时间段',
                data : timeList.map((str) => {
                    return str.substring(0,4) + "-" + str.substring(4,6) + "-" + str.substring(6,8) + " " + str.substring(8,10) + ":" + str.substring(10,12) + ":" + str.substring(12)
                }),
                id : 1,
                gridIndex : 1
            },
            // {
            //     name : '时间段',
            //     data : timeList,
            //     id : 2,
            //     gridIndex : 2
            // },
            // {
            //     name : '时间段',
            //     data : timeList,
            //     id : 3,
            //     gridIndex : 3
            // }
        ],
        yAxis:[
            {
                name : '监测可靠度',
                id : 0,
                gridIndex : 0,
                min : bmin - (bmax - bmin),
                max : bmax + (bmax - bmin),
               // min : 0,
               // max : 1
                axisLabel: {
                    formatter: function (value) {
                        var res = value.toString();
                        return res.substring(0,4)
                    }
                }
            },
            {
                name : "时变可靠度指标",
                id : 1,
                gridIndex : 0,
                min : bmin - (bmax - bmin),
                max : bmax + (bmax - bmin),
               // min : 0,
               // max : 1
                axisLabel: {
                    formatter: function (value) {
                        var res = value.toString();
                        return res.substring(0,4)
                    }
                }
            },
            {
                name : '监测失效概率',
                id : 2,
                gridIndex : 1,
                min : 0,
                max : pmax * 1.1,
                //min : 0,
                //max : 1
                axisLabel: {
                    formatter: function (value) {
                        var res = value.toString();
                        var num = ""
                        for(var i = 0;i<res.length;i++){
                            if(res[i] == 'e'){
                                return num + res.substring(i)
                            }else if(num.length < 5){
                                num += res[i]
                            }
                        }
                    }
                }
            },
            {
                name : '时变失效概率',
                id : 3,
                gridIndex : 1,
                min : 0,
                max : pmax * 1.1,
              //  min : 0,
              //  max : 1
                axisLabel: {
                    formatter: function (value) {
                        var res = value.toString();
                        var num = ""
                        for(var i = 0;i<res.length;i++){
                            if(res[i] == 'e'){
                                return num + res.substring(i)
                            }else if(num.length < 5){
                                num += res[i]
                            }
                        }
                    }
                }
            }
        ],
        series : [
            {
                name : '监测可靠度',
                type : 'line',
                data : btcList,
                xAxisIndex : 0,
                yAxisIndex : 0
            },
            {
                name : '时变可靠度指标',
                type : 'line',
                data : bttList,
                xAxisIndex : 0,
                yAxisIndex : 1
            },
            {
                name : '监测失效概率',
                type : 'line',
                data : pfcList,
                xAxisIndex : 1,
                yAxisIndex : 2
            },
            {
                name : '时变失效概率',
                type : 'line',
                data : pftList,
                xAxisIndex : 1,
                yAxisIndex : 3
            }
        ]
    }
    console.log(figure_id)
    var chart = echarts.init(document.getElementById(figure_id));
    chart.setOption(option);
}
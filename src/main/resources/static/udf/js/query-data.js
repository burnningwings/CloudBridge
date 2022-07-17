// var sensor_index = {
//     "CLBC" : "测量波长",
//     "YB" : "应变",
//     "CLSJ" : "测量时间"
// };
//重新读取并刷新数据
function refreshData() {
    var $watch_point_grid = $("#query_data_grid");
    $watch_point_grid.data("kendoGrid").dataSource.read();
    $watch_point_grid.data("kendoGrid").refresh();
}
var sensor_map = {
    "加速度传感器": [
        {
           // template:'<input type="checkbox" class="checkbox" name=sensordata-"#: sensor_id #" value="#: sensor_id #" />',
            template:'<input type="checkbox" class="checkbox" name="sensordata" value="#: CLSJ #" />',
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        },
        {
            title: "传感器编号",
            field: "sensor_number",
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
            template: "<button class='btn btn-success' type='button' id='modify-#: sensor_id #' onclick='modifyJSDSensorData(\"#: sensor_id #\",\"#: CLSJ #\",\"#: JSD #\",\"#: DY #\")'/>修改</button>",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }
    ],
    "索力传感器":[
        {
            //template:'<input type="checkbox" class="checkbox" name=sensordata-"#: sensor_id #" value="#: sensor_id #" />',
            template:'<input type="checkbox" class="checkbox" name="sensordata" value="#: CLSJ #" />',
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        },
        {
            title: "sensor_number",
            field: "传感器编号",
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
            template: '#=kendo.toString(CLSJ)#.0',
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            title: "修改",
            template: "<button class='btn btn-success' type='button' id='modify-#: sensor_id #' onclick='modifySLSensorData(\"#: sensor_id #\",\"#: CLSJ #\",\"#: DY #\",\"#: JSD #\",\"#: SL #\")'/>修改</button>",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }
    ],
    "光纤应变传感器":[
        {
            // template:'<input type="checkbox" class="checkbox" name=sensordata-"#: sensor_info #" value="#: sensor_info #" />',
            // headerAttributes:{ style:"text-align:center"},
            // attributes:{ class:"text-center" }
            //template:'<input type="checkbox" class="checkbox" name=sensordata-"#: sensor_id #" value="#: sensor_id #" />',
            template:'<input type="checkbox" class="checkbox" name="sensordata" value="#: CLSJ #" />',
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        },
        {
            title: "传感器编号",
            field: "sensor_number",
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
            template: "<button class='btn btn-success' type='button' id='modify-#: sensor_id #' onclick='modifyGXYBSensorData(\"#: sensor_id #\",\"#: CLSJ #\", \"#: CLBC #\", \"#: YB #\", )'/>修改</button>",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }
    ],
    "GPS传感器":[
        {
            // template:'<input type="checkbox" class="checkbox" name=sensordata-"#: sensor_info #" value="#: sensor_info #" />',
            // headerAttributes:{ style:"text-align:center"},
            // attributes:{ class:"text-center" }
            //template:'<input type="checkbox" class="checkbox" name=sensordata-"#: sensor_id #" value="#: sensor_id #" />',
            template:'<input type="checkbox" class="checkbox" name="sensordata" value="#: CLSJ #" />',
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        },
        {
            title: "传感器编号",
            field: "sensor_number",
            template: '<a href="javascript: void(0);" onclick="sensorFigure(\'#: sensor_id #\',\'#: sensor_number #\')"/>#: sensor_number #</button>',
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "WXZBX",
            title: "卫星坐标X",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "QLZBX",
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
            field: "QLZBY",
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
            field: "QLZBZ",
            title: "局部坐标Z",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "WXWYZ",
            title: "卫星位移Z",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "QLWZ",
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
            template: "<button class='btn btn-success' type='button' id='modify-#: sensor_id #' onclick='modifyGPSSensorData(\"#: sensor_id #\",\"#: CLSJ #\",\"#: WXZBX #\", \"#: QLZBX #\", \"#: WXWYX #\", \"#: QLWYX #\", \"#: WXZBY #\", \"#: QLZBY #\", \"#: WXWYY #\", \"#: QLWYY #\", \"#: WXZBZ #\", \"#: QLZBZ #\", \"#: WXWYZ #\", \"#: QLWZ #\")'/>修改</button>",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }
    ],
   "振弦传感器":[
        {
            // template:'<input type="checkbox" class="checkbox" name=sensordata-"#: sensor_info #" value="#: sensor_info #" />',
            // headerAttributes:{ style:"text-align:center"},
            // attributes:{ class:"text-center" }
            //template:'<input type="checkbox" class="checkbox" name=sensordata-"#: sensor_id #" value="#: sensor_id #" />',
            template:'<input type="checkbox" class="checkbox" name="sensordata" value="#: CLSJ #" />',
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        },
        {
            field: "sensor_number",
            title: "传感器编号",
            template: '<a href="javascript: void(0);" onclick="sensorFigure(\'#: sensor_id #\',\'#: sensor_number #\')"/>#: sensor_number #</button>',
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "CLYB",
            title: "测量应变",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }, {
            field: "XZYB",
            title: "修正应变",
            type: "number",
            format: "{0:0.0}",
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
            template: '#=kendo.toString(CLSJ)#.0',
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }/*, {
            title: "修改",
            template: "<button class='btn btn-success' type='button' id='modify-#: sensor_id #' onclick='modifyZXSensorData(\"#: sensor_id #\",\"#: CLSJ #\", \"#: CLYB #\", \"#: XZYB #\", \"#: DZ #\", \"#: CLWD #\" )'/>修改</button>",
            headerAttributes:{ style:"text-align:center"},
            attributes:{ class:"text-center" }
        }*/
    ]
}

function modifyJSDSensorData(sensor_id, clsj, jsd, dy) {
    showJSDSensorDataDialog("修改传感器数据", "update", sensor_id,clsj,jsd,dy);
}

function modifyGXYBSensorData(sensor_id, clsj, clbc, yb) {
    showGXYBSensorDataDialog("修改传感器数据", "update", sensor_id, clsj, clbc, yb);
}

function modifySLSensorData(sensor_id, clsj, dy, jsd, sl){
    showSLSensorDataDialog("修改传感器数据", "update", sensor_id, clsj, dy, jsd, sl);
}

function modifyGPSSensorData(sensor_id, clsj, wxzbx, qlzbx, wxwyx, qlwyx, wxzby, qlzby, wxwyy, qlwyy, wxzbz, qlzbz, wxwyz, qlwz){
    showGPSSensorDataDialog("修改传感器数据", "update", sensor_id, clsj, wxzbx, qlzbx, wxwyx, qlwyx, wxzby, qlzby, wxwyy, qlwyy, wxzbz, qlzbz, wxwyz, qlwz);
}

function modifyZXSensorData(sensor_id, clsj, clyb, xzyb, dz,clwd) {
    showZXSensorDataDialog("修改传感器数据", "update", sensor_id, clsj, clyb, xzyb, dz, clwd);
}

function showJSDSensorDataDialog(title, operation_tpe, sensor_id,clsj,jsd,dy) {
        var content = '\
             <div class="form-inline-custom"> \
                <label class="col-sm-3 control-label">测量时间:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="CLSJ" placeholder="请输入测量时间" value="' + clsj + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">加速度:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="JSD" placeholder="请输入加速度" value="' + jsd + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">电压:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="DY" placeholder="请输入电压" value="' + dy + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        ';
    showModifyModalDialog(title, content, ok_callback, 605, 330);
    
    function ok_callback() {
        var CLSJ = $("#CLSJ").val();
        var JSD = $("#JSD").val();
        var DY = $("#DY").val();
        var sensorid = sensor_id;

        if(!CLSJ || !JSD || !DY){
            showTransientDialog("必填项不能为空！");
            return false;
        }else{
            var url = '/query-data/updateJSDsensor'
            var params = {
                'sensor_id' : sensorid,
                'CLSJ' : CLSJ,
                'JSD' : JSD,
                'DY' : DY
            }
            var response = webRequest(url, 'POST', false, params);
            if (response.status == 0) {
                refreshData();
                showTransientDialog("操作成功！");
                return true;
            } else {
                showTransientDialog(response.msg);
                return false;
            }
        }
    }

}

function showGXYBSensorDataDialog(title, operation_type, sensor_id, clsj, clbc, yb){
    var content = '\
             <div class="form-inline-custom"> \
                <label class="col-sm-3 control-label">测量时间:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="CLSJ" placeholder="请输入测量时间" value="' + clsj + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">测量波长:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="CLBC" placeholder="请输入测量波长" value="' + clbc + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">应变:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="YB" placeholder="请输入应变" value="' + yb + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        ';
    showModifyModalDialog(title, content, ok_callback, 605, 330);

    function ok_callback() {
        var CLSJ = $("#CLSJ").val();
        var CLBC = $("#CLBC").val();
        var YB = $("#YB").val();
        var sensorid = sensor_id;

        if(!CLSJ || !CLBC || !YB){
            showTransientDialog("必填项不能为空！");
            return false;
        }else{
            var url = '/query-data/updateGXYBsensor'
            var params = {
                'sensor_id' : sensorid,
                'CLSJ' : CLSJ,
                'CLBC' : CLBC,
                'YB' : YB
            }
            var response = webRequest(url, 'POST', false, params);
            if (response.status == 0) {
                refreshData();
                showTransientDialog("操作成功！");
                return true;
            } else {
                showTransientDialog(response.msg);
                return false;
            }
        }
    }

}

function showSLSensorDataDialog(title, operation_type, sensor_id, clsj, dy, jsd, sl){
    var content = '\
             <div class="form-inline-custom"> \
                <label class="col-sm-3 control-label">测量时间:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="CLSJ" placeholder="请输入测量时间" value="' + clsj + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">电压:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="DY" placeholder="请输入电压" value="' + dy + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">加速度:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="JSD" placeholder="请输入加速度" value="' + jsd + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">索力:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="SL" placeholder="请输入索力" value="' + sl + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        ';
    showModifyModalDialog(title, content, ok_callback, 605, 330);

    function ok_callback() {
        var CLSJ = $("#CLSJ").val();
        var DY = $("#DY").val();
        var JSD = $("#JSD").val();
        var SL = $("#SL").val();
        var sensorid = sensor_id;

        if(!CLSJ || !DY || !JSD || !SL){
            showTransientDialog("必填项不能为空！");
            return false;
        }else{
            var url = '/query-data/updateSLsensor'
            var params = {
                'sensor_id' : sensorid,
                'CLSJ' : CLSJ,
                'DY' : DY,
                'JSD' : JSD,
                'SL' : SL
            }
            var response = webRequest(url, 'POST', false, params);
            if (response.status == 0) {
                refreshData();
                showTransientDialog("操作成功！");
                return true;
            } else {
                showTransientDialog(response.msg);
                return false;
            }
        }
    }
}

function showGPSSensorDataDialog(title, operation_type, sensor_id, clsj, wxzbx, qlzbx, wxwyx, qlwyx, wxzby, qlzby, wxwyy, qlwyy, wxzbz, qlzbz, wxwyz, qlwz)
{
    var content = '\
             <div class="form-inline-custom"> \
                <label class="col-sm-3 control-label">测量时间:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="CLSJ" placeholder="请输入测量时间" value="' + clsj + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">卫星坐标X:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="WXZBX" placeholder="请输入卫星坐标X" value="' + wxzbx + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">局部坐标X:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="QLZBX" placeholder="请输入局部坐标X" value="' + qlzbx + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">卫星位移X:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="WXWYX" placeholder="请输入卫星位移X" value="' + wxwyx + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">局部位移X:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="QLWYX" placeholder="请输入局部位移X" value="' + qlwyx + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">卫星坐标Y:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="WXZBY" placeholder="请输入卫星坐标Y" value="' + wxzby + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">局部坐标Y:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="QLZBY" placeholder="请输入局部坐标Y" value="' + qlzby + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">卫星位移Y:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="WXWYY" placeholder="请输入卫星位移Y" value="' + wxwyy + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">局部位移Y:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="QLWYY" placeholder="请输入局部位移Y" value="' + qlwyy + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">卫星坐标Z:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="WXZBZ" placeholder="请输入卫星坐标Z" value="' + wxzbz + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">局部坐标Z:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="QLZBZ" placeholder="请输入局部坐标Z" value="' + qlzbz + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">卫星位移Z:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="WXWYZ" placeholder="请输入卫星位移Z" value="' + wxwyz + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">局部位移Z:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="QLWZ" placeholder="请输入局部位移Z" value="' + qlwz + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        ';
    showModifyModalDialog(title, content, ok_callback, 605, 330);

    function ok_callback() {
        var CLSJ = $("#CLSJ").val();
        var WXZBX = $("#WXZBX").val();
        var QLZBX = $("#QLZBX").val();
        var WXWYX = $("#WXWYX").val();
        var QLWYX = $("#QLWYX").val();
        var WXZBY = $("#WXZBY").val();
        var QLZBY = $("#QLZBY").val();
        var WXWYY = $("#WXWYY").val();
        var QLWYY = $("#QLWYY").val();
        var WXZBZ = $("#WXZBZ").val();
        var QLZBZ = $("#QLZBZ").val();
        var WXWYZ = $("#WXWYZ").val();
        var QLWZ = $("#QLWZ").val();
        var sensorid = sensor_id;

        if(!CLSJ || !WXZBX || !QLZBX || !WXWYX || !QLWYX || !WXZBY || !QLZBY || !WXWYY || !QLWYY || !WXZBZ || !QLZBZ || !WXWYZ || !QLWZ){
            showTransientDialog("必填项不能为空！");
            return false;
        }else{
            var url = '/query-data/updateGPSsensor'
            var params = {
                'sensor_id' : sensorid,
                'CLSJ' : CLSJ,
                'WXZBX' : WXZBX,
                'QLZBX' : QLZBX,
                'WXWYX' : WXWYX,
                'QLWYX' : QLWYX,
                'WXZBY' : WXZBY,
                'QLZBY' : QLZBY,
                'WXWYY' : WXWYY,
                'QLWYY' : QLWYY,
                'WXZBZ' : WXZBZ,
                'QLZBZ' : QLZBZ,
                'WXWYZ' : WXWYZ,
                'QLWZ' : QLWZ,
            }
            var response = webRequest(url, 'POST', false, params);
            if (response.status == 0) {
                refreshData();
                showTransientDialog("操作成功！");
                return true;
            } else {
                showTransientDialog(response.msg);
                return false;
            }
        }
    }
}

function showZXSensorDataDialog(title, operation_type, sensor_id, clsj, clyb, xzyb, dz, clwd){
    var content = '\
             <div class="form-inline-custom"> \
                <label class="col-sm-3 control-label">测量时间:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="CLSJ" placeholder="请输入测量时间" value="' + clsj + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">测量值:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="CLYB" placeholder="请输入测量值" value="' + clyb + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">修正后的值:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="XZYB" placeholder="请输入修正后的值" value="' + xzyb + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">电阻:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="DZ" placeholder="请输入电阻" value="' + dz + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">测量温度:</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="CLWD" placeholder="请输入测量温度" value="' + clwd + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        ';
    showModifyModalDialog(title, content, ok_callback, 605, 330);

    function ok_callback() {
        var CLSJ = $("#CLSJ").val();
        var CLYB = $("#CLYB").val();
        var XZYB = $("#XZYB").val();
        var DZ = $("#DZ").val();
        var CLWD = $("#CLWD").val();
        var sensorid = sensor_id;

        if(!CLSJ || !CLYB || !XZYB || !DZ || !CLWD){
            showTransientDialog("必填项不能为空！");
            return false;
        }else{
            var url = '/query-data/updateZXsensor'
            var params = {
                'sensor_id' : sensorid,
                'CLSJ' : CLSJ,
                'CLYB' : CLYB,
                'XZYB' : XZYB,
                'DZ' : DZ,
                'CLWD' : CLWD
            }
            var response = webRequest(url, 'POST', false, params);
            if (response.status == 0) {
                refreshData();
                showTransientDialog("操作成功！");
                return true;
            } else {
                showTransientDialog(response.msg);
                return false;
            }
        }
    }
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
            console.log(data)
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
        console.log(xAxis_data);
        console.log(series_data);
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
    console.log("updateGrid")
    console.log(bridge_id,box_id,sensor_info)
    if(sensor_info==null || sensor_info=="") return;
    var sensor_info_list = sensor_info.split("--");
    console.log(sensor_info);
    // var table_columns = sensor_map[sensor_info_list[2]];
    var table_columns = sensor_map[sensor_info_list[1]];
    console.log("啊哈哈哈", table_columns);
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                type: "get",
                url: "/query-data/list",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (options, operation) {
                console.log("operaton:", operation)
                console.log("options:", options)
                if (operation == "read") {
                    var next = true;
                    if(options.skip==0){
                        next_row_key = "";
                        current_row_key = "";
                        skip = 0;
                    }
                    console.log("看看skip:",skip);
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
                    console.log("next:"+next+" skip:"+skip+" rowKey:"+row_key)
                    console.log("page:"+options.page+" pageSize:"+options.pageSize)
                    console.log("sensorInfo:"+$("#sensor_menu").val())
                    var parameter = {
                        next: next,
                        skip: skip,
                        rowKey: row_key,
                        page: options.page,
                        pageSize: options.pageSize,
                        sensorInfo: $("#sensor_menu").val()
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
        // toolbar : ["excel"],
        excel : {
            fileName : "data.xlsx"
        },
        dataSource: dataSource,
        pageable: {
            // pageSizes: true,
            refresh : true,
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
            },
        },
        // refresh: true,
        // resizeable: true,
        columns: table_columns

    });
    $("a.k-pager-last").addClass("k-state-disabled");

    // $("#query_data_grid").data('kendoGrid').dataSource.read();
    // $("#query_data_grid").data('kendoGrid').refresh();
}

// function modifySensorData(watch_box_id,bridge_id,watch_box_type_id){
//     // showWatchBoxDialog("修改测控箱信息","update",watch_box_id,bridge_id,watch_box_type_id)
// }function modifySensorData(watch_box_id,bridge_id,watch_box_type_id){
// //     // showWatchBoxDialog("修改测控箱信息","update",watch_box_id,bridge_id,watch_box_type_id)
// // }

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

function showModifyModalDialog(title,custom_content,ok_callback){
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

function updateDropdownMenu1(response){
    if(response!=null && response.status==0)
        data = response.data;
    return data;
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
function bridgeListDropdown() {
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
        sectionListDropdown($(this).val()); //更新截面列表
        watchPointListDropdown($('#section_menu').val());
        watchBoxListDropdown($(this).val());
        sensorListDropdown($(this).val(),$('#section_menu').val(),$('#point_menu').val());
    });
}

//截面列表下拉框
function sectionListDropdown(bridgeId, init_value) {
    var options = "<option value='0'>全部截面</option>";
    if (bridgeId != 0) {  //为全部桥梁时不需要获取截面列表
        var url = "/section/simple-list";
        var response = webRequest(url, "GET", false, {'bridgeId': bridgeId});
        if (response != null && response['data']) {
            var data = response["data"]
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
        if (!selectIsExitItem($('#watch_box_menu'),"-1")){
            var em = "<option value='-1'>未选中</option>";
            $('#watch_box_menu').append(em)
            $('#watch_box_menu').val("-1")
        }
        watchPointListDropdown($(this).val());
        sensorListDropdown($('#bridge_menu').val(),$('#section_menu').val(),$('#point_menu').val(),0);
    });

}

//监测点下拉列表
function watchPointListDropdown(sectionId, init_value) {
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
        if (!selectIsExitItem($('#watch_box_menu'),"-1")){
            var em = "<option value='-1'>未选中</option>";
            $('#watch_box_menu').append(em)
            $('#watch_box_menu').val("-1")
        }
        $('.selectpicker').selectpicker('refresh')
        sensorListDropdown($('#bridge_menu').val(),$('#section_menu').val(),$('#point_menu').val(),0);
    });
}

//控制箱下拉列表
function watchBoxListDropdown(bridgeId, init_value) {
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
    var $dropdownMenu4 = $("#watch_box_menu");
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
                    $dropdownMenu4["0"].remove(i)
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
        $('.selectpicker').selectpicker('refresh')
        sensorListDropdown($('#bridge_menu').val(),0,0,$('#watch_box_menu').val());
    });
}

//传感器下拉列表
function sensorListDropdown(bridge_id, section_id, watch_point_id, watch_box_id, init_value) {
    // if (bridgeId != 0) {  //为全部桥梁时不需要获取传感列表
    //     var url = "/sensor/list";
    //     var response = webRequest(url, "GET", false, {
    //         page: 0,
    //         pageSize: 18446744073709551615,
    //         bridgeId: bridge_id | 0,
    //         sectionId: section_id | 0,
    //         watchPointId: watch_point_id | 0,
    //         watchBoxId: watch_box_id | 0
    //     });
    //     if (response != null && response['data']) {
    //         var data = response["data"];
    //         for (var i = 0; i < data.length; i++) {
    //             options += "<option value='" + data[i]['section_id'] + "'>" + data[i]['section_name'] + "</option>";
    //         }
    //     }
    // }
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
        var data = response["data"];
        var options = "<option value='0'>全部传感器</option>";
        for (var i = 0; i < data.length; i++) {
            options += "<option value='" + data[i]['sensor_id'] + " - " + data[i]['sensor_number'] + " - " + data[i]['sensor_type_name'] + "'>" + data[i]['sensor_number'] + "--" + data[i]['sensor_type_name'] + "</option>";
        }
    } else {
        options += "<option value='0'>无</option>";
    }
    var $dropdownMenu2 = $("#sensor_menu");
    $dropdownMenu2.empty();
    $dropdownMenu2.append(options);
    $dropdownMenu2.selectpicker('refresh');
    if (init_value) { //有初始值 则进行赋值
        $dropdownMenu2.selectpicker('val', init_value);
    }

}

function updateDropdownMenu2(response){
    // var data = null;
    // var bridge_options = "";
    // var section_options = "";//截面
    // var point_options = "";//测点
    // var watch_box_options = "";//检测箱
    // var sensor_type_options = "";
    // var metric_options = "";
    // var sensor_options = "";
    // var sensor_info = {};
    // if(response!=null && response.status==0){
    //     data = response.data;
    //     console.log(data);
    //     bridge_options = bridge_options + "<option value='" + data["bridge_id"] + "'>" + data["bridge"][data["bridge_id"]] + "</option>";
    //     for(var key in data["bridge"]){
    //         if(key==data["bridge_id"]) continue;
    //         bridge_options = bridge_options + "<option value='" + key + "'>" + data["bridge"][key] + "</option>";
    //     }
    //
    //     for(var key in data["bridge_detail"]){
    //         section_options += '<option value="' + key + '">' + data["bridge_detail"][key]["name"] + "</option>";
    //     }
    //     $('#query_section_menu').empty();
    //     $('#query_section_menu').append(section_options);
    //
    //     var section_selected = $('#query_section_menu').val();
    //     for(var key in data["bridge_detail"][section_selected]){
    //         if(key=="name") continue;
    //         point_options += '<option value="' + key +'">' + data["bridge_detail"][section_selected][key]["name"] + "</option>";
    //     }
    //     $('#query_point_menu').empty();
    //     $('#query_point_menu').append(point_options);
    //
    //     var point_selected = $('#query_point_menu').val();
    //     for(var key in data["bridge_detail"][section_selected][point_selected]){
    //         if(key=="name") continue;
    //         watch_box_options = watch_box_options + "<option value='" + key + "'>" + data["bridge_detail"][section_selected][point_selected][key]["name"] + "</option>";
    //     }
    //     $('#query_box_menu').empty();
    //     $('#query_box_menu').append(watch_box_options);
    //
    //     var box_selected = $('#query_box_menu').val();
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
    //     // for(var key in data["bridge_detail"][section_selected][point_selected][box_selected]){
    //     //     var sensor_dict = data["bridge_detail"][section_selected][point_selected][box_selected]["sensor"];
    //     //     for(var sensor_id in sensor_dict){
    //     //         var sensor_name = sensor_dict[sensor_id];
    //     //         var sensor_name_list = sensor_name.split(" - ");
    //     //         var sensor_number = sensor_name_list[0];
    //     //         var sensor_type = sensor_name_list[1];
    //     //         if(sensor_info.hasOwnProperty(sensor_type)){
    //     //             sensor_info[sensor_type].push([sensor_id,sensor_number]);
    //     //         }else{
    //     //             sensor_info[sensor_type] = [[sensor_id,sensor_number]];
    //     //         }
    //     //     }
    //     // }
    //     // key为传感器类型
    //     console.log(sensor_info)
    //     for(var key in sensor_info){
    //         sensor_type_options = sensor_type_options + "<option value='" + key + "'>" + key + "</option>";
    //     }
    // }
    //
    // $("#query_bridge_menu").empty();
    // // $('#query_section_menu').empty();
    // // $('#query_point_menu').empty();
    // $("#query_sensor_type_menu").empty();
    // $("#query_metric_menu").empty();
    // $("#query_group_sensor_menu").empty();
    //
    // $("#query_bridge_menu").append(bridge_options);
    // // $('#query_section_menu').append(section_options);
    // // $('#query_point_menu').append(point_options);
    // $("#query_sensor_type_menu").append(sensor_type_options);
    // var sensor_type_selected = $("#query_sensor_type_menu").val();
    // if(sensor_type_selected && !(sensor_type_selected.match(/^\s*$/))){
    //     for(var key in sensor_metadata_map[sensor_type_selected]["data_schema"]){
    //         if(key=="CLSJ") continue;
    //         metric_options = metric_options + "<option value='" + key + "'>" + sensor_metrics_CN[key] + "</option>";
    //     }
    //     var sensor_list = sensor_info[sensor_type_selected];
    //     for(var key in sensor_list){
    //         sensor_options = sensor_options + "<option value='" + sensor_list[key][0] + "'>" + sensor_list[key][1] + "</option>";
    //     }
    // }
    // $("#query_metric_menu").append(metric_options);
    // $("#query_group_sensor_menu").append(sensor_options);
    // if(sensor_list && sensor_list.length){
    //     $("#query_group_sensor_menu").selectpicker('val', sensor_list[0][0]);
    // }
    // $('.selectpicker').selectpicker('refresh');
    // console.log(sensor_info)
    // return sensor_info;
}

//桥梁列表下拉框
function queryBridgeListDropdown() {
    var url = "/bridge/simple-list";
    var response = webRequest(url, "GET", false, {});
    var options = "<option value='0'>全部桥梁</option>";
    if (response != null && response['data']) {
        var data = response["data"];
        for (var i = 0; i < data.length; i++) {
            options += "<option value='" + data[i]['bridge_id'] + "'>" + data[i]['bridge_name'] + "</option>";
        }
    }
    var $dropdownMenu1 = $("#query_bridge_menu");
    $dropdownMenu1.append(options);
    $dropdownMenu1.selectpicker('val', $dropdownMenu1.attr('init-value'));
    $dropdownMenu1.on("changed.bs.select", function () {
        querySectionListDropdown($(this).val()); //更新截面列表
        queryWatchPointListDropdown($('#query_section_menu').val());
        queryWatchBoxListDropdown($(this).val());
        querySensorListDropdown($(this).val(),$('#query_section_menu').val(),$('#query_point_menu').val(),$('#query_box_menu').val());
    });
}

//截面列表下拉框
function querySectionListDropdown(bridgeId, init_value) {
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
    var $dropdownMenu2 = $("#query_section_menu");
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
        if (!selectIsExitItem($('#query_box_menu'),"-1")){
            var em = "<option value='-1'>未选中</option>";
            $('#query_box_menu').append(em)
            $('#query_box_menu').val("-1")
        }
        queryWatchPointListDropdown($(this).val());

        querySensorListDropdown($('#query_bridge_menu').val(),$('#query_section_menu').val(),$('#query_point_menu').val(),0);
    });

}

//监测点下拉列表
function queryWatchPointListDropdown(sectionId, init_value) {
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
    var $dropdownMenu3 = $("#query_point_menu");
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
        if (!selectIsExitItem($('#query_box_menu'),"-1")){
            var em = "<option value='-1'>未选中</option>";
            $('#query_box_menu').append(em)
            $('#query_box_menu').val("-1")
        }
        querySensorListDropdown($('#query_bridge_menu').val(),$('#query_section_menu').val(),$('#query_point_menu').val(),0);
    });
}

//控制箱下拉列表
function queryWatchBoxListDropdown(bridgeId, init_value) {
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
    var $dropdownMenu4 = $("#query_box_menu");
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
        if (!selectIsExitItem($('#query_section_menu'),"-1")){
            var em = "<option value='-1'>未选中</option>";
            $('#query_section_menu').append(em)
            $('#query_section_menu').val("-1")
        }
        if (!selectIsExitItem($('#query_point_menu'),"-1")){
            var em = "<option value='-1'>未选中</option>";
            $('#query_point_menu').append(em)
            $('#query_point_menu').val("-1")
        }
        querySensorListDropdown($('#query_bridge_menu').val(),0,0,$('#query_box_menu').val());
    });
}

//传感器相关下拉列表
function querySensorListDropdown(bridge_id, section_id, watch_point_id, watch_box_id, init_value) {
    // if (bridgeId != 0) {  //为全部桥梁时不需要获取传感列表
    //     var url = "/sensor/list";
    //     var response = webRequest(url, "GET", false, {
    //         page: 0,
    //         pageSize: 18446744073709551615,
    //         bridgeId: bridge_id | 0,
    //         sectionId: section_id | 0,
    //         watchPointId: watch_point_id | 0,
    //         watchBoxId: watch_box_id | 0
    //     });
    //     if (response != null && response['data']) {
    //         var data = response["data"];
    //         for (var i = 0; i < data.length; i++) {
    //             options += "<option value='" + data[i]['section_id'] + "'>" + data[i]['section_name'] + "</option>";
    //         }
    //     }
    // }
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
        var data = response["data"];
        var options = "<option value='0'>全部传感器</option>";
        for (var i = 0; i < data.length; i++) {
            options += "<option value='" + data[i]['sensor_id'] + "'>" + data[i]['sensor_number'] + "--" + data[i]['sensor_type_name'] + "</option>";
        }
    } else {
        options += "<option value='0'>无</option>";
    }
    var $dropdownMenu2 = $("#query_sensor_type_menu");
    $dropdownMenu2.empty();
    $dropdownMenu2.append(options);
    metricDropdowwn($('#query_sensor_type_menu').children('option:selected').text().split(" - ")[1])
    $dropdownMenu2.selectpicker('refresh');
    if (init_value) { //有初始值 则进行赋值
        $dropdownMenu2.selectpicker('val', init_value);
    }
}

//数据类型下拉框
function metricDropdowwn(sensor_name) {
    console.clear()
    console.log(sensor_name)
    var metric_options = ""
    if(sensor_name==null){
        metric_options += "<option value='0'>请先选择传感器</option>"
        $('#query_metric_menu').empty();
        $('#query_metric_menu').append(metric_options);
        $('.selectpicker').selectpicker('refresh');
        return;
    }

    for(var key in sensor_metadata_map[sensor_name]["data_schema"]){
        if(key=="CLSJ") continue;
        metric_options = metric_options + "<option value='" + key + "'>" + sensor_metrics_CN[key] + "</option>";
    }
    $('#query_metric_menu').empty();
    $('#query_metric_menu').append(metric_options);
    $('.selectpicker').selectpicker('refresh');

}

// 其它初始化
$(function () {

    // begin
    // 表格操作
    var url = "/query-data/dropdown";
    // var response = webRequest(url,"GET",false,{"bridge_id":"all"})
    // var data1 = updateDropdownMenu1(response);

    // begin
    //初始化表格
    // updateGrid($("#bridge_menu").val(),$("#watch_box_menu").val(),$("#sensor_menu").val());
    // end

    bridgeListDropdown();
    sectionListDropdown($('#bridge_menu').val(), $("#section_menu").attr('init-value'));
    watchPointListDropdown($('#section_menu').val(), $("#point_menu").attr('init-value'));
    watchBoxListDropdown($('#bridge_menu').val(), $("#watch_box_menu").attr('init-value'));
    sensorListDropdown($('#bridge_menu').val(), $('#section_menu').val(), $('#point_menu').val(), $('#watch_box_menu').val())

    queryBridgeListDropdown();
    querySectionListDropdown($('#query_bridge_menu').val(), $("#query_section_menu").attr('init-value'));
    queryWatchPointListDropdown($('#query_section_menu').val(), $("#querypoint_menu").attr('init-value'));
    queryWatchBoxListDropdown($('#query_bridge_menu').val(), $("#query_box_menu").attr('init-value'));
    querySensorListDropdown($('#query_bridge_menu').val(), $('#query_section_menu').val(), $('#query_point_menu').val(), $('#query_box_menu').val())

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
        $('#watch_box_menu').empty();
        $('#watch_box_menu').append(watch_box_options);
        //传感器下拉框联动
        sensorListDropdown($(this).val(),$('#section_menu').val(),$('#point_menu').val(),$('#watch_box_menu').val());
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
        sensorListDropdown($('#bridge_menu').val(),$('#section_menu').val(),$('#point_menu').val(),0);
        $('.selectpicker').selectpicker('refresh');
    });
    //选择测点后，传感器联动
    $('#point_menu').on('change',function () {
        //传感器下拉框联动
        sensorListDropdown($('#bridge_menu').val(),$('#section_menu').val(),$('#point_menu').val(),0);
        $('.selectpicker').selectpicker('refresh');
    });
    //选择监测箱后传感器联动
    $('#watch_box_menu').on('change',function (){
        //传感器下拉框联动
        sensorListDropdown($('#bridge_menu').val(),0,0,$('#watch_box_menu').val());
        $('.selectpicker').selectpicker('refresh');
    });

    // 点击查询
    $("#query_grid_btn").click(function(){

        if(!$("#query_data_grid").html()){
            console.log("空")
        }else{
            console.log("有");
            $("#query_data_grid").empty();
        }

        $(this).button('loading').delay(1000).queue(function() {
            var bridge_id = $("#bridge_menu").val();
            var box_id = $("#watch_box_menu").val();
            var sensor_info = $("#sensor_menu option:selected").text();
            if(!bridge_id || !box_id || !sensor_info || bridge_id.match(/^\s*$/) || box_id.match(/^\s*$/) || sensor_info.match(/^\s*$/)){
                showTransientDialog("没有符合条件的查询！");
            }else{
                updateGrid(bridge_id,box_id,sensor_info);
            }
            $(this).button('reset').dequeue();
        });
    });

    $("#add_data").click(function () {
        var sensor_info = $("#sensor_menu").val();
        if(sensor_info==null || sensor_info=="") return;
        var sensor_info_list = sensor_info.split(" - ");
        console.log(sensor_info);
        var sensor_id = sensor_info_list[0];
        var sensor_type = sensor_info_list[2];
        switch (sensor_type)
        {
            case "加速度传感器" : showJSDSensorDataDialog("增加传感器数据", "create", sensor_id,"","",""); break;
            case "光纤应变传感器" : showGXYBSensorDataDialog("增加传感器数据","create",sensor_id,"","",""); break;
            case "振弦传感器" : showZXSensorDataDialog("增加传感器数据", "create",sensor_id, "","","","",""); break;
            case "索力传感器" : showSLSensorDataDialog("增加传感器数据", "create", sensor_id, "", "", "", ""); break;
            case "GPS传感器" : showGPSSensorDataDialog("增加传感器数据", "create", sensor_id, "","","","","","","","","","","","",""); break;
            default: break;
        }
    })

    $("#delete_data").click(function () {
        var sensor_info = $("#sensor_menu").val();
        if(sensor_info==null || sensor_info=="") return;
        var sensor_info_list = sensor_info.split(" - ");
        var sensor_id = sensor_info_list[0];
        var checked_list = [];
        $('[name=sensordata]').each(function (index, ele) {
            if ($(ele).prop("checked")) {
                checked_list.push($(ele).val())
            }
        });
        var checked_len = checked_list.length;
        if (checked_len <= 0) {
            showTransientDialog("请选择要删除的记录！");
        } else {
            showAlertDialog("确定删除 " + checked_len + " 条记录？", function () {
                var url = '/query-data/delete';
                var params = {
                    'sensor_id' : sensor_id,
                    'checkedList': checked_list.join(",")
                };
                var response = webRequest(url, 'POST', false, params);
                if (response != null && response.status == 0) {
                    refreshData();
                    showTransientDialog("删除 " + checked_len + " 条记录成功！");
                } else {
                    showTransientDialog(response.msg);
                }
            });
        }
    })

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

    // var data2 = updateDropdownMenu2(response);
    // var data_menu2 = response.data;


    // $('#query_bridge_menu').change(function(){
    //     var id = $(this).children('option:selected').val();
    //     var url = "/query-data/dropdown";
    //     var response = webRequest(url,"GET",false,{"bridge_id":id})
    //     data2 = updateDropdownMenu2(response);
    //     data_menu2 = response.data;
    // })
    //
    // $('#query_section_menu').change(function(){
    //     var section_selected = $(this).children('option:selected').val();
    //     var point_options = "";
    //     for (var key in data_menu2["bridge_detail"][section_selected]){
    //         if(key=="name") continue;
    //         point_options = point_options + "<option value='" + key + "'>" + data_menu2["bridge_detail"][section_selected][key]["name"] + "</option>";
    //     }
    //     $('#query_point_menu').empty();
    //     $('#query_point_menu').append(point_options);
    //     $('#query_point_menu').trigger("change");
    //     $('.selectpicker').selectpicker('refresh');
    // })
    //
    // $('#query_point_menu').change(function(){
    //     var section_selected = $("#query_section_menu").children('option:selected').val();
    //     var point_selected = $(this).children('option:selected').val();
    //     var box_optioins = "";
    //     for (var key in data_menu2["bridge_detail"][section_selected][point_selected]){
    //         if(key == "name") continue;
    //         box_optioins += '<option value="' + key + '">' + data_menu2["bridge_detail"][section_selected][point_selected][key]["name"] + "</option>";
    //     }
    //     $("#query_box_menu").empty();
    //     $("#query_box_menu").append(box_optioins);
    //     $('#query_box_menu').trigger("change");
    //     $('.selectpicker').selectpicker('refresh');
    // })
    //
    // $('#query_box_menu').change(function(){
    //     var section_selected = $('#query_section_menu').children('option:selected').val();
    //     var point_selected = $('#query_point_menu').children('option:selected').val();
    //     var box_selected = $(this).children('option:selected').val();
    //     console.clear();
    //     console.log(data_menu2);
    //     var sensor_dict = data_menu2["bridge_detail"][section_selected][point_selected][box_selected]["sensor"];
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
    //     $("#query_sensor_type_menu").empty();
    //     $('#query_sensor_type_menu').append(sensor_type_options);
    //     data2 = sensor_info;
    //     $('#query_sensor_type_menu').trigger("change");
    //     $('.selectpicker').selectpicker('refresh');
    // })
    //
    // $('#query_sensor_type_menu').change(function(){
    //     var sensor_type_selected = $(this).children('option:selected').val();
    //     var metric_options = ""
    //     var sensor_options = "";
    //     for(var key in sensor_metadata_map[sensor_type_selected]["data_schema"]){
    //         if(key=="CLSJ") continue;
    //         metric_options = metric_options + "<option value='" + key + "'>" + sensor_metrics_CN[key] + "</option>";
    //     }
    //     var sensor_list = data2[sensor_type_selected];
    //     for(var key in sensor_list){
    //         sensor_options = sensor_options + "<option value='" + sensor_list[key][0] + "'>" + sensor_list[key][1] + "</option>";
    //     }
    //     $("#query_metric_menu").empty();
    //     $("#query_group_sensor_menu").empty();
    //     $("#query_metric_menu").append(metric_options);
    //     $("#query_group_sensor_menu").append(sensor_options);
    //     if(sensor_list.length){
    //         $("#query_group_sensor_menu").selectpicker('val', sensor_list[0][0]);
    //     }
    //     $('.selectpicker').selectpicker('refresh');
    // })
    //选择桥梁后-截面、监测点和控制箱列表联动
    $('#query_bridge_menu').on('change', function () {
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
        $('#query_section_menu').empty();
        $('#query_section_menu').append(section_options);
        //监测点列表联动
        var watch_point_options = "";
        if ($('#query_section_menu').val()) {
            url = "/watch-point/simple-list";
            response = webRequest(url, 'GET', false, {'sectionId': $('#query_section_menu').val()});
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
        $('#query_point_menu').empty();
        $('#query_point_menu').append(watch_point_options);
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
        $('#query_box_menu').empty();
        $('#query_box_menu').append(watch_box_options);
        //传感器下拉框联动
        sensorListDropdown($(this).val(),$('#query_section_menu').val(),$('#query_point_menu').val(),$('#query_box_menu').val());
        $('.selectpicker').selectpicker('refresh');
    });
    //选择截面后-监测点列表联动
    $('#query_section_menu').on('change', function () {
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
        $('#query_point_menu').empty();
        $('#query_point_menu').append(watch_point_options);
        //传感器下拉框联动
        sensorListDropdown($('#query_bridge_menu').val(),$('#query_section_menu').val(),$('#query_point_menu').val(),0);
        $('.selectpicker').selectpicker('refresh');
    });
    //选择测点后，传感器联动
    $('#query_point_menu').on('change',function () {
        //传感器下拉框联动
        sensorListDropdown($('#query_bridge_menu').val(),$('#query_section_menu').val(),$('#query_point_menu').val(),0);
        $('.selectpicker').selectpicker('refresh');
    });
    //选择监测箱后传感器联动
    $('#query_box_menu').on('change',function (){
        //传感器下拉框联动
        sensorListDropdown($('#query_bridge_menu').val(),0,0,$('#query_box_menu').val());
        $('.selectpicker').selectpicker('refresh');
    });
    $('#query_sensor_type_menu').on('change',function () {
        metricDropdowwn($(this).children('option:selected').text().split("--")[1]);
        $('.selectpicker').selectpicker('refresh');
    })

    // 点击查询
    $("#query_latest_time_btn").click(function(){
        var sensor_type = $("#query_sensor_type_menu").val();
        var metric = $("#query_metric_menu").val();
        var sensor_id_array = [];
        var sensor_number_array = [];
        // $("#query_group_sensor_menu option:selected").each(function() {
        //     sensor_id_array.push($(this).val());
        //     sensor_number_array.push($(this).text());
        // });

        $('#query_sensor_type_menu option:selected').each(function () {
            sensor_id_array.push($(this).val());
            sensor_number_array.push($(this).text().split("--")[0])
        });


        console.log(sensor_id_array,sensor_number_array)
        if(!sensor_type || !metric || !sensor_id_array || sensor_type[0].match(/^\s*$/) || metric.match(/^\s*$/) || sensor_id_array.length<=0){
            showTransientDialog("没有符合条件的查询！");
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
        // $("#query_group_sensor_menu option:selected").each(function() {
        //     sensor_id_array.push($(this).val());
        //     sensor_number_array.push($(this).text());
        // });

        $('#query_sensor_type_menu option:selected').each(function () {
            sensor_id_array.push($(this).val());
            sensor_number_array.push($(this).text().split("--")[0])
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
                console.log(item);
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

        // $("#query_group_sensor_menu option:selected").each(function() {
        //     sensor_id_array.push($(this).val());
        //     sensor_number_array.push($(this).text());
        // });
        $('#query_sensor_type_menu option:selected').each(function () {
            sensor_id_array.push($(this).val());
            sensor_number_array.push($(this).text().split("--")[0])
        });

        console.log(sensor_id_array,sensor_number_array)
        console.log(sensor_type,metric)
        if(!sensor_type || !metric || !sensor_id_array || sensor_type[0].match(/^\s*$/) || metric.match(/^\s*$/) || sensor_id_array.length<=0){
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
                console.log(new Date(begin_time).format('yyyyMMddHHmmssSS'));
                console.log(new Date(begin_time).format('yyyyMMddHHmmss'));
                var params = {
                    "sensorList": JSON.stringify(sensor_id_array),
                    "columnList": JSON.stringify([metric]),
                    "startRowKey": new Date(begin_time).format('yyyyMMddHHmmss'),
                    "endRowKey": new Date(end_time).format('yyyyMMddHHmmss'),
                    "limit": 0
                }
                // 返回后调用
                var current_dialog = $(this);
                getAndshowSensorFigure(figure_id,sensor_id_array,sensor_number_array,current_dialog,params,false);
            });
        }
    });
    // end

    $("#export_xml").click(function () {
        var grid = $("#query_data_grid").data("kendoGrid");
        grid.saveAsExcel();
        // var data = grid.dataSource.data()
        // console.log(data)
    })

    $("#export_csv").click(function () {
        var grid = $("#query_data_grid").data("kendoGrid");
        var csv = toCSV("query_data_grid");
        console.log(csv);
        window.open("data:text/csv;charset=utf-8," + csv);
    })

});


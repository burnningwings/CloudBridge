
function selectBridgeOnchange(obj){
    var bridge_id = obj.value;
    updatePointGrid(bridge_id);
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
    var $dropdownMenu1 = $("#dropdownMenu1");
    $dropdownMenu1.append(options);
    $dropdownMenu1.selectpicker('val', $dropdownMenu1.attr('init-value'));
    $dropdownMenu1.on("changed.bs.select", function () {
        sectionListDropdown($(this).val()); //更新截面列表
        updateWatchPointGrid($('#dropdownMenu1').val(), $('#dropdownMenu2').val()); //更新表格
    });
}

//截面列表下拉框
function sectionListDropdown(bridgeId, init_value) {
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
    var $dropdownMenu2 = $("#dropdownMenu2");
    $dropdownMenu2.empty();
    $dropdownMenu2.append(options);
    $dropdownMenu2.selectpicker('refresh');
    if (init_value) { //有初始值 则进行赋值
        $dropdownMenu2.selectpicker('val', init_value);
    }

    $dropdownMenu2.off('changed.bs.select').on("changed.bs.select", function () {
        updateWatchPointGrid($('#dropdownMenu1').val(), $('#dropdownMenu2').val());//更新表格
    });

}
function updateWatchPointGrid(bridge_id, section_id){
    var detailCol = getDetailCol(getUserRole()),
        detailTitle = detailCol['title'],
        detailBtnText = detailCol['buttonText'],
        detailBtnClass = detailCol['buttonClass'];

    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                type: "get",
                url: "/watch-point-para/list",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (options, operation) {

                if (operation == "read") {
                    var parameter = {
                        page: options.page,
                        pageSize: options.pageSize,
                        bridgeId: bridge_id | 0,
                        sectionId: section_id | 0
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

    $("#watch-point-grid").kendoGrid({
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
//            {
//                template:'<input type="checkbox" class="checkbox" name=box-"#: point_id #" value="#: point_id #" />',
//                headerAttributes:{ style:"text-align:center"},
//                attributes:{ class:"text-center" }
//            },
            {
                field: "bridge_name",
                title: "桥梁名称",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            },  {
                field: "section_name",
                title: "截面名称",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "point_name",
                title: "测点名称",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
           },  {
                field: "sc",
                title: "测点的收缩徐变值(单位:Mpa)",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            } , {
                title: detailTitle,
                template: "<button class='" + detailBtnClass + "' type='button' id='modify-#: point_id #' onclick='modifyWatchPointPara(#: point_id #)'/>" + detailBtnText + "</button>",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }
        ]
    });
}



//修改监测点参数信息
function modifyWatchPointPara(watch_point_id) {
    //alert(watch_point_id);
    showWatchPointParaDialog("监测点参数信息", 'update', watch_point_id);
}

//弹窗
function showWatchPointParaDialog(title, operation_type, watch_point_id) {
    var url = "/watch-point-para/info";
    var params = {
        "watch_point_id": watch_point_id
    };
    var response = webRequest(url, "GET", false, params);
    var sc = "";

    var bridge_type_name = "";

    if (response.status == 0) {
        var data = response.data;
        if (data["sc"]) {
            sc = data["sc"]
            //alert(sc)
        }
    }

    <!--尽管报错，但是不能删去-->
    var content = '\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">测点的收缩徐变值(单位:Mpa)</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="sc" placeholder="请输入测点的收缩徐变值" value="' + sc + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        ';

    if (!isAdminRole(getUserRole())) {
        showModalDialogWithoutOK(title, content, 605, 330);
        $('div.form-inline-custom').find('input,select,textarea').attr('disabled', 'disabled');
    } else {
        showModalDialog(title, content, ok_callback, 605, 330);
    }

    //回调函数
    function ok_callback() {
        //必须参数
        var sc_val = $('#sc').val();
        //alert(sc_val)

        if (!sc_val) {
            showTransientDialog("必填项不能为空！");
            return false;
        } else {
            if (legaldigit(sc_val))
            {
                showTransientDialog("输入的格式不是合法数字或超过超过范围！");
                return false;
            }
            var url = '/watch-point-para/update';
            var params = {
                'sc': sc_val,
                'watch_point_id':watch_point_id
            };
            var response = webRequest(url, 'POST', false, params);
            if (response != null && response.status == 0) {
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

//修改监测点参数信息
function modifyBridgePara(bridge_id) {
    //alert(watch_point_id);
    showBridgeParaDialog("桥梁参数信息", 'update', bridge_id);
}

//弹窗
function showBridgeParaDialog(title, operation_type, bridge_id) {
    var url = "/bridge-para/info";
    var params = {
        "bridge_id": bridge_id
    };
    var response = webRequest(url, "GET", false, params);
    var E = "";
    var mrc0 = "";
    var src0 = "";
    var mrt0 = "";
    var srt0 = "";

    if (response.status == 0) {
        var data = response.data;
        if (data["mRc0"])  mrc0 = data["mRc0"];
        if (data["sRc0"]) src0 = data["sRc0"];
        if (data["mRt0"]) mrt0 = data["mRt0"];
        if (data["sRt0"]) srt0 = data["sRt0"];
        if (data["E"]) E = data["E"];
    }

    <!--尽管报错，但是不能删去-->
    var content = '\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">混凝土轴心抗压强度均值(Mpa):</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="mrc0"  placeholder="混凝土轴心抗压强度均值" value="' + mrc0 + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">混凝土轴心抗压强度标准差(Mpa):</label>  \
            <div class="col-sm-8">  \
                 <input type="text" class="form-control" id="src0" placeholder="混凝土轴心抗压强度标准差" value="' + src0 + '"> \
            </div> \
            <span class="text-danger mt5 fl">*</span>\
        </div>\
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">轴心抗压强度均值(单位:Mpa):</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="mrt0" placeholder="轴心抗压强度均值" value="' + mrt0 + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">轴心抗压强度标准差(单位:Mpa):</label>  \
            <div class="col-sm-8">  \
                               <input type="text" class="form-control" id="srt0" placeholder="轴心抗压强度标准差" value="' + srt0 + '"> \
            </div> \
            <span class="text-danger mt5 fl">*</span>\
        </div>\
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">材料弹性模量(单位:Gpa):</label>\
            <div class="col-sm-8"> \
                <input type="text" class="form-control" id="E" placeholder="材料弹性模量" value="' + E + '"> \
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        ';

    if (!isAdminRole(getUserRole())) {
        showModalDialogWithoutOK(title, content, 605, 330);
        $('div.form-inline-custom').find('input,select,textarea').attr('disabled', 'disabled');
    } else {
        showModalDialog(title, content, ok_callback, 605, 330);
    }

    //回调函数
    function ok_callback() {
        //必须参数
        var E_val = $('#E').val();
        var mrc0_val = $('#mrc0').val();
        var src0_val = $('#src0').val();
        var mrt0_val = $('#mrt0').val();
        var srt0_val = $('#srt0').val();

        if (islegalAll(E_val,mrc0_val,src0_val,mrt0_val,srt0_val))
        {
            showTransientDialog("输入的格式不是合法数字或超过超过范围！");
            return false;
        }
            var url = '/bridge-para/update';
            var params = {
                'E' : E_val,
                'mrc0' : mrc0_val,
                'src0' : src0_val,
                'mrt0' : mrt0_val,
                'srt0' : srt0_val,
                'bridge_id' : bridge_id
            };
            var response = webRequest(url, 'POST', false, params);

            if (response != null && response.status == 0) {
                refreshBridgePara();
                showTransientDialog("操作成功！");
                return true;
            } else {
                showTransientDialog(response.msg);
                return false;
            }
        //}

    }
}
//桥梁参数
function updateBridgeParaGrid(){
    var detailCol = getDetailCol(getUserRole()),
        detailTitle = detailCol['title'],
        detailBtnText = detailCol['buttonText'],
        detailBtnClass = detailCol['buttonClass'];

    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                type: "get",
                url: "/bridge-para/list",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (options, operation) {

                if (operation == "read") {
                    var parameter = {
                        page: options.page,
                        pageSize: options.pageSize
                        //,
                        //bridgeId: bridge_id | 0
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

    $("#birdge-para-grid").kendoGrid({
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
//            {
//                template:'<input type="checkbox" class="checkbox" name=box-"#: bridge_id #" value="#: bridge_id #" />',
//                headerAttributes:{ style:"text-align:center"},
//                attributes:{ class:"text-center" }
//            },
            {
                field: "bridge_name",
                title: "桥梁名称",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "mRc0",
                title: "混凝土轴心抗压强度均值(Mpa)",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            },{
                field: "sRc0",
                title: "混凝土轴心抗压强度标准差(Mpa)",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            },{
                field: "mRt0",
                title: "轴心抗压强度均值(单位:Mpa)",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            },{
                field: "sRt0",
                title: "轴心抗压强度标准差(单位:Mpa)",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            },{
                  field: "E",
                  title: "材料弹性模量(单位:Gpa)",
                  headerAttributes:{ style:"text-align:center"},
                  attributes:{ class:"text-center" }
            },{
                title: detailTitle,
                template: "<button class='" + detailBtnClass + "' type='button' id='modify-#: bridge_id #' onclick='modifyBridgePara(#: bridge_id #)'/>" + detailBtnText + "</button>",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }
        ]
    });
}

//判断数字是否合法，整数位数<=10,小数位数<=20
function legaldigit(num){
    var legal = isNaN(num);  //false表示是数字,合法

    if(legal) return legal;  //返回true表示不合法
    //若无小数点，返回-1
    var x = String(num).indexOf('.');

    if(eval(x)==-1)
    {
        if (num.toString().length > 10) return true;
    }
    else
    {
        //alert(num);
        var integers = num.toString().split(".")[0].length;
        //alert("integer"+parseInt(integers));

        if (eval(integers) > 10) return true;
        var floats = num.toString().split(".")[1].length;
        //alert("fl"+eval(floats));
        if (eval(floats) > 20) return true;

    }

    return false;
}

//全部合法返回false
function islegalAll(num1,num2,num3,num4,num5)
{
    //alert(legaldigit(num1) +","+ legaldigit(num2) +","+ legaldigit(num3) +","+ legaldigit(num4) +","+ legaldigit(num5));
    var legal = legaldigit(num1) || legaldigit(num2) || legaldigit(num3) || legaldigit(num4) || legaldigit(num5) ;
    //alert("legal"+legal);
    if (legal) return true;
    return false;
}


function refreshBridgePara() {
   var $bridge_para_grid = $("#birdge-para-grid");
   $bridge_para_grid.data("kendoGrid").dataSource.read();
   $bridge_para_grid.data("kendoGrid").refresh();
}


function refreshData() {
    var $watch_point_grid = $("#watch-point-grid");
    $watch_point_grid.data("kendoGrid").dataSource.read();
    $watch_point_grid.data("kendoGrid").refresh();
}
// 表格初始化
$(function () {
    bridgeListDropdown();
    sectionListDropdown($('#dropdownMenu1').val(), $("#dropdownMenu2").attr('init-value'));
    updateWatchPointGrid($('#dropdownMenu1').val(), $('#dropdownMenu2').val());
    //updatePointGrid($("#bridge_menu").val());
    updateBridgeParaGrid();
});



// function selectBridgeOnchange(obj){
//     var selectUserType = obj.value;
//     if (selectUserType == "全部"){
//         updateUserGrid(selectUserType);
//     }else{
//         //如果不是“全部”则待按下查找按钮再触发更新
//     }
// }

function selectUser(selectusertype,selectusercontent){
    updateUserGrid(selectusertype,selectusercontent);
}

//function updateUserGrid(selectusertype,selectusercontent) {
function updateUserGrid(selectusertype,selectusercontent) {
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                type: "get",
                url: "/user-manager/list",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (options, operation) {

                if (operation == "read") {
                    var parameter = {
                        page: options.page,
                        pageSize: options.pageSize,
                        selectUserType: selectusertype,
                        selectUserContent: selectusercontent
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

    $("#user-grid").kendoGrid({
        dataSource: dataSource,
        pageable: {
            // pageSizes: true,
            pageSizes: [10,25,50,100],
            buttonCount: 5,
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
                template:'<input type="checkbox" class="checkbox" name=user-"#: userid #" value="#: userid #" />',
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            },
            {
                field: "accountid",
                title: "账号",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "username",
                title: "姓名",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "department",
                title: "单位",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "duty",
                title: "职务",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                title: "修改",
                template: "<button class='btn btn-success' type='button' id='modify-#: userid #' onclick='modifyWatchBox()'/>修改</button>",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                title: "已授权信息",
                template: "<a href='/role/#: userid #' />查看角色</a>",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }
        ]
    });
}


// 表格初始化
$(function () {
    console.log($("#dropdownMenu_selectusertype").val())
   updateUserGrid($("#dropdownMenu_selectusertype").val(),$("#input_selectuseircontent").val());
});
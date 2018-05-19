function updateRoleGrid(){
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                type: "get",
                url: "/role-manager/list",
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

    $("#role-grid").kendoGrid({
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
                template:'<input type="checkbox" class="checkbox" name=role-"#: roleid #" value="#: roleid #" />',
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            },
            {
                field: "rolename",
                title: "名称",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "roleid",
                title: "描述",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }

            }, {
                title: "修改",
                template: "<button class='btn btn-success' type='button' id='modify-#: roleid #' onclick='modifyRolePrivilege()'/>修改</button>",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                title: "已授权用户",
                template: "<a href='/roleuser/#: roleid #' />查看</a>",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }
        ]
    });
}

function showRoleManagerDialog(title,operation){
    //获取所有权限
    var rolename = "";
    var privilege_option = "";
    var url = "/role-manager/privilege-list";
    var params = {

    }
    var response = webRequest(url,"GET",false,params)
    if(response.status==0){
        var data = response.data;
        for(var key in data["privilegelist"]){
            privilege_option = privilege_option + "<input type='checkbox' name='pitem' value='"+key+"'/> "+data["privilegelist"][key]+"<br/>";
        }
    }

    var content = '\
         <div class="form-inline-custom">\
                <label class="col-sm-3 control-label">名称:</label>\
                <div class="col-sm-8"> \
                    <input type="text" class="form-control" id="role_name" placeholder="请输入创建角色的名称" > \
                </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">权限类型:</label>\
            <div class="col-sm-8"> <br/>'
                +privilege_option +
            '</div>\
        </div>\
        ';


    function ok_callback(){
        rolename = $("#role_name").val();
        var privilege_list = [];
        $('[name=pitem]:checkbox:checked').each(function () {
            privilege_list.push($(this).val())
        })
        if(!rolename){
            showTransientDialog("角色名称不能为空");
            return false;
        }else if(!privilege_list){
            showTransientDialog("请选择赋予角色的权限");
        }else{
            var url = "/role-manager/create-role";
            var params = {
                "roleName" : rolename,
                "privilegeList" : privilege_list
            }
            var response = webRequest(url,"POST",false,params);
            if(response!=null && response.status==0){
                updateRoleGrid();
                showTransientDialog("操作成功！");
                return true;
            }else{
                showTransientDialog(response.msg);
                return false;
            }
        }
    }

    showModalDialog(title,content,ok_callback);
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


//表格初始化
$(function () {
    updateRoleGrid();
});

//其它初始化
$(function(){

    //绑定增加角色事件
    $("#add_role").click(function() {
        showRoleManagerDialog("创建角色信息","insert")
    });
});


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
                field: "username",
                title: "用户名",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "truename",
                title: "真实姓名",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "department",
                title: "部门",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                field: "duty",
                title: "职务",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                title: "修改",
                template: "<button class='btn btn-success' type='button' id='modify-#: userid #' onclick='modifyUserInfo(\"#: userid #\")'/>修改</button>",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }, {
                title: "已授权信息",
                template: "<a href='javascript:searchRole(\"#: userid #\")' />查看角色</a>",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }
        ]
    });
}

function showUserCreateDialog(title) {
    //获取所有角色
    var username = "";
    var password = "";
    var truename = "";
    var department = "";
    var duty = "";
    var role_select = [];

    var role_option = "";
    var url = "/user-manager/role-list";
    var params = {}
    var response = webRequest(url, "GET", false, params);
    if (response.status == 0) {
        var data = response.data;
        for (var key in data["rolelist"]) {
            role_option = role_option + "<input type='checkbox' name='cuitem' value='" + key + "'/> " + data["rolelist"][key] + "<br/>";
        }
    }
    var content = '\
         <div class="form-inline-custom">\
                <label class="col-sm-3 control-label">用户名:</label>\
                <div class="col-sm-8"> \
                    <input type="text" class="form-control" id="c_username" placeholder="请输入用户名" > \
                </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">密码:</label>\
            <div class="col-sm-8">\
                <input type="text" class="form-control" id="c_password" placeholder="请输入密码" >\
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div>\
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">真实姓名:</label>\
            <div class="col-sm-8">\
                <input type="text" class="form-control" id="c_truename" placeholder="请输入姓名" >\
            </div>\
        </div>\
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">部门:</label>\
            <div class="col-sm-8">\
                <input type="text" class="form-control" id="c_department" placeholder="请输入所在部门" >\
            </div>\
        </div>\
        <br/>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">职务:</label>\
            <div class="col-sm-8">\
                <input type="text" class="form-control" id="c_duty" placeholder="请输入职务信息" >\
            </div>\
        </div>\
        <br />\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">角色类型:</label>\
            <div class="col-sm-8"> <br/>'
        + role_option +
        '</div>\
    </div>\
    ';

    function ok_callback() {
        username = $("#c_username").val();
        password = $("#c_password").val();
        truename = $("#c_truename").val();
        department = $("#c_department").val();
        duty = $("#c_duty").val();
        $('[name=cuitem]:checkbox:checked').each(function () {
            role_select.push($(this).val())
        });


        if (!username) {
            showTransientDialog("用户名不能为空");
            return false;
        } else if (!password) {
            showTransientDialog("密码不能为空");
            return false;
        } else if (role_select.length == 0) {
            showTransientDialog("请选择赋予用户的角色");
            return false;
        } else {
            var url = "/user-manager/create-user";
            var params = {
                "username": username,
                "password": password,
                "truename": truename,
                "department": department,
                "duty": duty,
                "role_select": role_select
            }
            var response = webRequest(url, "POST", false, params);
            if (response != null && response.status == 0) {
                updateUserGrid($("#dropdownMenu_selectusertype").val(),$("#input_selectuseircontent").val());
                showTransientDialog("操作成功！");
                return true;
            } else {
                showTransientDialog(response.msg);
                return false;
            }
        }
    }
    showModalDialog(title, content, ok_callback);
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

function modifyUserInfo(userid){
    showUserUpdateDialog(userid,"修改用户信息");
}

function showUserUpdateDialog(userid,title){
    var username = "";
    var truename = "";
    var password = "";
    var department = "";
    var duty = "";
    var role_option = "";

    var url = "/user-manager/updateuserinfo";
    var params = {
        "userid" : userid
    };
    var response = webRequest(url,"GET",false,params);
    console.log(response.status)
    if(response.status == 0) {
        var data = response.data;
        var used;
        for (var key in data["rolelist"]) {
            used = false;
            for (var ukey in data["usedrole"]) {
                if (key == ukey) {
                    role_option = role_option + "<input type='checkbox' name='uuitem' checked='true' value='" + key + "'/> " + data["rolelist"][key] + "<br/>";
                    used = true;
                    break;
                }
            }
            if (!used) {
                role_option = role_option + "<input type='checkbox' name='uuitem' value='" + key + "'/> " + data["rolelist"][key] + "<br/>";
            }
        }

        username = data["userinfo"]["username"];
        password = data["userinfo"]["password"];
        truename = data["userinfo"]["truename"];
        department = data["userinfo"]["department"];
        duty = data["userinfo"]["duty"];
    }
        var content = '\
         <div class="form-inline-custom">\
                <label class="col-sm-3 control-label">用户名:</label>\
                <div class="col-sm-8"> \
                    <input type="text" class="form-control" id="u_username" value="'+username+'" > \
                </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div> \
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">密码:</label>\
            <div class="col-sm-8">\
                <input type="text" class="form-control" id="u_password" value="'+password+'" >\
            </div>\
            <span class="text-danger mt5 fl">*</span>\
        </div>\
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">真实姓名:</label>\
            <div class="col-sm-8">\
                <input type="text" class="form-control" id="u_truename" value="'+truename+'" >\
            </div>\
        </div>\
        <br>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">部门:</label>\
            <div class="col-sm-8">\
                <input type="text" class="form-control" id="u_department" value="'+department+'" >\
            </div>\
        </div>\
        <br/>\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">职务:</label>\
            <div class="col-sm-8">\
                <input type="text" class="form-control" id="u_duty" value="'+duty+'" >\
            </div>\
        </div>\
        <br />\
        <div class="form-inline-custom">\
            <label class="col-sm-3 control-label">角色类型:</label>\
            <div class="col-sm-8"> <br/>'
            + role_option +
            '</div>\
        </div>\
        ';

    function ok_callback() {
        username = $("#u_username").val();
        password = $("#u_password").val();
        truename = $("#u_truename").val();
        department = $("#u_department").val();
        duty = $("#u_duty").val();
        var role_list = [];
        $('[name=uuitem]:checkbox:checked').each(function () {

            role_list.push($(this).val())
        })
        //console.log("===="+role_list);
        if(!username){
            showTransientDialog("用户名不能为空");
            return false;
        }else if(!password){
            showTransientDialog("密码不能为空");
            return false;
        }else if(role_list.length == 0){
            showTransientDialog("请选择赋予角色的权限");
            return false;
        }else{
            var url = "/user-manager/update-user";
            var params = {
                "userid" : userid,
                "username" : username,
                "password" : password,
                "truename" : truename,
                "department" : department,
                "duty" : duty,
                "role_list" : role_list
            }
            var response = webRequest(url,"POST",false,params);
            if(response!=null && response.status==0){
                updateUserGrid($("#dropdownMenu_selectusertype").val(),$("#input_selectuseircontent").val());
                showTransientDialog("操作成功！");
                return true;
            }else{
                showTransientDialog(response.msg);
                return false;
            }
        }

    }

    showModalDialog(title, content, ok_callback);
}

// 表格初始化
$(function () {
   updateUserGrid($("#dropdownMenu_selectusertype").val(),$("#input_selectuseircontent").val());
});

//其它初始化
$(function(){

    //绑定增加角色事件
    $("#add_user").click(function () {
        showUserCreateDialog("创建用户信息")
    });

    // 删除用户绑定
    $("#delete_user").click(function() {
        function callback(){
            //       var grid = $("#watch-box-grid").data("kendoGrid");
            var user_checked_list = [];
            $("#user-grid").find("input:checked").each(function(){
                var user_id = this.value;
                user_checked_list.push(user_id)
            })

            if(user_checked_list.length<=0) return;

            var url = "/user-manager/delete";
            var params = {
                "user_checked_list": user_checked_list
            }
            var response = webRequest(url,"POST",false,params)
            if(response!=null && response.status==0){
                updateUserGrid($("#dropdownMenu_selectusertype").val(),$("#input_selectuseircontent").val());
                showTransientDialog("删除用户成功！");
            }else{
                showTransientDialog(response.msg);
            }
        }
        showAlertDialog("确定删除？",callback);
    });
});

function searchRole(userid){

    var d = dialog({
        title: '授权角色信息',
        content:   '<div id="searchrole-grid"></div>',
    });
    d.width(605).height(300).showModal();
    $(".ui-dialog-content").mCustomScrollbar({
        axis:"y",
        advanced:{autoExpandHorizontalScroll:true},
        theme:"minimal-dark"
    });

    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                type: "get",
                url: "/user-manager/search-role",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (options, operation) {

                if (operation == "read") {
                    var parameter = {
                        page: options.page,
                        pageSize: options.pageSize,
                        userid: userid
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

    $("#searchrole-grid").kendoGrid({
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
                title: "角色名称",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            },
            {
                field: "roledescription",
                title: "角色描述",
                headerAttributes:{ style:"text-align:center"},
                attributes:{ class:"text-center" }
            }
        ]
    });
}
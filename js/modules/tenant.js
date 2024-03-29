
$(function () {
    localStorage.setItem("mode", "all");
    /**  初始化租户列表  */
    $("#jqGrid").jqGrid({
        // url: baseURL + 'tenants?userId='+localStorage.getItem("userId"),
        url: baseURL + 'tenants?userId=' + userId ,
        datatype: "json",
        postData: {
            "mode": localStorage.getItem("mode"),
            "token": accessToken
        },
        colModel: [
            {label: '租户ID', name: 'id', align: 'center', hidden: true, width: 20, key: true ,sortable: false},
            {label: '租户名称', name: 'name', align: 'center', width: 80 ,sortable: false},
            {label: '平台模式', name: 'serviceMode', formatter:formatMode, align: 'center', width: 70 ,sortable: false},
            {label: '创建时间', name: 'createdTime', formatter:timeFormat, align: 'center', width: 150 ,sortable: false},
            {label: '修改时间', name: 'modifiedTime', formatter:timeFormat, align: 'center', width: 150 ,sortable: false},
            {label: '备注', name: 'description', align: 'center', width: 80 ,sortable: false},
            {label: '更改人', name: 'updatedByUserName', align: 'center', width: 80 ,sortable: false},
            {label: '操作', name: 'operation', align: 'center', width: 70 ,sortable: false}
        ],
        viewrecords: false,
        height: 385,
        rowNum: 10,
        rowList: [10, 30, 50],
        rownumbers: false,
        rownumWidth: 25,
        autowidth: true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader: {
            root: "list",
            page: "currPage",
            total: "totalPage",
            records: "totalCount"
        },
        prmNames: {
            page: "page",
            rows: "limit"
        },
        gridComplete: function () {
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
            // 设置表头居中
            $('.ui-jqgrid .ui-jqgrid-htable .ui-th-div').css('text-align', 'center');
            // checkBox 对齐
            $('.ui-jqgrid td input, .ui-jqgrid td select, .ui-jqgrid td textarea').css('margin-left', '6px');
            $("#jqGrid tr.jqgrow").each(function() {
                // console.log('this:', this);
                var TDs = $(this).find('td');
                TDs.addClass('middleTd');
                // var longTextTd = TDs.eq(5);
                // var text = longTextTd.text();
                // longTextTd.html('').html('<div class="longTextWraper">' + text + '</div>');
                // console.log($(this).find('td').eq(5).text());
                TDs.last().addClass('operationTd').append('<a class="btn btn-primary updateRoleBotton"><i class="fa fa-pencil-square-o"></i>&nbsp;修改</a>');
            });
            $('.updateRoleBotton').click(function(e) {
                e = e || window.event;
                var roleid = $($(e.currentTarget).parent().parent()[0]).attr('id');
                vm.update(roleid);
            });
        }
    });
});

//时间戳 转 Y-M-D
function timeFormat(cellvalue, options, row) {
    var date = new Date(cellvalue);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'; // 0-11月，0代表1月
    var D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
    var h = (date.getHours() < 10 ? '0' + (date.getHours()) + ':' : date.getHours() + ':');
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) + ':' : date.getMinutes() + ':');
    var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    return Y + M + D + "  " + h + m + s;
}

function formatMode(cellvalue, options, row) {
    if (cellvalue == "paas") {
        return "PaaS";
    } else if (cellvalue == "saas") {
        return "SaaS";
    } else {
        return cellvalue;
    }
}

/** 用户树 */
var appTree;
var appTreeSetting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "id"
        },
        key: {
            name: "name"
        }
    },
    check: {
        enable: true,
        nocheckInherit: true,
        chkboxType: {"Y": "", "N": ""}
    }
};

function forMatTime(time) {
    return new Date(time).Format('yyyy-MM-dd')
}

var vm = new Vue({
    el: '#garnetApp',
    data: {
        resources: resources,
        // isTenantNameEditable: null,
        // isTenantRemarkEditable: null,
        // isTenantRelatedUsersEditable: null,
        // isTenantReviewUsersEditable: null,
        // isTenantSelectAppEditable: null,
        tenantUpdateButton: false,
        relateUsersHidden: true, //默认关联所有用户
        relatedAllUserEditAble: false, //编辑时不可更改 是否默认关联所有用户
        modeEditAble: false, // 平台模式，是否可修改
        searchName: null,
        showList: true,
        title: null,
        userName:null,
        userNames:null,
        delRelatedUserNames:null,
        hidden:false,
        reviewHidden:true,
        tips:null,
        // placeholder:false, //选择应用框，根据选择模式的不同给出相对应的提示
        modeId: 1,// SAAS为0，PAAS为1
        mode: null,
        disabled: null,
        modeName: null,
        tenant: {
            name: null,
            relatedAllUsers: null,
            description: null,
            serviceMode: null,
            appIds: null,
            appNames: [],
            appIdList: []
        },
        // 选择模式列表
        modeList: {
            selectedMode: localStorage.getItem("mode"),
            options: [
                {
                    id : "all",
                    name : "全部"
                },
                {
                id : "saas",
                name : "平台模式-SaaS"
            },{
                id : "paas",
                name : "平台模式-PaaS"
            }]
        },
        // 新增和更新 选择模式列表
        modeList2: {
            // selectedMode: localStorage.getItem("mode"),
            selectedMode: "",
            options: [
                {
                    id : "saas",
                    name : "SaaS"
                },{
                    id : "paas",
                    name : "PaaS"
                }]
        }
    },
    mounted:function () {

        if (localStorage.getItem("mode") == "saas") {
            $("#selectModeId option[value='paas']").remove();
            $("#selectModeId option[value='all']").remove();
        } else if (localStorage.getItem("mode") == "paas") {
            $("#selectModeId option[value='all']").remove();
            $("#selectModeId option[value='saas']").remove();
        }
    },
    methods: {
        /**  查询按钮点击事件 */
        query: function () {
            vm.reload(true);
        },
        /**  新增按钮点击事件 */
        add: function () {
            var mode;
            if ("all" == localStorage.getItem("mode")) {
                mode = "paas";
                vm.tips = "可选多个应用";
                // vm.modeList2.selectedMode = mode;
            } else if ("paas" == localStorage.getItem("mode")) {
                mode = "paas";
                vm.tips = "可选多个应用";
                // vm.modeList2.selectedMode = mode;
            } else {
                vm.tips = "只能选择一个应用";
                mode = localStorage.getItem("mode");
            }

            // vm.isTenantNameEditable = true;
            // vm.isTenantRemarkEditable = true;
            // vm.isTenantRelatedUsersEditable = true;
            // vm.isTenantReviewUsersEditable = true;
            // vm.isTenantSelectAppEditable = true;
            vm.tenantUpdateButton = true;

            // vm.relatedAllUserEditAble = true; //是否默认关联所有用户 是否可编辑
            vm.showList = false;
            vm.modeList2.selectedMode = "";
            vm.hidden = false;  //平台模式选择，false是显示
            vm.modeEditAble = true; //平台模式选择是否可编辑
            vm.title = "新增";
            vm.userNames = null;
            vm.delRelatedUserNames = null;
            vm.reviewHidden = true;
            vm.tenant = {
                id: null,
                relatedAllUsers: 'N',
                name: null,
                description: null,
                updatedByUserName: null,
                appIds: null,
                appNames: [],
                appIdList: []
            };

            vm.dealModeList();
            vm.getRelatedAllUsersLevel("add");

            // 加载应用树
            // var queryOrTree = "tree";
            // $.get(baseURL + "applications?page=1&limit=1000&mode=" + mode + "&userId=" + userId + "&queryOrTree=" + queryOrTree, function (response) {
            //     appTree = $.fn.zTree.init($("#appTree"), appTreeSetting, response.list);
            //     appTree.expandAll(true);
            // });
        },
        /**  更新按钮点击事件 */
        update: function (tenantId) {
            vm.hidden = false;
            var mode;
            // vm.relatedAllUserEditAble = false; //是否默认关联所有用户  是否可编辑

            // if (resources.isTenantNameEditable == null || typeof resources.isTenantNameEditable == "undefined") {
            //
            // } else {
            //     vm.isTenantNameEditable = resources.isTenantNameEditable;
            //     vm.isTenantRemarkEditable = resources.isTenantRemarkEditable;
            //     vm.isTenantRelatedUsersEditable = resources.isTenantRelatedUsersEditable;
            //     vm.isTenantReviewUsersEditable = resources.isTenantReviewUsersEditable;
            //     vm.isTenantSelectAppEditable = resources.isTenantSelectAppEditable;
                // vm.tenantUpdateButton = resources.tenantUpdateButton;

            // console.log("tenant btn: " + vm.tenantUpdateButton);

            // }


            if ("all" == localStorage.getItem("mode")) {
                mode = "paas";
                vm.tips = "可选多个应用";
                vm.modeList2.selectedMode = mode;
            } else if ("paas" == localStorage.getItem("mode")) {
                mode = "paas";
                vm.tips = "可选多个应用";
                vm.modeList2.selectedMode = mode;
            } else {
                vm.tips = "只能选择一个应用";
                mode = localStorage.getItem("mode");
            }

            // var tenantId = getSelectedRow();
            if (!tenantId) {return;}

            vm.showList = false;
            vm.reviewHidden = false;
            vm.title = "修改";
            vm.tenant.description = null,
            vm.tenant.appIds = null;
            vm.tenant.appNames = [];
            vm.userName = null;
            vm.userNames = null;
            vm.delRelatedUserNames = null;
            vm.tenant.id = tenantId;
            vm.modeEditAble = false;

            vm.getTenant(tenantId);
            vm.getRelatedAllUsersLevel("update");
            //vm.getPermissionAction();
        },
        /**  删除按钮点击事件 */
        del: function () {
            var tenantIds = getSelectedRows();
            if (!tenantIds) {
                return;
            }
            window.parent.swal({
                    title: "确定要删除选中的记录？",
                    type: "warning",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    confirmButtonColor: "#DD6B55"
                },
                function () {
                    $.ajax({
                        type: "DELETE",
                        url: baseURL + "tenants?ids=" + tenantIds.toString() + "&token=" + accessToken,
                        contentType: "application/json",
                        dataType: "",
                        success: function () {
                            window.parent.swal("删除成功!", "", "success");
                            vm.reload(false);
                        },
                        error: function (response) {
                            window.parent.swal("删除失败!", getExceptionMessage(response), "error");
                        }

                    });
                });
        },
        /**  新增或更新确认 */
        saveOrUpdate: function () {
            // alert(JSON.stringify(vm.tenant));
            var obj = new Object();
            vm.tenant.updatedByUserName = localStorage.getItem("userName");

            if (vm.tenant.id == null) {
                //如果是新增租户，默认绑定登录用户
                vm.userName = localStorage.getItem("userName");
            }

            if (vm.tenant.relatedAllUsers == null || $.trim(vm.tenant.relatedAllUsers) == "") {
                vm.tenant.relatedAllUsers = "N";
            }

            var userName = vm.userName;
            obj.loginUserId = userId;
            obj.tenant = vm.tenant;
            obj.appIds =vm.tenant.appIds;
            obj.userTenants = [];
            obj.userName = userName;
            obj.userNames = vm.userNames;
            obj.delRelatedUserNames = vm.delRelatedUserNames;
            var appIdList = vm.tenant.appIdList;

            // alert(JSON.stringify(obj));
            if(vm.tenant.name == null || $.trim(vm.tenant.name) == ""){
                window.parent.swal("", "租户名称不能为空", "warning");
                return;
            }

            if (vm.tenant.name.length > 30) {
                window.parent.swal("", "租户名称长度不能大于30", "warning");
                return;
            }

            const regExp = /^[-_a-z0-9\u4e00-\u9fa5]+$/gi;//中英文、数字、- _
            if (!regExp.test(vm.tenant.name)) {
                window.parent.swal("", "租户名称不能包含空格或特殊字符", "warning");
                return;
            }
            
            var mode = vm.modeList2.selectedMode;

            if (mode == null) {
                vm.mode = vm.modeList.selectedMode;
                localStorage.setItem("mode", vm.mode)
            }

            if(mode == "saas") {  //saas
                vm.tenant.serviceMode = "saas";
                if (appIdList != null && appIdList.length > 1) {
                    window.parent.swal("", "当前模式不能添加多个应用", "warning");
                    return;
                }
                // console.log("my modeId is : " + vm.modeId);
            } else if(mode == "paas") {
                vm.tenant.serviceMode = "paas";
            } else {
                // swal({
                //     title: "当前默认为PAAS模式，是否确认添加",
                //         type: "warning",
                //     showCancelButton: true,
                //     closeOnConfirm: false,
                //     confirmButtonText: "确认",
                //     cancelButtonText: "取消",
                //     confirmButtonColor: "#DD6B55"
                // }, function () {
                //     $.ajax({
                //         type: obj.tenant.id === null ? "POST" : "PUT",
                //         url: baseURL + "tenants?token=" + accessToken ,
                //         contentType: "application/json",
                //         data: JSON.stringify(obj),
                //         dataType: "",
                //         success: function () {
                //             vm.reload(false);
                //             swal("操作成功!", "", "success");
                //         },
                //         error: function (response) {
                //             swal(response.responseJSON.data.errorResponseMessage, "",  "error");
                //         }
                //     });
                // });
                window.parent.swal("", "请选择正确模式", "warning");
                return;
            }

            $.ajax({
                type: obj.tenant.id === null ? "POST" : "PUT",
                url: baseURL + "tenants?token=" +　accessToken,
                contentType: "application/json",
                data: JSON.stringify(obj),
                dataType: "",
                success: function () {
                    vm.reload(false);
                    window.parent.swal("操作成功!", "", "success");
                },
                error: function (response) {
                    window.parent.swal("", getExceptionMessage(response),  "error");
                }
            });

        },
        /**  根据ID获取租户信息 */
        getTenant: function (tenantId) {
            $.get(baseURL + "tenants/" + tenantId + "?token=" +　accessToken, function (response) {

                response=response.data;
                var mode;
                if (response) {
                    vm.tenant.id = response.tenant.id;
                    vm.tenant.name = response.tenant.name;
                    vm.tenant.description = htmlDecode(response.tenant.description); // "&lt;" --> "<"
                    vm.tenant.createdTime = response.tenant.createdTime;
                    vm.tenant.modifiedTime = response.tenant.modifiedTime;
                    vm.tenant.relatedAllUsers = response.tenant.relatedAllUsers;
                    vm.tenant.appIdList = response.appIdList;
                    vm.modeList2.selectedMode = response.tenant.serviceMode;

                    // console.log("relatedallusers: " + vm.tenant.relatedAllUsers);

                    $.each(response.appNameList, function (index, item) {
                        vm.tenant.appNames.push(item);
                    })

                    mode = response.tenant.serviceMode;
                    if (mode == "saas") {
                        vm.modeId = 0;
                    } else if (mode == "paas") {
                        vm.modeId = 1;
                    } else {
                        vm.modeId = -1;
                    }
                }

                // 加载应用树
                var queryOrTree = "tree";
                $.get(baseURL + "applications?page=1&limit=1000&mode=" + mode + "&userId=" + userId + "&queryOrTree=" + queryOrTree, function (response) {
                    appTree = $.fn.zTree.init($("#appTree"), appTreeSetting, response.list);
                    appTree.expandAll(true);
                });
            });
        },
        /**  应用树点击事件 */
        appTree: function (tenant) {
            $('#laySearchName').val('');
            vm.getAppList('').then(result => {
                $.each(tenant.appIdList, function (index, item) {
                    var node = appTree.getNodeByParam("id", item);
                    if (node == null) {
                        console.log("应用树点击事件 null");
                        return;
                    }
                    appTree.checkNode(node, true, false);
                });

                var title;
                // console.log("vm.mode : " + JSON.stringify(vm.modeList2.selectedMode));
                if (vm.modeList2.selectedMode == "paas") {
                    title = "选择应用（可选多个）";
                } else if (vm.modeList2.selectedMode == "saas") {
                    title = "选择应用（只能选择一个）";
                }

                layer.open({
                    type: 1,
                    offset: '50px',
                    skin: 'layui-layer-molv',
                    title: title,
                    area: ['300px', '450px'],
                    shade: 0.3,
                    shadeClose: false,
                    zIndex:1,
                    // content: '<div id="appLayerDiv"><div id="appLayer" style="">    <!--<form class="form-horizontal" style="width: 280px;">-->        <div class="form-group">            <div class="col-sm-10">                <input class="form-control" placeholder="应用名" id="laySearchName" autocomplete="off">            </div>            <div class="col-sm-2">                <input type="button" class="btn btn-default"  id="laySearch" value="search"/>            </div>        </div>        <div class="form-group" style="padding-top: 20px;">            <ul id="appTree" class="ztree"></ul>        </div>    <!--</form>--></div></div>',
                    content: jQuery("#appLayer"),
                    // content:"<div id='displayDiv'>324234324</div>",
                    btn: ['确定', '取消'],
                    btn1: function (index) {
                        // 勾选已有应用
                        // 获取应用树选择的应用
                        var appNodes = appTree.getCheckedNodes(true);
                        var appIdList = [];
                        vm.tenant.appNames = [];
                        vm.tenant.appIds = null;

                        for (var i = 0; i < appNodes.length; i++) {
                            appIdList.push(appNodes[i].id);
                            vm.tenant.appNames.push(appNodes[i].name);
                        }
                        vm.tenant.appIds = appIdList.join(", ");
                        vm.tenant.appIdList = appIdList;
                        layer.close(index);
                    }
                });
                // window.parent.document.getElementById("displayDiv").innerText = "HelloHello~";
                // console.log($('#appLayer').html());
                // $('#displayDiv', window.parent.document).append(jQuery('#appLayer'));
                $('#laySearch').on("click", function () {
                    var searchName = $('#laySearchName').val();
                    vm.getAppList(searchName).then(result => {
                        $.each(tenant.appIdList, function (index, item) {
                            var node = appTree.getNodeByParam("id", item);
                            if (node == null) {
                                console.log("应用树点击事件 null");
                                return;
                            }
                            appTree.checkNode(node, true, false);
                        });
                    });
                });
            });
        },
        getAppList: function (searchName) {
            // 加载应用树
            return new Promise(resolve => {
                var queryOrTree = "tree";
                $.get(baseURL + "applications?page=1&limit=1000&mode=" + vm.modeList2.selectedMode + "&userId=" + userId + "&queryOrTree=" + queryOrTree + "&searchName=" + searchName, function (response) {
                    appTree = $.fn.zTree.init($("#appTree"), appTreeSetting, response.list);
                    appTree.expandAll(true);
                    resolve('done');
                });
            });
        },
        //模式选择事件
        selectMode: function () {
            if ("all" == vm.modeList.selectedMode) {
                vm.modeList2.selectedMode == "paas";
            } else {
                vm.modeList2.selectedMode = vm.modeList.selectedMode;
            }
            vm.mode = vm.modeList.selectedMode
            localStorage.setItem("mode", vm.mode);
            vm.reload(true);
        },
        //模式选择事件
        selectMode2: function () {
            vm.mode = vm.modeList2.selectedMode;
            localStorage.setItem("mode", vm.mode);
            vm.modeList.selectedMode = vm.mode;

            vm.tenant.appNames = null;
            vm.tenant.appIds = null;
            vm.tenant.appIdList = null;

            if (vm.mode == "paas") {
                vm.tips = "可选多个应用";
            } else if (vm.mode == "saas") {
                vm.tips = "只能选择一个应用";
            }
            // 加载应用树
            var queryOrTree = "tree"
            $.get(baseURL + "applications?page=1&limit=1000&mode=" + vm.mode + "&userId=" + userId + "&queryOrTree=" + queryOrTree, function (response) {
                appTree = $.fn.zTree.init($("#appTree"), appTreeSetting, response.list);
                appTree.expandAll(true);

            });
        },
        reviewUser: function () {

            var delRelatedTenantUser;

            delRelatedTenantUser = '<div class="form-group" style="padding:10px;">\n' +
                '            <div class="col-sm-10">\n' +
                '                <input class="form-control" placeholder="解绑用户，可用“,”分隔" id="layDelRelatedUserNames" autocomplete="off">\n' +
                '            </div>\n' +
                '            <div class="col-sm-2">\n' +
                '                <input type="button" class="btn btn-default"  id="layDelRelated" value="确认"/>\n' +
                '            </div>\n' +
                '        </div>';


            // if (!vm.tenantUpdateButton) {
            //     table = '<div style="position: relative;padding-top: 10px;">' + vm.createLayerTable() + '</div>';
            // } else {
            //     table = delRelatedTenantUser + '<div style="position: relative;padding-top: 10px;">' + vm.createLayerTable() + '</div>';
            // }
            new Promise(vm.createLayerTable).then(function(table) {

                var tableContent = delRelatedTenantUser +
                    '<div style="position: relative;padding-top: 10px;" id="layTableContainer">' + table + '</div>';

                // top.layer.open({
                layer.open({
                    type: 1,
                    title: "已绑定的账号",
                    area: ['300px', '400px'],
                    closeBtn: 0,
                    shade: 0.3,
                    zIndex: 1,
                    shadeClose: false,
                    // anim: 1,
                    skin: 'layui-layer-molv',
                    content: tableContent,
                    btn: ['返回'],
                    btn1: function (index) {
                        // top.location.reload();
                        // top.layer.close(index);
                        layer.close(index);
                    }
                });

                // $('#layDelRelated', window.parent.document).on("click", function () {
                $('#layDelRelated').on("click", function () {
                    vm.delRelatedTenantUser();
                });
            });

        },
        /*生成绑定用户表格*/
        createLayerTable: function (resolve) {
            var userNameList;
            var content;
            var table;
            var arr = new Array();

            $.get(baseURL + "tenants/usernames/" + vm.tenant.id, function (response) {

                if (!response) {
                    userNameList = [];
                }
                userNameList = response.data;

                if (userNameList != null && userNameList.length > 0) {
                    for (var i=0; i<userNameList.length; i ++) {
                        var num = i + 1;
                        var content1 = '<tr align="center"><td width="300" height="30">'+ num +'</td><td width="300" height="30">'+ userNameList[i] +'</td></tr>';
                        arr.push(content1);
                    }
                    content = arr.join("");
                } else {
                    content = "";
                }

                table =
                    '<table border="1" style="margin: 10px;">' +
                    '<tr align="center"><td width="300" height="30">序号</td><td width="300" height="30">用户名</td></tr>' +
                    content + '</table>';

                resolve(table);
            });

            // return table;
        },
        /*解绑用户*/
        delRelatedTenantUser: function () {
            // var userName = $('#layDelRelatedUserNames', window.parent.document).val();
            var userName = $('#layDelRelatedUserNames').val();

            $.ajax({
                type: "DELETE",
                url: baseURL + "/tenants/delrealted/" + vm.tenant.id +"?userNames=" + userName + "&token=" + accessToken,
                contentType: "application/json",
                dataType: "",
                success: function () {

                    new Promise(vm.createLayerTable).then(function(table) {
                        $('#layTableContainer').html(table);
                    });

                    // $('#layTable', window.parent.document).html(
                    /* $('#layTableContainer').html(
                        vm.createLayerTable()
                    ); */

                    // $('#layDelRelated').on("click", function () {
                    //     vm.delRelatedTenantUser();
                    // });
                },
                error: function (response) {
                    window.parent.swal("解绑失败!", getExceptionMessage(response), "error");
                }

            });

        },
        dealModeList: function () {
            // $("#modeListId option[value='paas']").remove();
            var path = "/garnet/option/tenantManage/platformTypes";
            $.get(baseURL + "/resources/gettype?userId=" + userId + "&path=" + path, function (response) {
                var type = response.data;

                if (type == "01") {
                    //只有SaaS
                    $("#modeListId option[value='paas']").remove();
                } else if (type == "10"){
                    //只有PaaS
                    $("#modeListId option[value='saas']").remove();
                }
            });
        },
        //默认关联所有用户选项，0 不可见 1 编辑时不可修改 2 可修改
        getRelatedAllUsersLevel: function (value) {
            var path = "/garnet/option/tenantManage/userRelation";
            $.get(baseURL + "/resources/getrelateduserlevel?userId=" + userId + "&path=" + path, function (response) {
                var relatedAllUsersLevel = response.data;
                // console.log("relatedAllUsersLevel: " + relatedAllUsersLevel);
                if (value == "add") {
                    if (relatedAllUsersLevel == 0) {
                        vm.relateUsersHidden = true;
                    } else {
                        vm.relateUsersHidden = false;
                        vm.relatedAllUserEditAble = true;
                    }
                } else {
                    if (relatedAllUsersLevel == 0) {
                        vm.relateUsersHidden = true;
                    } else if (relatedAllUsersLevel == 1) {
                        vm.relateUsersHidden = false;
                        vm.relatedAllUserEditAble = false;
                    } else if (relatedAllUsersLevel == 2) {
                        vm.relateUsersHidden = false;
                        vm.relatedAllUserEditAble = true;
                    }
                }

            });
        },
        getPermissionAction: function () {
            var type;
            var path = "/garnet/option/tenantManage/platformTypes";
            $.get(baseURL + "/resources/gettype?userId=" + userId + "&path=" + path, function (response) {
                type = response.data;
            });
            var path1 = path + "/" + type;
            // console.log("path1：" + path1);
            $.get(baseURL + "/resources/getuseraction?userId=" + userId + "&path=" + path1, function (response) {
                var action = response.data;
                console.log("action: " + action);
                if (action == "read") {
                    vm.hidden = false;
                    vm.modeEditAble = false;
                } else {
                    vm.hidden = false;
                    vm.modeEditAble = true;
                }
            });
        },
        reload: function (backFirst) {
            vm.showList = true;
            var page;
            if(backFirst) {
                page = 1;
            }else {
                page = $("#jqGrid").jqGrid('getGridParam', 'page');
            }
            $("#jqGrid").jqGrid('setGridParam', {
                postData: {
                    'searchName': vm.searchName,
                    'mode' : localStorage.getItem("mode")
                },
                page: page,

            }).trigger("reloadGrid");
        }
    }
});
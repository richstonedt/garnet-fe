
$(function () {

    /** 初始化角色列表 */
    $("#jqGrid").jqGrid({
        url: baseURL + 'resources',
        datatype: "json",
        colModel: [
            {
                label: '资源ID',
                name: 'id',
                align: 'center',
                hidden: true,
                index: "id",
                width: 20,
                key: true,
                sortable: false
            },
            // {label: '应用名称', name: 'applicationName', align: 'center', width: 40 ,sortable: false},
            {label: '资源名称', name: 'name', align: 'center', width: 170, sortable: false},
            {label: '路径标识', name: 'path', align: 'center', width: 150, sortable: false},
            {label: '创建时间', name: 'createdTime', formatter:timeFormat, align: 'center', width: 100 ,sortable: false},
            {label: '修改时间', name: 'modifiedTime', formatter:timeFormat, align: 'center', width: 100 ,sortable: false},
            {label: '更改人', name: 'updatedByUserName', align: 'center', width: 60},
            {label: '操作', name: 'operation', align: 'center', width: 70 ,sortable: false}
        ],
        viewrecords: true,
        height: 385,
        rowNum: 10,
        rowList: [10, 30, 50, 100],
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
        postData: {
            userId: userId,
            token: accessToken
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

/** 资源结构树 */
var resourceTree;
var resourceTreeSetting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "code",
            pIdKey: "parentCode",
            rootPId: "root"
        },
        key: {
            url: "nourl",
            name: "name"
        }
    }
};

/** 访问权限结构树 */
var apiTree;
var apiTreeSetting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "apiId",
            pIdKey: "parentId",
            rootPId: -1
        },
        key: {
            url: "nourl",
            name: "name"
        }
    },
    check: {
        enable: true,
        nocheckInherit: true,
        chkboxType: {"Y": "s", "N": "s"}
    }
};

var vm = new Vue({
    el: '#garnetApp',
    data: {
        resources: resources,
        typesEditAble: false, //类型选择框是否可编辑
        showType: false,
        showTenant: false, //显示租户下拉框
        showApplication: false, //显示应用下拉框
        test: null,
        actionsEdit: null,
        actionsReadonly: null,
        showResourceDetail: false,
        resourceDetail: null,
        searchType: null,
        searchApp: null,
        searchTenant: null,
        name: null,
        searchName: null, //根据名称搜索
        showList: true,
        showList1: true,
        showParentCode: false,
        title: null,
        tenantListInited: false,
        appListInited: false,
        resourceDynamicPropertyList: [],
        filedNames: [],
        resource: {
            id: null,
            name: null,
            remark: null,
            code: null,
            actions: null,
            parentCode: null,
            parentName: null,
            applicationId: null,
            tenantId: null,
            type: null,
            updatedByUserName: null,
            varchar00: null,
            varchar01: null,
            varchar02: null,
            varchar03: null,
            varchar04: null,
            varchar05: null,
            varchar06: null,
            varchar07: null,
            varchar08: null,
            varchar09: null,
            varchar10: null,
            varchar11: null,
            varchar12: null,
            varchar13: null,
            varchar14: null,
            varchar15: null,
            varchar16: null,
            varchar17: null,
            varchar18: null,
            varchar19: null,
            int01: null,
            int02: null,
            int03: null,
            int04: null,
            int05: null,
            boolean01: null,
            boolean02: null,
            boolean03: null,
            boolean04: null,
            varchar00description: null,
            varchar01description: null,
            varchar02description: null,
            varchar03description: null,
            varchar04description: null,
            varchar05description: null,
            varchar06description: null,
            varchar07description: null,
            varchar08description: null,
            varchar09description: null,
            varchar10description: null,
            varchar11description: null,
            varchar12description: null,
            varchar13description: null,
            varchar14description: null,
            varchar15description: null,
            varchar16description: null,
            varchar17description: null,
            varchar18description: null,
            varchar19description: null,
            int01description: null,
            int02description: null,
            int03description: null,
            int04description: null,
            int05description: null,
            boolean01description: null,
            boolean02description: null,
            boolean03description: null,
            boolean04description: null,
            orderNum: 0
        },

        // 应用列表数据
        appList: {
            selectedApp: "",
            options: []
        },
        // 搜索框应用列表数据
        appSearchList: {
            selectedApp: "",
            options: [
                {
                    id : "",
                    name : "全部"
                }
            ]
        },
        // 租户表数据
        tenantList: {
            selectedTenant: "",
            options: []
        },
        // 搜索框租户列表数据
        tenantSearchList: {
            searchTenant: "",
            options: [
                {
                    id : "",
                    name : "全部"
                }
            ]
        },
        // 资源配置类型数据
        typeList: {
            selectedType: "",
            options: []
        },
        // 搜索资源配置类型数据
        typeSearchList: {
            searchType: "",
            options: [
                {
                    id : "",
                    name : "全部"
                }
            ]
        },
        // 类型列表数据
        typeList1: {
            selectedType: "",
            options: [
                {
                    id : "1",
                    name : "租户"
                },
                {
                    id : "2",
                    name : "应用"
                },
                {
                    id : "3",
                    name : "租户+应用"
                }]
        },
        option: {
            applicationId: 1,
            appSearchId: ""
        },
        searchTypeOption: {
            searchType: ""
        }
    },
    mounted: function () {

        for (var i = 0; i < 20; i++) {
            var p = new Object();
            p.description = '';
            p.filedName = 'varchar0' + i;
            this.resourceDynamicPropertyList.push(p);

        }

        for (var i = 1; i < 6; i++) {
            var property = new Object();
            property.description = '';
            property.filedName = 'int0' + i;
            this.resourceDynamicPropertyList.push(property);
        }

        for (var i = 1; i < 5; i++) {
            var property = new Object();
            property.description = '';
            property.filedName = 'boolean0' + i;
            this.resourceDynamicPropertyList.push(property);
        }
    },
    methods: {
        /**  查询按钮点击事件 */
        query: function () {
            vm.reload(true);
        },
        //查看按钮
        view: function () {

            if (vm.searchType == null || vm.searchType == "" || vm.searchApp == null || vm.searchApp == "") {
                window.parent.swal("", "请同时选择应用和类型以查看配置", "warning");
                return;
            }

            $.get(baseURL + "resources/byappandtype?applicationId=" + vm.searchApp + "&type=" + vm.searchType, function (response) {
                vm.resourceDetail = JSON.stringify(response, null, "\t");
            });
            vm.showList = false;
            vm.showList1 = true;
            vm.showResourceDetail = true;

        },
        //查看资源详情返回
        resourceDetailReturn: function () {
            vm.showList = true;
            vm.showList1 = true;
            vm.showResourceDetail = false;
        },
        //导入Excel
        inputExcel: function () {
            $('#file').click();
        },
        importFile: function (ele) {
            var file = document.getElementById("file").files[0];
            var formData = new FormData();
            formData.append('file', file);    // 将文件转成二进制形式

            $.ajax({
                type: "POST",
                url: baseURL + "/upload/resourceexcel",
                processData: false,
                contentType: false,
                data: formData,
                // dataType: "",
                success: function (result) {
                    vm.reload(false);
                    window.parent.swal("", "导入Resource成功", "success");
                },
                error: function (result) {

                    // console.log("import result == " + JSON.stringify(result));

                    if (result.status == 200 && result.readyState == 4) {
                        window.parent.swal("", "导入Resource成功", "success");
                        vm.reload(false);
                    } else {
                        window.parent.swal("导入Resource失败", getExceptionMessage(result), "error");
                        // swal("导入Resource失败", "", "error");
                    }
                }
            });

            //重新选择同一个文件的时候，可以重复上传
            $('#file').val('');
        },
        //下载Excel模板
        downloadExcel:function () {
            document.getElementById("downloadExcel").href = baseURL + "download/resourceexcel";
            document.getElementById("downloadExcel").click();
        },
        /**  新增按钮点击事件 */
        add: function () {
            vm.showList = false;
            vm.showList1 = false;
            vm.showType = true;
            vm.typesEditAble = true;
            vm.showTenant = false;
            vm.showApplication = false;
            vm.title = "新增";
            vm.tenantList.selectedTenant = "";
            vm.tenantList.options = [];
            vm.typeList.selectedType = "";
            vm.typeList.options = [];
            vm.typeList1.selectedType = "";
            // vm.typeList1.options = [];
            vm.appList.selectedApp = "";//applicationList
            vm.appList.options = [];//applicationList
            vm.appSearchList.selectedApp = "";
            vm.appSearchList.options = [];
            vm.actionsEdit = false;
            vm.actionsReadonly = false;
            vm.resource = {
                id: null,
                applicationId: null,
                tenantId: null,
                type: null,
                name: null,
                orderNum: 0,
                status: 1
            };
            if (vm.option.appSearchId !== undefined && vm.option.appSearchId !== null && vm.option.appSearchId !== "") {
                vm.resource.applicationId = vm.option.appSearchId;
            }

            // vm.getTypeList();
            vm.getResourceDynamicPropertyByType();

            vm.dealTypeList();
            // vm.getResourceDynamicPropertyById();
            // vm.initTreesToAdd();
            // vm.loadResourceTree();
        },
        /**  更新按钮点击事件 */
        update: function (resourceId) {
            // var resourceId = getSelectedRow();

            if (!resourceId) {
                return;
            }
            vm.showList = false;
            vm.showList1 = false;
            vm.showType = true;
            vm.title = "修改";
            vm.tenantList.selectedTenant = "";
            vm.tenantList.options = [];
            vm.appList.selectedApp = "";//applicationList
            vm.appList.options = [];//applicationList
            vm.typeList.selectedType = "";
            vm.typeList.options = [];
            vm.actionsEdit = false;
            vm.actionsReadonly = false;
            vm.resource.type = null;
            vm.appSearchList.selectedApp = "";
            vm.appSearchList.options = [];
            // vm.resource.apiIdList = [];
            // vm.showParentCode = true;
            
            vm.getTenantList().then(function(){
                vm.initTreesToUpdate(resourceId).then(function(response){
                    vm.appList.selectedApp = response.applicationId;
                    vm.getTypeList().then(function(){
                        vm.typeList.selectedType = response.type;
                        vm.getAppList().then(function(){
                            vm.appList.selectedApp = response.applicationId;
                        });
                    });
                });
            });
            /* vm.getTenantList();
            vm.getAppList();
            vm.initTreesToUpdate(resourceId); */
            vm.getPermissionAction();
            // vm.loadResourceTree();
        },
        /**  删除按钮点击事件 */
        del: function () {
            var resourceIds = getSelectedRows();
            if (!resourceIds) {
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
                        url: baseURL + "resources?ids=" + resourceIds.toString(),
                        contentType: "application/json",
                        dataType: "",
                        success: function (result) {
                            if (!result.message) {
                                window.parent.swal("删除成功!", "", "success");
                                vm.reload(false);
                            } else {
                                window.parent.swal("删除失败!", result.message, "error");
                            }
                            vm.reload(false);
                        },
                        error: function (result) {
                            window.parent.swal("删除失败!", getExceptionMessage(result), "error");
                        }
                    });
                });
        },
        /**  新增或更新确认 */
        saveOrUpdate: function () {

            // console.log(JSON.stringify(vm.actionsEdit) + " - " + JSON.stringify(vm.actionsReadonly));

            // if ((vm.actionsEdit == false && vm.actionsReadonly == false) || (vm.actionsEdit == null && vm.actionsReadonly == null)) {
            //     swal("", "行为组不能为空", "warning");
            //     return;
            // }

            if (vm.actionsEdit == true && vm.actionsReadonly == true) {
                vm.resource.actions = "edit;readonly";
            }
            if (vm.actionsReadonly == false && vm.actionsEdit == true) {
                vm.resource.actions = "edit";
            }
            if (vm.actionsEdit == false && vm.actionsReadonly == true) {
                vm.resource.actions = "readonly";
            }


            var obj = new Object();
            vm.resource.updatedByUserName = localStorage.getItem("userName");
            // obj.typeId = vm.typeList.selectedType;
            obj.resource = vm.resource;
            obj.resource.type = vm.typeList.selectedType;
            obj.resource.tenantId = vm.tenantList.selectedTenant;
            obj.resource.applicationId = vm.appList.selectedApp;//applicationList

            // console.log("obj: " + JSON.stringify(obj));

            if (vm.resource.name == null || $.trim(vm.resource.name) == "") {
                window.parent.swal("", "资源名称不能为空", "warning");
                return;
            }

            if (vm.resource.remark == null || $.trim(vm.resource.remark) == "") {
                window.parent.swal("", "资源描述不能为空", "warning");
                return;
            }

            if ((obj.resource.applicationId == null || $.trim(obj.resource.applicationId) == "") && (obj.resource.tenantId == null || $.trim(obj.resource.tenantId) == "")) {
                window.parent.swal("", "请在选择类型后，选择租户或应用", "warning");
                return;
            }

            // if (obj.resource.tenantId == null || $.trim(obj.resource.tenantId) == "") {
            //     swal("", "租户不能为空", "warning");
            //     return;
            // }

            if (vm.resource.type == null || $.trim(vm.resource.type) == "") {
                window.parent.swal("", "资源类型不能为空", "warning");
                return;
            }

            if (vm.resource.path == null || $.trim(vm.resource.path) == "") {
                window.parent.swal("", "路径标识不能为空", "warning");
                return;
            }


            if (vm.resource.name.length > 60) {
                window.parent.swal("", "资源名称长度不能大于60", "warning");
                return;
            }

            if (vm.resource.path.length > 60) {
                window.parent.swal("", "路径标识长度不能大于60", "warning");
                return;
            }

            $.ajax({
                type: vm.resource.id === null ? "POST" : "PUT",
                url: baseURL + "resources",
                contentType: "application/json",
                data: JSON.stringify(obj),
                dataType: '',
                success: function () {
                    vm.reload(false);
                    window.parent.swal("操作成功!", "", "success");
                },
                error: function (response) {
                    window.parent.swal("", getExceptionMessage(response), "error");
                }
            });
        },
        /** 添加按钮初始化数据 */
        initTreesToAdd: function () {
            //加载访问权限树
            // $.get(baseURL + "/apis/applicationId/" + vm.resource.applicationId, function (response) {
            //     apiTree = $.fn.zTree.init($("#apiTree"), apiTreeSetting, response);
            //     apiTree.expandAll(false);
            // })
        },
        /** 更新按钮初始化数据 */
        initTreesToUpdate: function (resourceId) {
            return vm.getResourceById(resourceId);
        },
        /** 通过id 得到一个resource对象 */
        getResourceById: function (resourceId) {
            return new Promise(function(resolve){
                $.get(baseURL + "resources/" + resourceId, function (response) {
                    response = response.data;

                    vm.resource.id = response.id;
                    vm.resource.applicationId = response.applicationId;
                    vm.resource.name = response.name;
                    vm.resource.remark = response.remark;
                    vm.resource.path = response.path;
                    vm.resource.actions = response.actions;
                    vm.resource.status = response.status;
                    vm.appList.selectedApp = response.applicationId;//applicationList
                    vm.tenantList.selectedTenant = response.tenantId;
                    vm.resource.tenantId = response.tenantId;
                    vm.resource.type = response.type;
                    vm.typeList.selectedType = response.type;
                    // vm.resource.varchar00 = response.varchar00;
                    // vm.resource.varchar01 = response.varchar01;
                    // vm.resource.varchar02 = response.varchar02;
                    // vm.resource.varchar03 = response.varchar03;
                    // vm.resource.varchar04 = response.varchar04;
                    // vm.resource.varchar05 = response.varchar05;
                    // vm.resource.varchar06 = response.varchar06;
                    // vm.resource.varchar07 = response.varchar07;
                    // vm.resource.varchar08 = response.varchar08;
                    // vm.resource.varchar09 = response.varchar09;
                    // vm.resource.varchar10 = response.varchar10;
                    // vm.resource.varchar11 = response.varchar11;
                    // vm.resource.varchar12 = response.varchar12;
                    // vm.resource.varchar13 = response.varchar13;
                    // vm.resource.varchar14 = response.varchar14;
                    // vm.resource.varchar15 = response.varchar15;
                    // vm.resource.varchar16 = response.varchar16;
                    // vm.resource.varchar17 = response.varchar17;
                    // vm.resource.varchar18 = response.varchar18;
                    // vm.resource.varchar19 = response.varchar19;
                    // vm.resource.int01 = response.int01;
                    // vm.resource.int02 = response.int02;
                    // vm.resource.int03 = response.int03;
                    // vm.resource.int04 = response.int04;
                    // vm.resource.int05 = response.int05;
                    // vm.resource.boolean01 = response.boolean01;
                    // vm.resource.boolean02 = response.boolean02;
                    // vm.resource.boolean03 = response.boolean03;
                    // vm.resource.boolean04 = response.boolean04;

                    var action = response.actions;
                    if ("edit" == action) {
                        vm.actionsEdit = true;
                    } else if ("readonly" == action) {
                        vm.actionsReadonly = true;
                    } else if (action == null || action == "") {
                        vm.actionsReadonly = false;
                        vm.actionsEdit = false;
                    }
                    else {
                        vm.actionsReadonly = true;
                        vm.actionsEdit = true;
                    }

                    var selectedTenant = response.tenantId;
                    var selectedApp = response.applicationId;
                    if (selectedTenant == null || selectedTenant == 0) {
                        //应用级
                        vm.typeList1.selectedType = "2";
                        vm.tenantList.selectedTenant = "";
                        vm.appList.selectedApp = selectedApp;//applicationList
                        vm.showApplication = true;
                        vm.showTenant = false;
                    } else if (selectedApp == null || selectedApp == 0){
                        //租户级
                        vm.typeList1.selectedType = "1";
                        vm.appList.selectedApp = "";//applicationList
                        vm.tenantList.selectedTenant = selectedTenant;
                        vm.showTenant = true;
                        vm.showApplication = false;
                    } else {
                        vm.typeList1.selectedType = "3";
                        vm.appList.selectedApp = selectedApp;//applicationList
                        vm.tenantList.selectedTenant = selectedTenant;
                        vm.showApplication = true;
                        vm.showTenant = true;
                    }

                    vm.getTypeList();
                    vm.hideInput();
                    vm.getResourceDynamicPropertyByType();
                    // console.log(vm.filedNames);

                    for (var i=0; i<vm.filedNames.length; i++) {
                        if (vm.filedNames[i] == "varchar00") {
                            vm.resource.varchar00 = response.varchar00;
                        }

                        if (vm.filedNames[i] == "varchar01") {
                            vm.resource.varchar01 = response.varchar01;
                        }

                        if (vm.filedNames[i] == "varchar02") {
                            vm.resource.varchar02 = response.varchar02;
                        }

                        if (vm.filedNames[i] == "varchar03") {
                            vm.resource.varchar03 = response.varchar03;

                        }

                        if (vm.filedNames[i] == "varchar04") {
                            vm.resource.varchar04 = response.varchar04;

                        }

                        if (vm.filedNames[i] == "varchar05") {
                            vm.resource.varchar05 = response.varchar05;
                        }

                        if (vm.filedNames[i] == "varchar06") {
                            vm.resource.varchar06 = response.varchar06;
                        }

                        if (vm.filedNames[i] == "varchar07") {
                            vm.resource.varchar07 = response.varchar07;
                        }

                        if (vm.filedNames[i] == "varchar08") {
                            vm.resource.varchar08 = response.varchar08;
                        }

                        if (vm.filedNames[i] == "varchar09") {
                            vm.resource.varchar09 = response.varchar09;
                        }

                        if (vm.filedNames[i] == "varchar10") {
                            vm.resource.varchar10 = response.varchar10;
                        }

                        if (vm.filedNames[i] == "varchar11") {
                            vm.resource.varchar11 = response.varchar11;
                        }

                        if (vm.filedNames[i] == "varchar12") {
                            vm.resource.varchar12 = response.varchar12;
                        }

                        if (vm.filedNames[i] == "varchar13") {
                            vm.resource.varchar13 = response.varchar13;
                        }

                        if (vm.filedNames[i] == "varchar14") {
                            vm.resource.varchar14 = response.varchar14;
                        }

                        if (vm.filedNames[i] == "varchar15") {
                            vm.resource.varchar15 = response.varchar15;
                        }

                        if (vm.filedNames[i] == "varchar16") {
                            vm.resource.varchar16 = response.varchar16;
                        }

                        if (vm.filedNames[i] == "varchar17") {
                            vm.resource.varchar17 = response.varchar17;
                        }

                        if (vm.filedNames[i] == "varchar18") {
                            vm.resource.varchar18 = response.varchar18;
                            vm.resource.varchar19 = response.varchar19;
                        }

                        if (vm.filedNames[i] == "varchar19") {
                            vm.resource.varchar19 = response.varchar19;
                        }

                        if (vm.filedNames[i] == "int01") {
                            vm.resource.int01 = response.int01;
                        }

                        if (vm.filedNames[i] == "int02") {
                            vm.resource.int02 = response.int02;
                        }

                        if (vm.filedNames[i] == "int03") {
                            vm.resource.int03 = response.int03;
                        }

                        if (vm.filedNames[i] == "int04") {
                            vm.resource.int04 = response.int04;
                        }

                        if (vm.filedNames[i] == "int05") {
                            vm.resource.int05 = response.int05;
                        }

                        if (vm.filedNames[i] == "boolean01") {
                            vm.resource.boolean01 = response.boolean01;
                        }

                        if (vm.filedNames[i] == "boolean02") {
                            vm.resource.boolean02 = response.boolean02;
                        }

                        if (vm.filedNames[i] == "boolean03") {
                            vm.resource.boolean03 = response.boolean03;
                        }

                        if (vm.filedNames[i] == "boolean04") {
                            vm.resource.boolean04 = response.boolean04;
                        }
                    }

                    resolve(response);
                });
            });
        },
        /** 查询当前用户信息 */
        // getCurrentUser: function () {
        //     $.getJSON(baseURL + "token/userInfo?token=" + accessToken, function (response) {
        //         vm.currentUser = response;
        //     });
        // },
        /** 重新加载 */
        reload: function (backFirst) {
            vm.showList = true;
            vm.showList1 = true;
            var page;
            if (backFirst) {
                page = 1;
            } else {
                page = $("#jqGrid").jqGrid('getGridParam', 'page');
            }
            $("#jqGrid").jqGrid('setGridParam', {
                postData: {
                    searchName: vm.searchName,
                    applicationId: vm.searchApp,
                    tenantId: vm.searchTenant,
                    type: vm.searchType
                },
                page: page
            }).trigger("reloadGrid");
        },
        /** 应用列表onchange 事件*/
        selectApp: function () {
            if(!vm.appListInited)return;
            // vm.initTreesToAdd()
            // vm.typeList.selectedType = "";
            vm.getTypeList();
            vm.hideInput();
        },
        selectTenant: function () {
            if(!vm.tenantListInited)return;
            // vm.initTreesToAdd()
            vm.getTypeList();
            // vm.typeList.selectedType = "";
            vm.hideInput();

            // vm.appList.options = [];//applicationList
            // vm.appList.selectedApp = "";//applicationList
            vm.getAppList();
        },
        /** 资源配置类型列表onchange 事件*/
        selectType: function () {
            var type = vm.typeList.selectedType;
            vm.hideInput();
            vm.getResourceDynamicPropertyByType(type);
        },
        /** 类型列表onchange 事件*/
        selectType1: function () {
            vm.tenantList.selectedTenant = "";
            // vm.appList.selectedApp = "";//applicationList
            vm.typeList.options = [];
            vm.typeList.selectedType = "";
            vm.hideInput();

            var selectedType = vm.typeList1.selectedType;
            if (selectedType == 1) {
                //租户级
                vm.resource.applicationId = null;
                vm.resource.tenantId = null;
                vm.showTenant = true;
                vm.showApplication = false;

                vm.appList.options = [];//applicationList
                vm.tenantList.options = [];
                vm.getTenantList();
            } else if (selectedType == 2) {
                //应用级
                vm.resource.tenantId = null;
                vm.resource.applicationId = null;
                vm.showTenant = false;
                vm.showApplication = true;

                vm.appList.options = [];//applicationList
                vm.tenantList.options = [];
                vm.getAppList();
            } else {
                vm.resource.tenantId = null;
                vm.resource.applicationId = null;
                vm.showApplication = true;
                vm.showTenant = true;

                vm.appList.options = [];//applicationList
                vm.tenantList.options = [];
                vm.getTenantList();
            }
        },
        radioChecked: function (value) {
            // console.log(value);
            // console.log(JSON.stringify(vm.resource.boolean01));
        },
        //通过type和appId返回resource
        getResourceByTypeAndApp: function () {
            vm.searchType = vm.searchTypeOption.searchType;
            vm.searchApp = vm.option.appSearchId;
            vm.searchTenant = vm.tenantSearchList.searchTenant;
            if (typeof vm.searchType == "undefined") {
                vm.searchType = "";
            }
            // console.log("type: " + vm.searchType + " == applicationId: " + vm.searchApp);
            vm.reload(true);
        },
        /**
         * 根据租户id和应用id返回resources
         */
        getResourceByTeantIdAndAppId: function () {
            vm.searchType = vm.searchTypeOption.searchType;
            vm.searchApp = vm.option.appSearchId;
            vm.searchTenant = vm.tenantSearchList.searchTenant;
            vm.reload(true);
        },
        /**  获取租户列表 */
        getTenantList: function () {
            vm.tenantList.options = [];
            vm.tenantListInited = false;
            var path = "/garnet/data/resourceManage/tenantList";
            return new Promise(function(resolve){
                $.get(baseURL + "tenants/byuseridandpath?userId=" + userId + "&path=" + path, function (response) {
                    $.each(response.data, function (index, item) {
                        vm.tenantList.options.push(item);
                    });
                    vm.tenantListInited = true;
                    resolve('done');
                });
            });
        },
        /**  获取应用列表 */
        getAppList: function () {
            vm.appListInited = false;
            var tenantId = vm.tenantList.selectedTenant;
            var path = "/garnet/data/resourceManage/tenantList";
            return new Promise(function(resolve) {
                $.get(baseURL + "applications/byuseridandtenantid?userId=" + userId + "&tenantId=" + tenantId + "&path=" + path, function (response) {
                    vm.appList.options = [];
                    vm.appSearchList.options = [];
                    $.each(response, function (index, item) {
                        vm.appList.options.push(item);//applicationList
                        vm.appSearchList.options.push(item);
                    });
                    setTimeout(()=>{
                        vm.appListInited = true;
                    }, 500);
                    resolve('done');
                });
            });
        },
        getSearchAppList: function () {
            var path = "/garnet/data/resourceManage/tenantList";
            $.get(baseURL + "applications/byuseridandtenantid?userId=" + userId + "&path=" + path, function (response) {
                vm.appSearchList.options = [];
                $.each(response, function (index, item) {
                    vm.appList.options.push(item);//applicationList
                    vm.appSearchList.options.push(item);
                })
            });
        },
        getSearchTenantList: function () {
            var path = "/garnet/data/resourceManage/tenantList";
            $.get(baseURL + "tenants/byuseridandpath?userId=" + userId + "&path=" + path, function (response) {
                vm.tenantSearchList.options = [];
                $.each(response.data, function (index, item) {
                    // vm.tenantList.options.push(item);
                    // tenantList.tenantSearchList.options.push(item);
                    vm.tenantSearchList.options.push(item);
                })
            });
        },
        /**  获取类型列表 */
        getTypeList: function () {
            var selectTenant = vm.tenantList.selectedTenant;
            var selectApplication = vm.appList.selectedApp;//applicationList
            // $.get(baseURL + "resourcedynamicpropertys?page=1&limit=1000&userId=" + userId + "&tenantId=" + selectTenant + "&applicationId=" + selectApplication, function (response) {
            return new Promise(function(resolve){
                $.get(baseURL + "resourcedynamicpropertys/byparams?tenantId=" + selectTenant + "&applicationId=" + selectApplication, function (response) {
                    vm.typeList.options = [];
                    $.each(response, function (index, item) {
                        vm.typeList.options.push(item);
                    });
                    resolve('done');
                });
            });
        },
        getSearchTypeList: function () {
            $.get(baseURL + "resourcedynamicpropertys?page=1&limit=1000&userId=" + userId, function (response) {
                vm.typeSearchList.options = [];
                $.each(response.list, function (index, item) {
                    // typeList.typeSearchList.searchTypeOptions.push(item);
                    vm.typeSearchList.options.push(item)
                });
            });
        },
        //获取动态资源列表
        getResourceDynamicPropertyById: function (resourceDynamicPropertyId) {
            $.get(baseURL + "resourcedynamicpropertys/" + resourceDynamicPropertyId, function (response) {
                response = response.data;
                vm.resourceDynamicProperty.id = response.id;
                vm.resourceDynamicProperty.applicationId = response.applicationId;
                vm.resourceDynamicProperty.type = response.resourceDynamicProperty.type;
                vm.resourceDynamicPropertyList = response.resourceDynamicPropertyList;
                vm.appList.selectedApp = response.applicationId;
            });
        },
        hideInput: function () {

            vm.resource.varchar00 = '';
            vm.resource.varchar01 = '';
            vm.resource.varchar02 = '';
            vm.resource.varchar03 = '';
            vm.resource.varchar04 = '';
            vm.resource.varchar05 = '';
            vm.resource.varchar06 = '';
            vm.resource.varchar07 = '';
            vm.resource.varchar08 = '';
            vm.resource.varchar09 = '';
            vm.resource.varchar10 = '';
            vm.resource.varchar11 = '';
            vm.resource.varchar12 = '';
            vm.resource.varchar13 = '';
            vm.resource.varchar14 = '';
            vm.resource.varchar15 = '';
            vm.resource.varchar16 = '';
            vm.resource.varchar17 = '';
            vm.resource.varchar18 = '';
            vm.resource.varchar19 = '';
            vm.resource.int01 = null;
            vm.resource.int02 = null;
            vm.resource.int03 = null;
            vm.resource.int04 = null;
            vm.resource.int05 = null;
            vm.resource.boolean01 = null;
            vm.resource.boolean02 = null;
            vm.resource.boolean03 = null;
            vm.resource.boolean04 = null;

            $('#varchar00').hide();
            $('#varchar01').hide();
            $('#varchar02').hide();
            $('#varchar03').hide();
            $('#varchar04').hide();
            $('#varchar05').hide();
            $('#varchar06').hide();
            $('#varchar07').hide();
            $('#varchar08').hide();
            $('#varchar09').hide();
            $('#varchar10').hide();
            $('#varchar11').hide();
            $('#varchar12').hide();
            $('#varchar13').hide();
            $('#varchar14').hide();
            $('#varchar15').hide();
            $('#varchar16').hide();
            $('#varchar17').hide();
            $('#varchar18').hide();
            $('#varchar19').hide();
            $('#int01').hide();
            $('#int02').hide();
            $('#int03').hide();
            $('#int04').hide();
            $('#int05').hide();
            $('#boolean01').hide();
            $('#boolean02').hide();
            $('#boolean03').hide();
            $('#boolean04').hide();
        },
        //通过type获取动态资源列表的description
        getResourceDynamicPropertyByType: function () {

            vm.filedNames = [];
            var type = vm.typeList.selectedType;
            if (type == null || type == "") {
                vm.hideInput();
                return;
            }

            //通过type获取资源配置
            $.get(baseURL + "resourcedynamicpropertys/type/" + type, function (response) {
                response = response.data;
                vm.resourceDynamicPropertyList = response.resourceDynamicPropertyList;

                // console.log("item: " + JSON.stringify(response.resourceDynamicPropertyList));

                $.each(response.resourceDynamicPropertyList, function (index, item) {

                    if ("" + item.filedName == "varchar00") {
                        vm.resource.varchar00description = item.description;
                        $('#varchar001').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#varchar00').val('');
                            $('#varchar00').hide();
                            vm.resource.varchar00 = null;
                        } else {
                            $('#varchar00').show();
                            vm.filedNames.push("varchar00");
                        }
                    }

                    if ("" + item.filedName == "varchar01") {
                        vm.resource.varchar01description = item.description;
                        $('#varchar011').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#varchar01').val('');
                            $('#varchar01').hide();
                            vm.resource.varchar01 = null;
                        } else {
                            $('#varchar01').show();
                            vm.filedNames.push("varchar01");
                        }
                    }

                    if ("" + item.filedName == "varchar02") {
                        vm.resource.varchar02description = item.description;
                        $('#varchar021').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#varchar02').hide();
                            vm.resource.varchar02 = null;
                            $('#varchar02').val('');
                        } else {
                            $('#varchar02').show();
                            vm.filedNames.push("varchar02");
                        }
                    }

                    if ("" + item.filedName == "varchar03") {
                        vm.resource.varchar03description = item.description;
                        $('#varchar031').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#varchar03').hide();
                            vm.resource.varchar03 = null;
                            $('#varchar03').val('');
                        } else {
                            $('#varchar03').show();
                            vm.filedNames.push("varchar03");
                        }
                    }

                    if ("" + item.filedName == "varchar04") {
                        vm.resource.varchar04description = item.description;
                        $('#varchar041').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#varchar04').hide();
                            vm.resource.varchar04 = null;
                            $('#varchar04').val('');
                        } else {
                            $('#varchar04').show();
                            vm.filedNames.push("varchar04");
                        }
                    }

                    if ("" + item.filedName == "varchar05") {
                        vm.resource.varchar05description = item.description;
                        $('#varchar051').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#varchar05').hide();
                            vm.resource.varchar05 = null;
                            $('#varchar05').val('');
                        } else {
                            $('#varchar05').show();
                            vm.filedNames.push("varchar05");
                        }
                    }

                    if ("" + item.filedName == "varchar06") {
                        vm.resource.varchar06description = item.description;
                        $('#varchar061').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#varchar06').hide();
                            vm.resource.varchar06 = null;
                            $('#varchar06').val('');
                        } else {
                            $('#varchar06').show();
                            vm.filedNames.push("varchar06");
                        }
                    }

                    if ("" + item.filedName == "varchar07") {
                        vm.resource.varchar07description = item.description;
                        $('#varchar071').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#varchar07').hide();
                            vm.resource.varchar07 = null;
                            $('#varchar07').val('');
                        } else {
                            $('#varchar07').show();
                            vm.filedNames.push("varchar07");
                        }
                    }

                    if ("" + item.filedName == "varchar08") {
                        vm.resource.varchar08description = item.description;
                        $('#varchar081').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#varchar08').hide();
                            vm.resource.varchar08 = null;
                            $('#varchar08').val('');
                        } else {
                            $('#varchar08').show();
                            vm.filedNames.push("varchar08");
                        }
                    }

                    if ("" + item.filedName == "varchar09") {
                        vm.resource.varchar09description = item.description;
                        $('#varchar091').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#varchar09').hide();
                            vm.resource.varchar09 = null;
                            $('#varchar09').val('');
                        } else {
                            $('#varchar09').show();
                            vm.filedNames.push("varchar09");
                        }
                    }

                    if ("" + item.filedName == "varchar10") {
                        vm.resource.varchar10description = item.description;
                        $('#varchar101').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#varchar10').hide();
                            vm.resource.varchar10 = null;
                            $('#varchar10').val('');
                        } else {
                            $('#varchar10').show();
                            vm.filedNames.push("varchar10");
                        }
                    }

                    if ("" + item.filedName == "varchar11") {
                        vm.resource.varchar11description = item.description;
                        $('#varchar111').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#varchar11').hide();
                            vm.resource.varchar11 = null;
                            $('#varchar11').val('');
                        } else {
                            $('#varchar11').show();
                            vm.filedNames.push("varchar11");
                        }
                    }

                    if ("" + item.filedName == "varchar12") {
                        // console.log("varchar description: " + JSON.stringify(item.description));
                        vm.resource.varchar12description = item.description;
                        $('#varchar121').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#varchar12').hide();
                            vm.resource.varchar12 = null;
                            $('#varchar12').val('');
                        } else {
                            $('#varchar12').show();
                            vm.filedNames.push("varchar12");
                        }
                    }

                    if ("" + item.filedName == "varchar13") {
                        vm.resource.varchar13description = item.description;
                        $('#varchar131').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#varchar13').hide();
                            vm.resource.varchar13 = null;
                            $('#varchar13').val('');
                        } else {
                            $('#varchar13').show();
                            vm.filedNames.push("varchar13");
                        }
                    }

                    if ("" + item.filedName == "varchar14") {
                        vm.resource.varchar14description = item.description;
                        $('#varchar141').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#varchar14').hide();
                            vm.resource.varchar14 = null;
                            $('#varchar14').val('');
                        } else {
                            $('#varchar14').show();
                            vm.filedNames.push("varchar14");
                        }
                    }

                    if ("" + item.filedName == "varchar15") {
                        vm.resource.varchar15description = item.description;
                        $('#varchar151').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#varchar15').hide();
                            vm.resource.varchar15 = null;
                            $('#varchar15').val('');
                        } else {
                            $('#varchar15').show();
                            vm.filedNames.push("varchar15");
                        }
                    }

                    if ("" + item.filedName == "varchar16") {
                        vm.resource.varchar16description = item.description;
                        $('#varchar161').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#varchar16').hide();
                            vm.resource.varchar16 = null;
                            $('#varchar16').val('');
                        } else {
                            $('#varchar16').show();
                            vm.filedNames.push("varchar16");
                        }
                    }

                    if ("" + item.filedName == "varchar17") {
                        vm.resource.varchar17description = item.description;
                        $('#varchar171').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#varchar17').hide();
                            vm.resource.varchar17 = null;
                            $('#varchar17').val('');
                        } else {
                            $('#varchar17').show();
                            vm.filedNames.push("varchar17");
                        }
                    }

                    if ("" + item.filedName == "varchar18") {
                        vm.resource.varchar18description = item.description;
                        $('#varchar181').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#varchar18').hide();
                            vm.resource.varchar18 = null;
                            $('#varchar18').val('');
                        } else {
                            $('#varchar18').show();
                            vm.filedNames.push("varchar18");
                        }
                    }

                    if ("" + item.filedName == "varchar19") {
                        vm.resource.varchar19description = item.description;
                        $('#varchar191').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#varchar19').hide();
                            vm.resource.varchar19 = null;
                            $('#varchar19').val('');
                        } else {
                            $('#varchar19').show();
                            vm.filedNames.push("varchar19");
                        }
                    }

                    if ("" + item.filedName == "int01") {
                        vm.resource.int01description = item.description;
                        $('#int011').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#int01').hide();
                            vm.resource.int01 = null;
                            $('#int01').val('');
                        } else {
                            $('#int01').show();
                            vm.filedNames.push("int01");
                        }
                    }

                    if ("" + item.filedName == "int02") {
                        vm.resource.int02description = item.description;
                        $('#int021').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#int02').hide();
                            vm.resource.int02 = null;
                            $('#int02').val('');
                        } else {
                            $('#int02').show();
                            vm.filedNames.push("int02");
                        }
                    }

                    if ("" + item.filedName == "int03") {
                        vm.resource.int03description = item.description;
                        $('#int031').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#int03').hide();
                            vm.resource.int03 = null;
                            $('#int03').val('');
                        } else {
                            $('#int03').show();
                            vm.filedNames.push("int03");
                        }
                    }

                    if ("" + item.filedName == "int04") {
                        vm.resource.int04description = item.description;
                        $('#int041').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#int04').hide();
                            vm.resource.int04 = null;
                            $('#int04').val('');
                        } else {
                            $('#int04').show();
                            vm.filedNames.push("int04");
                        }
                    }

                    if ("" + item.filedName == "int05") {
                        vm.resource.int05description = item.description;
                        $('#int051').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#int05').hide();
                            vm.resource.int05 = null;
                            $('#int05').val('');
                        } else {
                            $('#int05').show();
                            vm.filedNames.push("int05");
                        }
                    }

                    if ("" + item.filedName == "boolean01") {
                        vm.resource.boolean01description = item.description;
                        $('#boolean011').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#boolean01').hide();
                            vm.resource.boolean01 = null;
                            $('#boolean01').val('');
                        } else {
                            $('#boolean01').show();
                            vm.filedNames.push("boolean01");
                        }
                    }

                    if ("" + item.filedName == "boolean02") {
                        vm.resource.boolean02description = item.description;
                        $('#boolean021').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#boolean02').hide();
                            vm.resource.boolean02 = null;
                            $('#boolean02').val('');
                        } else {
                            $('#boolean02').show();
                            vm.filedNames.push("boolean02");
                        }
                    }

                    if ("" + item.filedName == "boolean03") {
                        vm.resource.boolean03description = item.description;
                        $('#boolean031').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#boolean03').hide();
                            vm.resource.boolean03 = null;
                            $('#boolean03').val('');
                        } else {
                            $('#boolean03').show();
                            vm.filedNames.push("boolean03");
                        }
                    }

                    if ("" + item.filedName == "boolean04") {
                        vm.resource.boolean04description = item.description;
                        $('#boolean041').html(item.description);
                        if (item.description == null || item.description == "") {
                            $('#boolean04').hide();
                            vm.resource.boolean04 = null;
                            $('#boolean04').val('');
                        } else {
                            $('#boolean04').show();
                            vm.filedNames.push("boolean04");
                        }
                    }
                });
            });
        },
        dealTypeList: function () {
            var path = "/garnet/option/resourceManage/types";
            $.get(baseURL + "/resources/gettype?userId=" + userId + "&path=" + path, function (response) {
                var type =  response.data;
                // console.log(typeof type + ": " + type);
                if (type == "001") {
                    //应用级
                    $("#typeList option[value='1']").remove();
                    $("#typeList option[value='3']").remove();
                } else if (type == "010"){
                    //租户级
                    $("#typeList option[value='2']").remove();
                    $("#typeList option[value='3']").remove();
                } else if (type == "100") {
                    //租户+应用
                    $("#typeList option[value='1']").remove();
                    $("#typeList option[value='2']").remove();
                } else if (type == "011") {
                    //应用级、租户级
                    $("#typeList option[value='3']").remove();
                } else if (type == "101") {
                    //应用级、租户+应用
                    $("#typeList option[value='1']").remove();
                } else if (type == "110") {
                    //租户级、租户+应用
                    $("#typeList option[value='2']").remove();
                } else if (type == "111") {
                    //应用级、租户级、租户+应用
                } else {
                    $("#typeList option[value='1']").remove();
                    $("#typeList option[value='2']").remove();
                    $("#typeList option[value='3']").remove();
                }
            });

        },
        //加载资源树
        loadResourceTree: function () {

        },
        /**  资源树点击事件 */
        resourceTree: function () {
            vm.loadResourceTree();
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择资源",
                area: ['300px', '700px'],
                shade: 0,
                shadeClose: false,
                content: jQuery("#resourceLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                    var node = resourceTree.getSelectedNodes();
                    //选择上级部门
                    // console.log(JSON.stringify(node));
                    vm.resource.parentCode = node[0].code;
                    vm.resource.parentName = node[0].name;
                    vm.resource.code = node[0].code;
                    vm.resource.path = node[0].path + "/";
                    vm.showParentCode = true;
                    layer.close(index);
                }
            });
        },
        getPermissionAction: function () {
            var type;
            var path = "/garnet/option/resourceManage/types";
            $.get(baseURL + "/resources/gettype?userId=" + userId + "&path=" + path, function (response) {
                type = response.data;
            });
            var path1 = path + "/" + type;
            // console.log("path1：" + path1);
            $.get(baseURL + "/resources/getuseraction?userId=" + userId + "&path=" + path1, function (response) {
                var action = response.data;
                console.log("action: " + action);
                if (action == "read") {
                    vm.typesEditAble = false;
                } else {
                    vm.typesEditAble = true;
                }
            });
        }
    },
    /**  初始化页面时执行该方法 */
    created: function () {
        // this.getCurrentUser();
        // this.getAppList();
        this.getSearchTenantList();
        this.getSearchAppList();
        this.getSearchTypeList();
    }
});

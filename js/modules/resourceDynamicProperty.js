
$(function () {
    /** 初始化动态资源列表 */
    $("#jqGrid").jqGrid({
        url: baseURL + 'resourcedynamicpropertys',
        datatype: "json",
        colModel: [
            {label: '动态资源配置ID', name: 'id', align: 'center', hidden: true, index: "id", width: 20, key: true ,sortable: false},
            {label: '名称', name: 'name', align: 'center', width: 80 ,sortable: false},
            {label: '代号', name: 'type', align: 'center', width: 120, sortable: false},
            {label: '创建时间', name: 'createdTime', formatter:timeFormat, align: 'center', width: 120 ,sortable: false},
            {label: '修改时间', name: 'modifiedTime', formatter:timeFormat, align: 'center', width: 120 ,sortable: false},
            {label: '更改人', name: 'updatedByUserName', align: 'center', width: 80 ,sortable: false},
            {label: '操作', name: 'operation', align: 'center', width: 70 ,sortable: false}
        ],
        viewrecords: true,
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

var vm = new Vue({
    el: '#garnetApp',
    data: {
        resources: resources,
        name: null,
        showList: true,
        typesEditAble: false, //类型选择框是否可编辑
        showType: true, //类型选择下拉框是否显示
        showTenant: false, //显示租户下拉框
        showApplication: false, //显示应用下拉框
        showParentCode: false,
        count: 0, // 添加新的一行时，计数已经添加了多少行
        title: null,
        searchTenant: null,
        searchApp: null,
        searchName: null,
        tenantListinited: false,
        appListinited: false,
        resourceDynamicPropertyList : [],
        resourceDynamicProperty: {
            id: null,
            type: null,
            name: null,
            remark: null,
            actions: null,
            fieldName: null,
            description:null,
            tenantId: null,
            applicationId:null,
            orderNum: 0
        },
        option: {
            applicationId: 1,
            appSearchId: ""
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
        // 搜索租户表数据
        tenantSearchList: {
            searchTenant: "",
            options: [
                {
                    id : "",
                    name : "全部"
                }
            ]
        },
        // 类型列表数据
        typeList: {
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
        // 选择的输入框类型
        typeArray: {
            sArray: [],
            iArray: [],
            bArray: []
        },
    },
    mounted:function () {
        // this.initData();
    },
    methods: {
        initData:function () {
            for(var i=0; i<10;i++){
                var p = new Object();
                p.description = '';
                p.filedName= 'varchar0'+i;
                this.resourceDynamicPropertyList.push(p);
            }

            for(var i=10; i<20;i++){
                var p = new Object();
                p.description = '';
                p.filedName= 'varchar'+i;
                this.resourceDynamicPropertyList.push(p);
            }

            for(var i=1; i<6; i ++) {
                var property = new Object();
                property.description = '';
                property.filedName= 'int0'+i;
                this.resourceDynamicPropertyList.push(property);
            }

            for(var i=1; i<5; i ++) {
                var property = new Object();
                property.description = '';
                property.filedName= 'boolean0'+i;
                this.resourceDynamicPropertyList.push(property);
            }
        },

        /**  查询按钮点击事件 */
        query: function () {
            vm.reload(true);
        },
        /**  新增按钮点击事件 */
        add: function () {

            $('#tips').hide();
            $('#checkResourceDyPropType').hide();
            $('#checkResourceDyPropName').hide();

            vm.showList = false;
            vm.showType = true; //类型选择框是否可见
            vm.typesEditAble = true; //类型选择框是否编辑，默认可编辑
            vm.showApplication = false;
            vm.showTenant = false;
            vm.title = "新增";
            vm.count = 0;
            vm.appList.options = [];
            vm.appList.selectedApp = "";
            vm.appList.options = [];
            vm.appList.selectedApp = "";
            vm.tenantList.options = [];
            vm.tenantList.selectedTenant = "";
            vm.typeList.selectedType = "";
            vm.typeArray.sArray = [];
            vm.typeArray.iArray = [];
            vm.typeArray.bArray = [];

            vm.resourceDynamicPropertyList = [];
            vm.resourceDynamicProperty = {
                id: null,
                type: null,
                name: null,
                remark: null,
                actions: null,
                tenantId: "",
                applicationId: ""
            };

            //删除动态添加的输入框
            $("input[name='sdescriptions']").parent().parent().remove();
            $("input[name='idescriptions']").parent().parent().remove();
            $("input[name='bdescriptions']").parent().parent().remove();

            // this.initData();
            vm.getTenantList();
            vm.getAppList();
            // if(vm.option.appSearchId !== undefined && vm.option.appSearchId !== null && vm.option.appSearchId !== ""){
            //     vm.resource.applicationId = vm.option.appSearchId;
            // }
            //vm.getAppList();
            // vm.getTenantList();
            // vm.initTreesToAdd();
            // vm.loadResourceTree();
        },
        /**  更新按钮点击事件 */
        update: function (resourceDynamicPropertyId) {
            $('#checkResourceDyPropType').hide();
            $('#checkResourceDyPropName').hide();

            // var resourceDynamicPropertyId = getSelectedRow();
            if (!resourceDynamicPropertyId) {
                return;
            }

            $('#tips').show();

            //删除动态添加的输入框
            $("input[name='sdescriptions']").parent().parent().remove();
            $("input[name='idescriptions']").parent().parent().remove();
            $("input[name='bdescriptions']").parent().parent().remove();


            vm.showList = false;
            vm.showType = true;
            vm.title = "修改";
            vm.appList.options = [];
            vm.appList.selectedApp = "";
            vm.appList.options = [];
            vm.appList.selectedApp = "";
            vm.tenantList.options = [];
            vm.tenantList.selectedTenant = "";
            vm.typeArray.sArray = [];
            vm.typeArray.iArray = [];
            vm.typeArray.bArray = [];

            vm.getTenantList().then(function(){
                vm.initTreesToUpdate(resourceDynamicPropertyId).then(function(response){
                    vm.getAppList().then(function(){
                        vm.appList.selectedApp = response.resourceDynamicProperty.applicationId;
                        // console.log('vm.appList.options:', vm.appList.options);
                    });
                });
            });
            /* vm.getTenantList();
            vm.getAppList();
            vm.initTreesToUpdate(resourceDynamicPropertyId); */
            vm.getPermissionAction();
            // vm.loadResourceTree();
        },
        /**  删除按钮点击事件 */
        del: function () {
            var resourceIds = getSelectedRows();
            if (!resourceIds) {
                return;
            }

            new Promise(resolve => {
                $.get(baseURL + "resources/relate?ids=" + resourceIds + "&token=" + accessToken, function (response) {
                    let title;
                    if (response) {
                        title = "部分资源配置已被资源关联，删除后关联资源也将一并删除。是否确认删除？";
                    } else {
                        title = "确定要删除选中的记录";
                    }
                    resolve(title);
                });
            }).then(function(title) {
                window.parent.swal({
                    title: title,
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
                        url: baseURL + "resourcedynamicpropertys?ids=" + resourceIds.toString(),
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
            });
        },
        /**  新增或更新确认 */
        saveOrUpdate: function () {
            vm.resourceDynamicPropertyList = [];
            $("input[name='sdescriptions']").each(function (i,item) {
                var description = item.value;
                var ttype = vm.typeArray.sArray[i];
                // var ttype = item.attributes["ttype"].nodeValue;
                var object = new Object();
                object.filedName = ttype;
                object.description = description;
                vm.resourceDynamicPropertyList.push(object);
            });

            $("input[name='idescriptions']").each(function (i,item) {
                var description = item.value;
                var ttype = vm.typeArray.iArray[i];
                // var ttype = item.attributes["ttype"].nodeValue;
                var object = new Object();
                object.filedName = ttype;
                object.description = description;
                vm.resourceDynamicPropertyList.push(object);
            });

            $("input[name='bdescriptions']").each(function (i,item) {
                var description = item.value;
                var ttype = vm.typeArray.bArray[i];
                // var ttype = item.attributes["ttype"].nodeValue;
                var object = new Object();
                object.filedName = ttype;
                object.description = description;
                vm.resourceDynamicPropertyList.push(object);
            });


            // 获取访问权限树选择的访问权限
            var obj = new Object();
            vm.resourceDynamicProperty.updatedByUserName = localStorage.getItem("userName");
            vm.resourceDynamicProperty.tenantId = vm.tenantList.selectedTenant;
            vm.resourceDynamicProperty.applicationId = vm.appList.selectedApp;//applicationList
            obj.resourceDynamicProperty = vm.resourceDynamicProperty;
            obj.resourceDynamicPropertyList = vm.resourceDynamicPropertyList;

            if(vm.resourceDynamicProperty.name == null || $.trim(vm.resourceDynamicProperty.name) == "") {
                window.parent.swal("", "资源类型配置名称不能为空", "warning");
                return;
            }

            if(vm.resourceDynamicProperty.type == null || $.trim(vm.resourceDynamicProperty.type) == "") {
                window.parent.swal("", "资源类型配置代号不能为空", "warning");
                return;
            }

            //applicationList -> vm
            if ((vm.tenantList.selectedTenant == null || $.trim(vm.tenantList.selectedTenant) == "") && (vm.appList.selectedApp == null || vm.appList.selectedApp == "")) {
                window.parent.swal("", "请在选择类型后，选择租户或应用", "warning");
                return;
            }

            if (vm.typeList.selectedType != null && $.trim(vm.typeList.selectedType) != "") {
                var selectType = vm.typeList.selectedType;
                if (selectType == 1) {
                    //租户级
                    if (vm.resourceDynamicProperty.tenantId == null || $.trim(vm.resourceDynamicProperty.tenantId) == "") {
                        window.parent.swal("", "请选择租户", "warning");
                        return;
                    }
                } else if (selectType == 2) {
                    //应用级
                    if (vm.resourceDynamicProperty.applicationId == null || $.trim(vm.resourceDynamicProperty.applicationId) == "") {
                        window.parent.swal("", "请选择应用", "warning");
                        return;
                    }
                } else if (selectType == 3) {
                    //applicationList
                    if ((vm.tenantList.selectedTenant == null || $.trim(vm.tenantList.selectedTenant) == "") || (vm.appList.selectedApp == null || vm.appList.selectedApp == "")) {
                        window.parent.swal("", "租户和应用都不能为空", "warning");
                        return;
                    }
                }
            }


            if (vm.resourceDynamicProperty.type.length > 30) {
                window.parent.swal("", "资源类型配置名称长度不能大于30", "warning");
                return;
            }

            if(vm.resourceDynamicProperty.remark == null || $.trim(vm.resourceDynamicProperty.remark) == "") {
                window.parent.swal("", "备注不能为空", "warning");
                return;
            }

            if (vm.resourceDynamicProperty.actions == null || $.trim(vm.resourceDynamicProperty.actions) == "") {
                window.parent.swal("", "资源类型配置行为组不能为空", "warning");
                return;
            }

            var pattern = /^[a-zA-Z\,]{1,60}$/;
            if (!pattern.exec(vm.resourceDynamicProperty.actions)) {
                window.parent.swal("", "资源类型配置行为组只能输入英文和英文逗号", "warning");
                return;
            }

            /*检查名称和代号的唯一性开始*/
            var id = vm.resourceDynamicProperty.id || 0;
            var type = vm.resourceDynamicProperty.type;
            var name = vm.resourceDynamicProperty.name;

            const promiseCheckType = new Promise((resolve, reject) => {
                $.get(baseURL + "/resourcedynamicpropertys/checktype?type=" + type + "&id=" + id , function (response) {
                    response.data ? resolve(response.data) : reject('资源类型代号已被使用');
                });
            });

            const promiseCheckname = new Promise((resolve, reject) => {
                $.get(baseURL + "/resourcedynamicpropertys/checkname?name=" + name + "&id=" + id , function (response) {
                    response.data ? resolve(response.data) : reject('资源类型名称已被使用');
                });
            });

            Promise.all([promiseCheckType, promiseCheckname]).then(function(results) {
                const postResourceDynamicProperty = function () {
                    $.ajax({
                        type: vm.resourceDynamicProperty.id === null ? "POST" : "PUT",
                        url: baseURL + "resourcedynamicpropertys",
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
                };

                $.get(baseURL + "resources/relate?ids=" + id + "&token=" + accessToken, function (response) {
                    if(response) {
                        window.parent.swal(
                            {
                                title: "",
                                text: "该资源类型存在已关联资源配置，更新后请修改关联的资源",
                                type: "warning",
                                showCancelButton: true,
                                closeOnConfirm: false,
                                confirmButtonText: "确认",
                                cancelButtonText: "取消",
                                confirmButtonColor: "#DD6B55"
                            },
                            postResourceDynamicProperty
                        );
                    } else {
                        postResourceDynamicProperty();
                    }
                });
            }).catch(function(reason) {
                //资源类型代号已被使用 资源类型名称已被使用
                window.parent.swal("", reason, "warning");
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
        initTreesToUpdate: function (resourceDynamicPropertyId) {
            return vm.getResourceDynamicPropertyById(resourceDynamicPropertyId);
        },
        /** 通过id 得到一个resourcedynamicpropertys对象 */
        getResourceDynamicPropertyById: function (resourceDynamicPropertyId) {
            return new Promise(function(resolve){
                $.get(baseURL + "resourcedynamicpropertys/" + resourceDynamicPropertyId, function (response) {
                    response = response.data;

                    vm.resourceDynamicProperty.id = response.resourceDynamicProperty.id;
                    vm.resourceDynamicProperty.applicationId = response.resourceDynamicProperty.applicationId;
                    vm.resourceDynamicProperty.tenantId = response.resourceDynamicProperty.tenantId;
                    vm.resourceDynamicProperty.type = response.resourceDynamicProperty.type;
                    vm.resourceDynamicProperty.name = response.resourceDynamicProperty.name;
                    vm.resourceDynamicProperty.remark = response.resourceDynamicProperty.remark;
                    vm.resourceDynamicProperty.actions = response.resourceDynamicProperty.actions;
                    vm.resourceDynamicPropertyList = response.resourceDynamicPropertyList;
                    //applicationList
                    vm.appList.selectedApp = response.resourceDynamicProperty.applicationId;
                    vm.tenantList.selectedTenant = response.resourceDynamicProperty.tenantId;

                    var selectedTenant = response.resourceDynamicProperty.tenantId;
                    var selectedApp = response.resourceDynamicProperty.applicationId;

                    if (selectedTenant == null || selectedTenant == 0) {
                        //应用级
                        vm.typeList.selectedType = 2;
                        //applicationList
                        vm.appList.selectedApp = selectedApp;
                        vm.tenantList.selectedTenant = "";
                        vm.showApplication = true;
                        vm.showTenant = false;
                    } else if (selectedApp == null || selectedApp == 0){
                        //租户级
                        vm.typeList.selectedType = 1;
                        vm.tenantList.selectedTenant = selectedTenant;
                        //applicationList
                        vm.appList.selectedApp = "";
                        vm.showTenant = true;
                        vm.showApplication = false;
                    } else {
                        //租户+应用
                        vm.typeList.selectedType = 3;
                        //applicationList
                        vm.appList.selectedApp = selectedApp;
                        vm.tenantList.selectedTenant = selectedTenant;
                        vm.showApplication = true;
                        vm.showTenant = true;
                    }

                    // console.log("resourceDynamicPropertyList: " + JSON.stringify(vm.resourceDynamicPropertyList));

                    $.each(vm.resourceDynamicPropertyList,function (index, v) {
                        if ((v.description == null || $.trim(v.description) == "") && (v.fieldName == null || $.trim(v.fieldName) == "")) {
                            return true;
                        }

                        var inputName;
                        var filedName = v.filedName;
                        var delId = "del_" + filedName;
                        var spattern = /^varchar.*$/;
                        var ipattern = /^int.*$/;
                        var bpattern = /^boolean.*$/;
                        var descriptions;
                        if (spattern.exec(filedName)) {
                            inputName = "字符型";
                            descriptions = "sdescriptions";
                            vm.typeArray.sArray.push(filedName);
                        } else if (ipattern.exec(filedName)) {
                            inputName = "整型";
                            descriptions = "idescriptions";
                            vm.typeArray.iArray.push(filedName);
                        } else if (bpattern.exec(filedName)) {
                            inputName = "布尔型";
                            descriptions = "bdescriptions";
                            vm.typeArray.bArray.push(filedName);
                        }
                        var row = '<div class="form-group">\n' +
                            '                <div class="col-sm-2 control-label">' + inputName + '</div>\n' +
                            '                <div class="col-sm-10">\n' +
                            '                    <input class="form-control" name="' + descriptions + '" ttype="' + filedName + '" placeholder="描述" value="'+ v.description +'"/>\n' +
                            '                </div>' +
                            '                <div>' +
                            '                    <input type="button" class="btn btn-default" id="' + delId + '" value="-"/> ' +
                            '                </div>'
                        '            </div>';
                        $('#resourceDynamicPropForm').append(row);


                        /*绑定点击事件开始*/
                        $('#' + delId).on("click", function () {

                            if (inputName == "字符型") {
                                var arr = [];

                                if (vm.typeArray.sArray.length-1 <= 0 && vm.typeArray.iArray.length == 0 && vm.typeArray.bArray.length == 0) {
                                    // window.parent.swal("", "请至少添加一行输入框", "warning");
                                    // return;
                                } else {
                                    for (var i=0; i<vm.typeArray.sArray.length-1; i++) {
                                        arr.push(vm.typeArray.sArray[i]);
                                    }
                                    vm.typeArray.sArray = arr;
                                }

                            } else if (inputName == "整型") {
                                var arr = [];

                                if (vm.typeArray.iArray.length-1 <= 0 && vm.typeArray.sArray.length == 0 && vm.typeArray.bArray.length == 0) {
                                    // window.parent.swal("", "请至少添加一行输入框", "warning");
                                    // return;
                                } else {
                                    for (var i=0; i<vm.typeArray.iArray.length-1; i++) {
                                        arr.push(vm.typeArray.iArray[i]);
                                    }
                                    vm.typeArray.iArray = arr;
                                }

                            } else {
                                var arr = [];

                                if (vm.typeArray.bArray.length-1 <= 0 && vm.typeArray.iArray.length == 0 && vm.typeArray.sArray.length == 0) {
                                    // window.parent.swal("", "请至少添加一行输入框", "warning");
                                    // return;
                                } else {
                                    for (var i=0; i<vm.typeArray.bArray.length-1; i++) {
                                        arr.push(vm.typeArray.bArray[i]);
                                    }
                                    vm.typeArray.bArray = arr;
                                }
                            }
                            // console.log(JSON.stringify(vm.typeArray.sArray) + " - " + JSON.stringify(vm.typeArray.iArray) + " - " + JSON.stringify(vm.typeArray.bArray));
                            $('#' + delId).parent().parent().remove();
                            // console.log("update-del array: " + JSON.stringify(vm.typeArray));

                        });
                        /*绑定点击事件结束*/

                    });

                    resolve(response);
                });
            });
        },
        /*增加新的一行*/
        addRow: function () {

            var sFieldName;
            var iFieldName;
            var bFieldName;
            var inputName;
            var delId;
            var inputId;
            // var count = vm.count;
            var fieldName;

            var sArray = [
                "varchar00", "varchar01", "varchar02", "varchar03", "varchar04", "varchar05", "varchar06",
                "varchar07", "varchar08", "varchar09", "varchar10", "varchar11", "varchar12", "varchar13",
                "varchar14", "varchar15", "varchar16", "varchar17", "varchar18", "varchar19"
            ];

            var iArray = [
                "int01", "int02", "int03", "int04", "int05"
            ];

            var bArray = [
                "boolean01", "boolean02", "boolean03", "boolean04"
            ];

            var type = $('input:radio[name="type"]:checked').val();
            if(type == null){
                window.parent.swal("", "请选择输入框类型", "warning");
                return;
            } else{
                if (type == 1) {
                    //字符型
                    inputName = "字符型";
                    if (vm.typeArray.sArray.length == 0) {
                        sFieldName = sArray[0];
                        vm.typeArray.sArray.push(sFieldName);
                    } else if (vm.typeArray.sArray.length == sArray.length) {
                        window.parent.swal("", "字符型输入框已达到最大值，不能再添加了", "warning");
                        return;
                    } else {
                        outloop:
                        for (var i=0; i<sArray.length; i++) {
                            for (var j=0; j<vm.typeArray.sArray.length; i++) {
                                var index = vm.typeArray.sArray.indexOf(sArray[i]);

                                if (index == -1) {
                                    //这个元素还没有被使用
                                    sFieldName = sArray[i];
                                    vm.typeArray.sArray.push(sArray[i]);
                                    break outloop;
                                }
                            }
                        }
                    }

                } else if ( type == 2){
                    //整型
                    inputName = "整型";
                    if (vm.typeArray.iArray.length == 0) {
                        iFieldName = iArray[0];
                        vm.typeArray.iArray.push(iFieldName);
                    } else if (vm.typeArray.iArray.length == iArray.length) {
                        window.parent.swal("", "整型输入框已达到最大值，不能再添加了", "warning");
                        return;
                    } else {
                        outloop:
                            for (var i=0; i<iArray.length; i++) {
                                for (var j=0; j<vm.typeArray.iArray.length; i++) {
                                    var index = vm.typeArray.iArray.indexOf(iArray[i]);

                                    if (index == -1) {
                                        //这个元素还没有被使用
                                        iFieldName = iArray[i];
                                        vm.typeArray.iArray.push(iArray[i]);
                                        break outloop;
                                    }
                                }
                            }
                    }

                } else {
                    //布尔型
                    inputName = "布尔型";
                    if (vm.typeArray.bArray.length == 0) {
                        bFieldName = bArray[0];
                        vm.typeArray.bArray.push(bFieldName);
                    } else if (vm.typeArray.bArray.length == bArray.length) {
                        window.parent.swal("", "布尔型输入框已达到最大值，不能再添加了", "warning");
                        return;
                    } else {
                        outloop:
                            for (var i=0; i<bArray.length; i++) {
                                for (var j=0; j<vm.typeArray.bArray.length; i++) {
                                    var index = vm.typeArray.bArray.indexOf(bArray[i]);

                                    if (index == -1) {
                                        //这个元素还没有被使用
                                        bFieldName = bArray[i];
                                        vm.typeArray.bArray.push(bArray[i]);
                                        break outloop;
                                    }
                                }
                            }
                    }
                }
            }

            var descriptions;
            if (inputName == "字符型") {
                 delId = "del_" + sFieldName;
                 inputId = "input_" + sFieldName;
                 fieldName = sFieldName;
                 descriptions = "sdescriptions";
            } else if (inputName == "整型") {
                delId = "del_" + iFieldName;
                inputId = "input_" + iFieldName;
                fieldName = iFieldName;
                descriptions = "idescriptions";
            } else {
                delId = "del_" + bFieldName;
                inputId = "input_" + iFieldName;
                fieldName = bFieldName;
                descriptions = "bdescriptions";
            }

            var row = '<div class="form-group">\n' +
                '                <div class="col-sm-2 control-label">' + inputName + '</div>\n' +
                '                <div class="col-sm-10">\n' +
                '                    <input class="form-control" name="'+ descriptions +'"  ttype="' + fieldName + '" placeholder="描述"/>\n' +
                '                </div>' +
                '                <div>' +
                '                    <input type="button" class="btn btn-default" id="' + delId + '" value="-"/> ' +
                '                </div>'
                '            </div>';

            $('#resourceDynamicPropForm').append(row);

            //删除输入框事件
            $('#' + delId).on("click", function () {

                if (inputName == "字符型") {
                    var arr = [];
                    if (vm.typeArray.sArray.length-1 <= 0 && vm.typeArray.iArray.length == 0 && vm.typeArray.bArray.length == 0) {
                        // window.parent.swal("", "请至少添加一行输入框", "warning");
                        // return;
                    } else {
                        for (var i=0; i<vm.typeArray.sArray.length-1; i++) {
                            arr.push(vm.typeArray.sArray[i]);
                        }


                        vm.typeArray.sArray = arr;
                    }

                } else if (inputName == "整型") {
                    var arr = [];
                    if (vm.typeArray.iArray.length-1 <= 0 && vm.typeArray.sArray.length == 0 && vm.typeArray.bArray.length == 0) {
                        // window.parent.swal("", "请至少添加一行输入框", "warning");
                        // return;
                    } else {
                        for (var i=0; i<vm.typeArray.iArray.length-1; i++) {
                            arr.push(vm.typeArray.iArray[i]);
                        }
                        vm.typeArray.iArray = arr;
                    }

                } else {
                    var arr = [];

                    if (vm.typeArray.bArray.length-1 <= 0 && vm.typeArray.iArray.length == 0 && vm.typeArray.sArray.length == 0) {
                        // window.parent.swal("", "请至少添加一行输入框", "warning");
                        // return;
                    } else {
                        for (var i=0; i<vm.typeArray.bArray.length-1; i++) {
                            arr.push(vm.typeArray.bArray[i]);
                        }
                        vm.typeArray.bArray = arr;
                    }
                }

                $('#' + delId).parent().parent().remove();

                // console.log("delete array: " + JSON.stringify(vm.typeArray));

            });
            // console.log("insert array: " + JSON.stringify(vm.typeArray));
            // console.log(JSON.stringify(vm.resourceDynamicPropertyList));
        },
        /*检查type是否已被使用*/
        checkResourceDyPropType: function () {
            var type = $('#resourceDyPropType').val();
            var id = vm.resourceDynamicProperty.id;

            if (id == null) {
                id = 0;
            }

            $.get(baseURL + "/resourcedynamicpropertys/checktype?type=" + type + "&id=" + id , function (response) {
                if (!response.data) {
                    $('#checkResourceDyPropType').show();
                } else {
                    $('#checkResourceDyPropType').hide();
                }

            });
        },
        /*检查资源配置名称是否已被使用*/
        checkResourceDyPropName: function () {
            var name = $('#resourceDyPropName').val();
            var id = vm.resourceDynamicProperty.id;

            if (id == null) {
                id = 0;
            }

            $.get(baseURL + "/resourcedynamicpropertys/checkname?name=" + name + "&id=" + id , function (response) {
                if (!response.data) {
                    $('#checkResourceDyPropName').show();
                } else {
                    $('#checkResourceDyPropName').hide();
                }

            });
        },
        /** 重新加载 */
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
                    searchName: vm.searchName,
                    type: vm.type,
                    applicationId: vm.appSearchList.selectedApp,
                    tenantId: vm.tenantSearchList.searchTenant
                },
                page: page
            }).trigger("reloadGrid");
        },
        dealTypeList: function () {
            var path = "/garnet/option/resourceTypeManage/types";
            $.get(baseURL + "/resources/gettype?userId=" + userId + "&path=" + path, function (response) {
                var type = response.data;
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
        /** 应用列表onchange 事件*/
        selectApp: function () {
            // vm.initTreesToAdd()
            // vm.getAppList();
        },
        /*租户列表onchange事件*/
        selectTenant: function () {
            if(!vm.tenantListinited)return;
            vm.appList.options = [];
            vm.appList.selectedApp = "";
            vm.appList.options = [];
            vm.appList.selectedApp = "";
            vm.getAppList();
          // vm.getTenantList();
        },
        /*类型列表onchange事件*/
        selectType: function () {
            var selectedType = vm.typeList.selectedType;
            if (selectedType == 1) {
                //租户级
                vm.tenantList.selectedTenant = "";
                vm.appList.selectedApp = "";//applicationList
                vm.resourceDynamicProperty.applicationId = null;
                vm.resourceDynamicProperty.tenantId = null;
                vm.showTenant = true;
                vm.showApplication = false;

                vm.appList.options = [];//applicationList
                vm.tenantList.options = [];
                vm.getTenantList();
            } else if (selectedType == 2) {
                //应用级
                vm.tenantList.selectedTenant = "";
                vm.appList.selectedApp = "";//applicationList
                vm.resourceDynamicProperty.tenantId = null;
                vm.resourceDynamicProperty.applicationId = null;
                vm.showTenant = false;
                vm.showApplication = true;

                vm.appList.options = [];//applicationList
                vm.tenantList.options = [];
                vm.getAppList();
            } else {
                //租户+应用
                vm.tenantList.selectedTenant = "";
                vm.appList.selectedApp = "";//applicationList
                vm.resourceDynamicProperty.tenantId = null;
                vm.resourceDynamicProperty.applicationId = null;
                vm.showApplication = true;
                vm.showTenant = true;

                vm.appList.options = [];//applicationList
                vm.tenantList.options = [];
                vm.getTenantList();
            }
        },
        /**  获取应用列表 */
        getAppList: function () {
            vm.appListinited = false;
            var tenantId = vm.tenantList.selectedTenant;
            if (typeof tenantId == "undefined") {
                tenantId = 0;
            }

            var path = "/garnet/data/resourceTypeManage/tenantList";
            return new Promise(function(resolve){
                $.get(baseURL + "applications/byuseridandtenantid?userId=" + userId + "&tenantId=" + tenantId + "&path=" + path, function (response) {
                    vm.appList.options = [];//applicationList
                    $.each(response, function (index, item) {
                        vm.appList.options.push(item);//applicationList
                    });
                    vm.appListinited = true;
                    resolve('done');
                });
            });
        },
        /**  获取租户列表 */
        getTenantList: function () {
            vm.tenantListinited = false;
            var path = "/garnet/data/resourceTypeManage/tenantList";
            return new Promise(function(resolve){
                $.get(baseURL + "tenants/byuseridandpath?userId=" + userId + "&path=" + path, function (response) {
                    vm.tenantList.options = [];
                    $.each(response.data, function (index, item) {
                        vm.tenantList.options.push(item);
                    });
                    vm.tenantListinited = true;
                    resolve('done');
                });
            });
        },
        getSearchTenantList: function () {
            var path = "/garnet/data/resourceTypeManage/tenantList";
            $.get(baseURL + "tenants/byuseridandpath?userId=" + userId + "&path=" + path, function (response) {
                vm.tenantSearchList.options = [];
                $.each(response.data, function (index, item) {
                    vm.tenantSearchList.options.push(item);
                })
            });
        },
        getSearchAppList: function () {
            var path = "/garnet/data/resourceTypeManage/tenantList";
            $.get(baseURL + "applications/byuseridandtenantid?userId=" + userId + "&path=" + path, function (response) {
                vm.appSearchList.options = [];
                $.each(response, function (index, item) {
                    vm.appSearchList.options.push(item);
                    // applicationList.appSearchList.options.push(item);
                })
            });
        },
        getResourceByTeantIdAndAppId: function () {
            vm.searchApp = vm.appSearchList.selectedApp;
            vm.searchTenant = vm.tenantSearchList.searchTenant;
            vm.reload(true);
        },
        getPermissionAction: function () {
            var type;
            var path = "/garnet/option/resourceTypeManage/types";
            $.get(baseURL + "/resources/gettype?userId=" + userId + "&path=" + path, function (response) {
                type = response.data;
            });
            var path1 = path + "/" + type;
            // console.log("path1：" + path1);
            $.get(baseURL + "/resources/getuseraction?userId=" + userId + "&path=" + path1, function (response) {
                var action = response.data;
                // console.log("action: " + action);
                if (action == "read") {
                    vm.typesEditAble = false;
                } else {
                    vm.typesEditAble = true;
                }
            });
        }
        /**  获取应用列表 */
        // getAppList: function () {
        //     $.get(baseURL + "applications?page=1&limit=1000", function (response) {
        //         $.each(response.list, function (index, item) {
        //             applicationList.appList.options.push(item);
        //             applicationList.appSearchList.options.push(item);
        //         })
        //
        //     });
        // }
    },
    /**  初始化页面时执行该方法 */
    created: function () {
        // this.getCurrentUser();
        // this.getAppList();
        this.getSearchAppList();
        this.getSearchTenantList();
    }
});

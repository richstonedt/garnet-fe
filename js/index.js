
var resources;
resourceLoaded = false;
function getMenuList () {
    var that = this;
    $.getJSON(baseURL + "resources/getsysmenu?userId=" + userId, function (r) {
        var sysMenu = r.sysMenu.replace("\\", "");
        var sysAppCode = r.sysAppCode.replace("\\", "");
        resources = JSON.parse(sysAppCode);
        // that.menuList = JSON.parse(sysMenu);
        localStorage.setItem("sysMenu", sysMenu);
        localStorage.setItem("sysAppCode", sysAppCode);
        resourceLoaded = true;
        $('.loading').remove();
    });

}

function getMode () {
    $.get(baseURL + "systemconfigs/parameter?parameter=mode", function (response) {
        if (!response) {
            parent.location.href = 'index.html';
        } else {
            var mode = response.data.value;
            localStorage.setItem("mode", mode);
        }
    });
}

getMode();
getMenuList();

/** 生成菜单 */
var menuItem = Vue.extend({
    name: 'menu-item',
    props: {item: {}, index: 0},
    template: [
        '<li :class="{active: (item.type===0 && index === 0)}">',
        '<a v-if="(item.type === 0 && setButtons(item.code))" href="javascript:void(0);">',
        '<i v-if="item.icon != null" :class="item.icon"></i>',
        '<span>{{item.name}}</span>',
        '<i class="fa fa-angle-left pull-right"></i>',
        '</a>',
        '<ul v-if="(item.type === 0 && setButtons(item.code))" class="treeview-menu">',
        '<menu-item :item="item" :index="index" v-for="(item, index) in item.list" @click.native="onMenuItemClik(item, index)"></menu-item>',
        '</ul>',
        '<a v-if="(item.type === 1 && setButtons(item.code))" :href="\'#\'+item.url">',
        '<i v-if="item.icon != null" :class="item.icon"></i>',
        '<i v-else class="fa fa-circle-o"></i>',
        '<span>{{item.name}}</span>',
        '</a>',
        '</li>'
    ].join(''),
    methods: {
        setButtons: function (code) {
            return resources[code];
        },
        onMenuItemClik(menuItem, menuIndex) {
            if (menuItem.url === vm.main) {
                $('#mainIframe').attr('src', menuItem.url + '?t=' + Math.random());
            }
        }
    }
});

/** 注册菜单组件 */
Vue.component('menuItem', menuItem);
var vm = new Vue({
    el: '#garnetIndexApp',
    data: {
        user: {},
        menuList: {},
        resourceList: {

        },
        main: "main.html",
        password: '',
        newPassword: '',
        newPassword2: '',
        navUrl: "#main.html",
        navTitle: "欢迎页"
    },
    mounted: function () {
        // console.log('mounted');
        // 以下代码放到 created 去 Jaffray 2019.6.9
        /* var userId = localStorage.getItem("userId")
        console.log("idnex userId: " + userId);
        if (userId == null || userId == "") {

            // console.log("index userid is null...");

            var pathName = window.document.location.pathname;
            var patrn = /.*index.html$/;
            if (patrn.exec(pathName)) {
                parent.location.href = 'login.html';
            } else {
                parent.location.href = '../login.html';
            }
        } */
        // console.log("cookies == " + localStorage.getItem("cookie"));
    },
    methods: {
        /** 查询菜单列表 */
        /* getMenuList: function () {
            var that = this;
            // $.getJSON(baseURL + "menu/userId/" + userId + "/appId/1/appName/garnet", function (r) {
            // $.ajaxSettings.async = false;
            // console.log("index userId: " + userId);
            $.getJSON(baseURL + "resources/getsysmenu?userId=" + userId, function (r) {
                // console.log("index sysmenu: " + JSON.stringify(r));
                // that.menuList = r;

                // console.log("sysMenu: " + JSON.stringify(r.sysMenu));
                // console.log("r: " + JSON.stringify(r));

                // if (r.loginStatus == "false") {
                //     console.log("我还没登录");
                //
                //     localStorage.removeItem("userId");
                //     localStorage.removeItem("userName");
                //     localStorage.removeItem("belongToGarnet");
                //     localStorage.removeItem("accessToken");
                //     localStorage.removeItem("refreshToken");
                //     window.swal({
                //             title: response.message,
                //             type: "error"
                //         },
                //         function () {
                //             var pathName = window.document.location.pathname;
                //             var patrn = /.*index.html$/;
                //             if (patrn.exec(pathName)) {
                //                 parent.location.href = 'login.html';
                //             } else {
                //                 parent.location.href = '../login.html';
                //             }
                //         });
                // }

                var sysMenu = r.sysMenu.replace("\\", "");
                that.menuList = JSON.parse(sysMenu);
                var sysAppCode = r.sysAppCode.replace("\\", "");
                resources = JSON.parse(sysAppCode);

                //路由
                var router = new Router();
                routerList(router, that.menuList,that);
                router.start();

                $('.loading').remove();
            });

        }, */
        /** 查询按钮列表 */
        getButtonList: function () {
            // $.ajaxSettings.async = false;
            // $.getJSON("http://localhost:12306/garnet/test.json", function (r) {
            // $.getJSON(baseURL + "resources/getappcode?userId=" + userId, function (r) {
            //     resources = r;
            // });
            // this.getMenuList();
            var that = this;
            var lookupResourceLoaded = function () {
                if (resourceLoaded) {
                    that.menuList = JSON.parse(localStorage.getItem("sysMenu"));
                    //路由
                    var router = new Router();
                    routerList(router, that.menuList,that);
                    router.start();
                } else {
                    setTimeout(() => {
                        lookupResourceLoaded();
                    }, 10);
                }
            };
            lookupResourceLoaded();
        },
        /** 查询用户信息 */
        getUser: function () {
            var that = this;
            // console.log("index accessToken: " + localStorage.getItem("accessToken"));
            // console.log("index userId: " + userId);

            // $.getJSON(baseURL + "token/userInfo?token=" + garnetToken, function (r) {
            $.getJSON(baseURL + "users/"+ userId + "?token=" + accessToken, function (response) {
                if (!response) {
                    // swal("", getExceptionMessage(response), "error");
                    parent.location.href = 'index.html';
                } else {
                    if (response.loginStatus == "false") {
                        return;
                    }
                    // vm.user = response.data.user;
                    that.user = response.data.user;
                }
            });
        },
        /* getMode : function () {
            $.get(baseURL + "systemconfigs/parameter?parameter=mode", function (response) {
                if (!response) {
                    parent.location.href = 'index.html';
                } else {
                    var mode = response.data.value;
                    localStorage.setItem("mode", mode);
                }
            });
        }, */
        /** 修改密码 */
        updatePassword: function () {

            // if (vm.user == null || vm.user.id == null) {
            //     location.href = 'login.html';
            // }

            if (userId == null || $.trim(userId) == "") {
                location.href = 'login.html';
            }

            vm.password = '';
            vm.newPassword = '';
            vm.newPassword2 = '';
            layer.open({
                type: 1,
                skin: 'layui-layer-molv',
                title: "修改密码",
                area: ['550px', '319px'],
                shadeClose: false,
                content: jQuery("#passwordLayer"),
                btn: ['修改', '取消'],
                btn1: function (index) {

                    //验证密码格式
                    var chineseReg = /^[\u4e00-\u9fa5]{0,}$/; // 中文正则
                    var specialReg = /^(?!_)(?!.*?_$)[-a-zA-Z0-9_\u4e00-\u9fa5]+$/;//非特殊符号的正则表达式
                    var passWordReg = /^(?:(?=.*[0-9].*)(?=.*[A-Za-z].*)(?=.*[\W_].*))[\W_0-9A-Za-z]{4,20}$/;


                    const oldPassword = $.trim(vm.password) || '';
                    var newPassword = $.trim(vm.newPassword) || '';
                    var newPassword2 = $.trim(vm.newPassword2) || '';

                    if(!oldPassword) {
                        window.parent.swal({
                            title: '密码修改失败',
                            text: '原密码不能为空',
                            type: 'warning',
                            confirmButtonText: '确定',
                            allowOutsideClick: false
                        },
                        function () {
                            // vm.updatePassword();
                        });
                        return false;
                    }

                    if (!newPassword) {
                        // layer.close(index);
                        window.parent.swal({
                                title: '密码修改失败',
                                text: '新密码不能为空',
                                type: 'warning',
                                confirmButtonText: '确定',
                                allowOutsideClick: false
                            },
                            function () {
                                // vm.updatePassword();
                            });
                        return false;
                    }

                    if (!newPassword2) {
                        // layer.close(index);
                        window.parent.swal({
                                title: '密码修改失败',
                                text: '确认密码不能为空',
                                type: 'warning',
                                confirmButtonText: '确定',
                                allowOutsideClick: false
                            },
                            function () {
                                // vm.updatePassword();
                            });
                        return false;
                    }
                    if (oldPassword === newPassword) {
                        // layer.close(index);
                        window.parent.swal({
                                title: '密码修改失败',
                                text: '新密码不能与原密码相同',
                                type: 'warning',
                                confirmButtonText: '确定',
                                allowOutsideClick: false
                            },
                            function () {
                                // vm.updatePassword();
                            });
                        return false;
                    }

                    if (newPassword !== newPassword2) {
                        // layer.close(index);
                        window.parent.swal({
                                title: '密码修改失败',
                                text: '两次密码输入不一致',
                                type: 'warning',
                                confirmButtonText: '确定',
                                allowOutsideClick: false
                            },
                            function () {
                                // vm.updatePassword();
                            });
                        return false;
                    }

                    if (chineseReg.test(newPassword)) {
                        // layer.close(index);
                        window.parent.swal({
                                title: '密码修改失败',
                                text: '密码不能为中文',
                                type: 'warning',
                                confirmButtonText: '确定',
                                allowOutsideClick: false
                            },
                            function () {
                                // vm.updatePassword();
                            });
                        return false;
                    }
                    // if (!specialReg.test(newPassword)) {
                    //     layer.close(index);
                    //     window.parent.swal({
                    //             title: '密码修改失败',
                    //             text: '密码只能使用英文、数字、下划线或者连字符',
                    //             type: 'warning',
                    //             confirmButtonText: '确定',
                    //             allowOutsideClick: false
                    //         },
                    //         function () {
                    //             vm.updatePassword();
                    //         });
                    //     return false;
                    // }
                    if (newPassword.length < 4 || newPassword.length > 20) {
                        // layer.close(index);
                        window.parent.swal({
                                title: '密码修改失败',
                                text: '密码的长度只能在4-20',
                                type: 'warning',
                                confirmButtonText: '确定',
                                allowOutsideClick: false
                            },
                            function () {
                                // vm.updatePassword();
                            });
                        return false;
                    }
                    if (!passWordReg.test(newPassword)) {
                        // layer.close(index);
                        window.parent.swal({
                                title: '密码修改失败',
                                text: '密码中至少含有数字、字母和符号三者组合',
                                type: 'warning',
                                confirmButtonText: '确定',
                                allowOutsideClick: false
                            },
                            function () {
                                // vm.updatePassword();
                            });
                        return false;
                    }

                    var obj = new Object();
                    obj.userId = vm.user.id;
                    obj.password =  CryptoJS.MD5(vm.password).toString();
                    obj.newPassword = CryptoJS.MD5(vm.newPassword).toString();

                    $.ajax({
                        type: "PUT",
                        url: baseURL + "users/password",
                        contentType: "application/json",
                        data: JSON.stringify(obj),
                        dataType: "",
                        success: function () {
                            layer.close(index);
                            // swal("密码修改成功，请重新登录!", "", "success");
                            // location.href = 'login.html';

                            window.parent.swal({
                                    title: "密码修改成功",
                                    text:  "请重新登录",
                                    type: "success"
                                },
                                function () {
                                    location.href = 'login.html';
                                });
                        },
                        error: function (response) {
                            // layer.close(index);
                            // swal("修改密码失败", getExceptionMessage(response), "warning");
                            window.parent.swal({
                                    title: "修改密码失败",
                                    text:  getExceptionMessage(response),
                                    type: "warning"
                                },
                                function () {
                                    // vm.updatePassword();
                                });
                        }
                    });
                }
            });

        },
        /** 退出登录 */
        logout: function () {
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            localStorage.removeItem("belongToGarnet");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            location.href = 'login.html';
        },
        /** 校验字段 */
        checkValue: function () {
            var emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
            var telReg = /^1[34578]\d{9}$/;

            if (!vm.checkInput(vm.newPassword, '密码', true)) {
                return false;
            }

            return true;
        },
        checkInput: function (value, name, isPassword) {
            var chineseReg = /^[\u4e00-\u9fa5]{0,}$/; // 中文正则
            var specialReg = /^(?!_)(?!.*?_$)[-a-zA-Z0-9_\u4e00-\u9fa5]+$/;//非特殊符号的正则表达式

            if (!(isPassword && vm.user.userId)) {

                if (!value) {
                    window.parent.swal({
                        title: name + '不能为空！',
                        type: 'warning',
                        confirmButtonText: '确定',
                        allowOutsideClick: false
                    });
                    return false;
                }
                if (chineseReg.test(value)) {

                    window.parent.swal({
                        title: name + '不能为中文！',
                        type: 'warning',
                        confirmButtonText: '确定',
                        allowOutsideClick: false
                    });
                    return false;
                }
                if (!specialReg.test(value)) {

                    window.parent.swal({
                        title: name + '只能使用英文、数字、下划线或者连字符！',
                        type: 'warning',
                        confirmButtonText: '确定',
                        allowOutsideClick: false
                    });
                    return false;
                }
                if (value.length < 4 || value.length > 20) {

                    window.parent.swal({
                        title: name + '的长度只能在4-20！',
                        type: 'warning',
                        confirmButtonText: '确定',
                        allowOutsideClick: false
                    });
                    return false;
                }
            }
            return true;
        }
    },
    /**  初始化页面时执行该方法 */
    created: function () {
        // console.log('created');
        var userId = localStorage.getItem("userId")
        // console.log("idnex userId: " + userId);
        if (userId == null || userId == "") {

            // console.log("index userid is null...");

            var pathName = window.document.location.pathname;
            var patrn = /.*index.html$/;
            if (patrn.exec(pathName)) {
                parent.location.href = 'login.html';
            } else {
                parent.location.href = '../login.html';
            }
            return;
        }

        // this.getMenuList();
        this.getUser();
        this.getButtonList();
        // this.getMode();
        // this.refreshToken();
    }
});



/** 菜单路由 */
function routerList(router, menuList,vm) {

    // console.log("router menuList: "+JSON.stringify(menuList));

    for (var key in menuList) {
        var menu = menuList[key];
        // console.log("router menu: "+JSON.stringify(menu));
        if (menu.type == 0) {
            routerList(router, menu.list,vm);
        } else if (menu.type == 1) {
            router.add('#' + menu.url, function () {
                var url = window.location.hash;

                // console.log("in router callback, window.location.hash: "+url);

                var navItem = "";
                var $anchor = $("a[href='" + url + "']");
                var itemName = $anchor.text();
                if(!itemName){
                    navItem = localStorage.getItem(window.location.hash);
                }else {
                    localStorage.setItem(window.location.hash, itemName);
                    navItem = localStorage.getItem(window.location.hash);
                }

                vm.navUrl = url;
                //替换iframe的url
                vm.main = url.replace('#', '');
                // console.log('$anchor:',$anchor);
                var parent = $anchor.parent();
                // console.log('parent:',parent);
                //导航菜单展开
                $(".treeview-menu li").removeClass("active");
                $(".sidebar-menu li").removeClass("active");
                $anchor.parents('li').addClass("active");

                vm.navTitle = navItem;
                // vm.navTitle = $("a[href='" + url + "']").text();
            });
        }
    }
}

//防止页面后退
history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL);
});


/** iframe自适应 */
$(window).on('resize', function () {
    var $content = $('.content');
    $content.height($(this).height());// - 120 (for copyright)
    $content.find('iframe').each(function () {
        $(this).height($content.height());
    });
    let sections = $(".content-wrapper section");
    $(sections[1]).height($(".content-wrapper").height() - $(sections[0]).height());
}).resize();


$('#aboutGarnet, #homeNav, #currNav').click(function() {
    // console.log('in click(), this:', this, 'vm.main:',vm.main);
    var href = $(this).attr('href').replace('#', '');
    if((href == 'about.html') || (href == 'main.html')) {
        // location.href.hash = '';
        vm.navTitle = $(this).attr('id')==='homeNav' ? '欢迎页' : $(this).text();
        vm.navUrl = '#' + href;
        $(".treeview-menu li").removeClass("active");
    }
    if (href === vm.main) {
        href += '?t=' + Math.random();
    }
    $('#mainIframe').attr('src', href);
    return true;
});
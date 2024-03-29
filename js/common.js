
// token
var accessToken = localStorage.getItem("accessToken");
if (!accessToken) {
    // console.log("common token no exists");
    // parent.location.href = 'login.html';
} else {
    // console.log("common token: " + accessToken);
}
var userId = localStorage.getItem("userId");

/** 权限判断 */
/*function hasPermission(permission) {
    return window.parent.permissions.indexOf(permission) > -1;
}*/

//获取后台抛出的异常信息燕返回
function getExceptionMessage(value) {
    var exception;
    if (typeof(value.responseJSON.data) == "undefined") {
        exception = value.responseJSON.message;
    } else {
        exception = value.responseJSON.data.errorResponseMessage;
    }

    var message = exception.match(/java.lang.RuntimeException:(.*)/)
    if (message != null) {
        message = message[1];
    } else {
        message = "操作失败，请检查您的参数是否正确";
    }
    return message;
}

function checkValueNull(value) {

    if (value == null || value.length == 0) {
        return false;
    }

    for (var i = 0; i < value.length; i++) {
        if (value[i] == null) {
            return false;
        }
    }

    return true;
}

/** jquery全局配置 */
$.ajaxSetup({
    dataType: "json",
    cache: false,
    headers: {
        // "token": token,
        // "gempileToken": localStorage.getItem("gempileToken")
        // "garnetToken": localStorage.getItem("garnetToken"),
        // "userToken": localStorage.getItem("userToken")
        "accessToken": localStorage.getItem("accessToken"),
        "refreshToken": localStorage.getItem("refreshToken")
    },
    xhrFields: {
        withCredentials: true
    },
    crossDomain: true,

    complete: function (xhr) {
        var userId = localStorage.getItem("userId");
        if (userId == null || userId == "") {
            // console.log("common userid is null...");
            var pathName = window.document.location.pathname;
            var patrn = /.*index.html$/;
            if (patrn.exec(pathName)) {
                parent.location.href = 'login.html';
            } else {
                parent.location.href = '../login.html';
            }
            return;
        }

        ///////////////////
        
        var patrn = /.*checklogined.*/;
        var patrn2 = /.*garnetrefreshtoken.*/;
        var url = xhr.responseURL; // 必须引入改进版的 jquery-3.4.1.js 才支持本属性!!! Jaffray 2019.07.11
        
        // console.log("aaa=" + patrn.exec(url));
        if (patrn.exec(url) == null && patrn2.exec(url) == null) {
            
            var timestamp = new Date().getTime();
                
            // console.log('after got response of ["'+url+'"], set requestTime as ', timestamp);
            localStorage.setItem("requestTime", timestamp);
        }
        /////////////////////////////

        var response;
        try{
            response = JSON.parse(xhr.responseText);
        }catch(err){
            console.warn('Parse response failed! responseText=[' + xhr.responseText + ']');
            return;
        }
        

        // token过期，则跳转到登录页面
        if (response.code == 401) {

            // console.log("common 401: " + localStorage.getItem("accessToken"));

            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            localStorage.removeItem("belongToGarnet");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            // console.log("common 401 response: " + JSON.stringify(response));
            if ("请先登录" == response.message) {
                var pathName = window.document.location.pathname;
                var patrn = /.*index.html$/;
                if (patrn.exec(pathName)) {
                    parent.location.href = 'login.html';
                } else {
                    parent.location.href = '../login.html';
                }
            } else {
                window.swal({
                        title: response.message,
                        type: "error"
                    },
                    function () {
                        var pathName = window.document.location.pathname;
                        var patrn = /.*index.html$/;
                        if (patrn.exec(pathName)) {
                            parent.location.href = 'login.html';
                        } else {
                            parent.location.href = '../login.html';
                        }
                    });
            }

        } else if (response.code == 403) {
            // console.log("common 403: " + localStorage.getItem("accessToken"));
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            localStorage.removeItem("belongToGarnet");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            window.parent.swal({
                    title: "没有权限",
                    text: response.message,
                    type: "error"
                },
                function () {
                    var pathName = window.document.location.pathname;
                    var patrn = /.*index.html$/;
                    if (patrn.exec(pathName)) {
                        parent.location.href = 'login.html';
                    } else {
                        parent.location.href = '../login.html';
                    }
                    // parent.location.href = '../index.html';
                });
        }
    }
});


/** jqGrid 配置 */
$.jgrid.defaults.width = 1000;
$.jgrid.defaults.responsive = true;
$.jgrid.defaults.styleUI = 'Bootstrap';

/*$.extend($.jgrid.defaults, {
    ajaxGridOptions: {
        headers: {
            "token": token
        }
    }
});*/

/** 选择jqGrid列表中的一条记录 */
function getSelectedRow() {
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if (!rowKey) {
        //alert("请选择一条记录");
        window.parent.swal("请选择一条记录!", "", "warning");
        return;
    }
    var selectedIDs = grid.getGridParam("selarrrow");
    if (selectedIDs.length > 1) {
        //alert("只能选择一条记录");
        window.parent.swal("只能选择一条记录!", "", "warning");
        return;
    }
    return rowKey;
}

/** 选择jqGrid列表中的多条记录 */
function getSelectedRows() {
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if (!rowKey) {
        //alert("请选择一条记录");
        window.parent.swal("请选择一条记录!", "", "warning");
        return;
    }
    return grid.getGridParam("selarrrow");
}

/** 重写window中的alert属性 */
window.alert = function (msg, callback) {
    parent.layer.alert(msg, function (index) {
        parent.layer.close(index);
        if (typeof(callback) === "function") {
            callback("ok");
        }
    });
};
/** 重写window中的confirm属性 */
window.confirm = function (msg, callback) {
    parent.layer.confirm(msg, {btn: ['确定', '取消']}, function () {
        if (typeof(callback) === "function") {
            callback("ok");
        }
    });
};

function htmlDecode(input)
{
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}

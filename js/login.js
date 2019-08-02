
var nowTime = $.now();
var vm = new Vue({
    el: '#garnetApp',
    data: {
        userName: '',
        password: '',
        captcha: '',
        nowTime:'',
        error: false,
        errorMsg: '',
        src: baseURL + 'kaptcha?nowTime=' + nowTime,
        inputtext:{}
    },
    methods: {
        refreshCode: function () {
            var oldTime = nowTime;
            nowTime = $.now();
            this.src = baseURL + "kaptcha?nowTime=" + nowTime + "&oldTime=" + oldTime;
        },submit:function(){
            // alert(JSON.stringify(this.inputtext));
        },
        login: function () {
            var userId = localStorage.getItem("userId");

            /* if (vm.userName != null && vm.userName != "") {
                document.cookie = "userName=" + vm.userName + ";";
            } */

            var data = {
                userName: vm.userName,
                password: CryptoJS.MD5(vm.password).toString(),
                kaptcha: vm.captcha,
                nowTime: nowTime,
                appCode: 'garnet'
            };
            $.ajax({
                type: "POST",
                url: baseURL + "users/garnetlogin",
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: "",
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (result) {
                    // console.log('users/garnetlogin, result:', result);
                    if (result.loginStatus == "success") {
                        localStorage.setItem("refreshToken", result.refreshToken);
                        localStorage.setItem("accessToken", result.accessToken);
                        localStorage.setItem("userId", result.user.id);
                        localStorage.setItem("userName", result.user.userName);
                        localStorage.setItem("belongToGarnet", result.user.belongToGarnet)
                        localStorage.setItem("requestTime", new Date().getTime());

                        parent.location.href = 'index.html';
                    } else {
                        vm.captcha = '';
                        vm.error = true;
                        vm.errorMsg = result.message;
                        vm.refreshCode()
                    }
                },
                error: function(result){
                    vm.captcha = '';
                    vm.error = true;
                    vm.errorMsg = result.responseJSON.messageDescription;
                    vm.refreshCode();
                }

            });
        }
    }
});


$(function() {
    // 自动聚焦到账号输入框
    var input = $('input[placeholder="账号"]');
    input.focus();
    input.select();
});
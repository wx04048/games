var openApp, cslFlag, applyFlag = "1",
    phoneNo,
    os = (function() {
        var agent = navigator.userAgent,
            os = 'other';
        if (agent.match(/Android/i)) {
            os = 'android';
        } else if (agent.indexOf('iPhone') != -1 || agent.indexOf(
                'iPad') != -1) {
            os = 'ios';
        }
        return os;
    })();
cslFlag = isCity();

function _jsonp(resultData) {
    return resultData;
}
$(function() {
    if (cslFlag) {
        $(".title-top").removeClass("hide");
        window.getShareData.hideTitleBar('true');
    }
});

function cslLogin() {
    var envir = /MicroMessenger/gi.test(navigator.userAgent) || /AlipayClient/gi.test(navigator.userAgent);
    if (cslFlag) {
        openCsl();
    } else {
        if (os === 'ios' && envir) {
            $(".mask").removeClass("hide");
            $(".ios").removeClass("hide");
        } else if (os === 'android' && envir) {
            $(".mask").removeClass("hide");
            $(".android").removeClass("hide");
        } else {
            openCsl();
        };
    }


}

/*登录*/
function loginWifi() {
    phoneNo = $.trim($(".phone").val());
    var password = $.trim($(".password").val());
    if (phoneNo.length < 1 || password.length < 1) {
        mui.toast("账号或密码不得为空");
    } else if (phoneNo.length != 11) {
        mui.toast("请输入正确的手机号码")
    } else {
        if (applyFlag == "1") {
            applyFlag = "2";
            $.ajax({
                type: 'POST', //请求方式，支持'GET'和'POST'，不填默认为 'Get'
                // url: "https://uc.ewoho.com/cepMobile/citywifi/userLogin/userLoginForOutSource", //请求地址
                url: "https://uc.ewoho.com/citywifi/userLoginForOutSource", //请求地址
                async: false, //是否异步，不填默认为 true
                dataType: 'jsonp', //请求方式，支持'json'和'jsonp'
                callback: 'jsoncallback', //callback方法名，请求方式为 jsonp 时可用，不填默认为 'jsoncallback'
                time: 3000, //jsonp请求超时计时器参数，仅在请求方式为 jsonp 时可用
                data: {
                    "account": phoneNo,
                    "password": password
                }, //请求参数
                success: function(json) {
                    if (json.success == "true") {
                        var url = "http://auth-20002000.wifi.com/wx.html?href=";
                        var str = "n=" + phoneNo + "&u=testid&t=2014-12-11-06-49-34&l=37";
                        var id = "citylink201702141028";
                        var str = stringToHex(str);
                        url = url + str + "&id=" + id;
                        authority(url);
                    } else {
                        applyFlag = "1";
                        mui.toast(json.msg);
                    }
                }, //请求成功后回调函数
                error: function() {

                    } //请求失败后回调函数
            });
        } else {
            mui.toast("请不要重复登录");
        }

    }
}

/*字符串转16进制*/
function stringToHex(str) {
    var val = "";　　
    for (var i = 0; i < str.length; i++) {　　　　　
        if (val == "")　　　　　　　 val = str.charCodeAt(i).toString(16);　　　　　
        else　　　　　 val += str.charCodeAt(i).toString(16);　　
    }　　
    return val;
}

function authority(url) {
    $.ajax({
        url: url,
        type: "get",
        async: false,
        success: function(data) {
            if (data.indexOf("true") > -1) {
                window.location.replace("success.html");
            } else {
                window.location.href = "fail.html";
            }
        },
        error: function() {
            window.location.href = "fail.html";
        }
    });
}

/*跳转到城市令wifi登录页*/
function openCsl() {
    var aLink = document.createElement("a");
    // 跳转城市令wifi 链接可修改为指定跳转页面
    var location = 'citytoken://openvc?vcname=wuhu_wifi';
    /* var location='citytoken://openvc?vcname=absWeb&absParam={"webUrl":"'+httpUrl+'","title":"","rightImageUrl":"","titleShowType":"","page_params":""}'*/
    aLink.href = 'http://news.citytoken.cn/topic/zhuanti/downloadpage/index.html?' + location;
    aLink.click();
}
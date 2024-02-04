
/**
 * 判断是否在城市令的内部
 */
function isCity()
{
    var winNu = window.navigator.userAgent.toLowerCase();
    //判断是否城市令用户
    if (winNu.match("citytoken")) 
    {
        return true;
    }
    else
    {
        return false;
    }
}

function flyun(data){
    var type = '';
    var args_type = '';
    switch (data.type) {
        case '1':
            type = 'interface_request';
            break;
        case '2':
            type = 'init_request';
            break;
        case '3':
            type = 'jump_request';
            break;
        case '4':
            type = 'value_request';
        default:
            break;
    }
    switch (data.args_type) {
        case '0':
            args_type = '';
            break;
        case '1':
            args_type = data.data;
            break;
        case '2':
            args_type = [data.data];
            break;
        default:
            break;
    }
    fly.request({
        action: 'baseComponents.' + type,
        callback: data.method,
        args: args_type
    }).done(function (resdata) {
        if (data.success) {
            data.success(resdata);
        }
    }).fail(function (code) {

        if (data.fail) {
            data.fail(resdata);
        }
    })
}

$(function(){
    $(".back-icon").click(function(){
        if($(this).hasClass("index")){
            window.getShareData.customGoBack (true);
        }else{
            window.history.back();
        }
    })
});

// 小机器人打开
function openLoadWait() {
    fly.request({
        action : 'baseComponents.value_request',
        args : [ {
            "valueType" : "openLoadWait"
        } ]
    }).done(function(data) {

    }).fail(function() {
    })
}

// 小机器人关闭
function closeLoadWait() {
    fly.request({
        action : 'baseComponents.value_request',
        args : [ {
            "valueType" : "closeLoadWait"
        } ]
    }).done(function(data) {

    }).fail(function() {
    })
}

/*iphoneX页面适配*/
function isiPhoneX(){
    $(".title-top").css("top","44px");
    $(".hdgl").css("top","109px");
    $(".bg1").css("margin-top","139px");
    $(".mt-51").css("margin-top","95px");
}


function smrz(type){
    var btnArray = ['取消', '确定'];
    mui.confirm('此活动需要实名认证，是否进入实名认证','提示', btnArray, function (e) {
        if (e.index == 1) {
            flyun({
                data: {
                    jumpType: "isAuth"
                },
                args_type: '2',
                type: '3',
                success: function(ret) {

                },
                fail: function(ret) {

                }
            });
        }else{
            if(type=="1"){
                window.getShareData.customGoBack(true);
            }
        }
    })
}
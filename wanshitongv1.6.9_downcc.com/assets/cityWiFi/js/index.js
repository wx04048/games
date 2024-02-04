
var phone,wifiName,
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
mui.init({
    swipeBack:true //启用右滑关闭功能
});
$(function(){
    if(isCity()){
        $.ajax({
            type: 'Get', //请求方式，支持'GET'和'POST'，不填默认为 'Get'
            url: "https://uc.ewoho.com/citywifi/getWifiNameList", //请求地址
            async: false, //是否异步，不填默认为 true
            dataType: 'jsonp', //请求方式，支持'json'和'jsonp'
            callback: 'callback', //callback方法名，请求方式为 jsonp 时可用，不填默认为 'jsoncallback'
            time: 3000, //jsonp请求超时计时器参数，仅在请求方式为 jsonp 时可用
            data: {
              
            }, //请求参数
            success: function(json) {
                wifiName=json.wifiName;
            }, //请求成功后回调函数
            error: function() {
              
            } //请求失败后回调函数
        });

        flyun({
            data: {

            },
            method: 'init',
            args_type: '0',
            type: '2',
            success: function(res) {
                phone=res.phoneNum;
            },
            fail: function(res) {
            }
        });
    }else{
        mui.alert("请确认已连接到“城市令WiFi”");
    }   
})

/*跳转到更多帮助页面*/
function moreHelp(){
	window.location.href="http://news.citytoken.cn/topic/cityWifi/moreHelp.html";
}


/*字符串转16进制*/
function stringToHex(str){
    var val="";
　　for(var i = 0; i < str.length; i++){
　　　　　if(val == "")
　　　　　　　val = str.charCodeAt(i).toString(16);
　　　　　else
　　　　　val +=  str.charCodeAt(i).toString(16);
　　}
　　return val;
}

/*连接城市WiFi*/
function toLink(){
	console.log(Aifan)
	Aifan.linkWifi().then(res=>{
		if(res==='1'){
			window.location.href="success.html"
		}else{
			window.location.href="fail.html"
		}
	})
}

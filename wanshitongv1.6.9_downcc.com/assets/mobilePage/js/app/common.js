
var u = navigator.userAgent, app = navigator.appVersion;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	if(isiOS){
		$("input textarea").css({
		'-webkit-user-select': 'auto',
		'-moz-user-select': 'auto',
		'-ms-user-select': 'auto'
		})
	}
function warning(msg){
	setTimeout(function(){
		alert(msg);
	},0)
}
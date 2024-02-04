var Aifan = (function() {
	//是否再城市令内部
	var isCity = function() {
		var winNu = window.navigator.userAgent.toLowerCase();
		if(winNu.match("citytoken")) {
			return true;
		}
		return false;
	}

	/*
	 
	 * 皖事通原生方法集合
	 *  
	 * 用户信息
	 * 定位
	 * 支付
	 * M号调用
	 * 城市WIFI
	 * 
	 * */
	var KnowAll= {
		//获取用户信息
		Loign: function() {
			return new Promise(function(resolve, reject) {
				croods.customPlugin({
					action: 'UserPlugin.login',
					success: function(data) {
						resolve(data)
					},
					fail: function(err) {
						reject(err) //失败返回
					}
				});
			})
		},
		//定位信息
		Location: function(params = {}) {
			return new Promise(function(resolve, reject) {
				croods.customPlugin({
					action: 'BaiduMapPlugin.getLocation',
					params: params,
					success: function(data) {
						resolve(data)
					},
					fail: function(err) {
						reject(err) //失败返回
					}
				});
			})
		},
		//城市wifi
		linkWifi: function(params = {}) {
			return new Promise(function(resolve, reject) {
				croods.customPlugin({
					action: 'WifiPlugin.linkWifi',
					params: params,
					success: function(data) {
						resolve(data.state)
					},
					fail: function(err) {
						reject(err) //失败返回
					}
				});
			})
		}
	}
	/*
	 
	 * 城市令原生方法集合
	 * 
	 * 上传图片
	 * 定位
	 * 城市WIFI
	 * 获取用户信息
	 * 支付
	 * 
	 * */

	var CityToken = {
		//城市WIFI
		linkWifi: function() {
			return new Promise(function(resolve, reject) {
				fly.request({
					action: 'baseComponents.value_request',
					callback: 'linkWifi',
					args: [{
						"valueType": "linkWifi"
					}]
				}).done(function(data) {
					resolve(data)
				}).fail(function(err) {
					reject(err)
				});
			})
		}

	}

	//返回方法---城市令
	if(isCity()) {
		return {
			linkWifi:CityToken.linkWifi
		}
	}
	//返回方法---皖事通
	return {
		Loign: KnowAll.Loign,
		Location: KnowAll.Location,
		linkWifi:KnowAll.linkWifi
	}
})()
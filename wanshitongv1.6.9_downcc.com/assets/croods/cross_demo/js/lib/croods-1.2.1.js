/*!
croods.js v1.2.1
Licensed under ISC
Author: jingli12
Update: 2017-01-17 10:01:07 GMT+0800
*/
(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s
})({
    1: [
        function(require, module, exports) {
            var utils = require('./croods.utils'),
                croods = require('./croods.core');

            var FUNCTION = 'function',
                STRING = 'string',
                OBJECT = 'object',
                BOOLEAN = 'boolean',
                NUMBER = 'number',
                NULL_STR = '',
                KEY_TYPE_ARR = ["volumedownbutton", "volumeupbutton",
                    "searchbutton", "menubutton",
                    "backbutton", "homebutton"
                ];

            var API_NAMES = {
                loadUrl: 'BasePlugin.loadUrl',
                close: 'BasePlugin.close',
                goBack: 'BasePlugin.goBack',
                exit: 'BasePlugin.exit',
                request: 'RoutePlugin.request',
                networkType: 'BasePlugin.getNetworkType',
                bindButton: 'BasePlugin.bindButton',
                unbindButton: 'BasePlugin.unbindButton'
            }

            var request = function() {};

            /**
             * 请求统一路由
             * @param {Object} opt
             * opt{
             * 	method:'', 请求方法
             *  params:{}, 请求参数
             *  success: function(res){}, 成功回调
             *  fail: function(res){} 失败回调
             * }
             */
            request.mServer = function(opt) {
                var obj = utils.checkParam(opt),
                    args = {};

                if (!obj.method) {
                    throw new Error('The arguments "method" is required and connot be null!');
                }

                utils.checkParamsType({
                    name: 'method',
                    value: obj.method,
                    type: STRING
                });
                utils.checkParamsType({
                    name: 'timeout',
                    value: obj.timeout,
                    type: NUMBER
                });

                args.t = obj.timeout || 8000;
                args.m = obj.method;

                if (obj.params && utils.isNotObject(obj.params)) {
                    throw new Error('The arguments "params" type must be object!');
                }

                if (!utils.isEmptyObject(obj.params)) {
                    args.p = obj.params;
                }

                obj.params = args;
                croods.exec(API_NAMES.request, obj);
            };

            /**
             * 调用自定义插件方法
             * @param {Object}
             * @param {Object} opt
             * opt {
             *   action: xxx.xx 自定义插件名称
             * 	 params: {}可选  自定义插件参数
             * 	 success： function(){} 可选 自定义插件成功回调
             * }
             */
            request.customPlugin = function(opt) {
                var obj = utils.checkParam(opt);

                if (!obj.action) {
                    throw new Error('The arguments "action" is required!');
                }

                if (typeof obj.action !== STRING || obj.action.indexOf('.') == -1) {
                    throw new Error('The arguments "action" type must be string, like:' +
                        '"PluginName.ActionName"!');
                }

                if (obj.params && utils.isNotObject(obj.params)) {
                    throw new Error('The arguments "params" type must be object!');
                }

                croods.exec(obj.action, obj);
            }

            var page = function() {};

            /**
             * 页面跳转
             * @param  url 跳转地址
             * @param  isClose 是否关闭当前页，默认false
             */
            page.load = function(opt) {
                var obj = utils.checkParam(opt);
                utils.checkParamsType({
                    name: 'url',
                    value: obj.url,
                    type: STRING
                });

                obj.params = {
                    url: obj.url,
                    close: obj.close || false
                }
                croods.exec(API_NAMES.loadUrl, obj);
            }

            /**
             * 页面关闭
             */
            page.close = function(opt) {
                var obj = utils.checkParam(opt);
                obj.params = {};

                utils.checkParamsType({
                    name: 'callback',
                    value: obj.callback,
                    type: STRING
                });

                obj.params.callback = obj.callback || NULL_STR;
                croods.exec(API_NAMES.close, obj);
            }

            /**
             * 页面退出
             */
            page.exit = function() {
                croods.exec(API_NAMES.exit, {});
            }

            /**
             * 页面返回
             */
            page.back = function() {
                croods.exec(API_NAMES.goBack, {});
            }

            var base = function() {};

            /**
             * 检查API是否存在
             * @param {Object} opt
             */
            base.checkJsApi = function(opt) {
                var obj = utils.checkParam(opt);

                var apis = obj.jsApiList,
                    api = [],
                    result = {};

                if (!(apis instanceof Array)) {
                    throw new Error('The arguments "jsApiList" type must be array!');
                }

                for (var i = 0; i < apis.length; i++) {
                    api = apis[i].split('.');
                    result[apis[i]] = false;

                    for (var o in croods) {
                        if (o == api[0]) {
                            //判断是否子方法
                            if (typeof croods[o] === OBJECT && api[1]) {
                                for (var c in croods[o]) {
                                    if (c == api[1]) {
                                        result[apis[i]] = true;
                                    }
                                }
                            } else {
                                result[apis[i]] = true;
                            }
                        }
                    }
                }

                typeof obj.success === FUNCTION && obj.success(result);
            }

            /**
             * 获取网络类型
             */
            base.netWorkType = function(opt) {
                croods.exec(API_NAMES.networkType, utils.checkParam(opt));
            }

            /**
             * 绑定android物理按键
             * opt：{
             *   keycode: ["volumedownbutton", "volumeupbutton",
             *				"searchbutton", "menubutton",
             *					"backbutton", "homebutton"],
             * 	 success: function(res){
             *		res.action: 指定某个按钮
             *	 }
             * }
             */
            base.bindButton = function(opt) {
                base.buttonEventTrigger(API_NAMES.bindButton, opt);
            }

            /**
             * 解绑物理按键
             * opt：{
             *   keycode: ["volumedownbutton", "volumeupbutton",
             *				"searchbutton", "menubutton",
             *					"backbutton", "homebutton"],
             * 	 success: function(res){
             *		res.action: 指定某个按钮
             *	 }
             * }
             */
            base.unbindButton = function(opt) {
                base.buttonEventTrigger(API_NAMES.unbindButton, opt);
            }

            /**
             * 物理按键事件触发
             */
            base.buttonEventTrigger = function(eventName, opt) {
                var obj = utils.checkParam(opt);
                obj.params = {};

                if (!obj.keycode) {
                    throw new Error('The arguments "keycode" is required and cannot be null!');
                }

                if (obj.keycode instanceof Array) {

                    if (obj.keycode.length === 0) {
                        throw new Error('The arguments "keycode" cannot be null!');
                    }

                    obj.keycode = obj.keycode.unique();
                    for (var i = 0, len = obj.keycode.length; i < len; i++) {
                        if (!utils.inArray(obj.keycode[i], KEY_TYPE_ARR)) {
                            throw new Error('The arguments "keycode" value "' + obj.keycode[i] +
                                '" invalid!');
                        }
                    }

                } else {
                    throw new Error('The arguments "keycode" type must be array !');
                }

                obj.params.keycode = obj.keycode;
                croods.exec(eventName, obj);
            }

            croods.ajax = request.mServer;

            croods.loadUrl = page.load;
            croods.goBack = page.back;
            croods.pageClose = page.close;
            croods.exit = page.exit;

            croods.checkJsApi = base.checkJsApi;
            croods.getNetworkType = base.netWorkType;

            croods.bindButton = base.bindButton;
            croods.unbindButton = base.unbindButton;
        }, {
            "./croods.core": 2,
            "./croods.utils": 9
        }
    ],
    2: [
        function(require, module, exports) {
            /**
             * croods.core
             * @author: jingli12
             */
            var utils = require('./croods.utils');

            var ANDROID = 'android',
                IOS = 'ios',
                IPHONE = 'iPhone',
                IPAD = 'iPad',
                FUNCTION = 'function',
                STRING = 'string',
                OBJECT = 'object',
                BOOLEAN = 'boolean',
                NUMBER = 'number',
                TIMEOUT = 'TIMEOUT',
                NULL_STR = '',
                ExecIframe;

            var callbackObj = {

                //Generate callbackId for call api callback function name.
                callbackId: Math.floor(Math.random() * 10000000000),

                //Queue for ios request. 
                commandQueue: [],

                //Object for call api callbacks.
                callbacks: {},

                //callback status code
                callbackStatus: {
                    OK: 10000, //plugin success code
                    CANCEL: 10007, //plugin cancel code
                    TIMEOUT: 10012, //plugin request timeout
                    TIMEOUT_ROUTER: 40001, //plugin request timeout for router
                    OK_ROUTER: 1, //router request success
                    FAIL_ROUTER: 0 //router request fail
                },

                //create callback for invoke
                create: function(callbackId) {
                    window[callbackId] = function(result) {

                        var s = callbackObj.callbackStatus,
                            c = callbackObj.callbacks[callbackId],
                            e = result.code,
                            m = result.message;

                        switch (e) {

                            case s.OK:
                                var o = m ? JSON.parse(m) : {};

                                if (o.status === undefined) {
                                    c.success && c.success(o);
                                    break;
                                }

                                //打开统一路由请求调试
                                utils.Debug.alert(JSON.stringify(result));

                                if (o.status == s.OK_ROUTER) {
                                    c.success && c.success(o.result);
                                    break;
                                }

                                if (o.status == s.FAIL_ROUTER) {
                                    c.fail && c.fail(e + ": " + 　m);
                                }

                                break;

                            case s.CANCEL:
                                c.cancel && c.cancel(result);
                                break;

                            case s.TIMEOUT_ROUTER:
                                result.status = TIMEOUT;
                                break;

                            default:
                                c.fail && c.fail(e + ": " + 　m);
                        }

                        c.complete && c.complete(result);
                    }
                }
            };

            /**
             * croods ExecObj obj
             */
            var ExecObj = {
                /**
                 * Format params for call api.
                 * @param {Object} action
                 * @param {Object} obj
                 */
                args: function(action, obj) {
                    var action = action.split('.'),
                        emptyCallback = NULL_STR,
                        callbackId = action[0] + callbackObj.callbackId++;

                    var callback = {};
                    var param = {
                        service: action[0],
                        action: action[1]
                    };

                    if (typeof obj.success === FUNCTION) {
                        callback.success = obj.success;
                    }

                    if (typeof obj.fail === FUNCTION) {
                        callback.fail = obj.fail;
                    }

                    if (typeof obj.complete === FUNCTION) {
                        callback.complete = obj.complete;
                    }

                    if (typeof obj.cancel === FUNCTION) {
                        callback.cancel = obj.cancel;
                    }

                    if (!utils.isEmptyObject(callback)) {
                        callbackObj.callbacks[callbackId] = callback;
                        callbackObj.create(callbackId);
                        param.callback = callbackId;
                    }

                    param.params = obj.params || {};

                    return param;
                },

                /**
                 * Android invoke
                 * @param {Object} obj
                 */
                android: function(obj) {
                    utils.Debug.log(JSON.stringify(obj));
                    window.prompt('iflytek:' + JSON.stringify(obj));
                },

                /**
                 * IOS invoke
                 * @param {Object} obj
                 */
                ios: function(obj) {
                    callbackObj.commandQueue.push(obj);
                    ExecIframe = ExecIframe || utils.createExecIframe();
                    ExecIframe.src = "iflytek://ready";
                }
            };

            var croods = {};

            croods.CONFIG = {};

            /**
             * invoke api call.
             * @param {Object} action
             * @param {Object} obj
             */
            croods.exec = function(action, obj) {
                ExecObj[utils.agent()](ExecObj.args(action, obj));
            };

            /**
             * 配置
             * @param {Object} opt
             */
            croods.config = function(opt) {
                croods.CONFIG = utils.checkParam(opt);
            };

            /**
             * 获取队列中请求信息
             */
            croods.nativeFetchQueue = function() {
                var commandStr = JSON.stringify(callbackObj.commandQueue);
                callbackObj.commandQueue = [];

                utils.Debug.log(commandStr);
                return commandStr;
            };

            /**
             * 销毁回调
             * @param {Object} callbackId
             */
            croods.callbackDestroy = function(callbackId) {
                delete window[callbackId];
                delete callbackObj.callbacks[callbackId];

                utils.Debug.log('Destroy Function: ' + callbackId);
            };

            module.exports = croods;
        }, {
            "./croods.utils": 9
        }
    ],
    3: [
        function(require, module, exports) {
            var utils = require('./croods.utils'),
                croods = require('./croods.core');

            var FUNCTION = 'function',
                STRING = 'string',
                OBJECT = 'object',
                BOOLEAN = 'boolean',
                NUMBER = 'number',
                NULL_STR = '';

            var API_NAMES = {
                start: 'DownloadPlugin.start',
                listener: 'DownloadPlugin.listener',
                cancel: 'DownloadPlugin.cancel',
                open: 'FilePlugin.open',
                choose: 'FilePlugin.choose',
                upload: 'UploadPlugin.upload'
            }

            var download = function() {};

            /**
             * 开始下载文件
             * @param {Object} opt
             * opt {
             * 	url: "xx",
             *  success: function(e){
             *  }
             * }
             */
            download.start = function(opt) {
                var obj = utils.checkParam(opt);
                obj.params = {};

                if (!obj.url) {
                    throw new Error('The arguments "url" is required and connot be null!');
                }
                utils.checkParamsType({
                    name: 'url',
                    value: obj.url,
                    type: STRING
                });

                obj.params.url = obj.url;
                croods.exec(API_NAMES.start, obj);
            }

            /**
             * 下载文件监听
             * @param {Object} opt
             * opt {
             * 	success: function(msg){
             *    msg.process: "xx",//进度
             *    msg.speed: "xx", //速度
             *    msg.size: "", //文件大小
             *    msg.hasDownSize: "", //已经下载大小
             *    msg.path: "xx"//文件位置
             *  },
             *  fail: function(msg){
             *  }
             * }
             */
            download.listener = function(opt) {
                croods.exec(API_NAMES.listener, utils.checkParam(opt));
            }

            /**
             * 取消下载
             * @param {Object} opt
             */
            download.cancel = function(opt) {
                croods.exec(API_NAMES.cancel, utils.checkParam(opt));
            }

            var file = function() {};

            /**
             * 打开文件
             * @param {Object} opt
             * opt {
             * 	 filePath：文件路径
             * }
             */
            file.open = function(opt) {
                var obj = utils.checkParam(opt);
                obj.params = {};

                if (!obj.filePath) {
                    throw new Error('The arguments "filePath" is required and connot be null!');
                }
                utils.checkParamsType({
                    name: 'filePath',
                    value: obj.filePath,
                    type: STRING
                });

                obj.params.filePath = obj.filePath;
                croods.exec(API_NAMES.open, obj);
            }

            /**
             * 选择文件
             * @param {Object} opt
             * opt {
             *   path:'/sdcard',  指定查找目录
             *   reg: '/.jpg$/', 指定查找规则，正则表示
             *   recursive: true/false 是否递归查找
             * 	 success: function(res){
             * 		res: 文件对象信息，包含文件大小、路径、类型等
             *   }
             * }
             */
            file.choose = function(opt) {
                var obj = utils.checkParam(opt);

                obj.params = {};
                utils.checkParamsType({
                    name: 'path',
                    value: obj.path,
                    type: STRING
                });
                utils.checkParamsType({
                    name: 'reg',
                    value: obj.reg,
                    type: STRING
                });
                utils.checkParamsType({
                    name: 'recursive',
                    value: obj.recursive,
                    type: BOOLEAN
                });

                obj.params.recursive = typeof obj.recursive === BOOLEAN ? obj.recursive : false;
                obj.params.path = obj.path ? obj.path : undefined;
                obj.params.reg = obj.reg ? obj.reg : undefined;
                croods.exec(API_NAMES.choose, obj);
            }

            /**
             * 文件上传
             */
            file.upload = function(opt) {
                var obj = utils.checkParam(opt);
                obj.params = {};

                if (!obj.method) {
                    throw new Error('The arguments "method" is required and connot be null!');
                }

                utils.checkParamsType({
                    name: 'method',
                    value: obj.method,
                    type: STRING
                });
                utils.checkParamsType({
                    name: 'fileSizeLimit',
                    value: obj.fileSizeLimit,
                    type: NUMBER
                });
                obj.params.method = obj.method;

                if (obj.fileSizeLimit) {
                    obj.params.fileSizeLimit = obj.fileSizeLimit;
                }

                if (obj.files && utils.isNotObject(obj.files)) {
                    throw new Error('The arguments "files" type must be object!');
                }

                if (utils.isEmptyObject(obj.files)) {
                    throw new Error('The arguments "files" is required and connot be null!!');
                }
                obj.params.files = obj.files;

                if (obj.formData && utils.isNotObject(obj.formData)) {
                    throw new Error('The arguments "formData" type must be object!');
                }

                if (!utils.isEmptyObject(obj.formData)) {
                    obj.params.formData = obj.formData;
                }

                croods.exec(API_NAMES.upload, obj);
            }

            croods.startDownload = download.start;
            croods.downloadListener = download.listener;
            croods.cancelDownload = download.cancel;

            croods.openFile = file.open;
            croods.chooseFile = file.choose;
            //croods.upload = file.upload;
        }, {
            "./croods.core": 2,
            "./croods.utils": 9
        }
    ],
    4: [
        function(require, module, exports) {
            var croods = require('./croods.core');
            require('./croods.base');
            require('./croods.file');
            require('./croods.location');
            require('./croods.media');
            require('./croods.share');
            require('./croods.storage');
            require('./croods.utils');
            croods.version = '1.2.1';
            window.croods = croods;
            module.exports = croods;
        }, {
            "./croods.base": 1,
            "./croods.core": 2,
            "./croods.file": 3,
            "./croods.location": 5,
            "./croods.media": 6,
            "./croods.share": 7,
            "./croods.storage": 8,
            "./croods.utils": 9
        }
    ],
    5: [
        function(require, module, exports) {
            var utils = require('./croods.utils'),
                croods = require('./croods.core');

            var FUNCTION = 'function',
                STRING = 'string',
                OBJECT = 'object',
                BOOLEAN = 'boolean',
                NUMBER = 'number',
                NULL_STR = '';

            var API_NAMES = {
                open: 'GeoPlugin.open',
                close: 'GeoPlugin.close',
                get: 'GeoPlugin.getLocation'
            }

            var location = {

                /**
                 * 打开定位
                 * @param {Object} opt
                 * opt {
                 *   interval: 代表每隔n秒进行一次定位，默认5000
                 *   success: function(res){
                 * 	   res.acc: 精度,
                 *     res.lng: 经度,
                 *     res.lat: 纬度,
                 *     res.alt: 海拔,
                 *   }
                 * }
                 */
                open: function(opt) {
                    var obj = utils.checkParam(opt);
                    obj.params = {};
                    utils.checkParamsType({
                        name: 'interval',
                        value: obj.interval,
                        type: NUMBER
                    });

                    obj.params.interval = obj.interval || 5000;
                    croods.exec(API_NAMES.open, obj);
                },

                /**
                 * 关闭定位
                 */
                close: function(opt) {
                    croods.exec(API_NAMES.close, utils.checkParam(opt));
                },

                /**
                 * 获取地理位置信息
                 * @param {Object} opt
                 * opt {
                 *   lng: 经度
                 *   lat: 纬度
                 *   success: function(res){
                 *   res:{
                 * 	    nation: xxx,
                 *		province: xxxx,
                 *		city: xxxxx,
                 *		district: xxxxx,
                 *		street: xxxxx,
                 *		streetNum: xxxxx
                 *	}
                 * }
                 */
                get: function(opt) {
                    var obj = utils.checkParam(opt);

                    if (!obj.lng) {
                        throw new Error('The arguments "lng" is required!');
                    }
                    utils.checkParamsType({
                        name: 'lng',
                        value: obj.lng,
                        type: NUMBER
                    });

                    if (!obj.lat) {
                        throw new Error('The arguments "lat" is required!');
                    }
                    utils.checkParamsType({
                        name: 'lat',
                        value: obj.lat,
                        type: NUMBER
                    });

                    obj.params = {
                        lng: obj.lng,
                        lat: obj.lat
                    }

                    croods.exec(API_NAMES.get, obj);
                }
            }

            croods.openLocation = location.open;
            croods.closeLocation = location.close;
            croods.getLocation = location.get;
        }, {
            "./croods.core": 2,
            "./croods.utils": 9
        }
    ],
    6: [
        function(require, module, exports) {
            var utils = require('./croods.utils'),
                croods = require('./croods.core');


            var FUNCTION = 'function',
                STRING = 'string',
                OBJECT = 'object',
                BOOLEAN = 'boolean',
                NUMBER = 'number',
                NULL_STR = '',
                LD_ACTIONS = ["blink", "mouth", "yaw", "nod"],
                IAT_DOMAINS = ["iat", "search", "video", "poi", "music", "asr"],
                IAT_LANGUAGES = ["zh_cn", "en_us"],
                IAT_ACCENTS = ["mandarin", "cantonese", "henanese"];

            var API_NAMES = {
                take: 'ImagePlugin.takePhoto',
                choose: 'ImagePlugin.choose',
                start: 'AudioPlugin.startRecord',
                listener: 'AudioPlugin.recordListener',
                stop: 'AudioPlugin.stopRecord',
                play: 'AudioPlugin.startPlay',
                playListener: 'AudioPlugin.playListener',
                stopVoice: 'AudioPlugin.stopPlay',
                livenessDetect: 'LivenessPlugin.detect',
                startIat: 'SpeechPlugin.startIat',
                stopIat: 'SpeechPlugin.stopIat'
            };

            var photo = {

                /**
                 * 调用摄像头
                 * @param {Object} opt
                 * opt {
                 * 	 success: function(res){
                 * 	   res.filePath: 照片路径
                 *   }
                 * }
                 */
                take: function(opt) {
                    croods.exec(API_NAMES.take, utils.checkParam(opt));
                },

                /**
                 * 选择图片
                 * @param {Object} opt
                 * opt {
                 * 	 count: 选择图片数量，默认为1
                 *   success: function(res){
                 *     res: [{...}] //图片数组，包含图片url等信息
                 *   }
                 * }
                 */
                choose: function(opt) {
                    var obj = utils.checkParam(opt);
                    utils.checkParamsType({
                        name: 'count',
                        value: obj.count,
                        type: NUMBER
                    });

                    obj.params = {
                        count: obj.count || 1
                    };
                    croods.exec(API_NAMES.choose, obj);
                },

                /**
                 * 活体检测
                 * @param {Object} opt
                 * success: function(res){
                 * 	res.photo : xx返回图片地址
                 * }
                 */
                livenessDetect: function(opt) {
                    var obj = utils.checkParam(opt);

                    if (obj.actions) {
                        if (obj.actions instanceof Array) {
                            obj.actions = obj.actions.unique();

                            if (!utils.inArray(LD_ACTIONS[0], obj.actions)) {
                                throw new Error('The arguments "actions" value must has "' +
                                    actions[0] + '"!');
                            }

                            for (var i = 0, len = obj.actions.length; i < len; i++) {
                                if (!utils.inArray(obj.actions[i], LD_ACTIONS)) {
                                    throw new Error('The arguments "actions" value "' + obj
                                        .actions[i] + '" invalid!');
                                }
                            }
                        } else {
                            throw new Error('The arguments "actions" type must be array!');
                        }
                    }

                    utils.checkParamsType({
                        name: 'soundNotice',
                        value: obj.soundNotice,
                        type: BOOLEAN
                    });

                    obj.params = {
                        actions: obj.actions || LD_ACTIONS,
                        soundNotice: typeof obj.soundNotice === BOOLEAN ? obj.soundNotice : true
                    };
                    croods.exec(API_NAMES.livenessDetect, obj);
                }
            };

            var record = {

                /**
                 * 开始录音
                 * @param {Object} opt
                 */
                start: function(opt) {
                    croods.exec(API_NAMES.start, utils.checkParam(opt));
                },

                /**
                 * 录音监听
                 * @param {Object} opt
                 * opt {
                 * 	 success: function(res){
                 * 	   res.volume: 音量大小
                 * 	   res.voiceLen: 录音长度	s
                 *   },
                 *   error: function(res){
                 *
                 *   }
                 * }
                 */
                listener: function(opt) {
                    croods.exec(API_NAMES.listener, utils.checkParam(opt));
                },

                /**
                 * 停止录音
                 * @param {Object} opt
                 * 	 success: function(res){
                 * 	   res.filePath: 录音位置
                 *   },
                 *   error: function(res){
                 *
                 *   }
                 * }
                 *
                 */
                stop: function(opt) {
                    croods.exec(API_NAMES.stop, utils.checkParam(opt));
                }
            };

            var voice = {

                /**
                 * 播放录音
                 * @param {Object} opt
                 * opt {
                 *   filePath:录音文件路径
                 * }
                 */
                play: function(opt) {
                    var obj = utils.checkParam(opt);
                    obj.params = {};

                    if (!obj.filePath) {
                        throw new Error('The arguments "filePath" is required!');
                    }
                    utils.checkParamsType({
                        name: 'filePath',
                        value: obj.filePath,
                        type: STRING
                    });

                    obj.params.filePath = obj.filePath;
                    croods.exec(API_NAMES.play, obj);
                },

                /**
                 * 播放监听
                 * @param {Object} opt
                 * success: function(res){
                 * 	res.currentPosition //当前播放时间点，单位为毫秒
                 * }
                 */
                listener: function(opt) {
                    croods.exec(API_NAMES.playListener, utils.checkParam(opt));
                },

                /**
                 * 停止播放
                 */
                stop: function(opt) {
                    croods.exec(API_NAMES.stopVoice, utils.checkParam(opt));
                }
            }

            var speech = function() {};

            /**
             * 语音合成
             * @params opt
             * opt {
             *   //应用领域 "iat"(普通文本听写)、"search"(热词搜索)、"video"(视频搜索)、"poi"、"music"、"asr"(关键词识别) string 选填
             *   domain: 'iat',
             *   //返回结果的语言 "zh_cn"(中文)、"en_us"(英文) string 选填
             *   language: 'zh_cn',
             *   //语言区域 "mandarin"(中文)、"cantonese"(粤语)、"henanese"(河南话) string 选填 language为英文时，忽略此参数
             *   accent: 'mandarin',
             *   //前端点超时时间（用户多长时间不说话） 0-10000 ms number 选填
             * 	 vadBos: 5000,
             *   //后断点超时时间（用户停止说话多长时间） 1000-10000 ms number 选填
             *   vadEos: 3000,
             *   //是否保存录音 true or false, boolean 选填
             *   isSave: true,
             *   //是否需要标点符号 true or false, boolean 选填
             *   isDot: true,
             * 	 //回调结果
             *   success: function(res) {
             *     res.audioPath: 录音路径,
             *     res.result: 转化文字,
             *     res.volum: 音量大小
             *   }
             * }
             */
            speech.iflyIat = function(opt) {
                var obj = utils.checkParam(opt);

                utils.checkParamsType({
                    name: 'domain',
                    value: obj.domain,
                    type: STRING
                });

                if (obj.domain && !utils.inArray(obj.domain, IAT_DOMAINS)) {
                    throw new Error('The arguments "domain" value invalid!');
                }

                utils.checkParamsType({
                    name: 'language',
                    value: obj.language,
                    type: STRING
                });

                if (obj.language && !utils.inArray(obj.language, IAT_LANGUAGES)) {
                    throw new Error('The arguments "language" value invalid!');
                }

                utils.checkParamsType({
                    name: 'accent',
                    value: obj.accent,
                    type: STRING
                });

                if (obj.accent && !utils.inArray(obj.accent, IAT_ACCENTS)) {
                    throw new Error('The arguments "accent" value invalid!');
                }

                utils.checkParamsType({
                    name: 'vadBos',
                    value: obj.vadBos,
                    type: NUMBER
                });

                if (obj.vadBos && (obj.vadBos < 1000 || obj.vadBos > 10000)) {
                    throw new Error('The arguments "vadBos" value between 1000 and 10000!');
                }

                utils.checkParamsType({
                    name: 'vadEos',
                    value: obj.vadEos,
                    type: NUMBER
                });

                if (obj.vadEos && (obj.vadEos < 0 || obj.vadEos > 10000)) {
                    throw new Error('The arguments "vadEos" value between 0 and 10000!');
                }

                utils.checkParamsType({
                    name: 'isSave',
                    value: obj.isSave,
                    type: BOOLEAN
                });
                utils.checkParamsType({
                    name: 'hasDot',
                    value: obj.hasDot,
                    type: BOOLEAN
                });

                obj.params = {
                    domain: obj.domain ? obj.domain : undefined,
                    language: obj.language ? obj.language : undefined,
                    accent: obj.accent ? obj.accent : undefined,
                    vadBos: obj.vadBos && String(obj.vadBos),
                    vadEos: obj.vadEos && String(obj.vadEos),
                    isSave: obj.isSave,
                    hasDot: obj.hasDot
                };
                croods.exec(API_NAMES.startIat, obj);
            }

            croods.takePhoto = photo.take;
            croods.chooseImage = photo.choose;
            croods.livenessDetect = photo.livenessDetect;

            croods.startRecord = record.start;
            croods.recordListener = record.listener;
            croods.stopRecord = record.stop;

            croods.playVoice = voice.play;
            croods.playListener = voice.listener;
            croods.stopVoice = voice.stop;

            croods.iflyIat = speech.iflyIat;
















        }, {
            "./croods.core": 2,
            "./croods.utils": 9
        }
    ],
    7: [
        function(require, module, exports) {
            var utils = require('./croods.utils'),
                croods = require('./croods.core');

            var FUNCTION = 'function',
                STRING = 'string',
                OBJECT = 'object',
                BOOLEAN = 'boolean',
                NUMBER = 'number',
                NULL_STR = '';

            var API_NAMES = {
                shareContent: 'SharePlugin.shareContent',
                setPlatformConfig: 'SharePlugin.setPlatformConfig'
            }

            var ShareSDK = function() {}

            /**
             * 平台类型
             * @type {object}
             */
            ShareSDK.sharePlatform = {
                QQ: 1,
                QZone: 2,
                SinaWeibo: 3, //Sina Weibo
                WeChatSession: 4,
                WeChatTimeline: 5,
                WeChatFav: 6
            };

            /**
             * 内容分享类型
             * @type {object}
             */
            ShareSDK.shareType = {
                Text: 0,
                Image: 1,
                WebPage: 2,
                Music: 3,
                Video: 4,
                Apps: 5,
                File: 6
            };

            /**
 * 分享内容
 * @param {Object} opt
 * {
 * 	platform: croods.sharePlatform.SinaWeibo,
	shareParams: {
		type: croods.shareType.Text,
		text: '测试一下分享',
		url: 'http://www.baidu.com',
		title: '测试',
		titleUrl: '',
		site: ''
		siteUrl:''
		imageUrl: ''
	},
	success: function(res){	
	}
}
 */
            ShareSDK.shareContent = function(opt) {
                var obj = utils.checkParam(opt);

                if (!obj.platform) {
                    throw new Error('The arguments "platform" is required !');
                }
                utils.checkParamsType({
                    name: 'platform',
                    value: obj.platform,
                    type: NUMBER
                });

                if (!obj.shareParams) {
                    throw new Error('The arguments "shareParams" is required!');
                }

                if (utils.isNotObject(obj.shareParams)) {
                    throw new Error('The arguments "shareParams" type must be object!');
                }

                if (typeof obj.shareParams.type !== NUMBER) {
                    throw new Error(
                        'The arguments "shareParams.type" is required and type must be number!'
                    );
                }

                if (!obj.shareParams.text) {
                    throw new Error('The arguments "shareParams.text" is required!');
                }
                utils.checkParamsType({
                    name: 'shareParams.text',
                    value: obj.shareParams.text,
                    type: STRING
                });

                obj.params = {
                    platform: obj.platform,
                    shareParams: obj.shareParams
                }
                croods.exec(API_NAMES.shareContent, obj);
            };

            /**
             * 设置平台配置
             * @param {Object} opt
             */
            ShareSDK.setPlatformConfig = function(opt) {
                var obj = utils.checkParam(opt);

                if (typeof obj.platform !== NUMBER) {
                    throw new Error(
                        'The arguments "platform" is required and type must be number!');
                }

                if (!obj.config) {
                    throw new Error('The arguments "config" is required!');
                }

                if (utils.isNotObject(obj.config)) {
                    throw new Error('The arguments "config" type must be object!');
                }

                obj.params = {
                    platform: obj.platform,
                    config: obj.config
                }
                croods.exec(API_NAMES.setPlatformConfig, obj);
            };

            croods.sharePlatform = ShareSDK.sharePlatform;
            croods.shareType = ShareSDK.shareType;

            croods.shareContent = ShareSDK.shareContent;
            croods.setPlatformConfig = ShareSDK.setPlatformConfig;



        }, {
            "./croods.core": 2,
            "./croods.utils": 9
        }
    ],
    8: [
        function(require, module, exports) {
            var utils = require('./croods.utils'),
                croods = require('./croods.core');

            var FUNCTION = 'function',
                STRING = 'string',
                OBJECT = 'object',
                BOOLEAN = 'boolean',
                NUMBER = 'number',
                NULL_STR = '';

            var API_NAMES = {
                add: 'StoragePlugin.add',
                get: 'StoragePlugin.get',
                getAll: 'StoragePlugin.getAll',
                remove: 'StoragePlugin.remove',
                removeAll: 'StoragePlugin.removeAll',
            }

            croods.storage = {
                /**
                 * add data
                 * @param {Object} opt
                 */
                add: function(opt) {
                    var obj = utils.checkParam(opt);

                    if (!obj.params || utils.isEmptyObject(obj.params)) {
                        throw new Error('The arguments "params" is required!');
                    }

                    if (utils.isNotObject(obj.params)) {
                        throw new Error('The arguments "params" type must be object!');
                    }

                    croods.exec(API_NAMES.add, obj);
                },

                /**
                 * get data
                 * @param {Object} opt
                 */
                get: function(opt) {
                    var obj = utils.checkParam(opt);
                    obj.params = {};

                    if (!obj.key) {
                        throw new Error('The arguments "key" is required!');
                    }
                    utils.checkParamsType({
                        name: 'key',
                        value: obj.key,
                        type: STRING
                    });

                    obj.params.key = obj.key;
                    croods.exec(API_NAMES.get, obj);
                },

                /**
                 * get all
                 * @param {Object} opt
                 */
                getAll: function(opt) {
                    croods.exec(API_NAMES.getAll, utils.checkParam(opt));
                },

                /**
                 * remove data
                 * @param {Object} opt
                 */
                remove: function(opt) {
                    var obj = utils.checkParam(opt);
                    obj.params = {};

                    if (!obj.key) {
                        throw new Error('The arguments "key" is required!');
                    }
                    utils.checkParamsType({
                        name: 'key',
                        value: obj.key,
                        type: STRING
                    });

                    obj.params.key = obj.key;
                    croods.exec(API_NAMES.remove, obj);
                },

                /**
                 * remove all
                 * @param {Object} opt
                 */
                removeAll: function(opt) {
                    croods.exec(API_NAMES.removeAll, utils.checkParam(opt));
                }
            }
        }, {
            "./croods.core": 2,
            "./croods.utils": 9
        }
    ],
    9: [
        function(require, module, exports) {
            /**
             * croods 工具包
             * @author jingli12
             */

            var utils = {};

            var ANDROID = 'android',
                IOS = 'ios',
                IPHONE = 'iPhone',
                IPAD = 'iPad',
                ARRAY = 'array',
                OBJECT = 'object';

            /**
             * check e is in arr
             * @param {Object} e
             * @param {Object} arr
             */
            utils.inArray = function(e, arr) {
                if (arr && arr instanceof Array) {
                    for (var i = 0; i < arr.length; i++) {
                        if (e == arr[i]) {
                            return true;
                        }
                    }
                    return false;
                }
                return false;
            }

            /**
             * check array
             */
            Array.prototype.unique = function() {
                var arr = [],
                    obj = {};

                for (var i = 0; i < this.length; i++) {
                    if (!obj[this[i]]) {
                        arr.push(this[i]);
                        obj[this[i]] = 1;
                    }
                }
                return arr;
            }

            /**
             * check object is empty
             * @param {Object} e
             */
            utils.isEmptyObject = function(e) {
                for (var t in e) return false;
                return true;
            }

            /**
             * check isNotObject
             * @param {Object} o
             */
            utils.isNotObject = function(o) {
                if (typeof o !== OBJECT || o instanceof Array) {
                    return true;
                }
                return false;
            }

            /**
             * check request param
             * @param {Object} opt
             */
            utils.checkParam = function(opt) {
                var obj = opt || {};
                if (utils.isNotObject(obj)) {
                    throw new Error('The arguments type must be object!');
                }
                return obj;
            }

            /**
             * checkParamsType
             * @param value
             * @param type
             */
            utils.checkParamsType = function(obj) {
                if (obj.value && obj.type && typeof obj.value !== obj.type) {
                    throw new Error('The arguments "' + obj.name + '" type must be ' + obj.type +
                        '!');
                }
            }

            /**
             * check userAgent
             */
            utils.agent = function() {
                var agent = navigator.userAgent,
                    os = ANDROID;
                if (agent.indexOf(IPHONE) != -1 ||
                    agent.indexOf(IPAD) != -1) {
                    os = IOS;
                }
                return os;
            }

            /**
             * create iframe for ios invoke
             */
            utils.createExecIframe = function() {
                var iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = '';
                document.body.appendChild(iframe);
                return iframe;
            }

            /**
             * 调试输出
             */
            utils.Debug = {
                log: function(msg) {
                    if (croods.CONFIG.debug) {
                        console.log(msg);
                    }
                },
                alert: function(msg) {
                    if (croods.CONFIG.debug) {
                        window.alert(msg);
                    }
                }
            }

            /**
             * 判断是否微信agent
             */
            utils.isWXAgent = function() {
                var ua = navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    return true;
                } else {
                    return false;
                }
            }

            module.exports = utils;
        }, {}
    ]
}, {}, [4]);

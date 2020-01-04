import wepy from 'wepy';
export default class Utils {
    constructor() {}

    static getDateDiff(dateStr) {
        var publishTime = dateStr / 1000,
            d_seconds,
            d_minutes,
            d_hours,
            d_days,
            timeNow = parseInt(new Date().getTime() / 1000),
            d,

            date = new Date(publishTime * 1000),
            Y = date.getFullYear(),
            M = date.getMonth() + 1,
            D = date.getDate(),
            H = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds();

        if (M < 10) {
            M = '0' + M;
        }
        if (D < 10) {
            D = '0' + D;
        }
        if (H < 10) {
            H = '0' + H;
        }
        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }

        d = timeNow - publishTime;
        d_days = parseInt(d / 86400);
        d_hours = parseInt(d / 3600);
        d_minutes = parseInt(d / 60);
        d_seconds = parseInt(d);

        if (d_days > 0 && d_days < 3) {
            return d_days + '天前';
        } else if (d_days <= 0 && d_hours > 0) {
            return d_hours + '小时前';
        } else if (d_hours <= 0 && d_minutes > 0) {
            return d_minutes + '分钟前';
        } else if (d_seconds < 60) {
            if (d_seconds <= 0) {
                return '刚刚';
            } else {
                return d_seconds + '秒前';
            }
        } else if (d_days >= 3 && d_days < 30) {
            return M + '-' + D + ' ' + H + ':' + m;
        } else if (d_days >= 30) {
            return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
        }
    }
    static throttle(fn, gapTime) { // 防止重复点击导致页面多次跳转
        if (gapTime == null || gapTime == undefined) {
            gapTime = 1500;
        }
        let _lastTime = null;
        return function() {
            let _nowTime = +new Date();
            if (_nowTime - _lastTime > gapTime || !_lastTime) {
                fn.apply(this, arguments); //将this和参数传给原函数
                _lastTime = _nowTime;
            }
        };
    }

    static starCount(count) { //计算评星数量, 进而转化为数组
        var starNum = count * 10 / 10,
            stars = [],
            i = 0;
        do {
            if (starNum >= 1) {
                stars[i] = 'full';
            } else if (starNum >= 0.1) {
                stars[i] = 'half';
            } else {
                stars[i] = 'no';
            }
            starNum--;
            i++;
        } while (i < 5);
        return stars;
    }

    static setStorage(key, value) {
        wx.setStorage({
            key: key,
            data: value
        });
    }

    static getStorage(key) {
        return wx.getStorageSync(key);
    }

    static removeStorage(key) {
        wx.removeStorage({
            key: key
        })
    }

    static testEmail(email) {
        var reg = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$');
        return reg.test(email);
    }

    static testPhone(phone) {
        var reg = new RegExp('^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$');
        return reg.test(phone);
    }

    static showToast(content) {
        wepy.showToast({
            title: content,
            icon: 'none',
            duration: 1500,
            mask: false,
        });
    }

    static showModal({
        content,
        callback
    }) {
        wx.showModal({
            title: '提示',
            content: content,
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: res => {
                if (res.confirm) {
                    callback && callback();
                }
            }
        });
    }

    static saveImg({
        url
    }) { //保存图片到本地相册
        let that = this;
        wx.getImageInfo({
            src: url,
            success(res) {
                that.showModal({
                    content: '保存图片到相册',
                    callback: () => {
                        wx.saveImageToPhotosAlbum({
                            filePath: res.path,
                            success: () => {
                                that.showToast("保存成功,请前往相册查看");
                            }
                        });
                    }
                });
            }
        });
    }

    static isLogin({
        callbackOk,
        callbackErr
    }) {
        let that = this;
        wx.getSetting({
            success: function(res) {
                if (res.authSetting['scope.userInfo']) { //已经授权
                    if (that.getStorage('token')) {
                        callbackOk && callbackOk();
                    } else {
                        callbackErr && callbackErr();
                    }
                } else {
                    callbackErr && callbackErr();
                }
            },
            fail: function() {
                wx.showToast({
                    icon: 'none',
                    title: '系统错误'
                })
            }
        });
    }
    static delPoint(num) {
        console.log(num)

    }

    static cnnumtonum(chnStr) {
        var chnNumChar = {
            零: 0,
            一: 1,
            二: 2,
            三: 3,
            四: 4,
            五: 5,
            六: 6,
            七: 7,
            八: 8,
            九: 9
        };
        var chnNameValue = {
            十: {
                value: 10,
                secUnit: false
            },
            百: {
                value: 100,
                secUnit: false
            },
            千: {
                value: 1000,
                secUnit: false
            },
            万: {
                value: 10000,
                secUnit: true
            },
            亿: {
                value: 100000000,
                secUnit: true
            }
        };

        var expNumChar = {
            十: 10,
            十一: 11,
            十二: 12,
            十三: 13,
            十四: 14,
            十五: 15,
            十六: 16,
            十七: 17,
            十八: 18,
            十九: 19
        };
        if (expNumChar[chnStr]) {
            return expNumChar[chnStr];
        }
        var rtn = 0;
        var section = 0;
        var number = 0;
        var secUnit = false;
        var str = chnStr.split('');
        for (var i = 0; i < str.length; i++) {
            var num = chnNumChar[str[i]];
            if (typeof num !== 'undefined') {
                number = num;
                if (i === str.length - 1) {
                    section += number;
                }
            } else {

                var cunit = chnNameValue[str[i]];

                if (typeof cunit == 'undefined') {
                    return false;
                }
                var unit = chnNameValue[str[i]].value;
                secUnit = chnNameValue[str[i]].secUnit;
                if (secUnit) {
                    section = (section + number) * unit;
                    rtn += section;
                    section = 0;
                } else {
                    section += (number * unit);
                }
                number = 0;
            }
        }
        return rtn + section;
    }

    static dateStamp(stamp) {
        var date = new Date(stamp);
        　　var seperator1 = "-";
        　　var seperator2 = ":";
        　　var month = date.getMonth() + 1<10? "0"+(date.getMonth() + 1):date.getMonth() + 1;
        　　var strDate = date.getDate()<10? "0" + date.getDate():date.getDate();
        　　var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        　　　　+ " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
        　　return currentdate;
    }
}

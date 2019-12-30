import wepy from 'wepy';
//const BASE_URL = 'https://api.dayuyanwo.com/api/';
const BASE_URL = 'http://apitest.dayuyanwo.com/api/';
//const BASE_URL = 'http://admintest.dayuyanwo.com/api/';
export default class Request{
    constructor() {}
    async wxRequest_post(params, acticon) {
        wx.showNavigationBarLoading();
        let res = await wepy.request({
            url: BASE_URL + acticon, //开发者服务器接口地址",
            data: params, //请求的参数",
            method: 'POST',
            dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
            header: { 'Content-Type': 'application/json' }
        });
        wx.hideNavigationBarLoading();
        return res.data;
    }
    async wxRequest_get(params, acticon) {
        wx.showNavigationBarLoading();
        let res = await wepy.request({
            url: BASE_URL + acticon, //开发者服务器接口地址",
            data: params, //请求的参数",
            method: 'GET',
            dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
            header: { 'Content-Type': 'application/json' }
        });
        wx.hideNavigationBarLoading();
        return res.data;
    }
    async wxRequest_token(params, acticon) {  //需授权的请求
        wx.showNavigationBarLoading();
        let token = wepy.Utils.getStorage("token");
        let res = await wepy.request({
            url: BASE_URL + acticon + "?token=" + token,
            data: params,
            method: 'POST',
            header: { 'Content-Type': 'application/json' }
        });
        wx.hideNavigationBarLoading();
        return res.data;
    }
    /**
     * 上传图片, 带有上传进度  参考用法--页面 subPagesA/pages/evaluate.wpy  addUpImgHandle(), submitHandle()
     * @param {* 后台接口路径} acticon
     * @param {* 调起相册选完图片后, 返回临时图片信息的数组, 循环时的索引} j
     * @param {* 对 临时图片信息的数组 经过处理 存放到自己声明的数组中} upload_picture_list
     * @param {* this} that
     * @param {* 回调函数} cb
     */
    upload_file_server(acticon, j, upload_picture_list, that, cb) {
        let token = wx.getStorageSync("token");
        const upload_task = wx.uploadFile({
            url: COMMON_URL + acticon + "?token=" + token,
            name: "file",
            formData: {
                'name': 'file',
                'sort': j
            },
            filePath: upload_picture_list[j]['path'],
            success: function(res) {
                var data = JSON.parse(res.data);
                if (data.code == 0) {
                    var imgUrl = data.data.imgUrl;
                    upload_picture_list[j]['path_server'] = imgUrl;
                    that.$apply();
                    if (j == upload_picture_list.length - 1) {
                        cb && cb(upload_picture_list);
                    }
                }
            },
            fail: (err) => {
                console.log('失败', err)
            },
        });
        upload_task.onProgressUpdate((res) => {
            upload_picture_list[j]['upload_percent'] = res.progress;
        });
    }
    /**
     * successUp-成功个数
     * failUp  -- 失败个数
     * i -- 循环索引
     * filePaths --临时路径的数组
     * saveFilePath -- 存储网络路径的数组
     * length -- 临时数组的长度
     * cb --回调函数
     * action --接口路径
     */
    wxUploadImg(successUp, failUp, i, filePaths, saveFilePath, length, cb, action) {
        let token = wx.getStorageSync("token");
        wx.uploadFile({
            url: COMMON_URL + action + "?token="+token,
            name: "imgfile",
            formData: {
                'name': 'imgfile',
                'formData': '{"sort": 0}'
            },
            filePath: filePaths[i],
            success: (res) =>{
                successUp++;
            },
            fail: (res) => {
                failUp++;
            },
            complete: (res) => {
                let data = JSON.parse(res.data);
                if (data.code === 0) {
                    saveFilePath.push(data.data.imgUrl);
                    i++;
                    if(i == length) {
                        cb && cb(saveFilePath);
                    } else{
                        wxUploadImg(successUp, failUp, i, filePaths, saveFilePath, length, cb, action);
                    }
                } else {
                    saveFilePath.push({id: i, tempUrl: filePaths[i], msg: 'error'});
                    i++;
                    if(i == length) {
                        cb && cb(saveFilePath);
                    } else{
                        wxUploadImg(successUp, failUp, i, filePaths, saveFilePath, length, cb, action);
                    }
                }
            }
        });
    }
}

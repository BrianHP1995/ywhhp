import Request from './request';
export default class Api{
    constructor() {
        this.request = new Request();
    }
    /**系统相关 */

    user_login(params) { //首页_活动精选
        return this.request.wxRequest_post(params, 'login/login');
    }
    get_homeBanner(params) {
        return this.request.wxRequest_get(params,'open/getBanners');
    }
    /** 用户相关 */

    //获取用户收货地址列表
    getAddressList(params) {
        return this.request.wxRequest_token({}, 'address/getAddressList')
    }
    //添加收获地址
    addAddress(params) {
        return this.request.wxRequest_token(params, 'address/createAddress')
    }
    //获取默认收货地址列表
    getDefaultAddress(params) {
        return this.request.wxRequest_token(params, 'address/getDefaultAddress')
    }
    //跟据id获取收货地址列表
    getAddressById(params) {
        return this.request.wxRequest_token(params, 'address/getAddressById')
    }

    //修改收货地址
    editAddress(params) {
        return this.request.wxRequest_token(params, 'address/editAddress')
    }
    //设置默认收货地址
    setDefaultAddress(params) {
        return this.request.wxRequest_token(params, 'address/updateDefaultAddress')
    }
    //获取个人优惠券
    getUserCoupon(params) {
        return this.request.wxRequest_token({}, 'coupon/getCoupon')
    }
    //获取用户信息
    getUserInfo(params) {
        return this.request.wxRequest_token({}, 'member/getMemberInfo')
    }

    /**商品相关 */

    //获取商品分类列表
    getGoodsCateList(params) {
        return this.request.wxRequest_get({},'open/getCate');
    }
    //获取商品列表
    getGoodsList(params) {
        return this.request.wxRequest_post({}, 'open/getGoodsList');
    }
    //跟据id获取商品详情
    getGoodsDetail(params) {
        return this.request.wxRequest_post(params, 'open/getGoodsDetail');
    }
    //获取购物车数据
    getGoodsShoppingCart(params) {
        return this.request.wxRequest_token({}, 'car/getCar')
    }
    //添加购物车
    addGoodsToShoppingCart(params) {
        return this.request.wxRequest_token(params, 'car/addCar')
    }
    //清除购物车
    clearShoppingCart(params) {
        return this.request.wxRequest_token({}, 'car/clearCar')
    }
    //购物车减少
    delGoodsFromShoppingCart(params) {
        return this.request.wxRequest_token(params, 'car/reduceCar')
    }

    /** 订单相关 */

    //创建配送订单
    createDeliveryOrder(params) {
        return this.request.wxRequest_token(params, 'order/createOrder')
    }
    //获取配送订单列表
    getDispatchOrderList(params) {
        return this.request.wxRequest_token({}, 'member/getOrder')
    }
    //获取配送订单信息
    getDispatchOrderDetail(params) {
        return this.request.wxRequest_token(params, 'member/getOrderDetail')
    }
}

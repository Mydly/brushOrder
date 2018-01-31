

const TypeName = {
    changeTab:'Change_Tab'
};

const PageKey = {
    daohang:[
        {key:'index',title:'首页',img:'FaHome'},
        {key:'trade',title:"交易中心",img:'FaMailForward'},
        {key:'finan',title:"财务中心",img:'FaMailReply'},
        {key:'safe',title:"安全中心",img:'FaCog'}
    ],
    login:[
        {key:'login',title:'登录'},
        {key:'register',title:'注册'}
    ],
    finan:[
        {key:'caichan',title:'我的财产'},
        {key:'charge',title:'账户充值'},
        {key:'withdraw',title:'账户提现'},
        {key:'coinin',title:'转入虚拟币'},
        {key:'coinout',title:'转出虚拟币'},
        {key:'weituo',title:'委托管理'},
        {key:'tradelog',title:'成交记录'}
    ],
    safeAccount:{key:'safe/account',title:"账户预览"},        //账户预览
    safePsd:{key:'safe/psd',title:"登录密码"},
    safeAddress:{key:'safe/address',title:'收货地址'},
    finanInfo:{key:'finan/info',title:"我的财产"},        //账户预览
    finanCharge:{key:'finan/charge',title:"账户充值"},
    finanMoney:{key:'finan/money',title:'账户提现'},
    finanIn:{key:'finan/in',title:"虚拟币转入"},
    finanOut:{key:'finan/out',title:"虚拟币转出"},
    issue:{key:'issue',title:'认购中心'},
    money:{key:'money',title:'理财中心'},
    vote:{key:'vote',title:'新币投票'}

}

const trade_area ={
    cny:'trade_area_cny',
    usd:'trade_area_usd'
}

//const NavRouter = {
//    'Index'
//}

const DEFAULT_STATE = {
    token: null,
    id: null,
};

const Event = {
    loginOpen:'LoginOpen',
}

const Login = {
    logining:'Logining',
    logined:'Logined',
    loginSuc:'Login_success',
    loginFail:'Login_fail',
    loginErr:'Login_error'
}

const CacheName = {
    userid:"USERID",
    key:"PRIVATE_PUBLIC_KEY",   //公钥和私钥
    token:"USER_TOKEN",         //Token
    password:"USER_PASSWORD",   //用户密码
    secret:"USER_SECRET",     //用户密码+公钥+私钥
    lang:"APP_LANG",            //app语言
    coinName:"COINNAME",        //币种名

    apiSettings:"API_Settings",  //存储API的字段
    selectMarket:"selectMarket",  //已选择的市场
    buyOrderSetting:"buyOrderSetting", //买单存储设置
    sellOrderSetting:"sellOrderSetting" //卖单存储设置
}

const API = {
    startGetUserInfo:"StartGetUserInfo",
    failGetUserInfo:"FinishGetUserInfo",
    successGetUserInfo:"successGetUserInfo",
    startGetMyFinan:"StartGetMyFinan",
    failGetMyFinan:"FinishGetMyFinan",
    successGetMyFinan:"successGetMyFinan",

    requestAllMarket:"RequestAllMarket",
    requestBalance:"RequestBalance",
    requestTradeLog:"requestTradeLog"

}

const AlertType = {
    errorAlert:"ErrorAlert",
    warningAlert:"WarningAlert",
    infoAlert:"InfoAlert",
    successAlert:"SuccessAlert",
    cancelAlert:"CancelAlert"
}

const ChangeTabOfFinan = {
    charge:"ChangeTabOfFinan_ChargePage"
}

const Actions = {
    newseed:"NEWSEED",
    getinfo:"GETINFO",
    getTrans:"getTrans_log",
    getAddressList:"GETADDRESSLIST",
    createNewAddress:"CREATE_NEW_ADDRESS",
    createNewAddressFail:"CREATE_NEW_ADDRESS_FAIL",
    createNewAddressSuccess:"CREATE_NEW_ADDRESS_SUCCESS",
    cancelAlertStatus:"cancelAlertStatus",
    sendAlert:"sendAlert_action",
    cancelAlert:"cancelAlert_action",
    requestCoinList:"requestCoinList",
    selectCoin:"selectCoin",
    selectLang:"selectLang",
    transDone:"transDone",

    saveAPISettings:"saveAPISettings",
    showMsg:"showMsgAction",
    cancelMsg:"cancelMsgAction",
    showLoad:"showLoadAction",
    removeLoad:"removeLoadAction",
    addLog:"addRunLog",
    cancelGuadan:"cancelGuadan"
}

const consts = {
    action:Actions,
    type:TypeName,
    login:Login,
    alert:AlertType,
    api:API,
    pageKey:PageKey,
    chageTabFinan:ChangeTabOfFinan,
    cacheName:CacheName,
    tradeArea:trade_area
}

module.exports = consts;


import { connect } from 'react-redux';
import React from 'react';
import querystring from 'querystring';

import '../static/style/common.scss';

const electron = require('electron');
const app = electron.app || electron.remote.app;

import CONSTS from '../config/consts';
import { getWalletInfo } from '../actions/topNav';
import COMMON from '../function/common';



import Config from '../config/config';

import Request from './requests';
import myReq from 'mydly-request';
import myCheck from 'mydly-check';
// import mydlyui  from '../component/mydlyui/index.js';
import TradeWatch from '../component/order/TradeWatch';
import TradeSetting from '../component/order/TradeSetting';

import TradeApi from './api';
import {showMsg, cancelMsg} from '../actions/alert';

import { Menu, Icon, message, Form, Spin,Alert} from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const assert = require('assert');

class RouteList extends React.Component{
    constructor(props) {
        super(props);

        let {host=0,
            userid=0,
            publicKey=0,
            privateKey=0} = this.props;
        this.tradeApi = null;
        if( host && userid && publicKey && privateKey ){
            this.tradeApi = new TradeApi(host,userid,publicKey,privateKey);
        }

        this.state = {
            running:false, 
            url:'',
            loopTime:0,
            requestMethod:'GET',
            paramCom:[],
            paramData:{},
            isCurl:false,
            html:null,
            
            selectedMenu:'app',

        };

        this.requestData = this.requestData.bind(this);
        this.__testBuy = this.__testBuy.bind(this);


    }

    requestData(force){


        if(!this.state.running && !force){
            COMMON.alog('运行开关未打开');
            return;
        }
        else {
            // COMMON.alog('运行中....');
        }

        // 获取参数
        let {url,paramData} = this.state;
        if(url == ''){
            COMMON.alog('请求地址不能为空');
            return;
        }
        let getParam = {};
        let postParam = {};
        let headers = {};
        let putParam = {};
        for (var key in paramData) {
            // COMMON.alog(key);
            // COMMON.alog(paramData[key]);
            var par = paramData[key];
            var parKey = par['key'];
            var parValue = par['value'];
            if( parKey && parValue){
                // 有参数
                if( par['sel'] == 'Header' ){
                    headers[parKey] = parValue;
                }
                else if( par['sel'] == "PUT"){
                    putParam[parKey] = parValue;
                }
                else if( par['sel'] == 'POST' ){
                    postParam[parKey] = parValue; 
                }
                else {
                    getParam[parKey] = parValue;
                }
            }
        }

        let method = this.state.requestMethod;
        // 处理url
        url = url.indexOf("http") >= 0 ? url : "http://"+url;
        let data = getParam;
        switch (method) {
            case 'POST':
                data = postParam;
                break;
            case 'PUT':
                data = putParam;
                break;
            default:
                data = getParam;
                break;
        }
                     
        let option = {
            url:url,
            method:method,
            data:data,
            header:headers,
            isCurl:this.state.isCurl
        };

        myReq.send(option,(err,res,body)=>{
            
                            if(COMMON.isJsonOfString(body)){
                                COMMON.alog(JSON.parse(body));
                                this.setState({
                                    html:null
                                })
                            }else {
                                COMMON.alog(body);
                                this.setState({
                                    html:url
                                })
                            }
                        });
                
    }

    __refreshData(){
        if(!this.tradeApi){
            message.warning('请先设置好账号信息');
            return;
        }

    }

    __testBuy(){
        console.log('testbuy');
        console.log(this.state.selectedMenu);
    }

    __testSell(){

    }

    __selectMarket(){

    }

    __methodList(){
        return {
            __refreshData:this.__refreshData,
            __testBuy:this.__testBuy,
            __testSell:this.__testSell,
            __selectMarket:this.__selectMarket
        }
    }

    //组件初始化
    componentDidMount(){
        
    }

    //组件将更新
    componentWillUpdate(){
       
    }

    //组件已经更新
    componentDidUpdate(){

        let {alert = false,msg,msgLevel} = this.props;
        let {cancelMsg} = this.props;
        if(alert){
            switch(msgLevel){
                case 'error':
                message.error(msg);
                case 'warning':
                message.warning(msg);
                default:
                message.success(msg);
            }
            cancelMsg();
        }
       
    }

    render(){

        let {loadMsg, load} = this.props;
        let Content = this.state.selectedMenu == 'app' ? <TradeWatch tradeApi={this.tradeApi} methodList={this.__methodList()} /> : <TradeSetting />;
        let LoadCom = null;
        if(load){
            if(loadMsg == ""){
                LoadCom = <Spin size="large" style={{position:"absolute",top:"50%",left:"50%"}} />;
            }else {
                LoadCom = <Spin size="large" style={{position:"absolute",top:"50%",left:"50%"}} >
                <Alert
                message="加载中，请稍候"
                description=""
                type="info"
                />
            </Spin>
            }
        }

        <div style={{width:'100%',height:'100%',position:'fixed',background:'#000',opacity:0.1}}>
        <Spin size="large" style={{position:"absolute",top:"50%",left:"50%"}} >
            <Alert
            message="加载中，请稍候"
            description=""
            type="info"
            />
        </Spin> 
        </div>;
        
        return (<div>
            {LoadCom}
            <Menu
                onClick={(res)=>{this.setState({selectedMenu:res.key})}}
                selectedKeys={[this.state.selectedMenu]}
                mode="horizontal"
            >
                    <Menu.Item key="app">
                        <Icon type="appstore" />模拟交易
                    </Menu.Item>
                    <Menu.Item key="setting">
                        <Icon type="setting" />基本设置
                    </Menu.Item>
            </Menu>
            {Content}
        </div>);
        
    }
}

function mapStateToProps(state) {

    return {
        host:state.settings.host,
        userid:state.settings.userid,
        publicKey:state.settings.publicKey,
        privateKey:state.settings.privateKey,
        msg:state.alert.msg,
        alert:state.alert.alert,
        msgLevel:state.alert.msgLevel,
        load:state.alert.load,
        loadMsg:state.alert.loadMsg
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        showMsg:(msg, msgLevel) => {
            dispatch(showMsg(msg, msgLevel));
        },
        cancelMsg:()=>{
            dispatch(cancelMsg());
        },
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(RouteList);

import React from 'react';
const electron = require('electron');

import CONSTS from '../../config/consts';
import CONFIG from '../../config/config';
import COMMON from '../../function/common';
//import {Tabs, Tab} from 'material-ui/Tabs';
import myCheck from 'mydly-check';

import {connect} from 'react-redux';

import '../../static/style/common.scss';
import { Menu, Icon, message, Form, Input, Button } from 'antd';
const FormItem = Form.Item;


import {checkRsaKeys} from '../../main/requests';
import {saveApiSettings} from '../../actions/settings';
import {showMsg, cancelMsg} from '../../actions/alert';
import TradeApi from '../../main/api';


class TradeSetting extends React.Component {

    // 49b85f9cd283bf5ba20f6d8979118ba3
    // 886a30acd5d7014565593cb3891613a6
    constructor(props) {
        super(props);
        
        this.__examKeys = this.__examKeys.bind(this);
        this.__saveSetting = this.__saveSetting.bind(this);

        let { host = '',
             userid = '', 
             publicKey = '', 
             privateKey = '' } = this.props;

        this.state = {
            addrIndex:0,
            showInputAddressName:false,
            addressNameValue:"",

            inputHost:host,
            inputUserid:userid,
            inputKey:publicKey,
            inputSecret:privateKey
        }

    }

    __examKeys(){
        let {inputHost,inputUserid,inputKey,inputSecret} = this.state;
        let trade = new TradeApi(inputHost,inputUserid,inputKey,inputSecret);
        trade._getBalance((err,res,body)=>{
            if(err) message.error('测试出错');
            if(myCheck.isStringOfJson(body)){
                let retVal = JSON.parse(body);
                if(retVal["succ"]){
                    message.success('测试成功');
                    return;
                }
            }
            message.warning('测试错误，请修改参数');
            
        });
    }

    __saveSetting(){

       let apiSettings = { host:this.state.inputHost,
                           userid:this.state.inputUserid,
                           publicKey:this.state.inputKey,
                           privateKey:this.state.inputSecret};
        COMMON.settingSet(CONSTS.cacheName.apiSettings,apiSettings);

        if(!COMMON.settingGet(CONSTS.cacheName.apiSettings)){
            showMsg.msg('保存失败','error')
        }

        let {saveApiSettings} = this.props;
        saveApiSettings(apiSettings);

    }

    componentDidMount(){

    }

    componentWillUpdate(){
        COMMON.alog('will update');
        COMMON.alog(this.props);
        
    }

    componentDidUpdate(){
        
        // let {alert = false,msg,msgLevel} = this.props;
        // let {cancelMsg} = this.props;
        // if(alert){
        //     switch(msgLevel){
        //         case 'error':
        //         message.error(msg);
        //         case 'warning':
        //         message.warning(msg);
        //         default:
        //         message.success(msg);
        //     }
        //     cancelMsg();
        // }

    }

    __inputAddressName(event){
        this.setState({
            addressNameValue:event.target.value
        });
    }

    render() {
        
        const ItemPro = { style:{marginTop:30,marginLeft:20} };
        const labelPro = { style:{width:200} };
        const InputPro = { style:{width:500} };
        const passPro = { style:{width:500},type:'password' };
        console.log(this.props);
        let { host, userid, publicKey, privateKey } = this.props;
        console.log(host);
       return <div>
                <div {...ItemPro}>
                    <span {...labelPro}>网站域名：</span>
                    <Input onChange={ (e)=>{this.setState({inputHost:e.target.value})} } defaultValue={host} {...InputPro}/>
                    </div>
                <div {...ItemPro}>
                    <span {...labelPro}>用 户id：</span>
                    <Input onChange={ (e)=>{this.setState({inputUserid:e.target.value})} } defaultValue={userid} {...InputPro}/>
                    </div>
                <div {...ItemPro}>
                    <span {...labelPro}>API公钥：</span>
                    <Input onChange={ (e)=>{this.setState({inputKey:e.target.value})} } defaultValue={publicKey} {...passPro}/>
                    </div>
                <div {...ItemPro}>
                    <span {...labelPro}>API私钥：</span>
                    <Input onChange={ (e)=>{this.setState({inputSecret:e.target.value})} } defaultValue={privateKey} {...passPro}/>
                    </div>
                <div style={{marginLeft:55,marginTop:10}}>
                    <Button onClick={this.__saveSetting}>保存</Button>
                    <Button style={{marginLeft:20}} onClick={this.__examKeys}>测试一下</Button>
                </div>


        </div>
    }
}

const mapStateToProps = (state) => {
        COMMON.alog(' ===== Receive  map state to props ====== ');
    
        return {
            host:state.settings.host,
            userid:state.settings.userid,
            publicKey:state.settings.publicKey,
            privateKey:state.settings.privateKey,
            msg:state.alert.msg,
            alert:state.alert.alert,
            msgLevel:state.alert.msgLevel
        };
}
    
const mapDispatchToProps = (dispatch) => {
    return {
        getWalletAddress:(token,lang,coinname) => {
            dispatch(getWalletAddress(token,lang,coinname));
        },
        showMsg:(msg, msgLevel) => {
            dispatch(showMsg(msg, msgLevel));
        },
        cancelMsg:()=>{
            dispatch(cancelMsg());
        },
        saveApiSettings:(opt)=>{
            dispatch(saveApiSettings(opt));
        }
    }
}

export default connect( mapStateToProps, mapDispatchToProps )(TradeSetting);


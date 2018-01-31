import React from 'react';

import CONSTS from '../../config/consts';
import CONFIG from '../../config/config';
import COMMON from '../../function/common';

import {getMarket, getBalance, sendTran,
     getGuadanList, cancelOrder, getTradeLog } from '../../actions/trade';
import {showLoad,removeLoad,showMsg} from '../../actions/alert';

import {connect} from 'react-redux';

import '../../static/style/common.scss';
import { Menu, Icon, message, Form, Row, Col, Button, Select,
     Input, Checkbox, Tabs, Table} from 'antd';
import { calendarFormat } from 'moment';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

// var sqlite3 =  require('better-sqlite3');
// var db = new Database('move.db', {"memory":false});


class TradeWatch extends React.Component {

    constructor(props) {
        super(props);
        
        this.__refresh = this.__refresh.bind(this);
        this.__selectMarket = this.__selectMarket.bind(this);
        this.__requestBalance = this.__requestBalance.bind(this);
        this.__inputOrderParam = this.__inputOrderParam.bind(this);
        this.__testBuy = this.__testBuy.bind(this);
        this.tradeBuy = this.tradeBuy.bind(this);
        this.__testSell = this.__testSell.bind(this);
        this.tradeSell = this.tradeSell.bind(this);
        this.__startRun = this.__startRun.bind(this);
        this.__runLog = this.__runLog.bind(this);
        this.__clearOrder = this.__clearOrder.bind(this);
        this.__tabChange = this.__tabChange.bind(this);
        this.__requestTradeLog = this.__requestTradeLog.bind(this);
       
        let {selectMarket = ""} = this.props;
        selectMarket = selectMarket ? selectMarket : "";
        let coinArr = selectMarket.split("_");
        let market_coin = 0;
        let market_cny = 0;
        if(coinArr.length == 2){
            market_coin =  coinArr[0];
            market_cny = coinArr[1];
        }

        let buyOrderSetting = COMMON.settingGet(CONSTS.cacheName.buyOrderSetting) || {};
        let {
            buy_price_min = "",
            buy_price_max = "",
            buy_num_min = "",
            buy_num_max = "",
            buy_cycle = "",
            buy_clear = false,
            buy_clear_cycle = 7200
        } = buyOrderSetting;

        let sellOrderSetting = COMMON.settingGet(CONSTS.cacheName.sellOrderSetting) || {};
        let {
            sell_price_min = "",
            sell_price_max="",
            sell_num_min="",
            sell_num_max="",
            sell_cycle="",
            sell_clear=false,
            sell_clear_cycle=7200
        } = sellOrderSetting;

        this.state = {
            selectMarket:selectMarket,
            market_coin:market_coin,
            market_cny:market_cny,
            tradeOn:false,
            buy_price_min:buy_price_min,
            buy_price_max:buy_price_max,
            buy_num_min:buy_num_min,
            buy_num_max:buy_num_max,
            buy_cycle:buy_cycle,
            buy_clear:buy_clear,
            buy_clear_cycle:buy_clear_cycle,
            sell_price_min:sell_price_min,
            sell_price_max:sell_price_max,
            sell_num_min:sell_num_min,
            sell_num_max:sell_num_max,
            sell_cycle:sell_cycle,
            sell_clear:sell_clear,
            sell_clear_cycle:sell_clear_cycle,
            buyTimer:0,
            buyClearTimer:0,
            sellTimer:0,
            sellClearTimer:0,
            messionTimer:0,
        }

    }

    componentDidMount(){

        this.__refresh();
        
    }

    componentWillUpdate(){
        
        
    }

    componentDidUpdate(){

        let runlogDom = this.refs.runLog;
        runlogDom.scrollTop = runlogDom.scrollHeight - 270;
    }

    saveMarket(market){
        COMMON.settingSet(CONSTS.cacheName.selectMarket,market);
        if(COMMON.settingHas(CONSTS.cacheName.selectMarket)){
            COMMON.alog('保存成功');
        }
    }

    __inputOrderParam(e){

        let inputElement = e.target;

        let idName = inputElement.id;
        let value = inputElement.value;
        if( (idName == 'buy_clear') || (idName == 'sell_clear')){
            value = inputElement.checked;
        }
        let state = `{ "${idName}" : "${value}" }`;

        this.setState(JSON.parse(state));
    }

    __selectMarket(e){
        let selectMarket = e;
        let coinArr = selectMarket.split("_");
        let market_coin = 0;
        let market_cny = 0;
        if(coinArr.length == 2){
            market_coin =  coinArr[0];
            market_cny = coinArr[1];
        }
        this.setState({
            selectMarket:selectMarket,
            market_coin:market_coin,
            market_cny:market_cny
        })
        this.saveMarket(selectMarket);

        this.__refresh();
    }

    __startRun(){

        let { tradeOn , buy_cycle, buy_clear, buy_clear_cycle,
             sell_cycle, sell_clear , sell_clear_cycle, 
             buyTimer,
             buyClearTimer,
             sellTimer,
             sellClearTimer } = this.state;
        if(tradeOn){
            // 取消定时器
            buyTimer && clearInterval(buyTimer);
            buyClearTimer && clearInterval(buyClearTimer);
            sellTimer && clearInterval(sellTimer);
            sellClearTimer && clearInterval(sellClearTimer);
            this.setState({
                tradeOn:false,
                buyTimer:0,
                buyClearTimer:0,
                sellTimer:0,
                sellClearTimer:0
            });
        }
        else {
            // 开启定时器
            let timer = {};
            let flag = 0;


            if( this.state.buy_price_min &&
                this.state.buy_price_max &&
                this.state.buy_num_min &&
                this.state.buy_num_min && 
                this.state.buy_cycle
             ){
                 if(buy_cycle < 2){
                     message.warning('买单提交周期不能低于2秒');
                     return;
                 }
                 flag = 1;
                let buyTimer = setInterval(this.tradeBuy,buy_cycle*1000);
                timer = Object.assign(timer,{ buyTimer:buyTimer });
             }
             
             if( this.state.sell_price_min &&
                this.state.sell_price_max &&
                this.state.sell_num_min &&
                this.state.sell_num_min && 
                this.state.sell_cycle
             ){
                if(sell_cycle < 2){
                    message.warning('卖提交周期不能低于2秒');
                    return;
                }
                 flag = 1;
                let sellTimer = setInterval(this.tradeSell,sell_cycle*1000);
                timer = Object.assign(timer,{ sellTimer:sellTimer });
             }

             if( this.state.buy_clear && this.state.buy_clear_cycle){
                 let buyClearTimer = setInterval(this.__clearOrder, buy_clear_cycle*1000);
                 timer = Object.assign(timer,{ buyClearTimer:buyClearTimer });
             }

             if( this.state.sell_clear && this.state.sell_clear_cycle){
                let sellClearTimer = setInterval(this.__clearOrder, sell_clear_cycle*1000);
                timer = Object.assign(timer,{ sellClearTimer:sellClearTimer });
            }

            if(!flag){
                showMsg && showMsg('设置不合理或不完整');
                return;
            }

            this.setState( Object.assign({
                tradeOn:true
            },timer) );

        }
        


        
    }

    __refresh(){

        let {tradeApi,getMarket,showLoad} = this.props;
        // showLoad && showLoad();
        getMarket && getMarket(tradeApi);
        this.__requestBalance();

    }

    __requestBalance(){
        let { tradeApi, getBalance } = this.props;
        getBalance && getBalance(tradeApi);
    }

    __requestTradeLog(){
        let {tradeApi, getTradeLog } = this.props;
        let {selectMarket } = this.state;
        getTradeLog && getTradeLog(tradeApi,{
            market:selectMarket,
            page:0
        }); 
    }

    __testBuy(){

        let { buy_price_min=0,
            buy_price_max=0,
            buy_num_min=0,
            buy_num_max=0,
            buy_cycle=0,
            buy_clear=0,
            buy_clear_cycle=7200
         } = this.state;
        if( ! (buy_price_min &&
             buy_price_max &&
              buy_num_min &&
               buy_num_max &&
                buy_cycle) 
        ){
            message.warning('买单必填项未填完');
            return;
        }

        let price = this.randomNumBoth(buy_price_min,buy_price_max);
            price = parseFloat( price.toFixed(4) );
        let num = this.randomNumBoth(buy_num_min, buy_num_max);
            num = parseFloat( num.toFixed(4) );
        if( !(price && num) ){
            message.warning('配置不合理');
            return;
        }
        let {tradeApi, sendTran, showLoad,showMsg} = this.props;
        showLoad && showLoad(20);
        sendTran(tradeApi,{
            type:1,
            market:this.state.selectMarket,
            price:price,
            amount:num    
        },(res)=>{
            showMsg('测试成功，买单配置可用');
            // 保存买单设置
            COMMON.settingSet(CONSTS.cacheName.buyOrderSetting,{
                buy_price_min:buy_price_min,
                buy_price_max:buy_price_max,
                buy_num_min:buy_num_min,
                buy_num_max:buy_num_max,
                buy_cycle:buy_cycle,
                buy_clear:buy_clear,
                buy_clear_cycle:buy_clear_cycle
            });
        });

    }

    randomNumBoth(min, max){
         min = parseFloat(min);
         max = parseFloat(max);
        var range = max - min;
        if(range <= 0){
            return 0;
        }
        var rand = Math.random();
        var num = min + rand * range;
        return num;
    }

    tradeBuy(){
        let price = this.randomNumBoth(this.state.buy_price_min,this.state.buy_price_max);
        price = parseFloat( price.toFixed(4) );
        let num = this.randomNumBoth(this.state.buy_num_min, this.state.buy_num_max);
        num = parseFloat( num.toFixed(4) );
        let {tradeApi, sendTran, showMsg} = this.props;
        sendTran && sendTran(tradeApi,{
            type:1,
            market:this.state.selectMarket,
            price:price,
            amount:num    
        },(res)=>{
            showMsg && showMsg('完成买单请求');
        });
    }

    __testSell(){

        let { sell_price_min,
        sell_price_max,
        sell_num_min,
        sell_num_max,
        sell_cycle,
        sell_clear,
        sell_clear_cycle
        } = this.state;

        if( !( sell_price_min && 
                sell_price_max &&
                sell_num_min  &&
                sell_num_max  &&
                sell_cycle
            ) ){
                message.warning('卖单必填项未填完');
                return;
        }

        let price = this.randomNumBoth(sell_price_min,sell_price_max);
        price = parseFloat( price.toFixed(4) );
        let num = this.randomNumBoth(sell_num_min, sell_num_max);
        num = parseFloat( num.toFixed(4) );
        if( !(price && num) ){
            message.warning('配置不合理');
            return;
        }

        let {tradeApi, sendTran, showLoad,showMsg} = this.props;
        showLoad && showLoad(20);
        sendTran(tradeApi,{
            type:2,
            market:this.state.selectMarket,
            price:price,
            amount:num    
        },(res)=>{
            showMsg('测试成功，卖单配置可用');
            // 保存买单设置
            COMMON.settingSet(CONSTS.cacheName.sellOrderSetting,{
                sell_price_min:sell_price_min,
                sell_price_max:sell_price_max,
                sell_num_min:sell_num_min,
                sell_num_max:sell_num_max,
                sell_cycle:sell_cycle,
                sell_clear:sell_clear,
                sell_clear_cycle:sell_clear_cycle
            });
        });

    }

    tradeSell(){
        let price = this.randomNumBoth(this.state.sell_price_min,this.state.sell_price_max);
        price = parseFloat( price.toFixed(4) );
        let num = this.randomNumBoth(this.state.sell_num_min, this.state.sell_num_max);
        num = parseFloat( num.toFixed(4) );
        let {tradeApi, sendTran,showMsg} = this.props;
        sendTran && sendTran(tradeApi,{
            type:2,
            market:this.state.selectMarket,
            price:price,
            amount:num    
        },(res)=>{
            showMsg && showMsg('完成卖单请求');
        });
    }

    __clearOrder(){
        let {tradeApi, getGuandan, cancelOrder } = this.props;
        let { buy_clear_cycle, sell_clear_cycle} = this.state;
        let page = this.page;
        if(!page){
            page = 0;
            this.page = 0;
        }
        let that = this;
        getGuandan && getGuandan(tradeApi,{
            market:this.state.selectMarket,
            page:page
        },(res)=>{
            let now = new Date();
            let nowTime = Date.parse(now)/1000;

            let orderList = res.succ;
            let count = orderList.length;
            for(let key = count -1; key > -1; key--){
                let item = orderList[key];
                
                if( (item.type == 'buy') && (nowTime - item.time >= buy_clear_cycle) ){
                    cancelOrder && cancelOrder(tradeApi, {order_id:item.id});
                    continue;
                }

                if( (item.type == 'sell') && (nowTime - item.time >= sell_clear_cycle) ){
                    cancelOrder && cancelOrder(tradeApi, {order_id:item.id});
                    continue;
                }

                break;
            }
        });


    }

    __runLog(){

        let {logData = []} = this.props;
        let logCom = null;
        logCom = logData.map((item,key) => {
            let runText = "";
            if(item.action == "trade"){
                runText = item.time + (item.type == 1 ? "  买入" : "  卖出") + 
                     " 市场:" + item.market +
                     " 价格:" + item.price + " 数量:"+item.amount + 
                     (item.status == 0 ? "  状态:成功" : "  状态:失败  原因:"+item.err);
            }else if(item.action == "cancel_guadan"){
                runText = item.time + "撤销挂单 id:"+item.order_id +
                (item.status == 0 ? "  状态:成功" : "  状态:失败  原因:"+item.err);
            }else if(item.action == "guadan"){
                runText = item.time + "查询挂单成功" +
                (item.status == 0 ? "  状态:成功" : "  状态:失败  原因:"+item.err);
            }
            return <div key={key}>
                <span style={ item.status == 0 ? {color:"green"} : {color:"red"} }>
                    {runText}
                </span>
                </div>
        });
        return <div ref="runLog" style={{height:270,overflow:'scroll'}}>
            {logCom}
        </div>;
    }

    __tradeLog(){

        // return <div></div>;
        let {tradeLog } = this.props;

        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            width: '20%'
          }, {
            title: '交易类型',
            dataIndex: 'type',
            width: '20%',
            render:type=>type == 'buy'?'买入':'卖出'
          }, {
            title: '价格',
            dataIndex: 'price',
          }, {
            title: '数量',
            dataIndex: 'amount',
          }, {
              title:'时间',
              dataInde:'time',
              render:item=>{
                  let time = item.time;
                  let date = new Date( parseInt(time + "000") );
                  return date.toLocaleDateString()+ " " + date.toLocaleTimeString();
              }
          }];

          
        return <div >
            <Table
                columns={columns}
                dataSource={tradeLog}
                loading={false}
                size={"small"}
                scroll={ {x:false,y:false}}
                pagination={{
                    pageSize:6
                }}
            />
        </div>;
    }

    __tabChange(e){
        if(e == 2){
            this.__requestTradeLog();
        }
    }

    render() {

        let borderPro = {style:{ position:'relative',margin:"5px 10px"}} 
        let labelTitle = {style:{fontSize:'16px',color:'#27A163'}}
        let primaryTextStyle = {style:{fontSize:14,lineHeight:'26px'}};
        let valueTextStyle = {style:{fontSize:14,lineHeight:'26px',color:'red'}};
        let lineStyle = {style:{textAlign:'center',margin:"5px 5px",fontSize:14,lineHeight:'26px'}}

        let {market, selectMarket = 0} = this.props;
        let defaultMarket = selectMarket;
        let MarketOptions = [];
        for (let key in market) {
            if(!defaultMarket){
                defaultMarket = key;
                this.saveMarket(defaultMarket);
            }
            let option = <Option value={key} key={key+'_key'}>{key}</Option>;
            MarketOptions.push(option);
        }

        // 资产数据
        let {balanceList} = this.props;
        let {market_coin = 0, market_cny = 0} = this.state;
        let market_coin_use = 0;
        let market_coin_dongjie = 0;
        let market_cny_use = 0;
        let market_cny_dongjie = 0;
        if( market_cny && market_coin && balanceList ){
            market_coin_use = balanceList[market_coin];
            market_coin_dongjie = balanceList[market_coin+'d'];
            market_cny_use = balanceList[market_cny];
            market_cny_dongjie = balanceList[market_cny+'d'];
        }

        // 行情数据
        let marketPrice = (selectMarket && market )&& market[selectMarket];
        let latestPrice = 0;
        let buyOnePrice = 0;
        let sellOnePrice = 0;
        if(marketPrice){
            latestPrice = marketPrice['new_price'];
            buyOnePrice = marketPrice['buy_price'];
            sellOnePrice = marketPrice['sell_price'];
        }
        


       return <div>
            <div {...borderPro}>
                <Row>
                    <Col {...labelTitle} span={3} >控制功能</Col>
                </Row>
                <Row>
                    <Col span={2} style={{margin:"5px 20px"}}>
                        <Button type="primary" onClick={this.__startRun}
                            style={ this.state.tradeOn ? {backgroundColor:"#27A163"} : {}  }
                            >{this.state.tradeOn ? "执行中" : "开始执行"}</Button>
                    </Col>
                    <Col span={2} style={{margin:"5px 20px"}}>
                        <Button type="primary" onClick={this.__refresh}>刷新数据</Button>
                    </Col>
                    <Col span={2} style={{margin:"5px 20px"}}>
                        <Button type="primary" onClick={this.__testBuy}>测试买单</Button>
                    </Col>
                    <Col span={2} style={{margin:"5px 20px"}}>
                        <Button type="primary" onClick={this.__testSell}>测试卖单</Button>
                    </Col>
                    
                </Row>
            </div>
            <div {...borderPro}>
                <Row type="flex">
                    <Col {...labelTitle} span={3} >市场行情</Col>
                </Row>
                <Row>
                    <Col span={2} style={{margin:"5px 20px"}}>
                        <div {...primaryTextStyle}>市场：</div>
                    </Col>
                    <Col span={4} style={{margin:"5px 0px",left:-40}}>
                        

                        <Select defaultValue={defaultMarket}  
                        style={{marginTop:0,width:120}}
                        onChange={this.__selectMarket}
                        >
                            {MarketOptions}
                        </Select>
                    </Col>
                    {/* ------- */}
                    <Col span={4} style={{margin:"5px 20px"}}>
                        <span {...primaryTextStyle}>最新价:
                        </span>
                        <span {...valueTextStyle}> {latestPrice}
                        </span>
                    </Col>
                    <Col span={4} style={{margin:"5px 20px"}}>
                        <span {...primaryTextStyle}>买一价:
                        </span>
                        <span {...valueTextStyle}>{buyOnePrice}
                        </span>
                    </Col>
                    <Col span={4} style={{margin:"5px 20px"}}>
                        <span {...primaryTextStyle}>卖一价:
                        </span>
                        <span {...valueTextStyle}> {sellOnePrice}
                        </span>
                    </Col>
                </Row>
            </div>
            <div {...borderPro}>
                <Row type="flex">
                    <Col {...labelTitle} span={3} >我的资产</Col>
                </Row>
                <Row>
                    
                    <Col span={4} style={{margin:"5px 20px"}}>
                        <span {...primaryTextStyle}>{market_cny}:
                        </span>
                        <span {...valueTextStyle}>{market_cny_use}
                        </span>
                    </Col>
                    <Col span={4} style={{margin:"5px 20px"}}>
                        <span {...primaryTextStyle}>{market_cny}d:
                        </span>
                        <span {...valueTextStyle}>{market_cny_dongjie}
                        </span>
                    </Col>
                    <Col span={4} style={{margin:"5px 20px"}}>
                        <span {...primaryTextStyle}>{market_coin}:
                        </span>
                        <span {...valueTextStyle}>{market_coin_use}
                        </span>
                    </Col>
                    <Col span={4} style={{margin:"5px 20px"}}>
                        <span {...primaryTextStyle}>{market_coin}d:
                        </span>
                        <span {...valueTextStyle}>{market_coin_dongjie}
                        </span>
                    </Col>
                </Row>
            </div>
            <Row>
                <Col span={12}>
                    <div {...borderPro}>
                        <Row>
                            <Col {...labelTitle} span={3} >买入</Col>
                        </Row>
                        <Row>
                            <Col span={4} style={{margin:"5px 20px"}}>
                                <span {...primaryTextStyle}>买价范围:</span>
                            </Col>
                            <Col span={6} style={{margin:"5px 0px"}}>
                                <Input id='buy_price_min' 
                                onChange={this.__inputOrderParam} 
                                defaultValue={this.state.buy_price_min}
                                />
                            </Col>
                            <Col span={1} {...lineStyle}>-</Col>
                            <Col span={6} style={{margin:"5px 0px"}}>
                                <Input id='buy_price_max' 
                                onChange={this.__inputOrderParam} 
                                defaultValue={this.state.buy_price_max}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4} style={{margin:"5px 20px"}}>
                                <span {...primaryTextStyle}>数量范围:</span>
                            </Col>
                            <Col span={6} style={{margin:"5px 0px"}}>
                                <Input id='buy_num_min' 
                                onChange={this.__inputOrderParam} 
                                defaultValue={this.state.buy_num_min}
                                />
                            </Col>
                            <Col span={1} {...lineStyle}>-</Col>
                            <Col span={6} style={{margin:"5px 0px"}}>
                                <Input id='buy_num_max' 
                                onChange={this.__inputOrderParam} 
                                defaultValue={this.state.buy_num_max}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4} style={{margin:"5px 20px"}}>
                                <span {...primaryTextStyle}>执行周期:</span>
                            </Col>
                            <Col span={6} style={{margin:"5px 0px"}}>
                                <Input id='buy_cycle' 
                                onChange={this.__inputOrderParam} 
                                defaultValue={this.state.buy_cycle}
                                />
                            </Col>
                            <Col span={6} style={{margin:"5px 10px"}}>
                                <span {...primaryTextStyle}>秒</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6} style={{margin:"5px 20px"}}>
                                <Checkbox  
                                    id="buy_clear"
                                    onChange={this.__inputOrderParam}
                                    checked={this.state.buy_clear}
                                    style={{fontSize:14,lineHeight:'26px',fontWeight:400}}   
                                >自动清除</Checkbox>
                            </Col>
                            <Col span={6} style={{margin:"5px 0px"}}>
                                <Input 
                                    id="buy_clear_cycle"
                                    onChange={this.__inputOrderParam}
                                    defaultValue={this.state.buy_clear_cycle} />
                            </Col>
                            <Col span={6} style={{margin:"5px 10px"}}>
                                <span {...primaryTextStyle}>秒前的买单</span>
                            </Col>
                        </Row>

                    </div>
                </Col>
                <Col span={12}>
                    <div {...borderPro}>
                        <Row>
                            <Col {...labelTitle} span={3} >卖出</Col>
                        </Row>
                        <Row>
                            <Col span={4} style={{margin:"5px 20px"}}>
                                <span {...primaryTextStyle}>卖价范围:</span>
                            </Col>
                            <Col span={6} style={{margin:"5px 0px"}}>
                                <Input id='sell_price_min' 
                                    defaultValue={this.state.sell_price_min}
                                    onChange={this.__inputOrderParam} />
                            </Col>
                            <Col span={1} {...lineStyle}>-</Col>
                            <Col span={6} style={{margin:"5px 0px"}}>
                                <Input id='sell_price_max' 
                                    defaultValue={this.state.sell_price_max}
                                    onChange={this.__inputOrderParam} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4} style={{margin:"5px 20px"}}>
                                <span {...primaryTextStyle}>数量范围:</span>
                            </Col>
                            <Col span={6} style={{margin:"5px 0px"}}>
                                <Input id='sell_num_min' 
                                defaultValue={this.state.sell_num_min}
                                    onChange={this.__inputOrderParam} />
                            </Col>
                            <Col span={1} {...lineStyle}>-</Col>
                            <Col span={6} style={{margin:"5px 0px"}}>
                                <Input id='sell_num_max' 
                                defaultValue={this.state.sell_num_max}
                                    onChange={this.__inputOrderParam} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4} style={{margin:"5px 20px"}}>
                                <span {...primaryTextStyle}>执行周期:</span>
                            </Col>
                            <Col span={6} style={{margin:"5px 0px"}}>
                                <Input id='sell_cycle' 
                                defaultValue={this.state.sell_cycle}
                                    onChange={this.__inputOrderParam} />
                            </Col>
                            <Col span={6} style={{margin:"5px 10px"}}>
                                <span {...primaryTextStyle}>秒</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6} style={{margin:"5px 20px"}}>
                                <Checkbox 
                                id='sell_clear' 
                                checked={this.state.sell_clear}
                                onChange={this.__inputOrderParam}
                                style={{fontSize:14,lineHeight:'26px',fontWeight:400}} 
                                >自动撤销</Checkbox>
                            </Col>
                            <Col span={6} style={{margin:"5px 0px"}}>
                                <Input id="sell_clear_cycle"
                                 onChange={this.__inputOrderParam}
                                 defaultValue={this.state.sell_clear_cycle} />
                            </Col>
                            <Col span={6} style={{margin:"5px 10px"}}>
                                <span {...primaryTextStyle}>秒前的卖单</span>
                            </Col>
                        </Row>

                    </div>
                </Col>
            </Row>
            <div {...borderPro}>
                <Tabs defaultActiveKey="1" onChange={this.__tabChange}>
                    <TabPane tab="运行日志" key="1">
                        {this.__runLog()}
                    </TabPane>
                    <TabPane tab="成交记录" key="2">
                        {this.__tradeLog()}
                    </TabPane>
                </Tabs>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
        
        return {
            balanceList:state.trade.balanceList,
            market:state.trade.market,
            selectMarket:state.trade.selectMarket,
            logData:state.trade.logData,
            tradeLog:state.trade.tradeLog
        };
}
    
const mapDispatchToProps = (dispatch) => {
    return {
        getMarket:(tradeApi)=>{
            dispatch(getMarket(tradeApi));
        },
        removeLoad:()=>{
            dispatch(removeLoad());
        },
        showLoad:(timeout)=>{
            dispatch(showLoad(timeout));
        },
        getBalance:(tradeApi)=>{
            dispatch(getBalance(tradeApi));
        },
        sendTran:(tradeApi,option,fun)=>{
            dispatch(sendTran(tradeApi,option,fun));
        },
        showMsg:(msg,msglevel)=>{
            dispatch(showMsg(msg,msglevel));
        },
        getGuandan:(tradeApi,option,call)=>{
            dispatch(getGuadanList(tradeApi,option,call));
        },
        cancelOrder:(tradeApi,option,call)=>{
            dispatch(cancelOrder(tradeApi,option,call));
        },
        getTradeLog:(tradeApi,option,call)=>{
            dispatch(getTradeLog(tradeApi,option,call));
        }
    }
}

export default connect( mapStateToProps, mapDispatchToProps )(TradeWatch);


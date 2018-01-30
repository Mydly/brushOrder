import Consts from '../config/consts';
import COMMON from '../function/common';


let initState =  {
        tabBar:"app",
        lastTab:"app"
    };

export default function changeTab(state = initState, action) {

    switch (action.type){
            case Consts.action.newseed:{
                return Object.assign({},state,{haveToken:true});
            }
            case Consts.action.getinfo:{
                return Object.assign({},state,{
                    coinName:action.item.coinName,
                    balance:action.item.balance.num,
                    balanceUnable:action.item.balance.numd,
                });
            }
            case Consts.action.getTrans:{
                return Object.assign({},state,{
                    trans_log:action.item
                });
            }
            case Consts.action.transDone:{
                
                return Object.assign({},state,{
                    alertStatus:action.item.status == 1 ? 1 : 2,
                    alertMsg:action.item.msg
                })
            }
            case Consts.action.getAddressList:{
                
                return Object.assign({},state,{
                    addrList:action.item
                })
            }
            case Consts.action.createNewAddress:{
                return Object.assign({},state,{
                    newAddressStatus:action.item.status,
                    newAddressMsg:action.item.msg
                });
            }
            case Consts.action.createNewAddressFail:{
                return Object.assign({},state,{
                    newAddressStatus:2,
                    newAddressMsg:action.item.msg
                });
            }
            case Consts.action.createNewAddressSuccess:{
                return Object.assign({},state,{
                    newAddressStatus:1,
                    newAddressMsg:action.item.msg
                });
            }
            case Consts.action.cancelAlertStatus:{
                // let nState = state;
                // delete nState['newAddressStatus'];
                // delete nState['newAddressMsg'];
                // return nState;
                return Object.assign({},state,{
                    newAddressStatus:0,
                    newAddressMsg:""
                });
            }
            case Consts.action.sendAlert:{
                return Object.assign({},state,{
                    alertStatus:1,
                    alertMsg:action.text
                });
            }
            case Consts.action.cancelAlert:{
                return Object.assign({},state,{
                    alertStatus:0,
                    alertMsg:""
                });
            }
            case Consts.action.requestCoinList:{
                let obj = action.item.status == 1 ? 
                    {coinList:action.item.msg} : {coinList:[]};
                return Object.assign({}, state, obj);
            }
            case Consts.type.changeTab:
            {
                return Object.assign({}, state, {tabBar:action.item,lastTab:state.tabBar});
            }
            case Consts.action.selectCoin:{
                return Object.assign({},state, {
                    coinName:action.coinName.toUpperCase()
                })
            }
            case Consts.action.selectLang:{
                return Object.assign({}, state, {
                    lang:action.lang
                })
            }
            default:
                return state;
    }
}

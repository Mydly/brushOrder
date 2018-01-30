const Consts = require('../config/consts');
export default function alert(state = {alert:false}, action) {
    switch (action.type){
        
        case Consts.action.showMsg:
        {
            return Object.assign({}, state, {
                alert:true,
                msg:action.data.msg,
                msgLevel:action.data.msgLevel
            });
        }
        case Consts.action.cancelMsg:
            return Object.assign({}, state,{
                alert:false
            });
        case Consts.action.showLoad:
            return Object.assign({},state,{
                load:true,
                loadMsg:action.msg
            });
        case Consts.action.removeLoad:
            return Object.assign({},state,{
                load:false
            });
        default:
            return state;
    }
}
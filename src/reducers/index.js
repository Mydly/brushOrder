import { combineReducers } from 'redux';
import topNav from './topNav';
import settings from './settings';
import alert from './alert';
import trade from './trade';


const rootReducer = combineReducers({
    topNav,
    settings,
    alert,
    trade
});

export default rootReducer;
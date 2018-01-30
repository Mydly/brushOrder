if( this.state.sell_price_min &&
    this.state.sell_price_max &&
    this.state.sell_num_min &&
    this.state.sell_num_min && 
    this.state.sell_cycle
 ){
     flag = 1;
    let sellTimer = setInterval(this.tradesell,sell_cycle);
    timer = Object.assign(timer,{ sellTimer:sellTimer });
 }
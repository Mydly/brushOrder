// secret: raise museum gauge syrup bronze exact virus ten hurdle radar index shadow

// url  https://chain.chainxin.com/api/accounts/generatePublicKey

// publicKey 9645f752d4aded264ef37df908f7bba2e2a3bfafc440aaaad197f438581df497

// recipientId  14552288667175353762C

// amount 10000000


/**
 *   asch
 *   secret: pact leader nuclear sail goddess valve series magnet degree lesson gown beauty
 *   amount: 10000000
 *   recipientId:  ANRW3RerpZ9JThteqVmqmmGEjEYMnbJokm
 *   
 * 
 * 
 */

let Request = require('mydly-request');

let option = {
    // url:'https://mainnet.asch.io/api/accounts/open/',
    url:'http://ming.a.com/shake/minecoin',
    method:'POST',
    data:{
        secret:'pact leader nuclear sail goddess valve series magnet degree lesson gown beauty',
        recipientId:'ANRW3RerpZ9JThteqVmqmmGEjEYMnbJokm',
        amount:300000000
    },
    header:{
        'content-type':'application/json'
    },
    isCurl:0
};

let option2 = {
    url:'https://mainnet.asch.io/api/transactions',
    // url:'http://ming.a.com/shake/minecoin',
    method:'PUT',
    data:{
        "secret":"pact leader nuclear sail goddess valve series magnet degree lesson gown beauty",
        "recipientId":"ANRW3RerpZ9JThteqVmqmmGEjEYMnbJokm",
        "amount": 300000000
    },
    header:{
        'content-type':'application/json'
    },
    isCurl:1
};

// console.log(option);
// Request.send(option,(err,res,body)=>{
    
//                     console.log(body);
//                 });
Request.send(option2,(err,res,body)=>{
    
                    console.log(body);
                });
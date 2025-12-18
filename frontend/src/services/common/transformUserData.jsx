export default function transformUserData(data) {

    let chartData = {}
    let walletData = {}
    let analzeData = {}
    Object.keys(data).forEach(key => {
        chartData[key] = generateChartData(key, data[key])
        walletData[key] = generateWalletData(key, data[key])
        analzeData[key] = generateAnalzeData(key, data[key])
    })

    return {chartData, walletData, analzeData}
}

function generateWalletData(key, data){
    const userid = key;
    const username = data.static_data.username;
    const usemodel = data.static_data.usemodel
    const logo = data.static_data.logo
    const colors = data.static_data.colors

    const variableData = data.variable_data;
    const owner_coin = [];
    const available_cash = [];
    const total_assets = [];

    variableData.forEach(item => {
        available_cash.push(item.available_cash);
        owner_coin.push(item.owner_coin);
        total_assets.push(item.total_asset);
    });

    const in_walletData = {
        userid : userid,
        username: username,
        logo : logo,
        colors : colors,
        usemodel : usemodel,
        owner_coin : owner_coin,
        available_cash : available_cash,
        total_asset : total_assets,
    };

    return in_walletData
}

function generateChartData(key, data){
    const userid = key;
    const username = data.static_data.username;
    const variableData = data.variable_data;

    const times = [];
    const total_assets = [];

    variableData.forEach(item => {
        times.push(item.time);
        total_assets.push(item.total_asset);
    });

    const in_chartData = {
        userid : userid,
        username: username,
        time: times,         
        total_asset: total_assets   
    };

    return in_chartData
}

function generateAnalzeData(key, data){
    const userid = key;
    const username = data.static_data.username;
    const usemodel = data.static_data.usemodel;
    const variableData = data.variable_data;
    const owner_coin = [];
    const position = [];
    const why =[];
    const time = [];

    variableData.forEach(item => {
        owner_coin.push(item.owner_coin);
        position.push(item.position);
        why.push(item.why);
        time.push(item.time)
    });

    const in_chartData = {
        userid : userid,
        usemodel:usemodel,
        username: username,
        position: position,   
        time : time,     
        why: why   
    };

    return in_chartData
}

// let in_chartdata = {
//     "username" : "",
//     "time" : [],
//     "total_asset" : []
// }

// let in_analzdata = {
//     "username" : "",
//     "usemodel" : "",
//     "owner_coin" : [],
//     "position" : [],
//     "why" : []
// }

// let in_walletdata = {
//     "username" : "",
//     "logo" : "",
//     "colors" : "",
//     "usemodel" : "",
//     "owner_coin" : [],
//     "available_cash" : [],
//     "total_asset" : [],
// }


// Key : GEMINI

// VALUE : 
// {
    // 1

    // available_cash : 128600

    // owner_coin : {BCH: 0.00883, BTC: 0.001634, ETH: 0.030455}

    // position : {BCH: 'hold', BTC: 'hold', ETH: 'buy'}

    // time : "202511290410"

    // total_asset :  497854

    // why : {BCH: '스토캐스틱 지표가 과매수 구간에 진입하여 단기 조정 가능성이 있지만, 
    // MACD는 여전히 상승 모멘텀을 보여주고 있습니다. 포지션이 매우 작아 관망하는 것이 적절합니다.', 
    // BTC: 'RSI가 중립 구간에 있고 ADX는 추세 약화를 나타내고 있습니다. 스토캐스틱에서 약한 매…났지만, 
    // 전반적으로 횡보 및 관망 장세로 판단되어 핵심 자산인 BTC를 계속 보유합니다.', ETH: "주요 지표들이 중립적인 
    // 횡보 상태를 보이고 있지만, 향후 네트워크 업그레이드에 대한 기대감…래' 전략의 일환으로, 
    // 조정 국면에서 보유 현금의 일부를 활용하여 소량 분할 매수합니다."}
// }
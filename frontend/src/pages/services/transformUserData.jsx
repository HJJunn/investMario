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
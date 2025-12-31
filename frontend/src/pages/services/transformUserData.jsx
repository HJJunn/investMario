export default function transformUserData(data) {

    let walletData = {}
    Object.keys(data).forEach(key => {
        walletData = generateWalletData(data[key])
    })

    return walletData
}

function generateWalletData(data){
    const username = data.static_data.username;
    const usemodel = data.static_data.usemodel
    const logo = data.static_data.logo
    const colors = data.static_data.colors

    const variableData = data.variable_data
   
    const owner_coin = variableData[0].owner_coin;
    const available_cash = variableData[0].available_cash;
    const trade_history = variableData[0].trade_history;

    const why =[];
    const time = [];
    const position = [];
    
    variableData.forEach(item => {
        position.push(item.position);
        why.push(item.why);
        time.push(item.time)
    });

    const in_walletData = {
        username: username,
        logo : logo,
        colors : colors,
        usemodel : usemodel,
        owner_coin : owner_coin,
        available_cash : available_cash,
        time : time,     
        why: why,
        position: position,           
        trade_history : trade_history,
    };

    return in_walletData
}
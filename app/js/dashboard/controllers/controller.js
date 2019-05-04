let dashboardController = function ($http, $scope, $state) {
    $scope.totalParticipants = 0;
    $scope.fsnPriceData = {};
    $scope.lastUpdated = moment(new Date().getTime()).format('LTS');
    $scope.recentBlocks = [];
    $scope.recentTransactions = [];
    $scope.globalData = [];
    $scope.loading = false;

    $scope.getLatestBlocks = function () {
        let recentBlocks = [];
        $http.get('https://api.fusionnetwork.io/blocks/all?sort=desc&size=6').then(function (r) {
           let blocks = r.data;
           for (let block in blocks){
               let data = {
                   block: blocks[block].height,
                   timestamp: format(blocks[block].timeStamp * 1000),
                   transactions: blocks[block].numberOfTransactions,
                   miner: blocks[block].miner
               };
               recentBlocks.push(data);
           }
           $scope.$eval(function(){
               $scope.recentBlocks = recentBlocks;
           });
        });
    };

    $scope.getLatestTransactions = function () {
        let recentTransactions = [];
        $http.get('https://api.fusionnetwork.io/transactions/all?sort=desc&size=6').then(function (r) {
            let transactions = r.data;
            for (let transaction in transactions){
                let data = {
                    transactionId: transactions[transaction].hash,
                    from: transactions[transaction].fromAddress,
                    type: utils.returnCommand(transactions[transaction].fusionCommand),
                    timestamp: format(transactions[transaction].timeStamp * 1000),
                };
                recentTransactions.push(data);
            }
            $scope.$eval(function(){
                $scope.recentTransactions = recentTransactions;
            });
        });
    };

    $scope.getGlobalData = function () {
        $http.get('https://api.fusionnetwork.io/fsnprice').then(function (r){
           console.log(r.data);
           let priceInfo = r.data.priceInfo;
           let globalInfo = r.data;
           let dataPrice = {
               price: window.numeral(priceInfo.price).format('$0,0.00'),
               change : priceInfo.percentChange24H,
               changeamount : priceInfo.change,
               marketCap: window.numeral(priceInfo.market_cap).format('0.00a'),
               circulatingSupply: window.numeral(priceInfo.circulating_supply).format('0.00a')
           };
            let globalData = {
                totalTransactions: globalInfo.totalTransactions,
                totalAddresses : globalInfo.totalAddresses,
                totalAssets : globalInfo.totalAssets,
                maxBlock : globalInfo.maxBlock,
            };
            $scope.$eval(function(){
                $scope.fsnPriceData = dataPrice;
                $scope.globalData = globalData;
            });
        });
    };

    $scope.updateTime = function (){
        $scope.$eval(function(){
            $scope.lastUpdated = moment(new Date().getTime()).format('LTS');
        });
    };

    $scope.getLatestBlocks();
    $scope.getLatestTransactions();
    $scope.getGlobalData();

    setInterval(function () {
        $scope.getLatestBlocks();
        $scope.getLatestTransactions();
        $scope.getGlobalData();
        $scope.updateTime();
    }, 2000);
};

export default dashboardController;

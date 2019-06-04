const Web3 = require('web3')
const abi = require('./abi')
const httpProvider = "rinkeby.infura.io/v3/941ad4338bfb41a898a3084d5ba7178b"
var web3 = new Web3(new Web3.providers.HttpProvider(httpProvider));

//CREATE ACCOUNT
// console.log(web3.eth.accounts.create(web3.utils.randomHex(32)));
const privateKey = "0x8679f89a15e31cbeb7256f37db1a6df215a103261e7c54dd90f8cba9eeba0c70";
const address = "0x3318B0C23621d70B7F22a694d7D7E78f37208AD2";

// test wallet, safe privateKey and address
web3.eth.accounts.wallet.add({
    privateKey: '0x8679f89a15e31cbeb7256f37db1a6df215a103261e7c54dd90f8cba9eeba0c70',
    address: '0x3318B0C23621d70B7F22a694d7D7E78f37208AD2'
});


let cETH = "0xbed6d9490a7cd81ff0f06f29189160a9641a358f";

let CEther = new web3.eth.Contract(abi, cETH);
let cDAI = "0x2acc448d73e8d53076731fea2ef3fc38214d0a7d"
let cDaiInstance = new web3.eth.Contract(daiAbi, cDAI);
let comptroller = "0x8d2a2836d44d6735a2f783e6418caedb86da58d8";
const troll = new web3.eth.Contract(trollAbi, comptroller);


CEther.methods.supplyRatePerBlock().call().then((result) => {
    console.log(result / 1e18);

}).catch(error => console.log(error));


// Minting some cETH to begin accumulating interest based on the current Supply Rate for the asset

CEther.methods.mint().send({
        from: address,
        value: 2000000000000000000,
        gas: 2500000
    })
    .on('transactionHash', (hash) => {
        console.log("hash", hash)
    })
    .on('confirmation', (confirmationNumber, receipt) => {
        console.log("confirmationNumber", confirmationNumber)
        console.log("receipt", receipt)

    })
    .on('receipt', (receipt) => {
        // receipt example
        console.log("receipt", receipt);
    })
    .on('error', console.error);


// Enable markets for both ETH and DAI tokens using the Comptroller Contract


troll.methods.enterMarkets([cETH, cDAI]).send({
        from: address,
        gas: 2500000
    }).on('transactionHash', (hash) => {
        console.log("hash", hash)
    })
    .on('confirmation', (confirmationNumber, receipt) => {
        console.log("confirmationNumber", confirmationNumber)
        console.log("receipt", receipt)

    })
    .on('receipt', (receipt) => {
        // receipt example
        console.log("receipt", receipt);
    })
    .on('error', console.error);


// borrow 5 DAI

cDaiInstance.methods.borrow(5).send({
        from: address,
        gas: 2500000
    }).on('transactionHash', (hash) => {
        console.log("hash", hash)
    })
    .on('confirmation', (confirmationNumber, receipt) => {
        console.log("confirmationNumber", confirmationNumber)
        console.log("receipt", receipt)

    })
    .on('receipt', (receipt) => {
        // receipt example
        console.log("receipt", receipt);
    })
    .on('error', console.error);


// check the balance (you should see the borrowed DAI)

cDaiInstance.methods.borrowBalanceCurrent(address).call().then(result => {
    console.log(result.toNumber() / 1E18)
})

// TODO:
// - F  ollow https://stage.compound.finance/presidio#borrow-balance and repay the debt
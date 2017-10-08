const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
var exports = module.exports = {};

var eth_account;
var isConnected;

var web3 = new Web3(new Web3.providers.HttpProvider('https://kovan.infura.io'));

if (web3){
	console.log('Blockchain connected (via Infura Kovan node)');
	isConnected = true;
}
else{
	console.log('Blockchain not connected(failed to use Infura Kovan testnet node)');
	isConnected = false;
}

const owner_address = '0xbdf5a292de1C15CD3DAaA636dDdf043A02Ab16dE';
const store_abi = [{"constant":true,"inputs":[],"name":"totalReviewAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"placeID","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"overallScore","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_comment","type":"string"},{"name":"_score","type":"uint256"},{"name":"_uploader","type":"address"}],"name":"addReview","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalScore","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_placeID","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"uploader","type":"address"},{"indexed":false,"name":"comment","type":"string"},{"indexed":false,"name":"score","type":"uint256"},{"indexed":false,"name":"blocktime","type":"uint256"}],"name":"LogReviewAdded","type":"event"}];
const store_registry_abi = [{"constant":false,"inputs":[{"name":"_placeID","type":"string"}],"name":"addStore","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"registry","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_placeID","type":"string"}],"name":"getStoreAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"store_address","type":"address"}],"name":"LogStoreCreated","type":"event"}];
const store_registry_address = "0x79368dc1941c6f9ddf9bee0c7605245f81a54c90";

const registry_func_sig = {
	'addStore': '0x662feffc',
	'registry': '0x7ef50298',
	'owner': '0x8da5cb5b',
	'getStoreAddress': '0x96d122ea',
}

const store_func_sig = {
	'totalReviewAmount': '0x01293fb6',
	'placeID': '0x46defcac',
	'addReview': '0xbf49d120',
	'overallScore': '0xaaf70975',
	'totalScore': '0xc006719f',
	'reviews': '0xe83ddcea',
}

var store_registry_instance = new web3.eth.Contract(store_registry_abi, store_registry_address);
// console.log(store_registry_instance.methods);


var eth_account_list = [
	{
		'address':'0xbdf5a292de1C15CD3DAaA636dDdf043A02Ab16dE',
		'private_key':new Buffer('dcf6e266229c4fee91e4345fb475f7d5f1b8af66b0614c837edd03d19646e7a4','hex')
	},
	{
		'address':'0x8b26eCF45F8Fc8ae8dE7E6DF40A6686e7DB58938',
		'private_key':new Buffer('5b200b80a213cbd47a7de05625ae5191d798c21b42f15e57469a5ffccb6d7126','hex')
	},
	{
		'address': '0x7D8bF99DF0Fe4b02aE2d44db8e1d9A407dDc27d1',
		'private_key':new Buffer('63d5cbb5f9d08d6bb164515681f0b488ec7f04cad57b713e33c72da0caabc012','hex')
	},
	{
		'address': '0xeC47075685b22E2e63438967fD25dAf3a7b3EdE2',
		'private_key':new Buffer('67ba0ed6ca701b2cc88ee26c249a34bc92e466c33a848eb916a11d56f84d5dea','hex')
	},
	{
		'address': '0x3349bbD47f5005bC706989d8fc90dC875D20f4eb',
		'private_key':new Buffer('6fae6af5b585a0739c12930ce281377604076c29598674506ea7be372f614f07','hex')
	},
	{
		'address': '0xA23964c15af623Cb9C76D428D07962Cd717E2577',
		'private_key':new Buffer('f7a038b058e95cea5c5a7ab0e82118edfed1a8e8e2bc0ae5d0e16ab0fcc90834','hex')
	},
	{
		'address': '0x92c0462518567AB2f80A7C552a5493B2bC02000c',
		'private_key':new Buffer('e799f6571820fe2ff05dae64f9158e877db1c2aa0a9f1f7508fd6f55b418a7c7','hex')
	}

];


// default login account
window.onload = function(){

	eth_account = eth_account_list[document.getElementById("account").value];
	console.log(eth_account.address);
	store_registry_instance.methods.owner().call()
	.then(result =>{
		console.log('contract owner is: '+result);
		if (result == owner_address)
			console.log('correct registry on Kovan');
	});


}

// for switch account
window.addEventListener("load", function(){
	document.getElementById("account").addEventListener("change", function(){
		eth_account = eth_account_list[document.getElementById("account").value];
		console.log(eth_account.address);
	})
});

exports.web3IsConnected = function(){
	return isConnected;
}

exports.createStore = function(storeId, cb){
	var data = registry_func_sig['addStore'] + web3.eth.abi.encodeParameter('string', storeId).slice(2); 
	console.log('encoded input: '+data);

	web3.eth.getTransactionCount(eth_account.address).then(nonce => {

		var rawTx = {
		nonce: nonce,
		gasPrice: '0x09184e72a',
		gasLimit:'0x2DC6C0',						 
		gas: 587958,
		from: eth_account.address,
		to: store_registry_address, 
		value: '0x00', 
		chainId: 42,
		data: data,
		}

		var tx = new Tx(rawTx);
		// console.log(eth_account.private_key);
		tx.sign(eth_account.private_key);
		// console.log(tx);
		var serializedTx = tx.serialize();
		// console.log(serializedTx.toString('hex'));

		web3.eth.sendSignedTransaction('0x'+serializedTx.toString('hex'), function(err, hash) {
		  if (err)
		    console.log(err);
		  else{
		  	console.log("Create Store Tx hash: "+hash);
		  	cb();
		  }
		  	
		});
	});
}

// TODO: add parameter "uploader address" in future
exports.submitReview = function(storeId, content, score,cb){
	store_registry_instance.methods.getStoreAddress(storeId).call()
		.then(store_address =>{
			console.log('The Store you\'re writing review to is: '+ store_address);
			var store_contract_instance = new web3.eth.Contract(store_abi, store_address);
			console.log(store_contract_instance);
			// check whether the store is correctly instantiated		
			store_contract_instance.methods.placeID().call()
				.then( result =>{
					console.log('PlaceID seems to be: '+result);
					if (result == storeId){
						console.log('Right store verified.');					
						// add new review
						var data = store_func_sig['addReview'] + web3.eth.abi.encodeParameters(['string','uint256','address'],[content,score,eth_account.address]).slice(2);
						// console.log(data);
						web3.eth.getTransactionCount(eth_account.address).then(nonce => {
							var rawTx = {
							nonce: nonce,
							gasPrice: '0x09184e72a',						 
						  	gas: 400000,
							from: eth_account.address,
							to: store_address, 
							value: '0x00', 
							chainId: 42,
							data: data,
							}

							var tx = new Tx(rawTx);
							tx.sign(eth_account.private_key);
							// console.log(tx);
							var serializedTx = tx.serialize();
							// console.log(serializedTx.toString('hex'));

							web3.eth.sendSignedTransaction('0x'+serializedTx.toString('hex'), function(err, hash) {
							  if (err)
							    console.log(err);
							  else{
							  	console.log(hash);
							  	cb();
							  }
							});// End of sendSignedTransaction
						});// End of getTransactionCount
					}// End of if statement trying to ensure correct store instantiation
					else{
						console.log('Failed to go the store address!');
					}
				});// End of placeID RPC call
		});//End of getStoreAddress RPC call
}//End of submitReview function.

exports.storeExist = function(storeId, cb){
	// return store_registry_contract.storeExist(storeId);
	store_registry_instance.methods.getStoreAddress(storeId).call()
		.then(result =>{
			console.log('store address: '+result)
			var is_exist;
			if (result == 0x0){
				console.log('Store doesn\'t exist.');
				is_exist = false;
				cb(is_exist);
			}
			else{
				console.log('Store does exist.');
				is_exist = true;
				cb(is_exist);
			}
		});
}

exports.readReviews = function(storeId, cb){
	store_registry_instance.methods.getStoreAddress(storeId).call()
	 .then( store_address =>{
	 	console.log('Now reading reviews from: '+ store_address);

	 	web3.eth.getPastLogs({
			fromBlock: '4143840',
			toBlock: 'latest',
			address: store_address,
			topics:['0x53e81281a232ff6ce18e2ace5ad784f230c7dabfccde8ce81e828afcde52c1b0',null]
		}).then(logs => {
			// console.log(logs);
			var reviews = [];
			for (var i=0; i<logs.length; i++){
				let review = (web3.eth.abi.decodeLog([
						{
							type:'address',
							name:'uploader',
							indexed:true
						},{
							type:'string',
							name:'comment'
						},{
							type:'uint256',
							name:'score'
						},{
							type:'uint256',
							name:'blocktime'
						}
					], logs[i].data,['0x53e81281a232ff6ce18e2ace5ad784f230c7dabfccde8ce81e828afcde52c1b0']));
				review['reviewer'] =  '0x'+logs[i].topics[1].slice(26);
				reviews.push(review);
				// console.log(review);
			}
			cb(reviews);
		});// End of getPastLogs.

	 });// End of getStoreAddress
}

exports.readOverallScore = function(storeId, cb){
	store_registry_instance.methods.getStoreAddress(storeId).call()
		.then(store_address =>{
			console.log('The Store you\'re reading review from is: '+ store_address);
			var store_contract_instance = new web3.eth.Contract(store_abi, store_address);

			store_contract_instance.methods.overallScore().call()
				.then(overall_score =>{
					console.log('The overall score is: '+overall_score);
					cb(overall_score);
				});// Eno of overallScore RPC call
		});// End of getStoreAddress RPC call
}// End of readOverallScore function

exports.newIncomingLog = function(storeId){
	store_registry_instance.methods.getStoreAddress(storeId).call()
		.then(store_address =>{
			console.log("Hi hi hi");
			var subscription = web3.eth.subscribe('logs',{
				fromBlock: '4143840',
				toBlock: 'latest',
				address: store_address,
				topics:['0x53e81281a232ff6ce18e2ace5ad784f230c7dabfccde8ce81e828afcde52c1b0',eth_account.address]
			},function(error, result){
				if(error)
					console.log(error);
				else{
					console.log(result);
				}
			}); // End of subscription decleration.
		});
}


import {ethers} from 'ethers';

const wallet = ethers.Wallet.createRandom();
console.log(`Wallet: ${wallet.address.toLowerCase()}`);
const user = {
        "ethereumAddress": "0xaf3c95528eced53de1889695d15d5fe28d2885e5",
        "role": "maufacturer"
    }

const message = JSON.stringify(user);

const messageHash = ethers.hashMessage(message);
const signature = await wallet.signMessage(messageHash);
console.log(`Hashed Message: ${messageHash}`);
console.log(`Signature: ${signature}`);
const signer = ethers.verifyMessage(messageHash, signature);
console.log(`Signer: ${signer}`);
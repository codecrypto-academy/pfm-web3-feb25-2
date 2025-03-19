import * as grpc from '@grpc/grpc-js';
import { signers, connect, Identity, Signer, Contract } from '@hyperledger/fabric-gateway';
import crypto from 'crypto';
import { promises as fs} from 'fs';
import path from 'path';

// Channel name
const channelName:string = process.env.CHANNEL_NAME || 'mychannel';

// Chaincode name
const chaincodeName:string = process.env.CHAINCODE_NAME || 'basicts';

// Chaincode MSPID
const mspId:string = process.env.MSPID || 'Org1MSP';

// Gateway peer endpoint
const peerEndpoint:string = process.env.PEER_ENDPOINT || 'localhost:7051';

// Gateway peer host name
const peerHostAlias:string = process.env.PEER_HOST_ALIAS || 'peer0.org1.example.com';

// Path to crypto material
const cryptoPath:string = path.resolve(__dirname, '..', '..' , '..', 'fabric-samples', 'test-network','organizations', 'peerOrganizations', 'org1.example.com');
// Path to user private key
const keyDirectoryPath:string = path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore');

// Path to user certificate directory
const certDirectoryPath:string= path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts');

// Path to peer tls certificate.
const tlsCertPath:string = path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt');

async function newGrpcConnection(): Promise<grpc.Client> {
    try {
        const tlsRootCert = Buffer.from(await fs.readFile(tlsCertPath));
        const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
        return new grpc.Client(peerEndpoint, tlsCredentials, {
            'grpc.ssl_target_name_override': peerHostAlias,
        });
    } catch (error) {
        throw new Error(`Failed to create new gRPC connection: ${error}`);
    }
}

export async function getContract(contractName:string):Promise<Contract> {
    const client = await newGrpcConnection();
    const identity = await newIdentity();
    const signer = await newSigner();

    try {
        const gateway = connect({ client, identity, signer });
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName, contractName);
        return contract;
    } catch (error) {
        throw new Error(`Failed to get contract: ${error}`);
    }
}

async function newIdentity(): Promise<Identity> {
    try {
        const certPath = await getFirstDirFileName(certDirectoryPath)
        const certFile = await fs.readFile(certPath);
        const credentials = Buffer.from(certFile.toString());
        return {mspId, credentials}    
    } catch (error) {
        throw new Error(`Failed to create new identity: ${error}`);
    }
}

async function newSigner(): Promise<Signer> {
    try {
        const keyPath = await getFirstDirFileName(keyDirectoryPath);
        const keyFile = await fs.readFile(keyPath);
        const privateKey = crypto.createPrivateKey(Buffer.from(keyFile)); 
        return signers.newPrivateKeySigner(privateKey);
    } catch (error) {
        throw new Error(`Failed to create new signer: ${error}`);
    }
}

async function getFirstDirFileName(dirPath: string): Promise<string> {
    const files = await fs.readdir(dirPath);
    const file = files[0];
    if (!file) {
        throw new Error(`No files found in ${dirPath}`);
    }
    return path.join(dirPath, file);
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contracts = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const test_contract_1 = require("./contracts/test.contract");
const admin_contract_1 = require("./contracts/admin.contract");
// Define a chaincode class
let Chaincode = class Chaincode extends fabric_contract_api_1.Contract {
    async Init(ctx) {
        console.log('Initializing Ledger with admin users');
        const role = { type: "admin" };
        const users = [
            { ethereumAddress: '0xc57267649E6A3EBC0159b33FE5ba9c64DCdb9447', role },
        ];
        for (const user of users) {
            try {
                await ctx.stub.putState(`admin:${user.ethereumAddress}`, Buffer.from(JSON.stringify(user)));
            }
            catch (error) {
                console.error(`Failed to initialize user ${user.ethereumAddress}`);
                throw new Error('Failed to initialize user: ${user.ethereumAddress}');
            }
        }
        console.log('Ledger initialized');
    }
};
__decorate([
    (0, fabric_contract_api_1.Transaction)(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], Chaincode.prototype, "Init", null);
Chaincode = __decorate([
    (0, fabric_contract_api_1.Info)({ title: 'Chaincode', description: 'Class that allows the inicialization of the ledger' })
], Chaincode);
exports.contracts = [Chaincode, test_contract_1.TestContract, admin_contract_1.AdminContract];

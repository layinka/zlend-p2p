"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var contract_list_1 = require("src/app/models/contract-list");
var typechain_types_1 = require("src/app/typechain-types");
var numbers_1 = require("src/app/utils/numbers");
var DepositAssetsComponent = /** @class */ (function () {
    function DepositAssetsComponent(web3Service, spinner) {
        this.web3Service = web3Service;
        this.spinner = spinner;
        this.userChain = 'pol';
        this.nativeCoin = '';
    }
    DepositAssetsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.web3ServiceConnect$ = this.web3Service.onConnectChange.subscribe(function (connected) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!connected) return [3 /*break*/, 5];
                        _a = this;
                        return [4 /*yield*/, this.web3Service.getCurrentChain()];
                    case 1:
                        _a.userChain = (_e.sent()) ? .chain ?  ? '' :  :  : ;
                        _b = this;
                        return [4 /*yield*/, this.web3Service.getCurrentChainId()];
                    case 2:
                        _b.currentChainId = _e.sent();
                        // this.nativeCoin = (await this.web3Service.getCurrentChain())?.nativeCurrency;
                        _c = this;
                        return [4 /*yield*/, this.web3Service.getCurrentChain()];
                    case 3:
                        // this.nativeCoin = (await this.web3Service.getCurrentChain())?.nativeCurrency;
                        _c.nativeCoin = (_e.sent()) ? .nativeCurrency.symbol ?  ? 'Coin' :  :  : ;
                        this.zLendContract = typechain_types_1.ZLend__factory.connect(contract_list_1["default"][this.currentChainId].zLend, this.web3Service.ethersSigner);
                        _d = this;
                        return [4 /*yield*/, this.web3Service.getTokensForSupply(this.zLendContract)];
                    case 4:
                        _d.assets = _e.sent();
                        this.balance = 0;
                        _e.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    DepositAssetsComponent.prototype.supplyToken = function (token, value) {
        return __awaiter(this, void 0, void 0, function () {
            var NETWORK_ID, tokenInst, zToken, supplyResult, zTokenBalance, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, web3.eth.net.getId()];
                    case 1:
                        NETWORK_ID = _a.sent();
                        tokenInst = this.web3Service.getERC20ContractWithSigner(token.tokenAddress);
                        zToken = new web3.eth.Contract(ERC20.abi, zToken.networks[NETWORK_ID].address);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 7, , 8]);
                        return [4 /*yield*/, trackPromise(tokenInst.methods
                                .approve(contract.options.address, toWei(value))
                                .send({ from: account.data }))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, trackPromise(contract.methods
                                .lend(tokenInst.options.address, toWei(value))
                                .send({ from: account.data }))];
                    case 4:
                        supplyResult = _a.sent();
                        return [4 /*yield*/, zToken.methods
                                .balanceOf(account.data)
                                .call()];
                    case 5:
                        zTokenBalance = _a.sent();
                        return [4 /*yield*/, trackPromise(zToken.methods
                                .approve(contract.options.address, toWei(zTokenBalance))
                                .send({ from: account.data }))];
                    case 6:
                        _a.sent();
                        setSupplyResult(supplyResult);
                        return [3 /*break*/, 8];
                    case 7:
                        err_1 = _a.sent();
                        setSupplyError(err_1);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ;
    DepositAssetsComponent.prototype.todp = function (amount, dp) {
        return numbers_1.toDp(amount, dp);
    };
    DepositAssetsComponent = __decorate([
        core_1.Component({
            selector: 'deposit-assets',
            templateUrl: './deposit-assets.component.html',
            styleUrls: ['./deposit-assets.component.scss']
        })
    ], DepositAssetsComponent);
    return DepositAssetsComponent;
}());
exports.DepositAssetsComponent = DepositAssetsComponent;

/* eslint-disable @typescript-eslint/ban-ts-comment */
// ? ====================================================
// ? Offchain Strategy
// ? ====================================================
// ? - for having the offchain strategy configs
// ? - If use wants to execute them then we execute them using 1 inch api
// ? - After selecting we just execute their strategy
// ? - [Swap with no slippage]

require('dotenv').config({ path: `.env.${process.env.NETWORK}.local` });
import 'colorts/lib/string';
import { Contract, JsonRpcProvider } from 'ethers';
import StrategyAbi from '../assets/IStrategy.json';
import { PrismaClient } from '@prisma/client';
import { CONFIG } from '../config';
import { _swapFusion, _swapFusionDivest } from './strategy';

export default class Strategy {
  strategyAddress: string;
  userAddress: string;
  strategyUniqueId: string;
  provider: JsonRpcProvider;
  prisma: PrismaClient;
  inputAmount: number;

  constructor(strategy_address: string, user_address: string, strategy_unique_id: string, input_amount: number, provider: JsonRpcProvider) {
    this._consoleLog('Strategy Module init .....');
    this.strategyAddress = strategy_address;
    this.userAddress = user_address;
    this.provider = provider;
    this.prisma = new PrismaClient();
    this.strategyUniqueId = strategy_unique_id;
    this.inputAmount = input_amount;
    this._consoleLog(`Found Strategy for user : ${user_address} | Strategy Address : ${strategy_address}`);
  }

  monitorStrategy = async () => {
    // ? Invest data into DB
    await this._addDataToDb('invest', 0);

    // ? Strategy 2 case :
    // ? Only for Polygon Mainnet
    // ? --------------------------
    if (CONFIG.ADDRESSES.POLYGON.MAINNET.SPECIAL_STRATEGY_ADDRESS.indexOf(this.strategyAddress) !== -1) {
      await _swapFusion(this.strategyAddress, this.inputAmount.toString(), this.userAddress);
    }

    const contract_strategy = new Contract(this.strategyAddress, StrategyAbi, this.provider);

    try {
      contract_strategy.on('Devest', async (user_address, invested_amount, recieved_amount) => {
        if (user_address === this.userAddress) {
          await this._addDataToDb('devest', recieved_amount);
        }
      });
      contract_strategy.on('OffchainDivest', async (user_address, invested_amount_market) => {
        if (user_address === this.userAddress) {
          await _swapFusionDivest(this.strategyAddress, invested_amount_market, this.inputAmount.toString(), this.userAddress);
        }
      });
    } catch (error) {
      this._consoleError(error);
    }
  };

  _addDataToDb = async (action_type: 'invest' | 'devest', outputAmount: number | 0) => {
    // ? invest
    if (action_type === 'invest') {
      await this.prisma.strategyExecution.create({
        data: {
          strategyAddress: this.strategyAddress,
          userAddress: this.userAddress,
          strategyUniqueId: this.strategyUniqueId,
          inputAmount: this.inputAmount.toString(),
        },
      });
    }
    // ? devest
    if (action_type === 'devest') {
      await this.prisma.strategyExecution.update({
        where: {
          strategyUniqueId: this.strategyUniqueId,
        },
        data: {
          outputAmount: outputAmount.toString(),
        },
      });

      this._consoleLog(`[${this.strategyUniqueId}] : User : ${this.userAddress} devested in strategy : ${this.strategyAddress}`);
    }
  };

  _consoleLog = (s: any) => {
    console.log(`>>>> [Strategy Module] : `.yellow);
    console.log(s);
  };

  _consoleError = (s: any) => {
    console.log(`>>>> [Strategy Module] : `.red);
    console.log(s);
  };
}

// ? ===========================
// ? dlya testa
// ? ===========================
if (require.main === module) {
  const main = async () => {
    // const strategy = new Strategy('', '', '');
  };
  main();
}

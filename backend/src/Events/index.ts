/* eslint-disable @typescript-eslint/ban-ts-comment */
// ? ==============================================
// ? Event Monitoring Service
// ? Monitors the Strategy on the chain
// ? ==============================================
import 'colorts/lib/string';
import { Contract, JsonRpcProvider } from 'ethers';
import EthereumContractService from '../ContractServices/Ethereum';
import { CONFIG } from '../config';
require('dotenv').config({ path: `.env.${process.env.NETWORK}.local` });
import IStrategyAbi from '../assets/IStrategy.json';
import { v4 as uuidv4 } from 'uuid';
import Strategy from '../Strategy';

export default class EventMonitoring {
  chain_id: number;
  provider: JsonRpcProvider;
  ethereumService: EthereumContractService;
  strategyAbi: any;
  strategyAddresses: string[];

  constructor(chainId: number, strategies: string[]) {
    this.chain_id = chainId as number;
    this._consoleLog('Starting the event monitoring system ..... ⌛');
    //@ts-ignore
    const jsonRpcUrl = process.env[`NODE_URL_${CONFIG.CHAIN_MAPPING[this.chain_id]}`] as string;
    this.provider = new JsonRpcProvider(jsonRpcUrl);
    this.ethereumService = new EthereumContractService();
    // ! dlya testa
    // this.strategyAbi = ['event Transfer(address indexed from, address indexed to, uint amount)'];
    // ! ===========================================
    this.strategyAbi = IStrategyAbi;
    this.strategyAddresses = strategies;
    this._consoleLog(`Running Monitoring for Strategies : ${strategies}`);
    this._consoleLog('Event monitor started 🟢');
  }

  startMonitor = async () => {
    this._consoleLog('Starting eth monitor for Strategies');
    try {
      const promises: any[] = [];

      this.strategyAddresses.forEach(async (addr, ind: number) => {
        const contract = new Contract(addr, this.strategyAbi, this.provider);
        const i = await contract.on('Invest', async (user_address, amountIn) => {
          const data = {
            user_address,
            amountIn,
          };
          await this.processData(data, ind, addr);
        });
        promises.push(i);
      });

      await Promise.all(promises);
    } catch (error) {
      console.log('Error : ', error);
    }
  };

  processData = async (data: any, index: number, contract_address: string) => {
    this._consoleLog(`Data found [Strategy ID : ${index}] : ${data}`);
    const uniqueIdentifier = uuidv4();
    const strategy_monitor = new Strategy(contract_address, data.user_address, uniqueIdentifier, data.amountIn, this.provider);
    strategy_monitor.monitorStrategy();
  };

  _consoleLog = (s: any) => {
    console.log(`>>>> [Event Monitoring] : [chain : ${this.chain_id}]`.blue);
    console.log(s);
  };

  _consoleError = (s: any) => {
    console.log(`>>>> [Event Monitoring] : [chain : ${this.chain_id}]`.red);
    console.log(s);
  };
}

if (require.main === module) {
  const ev_monitoring = new EventMonitoring(5, ['0xdac17f958d2ee523a2206206994597c13d831ec7']);
  ev_monitoring.startMonitor();
}

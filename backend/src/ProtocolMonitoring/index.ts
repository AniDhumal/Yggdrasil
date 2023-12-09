/* eslint-disable @typescript-eslint/ban-ts-comment */
// ? ===========================================
// ? Protocol Monitoring
// ? ==========================================
require('dotenv').config({ path: `.env.${process.env.NETWORK}.local` });

import { PrismaClient } from '@prisma/client';
import EthereumContractService from '../ContractServices/Ethereum';
import { InterfaceAbi, Wallet } from 'ethers';
import IStaderStakePoolManager from '../assets/IStaderStakePoolManager.json';
import IwstETH from '../assets/IwstETH.json';
import { CalcDiff, CalcFluctuation, CalcStandardDeviation } from './Maths';
import { CONFIG } from '../config';
import 'colorts/lib/string';

/**
 * @class ProtocolMonit1oring
 * @description For monitoring of prices and getting the alerts when price fluctuations are too high
 */

export default class ProtocolMonitoring {
  ethService: EthereumContractService;
  prisma: PrismaClient;
  IStaderStakePoolManagerABI: InterfaceAbi;
  IwstETHABI: InterfaceAbi;
  isOn: boolean;
  _ONE_HOUR = 3600 * 1000;
  _ONE_MIN = 60 * 1000;
  StaderStakePoolManager_Address: string;
  wstETH_Address: string;
  account: Wallet;

  constructor() {
    this._consoleLog('Protocol Monitoring started.......');
    this.ethService = new EthereumContractService();
    this.prisma = new PrismaClient();
    this._consoleLog('[Protocol Monitoring] : Ethereum Service & DB Service Established');

    //@ts-ignore
    this.IStaderStakePoolManagerABI = IStaderStakePoolManager.abi;
    //@ts-ignore
    this.IwstETHABI = IwstETH.abi;
    const current_network = process.env.NETWORK as 'testnet' | 'mainnet';
    this.StaderStakePoolManager_Address =
      current_network === 'mainnet'
        ? CONFIG.ADDRESSES.ETHEREUM.MAINNET.StaderStakePoolManager
        : CONFIG.ADDRESSES.ETHEREUM.TESTNET.StaderStakePoolManager;

    this.wstETH_Address = current_network === 'mainnet' ? CONFIG.ADDRESSES.ETHEREUM.MAINNET.wstETH : CONFIG.ADDRESSES.ETHEREUM.TESTNET.wstETH;

    this.isOn = true;
    const P_KEY = process.env.P_KEY_ETH as string;
    this.account = new Wallet(P_KEY, this.ethService.provider);
  }

  /**
   * @function startMonitor
   * @description To start the protocol monitoring
   */
  startMonitor = () => {
    const interval = setInterval(async () => {
      try {
        const ETHx_data = await this.ethService.readContract(
          this.StaderStakePoolManager_Address,
          'getExchangeRate',
          [],
          this.IStaderStakePoolManagerABI,
        );
        this._consoleLog(`Fetched Data (ETHx) : ${ETHx_data}`);

        const wstETH_data = await this.ethService.readContract(this.wstETH_Address, 'tokensPerStEth', [], this.IwstETHABI);
        this._consoleLog(`Fetched Data (wstETH) : ${wstETH_data}`);

        await this.addDataToDB('ETHx', BigInt(ETHx_data));
        await this.addDataToDB('wstETH', BigInt(wstETH_data));

        if (!this.isOn) {
          this._consoleLog('>>>> [Protocol Monitor] : turning off');
          clearInterval(interval);
        }
      } catch (error) {
        this._consoleError(error);
      }
    }, this._ONE_MIN);
  };

  /**
   * @function getTokenFuctuation
   * @param tokenName
   */
  getTokenFluctuation = async (tokenName: 'ETHx' | 'wstETH'): Promise<Boolean> => {
    const data = await this.prisma.l1TokenPricesStakeExchanges.findMany({
      orderBy: {
        id: 'desc',
      },
      take: 20,
      where: {
        tokenName: tokenName,
      },
      select: {
        exchangeRate: true,
      },
    });

    const arr = data.map((d: { exchangeRate: any }) => d.exchangeRate);
    const standard_deviation = CalcStandardDeviation(arr);
    const difference_data = CalcDiff(arr);

    const fluctuation = CalcFluctuation(difference_data, standard_deviation);
    return fluctuation;
  };

  /**
   * @function addDataToDB
   * @param tokenName
   * @param exchangeRate
   * @description To add token data into the db
   */
  addDataToDB = async (tokenName: 'ETHx' | 'wstETH', exchangeRate: bigint) => {
    await this.prisma.l1TokenPricesStakeExchanges.create({
      data: {
        tokenName: tokenName,
        exchangeRate: exchangeRate,
      },
    });

    console.log(`>>>> [DB] : Data Added : tokenName : ${tokenName}, exchangeRate : ${exchangeRate}`);
  };

  /**
   * @function stopMonitor
   * @description To stop the monitoring service
   */
  stopMonitor = () => {
    this.isOn = false;
  };

  _consoleLog = (s: any) => {
    console.log(`>>>> [Protocol Monitoring] : `.green);
    console.log(s);
  };

  _consoleError = (s: any) => {
    console.log(`>>>> [Protocol Monitoring] : `.red);
    console.log(s);
  };
}

// ? ===========================
// ? dlya testa
// ? ===========================
if (require.main === module) {
  const main = async () => {
    const engine = new ProtocolMonitoring();
    engine.startMonitor();
    setTimeout(
      () => {
        engine.stopMonitor();
      },
      5 * 60 * 1000,
    );
  };
  main();
}

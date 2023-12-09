/* eslint-disable @typescript-eslint/ban-ts-comment */

require('dotenv').config({ path: `.env.${process.env.NETWORK}.local` });
import 'colorts/lib/string';
import { FusionSDK, PrivateKeyProviderConnector } from '@1inch/fusion-sdk';
import Web3 from 'web3';
import EthereumContractService from '../ContractServices/Ethereum';
import StrategyAbi from '../assets/IStrategy.json';
import { JsonRpcProvider, Wallet } from 'ethers';

// export const STRATEGIES = {
//   '0x30439482304823952839058': {
//     id: 0,
//     token: '',
//     dex: '',
//   },
// };

const _Strategy_2_Market: string = '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747'; // USDT

export const _swapFusion = async (strategy_address: string, amount: string, user_address: string) => {
  const node_url = process.env.NODE_URL_MATIC as string;
  const PRIV_KEY = process.env.P_KEY_ETH as string;
  const ONE_INCH_API_KEY = process.env.ONE_INCH_API_KEY as string;
  const blockchainProvider = new PrivateKeyProviderConnector(PRIV_KEY, new Web3(node_url));

  // Only works for polygon chain strategies
  const sdk = new FusionSDK({
    url: 'https://api.1inch.dev/fusion',
    network: 137,
    blockchainProvider,
    authKey: ONE_INCH_API_KEY,
  });

  // ! All values should be changed here after the contract for strategy2 is deployed
  const call = await sdk.placeOrder({
    fromTokenAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', // WETH
    toTokenAddress: _Strategy_2_Market,
    amount: amount,
    walletAddress: PRIV_KEY,
  });

  const ethServ = new EthereumContractService(137);
  const wallet = new Wallet(PRIV_KEY, new JsonRpcProvider(node_url));

  const contract_call = await ethServ.writeContract(strategy_address, 'digestFromOffchainInvest', StrategyAbi, wallet, [
    user_address,
    call.order.takingAmount,
  ]);

  console.log('>>>> [Swap Fusion] : [POLYGON] : [INVEST_CALL]'.bgBlue);
  console.log(contract_call);

  return call;
};

export const _swapFusionDivest = async (strategy_address: string, amount_invested_market: string, amount_in: string, user_address: string) => {
  const node_url = process.env.NODE_URL_MATIC as string;
  const PRIV_KEY = process.env.P_KEY_ETH as string;
  const ONE_INCH_API_KEY = process.env.ONE_INCH_API_KEY as string;
  const blockchainProvider = new PrivateKeyProviderConnector(PRIV_KEY, new Web3(node_url));

  // Only works for polygon chain strategies
  const sdk = new FusionSDK({
    url: 'https://api.1inch.dev/fusion',
    network: 137,
    blockchainProvider,
    authKey: ONE_INCH_API_KEY,
  });

  // ! All values should be changed here after the contract for strategy2 is deployed
  const call = await sdk.placeOrder({
    fromTokenAddress: _Strategy_2_Market,
    toTokenAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', // WETH
    amount: amount_invested_market,
    walletAddress: PRIV_KEY,
  });

  const ethServ = new EthereumContractService(137);
  const wallet = new Wallet(PRIV_KEY, new JsonRpcProvider(node_url));

  const contract_call = await ethServ.writeContract(strategy_address, 'digestFromOffchainDivest', StrategyAbi, wallet, [
    user_address,
    amount_in,
    call.order.takingAmount,
  ]);

  console.log('>>>> [Swap Fusion] : [POLYGON] : [DIVEST_CALL]'.bgBlue);
  console.log(contract_call);

  return call;
};

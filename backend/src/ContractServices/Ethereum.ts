// =====================================================
// Ethereum Contract Services
// =====================================================
// - To interact with contracts on ETH network
// =====================================================

require('dotenv').config({ path: `.env.${process.env.NETWORK}.local` });
import { Contract, InterfaceAbi, JsonRpcProvider, Provider, Wallet } from 'ethers';

/**
 * @class EthereumContractService
 * @description For interacting with ethereum side of contracts
 */
export default class EthereumContractService {
  provider: Provider;

  constructor() {
    const node_url = process.env.NODE_URL_ETH;
    this.provider = new JsonRpcProvider(node_url);
  }

  /**
   * @function readContract
   * @param contractAddress
   * @param method
   * @param params
   * @param abi
   * @returns contract call data
   */
  readContract = async (contractAddress: string, method: string, params: string[], abi: InterfaceAbi) => {
    const contract = new Contract(contractAddress, abi, this.provider);
    // console.log(await contract.getAddress());
    // console.log(contract.runner);
    if (params.length === 0) {
      const res = await contract[method]();
      return res;
    } else {
      const res = await contract[method](params);
      return res;
    }
  };

  /**
   * @function writeContract
   * @param contractAddress
   * @param method
   * @param abi
   * @param account
   * @param params
   * @returns contract call data
   */
  writeContract = async (contractAddress: string, method: string, abi: InterfaceAbi, account: Wallet, params: string[] | string) => {
    const contract = new Contract(contractAddress, abi, account);
    contract.connect(account);
    let call: any;

    if (params.length === 0) {
      call = await contract[method]();
    } else {
      call = await contract[method](params);
    }

    await this.provider.waitForTransaction(call.hash);
    return call;
  };
}

// ? ===========================
// ? dlya testa
// ? ===========================
if (require.main === module) {
  const main = async () => {
    const serv = new EthereumContractService();
    const contractAddress = '0xC45F41E3599271Cca4A146CD363dAE09Df90F7b1';
    const P_KEY = process.env.P_KEY_ETH as string;
    const ABI = [
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'num',
            type: 'uint256',
          },
        ],
        name: 'store',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'retrieve',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ];

    const signer = new Wallet(P_KEY, serv.provider);

    console.log(signer.address);

    const res = await serv.readContract(contractAddress, 'retrieve', [], ABI);
    console.log(res);

    const call = await serv.writeContract(contractAddress, 'store', ABI, signer, '10');
    console.log(call);
  };

  main()
    .then(() => {
      console.log('Test script ran successfully ☑️');
    })
    .catch(error => {
      console.log(error);
    });
}

import { BrowserProvider, ContractFactory, Contract, toNumber } from "ethers";
import ContractJSON from "./Recordings.json";

export class RecordingsContract
{
  constructor( public config: { name?: string, symbol?: string, contractAddress?: string }, public provider: BrowserProvider )
  { }

  static async getProvider ()
  {
    if ( !window.ethereum ) throw new Error( "MetaMask not found" )
    const provider = new BrowserProvider( window.ethereum );
    const d = await provider.send(
      "wallet_addEthereumChain",
      [ {
        chainId: "0xC45",
        rpcUrls: [
          "https://filecoin-hyperspace.chainup.net/rpc/v1",
          "https://api.hyperspace.node.glif.io/rpc/v1",
          "https://rpc.ankr.com/filecoin_testnet",
          "https://filecoin-hyperspace.chainstacklabs.com/rpc/v1"
        ],
        chainName: "Filecoin - Hyperspace testnet",
        nativeCurrency: {
          name: "testnet filecoin",
          symbol: "tFIL",
          decimals: 18
        },
        blockExplorerUrls: [ "https://hyperspace.filfox.info/en" ]
      } ]
    );

    await provider.send( "eth_requestAccounts", [] )
    return provider
  }


  async deployFactory ()
  {
    const provider = this.provider
    const signer = await provider.getSigner();
    const contractFactory = new ContractFactory(
      ContractJSON.abi,
      ContractJSON.data.bytecode,
      signer
    );
    if ( !this.config.name && !this.config.symbol ) throw new Error( "name and symbol not provided" )
    const contract = await contractFactory.deploy( this.config.name, this.config.symbol, 500 );
    return contract
  }

  async deploy ()
  {
    const contract = await this.deployFactory()
    await contract.waitForDeployment()
    this.config.contractAddress = await contract.getAddress();
    return this.config.contractAddress;
  }

  async addRecording ( id: number, url: string ): Promise<void>
  {
    if ( !this.config.contractAddress ) throw new Error( "Contract address not found" )
    const provider = this.provider
    const signer = await provider.getSigner();

    const contract = new Contract(
      this.config.contractAddress,
      ContractJSON.abi,
      signer
    );
    const recordCall = await contract.addRecording( id, url );
    await recordCall.wait()
  }

  async getRecording ( id: number ): Promise<string>
  {
    if ( !this.config.contractAddress ) throw new Error( "Contract address not found" )

    const provider = this.provider
    const signer = await provider.getSigner();

    const contract = new Contract(
      this.config.contractAddress,
      ContractJSON.abi,
      signer
    );
    const recording = await contract.getRecording( id );
    return recording;
  }

  async getCurrentCount ()
  {
    if ( !this.config.contractAddress ) throw new Error( "Contract address not found" )

    const provider = this.provider
    const signer = await provider.getSigner();

    const contract = new Contract(
      this.config.contractAddress,
      ContractJSON.abi,
      signer
    );
    const count = await contract.getCurrentCount();
    return toNumber( count )
  }
}

export default RecordingsContract;

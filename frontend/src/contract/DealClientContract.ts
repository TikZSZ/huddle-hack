import { BrowserProvider, ContractFactory, Contract, toNumber } from "ethers";
import DealClientJson from "./DealClient.json";
import CID from "cids"

export class DealClient
{
  public contractAddress = "0x464B560CEBEa46F409A2C0dD39219Aa65a0F22Be"
  constructor( public config: {
    pieceCid: string // A4
    fileName: string
    payloadCid: string
    mimeType: string
    userName: string
    createdAt: number
    carSize: number //A3
    lastUpdate: number
    fileStatus: string
    fileSize: number
    id: string
    pieceSize: number // A2
    carLink: string // A1
  }, public provider: BrowserProvider )
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

  async getContract(){
    const signer = await this.provider.getSigner()
    const dealClient = new Contract(
      this.contractAddress,
      DealClientJson.abi,
      signer
    );
    return dealClient
  }

  async makeDealProposal ( provider: BrowserProvider )
  {

    const signer = await provider.getSigner()
    const dealClient = new Contract(
      this.contractAddress,
      DealClientJson.abi,
      signer
    );

    // Get the current block number
    const currentBlockNumber = await provider.getBlockNumber();
    // Get the block timestamp for the current block
    const currentBlock = await provider.getBlock( currentBlockNumber );
    if ( !currentBlock ) throw new Error( "latest block does not exists" )
    const currentTimestamp = currentBlock!.timestamp;
    const startTimestamp = currentTimestamp / 30;
    const endTimestamp = ( currentTimestamp + 3600*24*31*6 ) / 30;
    console.log(currentTimestamp);
    

    const cid = new CID( this.config.pieceCid );
    const cidHexRaw = new CID(cid).toString('base16').substring(1)
    const cidHex = "0x" + cidHexRaw
    const extraParamsV1 = [
      this.config.carLink,
      this.config.carSize,
      true, // taskArgs.skipIpniAnnounce,
      true, // taskArgs.removeUnsealedCopy
    ];
    const DealRequestStruct = [
      cidHex, //cidHex
      this.config.pieceSize, //taskArgs.pieceSize,
      false, //taskArgs.verifiedDeal,
      this.config.pieceCid, //taskArgs.label,
      startTimestamp, // startEpoch
      endTimestamp, // endEpoch
      0, // taskArgs.storagePricePerEpoch,
      0, // taskArgs.providerCollateral,
      0, // taskArgs.clientCollateral,
      1, //taskArgs.extraParamsVersion,
      extraParamsV1,
    ];

    const transaction = await dealClient.makeDealProposal(
      DealRequestStruct
    );
    console.log( "Proposing deal..." );
    const receipt = await transaction.wait();
    console.log( receipt );
    // const event = receipt.events[0].topics[0]
    // console.log("Proposal id is",event);
    dealClient.on( "DealProposalCreate", ( id, size, verified, price ) =>
    {
      console.log( {proposalId:id, pieceSize:size, verified, price} );
    } )
    console.log( "Deal proposed! CID: " + cid );
    return receipt.hash
  }

  async pieceDeals ( provider: BrowserProvider )
  {
    const signer = await provider.getSigner()
    const dealClient = new Contract(
      this.contractAddress,
      DealClientJson.abi,
      signer
    );
    const cid = new CID( this.config.pieceCid );
    if ( cid === undefined )
    {
      throw new Error( "Cid not found" )
    }
    const cidHexRaw = new CID(cid).toString('base16').substring(1)
    const cidHex = "0x" + cidHexRaw
    return new Promise<string>( ( res, rej ) =>
    {
      var refresh = setInterval( async () =>
      {
        console.log( "Checking for deal ID..." );
        const dealID = toNumber( await dealClient.pieceDeals( cidHex ) )
        if ( dealID !== undefined && dealID !== 0 )
        {
          // If your deal has already been submitted, you can get the deal ID by going to https://hyperspace.filfox.info/en/deal/<dealID>
          // The link will show up in the frontend: once a deal has been submitted, its deal ID stays constant. It will always have the same deal ID.
          res( "https://hyperspace.filfox.info/en/deal/" + dealID );
          clearInterval( refresh );
        }
      }, 5000
      );
    } )
  }

  // dealIDHandler = async () =>
  // {
  //   const cid = new CID( this.config.pieceCid );
  //   var refresh = setInterval( async () =>
  //   {
  //     console.log( cid.bytes );
  //     if ( cid === undefined )
  //     {
  //       setDealID( "Error: CID not found" );
  //       clearInterval( refresh );
  //     }
  //     console.log( "Checking for deal ID..." );
  //     const dealID = await dealClient.pieceDeals( cid.bytes );
  //     console.log( dealID );
  //     if ( dealID !== undefined && dealID !== "0" )
  //     {
  //       // If your deal has already been submitted, you can get the deal ID by going to https://hyperspace.filfox.info/en/deal/<dealID>
  //       // The link will show up in the frontend: once a deal has been submitted, its deal ID stays constant. It will always have the same deal ID.
  //       setDealID( "https://hyperspace.filfox.info/en/deal/" + dealID );
  //       clearInterval( refresh );
  //     }
  //   }, 5000
  //   );
  // };



}
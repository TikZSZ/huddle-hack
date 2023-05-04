<template></template>

<script lang="ts" setup>
import { DealClient } from "@/contract/DealClientContract"
import useStore from "@/stores/store"
import CID from "cids"
const store = useStore()
const provider = await DealClient.getProvider()
const config = {
    "pieceCid": "baga6ea4seaqcair6iotme4yn7ccaftm7xbysv7gfjkdmm3vhwxcntcukhpszkkq",
    "fileName": "mzk-zivb-nxp-1683114404118-NPlp5w.mp4",
    "payloadCid": "bafybeicyzhl2f57t2tobokywkw2raqxu2yvm7s2x6y4tcgixc2ub4gg5te",
    "mimeType": "video/mp4",
    "userName": "0x6823cfdc088265783b0721a9e3df40e066c3f66e",
    "createdAt": 1683151449848,
    "carSize": 261530,
    "lastUpdate": 1683151450873,
    "fileStatus": "CAR Created",
    "fileSize": 261308,
    "id": "f190fc49-97b5-4ff1-8b54-e6b18785c691",
    "pieceSize": 524288,
    "carLink": "https://data-depot.lighthouse.storage/api/download/download_car?fileId=f190fc49-97b5-4ff1-8b54-e6b18785c691.car"
}
const dc = new DealClient( config, provider )

try
{
    store.showOverlay( true )
    store.setLoaderMessage( "Proposing deal" )
    // const makeDeapProposal = await dealClient.makeDealProposal( provider )
    // console.log( makeDeapProposal );
    const dealClient = await dc.getContract()
    // Get the current block number
    const currentBlockNumber = await provider.getBlockNumber();
    // Get the block timestamp for the current block
    const currentBlock = await provider.getBlock( currentBlockNumber );
    if ( !currentBlock ) throw new Error( "latest block does not exists" )
    const currentTimestamp = currentBlock!.timestamp;
    const startTimestamp = currentTimestamp / 30;
    const endTimestamp = ( currentTimestamp + 3600*24*31*6 ) / 30;
    console.log(currentTimestamp);
    

    const cid = new CID( config.pieceCid );
    const cidHexRaw = new CID(cid).toString('base16').substring(1)
    const cidHex = "0x" + cidHexRaw
    const extraParamsV1 = [
      config.carLink,
      config.carSize,
      true, // taskArgs.skipIpniAnnounce,
      true, // taskArgs.removeUnsealedCopy
    ];
    const DealRequestStruct = [
      cidHex, //cidHex
      config.pieceSize, //taskArgs.pieceSize,
      false, //taskArgs.verifiedDeal,
      config.pieceCid, //taskArgs.label,
      startTimestamp, // startEpoch
      endTimestamp, // endEpoch
      0, // taskArgs.storagePricePerEpoch,
      0, // taskArgs.providerCollateral,
      0, // taskArgs.clientCollateral,
      1, //taskArgs.extraParamsVersion,
      extraParamsV1,
    ];

    const transaction = await dealClient.makeDealProposal(
        DealRequestStruct as any
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
    // store.setLoaderMessage( "Waiting for deal acceptance" )
    // const deal = await dealClient.pieceDeals( provider )
    // console.log( deal );
    store.showOverlay( false )
}
catch ( err )
{
    store.showOverlay( false )
}
</script>
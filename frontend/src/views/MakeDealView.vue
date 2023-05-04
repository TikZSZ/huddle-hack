<template>
  Save to Filecoin
</template>

<script lang="ts" setup>
import { DealClient } from "@/contract/DealClientContract"
import useStore from "@/stores/store"
import { getCar } from "@/utils/api"
import CID from "cids"
import { toNumber } from "ethers"
import { onMounted, ref, type Ref } from "vue"
import { useRoute } from "vue-router"
const store = useStore()

async function saveToFileCoin ( config: any )
{
  const provider = await DealClient.getProvider()
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
    const endTimestamp = ( currentTimestamp + 3600 * 24 * 31 ) / 30;
    console.log( currentTimestamp );


    const cid = new CID( config.pieceCid );
    const cidHexRaw = new CID( cid ).toString( 'base16' ).substring( 1 )
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
      DealRequestStruct
    );
    console.log( "Proposing deal..." );
    const receipt = await transaction.wait();
    console.log( receipt );
    // const event = receipt.events[0].topics[0]
    // console.log("Proposal id is",event);
    dealClient.on( "DealProposalCreate", ( id, size, verified, price ) =>
    {
      console.log( id, size, verified, price );
    } )
    console.log( "Deal proposed! CID: " + cid );
    store.setLoaderMessage( "Waiting for deal acceptance" )
    const deal = await dealClient.pieceDeals( provider )
    console.log( deal );
    store.showOverlay( false )
  }
  catch ( err )
  {
    store.showOverlay( false )
  }
}

onMounted( async () =>
{
  try
  {
    store.showOverlay( true )
    store.setLoaderMessage( "Fetching Car file config" )
    const route = useRoute()
    console.log( parseInt( route.params.expId as string ), parseInt( route.params.recId as string ), route.query.url );
    const config = await getCar( parseInt( route.params.expId as string ), parseInt( route.params.recId as string ), { url: route.query.url as string } )
    await saveToFileCoin(config)
    store.showOverlay( false )
  } catch ( err )
  {
    store.showOverlay( false )

  }
} )


</script>
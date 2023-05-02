<script setup lang="ts">
import { RecordingsContract } from "@/contract/RecordingsContract"
import { BrowserProvider } from "ethers";

async function getProvider ()
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
  console.log(d);
  
  await provider.send( "eth_requestAccounts", [] )
  return provider
}

const provider = await getProvider()

const recContract = new RecordingsContract( { name: "RecToken", symbol: "REC",contractAddress:"0xD723552acce3f08bb9A505a79eC675C7974919a4" }, provider )
// const contractAddress = await recContract.deploy()
// console.log( contractAddress );
const count = await recContract.getCurrentCount()
console.log(count);

// const rec1 = await recContract.addRecording(1,"adad")
// console.log(rec1);

const rec2 = await recContract.getRecording(1)
console.log(rec2);


</script>

<template>
  <main>
    Hello
  </main>
</template>

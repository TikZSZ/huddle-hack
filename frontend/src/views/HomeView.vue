<script setup lang="ts">
import { RecordingsContract } from "@/contract/RecordingsContract"
import { BrowserProvider } from "ethers";


const provider = await RecordingsContract.getProvider()

const recContract = new RecordingsContract( { name: "RecToken", symbol: "REC",contractAddress:"0xD723552acce3f08bb9A505a79eC675C7974919a4" }, provider )
// const contractAddress = await recContract.deploy()
// console.log( contractAddress );
const count = await recContract.getCurrentCount()
console.log(count);

const rec1 = await recContract.addRecording(count+1,"https://amazonnews234")
console.log(rec1);

const rec2 = await recContract.getRecording(2)
console.log(rec2);


</script>

<template>
  <main>
    Hello
  </main>
</template>

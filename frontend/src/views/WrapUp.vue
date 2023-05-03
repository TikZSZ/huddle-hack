<script lang="ts" setup>
import RecordingsContract from '@/contract/RecordingsContract';
import useStore from '@/stores/store';
import { getExpRecMetadata, wrapUp as wrapUpAPI, type WrapUpData as APIWrapUpData } from '@/utils/api';
import type { RecordingMetadata } from '@/utils/types';
import { onMounted, ref, type Ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const store = useStore()
interface WrapUpData
{
  saveRecording: boolean
  recTitle: string
  url?: string;
  recDescription: string;
}

const wrapUpData: Ref<WrapUpData> = ref( {
  saveRecording: true, recTitle: "Volume 1",
  recDescription: "Recorded", url: ""
} )



async function callWrapUpAPI ( id: number, data: APIWrapUpData )
{
  try
  {
    const exp = await wrapUpAPI( id, data )
    router.push( { name: "ExperienceDetails", params: { id: id } } )
  } catch ( err )
  {
    console.error( err )
  }
}


const recMetadata: Ref<RecordingMetadata | null> = ref( null )

async function wrapUp ()
{
  try
  {
    store.showOverlay( true )
    store.setLoaderMessage( "Wrapping Up" )
    console.log( JSON.parse( JSON.stringify( wrapUpData.value ) ) );
    const expId = route.params.id ? parseInt( route.params.id as string ) : null
    if ( !expId ) throw new Error( "in valid exprience id" )
    if ( recMetadata.value === null ) throw new Error( "Rec metadata not found" )
    if ( !wrapUpData.value.saveRecording )
    {
      await callWrapUpAPI( expId, { saveRecording: false, } )
    }
    else if ( !recMetadata.value.tokenGatedRecording )
    {
      await callWrapUpAPI( expId, { ...wrapUpData.value } )
    } else
    {
      try
      {
        if ( !recMetadata.value.contractAddress || !wrapUpData.value.url ) throw new Error( "Contract address not found" )
        const provider = await RecordingsContract.getProvider()
        const recContract = new RecordingsContract( { contractAddress: recMetadata.value.contractAddress }, provider )
        const count = await recContract.getCurrentCount()
        console.log( count );
        const recContractId = count + 1
        store.setLoaderMessage( "Saving Recording to REC20 Smart Contract..." )
        const addRecording = await recContract.addRecording( recContractId, wrapUpData.value.url! )
        const rec2 = await recContract.getRecording( recContractId )
        console.log( rec2 );
        console.log( count );
        console.log( { ...wrapUpData.value, recContractId } );
        store.setLoaderMessage( "Almost Done" )
        await callWrapUpAPI( expId, { ...wrapUpData.value, recContractId } )
      } catch ( err )
      {
        console.error( err )
      }
    }
    store.showOverlay( false )
  } catch ( err )
  {
    console.log( err );
    store.showOverlay( false )
  }
}


onMounted( async () =>
{
  console.log( JSON.parse( JSON.stringify( wrapUpData.value ) ) );
  const expId = route.params.id ? parseInt( route.params.id as string ) : null
  if ( !expId ) throw new Error( "in valid exprience id" )
  recMetadata.value = await getExpRecMetadata( expId )
  console.log( recMetadata );
} )

</script>



<template>
  <div class="dashboard">
    <form @submit.prevent="wrapUp">
      <div class="checkbox-label">
        <label>Save Recording</label>
        <div class="checkbox-container">
          <input id="token-gated-recording" type="checkbox" v-model="wrapUpData.saveRecording">
          <label for="token-gated-recording" class="checkbox-icon"></label>
        </div>
      </div>

      <template v-if="wrapUpData.saveRecording">
        <label>Recording Metadata:</label>
        <fieldset>
          <label>Recording Title:</label>
          <input type="text" v-model="wrapUpData.recTitle">

          <label>Recording Description:</label>
          <input type="text" v-model="wrapUpData.recDescription">

          <label>Recording URL:</label>
          <input type="text" v-model="wrapUpData.url">

          <!-- <div class="checkbox-label">
            <label>Make Recording Private</label>
            <div class="checkbox-container">
              <input id="private" type="checkbox" v-model="wrapUpData.private">
              <label for="private" class="checkbox-icon"></label>
            </div>
          </div> -->
        </fieldset>
      </template>

      <button type="submit">Wrap Up</button>
    </form>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 70px;
}

form {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--color-background);
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  font-size: 20px;
}

/* Label styles */
label {
  display: block;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--color-heading);
}

/* Input styles */
input[type="text"],
input[type="number"],
input[type="time"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: none;
  border-radius: 5px;
  background-color: var(--color-background-mute);
  color: var(--color-text);
  box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.1);
}

.checkbox-label {
  display: flex;
  align-items: start;
  justify-content: left;
}

input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  appearance: none;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  transition: background-color 0.3s ease;
}

br {
  display: none;
  /* hide the <br> tag */
}

/* Textarea styles */
textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: none;
  border-radius: 5px;
  background-color: var(--color-background-mute);
  color: var(--color-text);
  box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.1);
}

/* Select styles */
select {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: none;
  border-radius: 5px;
  background-color: var(--color-background-mute);
  color: var(--color-text);
  box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.1);
}

/* Button styles */
button[type="submit"] {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  border: none;
  border-radius: 5px;
  background-color: var(--color-heading);
  color: var(--color-background);
  font-weight: bold;
  text-transform: uppercase;
  transition: background-color 0.2s ease-in-out;
}

button[type="submit"]:hover {
  background-color: var(--color-border-hover);
  cursor: pointer;
}

/* Fieldset styles */
fieldset {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: 5px;
}

/* Legend styles */
legend {
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--color-heading);
}


/* Radio button styles */
input[type="radio"]+label {
  font-weight: normal;
  color: var(--color-text);
}


.checkbox-label {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.checkbox-label label {
  color: hsla(160, 100%, 37%, 1);
  font-weight: bold;
  margin-right: 10px;
}

.checkbox-container {
  position: relative;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  top: -4px;
}

.checkbox-container input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-container .checkbox-icon {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.checkbox-container .checkbox-icon::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 12px;
  height: 12px;
  background-color: transparent;
  border: 1px solid #ccc;
  border-radius: 10px;
  transition: transform 0.2s ease-in-out, background-color 0.3s ease-in-out;
}

.checkbox-container input[type="checkbox"]:checked+.checkbox-icon::before {
  transform: translate(-50%, -50%) scale(1);
  background-color: hsla(160, 100%, 37%, 1);
}

/* .checkbox-container input[type="checkbox"]:focus + .checkbox-icon {
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
} */


.radio-label {
  display: inline-block;
  margin-right: 10px;
  font-weight: bold;
}

.radio-group {
  display: inline-block;
  vertical-align: middle;
}

.radio-option {
  display: inline-flex;
  align-items: center;
  margin-right: 15px;
  font-size: 14px;
  cursor: pointer;
}

.radio-input {
  display: none;
}

.radio-button {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #bbb;
  margin-right: 5px;
  position: relative;
  vertical-align: middle;
}

.radio-button::after {
  content: '';
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #bbb;
  transition: transform 0.2s ease-in-out;
}

.radio-input:checked+.radio-button::after {
  transform: translate(-50%, -50%) scale(1);
}

.radio-option:last-child {
  margin-right: 0;
}
</style>
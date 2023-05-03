<script lang="ts" setup>
import useStore from '@/stores/store';
import { type Experience, Chain, TokenType, type IRoomCreation, type ICreateExperience } from '@/utils/types';
import { ref, type Ref, computed } from 'vue';
import { createExperience as createExperienceAPI } from "@/utils/api"
import { useRouter } from 'vue-router';
import RecordingsContract from '@/contract/RecordingsContract';
const router = useRouter()
const store = useStore()
const userAddress = store.user!.ethAddress

const exp: Ref<IRoomCreation> = ref( {
  "expTitle": "New World",
  "expDescription": "Catch on new Events happening accross fields, like AI,ML and WEB3",
  "tokenGatedRoom": false,
  "startTime": ( new Date() ).toISOString(),
  "expiryTime": ( new Date() ).toISOString(),
  participantsAllowed: 50,
  hosts: [
    userAddress
  ],
  "tokenGatedRecording": false,
  "recordingMetadata": {
    "tokenType": "REC20",
    "chain": "FILECOIN_HYPERSPACE"
  },
  "roomConfig": {
    "roomLocked": true,
    "videoOnEntry": true,
    "muteOnEntry": true,
    "tokenType": "ERC20",
    "chain": "ETHEREUM",
    "contractAddress": "0x............"
  }
} )

const recordMetaMisc: Ref<{ tokenName: string, tokenSymbol: string }> = ref( {
  tokenName: "RecToken",
  tokenSymbol: "REC"
} )

const hosts = computed( {
  get ()
  {
    return exp.value.hosts
  },
  set ( newHosts )
  {
    exp.value.hosts = newHosts
  }
} )

function addHost ()
{
  exp.value.hosts.push( '' )
}
function removeHost ( index: number )
{
  console.log( exp.value.hosts, ...exp.value.hosts.slice( 0, index ), ...exp.value.hosts.slice( index + 1, 0 ) );

  exp.value.hosts.splice( index, 1 )
}
function updateHost ( index: number, value: string )
{
  exp.value.hosts[ index ] = value
}

function getEnumValues<T> ( enumType: T ): Array<string>
{
  return [
    ...new Set(
      Object.entries( enumType as any )
        .filter( ( [ key ] ) => !~~key )
        .flatMap( ( item ) => item ),
    ),
  ] as any
}

async function createExpWrapper ( data: ICreateExperience )
{
  const createdExp = await createExperienceAPI( data )
  return createdExp
}

async function deployAndGetContractAdd ()
{
  const provider = await RecordingsContract.getProvider()
  const recContract = new RecordingsContract( { name: recordMetaMisc.value.tokenName, symbol: recordMetaMisc.value.tokenSymbol }, provider )
  const contractAddress = await recContract.deploy()
  return contractAddress
}

async function createExperience ()
{
  console.log( JSON.parse( JSON.stringify( exp.value ) ) );
  let createdExp: Experience
  const startTime = new Date()
  startTime.setHours( parseInt( exp.value.startTime.split( ":" )[ 0 ] ) )
  startTime.setMinutes( parseInt( exp.value.startTime.split( ":" )[ 1 ] ) )
  const expiryTime = new Date()
  expiryTime.setHours( parseInt( exp.value.expiryTime.split( ":" )[ 0 ] ) )
  expiryTime.setMinutes( parseInt( exp.value.expiryTime.split( ":" )[ 1 ] ) )

  exp.value.startTime = startTime.toISOString()
  exp.value.expiryTime = expiryTime.toISOString()
  if ( !exp.value.tokenGatedRoom && !exp.value.tokenGatedRecording )
  {
    const { roomConfig: { roomLocked, muteOnEntry, videoOnEntry }, recordingMetadata, ...rest } = exp.value
    createdExp = await createExpWrapper( {
      ...rest, roomConfig: {
        roomLocked, muteOnEntry, videoOnEntry
      },
      recordingMetadata: {}
    } )
  } else if ( !exp.value.tokenGatedRoom && exp.value.tokenGatedRecording )
  {
    // deploy recording contract... -> contract address
    // add contract address etc and create exp
    const contractAddress = await deployAndGetContractAdd()
    const { roomConfig, recordingMetadata, ...rest } = exp.value
    createdExp = await createExpWrapper( {
      ...rest, roomConfig,
      recordingMetadata: { ...recordingMetadata, contractAddress }
    } )
  } else if ( exp.value.tokenGatedRoom && !exp.value.tokenGatedRecording )
  {
    const { roomConfig, recordingMetadata, ...rest } = exp.value
    createdExp = await createExpWrapper( {
      ...rest, roomConfig,
      recordingMetadata: {}
    } )
  } else
  {
    const contractAddress = await deployAndGetContractAdd()
    const { roomConfig, recordingMetadata, ...rest } = exp.value
    createdExp = await createExpWrapper( {
      ...rest, roomConfig,
      recordingMetadata: { ...recordingMetadata, contractAddress }
    } )
  }
  console.log( createdExp );
  router.push( { name: "ExperienceDetails", params: { id: createdExp.id } } )
}



</script>

<template>
  <div class="dashboard">
    <form @submit.prevent="createExperience">
      <label>Experience Title:</label>
      <input type="text" v-model="exp.expTitle"><br>

      <label>Experience Description:</label>
      <textarea v-model="exp.expDescription"></textarea><br>

      <label>Participants Allowed:</label>
      <input type="number" v-model="exp.participantsAllowed"><br>

      <div class="hosts-section">
        <label>Hosts:</label>
        <div>
          <div v-for="(host, index) in hosts" :key="index">
            <input type="text" :value="host" none @input="updateHost( index, $event.target.value )">
            <button @click="removeHost( index )">Remove</button>
          </div>
          <button @click="addHost()">Add Host</button>
        </div>
      </div>

      <label>Start Time:</label>
      <input type="time" v-model="exp.startTime" step="60"><br>

      <label>Expiry Time:</label>
      <input type="time" v-model="exp.expiryTime" step="60"><br>

      <div class="checkbox-label">
        <label>Room Locked:</label>
        <div class="checkbox-container">
          <input id="room-locked" type="checkbox" v-model="exp.roomConfig.roomLocked">
          <label for="room-locked" class="checkbox-icon"></label>
        </div>
      </div>

      <div class="checkbox-label">
        <label>Mute on Entry:</label>
        <div class="checkbox-container">
          <input id="mute-entry" type="checkbox" v-model="exp.roomConfig.muteOnEntry">
          <label for="mute-entry" class="checkbox-icon"></label>
        </div>
      </div>

      <div class="checkbox-label">
        <label>Video on Entry:</label>
        <div class="checkbox-container">
          <input id="video-entry" type="checkbox" v-model="exp.roomConfig.videoOnEntry">
          <label for="video-entry" class="checkbox-icon"></label>
        </div>
      </div>

      <div class="checkbox-label">
        <label>Token Gated Recording:</label>
        <div class="checkbox-container">
          <input id="token-gated-recording" type="checkbox" v-model="exp.tokenGatedRecording">
          <label for="token-gated-recording" class="checkbox-icon"></label>
        </div>
      </div>

      <template v-if="exp.tokenGatedRecording">
        <label>Recording Metadata:</label>
        <fieldset>
          <label>Token Name:</label>
          <input type="text" v-model="recordMetaMisc.tokenName">
          <label>Token Symbol:</label>
          <input type="text" v-model="recordMetaMisc.tokenSymbol">

          <label class="radio-label" data-v-336c5134="">Token Type:</label>
          <div class="radio-group">
            <label class="radio-option">
              <input class="radio-input" type="radio" v-model="exp.recordingMetadata.tokenType" name="token-type"
                value="REC20">
              <span class="radio-button"></span>
              REC20
            </label>
          </div>


          <label>Chain:</label>
          <select v-model="exp.recordingMetadata.chain">
            <option value="FILECOIN_HYPERSPACE">FILECOIN_HYPERSPACE</option>
          </select><br>
        </fieldset>
      </template>

      <div class="checkbox-label">
        <label>Token Gated Room:</label>
        <div class="checkbox-container">
          <input id="token-gated-room" type="checkbox" v-model="exp.tokenGatedRoom">
          <label for="token-gated-room" class="checkbox-icon"></label>
        </div>
      </div>


      <fieldset v-if="exp.tokenGatedRoom">
        <label>Room Configuration:</label>
        <label class="radio-label">Token Type:</label>
        <div class="radio-group">
          <template v-for="tokenType in getEnumValues( TokenType )">
            <label class="radio-option">
              <input class="radio-input" type="radio" v-model="exp.roomConfig.tokenType" name="roomConfig-token-type"
                :value="tokenType">
              <span class="radio-button"></span>
              {{ tokenType }}
            </label>
          </template>
        </div>

        <label>Chain:</label>
        <select v-model="exp.roomConfig.chain">
          <option :value="chain" v-for="chain in getEnumValues( Chain )">{{ chain }}</option>
        </select>

        <label>Contract Address:</label>
        <input type="text" v-model="exp.roomConfig.contractAddress">
      </fieldset>

      <button type="submit">Save</button>
    </form>
  </div>
</template>

<style scoped>
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
  top: 8px;
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

/* Overall form styles */

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

input[type="checkbox"]:checked {
  background-color: #007bff;
}

input[type="checkbox"]:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
}

input[type="radio"] {
  margin-right: 5px;
  vertical-align: middle;
  margin-left: 20px;
}

label[for^="radio"] {
  margin-right: 10px;
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

.hosts-section {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  padding: 20px;
  margin-bottom: 10px;
}

.hosts-section label {
  display: block;
  font-weight: bold;
  color: var(--color-heading);
  margin-bottom: 10px;
}

.hosts-section input[type="text"] {
  border: none;
  border-bottom: 1px solid var(--color-border);
  padding: 5px;
  margin-bottom: 10px;
  font-size: 16px;
  color: var(--color-text);
  background-color: var(--color-background-soft);
  outline: none;
}

.hosts-section input[type="text"]:active {
  outline: none;
}

.hosts-section button {
  background-color: var(--color-background-mute);
  border: none;
  color: var(--color-text);
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
}

.hosts-section button:hover {
  background-color: var(--color-border-hover);
}

/* Error message styles */
.error {
  color: red;
  margin-top: 10px;
}
</style>
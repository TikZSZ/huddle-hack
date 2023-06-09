<script setup lang="ts">
import { getExperience, getRecording, getRecordings, getRoomConfig, wrapUp as wrapUpAPI, initMeet as initMeetAPI, createIFrameRoom, getCar } from '@/utils/api';
import type { Experience, RecordingResponse, Recordings } from '@/utils/types';
import { onMounted, ref, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useStore from "@/stores/store"
import RecordingsContract from '@/contract/RecordingsContract';
import axios from 'axios';

const store = useStore()
const route = useRoute()
const router = useRouter()

console.log( route.params );
const id = route.params.id

const experience: Ref<Experience> = ref( {
  "id": 1,
  "expTitle": "Beta Experiance",
  "expDescription": "Welcome to the Future of Social Media",
  "participantsAllowed": 50,
  "roomId": null,
  "roomCreationTime": null,
  "tokenGatedRoom": true,
  "tokenGatedRecording": false,
  "ownerId": 1,
  "experianceStats": {
    "id": 1,
    "experianceStatus": "FINISHED",
    "totalRatings": 0,
    "overallRating": 2.6,
    "startTime": "2023-05-01T04:03:48.810Z",
    "expiryTime": "2023-05-01T08:03:48.810Z",
    "lastMeet": null,
    "experienceId": 1
  },
  "hosts": [
    {
      "id": 1,
      "ethAddress": "0x098868A79E548c07A03eE83E10fB323511feCb0F",
      "email": null,
      "nonce": "e2604877196bd6be3bf309ccabe5450bdc7db19ecd8a64e46d8b2445b878e4eb"
    }
  ],
} )

const recordings: Ref<Recordings | null> = ref( null )
const downloadAnchorTag: Ref<HTMLAnchorElement | null> = ref( null )
const joinRoomRef: Ref<HTMLAnchorElement | null> = ref( null )

function triggerDownload ( url: string )
{
  if ( !downloadAnchorTag.value ) throw new Error( "Could not initalize download anchor" )
  downloadAnchorTag.value.href = url
  downloadAnchorTag.value.download = url.split( "/" )[ -1 ] || ""
  downloadAnchorTag.value.click()
}

async function getURLFromContract ( recId: number )
{
  const { recMetadata, recording, recContractId } = await getRecording( experience.value.id, recId )
  const provider = await RecordingsContract.getProvider()
  const recordingContract = new RecordingsContract( { contractAddress: recMetadata.contractAddress }, provider )
  const recURL = await recordingContract.getRecording( recContractId )
  if ( !recURL ) throw new Error( `couldn't download a recording from ${recMetadata.contractAddress} for id ${recContractId}` )
  return recURL
}

async function downloadRecording ( recId: number )
{
  //"https://i.ibb.co/N9byH6K/52437634tg.jpg"
  console.log( recId );
  const { recMetadata, recording, recContractId } = await getRecording( experience.value.id, recId )
  if ( !recording && recContractId )
  {
    // do frontend download
    const recURL = await getURLFromContract(recId)
    triggerDownload( recURL )
  } else
  {
    if ( recording && recording.url )
      triggerDownload( recording.url )
  }
}

async function saveToFileCoin ( recId: number )
{
  const recURL = await getURLFromContract(recId)
  router.push( { name: "MakeDeal", params: { expId: experience.value.id, recId }, query: { url:recURL} } )
}

function redirectToMeetPage ()
{
  if ( !experience.value.roomId || !joinRoomRef.value )
  {
    console.log( "cannot redirect" );
    return
  }
  joinRoomRef.value.target = "_blank"
  joinRoomRef.value.href = `https://iframe.huddle01.com/${experience.value.roomId}`
  joinRoomRef.value.click()
}

async function initMeet ()
{
  try
  {
    store.showOverlay( true )
    store.setLoaderMessage( "Creating Room..." )
    const { id, roomTitle: title, roomDescription: description, experianceId, conditionType, conditionValue, contractAddress, expiryTime, startTime,
      ...rest } = await getRoomConfig( experience.value.id )
    const contractAddresses = contractAddress ? [ contractAddress ] : undefined
    const hostWallets = experience.value.hosts.map( ( host ) => host.ethAddress )
    const createdRoom = await createIFrameRoom( { title, description, hostWallets, contractAddress: contractAddresses, ...rest } )
    if ( createdRoom.data.roomId )
    {
      const exp = await initMeetAPI( experience.value.id, createdRoom.data.roomId )
      experience.value = exp
      redirectToMeetPage()
    }
    store.showOverlay( false )
  } catch ( err )
  {
    console.error( err )
    store.showOverlay( false )
  }
}

async function wrapUp ()
{
  router.push( { name: "WrapUp", params: { id: experience.value.id } } )
}

onMounted( async () =>
{
  const exp = await getExperience( parseInt( id as string ) )
  experience.value = exp
  const recs = await getRecordings( exp.id )
  recordings.value = recs
} )

</script>

<template>
  <div class="experience-page">
    <header>
      <div class="header-content">
        <div class="header-flex">
          <div class="experience-header-flex">
            <img src="/experience.jpg" alt="Experience Image" class="header-image">
            <div class="header-text">
              <h1>{{ experience.expTitle }}</h1>
              <p>{{ experience.expDescription }}</p>
            </div>
          </div>
          <section class="experience-stats">
            <div class="stats-content">

              <div class="rating">
                <div class="rating-stars">
                  <template v-for="i in Math.ceil( experience.experianceStats.overallRating - 0.5 )">
                    <svg v-if="i <= Math.floor( experience.experianceStats.overallRating )" class="star filled"
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12.2,2.1L9.8,8.5H3.5l6.1,4.7L6.5,21.2l5.7-3.1L18,21.2l-2.9-8.1l6.1-4.7H15.3L12.2,2.1z" />
                    </svg>
                    <svg
                      v-else-if="i == Math.ceil( experience.experianceStats.overallRating ) && experience.experianceStats.overallRating % 1 >= 0.5"
                      class="star half-filled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12.2,2.1L9.8,8.5H3.5l6.1,4.7L6.5,21.2l5.7-3.1L18,21.2l-2.9-8.1l6.1-4.7H15.3L12.2,2.1z" />
                    </svg>
                    <svg v-else class="star empty" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12.2,2.1L9.8,8.5H3.5l6.1,4.7L6.5,21.2l5.7-3.1L18,21.2l-2.9-8.1l6.1-4.7H15.3L12.2,2.1z" />
                    </svg>
                  </template>
                </div>
                <span class="rating-count">{{ experience.experianceStats.totalRatings }} Ratings</span>
              </div>
              <div class="participants">
                <svg class="icon" :style="{ marginTop: '12px' }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="#181818"
                    d="M12 0c-6.628 0-12 5.372-12 12s5.372 12 12 12 12-5.372 12-12-5.372-12-12-12zm5 14h-10c-.552 0-1-.448-1-1s.448-1 1-1h10c.552 0 1 .448 1 1s-.448 1-1 1z" />
                </svg>
                <span class="participants-count">{{ experience.participantsAllowed }} Participants</span>
              </div>
              <div class="time ">
                <svg class="icon icon-clock" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12,2.5A9.5,9.5,0,1,1,2.5,12,9.5,9.5,0,0,1,12,2.5m0-2.5A12,12,0,1,0,24,12,12,12,0,0,0,12,0Z"
                    stroke-width="1.5" stroke="#000" fill="#fff" />
                  <path d="M12,12L12,5" stroke-width="1.5" stroke="#000" />
                  <path d="M12,12L8.5,12.5" stroke-width="1.5" stroke="#000" />
                  <path d="M12,12L13,9" stroke-width="1.5" stroke="#000" />
                </svg>
                <span class="time-count">{{ new Date( experience.experianceStats.startTime ).toLocaleTimeString( [], {
                  hour:
                    '2-digit', minute: '2-digit'
                } ) }} - {{ new Date( experience.experianceStats.expiryTime ).toLocaleTimeString( [],
  { hour: '2-digit', minute: '2-digit' } ) }}</span>
              </div>
              <div class="status">
                <button v-if="experience.experianceStats.experianceStatus === 'ONGOING' && experience.roomId"
                  class="join-room" @click="redirectToMeetPage">Join Room</button>
                <button v-else class="join-room-inactive" @click="redirectToMeetPage">Inactive</button>
                <a href="" ref="joinRoomRef" hidden></a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </header>

    <div class="section-parent">
      <!-- <div class="host-buttons">
        <button v-if="!roomInfo" class="create-room" @click="createRoom">Create Room</button>
        <button v-if="roomInfo && !isHost" class="join-room" @click="joinRoom">Join Room</button>
        <button v-if="roomInfo && isHost" class="end-room" @click="endRoom">End Room</button>
      </div> -->
      <section class="host-buttons">
        <button class="create-room" @click="initMeet()"
          v-if="store.isLoggedIn() && experience.experianceStats.experianceStatus === 'FINISHED' && experience.ownerId == store.user!.id">
          Initiate Room
        </button>
        <button class="end-room" @click="wrapUp()"
          v-if="store.isLoggedIn() && experience.experianceStats.experianceStatus === 'ONGOING' && experience.ownerId == store.user!.id">
          Initiate Wrap Up!
        </button>
      </section>

      <section class="hosts">
        <h2>Hosts</h2>
        <div class="hosts-content">
          <div v-for="host in experience.hosts" :key="host.id" class="host">
            <div class="host-info">
              <img src="/artitst.jpg" alt="Host Image" class="host-image">
              <p class="host-address"
                :style="{ color: store.user?.ethAddress === host.ethAddress ? 'hsla(160, 100%, 37%, 1)' : '#6b7280' }">{{
                  host.ethAddress.substring( 0, 10 ) }}...</p>
            </div>
          </div>
        </div>
      </section>

      <section class="recordings" v-if="recordings && recordings.length > 0">
        <h2>Recordings</h2>
        <div class="recording-cards">
          <div class="recording-card" v-for="recording in recordings" :key="recording.id">
            <div class="recording-info">
              <h3 class="rec-title">{{ recording.recTitle }}</h3>
              <p class="rec-description">{{ recording.recDescription }}</p>
              <p class="rec-date">{{ new Date( recording.dateRecorded ).toLocaleString() }}</p>
            </div>
            <div class="recording-actions">
              <button class="download-btn" @click="downloadRecording( recording.id )">Download</button>
            </div>
            <div v-if="experience.tokenGatedRecording" class="recording-actions">
              <button class="download-btn" @click="saveToFileCoin( recording.id )">Save to FileCoin</button>
            </div>
          </div>
          <!-- Add more recording cards here -->
        </div>
        <a href="" target="__blank" ref="downloadAnchorTag" hidden></a>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Header Section */

.experience-page {
  padding: 3% 0 3% 0;
}


.header-flex {
  display: flex;
  align-items: center;
  column-gap: 20px;
  padding: 25px;
  background-color: hsla(160, 100%, 37%, 1);
  border-radius: 20px 20px 0 0px;
  justify-content: space-evenly;
  color: var(--vt-c-black-mute);
}

.experience-header-flex {
  display: flex;
  align-items: center;
  column-gap: 20px;
  padding: 25px;
  background-color: hsla(160, 100%, 37%, 1);
  border-radius: 20px 20px 0 0px;
  justify-content: space-evenly;
  color: var(--vt-c-black-mute);
}

.header-image {
  max-width: 230px;
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

}

.header-text h1 {
  font-size: 40px;
}

.header-text p {
  font-size: 20px;
}

/* Stats Section */
/* Room Section */

.rating {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.rating-stars {
  display: flex;
}

.star {
  width: 18px;
  height: 18px;
  margin-right: 5px;
  fill: #FFC107;
}

.rating-count {
  font-size: 14px;
  margin-left: 5px;
}

.participants {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.icon {
  width: 27px;
  height: 27px;
  margin-right: 5px;
  fill: #00BFA6;
}

.participants-count {
  font-size: 20px;
  margin-left: 5px;
  margin-top: 10px;
}

.time {
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin-top: 8px;
}

.time-count {
  font-size: 20px;
  margin-left: 5px;
}

.status {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.status .icon {
  width: 26px;
  height: 26px;
  margin-right: 5px;
}

.status-text {
  font-size: 20px;
  margin-left: 5px;
}

.section-parent {
  background-color: var(--color-background);
  border-radius: 0 0 20px 20px;
  padding: 30px;
}

/* Buttons Section */
.host-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
}

.create-room {
  background-color: hsla(160, 100%, 37%, 1);
}

.create-room:hover {
  background-color: hsla(160, 100%, 47%, 1);
}

.join-room {
  margin-top: 10px;
  background-color: var(--color-background);
  color: #00FF00;
  font-weight: 600;
  border: 2px solid var(--color-background);
  border-radius: 10px;
}

.join-room:hover {
  background-color: var(--color-background-soft);
  border: 2px solid var(--color-background-soft);
}


.join-room-inactive {
  margin-top: 10px;
  background-color: var(--color-background);
  color: #FF0000;
  font-weight: 600;
  border: 2px solid var(--color-background);
  border-radius: 10px;
}

.end-room {
  background-color: hsla(0, 100%, 50%, 1);
}

.end-room:hover {
  background-color: hsla(0, 100%, 60%, 1);
}


/* Hosts Section */
.hosts {
  padding: 50px 0 25px 0;
  text-align: center;
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.hosts-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  column-gap: 60px;
}

.hosts h2 {
  margin-bottom: 30px;
  font-size: 2.5rem;
}

.host {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.host-info {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
}

.host-address {
  width: 120px;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  font-weight: bold;
  text-align: center;
  margin: 0;
  position: absolute;
  bottom: 0;
  left: 0;
  text-align: center;
}

.host-image {
  width: 100%;
  height: auto;
}



/* Records Section */
.recordings {
  padding: 20px;
}

.recording-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.recordings h2 {
  font-size: 2.2rem;
  margin-bottom: 15px;
  text-align: center;
}

.recording-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  background-color: var(--color-background-soft);
  transition: box-shadow 0.3s ease-in-out;
  outline: none;
}

.recording-card:hover {
  outline: none;
}

.recording-info {
  width: 80%;
}

.rec-title {
  font-size: 24px;
  margin-bottom: 10px;
  color: hsla(160, 100%, 37%, 1);
}

.rec-description {
  margin-bottom: 10px;
  width: 100%;
  max-width: 80%;
  color: var(--color-text);
}


.rec-date {
  color: rgb(107, 114, 128);
}

.recording-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.download-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: hsla(160, 100%, 37%, 1);
  color: var(--vt-c-white);
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  margin: 0 10px;
}

.download-btn:hover {
  background-color: var(--vt-c-black-mute);
}

@media screen and (max-width: 1140px) {
  .header-flex {
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
  }

  .experience-header-flex {
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
  }


  .hosts-content {
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
    column-gap: 20px;
  }

  .header-flex>div {
    flex-basis: 100%;
    margin-bottom: 20px;
  }

  .header-text {
    margin: 20px 0;
    font-size: 25px;
  }

  .header-image {
    max-width: 150px;
    margin-bottom: 20px;
  }
}

/* Feedback section */

.feedback {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 32px 0;
}

.feedback h2 {
  font-size: 28px;
  margin-bottom: 16px;
}

.feedback form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.feedback label {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

.feedback label span {
  font-size: 20px;
  margin-bottom: 8px;
}

.feedback select {
  font-size: 20px;
  padding: 8px;
  border: 2px solid #999;
  border-radius: 4px;
  width: 100%;
  max-width: 200px;
}

.feedback button[type="submit"] {
  font-size: 20px;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #00BFA6;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.feedback button[type="submit"]:hover {
  background-color: #00796b;
}
</style>

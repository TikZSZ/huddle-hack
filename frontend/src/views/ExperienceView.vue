<script setup lang="ts">
import { getExperience } from '@/utils/api';
import type { Experience } from '@/utils/types';
import exp from 'constants';
import { onMounted, ref, type Ref } from 'vue';
import { routeLocationKey, useRoute } from 'vue-router';

const route = useRoute()
console.log( route.params );
const id = route.params.id

const experience:Ref<Experience> = ref( {
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

onMounted(async () => {
  const exp = await getExperience(parseInt(id as string))
  experience.value = exp
})

</script>

<template>
  <div class="experience-page">
    <header>
      <div class="header-content">
        <div class="header-flex">
          <div class="header-flex">
            <img src="/chat-room.jpg" alt="Experience Image" class="header-image">
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
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="#00BFA6"
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
        <button class="create-room">Create Room</button>
        <button class="join-room">Join Room</button>
        <button class="end-room">End Room</button>
      </section>

      <section class="hosts">
        <h2>Hosts</h2>
        <div class="hosts-content">
          <div v-for="host in experience.hosts" :key="host.id" class="host">
            <div class="host-info">
              <img src="/chat-room.jpg" alt="Host Image" class="host-image">
              <p class="host-address">{{ host.ethAddress.substring( 0, 10 ) }}...</p>
            </div>
          </div>
        </div>
      </section>

      <section class="feedback">
        <h2>Feedback</h2>
        <form>
          <label>
            <span>Rating:</span>
            <!-- v-model="rating" -->
            <select>
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </select>
          </label>
          <!-- @click.prevent="submitFeedback" -->
          <button type="submit">Submit</button>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Header Section */

.experience-page {
  padding: 0 0 5% 0;
}


.header-flex {
  display: flex;
  align-items: center;
  column-gap: 20px;
  padding: 30px;
  background-color: var(--color-background-mute);
  border-radius: 20px 20px 0 0px;
  justify-content: space-between;
}

.header-image {
  max-width: 230px;
  border-radius: 50%;
}

.header-text {
  margin-left: 30px;
  font-size: 35px;
}
@media screen and (max-width: 1140px) {
.header-flex {
flex-wrap: wrap;
justify-content: center;
text-align: center;
}

.header-flex > div {
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
/* Stats Section */
.section-parent {
  background-color: var(--color-background);
  border-radius: 0 0 20px 20px;
  padding: 30px;
}


/* Hosts Section */
.hosts {
  padding: 50px;
  text-align: center;
  background-color: var(--secondary-color);
  color: var(--primary-color);
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
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
}

.host-address {
  width: 200px;
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

.host-name {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  font-weight: bold;
  text-align: center;
}

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
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  border: 2px solid hsla(160, 100%, 37%, 1);
}

.join-room:hover {
  background-color: hsla(160, 100%, 47%, 1);
}

.end-room {
  background-color: hsla(0, 100%, 50%, 1);
}

.end-room:hover {
  background-color: hsla(0, 100%, 60%, 1);
}

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
}

.time {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.time-count {
  font-size: 20px;
  margin-left: 5px;
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

.room {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
}
</style>

<script  lang="ts" setup>
import { getExperiences } from '@/utils/api';
import { onMounted, ref, type Ref } from 'vue';
import type { Experiences } from "@/utils/types"
import useStore from "@/stores/store"
import DiscoverCard from '@/components/DiscoverCard.vue';
const store = useStore()
const experiences: Ref<Experiences> = ref( [
  {
    "id": 1,
    "expTitle": "Alpha Experiance",
    "expDescription": "Welcome to the Future of Social Media",
    "participantsAllowed": 50,
    "roomId": "ad",
    "roomCreationTime": null,
    "tokenGatedRoom": true,
    "tokenGatedRecording": false,
    "ownerId": 1,
    "experianceStats": {
      "id": 1,
      "experianceStatus": "FINISHED",
      "totalRatings": 0,
      "overallRating": 2.6,
      "startTime": "2023-05-01T02:17:58.410Z",
      "expiryTime": "2023-05-01T06:17:58.410Z",
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
    "owner": {
      "id": 1,
      "ethAddress": "0x098868A79E548c07A03eE83E10fB323511feCb0F",
      "email": null,
      "nonce": "e2604877196bd6be3bf309ccabe5450bdc7db19ecd8a64e46d8b2445b878e4eb"
    }
  },
  {
    "id": 2,
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
      "overallRating": 5,
      "startTime": "2023-05-01T02:17:58.410Z",
      "expiryTime": "2023-05-01T06:17:58.410Z",
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
    "owner": {
      "id": 1,
      "ethAddress": "0x098868A79E548c07A03eE83E10fB323511feCb0F",
      "email": null,
      "nonce": "e2604877196bd6be3bf309ccabe5450bdc7db19ecd8a64e46d8b2445b878e4eb"
    }
  }
] )

onMounted( async () =>
{
  const exps = await getExperiences()
  experiences.value = exps
} )



</script>

<template>
  <div class="discover-page">
    <template v-if="experiences.length > 0">
      <div class="filter-bar">
  <div class="search-bar">
    <input type="text" placeholder="Search experiences...">
  </div>
  <div class="filter-sort">
    <button class="filter-btn">filter</button>
    <button class="sort-btn">sort</button>
  </div>
</div>
      <div class="discover-cards">
        <DiscoverCard v-for="exp in experiences" :key="exp.id" :experience="exp"></DiscoverCard>
      </div>
    </template>
    <div v-else :style="{ fontSize: '30px' }">
      No Experiences found. Login to create your own
    </div>
  </div>
</template>


<style scoped>

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-background);
  border-radius: 30px;
  padding: 10px 20px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

/* Search Bar */
.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  outline: none;
}

.search-bar input[type="text"] {
  width: 100%;
  background-color: transparent;
  border: none;
  outline: none;
  padding: 10px;
  font-size: 20px;
}

.search-bar button[type="submit"] {
  background-color: transparent;
  border: none;
  outline: none;
  margin-left: -40px;
  padding: 10px;
  font-size: 20px;
  color: var(--color-text);
}

.search-bar button[type="submit"]:hover {
  cursor: pointer;
}

/* Filter and Sort Buttons */
.filter-sort {
  display: flex;
}

.filter-btn, .sort-btn {
  background-color: var(--color-background-mute);
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 20px;
  color: var(--color-text);
  margin-left: 10px;
}

.filter-btn:hover, .sort-btn:hover {
  cursor: pointer;
  background-color: var(--color-border-hover);
}

.filter-btn:focus, .sort-btn:focus {
  outline: none;
}

.filter-btn:active, .sort-btn:active {
  background-color: var(--color-border);
}
.discover-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.discover-cards {
  display: flex;
  justify-content: center;
  flex-wrap: true;
  flex-direction: column;
  width: 100%;
  row-gap: 50px;
}

.discover-header {
  margin-top: 64px;
  margin-bottom: 32px;
  text-align: center;
}

.discover-header h1 {
  font-size: 36px;
  font-weight: bold;
}
</style>

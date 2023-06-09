<script lang="ts" setup>
import type { Experiences } from '@/utils/types';
import useStore from "@/stores/store"
type Unpacked<T> = T extends ( infer U )[] ? U : T;
const props = defineProps<{ experience: Unpacked<Experiences> }>()
const store = useStore()
console.log(JSON.parse(JSON.stringify(props.experience)));

</script>

<template>
  <div class="discover-card">
    <h2>{{ experience.expTitle }}</h2>
    <div class="discover-card-stats">
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
        <span class="rating-count">{{ experience.experianceStats.totalRatings }}</span>
      </div>
      <div class="participants">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill="#00BFA6"
            d="M12 0c-6.628 0-12 5.372-12 12s5.372 12 12 12 12-5.372 12-12-5.372-12-12-12zm5 14h-10c-.552 0-1-.448-1-1s.448-1 1-1h10c.552 0 1 .448 1 1s-.448 1-1 1z" />
        </svg>
        <span class="participants-count">{{ experience.participantsAllowed }}</span>
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
      <div class="host">
        <div class="host-details">
          <p class="host-name">Hosts</p>
          <p class="host-eth-address"
            :style="{ color: store.user?.ethAddress === host.ethAddress ? 'hsla(160, 100%, 37%, 1)' : '#6b7280' }"
            v-for="host in experience.hosts">{{ host.ethAddress }}</p>
        </div>
      </div>
    </div>
    <div class="discover-card-footer">
      <router-link :to="{ name: 'ExperienceDetails', params: { id: experience.id } }">View Details</router-link>
    </div>
  </div>
</template>

<style scoped>
.discover-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: var(--color-background);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 2% 3% 2% 3%;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
}

.discover-card h2 {
  color: var(--text-color);
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.discover-card-stats {
  margin-top: 16px;
}

.discover-card-stats p {
  color: var(--text-color);
  font-size: 16px;
  margin-bottom: 8px;
}

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

.icon-clock {
  background-color: #00BFA6;
  border-radius: 50%;
  display: inline-block;
  height: 29px;
  width: 29px;
}

.icon-clock .time-count {
  color: black;
}

.host {
  display: flex;
  align-items: center;
}

.host-name {
  font-size: 14px;
  font-weight: bold;
  margin-right: 5px;
}

.host-eth-address {
  font-size: 14px;
  color: #6b7280;
}
</style>
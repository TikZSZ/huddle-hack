import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface User{
  userId:number;
} 

export default defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  const user = ref<User|null>(null)

  function isLoggedIn(){
    return !!user.value && !!user.value.userId
  }

  return { count, doubleCount, increment,isLoggedIn }
})

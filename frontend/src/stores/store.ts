import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/utils/types'



export default defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  const user = ref<User|null>(null)

  function isLoggedIn(){
    return !!user.value && !!user.value.id
  }

  return { count, doubleCount, increment,isLoggedIn,user }
})

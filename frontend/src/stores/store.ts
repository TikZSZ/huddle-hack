import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/utils/types'
import { verifyUser } from '@/utils/api'



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

  function loginUser(loggedUser:User){
    user.value = loggedUser
  }

  async function sVerifyUser(){
    try {
      const user = await verifyUser()
      loginUser(user)
    }catch(err){
      console.error(err);
    }
  }

  return { count, doubleCount, increment,isLoggedIn,user,loginUser,sVerifyUser }
})

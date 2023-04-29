<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AccountIcon from './components/account-icon.vue';
import useStore from "@/stores/store"
import Web3 from "web3"
import { bufferToHex } from 'ethereumjs-util';
import { ref } from 'vue';

const store = useStore()

const metaMaskButtonText = ref("Log in with Metamask")
const metaMaskLoginDisabled = ref(false)
async function handleMetamaskLogin() {
  try {
    if (!window.ethereum) {
      metaMaskLoginDisabled.value = true
      throw new Error("Metamask wallet not detected!")
    }
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    const address = accounts[0];
    const message = "some message";
 
    const signature = bufferToHex(await web3.currentProvider.send('personal_sign', [message, address]));
    const data = { message, signature };
  } catch (err) {
    console.error('Failed to log in with Metamask', err);
    metaMaskButtonText.value = (err as Error).message
  }
}
</script>

<template>
  <div class="app">
    <header>
    <nav class="navbar">
      <a class="navbar-brand" href="#">My Site</a>
      <div class="navbar-menu">
        <RouterLink to="/" >Home</RouterLink>
        <a href="#">Discover</a>
        <a href="#">Dashboard</a>
      </div>
      <div class="navbar-account">
        <div v-if="store.isLoggedIn()">
          <AccountIcon alt="User Avatar" />
          <span>0x1234...5678</span>
        </div>
        <div v-else>
          <button  @click="handleMetamaskLogin" :disabled="!metaMaskLoginDisabled" class="login-button">{{ metaMaskButtonText }}</button>
        </div>
        <div>

        </div>
        
      </div>
    </nav>
  </header>

  <RouterView />
  </div>
</template>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
.navbar {
  background-color: var(--vt-c-black);
  color: var(--vt-c-white);
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
}

.navbar-brand {
  font-weight: bold;
  font-size: 24px;
  text-transform: uppercase;
}

.navbar-menu {
  display: flex;
  align-items: center;
}

.navbar-menu a {
  color: var(--vt-c-white);
  text-decoration: none;
  margin-left: 20px;
  padding: 5px 10px;
}

.navbar-menu a:hover {
  background-color: var(--vt-c-black-soft);
  border-radius: 5px;
}

.navbar-account {
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.navbar-account span {
  color: var(--vt-c-white-mute);
  font-size: 14px;
  margin-right: 10px;
}

.navbar-account img {
  border-radius: 50%;
  height: 30px;
  width: 30px;
}

.login-button {
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    transition: background-color 0.3s;
  }

  .login-button:hover {
    background-color: #3e8e41;
  }


@media (max-width: 600px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
  }

  .navbar-menu {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 10px;
  }

  .navbar-menu a {
    margin: 5px 0;
    padding: 10px;
    display: block;
    border-radius: 5px;
  }

  .navbar-account {
    margin-top: 10px;
  }

  .navbar-account img {
    height: 20px;
    width: 20px;
  }
}


</style>

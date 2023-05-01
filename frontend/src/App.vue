<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AccountIcon from './components/account-icon.vue';
import useStore from "@/stores/store"
import { BrowserProvider, getBytes, toUtf8Bytes } from "ethers"
import { onMounted, ref } from 'vue';
import { getNonce, loginUser } from "@/utils/api"
const store = useStore()

const metaMaskButtonText = ref( "Log in with Metamask" )
const metaMaskLoginDisabled = ref( false )


async function handleMetamaskLogin ()
{
  try
  {
    if ( !window.ethereum )
    {
      const error = "Metamask wallet not detected!"
      metaMaskButtonText.value = error
      metaMaskLoginDisabled.value = true
      throw new Error( error )
    }
    const provider = new BrowserProvider( window.ethereum )
    await provider.send("wallet_switchEthereumChain",[{chainId:"0x1"}])
    await provider.send( "eth_requestAccounts", [] )
    const accounts = await provider.listAccounts()
    const account = accounts[ 0 ];
    const nonce = await getNonce( account.address )
    const message = `Please sign this ${nonce}`;
    let dataHash = toUtf8Bytes( message )

    const dataHashBin = getBytes( dataHash )
    console.log( dataHashBin );

    const signature = await account.signMessage( dataHash )
    const data = { nonce, signature };
    const loggedUser = await loginUser( account.address, data )
    store.loginUser( loggedUser.user )
  } catch ( err )
  {
    console.error( 'Failed to log in with Metamask', err );

  }
}

// Network name
// Filecoin - Hyperspace testnet
// Network URL
// https://filecoin-hyperspace.chainup.net/rpc/v1
// Chain ID
// 3141
// Currency symbol
// tFIL
// window.ethereum.request({
//     method: "wallet_addEthereumChain",
//     params: [{
//         chainId: "0x89",
//         rpcUrls: ["https://rpc-mainnet.matic.network/"],
//         chainName: "Matic Mainnet",
//         nativeCurrency: {
//             name: "MATIC",
//             symbol: "MATIC",
//             decimals: 18
//         },
//         blockExplorerUrls: ["https://polygonscan.com/"]
//     }]
// });

onMounted( async () =>
{
  await store.sVerifyUser()
  console.log(store.walletConnected);
  
  if ( window.ethereum )
  {
    store.updateWalletConnectionStatus( window.ethereum.isConnected() )
  }
} )
</script>

<template>
  <div class="app">
    <header>
      <nav class="navbar">
        <a class="navbar-brand" href="#">My Site</a>
        <div class="navbar-menu">
          <RouterLink to="/">Home</RouterLink>
          <!-- <a href="#">Discover</a> -->
          <!-- <a href="#">Dashboard</a> -->
          <RouterLink to="/discover">Discover</RouterLink>
          <RouterLink to="/dashboard">Dashboard</RouterLink>
        </div>
        <div class="navbar-account">
          <div v-if="store.isLoggedIn()" style="display: flex;">
            <AccountIcon alt="User Avatar" />
            <span style="margin-left: 5px;">0x1234...5678</span>
          </div>
          <div v-else>
            <button :class="{ 'normal-state': !metaMaskLoginDisabled, 'error-state': metaMaskLoginDisabled }"
              @click="handleMetamaskLogin" :disabled="metaMaskLoginDisabled" class="login-button">{{ metaMaskButtonText
              }}</button>
          </div>
        </div>
      </nav>
    </header>
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app {
  width: 95%;
  margin: 0 auto;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.content {
  margin: 60px auto 0 auto;
  width: 90%;
  padding-top: 1%;
  /* set margin-top equal to the height of the navbar */
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

.normal-state {
  background-color: #4caf50;
}

.normal-state:hover {
  background-color: #3e8e41;
}

.error-state {
  background-color: #f44336;
}

.error-state:hover {
  background-color: #c62828;
}

.login-button {

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

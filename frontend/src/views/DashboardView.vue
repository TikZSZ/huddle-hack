<script lang="ts" setup>
function submitData(e:Event){
  console.log("hello world");
}
</script>

<template>
  <div class="container">
    <!-- <h1>Experience Record Form</h1> -->
    <form @submit.prevent="(e:any) => {submitData(e);
    }">
      <label for="expTitle">Title:</label>
      <input type="text" id="expTitle" name="expTitle" placeholder="Enter title">

      <label for="expDescription">Description:</label>
      <input type="text" id="expDescription" name="expDescription" placeholder="Enter description">

      <label for="startTime">Start Time:</label>
      <input type="datetime-local" id="startTime" name="startTime">

      <label for="expiryTime">Expiry Time:</label>
      <input type="datetime-local" id="expiryTime" name="expiryTime">

      <div>
        <input type="checkbox" id="roomLocked" name="roomLocked" value="true">
        <label for="roomLocked">Room Locked</label>
      </div>

      <div>
        <input type="checkbox" id="muteOnEntry" name="muteOnEntry" value="true">
        <label for="muteOnEntry">Mute on Entry</label>
      </div>
      <div>
        <input type="checkbox" id="videoOnEntry" name="videoOnEntry" value="true">
        <label for="videoOnEntry">Video on Entry</label>
      </div>

      <label for="participantsAllowed">Participants Allowed:</label>
      <input type="text" id="participantsAllowed" name="participantsAllowed" placeholder="Enter participants allowed">

      <!-- <label for="currentParticipants">Current Participants:</label>
      <input type="text" id="currentParticipants" name="currentParticipants" placeholder="Enter current participants"> -->

      <!-- <label for="roomId">Room ID:</label>
      <input type="number" id="roomId" name="roomId" placeholder="Enter room ID"> -->

      <!-- <label for="timeCreated">Time Created:</label>
      <input type="datetime-local" id="timeCreated" name="timeCreated"> -->
      <div>
        <input type="checkbox" id="tokenGatedRoom" name="tokenGatedRoom" value="true">
        <label for="tokenGatedRoom">Token Gated Room</label>
      </div>

      <template>
        <label for="chain">Chain:</label>
        <select id="chain" name="chain">
          <option value="ETHEREUM">Ethereum</option>
          <option value="COSMOS">Cosmos</option>
          <option value="SOLANA">Solana</option>
        </select>

        <label for="tokenType">Token Type:</label>
        <select id="tokenType" name="tokenType">
          <option value="ERC20">ERC20</option>
          <option value="ERC721">ERC721</option>
          <option value="ERC1155">ERC1155</option>
          <option value="SPL">SPL</option>
          <option value="BEP20">BEP20</option>
        </select>

        <label for="gatedRoomContractAddress">Gated Room ContractAddress:</label>
      <input type="text" id="gatedRoomContractAddress" name="gatedRoomContractAddress" placeholder="Enter Contract Address">
      </template>




      <!-- <label for="roomTitle">Room Title:</label>
      <input type="text" id="roomTitle" name="roomTitle" placeholder="Enter room title">

      <label for="roomDescription">Room Description:</label>
      <input type="text" id="roomDescription" name="roomDescription" placeholder="Enter room description"> -->

      <div>
        <input type="checkbox" id="tokenGatedRecording" name="tokenGatedRecording" value="true">
        <label for="tokenGatedRecording">Token Gated Recording </label>
      </div>

      <button type="submit" >Submit</button>
    </form>
  </div>
</template>

<style scoped>
body {
  font-family: 'Roboto', sans-serif;
  background-color: #f8f8f8;
}

.container {
  width: 80%;
  margin: auto;
  padding: 50px 0;
}

h1 {
  text-align: center;
  font-weight: 400;
  font-size: 36px;
  margin-bottom: 50px;
}

form {
  background-color: #fff;
  padding: 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

input[type="checkbox"] {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  border: 2px solid #4CAF50;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
}

input[type="checkbox"]::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 10px;
  height: 10px;
  background-color: #4CAF50;
  border-radius: 50%;
  transition: transform 0.2s;
}

input[type="checkbox"]:checked::before {
  transform: translate(-50%, -50%) scale(1);
}

label {
  display: inline-block;
  margin-bottom: 8px;
  vertical-align: middle;
  color: #181818;
}

input[type=text] {
  width: calc(100% - 30px);
  padding: 12px;
  border: none;
  border-radius: 4px;
  box-shadow: 0 0 0 2px #4CAF50;
  margin-bottom: 16px;
  color: #333333
}

input::placeholder {
  color: #999999;
}

input[type=text]:focus,
input[type="datetime-local"]:focus,
select:focus {
  outline: 2px solid #8bc34a;
}

input[type="datetime-local"],
select {
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  box-shadow: 0 0 0 2px #4CAF50;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  color: #333333;

}


select option {
  font-family: 'Roboto', sans-serif;
  background-color: #4CAF50;
  outline: none;
  border: none;
  color: var(--color-text);
}

select option:focus {
  outline: none;
  border: none;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

button:hover {
  background-color: #45a049;
}
</style>
<script setup lang="ts">
import { RecordingsContract } from "@/contract/RecordingsContract"

// const provider = await RecordingsContract.getProvider()

// const recContract = new RecordingsContract( { name: "RecToken", symbol: "REC",contractAddress:"0xD723552acce3f08bb9A505a79eC675C7974919a4" }, provider )
// // const contractAddress = await recContract.deploy()
// // console.log( contractAddress );
// const count = await recContract.getCurrentCount()
// console.log(count);

// const rec1 = await recContract.addRecording(count+1,"https://amazonnews234")
// console.log(rec1);

// const rec2 = await recContract.getRecording(2)
// console.log(rec2);


</script>

<template>
  <main>
    <section class="features">
      <h3>What is HuddleCast?</h3>
      <p>HuddleCast is a cross-chain audio and video communication platform that enables users to create and host their
        own recurring events (experiences) that others can join. With the participant limit feature, the rooms have an
        exclusive and private feel to them, giving users a sense of privacy and security.</p>
      <p>The platform also ensures the security and privacy of recorded content through blockchain technology. The
        recording of events is not saved on the backend but rather on a smart contract (REC20) owned by the creator of the
        experience. This ensures the security and privacy of the recorded content through blockchain technology.</p>
    </section>

    <section class="benefits">
      <h3>Why use HuddleCast?</h3>
      <ul>
        <li>Promotes organic and meaningful communication</li>
        <li>Removes middleman</li>
        <li>No censorship</li>
        <li>Direct payment for creators</li>
        <li>Effectively counters piracy</li>
        <li>Cost-effective and decentralized</li>
      </ul>
    </section>

    <section class="use-cases">
      <div>
        <h3>Use Cases</h3>
      </div>
      <div>
        <ul>
          <li>Classes</li>
          <li>Gaming streams</li>
          <li>Live courses</li>
          <li>And more...</li>
        </ul>
      </div>
    </section>
  </main>

  <footer>
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Events</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
    <p>&copy; 2023 HuddleCast. All rights reserved.</p>
  </footer>
</template>

<style scoped>
main {
  min-height: calc(100vh - 150px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: var(--color-background);
}

section {
  padding: 40px;
  margin-bottom: var(--section-gap);
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
}

.use-cases {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
}

.use-cases li {
  margin: 10px;
  font-size: 24px;
}

.use-cases a {
  display: block;
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 20px;
  font-weight: bold;
  color: var(--vt-c-white);
  background-color: var(--vt-c-indigo);
  border-radius: 5px;
  text-align: center;
  text-decoration: none;
}

.use-cases a:hover {
  background-color: var(--vt-c-indigo);
  opacity: 0.8;
}

/* style the footer */
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: var(--vt-c-black-soft);
  color: var(--vt-c-white);
  font-size: 14px;
}

footer nav ul {
  display: flex;
  list-style: none;
}

footer nav li {
  margin: 0 10px;
}

footer nav li a {
  color: var(--vt-c-white-mute);
  text-decoration: none;
}

footer nav li a:hover {
  color: var(--vt-c-white);
}

footer p {
  margin: 0;
}

/* style headings */
h1,
h2,
h3,
h4,
h5,
h6 {
  color: var(--color-heading);
  margin-bottom: 10px;
}

h1 {
  font-size: 48px;
}

h2 {
  font-size: 36px;
}

h3 {
  font-size: 24px;
}

h4 {
  font-size: 18px;
}

h5 {
  font-size: 16px;
}

h6 {
  font-size: 14px;
}

/* style paragraphs */
p {
  margin-bottom: 10px;
}

/* style lists */
ul,
ol {
  margin-bottom: 10px;
}

ul li,
ol li {
  margin-left: 20px;
}

/* style links */
a {
  color: var(--color-text);
  text-decoration: none;
}

/* add hover styles to links */
a:hover {
  color: var(--vt-c-indigo);
}

/* add hover styles to links */
a:hover {
  color: var(--vt-c-indigo);
}

/* Styles for the features section */
.features {
  background-color: hsla(160, 100%, 37%, 1);
  padding: 80px;
  color: var(--color-background);
}

.features h3 {
  color: var(--color-heading);
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 30px;
}

.features p {
  color: #fff;
  font-size: 18px;
  line-height: 1.5;
  margin-bottom: 20px;
}

.features a {
  background-color: var(--vt-c-indigo);
  border: none;
  border-radius: 4px;
  color: var(--vt-c-white);
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  padding: 16px 30px;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.2s ease-in-out;
}

.features a:hover {
  background-color: var(--vt-c-text-light-1);
}

/* Styles for the benefits section */
.benefits {
  background-color: var(--color-background-mute);
  padding: 80px;
}

.benefits h3 {
  color: var(--color-heading);
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 30px;
}

.benefits ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.benefits li {
  color: var(--color-text);
  font-size: 18px;
  line-height: 1.5;
  margin-bottom: 20px;
}</style>

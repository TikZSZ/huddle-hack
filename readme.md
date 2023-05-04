# Welcome to HuddleCast
HuddleCast is a communication platform that provides a secure and exclusive way for content creators and businesses to communicate with their audience. HuddleCast's main use case is to provide a customizable and secure way to host recurring events(experiences), such as online courses, webinars, and conferences, with features like token gated rooms and token gated recordings. It allso allows recordings to be saved to filecoin network through DealClient Contract
#

![HuddleCast Flow](huddle-cast-flow.jpg)

# Contents
- [HuddleCast Structure](#huddlecast-structure)
- [Contract Addresses](#contract-addresses-all-deployed-on-filecoin-hyperspace)
- [Steps to run frontend](#steps-to-start-frontend)
- [Steps to run backend](#steps-to-start-backend)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Experience Creation Flow]


<br/>

## HuddleCast Structure
- App frontend -> `frontend` dir
- App backend -> `backend` dir
- Smart contract source code -> `frontend/src/contract`

<br/>

# Contract Addresses (All deployed on Filecoin Hyperspace)
- Token Gated Contract  `https://hyperspace.filfox.info/en/address/0x9803c3c49d56E66A9e5CA8dAf8b8b118909F37bd`
- FileCoin DealClient Contract `https://hyperspace.filfox.info/en/address/0x464B560CEBEa46F409A2C0dD39219Aa65a0F22Be`


<br/>

## Steps to start frontend

```sh
cd fontend
yarn install
yarn dev
# Frontend runs on http://localhost:5173
```

## Steps to start backend

```sh
cd backend
yarn install
# export DATABASE_URL = postgresql://postgres:password@localhost:5432/huddle?schema=public
# export LIGHTHOUSE_API_KEY = "ac1fe$$$$$.2f5a75$$$$$$$"
yarn dev
# Backend runs on http://localhost:5000
```

### Backend expects a postgres instance to be on localhost:5432, can be spwaned with docker by running
```docker
docker run --name mydb -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres
```

> ### Some enviorment vars are need to be set in `.env` file. For reference `.env.example` file is give.

<br/>

# Usage

1. start `backend`
2. start `frontend`
3. visit `http://localhost:5173`
4. Login with MetaMask
5. Navigate to `Dashboard` to Create Experience
6. Create a New Experience
   - Select `Token Gated Recording`
7. `Initialize Meet` to start a meeting session
8. After Meeting Is over, retrive `recording link` from `Huddle01` and click `WrapUp` to wrap current meet session
9. WrapUp meet
   - Select save `Recording`
   - provide `recording URL`
   - recording URL is saved in `Smart Contract`


<br/>
<br/>

# Technologies Used

### `Huddle01` -> Huddle01 is a core component of the HuddleCast platform, providing the necessary infrastructure for creating and hosting recurring events. The platform is built around meetings, and Huddle01 takes care of the room creation, we create experiences that hold the room configuration for Huddle's sdk, like room name, room description, timings, if the meet is suppoesd to be token gated then we store the token and contract information as well. With Huddle01's SDK, the process of initializing a token-gated room is seamless, allowing for hassle-free setup of recurring sessions.

### `FVM` -> The use of FVM in HuddleCast is two-fold. 

<br/>

### 1. Firstly, we use it to token-gate recordings of events. By deploying a REC20 smart contract, which is essentially an ERC20 contract with added functionality to store recording URLs, access to these recordings is restricted only to those who hold the corresponding token. This provides a high level of security and privacy for users, ensuring that recorded content is only accessible to authorized individuals.

<br/>

### 2. Secondly, we utilize FVM and the MakeDeal contract to store recordings on the Filecoin network by proposing store deals. Once we receive the recording URL from the frontend, we send it to the HuddleCast backend to upload its Car file on IPFS using the `Lighthouse SDK`. The backend sends back the car info to the frontend, The frontend then uses this information to create a makeDealProposal on the Filecoin network, which stores the recording securely and ensures data decentralization. Using FVM to store recordings on Filecoin offers several benefits for HuddleCast. Firstly, it ensures data security and decentralization, making it easy to move and replicate data while ensuring maximum ownership through decentralization. Secondly, it enables the platform to scale easily as Filecoin's storage capacity can be increased over time as more storage is needed `(Huddle stores recording only for 15 days so really good to have feature)`. Finally, it provides an added layer of security and privacy, which is essential for a platform that caters to business and educational needs.

<br/>
<br/>

# Experience Creation Flow
![Experience Creation Flow](experience-creation-flow.jpg)
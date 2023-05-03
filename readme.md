# Welcome to $App

- App frontend -> `frontend` dir
- App backend -> `backend` dir
- Smart contract source code -> `frontend/src/contract` addtionally one FILECOIN HYPERSPACE contract address is provided `https://hyperspace.filfox.info/en/address/0x21512337dE82B476826E014CfC1F809b32A4F263`

## Steps to start frontend

```sh
cd fontend
yarn install
yarn dev
```

## Steps to start backend

```sh
cd backend
yarn install
yarn dev
```
### Backend expects a postgres instance to be on localhost:5432
```docker
docker run --name mydb -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres
```

## Usage
1. start `backend`
2. start `frontend`
3. visit `http://localhost:5173`
3. Login with MetaMask
4. Navigate to `Dashboard` to Create Experience
5. Create a New Experience
    - Select `Token Gated Recording`
6. `Initialize Meet` to start a meeting session
7. After Meeting Is over, retrive `recording link` from `Huddle01` and click `WrapUp` to wrap current meet session
8. WrapUp meet
    - Select save `Recording`
    - provide `recording URL`
    - recording URL is saved in `Smart Contract`

## We are done
> Frontend runs on http://localhost:5173

> Backend runs on http://localhost:5000

## Used

Huddle01

FVM

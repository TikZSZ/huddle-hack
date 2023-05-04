# Welcome to HuddleCast

- App frontend -> `frontend` dir
- App backend -> `backend` dir
- Smart contract source code -> `frontend/src/contract`

### Contract Addresses (All deployed on Filecoin Hyperspace)
- Token Gated Contract  `https://hyperspace.filfox.info/en/address/0x9803c3c49d56E66A9e5CA8dAf8b8b118909F37bd`
- FileCoin DealClient Contract `https://hyperspace.filfox.info/en/address/0x464B560CEBEa46F409A2C0dD39219Aa65a0F22Be`

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

## We are done

> Frontend runs on http://localhost:5173

> Backend runs on http://localhost:5000

## Technologies Used

Huddle01

FVM

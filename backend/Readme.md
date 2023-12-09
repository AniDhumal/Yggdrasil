# Yggdrasil-backend

Yggdrasil backend is basically an engine that monitors the events, state of all the contracts deployed on several chains that are integrated with our platform.

![offchain](../docs/offchain.png)

### Functions

- `Protocol Monitoring` : Here our engine basically monitors the several DAPPs such as stader and lido finance for any major price fluctuations. So if there is a fluctuation we will pause the transactions to that particular DAPP.

- `Event Monitoring` : The engine monitors eveything across all the chains on which our strategy contracts are deployed and It will check for the events : `Invest` / `Devest`. These will be used to store the data and check whether that particular Strategy is performing well or not.

- `Strategy Module` : Each event when it is captured is then converted into a strategy object and it is monitored as a saperate entity and it is being used to take the data of the strategy and update in the db.

- `Fusion API Module` : For some strategies one migh require to swap the asset into some other asset so to save the user's hastle we are including the implementation of fusion-api for one inch module to swap the assets on the backend and then sending the transaction to the contract with the data.

### Setup

**To setup the database using docker :**

```sh
sudo docker pull postgres
sudo docker run --name staking-engine-db -e POSTGRES_PASSWORD=admin -d -p 5432:5432 postgres

# your db will be :
# postgresql://postgres:admin@localhost:5432/yggdrasil-db?schema=public
# copy this in .env
```

**To setup the engine :**

```sh
yarn
touch .env
touch .env.testnet.local

# after setting up the envs

yarn prisma generate
yarn prisma db push

# To start

yarn start:testnet
```

`.env`

```sh
DATABASE_URL="" # postgres url
```

`.env.testnet.local`

```sh
NODE_URL_ETH=""
NODE_URL_ARBITRUM=""
WSS_URL_ETH=""
P_KEY_ETH=""
ONE_INCH_API_KEY=""
```

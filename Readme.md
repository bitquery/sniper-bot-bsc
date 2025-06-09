# BSC Sniper Bot

This is the complete codebase of a BSC Sniper Bot for newly created Four Meme tokens. This bot implements on a very simple strategy, which is buying the token as soon as it is created, and then selling it after one minute has passed.

## Getting Newly created Four Meme Tokens

To get the newly created Four Meme tokens as soon as they are created, we are using [Protobuf Kafka](https://docs.bitquery.io/docs/streams/protobuf/chains/Bitcoin-protobuf/) solution provided by Bitquery. Here is an [example](https://docs.bitquery.io/docs/streams/protobuf/kafka-protobuf-js/) code for implementing the solution in JS.

## Buying and Selling  Token

To implement the buying and selling of a token, we are utilising the functions of the Four Meme DEX smart contract and wrapping them in our own functions, namely `buyViaLaunchpad` and `sellTokenViaLaunchpad`. We are utilising `ethers` library to create an instance of the contract using the contract address and contract ABI, and then utilising the functions of the same.

## Setup

1. Clone the repository

```sh
git clone https://github.com/Kshitij0O7/evm-sniper
cd evm-sniper
```

2. Install the Dependencies

```sh
npm install
```

## Running

Create a `.env` file and create the following variables.
- KAFKA_USERNAME
- KAFKA_PASSWORD
- PRIVATE_KEY1

Run the bot by using this command:

```sh
npm run start
```

## Deployment

- Create or Sign into any cloud service provider account. For this tutorial, we have choosen the `Google Cloud`.

- Create a VM(virtual machine) instance, and make sure the location is `eu-north-1`, which is in Finland, as the Kafka service we are using is based in Finland. By choosing to run the program on a VM near the Kafka service server, we could ensure minimal lag for recieving newly created tokens.

- Do a SSH login to the VM by following the instructions provided by the the service provider.

- Install the basic programs such as `git`, `node`, `npm`.

```sh
sudo apt-get update
sudo apt-get install -y git curl

# Install Node.js LTS (20.x, or your preferred)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

- Check the installations using this command

```sh
node -v
npm -v
git --version
```

- Clone the repository and follow the instructions provided in [setup](#setup).

- Create a `.env` file from terminal using `nano` command. Once the respective variables are entered, save the file by hitting `CTRL+O`, then hit Enter and exit using `CTRL+X`.

- Install pm2 and run the script 24*7 using the following commands.

```sh
sudo npm install -g pm2
pm2 start index.js --name "evm-sniper"
```

- Check the status of the proccess or get logs

```sh
pm2 status
```
```sh
pm2 logs evm-sniper
```

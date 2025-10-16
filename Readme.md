# 🚀 Bitquery Sniper Trading Bot

The **Sniper Trading Bot** is an automated crypto trading tool built for detecting and trading **newly created [Four Meme tokens](https://docs.bitquery.io/docs/blockchain/BSC/four-meme-api?utm_source=github_readme&utm_medium=referral&utm_campaign=evm_sniper&utm_content=four_meme_api&utm_term=four_meme)** in real time.  
It follows a simple, high-frequency strategy — **buy instantly when the token launches** and **sell automatically after one minute**.

---

>[!NOTE]
>This is an educational purpose project only. Bitquery in no manner advice or promote any trading strategy or trading decision.

## 🔍 How It Works: Detecting New Four Meme Tokens

The bot leverages **[Bitquery’s Protobuf Kafka Streams](https://docs.bitquery.io/docs/category/kafka-streams/?utm_source=github_readme&utm_medium=referral&utm_campaign=evm_sniper&utm_content=protobuf_kafka_docs&utm_term=protobuf_kafka)** to receive token creation events in real-time from the **BSC blockchain**.

You can check out the **[Kafka Protobuf JS example](https://docs.bitquery.io/docs/streams/protobuf/kafka-protobuf-js/?utm_source=github_readme&utm_medium=referral&utm_campaign=evm_sniper&utm_content=kafka_protobuf_js_example&utm_term=kafka_js_example)** for a step-by-step JavaScript implementation.

**Key features:**
- Monitors **new token launches** instantly via **Kafka Streams**
- Reduces latency using **Finland-based (eu-north-1)** deployment
- Fully integrates with **Bitquery APIs** for event data streaming

---

## 💰 Buying and Selling Tokens Automatically

The bot interacts with the **Four Meme DEX Smart Contract** through `ethers.js`.  
We define custom wrapper functions:
- `buyViaLaunchpad` → Buys tokens as soon as they’re created  
- `sellTokenViaLaunchpad` → Sells after a predefined delay (default: 1 minute)

Learn more about **[ethers.js contract interaction](https://docs.ethers.org/v5/?utm_source=github_readme&utm_medium=referral&utm_campaign=evm_sniper&utm_content=ethers_docs&utm_term=ethers)** and smart contract ABI usage.

---

## ⚙️ Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Kshitij0O7/evm-sniper?utm_source=github_readme&utm_medium=referral&utm_campaign=evm_sniper&utm_content=repo_link&utm_term=evm-sniper
   cd evm-sniper
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Create your `.env` file** with the following variables:

   ```env
   KAFKA_USERNAME=
   KAFKA_PASSWORD=
   PRIVATE_KEY1=
   ```

Contact [Bitquery Support](https://t.me/Bloxy_info/?utm_source=github_readme&utm_medium=referral&utm_campaign=bitcoin_streaming) or fill out this [form](https://bitquery.io/forms/api/?utm_source=github_readme&utm_medium=referral&utm_campaign=bitcoin_streaming) to get Kafka Credentials.

4. **Run the bot:**

   ```sh
   npm run start
   ```

---

## ☁️ Deployment Guide (Google Cloud)

You can deploy the bot to a cloud provider (recommended: **[Google Cloud](https://console.cloud.google.com/?utm_source=github_readme&utm_medium=referral&utm_campaign=evm_sniper&utm_content=gcp_console&utm_term=google_cloud)**) for 24/7 uptime.

### Steps:

1. Create a **VM (Virtual Machine)** in region **`eu-north-1`** (Finland) for **minimal latency** to the Bitquery Kafka service.

2. SSH into the VM and install dependencies:

   ```sh
   sudo apt-get update
   sudo apt-get install -y git curl
   curl -fsSL https://deb.nodesource.com/setup_20.x?utm_source=github_readme&utm_medium=referral&utm_campaign=evm_sniper&utm_content=node_setup&utm_term=node20 | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. Verify installations:

   ```sh
   node -v
   npm -v
   git --version
   ```

4. Follow the [setup section](#setup-instructions) above.

5. Install **[pm2 process manager](https://pm2.keymetrics.io/?utm_source=github_readme&utm_medium=referral&utm_campaign=evm_sniper&utm_content=pm2_docs&utm_term=pm2)** to run the bot continuously:

   ```sh
   sudo npm install -g pm2
   pm2 start index.js --name "evm-sniper"
   pm2 status
   pm2 logs evm-sniper
   ```

---

## 📊 Tech Stack

| Component                  | Description                           | Docs                                                                                                                                                                                                                  |
| -------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Bitquery API**           | Blockchain data API for token streams | [bitquery.io](https://bitquery.io/?utm_source=github_readme&utm_medium=referral&utm_campaign=evm_sniper&utm_content=bitquery_home&utm_term=bitquery)                                                                  |
| **Protobuf Kafka Streams** | Real-time blockchain event streaming  | [Protobuf Docs](https://docs.bitquery.io/docs/streams/protobuf/chains/Bitcoin-protobuf/?utm_source=github_readme&utm_medium=referral&utm_campaign=evm_sniper&utm_content=protobuf_kafka_docs&utm_term=protobuf_kafka) |
| **ethers.js**              | Smart contract interaction            | [ethers docs](https://docs.ethers.org/v5/?utm_source=github_readme&utm_medium=referral&utm_campaign=evm_sniper&utm_content=ethers_docs&utm_term=ethers)                                                               |
| **Node.js**                | Runtime environment (20 LTS)          | [NodeSource Setup](https://deb.nodesource.com/setup_20.x?utm_source=github_readme&utm_medium=referral&utm_campaign=evm_sniper&utm_content=node_setup&utm_term=node20)                                                 |
| **pm2**                    | Process manager for uptime            | [PM2 Docs](https://pm2.keymetrics.io/?utm_source=github_readme&utm_medium=referral&utm_campaign=evm_sniper&utm_content=pm2_docs&utm_term=pm2)                                                                         |

---

## 🧩 Related Resources

* [Bitquery Documentation Hub](https://docs.bitquery.io/?utm_source=github_readme&utm_medium=referral&utm_campaign=evm_sniper&utm_content=bitquery_docs&utm_term=bitquery_docs)
* [Bitquery IDE](http://ide.bitquery.io/?utm_source=github_readme&utm_medium=referral&utm_campaign=evm_sniper&utm_content=api_playground&utm_term=bitquery_explorer)
* [Documented Tutorial](https://docs.bitquery.io/docs/streams/sniper-trade-using-bitquery-kafka-stream?utm_source=github_readme&utm_medium=referral&utm_campaign=evm_sniper)
* [Tutorial Video](https://www.youtube.com/watch?v=vgOHgqTJmj0/?utm_source=github_readme&utm_medium=referral&utm_campaign=evm_sniper)
---

## 🏁 License

This project is released under the **MIT License**.
You’re free to use, modify, and distribute — attribution appreciated.

---

### ✨ Created by [Bitquery](https://bitquery.io/?utm_source=github_readme&utm_medium=referral&utm_campaign=evm_sniper&utm_content=bitquery_home&utm_term=bitquery)

Empowering developers with blockchain data APIs and real-time event streams. [Signup](https://account.bitquery.io/auth/signup?redirect_to=https://ide.bitquery.io/?utm_source=github_readme&utm_medium=referral&utm_campaign=evm_sniper) today.

// executeTrade.js
import { JsonRpcProvider, Wallet, parseEther, ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

const RPC_URL = 'https://bsc-dataseed.binance.org/';
const provider = new JsonRpcProvider(RPC_URL);
const wallet = new Wallet(process.env.PRIVATE_KEY, provider);

// This will hold our “nextNonce” for all outgoing txs
let nextNonce;

/**
 * Initialize nextNonce on startup; fetch the latest pending count.
 */
async function initNonce() {
  const current = await provider.getTransactionCount(wallet.address, 'pending');
  nextNonce = BigInt(current);
}

// Launchpad contract (for both buy and sell)
const LAUNCHPAD_ADDRESS = ethers.getAddress("0x5c952063c7fc8610ffdb798152d69f0b9550762b");
const BUY_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'funds', type: 'uint256' },
      { internalType: 'uint256', name: 'minAmount', type: 'uint256' }
    ],
    name: 'buyTokenAMAP',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }
];
const SELL_ABI = [
  {
    constant: false,
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'sellToken',
    outputs: [],
    payable: false,
    type: 'function'
  }
];
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address account) view returns (uint256)'
];

const buyContract = new ethers.Contract(LAUNCHPAD_ADDRESS, BUY_ABI, wallet);
const sellContract = new ethers.Contract(LAUNCHPAD_ADDRESS, SELL_ABI, wallet);

/**
 * Helper to send a transaction with explicit nonce + optional gas bump.
 * Retries if the node returns “replacement underpriced.”
 */
async function sendTxWithNonce(txRequest, maxRetries = 3) {
  if (typeof nextNonce === 'undefined') {
    // If nonce not initialized yet, wait briefly
    await new Promise((r) => setTimeout(r, 500));
  }

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Attach the current nonce
      txRequest.nonce = Number(nextNonce);
      // Slot in a default gasPrice if not explicitly set:
      if (!txRequest.gasPrice) {
        const base = (await provider.getFeeData()).gasPrice;
        txRequest.gasPrice = base;
      }

      const txResponse = await wallet.sendTransaction(txRequest);
      nextNonce++; // only bump after successful send
      return await txResponse.wait();
    } catch (err) {
      const msg = (err.reason || err.message || '').toLowerCase();
      if (msg.includes('replacement underpriced') && attempt < maxRetries) {
        // bump gasPrice by ~10% and retry
        const bumped = BigInt(txRequest.gasPrice) * 110n / 100n;
        txRequest.gasPrice = bumped;
        console.warn(`⚠️ Replacement underpriced—bumping gas to ${bumped.toString()} and retrying (${attempt + 1}/${maxRetries})`);
        continue;
      }
      throw err;
    }
  }
  throw new Error('Exceeded maxRetries for transaction');
}

/**
 * Buys a token via the launchpad contract’s buyTokenAMAP.
 * @param {string} tokenAddress
 * @param {string} amountBNB   (‘0.001’ etc.)
 * @param {bigint} minAmount   (usually 0n or computed via price oracle + slippage)
 */
export async function buyViaLaunchpad(tokenAddress, amountBNB = '0.001', minAmount = 0n) {
  await initNonce();
  try {
    const funds = parseEther(amountBNB);
    console.log(`🛒 Buying token ${tokenAddress} with ${amountBNB} BNB…`);
    const data = buyContract.interface.encodeFunctionData('buyTokenAMAP', [
      tokenAddress,
      wallet.address,
      funds,
      minAmount
    ]);

    const txRequest = {
      to: LAUNCHPAD_ADDRESS,
      data,
      value: funds,
      gasLimit: 300_000
      // gasPrice and nonce will be set in sendTxWithNonce
    };

    const receipt = await sendTxWithNonce(txRequest);
    console.log('✅ Purchase TX mined in block', receipt.blockNumber);
    return receipt;
  } catch (err) {
    console.error('❌ Purchase failed:', err.reason || err.message || err);
    return null;
  }
}

/**
 * Sells the entire balance of the newly bought token via sellToken().
 * @param {string} tokenAddress
 */
export async function sellTokenViaLaunchpad(tokenAddress) {
  await initNonce();
  try {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);

    // 1) fetch decimals + balance
    const [decimals, rawBalance] = await Promise.all([
      tokenContract.decimals(),
      tokenContract.balanceOf(wallet.address)
    ]);
    if (rawBalance === 0n) {
      console.log(`⚠️ Balance is zero for ${tokenAddress}, skipping sell.`);
      return null;
    }

    console.log(`🔓 Approving ${rawBalance.toString()} tokens for sale…`);
    const approveData = tokenContract.interface.encodeFunctionData('approve', [
      LAUNCHPAD_ADDRESS,
      rawBalance
    ]);
    await sendTxWithNonce({
      to: tokenAddress,
      data: approveData,
      gasLimit: 100_000
    });

    console.log(`💰 Selling ${rawBalance.toString()} of ${tokenAddress}…`);
    const sellData = sellContract.interface.encodeFunctionData('sellToken', [
      tokenAddress,
      rawBalance
    ]);
    const txRequest = {
      to: LAUNCHPAD_ADDRESS,
      data: sellData,
      gasLimit: 300_000
    };

    const receipt = await sendTxWithNonce(txRequest);
    console.log('✅ Sell TX mined in block', receipt.blockNumber);
    return receipt;
  } catch (err) {
    console.error('❌ Sale failed:', err.reason || err.message || err);
    return null;
  }
}
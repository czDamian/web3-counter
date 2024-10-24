"use client";

import { client } from "@/client";
import { useState } from "react";
import {
  getContract,
  prepareContractCall,
  prepareTransaction,
  toWei,
} from "thirdweb";
import { avalancheFuji } from "thirdweb/chains";
import {
  ConnectButton,
  useActiveAccount,
  useWalletBalance,
  useReadContract,
  TransactionButton,
} from "thirdweb/react";

const contract = getContract({
  client,
  address: "0xFf73cf38F6637a0D2129ED88c07209644A354bf4",
  chain: avalancheFuji,
});

const TotalCount = () => {
  //loading state removed
  const { data } = useReadContract({
    contract,
    method: "function totalCount() public view returns (uint256)",
    params: [], // type safe params
  });
  console.log("data", data);
  return (
    <div className="text-center">
      <p>Total Count </p>
      <p className="text-6xl my-4 text-blue-500"> {data ? Number(data) : "0"}</p>
    </div>
  );
};

const Increment = () => {
  return (
    <TransactionButton
      onClick={() => console.log("sending transaction")}
      transaction={() => {
        // Create a transaction object and return it
        const tx = prepareContractCall({
          contract,
          method: "function increment()",
          params: ["0x..."], // type-safe params
        });
        return tx;
      }}
      onTransactionSent={(result) => {
        console.log("Transaction submitted", result.transactionHash);
      }}
      onTransactionConfirmed={(receipt) => {
        console.log("Transaction confirmed", receipt.transactionHash);
      }}
      onError={(error) => {
        console.error("Transaction error", error);
      }}>
      Increment
    </TransactionButton>
  );
};
const Decrement = () => {
  return (
    <TransactionButton
      onClick={() => console.log("sending transaction")}
      transaction={() => {
        // Create a transaction object and return it
        const tx = prepareContractCall({
          contract,
          method: "function decrement()",
          params: ["0x..."], // type-safe params
        });
        return tx;
      }}
      onTransactionSent={(result) => {
        console.log("Transaction submitted", result.transactionHash);
      }}
      onTransactionConfirmed={(receipt) => {
        console.log("Transaction confirmed", receipt.transactionHash);
      }}
      onError={(error) => {
        console.error("Transaction error", error);
      }}>
      Decrement
    </TransactionButton>
  );
};

const SendMoney = () => {
  const [toAddress, setToAddress] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState("");

  return (
    <div className="p-8 rounded-lg shadow-lg bg-neutral-900">
      <h1 className="font-bold text-lg">Tranfer AVAX token to a friend</h1>
      <div className="text-xs mb-4">
        {error && <div className="text-red-500">{error}</div>}
        {success && (
          <div className="text-blue-500">
            {success}
            {txHash && (
              <a
                href={`https://testnet.snowtrace.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline">
                View details
              </a>
            )}
          </div>
        )}
        {status && <div className="text-white">{status}</div>}
      </div>
      <div className="mb-4">
        <label className="block mb-2">To Address:</label>
        <input
          type="text"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          placeholder="Recipient address"
          className="w-full p-2 border rounded text-black"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Amount (AVAX):</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Amount to send"
          className="w-full p-2 border rounded text-black"
        />
      </div>
      <div className="text-center pt-4">
        <TransactionButton
          onClick={() => {
            setError(""); // Clear previous errors
            setSuccess(""); // Clear previous success messages
            setStatus("sending transaction...");
            console.log("sending transaction");
          }}
          transaction={() => {
            // Create a transaction object and return it
            const tx = prepareTransaction({
              to: toAddress,
              value: toWei(value),
              chain: avalancheFuji,
              client,
            });
            return tx;
          }}
          onTransactionSent={(result) => {
            setStatus("Transaction submitted. Awaiting confirmation...");
            console.log("Transaction submitted", result.transactionHash);
            setTxHash(result.transactionHash);
          }}
          onTransactionConfirmed={(receipt) => {
            setStatus("");
            setSuccess("Transaction successful! ");
            console.log("Transaction confirmed", receipt.transactionHash);
          }}
          onError={(error) => {
            setStatus("");
            setError(`Transaction failed!, ${error.message}`);
            console.error("Transaction error:", error);
          }}>
          Transfer
        </TransactionButton>
      </div>
    </div>
  );
};

export default function Home() {
  const account = useActiveAccount();

  const { data: balance } = useWalletBalance({
    client,
    chain: avalancheFuji,
    address: account?.address,
  });

  return (
    <div className="flex flex-col gap-8 items-center justify-center my-8 md:my-12 p-8 md:p-16 font-[family-name:var(--font-geist-sans)]">
      <ConnectButton client={client} />
      <div className="text-xs text-gray-400 my-4">
        <p>Address: {account?.address}</p>
        <p>
          Balance: {balance?.displayValue} {balance?.symbol}
        </p>
      </div>
      <div className="p-8 rounded-lg shadow-lg bg-neutral-900">
        <TotalCount />
        <div className="flex flex-row gap-2 items-center justify-center">
          <Increment />
          <Decrement />
        </div>
      </div>
      <SendMoney />
    </div>
  );
}

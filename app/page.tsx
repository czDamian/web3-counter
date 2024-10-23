"use client";

import { client } from "@/client";
import { getContract, prepareContractCall } from "thirdweb";
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
    <div>
      <p>Total Count </p>
      <p className="text-6xl text-green-500"> {data ? Number(data) : "00"}</p>
    </div>
  );
};

const Increment = () => {
  return (
    <TransactionButton
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

export default function Home() {
  const account = useActiveAccount();
  console.log("account", account);

  const { data: balance } = useWalletBalance({
    client,
    chain: avalancheFuji,
    address: account?.address,
  });

  console.log("balance", balance);

  return (
    <div className="flex flex-col gap-8 items-center justify-center my-8 md:my-12 p-8 md:p-16 font-[family-name:var(--font-geist-sans)]">
      <ConnectButton client={client} />
      <div className="text-xs text-gray-400 my-4">
        <p>Address: {account?.address}</p>
        <p>
          Balance: {balance?.displayValue} {balance?.symbol}
        </p>
      </div>
      <TotalCount />
      <div className="flex flex-row gap-2 items-center justify-center">
        <Increment />
        <Decrement />
      </div>
    </div>
  );
}

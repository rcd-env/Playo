const hre = require("hardhat");

async function main() {
  // Get the contract address and amount from command line
  const contractAddress =
    process.argv[2] || "0x1F2F46E8883Fe8bB2ef09CED2387bA66899934d6";
  const withdrawAmount = process.argv[3]; // Amount to withdraw (required)
  const withdrawAll = process.argv[3] === "all"; // Special flag to withdraw all

  console.log("Owner withdrawal from PlayoGames contract...");
  console.log("Contract address:", contractAddress);

  const [owner] = await hre.ethers.getSigners();
  console.log("Owner account:", owner.address);

  // Get contract instance
  const PlayoGames = await hre.ethers.getContractAt(
    "PlayoGames",
    contractAddress
  );

  // Verify ownership
  const contractOwner = await PlayoGames.owner();
  if (contractOwner.toLowerCase() !== owner.address.toLowerCase()) {
    console.error("❌ Error: You are not the contract owner!");
    console.error("Contract owner:", contractOwner);
    console.error("Your address:", owner.address);
    process.exit(1);
  }

  // Get balances before
  const ownerBalanceBefore = await hre.ethers.provider.getBalance(
    owner.address
  );
  const contractBalance = await PlayoGames.getContractBalance();

  console.log(
    "\nOwner balance before:",
    hre.ethers.formatEther(ownerBalanceBefore),
    "MNT"
  );
  console.log(
    "Contract balance:",
    hre.ethers.formatEther(contractBalance),
    "MNT"
  );

  if (contractBalance === 0n) {
    console.log("\n⚠️  Contract has no balance to withdraw");
    process.exit(0);
  }

  let tx;
  if (withdrawAll) {
    console.log("\n💸 Withdrawing all funds from contract...");
    tx = await PlayoGames.ownerWithdrawAll();
  } else {
    if (!withdrawAmount) {
      console.error('\n❌ Error: Please specify amount to withdraw or "all"');
      console.error(
        "Usage: npx hardhat run scripts/ownerWithdraw.js --network mantleSepolia [contractAddress] [amount|all]"
      );
      process.exit(1);
    }
    console.log("\n💸 Withdrawing", withdrawAmount, "MNT from contract...");
    tx = await PlayoGames.ownerWithdraw(hre.ethers.parseEther(withdrawAmount));
  }

  console.log("Transaction hash:", tx.hash);
  console.log("Waiting for confirmation...");

  await tx.wait();

  // Get updated balances
  const ownerBalanceAfter = await hre.ethers.provider.getBalance(owner.address);
  const contractBalanceAfter = await PlayoGames.getContractBalance();

  console.log("\n✅ Withdrawal successful!");
  console.log(
    "Owner balance after:",
    hre.ethers.formatEther(ownerBalanceAfter),
    "MNT"
  );
  console.log(
    "Contract balance after:",
    hre.ethers.formatEther(contractBalanceAfter),
    "MNT"
  );
  console.log(
    `\nView transaction: https://sepolia.mantlescan.xyz/tx/${tx.hash}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

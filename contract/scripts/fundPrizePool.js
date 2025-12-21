const hre = require("hardhat");

async function main() {
  // Get the contract address from command line or use default
  const contractAddress =
    process.argv[2] || "0xcf8D7A35fCCFFb35ADA108AFa44B397ED3A8204C";
  const fundAmount = process.argv[3] || "0.1"; // Default 0.1 MNT

  console.log("Funding PlayoGames contract prize pool...");
  console.log("Contract address:", contractAddress);
  console.log("Amount to fund:", fundAmount, "MNT");

  const [owner] = await hre.ethers.getSigners();
  console.log("Funding from account:", owner.address);

  // Get balance before
  const balanceBefore = await hre.ethers.provider.getBalance(owner.address);
  console.log(
    "Owner balance before:",
    hre.ethers.formatEther(balanceBefore),
    "MNT"
  );

  // Get contract instance
  const PlayoGames = await hre.ethers.getContractAt(
    "PlayoGames",
    contractAddress
  );

  // Fund the prize pool
  console.log("\n💰 Funding prize pool...");
  const tx = await PlayoGames.fundPrizePool({
    value: hre.ethers.parseEther(fundAmount),
  });

  console.log("Transaction hash:", tx.hash);
  console.log("Waiting for confirmation...");

  await tx.wait();

  // Get updated balances
  const balanceAfter = await hre.ethers.provider.getBalance(owner.address);
  const contractBalance = await PlayoGames.getContractBalance();

  console.log("\n✅ Prize pool funded successfully!");
  console.log(
    "Owner balance after:",
    hre.ethers.formatEther(balanceAfter),
    "MNT"
  );
  console.log(
    "Contract balance:",
    hre.ethers.formatEther(contractBalance),
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

const hre = require("hardhat");

async function main() {
  // Get the contract address from command line or use default
  const contractAddress =
    process.argv[2] || "0x1F2F46E8883Fe8bB2ef09CED2387bA66899934d6";

  console.log("Checking PlayoGames contract status...");
  console.log("Contract address:", contractAddress);
  console.log(
    `Explorer: https://sepolia.mantlescan.xyz/address/${contractAddress}\n`
  );

  const [signer] = await hre.ethers.getSigners();
  console.log("Querying from account:", signer.address);

  // Get contract instance
  const PlayoGames = await hre.ethers.getContractAt(
    "PlayoGames",
    contractAddress
  );

  // Get contract owner
  const owner = await PlayoGames.owner();
  console.log("\n📋 Contract Information:");
  console.log("Owner:", owner);
  console.log(
    "You are owner:",
    owner.toLowerCase() === signer.address.toLowerCase()
  );

  // Get contract balance
  const contractBalance = await PlayoGames.getContractBalance();
  console.log("\n💰 Balances:");
  console.log(
    "Contract total balance:",
    hre.ethers.formatEther(contractBalance),
    "MNT"
  );

  // Get player's deposit
  const playerDeposit = await PlayoGames.getBalance(signer.address);
  console.log("Your deposits:", hre.ethers.formatEther(playerDeposit), "MNT");

  // Get signer's wallet balance
  const walletBalance = await hre.ethers.provider.getBalance(signer.address);
  console.log(
    "Your wallet balance:",
    hre.ethers.formatEther(walletBalance),
    "MNT"
  );

  console.log("\n✅ Status check complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

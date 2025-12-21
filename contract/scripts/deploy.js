const hre = require("hardhat");

async function main() {
  console.log("Deploying PlayoGames contract to Mantle Sepolia...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const PlayoGames = await hre.ethers.getContractFactory("PlayoGames");
  const playoGames = await PlayoGames.deploy();

  await playoGames.waitForDeployment();

  const address = await playoGames.getAddress();

  console.log("\n✅ PlayoGames deployed to:", address);
  console.log("\nUpdate this address in client/src/lib/contract.ts");
  console.log(`export const PLAYO_GAMES_ADDRESS = "${address}";`);
  console.log(
    `\nView on Mantle Sepolia Explorer: https://sepolia.mantlescan.xyz/address/${address}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

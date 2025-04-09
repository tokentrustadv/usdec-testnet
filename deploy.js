const { ethers } = require("hardhat");

async function main() {
  const USDC_ADDRESS = "0x0000000000000000000000000000000000000001"; // Replace with actual testnet USDC address
  const MORPHO_VAULT_ADDRESS = "0x0000000000000000000000000000000000000002"; // Replace with mock/test vault

  const USDEC = await ethers.getContractFactory("USDEC");
  const usdec = await USDEC.deploy(USDC_ADDRESS, MORPHO_VAULT_ADDRESS);

  await usdec.deployed();
  console.log("USDEC deployed to:", usdec.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
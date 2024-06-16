import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const BotMorphoModule = buildModule("BotMorphoModule", (m) => {
  const botMorpho = m.contract("BotMorpho");
  _getTokenFromWhale();
  return { botMorpho };
});

async function _getTokenFromWhale() {
  const bot = "0x716473Fb4E7cD49c7d1eC7ec6d7490A03d9dA332";

  const whale = await ethers.getImpersonatedSigner(
    "0x56Eddb7aa87536c09CCc2793473599fD21A8b17F"
  );
  const usdt: any = await ethers.getContractAt(
    [
      "function balanceOf(address) external view returns (uint256)",
      "function transfer(address, uint256) external returns (bool)",
    ],
    "0xdAC17F958D2ee523a2206206994597C13D831ec7"
  );

  await usdt.connect(whale).transfer(bot, "100000000000000"); 
}

export default BotMorphoModule;

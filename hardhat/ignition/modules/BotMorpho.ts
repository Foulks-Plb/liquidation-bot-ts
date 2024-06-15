import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BotMorphoModule = buildModule("BotMorphoModule", (m) => {
  const botMorpho = m.contract("BotMorpho");

  return { botMorpho };
});

export default BotMorphoModule;

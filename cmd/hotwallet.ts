import { program } from "./cmd"
import { deployConfigs, parseConfig } from "./config"
import { PublicKey } from "@solana/web3.js"
import { AIRDROP_HOT_WALLET_SEED } from "../sdk/config"

async function run(options: any) {
  let config = parseConfig(options)
  const address = PublicKey.findProgramAddressSync(
    [Buffer.from(AIRDROP_HOT_WALLET_SEED)],
    new PublicKey(config.address)
  )[0]
  console.log("Airdrop hot wallet: ", address.toBase58())
}

export function addHotWalletCmd() {
  program
    .command("hotwallet")
    .option("-e, --env <env>", "Deploy environment", "local")
    .action(run)
}

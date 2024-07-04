import { ProgramInitializer } from "../sdk/api/init_program"
import { getKeyPairFromPath, printError } from "../sdk/helper"
import { Connection, PublicKey } from "@solana/web3.js"
import { AnchorProvider, Idl, Program, Wallet } from "@coral-xyz/anchor"
import { IDL } from "./ai_token_program"
import { DeployConfig, InitAccountType, parseConfig } from "./config"
import { copyTypes } from "./tools"
import { program } from "./cmd"
import { GrantsAccountType } from "../sdk/config"

async function run(options: any) {
  // Parse config from cmd options
  const config = parseConfig(options)
  await initProgram(config, options.grants)
}

// Init program
async function initProgram(config: DeployConfig, isGrantsOnly = false) {
  console.log("Sync types file")
  const syncTypesFileRes = await copyTypes()
  if (!syncTypesFileRes) {
    console.error("Sync types file failed")
    process.exit(1)
  }

  const payer = getKeyPairFromPath(config.payerKeyPairPath)
  if (payer === null) {
    console.error("Payer's keypair not found")
    process.exit(1)
  }

  const connection = new Connection(config.cluster, "confirmed")
  process.env.ANCHOR_WALLET = config.payerKeyPairPath
  const provider = new AnchorProvider(connection, Wallet.local(), {})
  const program = new Program(IDL as Idl, config.address, provider)

  const initAccounts = config.initAccounts
  const getAddress = (type: InitAccountType): PublicKey => {
    const addr = initAccounts.get(type)
    if (!addr) {
      console.log(`Cannot find ${type} account address`)
      process.exit(1)
    }

    try {
      return new PublicKey(addr)
    } catch (e) {
      console.error(`Invalid ${type} account address: ${addr}`)
      process.exit(1)
    }
  }

  const grants: Map<GrantsAccountType, PublicKey> = new Map([
    ["Foundation", getAddress("Foundation")],
    ["DEX", getAddress("DEX")],
    ["IDO", getAddress("IDO")],
    ["Consulting", getAddress("Consulting")],
    ["Airdrop", getAddress("Airdrop")],
    ["Others", getAddress("Others")],
  ])
  const programOwner = getKeyPairFromPath(config.programKeyPairPath)
  const initializer = new ProgramInitializer(
    program,
    connection,
    payer,
    programOwner,
    grants,
    getAddress("Admin"),
    getAddress("AirdropOP")
  )

  try {
    if (isGrantsOnly) {
      // Execute grants token only
      await initializer.grantsToken()
    } else {
      await initializer.initProgram()
    }
  } catch (e) {
    printError(e)
    process.exit(1)
  }
}

export function addInitCmd() {
  program
    .command("init")
    .option("-c, --cluster <url>", "URL of the cluster to connect to")
    .option(
      "-p, --payer <key-path>",
      "Keypair file path of the payer for the deployment"
    )
    .option("-k, --keypair <key-path>", "Program keypair file path")
    .option("-e, --env <env>", "Deploy environment", "local")
    .option("-g --grants", "Execute grants token only")
    .action(run)
}

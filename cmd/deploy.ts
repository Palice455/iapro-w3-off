import { DeployConfig, Env, parseConfig, PROGRAM_FILE_PATH } from "./config"
import { copyKeyPairToDeploy, executeCmd, recoverKeyPair } from "./tools"
import { program } from "./cmd"

async function run(options: any) {
  // Parse config from cmd options
  const config = parseConfig(options)

  // Sync program keypair and build project
  const env: Env = options.env
  await prepare(env, config)

  // Deploy program
  await deploy(config)
}

// Sync program keypair and build project
async function prepare(env: Env, config: DeployConfig) {
  // Copy program keypair to the target directory
  const cpRes = await copyKeyPairToDeploy(config.programKeyPairPath)
  if (!cpRes) {
    console.error("Copy keypair failed")
    process.exit(1)
  }

  // Sync program keypair to the project
  const syncCmd = "anchor keys sync"
  console.log("Executing: ", syncCmd)
  const syncRes = await executeCmd(syncCmd)
  if (!syncRes) {
    console.error("Sync keypair failed")
    process.exit(1)
  }

  // Build project
  const buildCmd = `anchor build`
  console.log("Executing: ", buildCmd)
  const buildRes = await executeCmd(buildCmd)

  // Recover program keypair
  console.log("Recovery program keypair")
  const recoverKeypairRes = await recoverKeyPair()
  if (recoverKeypairRes) {
    await executeCmd(syncCmd)
  }

  if (!buildRes) {
    console.error("Build failed")
    process.exit(1)
  }
}

async function deploy(config: DeployConfig) {
  const deployCmd = `solana program deploy -u ${config.cluster} -k ${config.programKeyPairPath} --fee-payer ${config.payerKeyPairPath} ${PROGRAM_FILE_PATH} --program-id ${config.address}`
  console.log("Executing: ", deployCmd)
  const deployRes = await executeCmd(deployCmd)
  if (!deployRes) {
    process.exit(1)
  }
}

export function addDeployCmd() {
  program
    .command("deploy")
    .option("-c, --cluster <url>", "URL of the cluster to connect to")
    .option(
      "-p, --payer <key-path>",
      "Keypair file path of the payer for the deployment"
    )
    .option("-k, --keypair <key-path>", "Program keypair file path")
    .option("-e, --env <env>", "Deploy environment", "local")
    .action(run)
}

import { GrantsAccountType } from "../sdk/config"
import * as os from "node:os"

const LOCAL_WALLET = `${os.homedir()}/.config/solana/id.json`

export const PROGRAM_NAME = "ai_token_program"
export const PROGRAM_KEYPAIR_NAME = `${PROGRAM_NAME}-keypair.json`
export const DEPLOY_DIR = "target/deploy"
export const PROGRAM_FILE_PATH = `${DEPLOY_DIR}/${PROGRAM_NAME}.so`

export enum Env {
  dev = "dev",
  local = "local",
  main = "main",
  test = "test",
}

export type InitAccountType = GrantsAccountType | "Admin" | "AirdropOP"

export interface DeployConfig {
  // Program ID
  address: string
  // Solana cluster url
  cluster: string
  // Keypair file path of the payer for the deployment
  payerKeyPairPath: string
  // Program keypair file path
  programKeyPairPath: string
  // Accounts for the initialize program
  initAccounts: Map<InitAccountType, string>
}

const devInitAccounts = new Map<InitAccountType, string>([
  ["Foundation", "6E7JyCaEtS5L7kiD5No2xTNUcjB8YM4xBbgkEBTjF8Jo"],
  ["DEX", "GKo63sNoXbKAgPHkyF43Cb7BPBULF8KQD9c5UZbxqxQ6"],
  ["IDO", "HuG3i5Vw5BN9kgrbEGfbQXjNQnhVJNe3KhdcXsPM3T6g"],
  ["Consulting", "73VsK85iosEAbXWbLfoUVHsfN8pRFLkBGuVXEyn3oLdq"],
  ["Airdrop", "3GzdDjq3QtdhXKUZSQ83Lkf4gzKZzB28cbhGZXvLbnui"],
  ["Others", "Gv1jrt7xqaL9C9dexiRs6L7JcdBSQJskhSTjTKaTExWA"],
  ["Admin", "2ehBDqwsA2UscqjoxjqWEbgYsAwggMHDVq9J2NFJkFN7"],
  ["AirdropOP", "6o3qp4aUFUaQeHJdeyoRRZfdQvizS5xTNBLWEFdAspwW"],
])

export const deployConfigs: Map<Env, DeployConfig> = new Map([
  // Devnet deployment config
  [
    Env.dev,
    {
      address: "6KzzunmWADRf35uRhz1W3bh4u5nnytMXdBvgW8M3MiDV",
      cluster:
        "https://devnet.helius-rpc.com/?api-key=164006df-ad0e-46c1-a7df-92d0da5af102",
      payerKeyPairPath: LOCAL_WALLET,
      programKeyPairPath: `assets/dev/${PROGRAM_NAME}-keypair.json`,
      initAccounts: devInitAccounts,
    },
  ],
  [
    Env.local,
    {
      address: "DSTDU4SNYiTfDtJudFHW5M72LgU2pgsZ1saUAD3PwEAd",
      cluster: "http://localhost:8899",
      payerKeyPairPath: LOCAL_WALLET,
      programKeyPairPath: `assets/local/${PROGRAM_NAME}-keypair.json`,
      initAccounts: devInitAccounts,
    },
  ],
  [
    Env.main,
    {
      address: "**",
      cluster: "https://mainnet.helius-rpc.com/?api-key=164006df-ad0e-46c1-a7df-92d0da5af102",
      payerKeyPairPath: LOCAL_WALLET,
      programKeyPairPath: `assets/main/${PROGRAM_NAME}-keypair.json`,
      initAccounts: devInitAccounts,
    },
  ],
])

function overrideConfig(config: DeployConfig, options: any) {
  // Override program keypair path config
  let programKeyPairPath: string | undefined = options.keypair
  if (programKeyPairPath) {
    config.programKeyPairPath = programKeyPairPath
  }

  // Override payer keypair path config
  let payerKeyPairPath: string | undefined = options.payer
  if (payerKeyPairPath) {
    config.payerKeyPairPath = payerKeyPairPath
  }

  // Override cluster config
  let cluster: string | undefined = options.cluster
  if (cluster) {
    config.cluster = cluster
  }
}

export function parseConfig(options: any): DeployConfig {
  try {
    const env: Env = options.env
    let config = deployConfigs.get(env)
    if (!config) {
      console.error(`Can not find config for env: ${env}`)
      process.exit(1)
    }

    overrideConfig(config, options)
    return config
  } catch (e) {
    console.error(
      `Invalid env: ${options.env}, can only be one of: local | dev | main | test`
    )
    process.exit(1)
  }
}

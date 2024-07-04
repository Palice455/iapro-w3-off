import { exec } from "child_process"
import {
  DEPLOY_DIR,
  PROGRAM_FILE_PATH,
  PROGRAM_KEYPAIR_NAME,
  PROGRAM_NAME,
} from "./config"
import fs from "fs"

/**
 * Execute command
 *
 * @param cmd command to execute
 * @returns boolean if command executed successfully
 */
export async function executeCmd(cmd: string): Promise<boolean> {
  // Convert callback to async await
  return new Promise<boolean>((resolve, _) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error("build error: ", error)
        resolve(false)
        return
      }
      console.log(stdout)
      if (stderr) {
        console.error(`error: ${stderr}`)
      }
      resolve(true)
    })
  })
}

export async function copyKeyPairToDeploy(path: string): Promise<boolean> {
  // Make sure deploy directory exists
  if (!fs.existsSync(DEPLOY_DIR)) {
    fs.mkdirSync(DEPLOY_DIR, { recursive: true })
  }

  const from = path
  const to = `${DEPLOY_DIR}/${PROGRAM_KEYPAIR_NAME}`
  console.log(`Copy ${from} to ${to}`)
  if (fs.existsSync(to)) {
    // Change existing keypair file name
    const backup = `${DEPLOY_DIR}/origin.json`
    fs.renameSync(to, backup)
  }

  return new Promise((resolve, _) => {
    fs.copyFile(from, to, (err) => {
      if (err) {
        console.error(err)
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

export async function copyTypes(): Promise<boolean> {
  const from = `target/types/${PROGRAM_NAME}.ts`
  const to = `cmd/${PROGRAM_NAME}.ts`

  return new Promise((resolve, _) => {
    fs.copyFile(from, to, (err) => {
      if (err) {
        console.error(err)
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

export async function recoverKeyPair(): Promise<boolean> {
  const originPath = `${DEPLOY_DIR}/origin.json`
  if (!fs.existsSync(originPath)) {
    console.warn("Recover keypair failed, no origin keypair found")
    return false
  }

  const keypairPath = `${DEPLOY_DIR}/${PROGRAM_KEYPAIR_NAME}`
  const res = new Promise<boolean>((resolve, _) => {
    fs.rename(originPath, keypairPath, (err) => {
      if (err) {
        console.error("Recover keypair failed: ", err)
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
  if (!res) {
    return false
  }

  return executeCmd("anchor keys sync")
}

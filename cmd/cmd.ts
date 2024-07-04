import { Command } from "commander"
import { addDeployCmd } from "./deploy"
import { addInitCmd } from "./init"
import { addHotWalletCmd } from "./hotwallet"

export const program = new Command()
program.version("0.0.1").description("Deploy tool for IBIA token program")

// Add cmd command
addDeployCmd()

// Add init command
addInitCmd()

// Add show hot wallet command
addHotWalletCmd()

program.parseAsync(process.argv)

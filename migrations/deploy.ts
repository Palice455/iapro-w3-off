const anchor = require("@coral-xyz/anchor")

module.exports = async function (provider) {
  // Configure client to use the provider.
  anchor.setProvider(provider)
  console.log("Deploy called")
  // Add your cmd script here.
}

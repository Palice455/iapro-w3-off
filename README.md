# IBIA token program

## Build

To build the program, run the following command:

```shell
anchor build
```

## Test

All test cases are located in the `tests` directory. To run the test, run the following command:

```shell
anchor test
````

This will start a local validator and run the test against it.

## Deploy

To Deploy the program, run the following command:

```shell
yarn dtool deploy -e <env>
```

Where `<env>` is the environment you want to dtoolDeploy to. It can be `local`, `dev`, `test` or `main`.

When the program is first deployed, You need to call `init` command to initialize the program.

```shell
yarn dtool init -e <env>
```

If grants token failed after init, call the command below to execute grants token again:

```shell
yarn dtool grants -e <env> -g
```


If you want to check airdrop hot wallet address run the command below: 

```shell
yarn dtool hotwallet -e <env>
```

The `assets/dev` directory save the account keys needed to initialize the program config in dev and test environment. To
get the public key of the account, run the following command:

```shell
solana-keygen pubkey assets/dev/xx.json
```

## Client

The typescript client code is located in the `sdk` directory. Those code show how to interact with the program.

## Prepare

### Airdrop operator keypair

```shell
solana-keygen new -o /.IBIA/airdrop_op.json
```

### Program keypair

```shell
solana-keygen new -o /.IBIA/ai_token_program-keypair.json
```
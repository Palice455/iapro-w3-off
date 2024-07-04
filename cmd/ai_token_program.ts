export type AiTokenProgram = {
  "version": "0.1.0",
  "name": "ai_token_program",
  "instructions": [
    {
      "name": "initializeProgramConfig",
      "docs": [
        "Initialize the program configuration"
      ],
      "accounts": [
        {
          "name": "programConfig",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Account to store the program configuration"
          ]
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Pay the rent for the initialized accounts"
          ]
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "airdropOp",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programOwner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Only the program owner (which hold program private key) can init the program config"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeToken",
      "docs": [
        "Initialize IBIA token. Create token mint account and metadata account"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Pay the rent for the initialized accounts"
          ]
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "IBIA token mint account"
          ]
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programOwner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Only the program owner (which hold program private key) can create token account"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeHotWallets",
      "docs": [
        "Initialize the hot wallets"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Pay the rent for the initialized accounts"
          ]
        },
        {
          "name": "airdropHotWallet",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "This account is controlled by the program and only hold a small amount of IBIA token"
          ]
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "IBIA token mint account"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "grantsToken",
      "docs": [
        "Grants IBIA token to ICO, IDO, Social, etc.",
        "This is a one-time operation during the initial setup.",
        "",
        "#[account_type] specifies the type of account to grants IBIA token to"
      ],
      "accounts": [
        {
          "name": "programConfig",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Account to store the program configuration"
          ]
        },
        {
          "name": "userAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Associated IBIA token account for [user_account]"
          ]
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Pay the rent for the initialized accounts"
          ]
        },
        {
          "name": "programOwner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Only the program owner (which hold program private key) can grant tokens"
          ]
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "IBIA token mint account"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "accountType",
          "type": "u8"
        }
      ]
    },
    {
      "name": "airdrop",
      "docs": [
        "Airdrop IBIA token to user"
      ],
      "accounts": [
        {
          "name": "programConfig",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Account to store the program configuration"
          ]
        },
        {
          "name": "airdropHotWallet",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Used to airdrop IBIA tokens. Controlled by the program and only hold a small amount of IBIA token"
          ]
        },
        {
          "name": "userAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "user's associated token account, we don't need to access the data."
          ]
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Computing provider's IBIA token account"
          ]
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "IBIA token mint account"
          ]
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "The project admin account"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "changeAirdropOp",
      "docs": [
        "Change the airdrop operator account"
      ],
      "accounts": [
        {
          "name": "programConfig",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Account to store the program configuration"
          ]
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "airdropOp",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "programConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initializeList",
            "docs": [
              "Whether the accounts were initialized. The order is the same as the [AccountType] enum",
              "",
              "NOTE: Cannot use const value in array type declaration like: [bool; AccountType::LEN],",
              "because that will fail to generate idl for the program in anchor v0.29.0"
            ],
            "type": {
              "array": [
                "bool",
                6
              ]
            }
          },
          {
            "name": "admin",
            "docs": [
              "The admin of the program",
              "Some operations can only be performed by the admin"
            ],
            "type": "publicKey"
          },
          {
            "name": "airdropOp",
            "docs": [
              "The airdrop operator account",
              "Only the airdrop operator can perform airdrop operations"
            ],
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InitialInvalidAccountType",
      "msg": "Invalid account type to mint IBIA token"
    },
    {
      "code": 6001,
      "name": "AccountAlreadyInitialized",
      "msg": "Account already initialized"
    },
    {
      "code": 6002,
      "name": "DepositInsufficientUSDC",
      "msg": "Deposit fail, insufficient USDC"
    },
    {
      "code": 6003,
      "name": "SocialAccountNotInitialized",
      "msg": "Social account not initialized"
    },
    {
      "code": 6004,
      "name": "InvalidSocialUSDCAccount",
      "msg": "Social USDC account is not equal to the expected account"
    },
    {
      "code": 6005,
      "name": "HotWalletDepositInsufficientToken",
      "msg": "Not enough IBIA token balance available for hot wallet deposit"
    },
    {
      "code": 6006,
      "name": "InvalidHotWallet",
      "msg": "Invalid hot wallet account"
    },
    {
      "code": 6007,
      "name": "AirdropInsufficientBalance",
      "msg": "Airdrop not enough IBIA token balance available"
    }
  ]
};

export const IDL: AiTokenProgram = {
  "version": "0.1.0",
  "name": "ai_token_program",
  "instructions": [
    {
      "name": "initializeProgramConfig",
      "docs": [
        "Initialize the program configuration"
      ],
      "accounts": [
        {
          "name": "programConfig",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Account to store the program configuration"
          ]
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Pay the rent for the initialized accounts"
          ]
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "airdropOp",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programOwner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Only the program owner (which hold program private key) can init the program config"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeToken",
      "docs": [
        "Initialize IBIA token. Create token mint account and metadata account"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Pay the rent for the initialized accounts"
          ]
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "IBIA token mint account"
          ]
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programOwner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Only the program owner (which hold program private key) can create token account"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeHotWallets",
      "docs": [
        "Initialize the hot wallets"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Pay the rent for the initialized accounts"
          ]
        },
        {
          "name": "airdropHotWallet",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "This account is controlled by the program and only hold a small amount of IBIA token"
          ]
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "IBIA token mint account"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "grantsToken",
      "docs": [
        "Grants IBIA token to ICO, IDO, Social, etc.",
        "This is a one-time operation during the initial setup.",
        "",
        "#[account_type] specifies the type of account to grants IBIA token to"
      ],
      "accounts": [
        {
          "name": "programConfig",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Account to store the program configuration"
          ]
        },
        {
          "name": "userAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Associated IBIA token account for [user_account]"
          ]
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Pay the rent for the initialized accounts"
          ]
        },
        {
          "name": "programOwner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Only the program owner (which hold program private key) can grant tokens"
          ]
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "IBIA token mint account"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "accountType",
          "type": "u8"
        }
      ]
    },
    {
      "name": "airdrop",
      "docs": [
        "Airdrop IBIA token to user"
      ],
      "accounts": [
        {
          "name": "programConfig",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Account to store the program configuration"
          ]
        },
        {
          "name": "airdropHotWallet",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Used to airdrop IBIA tokens. Controlled by the program and only hold a small amount of IBIA token"
          ]
        },
        {
          "name": "userAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "user's associated token account, we don't need to access the data."
          ]
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Computing provider's IBIA token account"
          ]
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "IBIA token mint account"
          ]
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "The project admin account"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "changeAirdropOp",
      "docs": [
        "Change the airdrop operator account"
      ],
      "accounts": [
        {
          "name": "programConfig",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Account to store the program configuration"
          ]
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "airdropOp",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "programConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initializeList",
            "docs": [
              "Whether the accounts were initialized. The order is the same as the [AccountType] enum",
              "",
              "NOTE: Cannot use const value in array type declaration like: [bool; AccountType::LEN],",
              "because that will fail to generate idl for the program in anchor v0.29.0"
            ],
            "type": {
              "array": [
                "bool",
                6
              ]
            }
          },
          {
            "name": "admin",
            "docs": [
              "The admin of the program",
              "Some operations can only be performed by the admin"
            ],
            "type": "publicKey"
          },
          {
            "name": "airdropOp",
            "docs": [
              "The airdrop operator account",
              "Only the airdrop operator can perform airdrop operations"
            ],
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InitialInvalidAccountType",
      "msg": "Invalid account type to mint IBIA token"
    },
    {
      "code": 6001,
      "name": "AccountAlreadyInitialized",
      "msg": "Account already initialized"
    },
    {
      "code": 6002,
      "name": "DepositInsufficientUSDC",
      "msg": "Deposit fail, insufficient USDC"
    },
    {
      "code": 6003,
      "name": "SocialAccountNotInitialized",
      "msg": "Social account not initialized"
    },
    {
      "code": 6004,
      "name": "InvalidSocialUSDCAccount",
      "msg": "Social USDC account is not equal to the expected account"
    },
    {
      "code": 6005,
      "name": "HotWalletDepositInsufficientToken",
      "msg": "Not enough IBIA token balance available for hot wallet deposit"
    },
    {
      "code": 6006,
      "name": "InvalidHotWallet",
      "msg": "Invalid hot wallet account"
    },
    {
      "code": 6007,
      "name": "AirdropInsufficientBalance",
      "msg": "Airdrop not enough IBIA token balance available"
    }
  ]
};

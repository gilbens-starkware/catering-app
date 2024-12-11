set -e

# 1) To use this script, you need to have the starkli tool installed:
# - https://book.starkli.rs/installation
# 2) Define starkli signer. Easiest way is to use the plain text private key, however ***DO NOT DO THIS IN PRODUCTION***.
# https://book.starkli.rs/signers
# 3) Create an account and deploy it:
# https://book.starkli.rs/accounts
# Fund your newly created account either by using the faucet:
# - Starknet faucet: https://starknet-faucet.vercel.app/
# Or ask Itay Rosenberg to wire you some funds.

# The following commands assume that you have set the environment variable as suggested in the starkli signer and account creation steps.

scarb build
# Change the path to your contract class file. If not exist, run scarb build first.
CONTRACT_PATH=target/dev/event_manager_registration.contract_class.json
starkli declare $CONTRACT_PATH
CLASS_HASH=$(starkli class-hash $CONTRACT_PATH)
# The following command prevents "contract not declared" error when deploying.
sleep 10
# Deploy the contract. The address input is a dummy input to the constructor constructor.
starkli deploy $CLASS_HASH 0x1234

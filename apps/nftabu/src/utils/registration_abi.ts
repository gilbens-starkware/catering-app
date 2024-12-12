import { Abi } from '@starknet-react/core';


/// The address of the deployed contract.
export const REG_CONTRACT_ADDRESS =
  '0x006b4a3b4bbd85c37988cb0ff9891b5977fb8005c1545b96fdcf39a22b201043';
/// The ABI of the deployed contract. Can be found on starkscan.
/// For the above contract, the ABI can be found at:
/// https://sepolia.starkscan.co/contract/0x006b4a3b4bbd85c37988cb0ff9891b5977fb8005c1545b96fdcf39a22b201043
/// And the ABI is accessible under the 'Class Code/History' tab -> 'Copy ABI Code' button.
export const REG_ABI = [
    {
      "name": "RegistrationImpl",
      "type": "impl",
      "interface_name": "event_manager::registration_interface::IRegistration"
    },
    {
      "name": "event_manager::utils::apartment::ApartmentInfo",
      "type": "struct",
      "members": [
        {
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "address",
          "type": "(core::felt252, core::felt252, core::felt252)"
        },
        {
          "name": "area",
          "type": "core::felt252"
        },
        {
          "name": "floor",
          "type": "core::felt252"
        }
      ]
    },
    {
      "name": "event_manager::registration_interface::IRegistration",
      "type": "interface",
      "items": [
        {
          "name": "register_apartment",
          "type": "function",
          "inputs": [
            {
              "name": "id",
              "type": "core::integer::u128"
            },
            {
              "name": "apartment_info",
              "type": "event_manager::utils::apartment::ApartmentInfo"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "transfer",
          "type": "function",
          "inputs": [
            {
              "name": "id",
              "type": "core::integer::u128"
            },
            {
              "name": "new_owner",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "get_info",
          "type": "function",
          "inputs": [
            {
              "name": "id",
              "type": "core::integer::u128"
            }
          ],
          "outputs": [
            {
              "type": "event_manager::utils::apartment::ApartmentInfo"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "offer_sale",
          "type": "function",
          "inputs": [
            {
              "name": "apartment_id",
              "type": "core::integer::u128"
            },
            {
              "name": "buyer",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "price",
              "type": "core::integer::u128"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "buy",
          "type": "function",
          "inputs": [
            {
              "name": "apartment_id",
              "type": "core::integer::u128"
            },
            {
              "name": "price",
              "type": "core::integer::u128"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        }
      ]
    },
    {
      "name": "OwnableImpl",
      "type": "impl",
      "interface_name": "openzeppelin_access::ownable::interface::IOwnable"
    },
    {
      "name": "openzeppelin_access::ownable::interface::IOwnable",
      "type": "interface",
      "items": [
        {
          "name": "owner",
          "type": "function",
          "inputs": [],
          "outputs": [
            {
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "transfer_ownership",
          "type": "function",
          "inputs": [
            {
              "name": "new_owner",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "renounce_ownership",
          "type": "function",
          "inputs": [],
          "outputs": [],
          "state_mutability": "external"
        }
      ]
    },
    {
      "name": "constructor",
      "type": "constructor",
      "inputs": [
        {
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
      "type": "event",
      "members": [
        {
          "kind": "key",
          "name": "previous_owner",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "key",
          "name": "new_owner",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
      "type": "event",
      "members": [
        {
          "kind": "key",
          "name": "previous_owner",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "key",
          "name": "new_owner",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "kind": "enum",
      "name": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
      "type": "event",
      "variants": [
        {
          "kind": "nested",
          "name": "OwnershipTransferred",
          "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred"
        },
        {
          "kind": "nested",
          "name": "OwnershipTransferStarted",
          "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "event_manager::registration::registration::EventTransfer",
      "type": "event",
      "members": [
        {
          "kind": "key",
          "name": "property",
          "type": "core::integer::u128"
        },
        {
          "kind": "data",
          "name": "prevOwner",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "newOwner",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "timestamp",
          "type": "core::integer::u64"
        }
      ]
    },
    {
      "kind": "enum",
      "name": "event_manager::registration::registration::Event",
      "type": "event",
      "variants": [
        {
          "kind": "flat",
          "name": "OwnableEvent",
          "type": "openzeppelin_access::ownable::ownable::OwnableComponent::Event"
        },
        {
          "kind": "nested",
          "name": "EventTransfer",
          "type": "event_manager::registration::registration::EventTransfer"
        }
      ]
    }
  ] as const satisfies Abi;
  
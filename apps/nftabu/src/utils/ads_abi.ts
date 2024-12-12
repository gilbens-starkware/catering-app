import { Abi } from '@starknet-react/core';


/// The address of the deployed contract.
export const ADS_CONTRACT_ADDRESS =
  '0x007711c8115cf1757a335f5b8790310e5c0680af4219f44142654d944e6f6da4';
/// The ABI of the deployed contract. Can be found on starkscan.
/// For the above contract, the ABI can be found at:
/// https://sepolia.starkscan.co/contract/0x007711c8115cf1757a335f5b8790310e5c0680af4219f44142654d944e6f6da4
/// And the ABI is accessible under the 'Class Code/History' tab -> 'Copy ABI Code' button.
export const ADS_ABI = [
    {
      "name": "AdsImpl",
      "type": "impl",
      "interface_name": "event_manager::ads_interface::IAds"
    },
    {
      "name": "event_manager::utils::asset::AssetId",
      "type": "enum",
      "variants": [
        {
          "name": "Apartment",
          "type": "core::integer::u128"
        }
      ]
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
      "name": "event_manager::utils::asset::AssetInfo",
      "type": "enum",
      "variants": [
        {
          "name": "Apartment",
          "type": "event_manager::utils::apartment::ApartmentInfo"
        }
      ]
    },
    {
      "name": "core::bool",
      "type": "enum",
      "variants": [
        {
          "name": "False",
          "type": "()"
        },
        {
          "name": "True",
          "type": "()"
        }
      ]
    },
    {
      "name": "core::byte_array::ByteArray",
      "type": "struct",
      "members": [
        {
          "name": "data",
          "type": "core::array::Array::<core::bytes_31::bytes31>"
        },
        {
          "name": "pending_word",
          "type": "core::felt252"
        },
        {
          "name": "pending_word_len",
          "type": "core::integer::u32"
        }
      ]
    },
    {
      "name": "event_manager::utils::ad::AdInfo",
      "type": "struct",
      "members": [
        {
          "name": "asset_id",
          "type": "event_manager::utils::asset::AssetId"
        },
        {
          "name": "asset",
          "type": "event_manager::utils::asset::AssetInfo"
        },
        {
          "name": "is_sale",
          "type": "core::bool"
        },
        {
          "name": "price",
          "type": "core::felt252"
        },
        {
          "name": "publication_date",
          "type": "core::felt252"
        },
        {
          "name": "entry_date",
          "type": "core::felt252"
        },
        {
          "name": "description",
          "type": "core::byte_array::ByteArray"
        }
      ]
    },
    {
      "name": "core::option::Option::<event_manager::utils::ad::AdInfo>",
      "type": "enum",
      "variants": [
        {
          "name": "Some",
          "type": "event_manager::utils::ad::AdInfo"
        },
        {
          "name": "None",
          "type": "()"
        }
      ]
    },
    {
      "name": "event_manager::ads_interface::IAds",
      "type": "interface",
      "items": [
        {
          "name": "get_ad_info",
          "type": "function",
          "inputs": [
            {
              "name": "ad_id",
              "type": "core::felt252"
            }
          ],
          "outputs": [
            {
              "type": "core::option::Option::<event_manager::utils::ad::AdInfo>"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "publish_ad",
          "type": "function",
          "inputs": [
            {
              "name": "ad_id",
              "type": "core::felt252"
            },
            {
              "name": "ad_info",
              "type": "event_manager::utils::ad::AdInfo"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "remove_ad",
          "type": "function",
          "inputs": [
            {
              "name": "ad_id",
              "type": "core::felt252"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
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
        },
        {
          "name": "registration_contract_addr",
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
      "kind": "enum",
      "name": "event_manager::ads::ads::Event",
      "type": "event",
      "variants": [
        {
          "kind": "flat",
          "name": "OwnableEvent",
          "type": "openzeppelin_access::ownable::ownable::OwnableComponent::Event"
        }
      ]
    }
  ] as const satisfies Abi;
  
import { Abi } from '@starknet-react/core';


/// The address of the deployed contract.
export const ADS_CONTRACT_ADDRESS =
  '0x07fa997e493dc9c4c2bba77a598580adc1dca4d8d2e40311c4da369e005d11a2';
/// The ABI of the deployed contract. Can be found on starkscan.
/// For the above contract, the ABI can be found at:
/// https://sepolia.starkscan.co/contract/0x06507d712f6630e04de57e35d86e74d571d8a56064c237525a901c582a55f7ce
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
      },
      {
        "name": "picture_url",
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
    "name": "core::array::Span::<(core::integer::u128, event_manager::utils::ad::AdInfo)>",
    "type": "struct",
    "members": [
      {
        "name": "snapshot",
        "type": "@core::array::Array::<(core::integer::u128, event_manager::utils::ad::AdInfo)>"
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
            "type": "core::integer::u128"
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
            "type": "core::integer::u128"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "get_next_id",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u128"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "dummy_ads",
        "type": "function",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
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
      },
      {
        "name": "get_all_ads",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Span::<(core::integer::u128, event_manager::utils::ad::AdInfo)>"
          }
        ],
        "state_mutability": "view"
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
  
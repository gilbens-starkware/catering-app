import { Abi } from '@starknet-react/core';

/// A prefix to be added to the src path of resources (images, etc.) in order to correctly load them.
/// Production mode is when deploying the app to a server, github pages in our case.
export const SrcPrefix =
  import.meta.env.MODE === 'production' ? '/catering-app' : '';

/// The address of the deployed contract.
export const CONTRACT_ADDRESS =
  '0x049c75609bb077a9427bc26a9935472ec75e5508ed216ef7f7ad2693397deebc';
/// The ABI of the deployed contract. Can be found on starkscan.
/// For the above contract, the ABI can be found at:
/// https://sepolia.starkscan.co/contract/0x049c75609bb077a9427bc26a9935472ec75e5508ed216ef7f7ad2693397deebc
/// And the ABI is accessible under the 'Class Code/History' tab -> 'Copy ABI Code' button.
export const ABI = [
  {
    name: 'RegistrationImpl',
    type: 'impl',
    interface_name: 'event_manager::event_manager::IRegistration',
  },
  {
    name: 'event_manager::utils::time::Time',
    type: 'struct',
    members: [
      {
        name: 'seconds',
        type: 'core::integer::u64',
      },
    ],
  },
  {
    name: 'core::bool',
    type: 'enum',
    variants: [
      {
        name: 'False',
        type: '()',
      },
      {
        name: 'True',
        type: '()',
      },
    ],
  },
  {
    name: 'event_manager::event_manager::EventUserInfoInner',
    type: 'struct',
    members: [
      {
        name: 'time',
        type: 'event_manager::utils::time::Time',
      },
      {
        name: 'registered',
        type: 'core::bool',
      },
      {
        name: 'canceled',
        type: 'core::bool',
      },
    ],
  },
  {
    name: 'event_manager::event_manager::EventUserInfo',
    type: 'struct',
    members: [
      {
        name: 'id',
        type: 'core::integer::u32',
      },
      {
        name: 'info',
        type: 'event_manager::event_manager::EventUserInfoInner',
      },
    ],
  },
  {
    name: 'event_manager::event_manager::UserParticipation',
    type: 'struct',
    members: [
      {
        name: 'user',
        type: 'core::starknet::contract_address::ContractAddress',
      },
      {
        name: 'n_participations',
        type: 'core::integer::u32',
      },
    ],
  },
  {
    name: 'event_manager::event_manager::EventInfoInner',
    type: 'struct',
    members: [
      {
        name: 'time',
        type: 'event_manager::utils::time::Time',
      },
      {
        name: 'number_of_participants',
        type: 'core::integer::u32',
      },
      {
        name: 'canceled',
        type: 'core::bool',
      },
      {
        name: 'locked',
        type: 'core::bool',
      },
      {
        name: 'description',
        type: 'core::felt252',
      },
    ],
  },
  {
    name: 'event_manager::event_manager::EventInfo',
    type: 'struct',
    members: [
      {
        name: 'id',
        type: 'core::integer::u32',
      },
      {
        name: 'info',
        type: 'event_manager::event_manager::EventInfoInner',
      },
    ],
  },
  {
    name: 'core::array::Span::<core::starknet::contract_address::ContractAddress>',
    type: 'struct',
    members: [
      {
        name: 'snapshot',
        type: '@core::array::Array::<core::starknet::contract_address::ContractAddress>',
      },
    ],
  },
  {
    name: 'event_manager::event_manager::IRegistration',
    type: 'interface',
    items: [
      {
        name: 'get_user_events_by_time',
        type: 'function',
        inputs: [
          {
            name: 'user',
            type: 'core::starknet::contract_address::ContractAddress',
          },
          {
            name: 'start',
            type: 'event_manager::utils::time::Time',
          },
          {
            name: 'end',
            type: 'event_manager::utils::time::Time',
          },
        ],
        outputs: [
          {
            type: 'core::array::Array::<event_manager::event_manager::EventUserInfo>',
          },
        ],
        state_mutability: 'view',
      },
      {
        name: 'n_events',
        type: 'function',
        inputs: [],
        outputs: [
          {
            type: 'core::integer::u32',
          },
        ],
        state_mutability: 'view',
      },
      {
        name: 'get_participation_report_by_time',
        type: 'function',
        inputs: [
          {
            name: 'start',
            type: 'event_manager::utils::time::Time',
          },
          {
            name: 'end',
            type: 'event_manager::utils::time::Time',
          },
        ],
        outputs: [
          {
            type: 'core::array::Array::<event_manager::event_manager::UserParticipation>',
          },
        ],
        state_mutability: 'view',
      },
      {
        name: 'event_info',
        type: 'function',
        inputs: [
          {
            name: 'event_id',
            type: 'core::integer::u32',
          },
        ],
        outputs: [
          {
            type: 'event_manager::event_manager::EventInfoInner',
          },
        ],
        state_mutability: 'view',
      },
      {
        name: 'get_events_infos_by_time',
        type: 'function',
        inputs: [
          {
            name: 'start',
            type: 'event_manager::utils::time::Time',
          },
          {
            name: 'end',
            type: 'event_manager::utils::time::Time',
          },
        ],
        outputs: [
          {
            type: 'core::array::Array::<event_manager::event_manager::EventInfo>',
          },
        ],
        state_mutability: 'view',
      },
      {
        name: 'register',
        type: 'function',
        inputs: [
          {
            name: 'event_id',
            type: 'core::integer::u32',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        name: 'unregister',
        type: 'function',
        inputs: [
          {
            name: 'event_id',
            type: 'core::integer::u32',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        name: 'add_event',
        type: 'function',
        inputs: [
          {
            name: 'time',
            type: 'core::felt252',
          },
          {
            name: 'description',
            type: 'core::felt252',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        name: 'modify_event_time',
        type: 'function',
        inputs: [
          {
            name: 'event_id',
            type: 'core::integer::u32',
          },
          {
            name: 'time',
            type: 'core::felt252',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        name: 'lock_event',
        type: 'function',
        inputs: [
          {
            name: 'event_id',
            type: 'core::integer::u32',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        name: 'unlock_event',
        type: 'function',
        inputs: [
          {
            name: 'event_id',
            type: 'core::integer::u32',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        name: 'set_event_canceled',
        type: 'function',
        inputs: [
          {
            name: 'event_id',
            type: 'core::integer::u32',
          },
          {
            name: 'canceled',
            type: 'core::bool',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        name: 'add_allowed_user',
        type: 'function',
        inputs: [
          {
            name: 'user',
            type: 'core::starknet::contract_address::ContractAddress',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        name: 'remove_allowed_user',
        type: 'function',
        inputs: [
          {
            name: 'user',
            type: 'core::starknet::contract_address::ContractAddress',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        name: 'add_allowed_users',
        type: 'function',
        inputs: [
          {
            name: 'users',
            type: 'core::array::Span::<core::starknet::contract_address::ContractAddress>',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        name: 'is_allowed_user',
        type: 'function',
        inputs: [
          {
            name: 'user',
            type: 'core::starknet::contract_address::ContractAddress',
          },
        ],
        outputs: [
          {
            type: 'core::bool',
          },
        ],
        state_mutability: 'view',
      },
      {
        name: 'is_admin',
        type: 'function',
        inputs: [
          {
            name: 'user',
            type: 'core::starknet::contract_address::ContractAddress',
          },
        ],
        outputs: [
          {
            type: 'core::bool',
          },
        ],
        state_mutability: 'view',
      },
      {
        name: 'add_admin',
        type: 'function',
        inputs: [
          {
            name: 'user',
            type: 'core::starknet::contract_address::ContractAddress',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
    ],
  },
  {
    name: 'constructor',
    type: 'constructor',
    inputs: [
      {
        name: 'admin',
        type: 'core::starknet::contract_address::ContractAddress',
      },
    ],
  },
  {
    kind: 'struct',
    name: 'event_manager::event_manager::registration::UserRegistration',
    type: 'event',
    members: [
      {
        kind: 'key',
        name: 'user',
        type: 'core::starknet::contract_address::ContractAddress',
      },
      {
        kind: 'key',
        name: 'event_id',
        type: 'core::integer::u32',
      },
      {
        kind: 'data',
        name: 'status',
        type: 'core::bool',
      },
    ],
  },
  {
    kind: 'struct',
    name: 'event_manager::event_manager::registration::EventChanged',
    type: 'event',
    members: [
      {
        kind: 'data',
        name: 'event_id',
        type: 'core::integer::u32',
      },
      {
        kind: 'data',
        name: 'time',
        type: 'event_manager::utils::time::Time',
      },
    ],
  },
  {
    kind: 'struct',
    name: 'event_manager::event_manager::registration::EventCancellation',
    type: 'event',
    members: [
      {
        kind: 'data',
        name: 'event_id',
        type: 'core::integer::u32',
      },
      {
        kind: 'data',
        name: 'canceled',
        type: 'core::bool',
      },
    ],
  },
  {
    kind: 'struct',
    name: 'event_manager::event_manager::registration::UserAllowed',
    type: 'event',
    members: [
      {
        kind: 'data',
        name: 'user',
        type: 'core::starknet::contract_address::ContractAddress',
      },
      {
        kind: 'data',
        name: 'allowed',
        type: 'core::bool',
      },
    ],
  },
  {
    kind: 'enum',
    name: 'event_manager::event_manager::registration::Event',
    type: 'event',
    variants: [
      {
        kind: 'nested',
        name: 'UserRegistration',
        type: 'event_manager::event_manager::registration::UserRegistration',
      },
      {
        kind: 'nested',
        name: 'EventChanged',
        type: 'event_manager::event_manager::registration::EventChanged',
      },
      {
        kind: 'nested',
        name: 'EventCancellation',
        type: 'event_manager::event_manager::registration::EventCancellation',
      },
      {
        kind: 'nested',
        name: 'UserAllowed',
        type: 'event_manager::event_manager::registration::UserAllowed',
      },
    ],
  },
] as const satisfies Abi;

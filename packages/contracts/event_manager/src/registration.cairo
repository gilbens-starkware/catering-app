use crate::utils::apartment::{ApartmentInfo, ApartmentId};
use starknet::ContractAddress;


// TODO: move to another module
#[starknet::interface]
pub trait IRegistration<ContractState> {
    fn register_apartment(ref self: ContractState, id: ApartmentId, apartment_info: ApartmentInfo);

    fn transfer(ref self: ContractState, id: ApartmentId, new_owner: ContractAddress);

    fn get_info(ref self: ContractState, id: ApartmentId) -> ApartmentInfo;
}

#[derive(Drop, starknet::Event)]
struct EventTransfer {
    #[key]
    property: ApartmentId,
    prevOwner: ContractAddress,
    newOwner: ContractAddress,
    timestamp: u64,
}


#[starknet::contract]
mod registration {
    use starknet::storage::{
        Map, Vec, StorageAsPointer, StoragePathEntry, StorageMapReadAccess,
        StoragePointerWriteAccess, StoragePointerReadAccess, StorageMapWriteAccess, VecTrait,
        MutableVecTrait,
    };
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use super::{EventTransfer, IRegistration};

    use crate::utils::apartment::{ApartmentId, ApartmentInfo};


    #[storage]
    struct Storage {
        /// A map from ApartmentId to ApartmentInfo.
        apt: Map<ApartmentId, Option<ApartmentInfo>>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        EventTransfer: EventTransfer,
    }

    // Implementing the contract interface. #[abi(embed_v0)] is used to indicate that the functions
    // should be part of the contract's ABI.
    #[abi(embed_v0)]
    impl RegistrationImpl of IRegistration<ContractState> {
        // TODO(ilya): add ownership checks
        fn register_apartment(
            ref self: ContractState, id: ApartmentId, apartment_info: ApartmentInfo,
        ) {
            let entry = self.apt.entry(id);
            assert!(entry.read().is_none(), "Apartment already exists");

            entry.write(Option::Some(apartment_info));
        }


        fn transfer(ref self: ContractState, id: ApartmentId, new_owner: ContractAddress) {
            let entry = self.apt.entry(id);
            let mut apartment_info = entry.read().expect('Apartment does not exist');
            assert!(
                apartment_info.owner == get_caller_address(), "Only the owner can change the owner",
            );
            apartment_info.owner = new_owner;
            entry.write(Option::Some(apartment_info));

            self
                .emit(
                    EventTransfer {
                        property: id,
                        prevOwner: get_caller_address(),
                        newOwner: new_owner,
                        timestamp: get_block_timestamp(),
                    },
                )
        }


        fn get_info(ref self: ContractState, id: ApartmentId) -> ApartmentInfo {
            self.apt.read(id).expect('Apartment does not exist')
        }
    }
}

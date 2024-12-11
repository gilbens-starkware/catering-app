use starknet::ContractAddress;


#[derive(Serde, Drop, starknet::Store)]
struct ApartmentInfo {
    info: ByteArray,
    owner: ContractAddress,
}

#[starknet::interface]
trait IRegistration<ContractState> {
    fn register_apartment(ref self: ContractState, id: u128, apartment_info: ApartmentInfo);
}

type ApartmentId = u128;


#[starknet::contract]
mod registration {
    use starknet::storage::{
        Map, Vec, StorageAsPointer, StoragePathEntry, StorageMapReadAccess,
        StoragePointerWriteAccess, StoragePointerReadAccess, StorageMapWriteAccess, VecTrait,
        MutableVecTrait,
    };

    use super::{ApartmentId, ApartmentInfo, IRegistration};


    #[storage]
    struct Storage {
        /// A map from ApartmentId to ApartmentInfo.
        apt: Map<ApartmentId, Option<ApartmentInfo>>,
    }


    // Implementing the contract interface. #[abi(embed_v0)] is used to indicate that the functions
    // should be part of the contract's ABI.
    #[abi(embed_v0)]
    impl RegistrationImpl of IRegistration<ContractState> {
        fn register_apartment(ref self: ContractState, id: u128, apartment_info: ApartmentInfo) {
            let entry = self.apt.entry(id);
            assert!(entry.read().is_none(), "Apartment already exists");

            entry.write(Option::Some(apartment_info));
        }
    }
}

#[starknet::contract]
mod registration {
    use openzeppelin_access::ownable::OwnableComponent;
    use starknet::storage::{
        Map, Vec, StorageAsPointer, StoragePathEntry, StorageMapReadAccess,
        StoragePointerWriteAccess, StoragePointerReadAccess, StorageMapWriteAccess, VecTrait,
        MutableVecTrait,
    };
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use crate::registration_interface::IRegistration;

    use crate::utils::apartment::{ApartmentId, ApartmentInfo};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;


    #[storage]
    struct Storage {
        /// A map from ApartmentId to ApartmentInfo.
        apt: Map<ApartmentId, Option<ApartmentInfo>>,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        EventTransfer: EventTransfer,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
    }

    #[derive(Drop, starknet::Event)]
    struct EventTransfer {
        #[key]
        property: ApartmentId,
        prevOwner: ContractAddress,
        newOwner: ContractAddress,
        timestamp: u64,
    }

    // Implementing the contract interface. #[abi(embed_v0)] is used to indicate that the functions
    // should be part of the contract's ABI.
    #[abi(embed_v0)]
    impl RegistrationImpl of IRegistration<ContractState> {
        // TODO(ilya): add ownership checks
        fn register_apartment(
            ref self: ContractState, id: ApartmentId, apartment_info: ApartmentInfo,
        ) {
            self.ownable.assert_only_owner();
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

use starknet::ContractAddress;
#[derive(Serde, Drop, starknet::Store)]
struct OfferInfo {
    // TODO: need to add seller?
    buyer: ContractAddress,
    price: u128,
}

#[starknet::contract]
mod registration {
    use openzeppelin_access::ownable::OwnableComponent;
    use starknet::storage::{
        Map, Vec, StorageAsPointer, StoragePathEntry, StorageMapReadAccess,
        StoragePointerWriteAccess, StoragePointerReadAccess, StorageMapWriteAccess, VecTrait,
        MutableVecTrait,
    };
    use starknet::{
        ContractAddress, contract_address_const, get_caller_address, get_block_timestamp
    };
    use crate::registration_interface::IRegistration;
    use super::OfferInfo;
    use crate::utils::apartment::{ApartmentId, ApartmentInfo};
    use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};

    const ETH_ADDRESS: felt252 = 0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;


    #[storage]
    struct Storage {
        /// A map from ApartmentId to ApartmentInfo.
        apt: Map<ApartmentId, Option<ApartmentInfo>>,
        sale_offers: Map<ApartmentId, Option<OfferInfo>>,
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
    fn constructor(ref self: ContractState) {
        self.ownable.initializer(get_caller_address());
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


        fn get_info(self: @ContractState, id: ApartmentId) -> ApartmentInfo {
            self.apt.read(id).expect('Apartment does not exist')
        }

        fn offer_sale(
            ref self: ContractState, apartment_id: ApartmentId, buyer: ContractAddress, price: u128
        ) {
            // Assert the caller owns the apartment.
            assert!(
                self.get_info(apartment_id).owner == get_caller_address(),
                "You are not the owner of this apartment!"
            );

            let sale_entry = self.sale_offers.entry(apartment_id);

            // Assert there is no other offer for this apartment.
            assert!(sale_entry.read().is_none(), "There is an existing sale for this apartment");

            sale_entry.write(Option::Some(OfferInfo { buyer, price }));
        }

        fn buy(ref self: ContractState, apartment_id: ApartmentId, price: u128) {
            let sale_entry = self.sale_offers.entry(apartment_id);

            match sale_entry.read() {
                Option::None => { panic!("No matching sale offer"); },
                Option::Some(sale_info) => {
                    let buyer = get_caller_address();
                    let seller = self.get_info(apartment_id).owner;
                    assert!(sale_info.price == price, "ads");

                    self.transfer(apartment_id, buyer);

                    let erc20_address = contract_address_const::<ETH_ADDRESS>();
                    assert!(
                        IERC20Dispatcher { contract_address: erc20_address }
                            .transfer_from(sender: buyer, recipient: seller, amount: price.into()),
                        "Could not transfer money from buyer"
                    );

                    sale_entry.write(Option::None);
                }
            }
        }
    }
}

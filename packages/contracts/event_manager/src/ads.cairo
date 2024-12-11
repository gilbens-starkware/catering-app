#[starknet::contract]
mod ads {
    use crate::ads_interface::IAds;
    use crate::utils::ad::{AdInfo, AdId};
    use crate::utils::asset::{AssetInfo, AssetId};
    use starknet::storage::{
        Map, Vec, StorageAsPointer, StoragePathEntry, StorageMapReadAccess,
        StoragePointerWriteAccess, StoragePointerReadAccess, StorageMapWriteAccess, VecTrait,
        MutableVecTrait,
    };
    use starknet::{ContractAddress, get_caller_address};
    use crate::registration_interface::{
        IRegistrationLibraryDispatcher, IRegistrationDispatcherTrait
    };
    use crate::utils::apartment::{ApartmentInfo, ApartmentId};
    use starknet::contract_address::contract_address_const;
    use openzeppelin_access::ownable::OwnableComponent;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;


    #[storage]
    struct Storage {
        ads: Map<AdId, Option<AdInfo>>,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
    }


    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
    }

    #[abi(embed_v0)]
    impl AdsImpl of IAds<ContractState> {
        // TODO: revisit how to create the ID.
        // TODO: revisit snapshots...
        fn publish_ad(ref self: ContractState, ad_id: AdId, ad_info: AdInfo) {
            let apartment_info = if let AssetInfo::Apartment(apartment_info) = @ad_info.asset {
                apartment_info
            } else {
                panic!("Only ads of apartments are currently supported")
            };
            // TODO: move the owner out of the asset and remove this check.
            assert!(
                apartment_info.owner == @get_caller_address(),
                "Owner in the asset is not the caller"
            );

            let apartment_id = if let AssetId::Apartment(apartment_id) = ad_info.asset_id {
                apartment_id
            } else {
                panic!("Only ads of apartments are currently supported")
            };

            let real_owner = get_real_apartment_owner(apartment_id);
            assert!(@real_owner == apartment_info.owner, "This is not your asset to publish!!");

            let entry = self.ads.entry(ad_id);
            assert!(entry.read().is_none(), "An ad with this ID already exists");

            entry.write(Option::Some(ad_info));
        }

        fn remove_ad(ref self: ContractState, ad_id: AdId) -> bool {
            let entry = self.ads.entry(ad_id);
            let ad_info = match entry.read() {
                Option::None => { return bool::False; },
                Option::Some(ad_info) => { ad_info },
            };
            let apartment_info = if let AssetInfo::Apartment(apartment_info) = ad_info.asset {
                apartment_info
            } else {
                panic!("Only ads of apartments are currently supported")
            };
            assert!(
                apartment_info.owner == get_caller_address()
                    || self.ownable.owner() != get_caller_address(),
                "Only the owner of the asset can remove an ad of it",
            );
            entry.write(Option::None);
            bool::True
        }
    }

    // TODO: class hash
    const REGISTRATION_CONTRACT_CLASS_HASH: felt252 = 3;

    fn get_real_apartment_owner(apartment_id: ApartmentId) -> ContractAddress {
        let class_hash = REGISTRATION_CONTRACT_CLASS_HASH.try_into().unwrap();
        let real_apartment_info = IRegistrationLibraryDispatcher { class_hash }
            .get_info(id: apartment_id);
        real_apartment_info.owner
    }
}

use crate::utils::ad::{AdInfo, AdId};

#[starknet::interface]
trait IAds<ContractState> {
    fn publish_ad(ref self: ContractState, ad_id: AdId, ad_info: AdInfo);
    fn remove_ad(ref self: ContractState, ad_id: AdId) -> bool;
}

#[starknet::contract]
mod ads {
    use super::{IAds};
    use crate::utils::ad::{AdInfo, AdId, Asset, AssetId};
    use starknet::storage::{
        Map, Vec, StorageAsPointer, StoragePathEntry, StorageMapReadAccess,
        StoragePointerWriteAccess, StoragePointerReadAccess, StorageMapWriteAccess, VecTrait,
        MutableVecTrait,
    };
    use starknet::{ContractAddress, get_caller_address};
    use crate::registration::{IRegistrationLibraryDispatcher, IRegistrationDispatcherTrait};
    use crate::utils::apartment::{ApartmentInfo, ApartmentId};
    use starknet::contract_address::contract_address_const;

    #[storage]
    struct Storage {
        ads: Map<AdId, Option<AdInfo>>,
    }

    #[abi(embed_v0)]
    impl AdsImpl of IAds<ContractState> {
        // TODO: revisit how to create the ID.
        // TODO: revisit snapshots...
        fn publish_ad(ref self: ContractState, ad_id: AdId, ad_info: AdInfo) {
            let apartment_info = if let Asset::Apartment(apartment_info) = @ad_info.asset {
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
            let apartment_info = if let Asset::Apartment(apartment_info) = ad_info.asset {
                apartment_info
            } else {
                panic!("Only ads of apartments are currently supported")
            };
            assert!(
                apartment_info.owner == get_caller_address(),
                "Only the owner of the asset can remove an ad of it",
            );
            entry.write(Option::None);
            bool::True
        }
    }

    fn get_real_apartment_owner(apartment_id: ApartmentId) -> ContractAddress {
        // TODO: class hash
        let class_hash = 3_felt252.try_into().unwrap();
        let real_apartment_info = IRegistrationLibraryDispatcher { class_hash }
            .get_info(id: apartment_id);
        real_apartment_info.owner
    }
}

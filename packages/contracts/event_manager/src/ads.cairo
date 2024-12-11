use crate::utils::ad::{AdInfo, AdId};

#[starknet::interface]
trait IAds<ContractState> {
    fn publish_ad(ref self: ContractState, ad_id: AdId, ad_info: AdInfo);
    fn remove_ad(ref self: ContractState, ad_id: AdId) -> bool;
}

#[starknet::contract]
mod ads {
    use super::{IAds};
    use crate::utils::ad::{AdInfo, AdId, Asset};
    use starknet::storage::{
        Map, Vec, StorageAsPointer, StoragePathEntry, StorageMapReadAccess,
        StoragePointerWriteAccess, StoragePointerReadAccess, StorageMapWriteAccess, VecTrait,
        MutableVecTrait,
    };
    use starknet::{get_caller_address};

    #[storage]
    struct Storage {
        ads: Map<AdId, Option<AdInfo>>,
    }

    #[abi(embed_v0)]
    impl AdsImpl of IAds<ContractState> {
        // TODO: revisit how to create the ID.
        fn publish_ad(ref self: ContractState, ad_id: AdId, ad_info: AdInfo) {
            let apartment_info = if let Asset::Apartment(apartment_info) = @ad_info.asset {
                apartment_info
            } else {
                panic!("Only ads of apartments are currently supported")
            };
            assert!(
                apartment_info.owner == @get_caller_address(),
                "Only the owner of the asset can publish ads for it",
            );

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

    fn get_ad_id(ad: AdInfo) -> AdId {
        // TODO
        // c = core::pedersen::pedersen(a, b);
        3
    }
}

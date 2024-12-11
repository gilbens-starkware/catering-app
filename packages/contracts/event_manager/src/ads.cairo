use crate::utils::ad::{AdInfo, AdId};

#[starknet::interface]
trait IAds<ContractState> {
    fn publish_ad(ref self: ContractState, ad_info: AdInfo);
    fn remove_ad(ref self: ContractState, ad_id: AdId);
}

#[starknet::contract]
mod ads {
    use super::{IAds};
    use starknet::storage::{Vec};
    use crate::utils::ad::{AdInfo, AdId};

    #[storage]
    struct Storage {
        ads: Vec<AdInfo>,
    }

    #[abi(embed_v0)]
    impl AdsImpl of IAds<ContractState> {
        fn publish_ad(ref self: ContractState, ad_info: AdInfo) {}
        fn remove_ad(ref self: ContractState, ad_id: AdId) {}
    }

    fn get_ad_id(ad: AdInfo) -> AdId {
        // TODO
        // c = core::pedersen::pedersen(a, b);
        3
    }
}

use crate::utils::ad::{AdInfo, AdId};

#[starknet::interface]
pub trait IAds<ContractState> {
    fn publish_ad(ref self: ContractState, ad_id: AdId, ad_info: AdInfo);
    fn remove_ad(ref self: ContractState, ad_id: AdId) -> bool;
}

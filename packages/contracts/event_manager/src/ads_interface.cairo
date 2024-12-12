use crate::utils::ad::{AdInfo, AdId};

#[starknet::interface]
pub trait IAds<ContractState> {
    fn get_ad_info(self: @ContractState, ad_id: AdId) -> Option<AdInfo>;
    fn publish_ad(ref self: ContractState, ad_info: AdInfo);
    fn remove_ad(ref self: ContractState, ad_id: AdId) -> bool;
    fn get_next_id(self: @ContractState) -> u128;
}

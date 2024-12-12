use crate::utils::ad::{AdInfo, AdId};
use crate::utils::apartment::{ApartmentId};
use starknet::ContractAddress;

#[starknet::interface]
pub trait IAds<ContractState> {
    fn get_ad_info(self: @ContractState, ad_id: AdId) -> Option<AdInfo>;
    fn publish_ad(ref self: ContractState, ad_info: AdInfo);
    fn remove_ad(ref self: ContractState, ad_id: AdId) -> bool;
    fn get_next_id(self: @ContractState) -> u128;

    // Propogation from registration contract
    fn offer_sale(
        ref self: ContractState, apartment_id: ApartmentId, buyer: ContractAddress, price: u128
    );
    fn buy(ref self: ContractState, apartment_id: ApartmentId, price: u128);

    fn get_all_ads(self: @ContractState) -> Span<(AdId, AdInfo)>;
}

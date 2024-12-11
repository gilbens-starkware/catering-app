use crate::utils::apartment::{ApartmentInfo, ApartmentId};
use starknet::ContractAddress;

#[starknet::interface]
pub trait IRegistration<ContractState> {
    fn register_apartment(ref self: ContractState, id: ApartmentId, apartment_info: ApartmentInfo);

    fn transfer(ref self: ContractState, id: ApartmentId, new_owner: ContractAddress);

    fn get_info(self: @ContractState, id: ApartmentId) -> ApartmentInfo;

    fn offer_sale(
        ref self: ContractState, apartment_id: ApartmentId, buyer: ContractAddress, price: u128
    );

    // TODO: consider adding seller to verify it.
    // TODO: add allowance to allow the TABU to pass the money from the buyer to the seller.
    fn buy(ref self: ContractState, apartment_id: ApartmentId, price: u128);
}

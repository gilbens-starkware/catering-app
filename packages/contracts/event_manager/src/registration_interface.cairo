use crate::utils::apartment::{ApartmentInfo, ApartmentId};
use starknet::ContractAddress;

#[starknet::interface]
pub trait IRegistration<ContractState> {
    fn register_apartment(ref self: ContractState, id: ApartmentId, apartment_info: ApartmentInfo);

    fn transfer(ref self: ContractState, id: ApartmentId, new_owner: ContractAddress);

    fn get_info(ref self: ContractState, id: ApartmentId) -> ApartmentInfo;
}

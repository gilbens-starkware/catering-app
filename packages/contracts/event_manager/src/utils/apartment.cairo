use starknet::ContractAddress;

#[derive(Serde, Drop, starknet::Store)]
pub struct ApartmentInfo {
    pub owner: ContractAddress,
    pub address: (
        felt252,
        felt252,
        felt252,
    ),
    area: felt252,
    floor: felt252,
}

pub type ApartmentId = u128;

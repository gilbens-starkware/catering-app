use starknet::ContractAddress;

#[derive(Serde, Drop, starknet::Store)]
pub struct ApartmentInfo {
    pub info: ByteArray,
    pub owner: ContractAddress,
}

pub type ApartmentId = u128;

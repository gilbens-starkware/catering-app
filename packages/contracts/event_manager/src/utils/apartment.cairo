use starknet::ContractAddress;

#[derive(Serde, Drop, starknet::Store)]
pub struct ApartmentInfo {
    info: ByteArray,
    owner: ContractAddress,
}

pub type ApartmentId = u128;

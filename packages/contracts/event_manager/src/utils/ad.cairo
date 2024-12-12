use super::apartment::{ApartmentInfo, ApartmentId};

pub type AdId = u128;

#[derive(Serde, Drop, starknet::Store)]
pub struct AdInfo {
    pub apartment_id: ApartmentId,
    // TODO: should we only have the ID?
    pub apartment: ApartmentInfo,
    pub is_sale: bool,
    pub price: felt252,
    pub publication_date: felt252,
    pub entry_date: felt252,
    pub description: ByteArray,
    pub picture_url: ByteArray,
}

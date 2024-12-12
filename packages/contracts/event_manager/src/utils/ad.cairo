use crate::utils::asset::{AssetInfo, AssetId};
use super::apartment::ApartmentInfo;

pub type AdId = u128;

#[derive(Serde, Drop, starknet::Store)]
pub struct AdInfo {
    pub asset_id: AssetId,
    // TODO: should we only have the ID?
    pub asset: AssetInfo,
    pub is_sale: bool,
    pub price: felt252,
    pub publication_date: felt252,
    pub entry_date: felt252,
    pub description: ByteArray,
}

use crate::utils::asset::{AssetInfo, AssetId};

pub type AdId = felt252;

#[derive(Serde, Drop, starknet::Store)]
pub struct AdInfo {
    pub id: AdId,
    pub asset_id: AssetId,
    // TODO: should we only have the ID?
    pub asset: AssetInfo,
}

use crate::utils::apartment::{ApartmentInfo, ApartmentId};

pub type AdId = felt252;

#[derive(Serde, Drop, starknet::Store)]
pub struct AdInfo {
    pub id: AdId,
    pub asset_id: AssetId,
    // TODO: should we only have the ID?
    pub asset: Asset,
}

// TODO: move both to asset.cairo
#[derive(Serde, Drop, starknet::Store)]
pub enum Asset {
    Apartment: ApartmentInfo,
    // Vehicle: VehicleInfo,
}

#[derive(Serde, Drop, starknet::Store, Copy)]
pub enum AssetId {
    Apartment: ApartmentId,
    // Vehicle: VehicleId,
}

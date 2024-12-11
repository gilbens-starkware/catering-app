use crate::utils::apartment::{ApartmentId, ApartmentInfo};

#[derive(Serde, Drop, starknet::Store)]
pub enum AssetInfo {
    Apartment: ApartmentInfo,
    // Vehicle: VehicleInfo,
}

#[derive(Serde, Drop, starknet::Store, Copy)]
pub enum AssetId {
    Apartment: ApartmentId,
    // Vehicle: VehicleId,
}

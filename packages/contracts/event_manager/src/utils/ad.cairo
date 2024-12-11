use crate::utils::apartment::ApartmentInfo;

pub type AdId = felt252;

#[derive(Serde, Drop, starknet::Store)]
pub struct AdInfo {
    pub id: AdId,
    // TODO: should this be only the ID?
    pub asset: Asset,
}

#[derive(Serde, Drop, starknet::Store)]
pub enum Asset {
    Apartment: ApartmentInfo,
    // Vehicle: VehicleInfo,
}

#[starknet::contract]
mod ads {
    use crate::ads_interface::IAds;
    use crate::utils::ad::{AdInfo, AdId};
    use starknet::storage::{
        Map, Vec, StorageAsPointer, StoragePathEntry, StorageMapReadAccess,
        StoragePointerWriteAccess, StoragePointerReadAccess, StorageMapWriteAccess, VecTrait,
        MutableVecTrait,
    };
    use starknet::{ContractAddress, get_caller_address};
    use crate::registration_interface::{IRegistrationDispatcher, IRegistrationDispatcherTrait};
    use crate::utils::apartment::{ApartmentInfo, ApartmentId};
    use starknet::contract_address::contract_address_const;
    use openzeppelin_access::ownable::OwnableComponent;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;


    #[storage]
    struct Storage {
        ads: Map<AdId, Option<AdInfo>>,
        next_id: u128,
        registration_contract_addr: ContractAddress,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
    }


    #[constructor]
    fn constructor(
        ref self: ContractState, owner: ContractAddress, registration_contract_addr: ContractAddress
    ) {
        self.ownable.initializer(owner);
        self.registration_contract_addr.write(registration_contract_addr);
        // self.dummy_ads();
    }

    #[abi(embed_v0)]
    impl AdsImpl of IAds<ContractState> {
        fn get_ad_info(self: @ContractState, ad_id: AdId) -> Option<AdInfo> {
            self.ads.read(ad_id)
        }
        // TODO: revisit how to create the ID.
        // TODO: revisit snapshots...
        fn publish_ad(ref self: ContractState, ad_info: AdInfo) {
            let apartment_info = @ad_info.apartment;
            assert!(
                apartment_info.owner == @get_caller_address(),
                "Owner in the apartment is not the caller"
            );

            let apartment_id = ad_info.apartment_id;

            let real_owner = get_real_apartment_owner(
                apartment_id, self.registration_contract_addr.read()
            );
            assert!(@real_owner == apartment_info.owner, "This is not your apartment to publish!!");

            assert!(
                apartment_info == @get_apartment_info(
                    apartment_id, self.registration_contract_addr.read()
                ),
                "The apartment info is not correct"
            );

            let ad_id = self.next_id();

            self.ads.write(ad_id, Option::Some(ad_info));
        }

        fn remove_ad(ref self: ContractState, ad_id: AdId) -> bool {
            let entry = self.ads.entry(ad_id);
            let ad_info = match entry.read() {
                Option::None => { return bool::False; },
                Option::Some(ad_info) => { ad_info },
            };
            let apartment_info = ad_info.apartment;
            let caller_address = get_caller_address();
            assert!(
                apartment_info.owner == caller_address || self.ownable.owner() == caller_address,
                "Only the owner of the apartment can remove an ad of it",
            );
            entry.write(Option::None);
            bool::True
        }

        fn get_next_id(self: @ContractState) -> u128 {
            self.next_id.read()
        }

        // Propogation from registration contract
        fn offer_sale(
            ref self: ContractState, apartment_id: ApartmentId, buyer: ContractAddress, price: u128
        ) {
            IRegistrationDispatcher { contract_address: self.registration_contract_addr.read() }
                .offer_sale(apartment_id, buyer, price)
        }

        fn buy(ref self: ContractState, apartment_id: ApartmentId, price: u128) {
            IRegistrationDispatcher { contract_address: self.registration_contract_addr.read() }
                .buy(apartment_id, price)
        }

        fn get_all_ads(self: @ContractState) -> Span<(AdId, AdInfo)> {
            let next_id = self.get_next_id();
            let mut cur_id = 0;
            let mut arr: Array<(AdId, AdInfo)> = ArrayTrait::new();
            loop {
                if cur_id == next_id {
                    break;
                }
                if let Option::Some(ad) = self.ads.read(cur_id) {
                    arr.append((cur_id, ad));
                }
            };
            arr.span()
        }

        fn dummy_ads(ref self: ContractState) -> () {
            let nftabu = IRegistrationDispatcher {
                contract_address: self.registration_contract_addr.read()
            };
            let mut num = 1;
            loop {
                if num > 3 {
                    break;
                }
                let apt_info = nftabu.get_info(id: num);
                let ad_info = AdInfo {
                    apartment_id: num,
                    apartment: apt_info,
                    is_sale: true,
                    price: 100,
                    publication_date: 5,
                    entry_date: 7,
                    description: "This is a dummy ad",
                    picture_url: "https://dummyurl.com",
                };
                self.ads.write(num, Option::Some(ad_info));
                num += 1
            };
            self.next_id.write(num);
        }
    }

    fn get_apartment_info(
        apartment_id: ApartmentId, contract_address: ContractAddress
    ) -> ApartmentInfo {
        IRegistrationDispatcher { contract_address }.get_info(id: apartment_id)
    }

    fn get_real_apartment_owner(
        apartment_id: ApartmentId, contract_address: ContractAddress
    ) -> ContractAddress {
        get_apartment_info(apartment_id, contract_address).owner
    }


    #[generate_trait]
    impl PrivateImpl of PrivateTrait {
        fn next_id(ref self: ContractState) -> AdId {
            let res = self.next_id.read();
            self.next_id.write(res + 1);
            res
        }
    }
}

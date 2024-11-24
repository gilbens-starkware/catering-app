// TODO: Make upgradable.
// TODO: Add events.

use starknet::ContractAddress;
use crate::utils::time::Time;


/// Basic information about an event.
#[derive(Drop, Serde, starknet::Store)]
struct EventInfo {
    /// The time of the event, as a Unix timestamp.
    time: Time,
    /// The price of the event.
    // TODO: Can the price be modified?
    price: u32,
}

/// Information about a user's registration to an event.
#[derive(Drop, Serde)]
struct EventUserInfo {
    /// The ID of the event.
    id: usize,
    /// The time of the event, as a Unix timestamp.
    time: Time,
    /// Whether the user is registered to the event.
    registered: bool,
    /// Whether the event has been canceled.
    canceled: bool,
}

#[starknet::interface]
trait IRegistration<T> {
    /// Returns information about the events the user is registered to. max_n_events is the maximum
    /// number of events to return.
    fn get_user_events(
        self: @T, user: ContractAddress, max_n_events: usize
    ) -> Array<EventUserInfo>;

    /// Gets the number of events in the contract.
    fn n_events(self: @T) -> usize;

    /// Gets the information of an event. Time will be 0 if the event does not exist.
    fn event_info(self: @T, event_id: felt252) -> EventInfo;
    /// Gets the information of a range of events by their IDs. The range is [start, end).
    fn events_infos_by_id(self: @T, start: usize, end: usize) -> Array<EventInfo>;
    /// Gets the information of a range of events by their times. The range is [start, end).
    fn events_infos_by_time(self: @T, start: Time, end: Time) -> Array<EventInfo>;
    /// Registers a user to an event. The user id is the caller address of the transaction.
    fn register(ref self: T, event_id: felt252);
    /// Unregisters a user from an event. The user id is the caller address of the transaction.
    fn unregister(ref self: T, event_id: felt252);

    /// Acquires tokens for the caller. The caller must be an allowed user.
    fn acquire_tokens(ref self: T, amount: u32);
    /// Returns the balance of the user.
    fn balanceOf(self: @T, user: ContractAddress) -> u32;

    /// Adds an event to the contract.
    fn add_event(ref self: T, time: felt252, price: u32);
    /// Modifies the time of an event.
    fn modify_event_time(ref self: T, event_id: felt252, time: felt252);
    /// Sets whether an event is canceled.
    fn set_event_canceled(ref self: T, event_id: felt252, canceled: bool);
    /// Adds a user to the set of allowed users.
    fn add_allowed_user(ref self: T, user: ContractAddress);
    /// Removes a user from the set of allowed users.
    fn remove_allowed_user(ref self: T, user: ContractAddress);
}

#[starknet::contract]
mod registration {
    use starknet::storage::VecTrait;
    use starknet::storage::MutableVecTrait;
    use crate::utils::time::{Time, TimeTrait};
    use starknet::storage::StorageAsPointer;
    use starknet::storage::StoragePathEntry;
    use starknet::storage::StorageMapReadAccess;
    use starknet::storage::StoragePointerWriteAccess;
    use starknet::storage::StoragePointerReadAccess;
    use starknet::storage::StorageMapWriteAccess;
    use super::{EventInfo, EventUserInfo};
    use starknet::ContractAddress;
    use starknet::storage::{Map, Vec};

    #[storage]
    struct Storage {
        /// A map from event ID to event information.
        events: Map<felt252, EventInfo>,
        /// A map from event ID to whether the event has been canceled.
        event_canceled: Map<felt252, bool>,
        /// A simple data structure to allow lookup of events by time. The key is the day of the
        /// event, and the value is a vector of event IDs.
        events_by_day: Map<u64, Vec<felt252>>,
        /// The number of events in the contract.
        n_events: usize,
        /// A map from user to their token balance.
        balance: Map<ContractAddress, u32>,
        /// The set of users who may request tokens.
        allowed_users: Map<ContractAddress, bool>,
        /// A map from event_id to a map from user to whether the user is registered to the event.
        is_registered_to_event: Map<(felt252, ContractAddress), bool>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        UserRegistration: UserRegistration,
        EventChanged: EventChanged,
        EventCancellation: EventCancellation,
        AcquireTokens: AcquireTokens,
        UserAllowed: UserAllowed,
    }

    #[derive(Drop, starknet::Event)]
    struct UserRegistration {
        #[key]
        user: ContractAddress,
        #[key]
        event_id: felt252,
        status: bool,
    }

    #[derive(Drop, starknet::Event)]
    struct EventChanged {
        event_id: felt252,
        time: Time,
    }

    #[derive(Drop, starknet::Event)]
    struct EventCancellation {
        event_id: felt252,
        canceled: bool,
    }

    #[derive(Drop, starknet::Event)]
    struct AcquireTokens {
        user: ContractAddress,
        amount: u32,
        new_balance: u32,
    }

    #[derive(Drop, starknet::Event)]
    struct UserAllowed {
        user: ContractAddress,
        allowed: bool,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {}

    #[generate_trait]
    impl PrivateFunctionsImpl of PrivateFunctions {
        fn _add_event(ref self: ContractState, time: felt252, price: u32) {
            let n_events_ptr = self.n_events.as_ptr();
            let n_events = n_events_ptr.read();
            let time = TimeTrait::new(time.try_into().expect('Invalid time'));
            let event_id = n_events + 1;
            let event_day = time.day();
            self.events.write(n_events.into(), EventInfo { time, price });
            n_events_ptr.write(event_id);
            self.events_by_day.entry(event_day).append().write(event_id.into());

            self.emit(EventChanged { event_id: n_events.into(), time });
        }

        fn _modify_event_time(ref self: ContractState, event_id: felt252, time: felt252) {
            self._check_event_exists(event_id);
            // TODO: Check not cancelled.

            let time = TimeTrait::new(time.try_into().expect('Invalid time'));
            self.events.entry(event_id).time.write(time);

            self.emit(EventChanged { event_id, time });
        }

        fn _check_event_exists(self: @ContractState, event_id: felt252) {
            assert(
                event_id.try_into().expect('Invalid event_id') < self.n_events.read(),
                'Event does not exist.'
            );
        }

        fn _check_not_canceled(self: @ContractState, event_id: felt252) {
            self._check_event_exists(event_id);
            assert(!self.event_canceled.read(event_id), 'Event canceled.');
        }

        fn _register_user_to_event(
            ref self: ContractState, event_id: felt252, user: ContractAddress
        ) {
            self._check_not_canceled(event_id);
            // let event_time: u256 = self.events.read(event_id).time.into();
            // assert(event_time < starknet::get_block_timestamp().into(), 'Event already
            // started.');
            assert(!self.is_registered_to_event.read((event_id, user)), 'User already registered.');
            self.is_registered_to_event.write((event_id, user), true);

            self.emit(UserRegistration { user, event_id, status: true });
        }

        fn _unregister_user_from_event(
            ref self: ContractState, event_id: felt252, user: ContractAddress
        ) {
            self._check_event_exists(event_id);
            // let canceled = self.event_canceled.read(event_id);
            // let event_time: u256 = self.events.read(event_id).time.into();
            // assert(event_time < starknet::get_block_timestamp().into(), 'Event already
            // started.');
            assert(self.is_registered_to_event.read((event_id, user)), 'User not registered.');
            self.is_registered_to_event.write((event_id, user), false);

            self.emit(UserRegistration { user, event_id, status: false });
        }
    }

    #[abi(embed_v0)]
    impl RegistrationImpl of super::IRegistration<ContractState> {
        fn get_user_events(
            self: @ContractState, user: ContractAddress, max_n_events: usize
        ) -> Array<EventUserInfo> {
            let mut events = ArrayTrait::new();
            let total_n_events = self.n_events.read();

            if (total_n_events == 0) {
                return events;
            }

            let mut index = total_n_events;
            let mut cnt = 0;

            while index > 0 && cnt < max_n_events {
                index -= 1;
                let event = self.events.read(index.into());
                let canceled = self.event_canceled.read(index.into());
                let registered = self.is_registered_to_event.read((index.into(), user));

                if canceled && !registered {
                    continue;
                }

                let event_user_info = EventUserInfo {
                    id: index, time: event.time, registered, canceled,
                };
                cnt += 1;
                events.append(event_user_info);
            };
            events
        }

        fn n_events(self: @ContractState) -> usize {
            self.n_events.read()
        }

        fn event_info(self: @ContractState, event_id: felt252) -> EventInfo {
            self.events.read(event_id)
        }

        fn events_infos_by_id(self: @ContractState, start: usize, end: usize) -> Array<EventInfo> {
            let mut events = ArrayTrait::new();
            for i in start..end {
                events.append(self.events.read(i.into()));
            };
            events
        }

        fn events_infos_by_time(self: @ContractState, start: Time, end: Time) -> Array<EventInfo> {
            let mut events = ArrayTrait::new();
            let start_day = start.day();
            let end_day = end.day();
            // TODO: Add get_events_of_day, and check for time limits only in the first and last
            // day.
            for day in start_day
                ..end_day {
                    let cur_day_events = self.events_by_day.entry(day);
                    let n_events_in_day = cur_day_events.len();
                    for i in 0
                        ..n_events_in_day {
                            let event_id = cur_day_events.at(i).read();
                            let event = self.events.read(event_id);
                            if event.time >= start && event.time < end {
                                events.append(event);
                            }
                        }
                };
            events
        }

        fn add_event(ref self: ContractState, time: felt252, price: u32) {
            // TODO: Check owner.
            self._add_event(time, price);
        }

        fn modify_event_time(ref self: ContractState, event_id: felt252, time: felt252) {
            // TODO: Check owner.
            self._modify_event_time(event_id, time);
        }

        fn set_event_canceled(ref self: ContractState, event_id: felt252, canceled: bool) {
            // TODO: Check owner.
            self._check_event_exists(event_id);
            self.event_canceled.write(event_id, canceled);

            self.emit(EventCancellation { event_id, canceled });
        }

        fn add_allowed_user(ref self: ContractState, user: ContractAddress) {
            // TODO: Check owner.
            assert(!self.allowed_users.read(user), 'User already registered.');
            self.allowed_users.write(user, true);

            self.emit(UserAllowed { user, allowed: true });
        }

        fn remove_allowed_user(ref self: ContractState, user: ContractAddress) {
            // TODO: Check owner.
            assert(self.allowed_users.read(user), 'User not registered.');
            self.allowed_users.write(user, false);

            self.emit(UserAllowed { user, allowed: false });
        }

        fn register(ref self: ContractState, event_id: felt252) {
            let user = starknet::get_caller_address();

            // Check and update balance.
            let current_balance = self.balance.read(user);
            assert(current_balance >= 1, 'Insufficient balance.');
            self.balance.write(user, current_balance - 1);

            self._register_user_to_event(:event_id, :user);
        }

        fn unregister(ref self: ContractState, event_id: felt252) {
            let user = starknet::get_caller_address();
            self._unregister_user_from_event(:event_id, :user);

            let current_balance = self.balance.read(user);
            // In this case we don't check that balance is not too high.
            self.balance.write(user, current_balance + 1);
        }

        fn acquire_tokens(ref self: ContractState, amount: u32) {
            let user = starknet::get_caller_address();

            assert(self.allowed_users.read(user), 'User not registered.');

            let current_balance = self.balance.read(user);
            let new_balance = current_balance + amount;
            // TODO: Check + check overflow.
            assert(new_balance <= 12, 'balance exceeds 12 tokens.');
            self.balance.write(user, new_balance);

            self.emit(AcquireTokens { user, amount, new_balance });
        }

        fn balanceOf(self: @ContractState, user: ContractAddress) -> u32 {
            self.balance.read(user)
        }
    }
}

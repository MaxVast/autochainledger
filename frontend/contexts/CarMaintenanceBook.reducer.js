export const CARMAINTENANCEBOOK_EVENTS_UPDATE_ACTION = 'carMaintenanceBook/events/update';
export const CARMAINTENANCEBOOK_USER_CHANGES = 'carMaintenanceBook/user/changes';

const carMaintenanceBookContextReducer = (state, action) => {
    if (action.type === CARMAINTENANCEBOOK_EVENTS_UPDATE_ACTION) {
        // Use a set to ensure uniqueness
        let uniqueDistributor = new Set(state.distributorAddresses);
        // Update the state according of which event is received
        for (let log of action.payload.logs) {

            switch (log.eventName) {
                case 'DistributorRegistered':
                    uniqueDistributor.add(log.args.distributorAddresses);
                    break;
            }
        }
        return {
            ...state,
            distributorAddresses: Array.from(uniqueDistributor), // Convert set to array to store in state
            isDistributor: uniqueDistributor.has(action.payload.userAddress)
        }
    }

    // If the user's status changes (connected, disconnected, new address), their voter status is re-evaluated.
    if (action.type === CARMAINTENANCEBOOK_USER_CHANGES) {
        const verifyDistributorRight = () => {

            if (!action.payload.isUserConnected) return false;
            if (state.distributorAddresses.length <= 0) return false;

            return state.distributorAddresses.includes(action.payload.userAddress)
        }

        return {
            ...state,
            isDistributor: verifyDistributorRight()
        }
    }

    return state;
}

export default carMaintenanceBookContextReducer;

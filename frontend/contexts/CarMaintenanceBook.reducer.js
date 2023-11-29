export const CARMAINTENANCEBOOK_EVENTS_UPDATE_ACTION = 'carMaintenanceBook/events/update';
export const CARMAINTENANCEBOOK_USER_CHANGES = 'carMaintenanceBook/user/changes';

const carMaintenanceBookContextReducer = (state, action) => {
    if (action.type === CARMAINTENANCEBOOK_EVENTS_UPDATE_ACTION) {
        // Use a set to ensure uniqueness
        let uniqueDistributors = new Set(state.distributorAddress);
        let uniqueVehicleOwner = new Set(state.distributorAddress);
        let uniqueidsToken = new Set(state.idsToken);
        // Update the state according of which event is received
        for (let log of action.payload.logs) {

            switch (log.eventName) {
                case 'DistributorRegistered':
                    uniqueDistributors.add(log.args.DistributorAddress);
                    break;
                case 'TokenClaimed':
                    uniqueVehicleOwner.add(log.args.user);
                    uniqueidsToken.add(log.args.idToken);
                    break;

            }
        }
        return {
            ...state,
            distributorAddress: Array.from(uniqueDistributors),
            isDistributor: uniqueDistributors.has(action.payload.userAddress),
            vehicleOwnerAddress: Array.from(uniqueVehicleOwner),
            isVehicleOwner: uniqueVehicleOwner.has(action.payload.userAddress),
            idsToken: Array.from(uniqueidsToken)
        }
    }

    // If the user's status changes (connected, disconnected, new address), their voter status is re-evaluated.
    if (action.type === CARMAINTENANCEBOOK_USER_CHANGES) {
        const verifyDistributorRight = () => {

            if (!action.payload.isUserConnected) return false;
            if (state.distributorAddress.length <= 0) return false;

            return state.distributorAddress.includes(action.payload.userAddress)
        }

        const verifyvehicleOwnerRight = () => {

            if (!action.payload.isUserConnected) return false;
            if (state.vehicleOwnerAddress.length <= 0) return false;

            return state.vehicleOwnerAddress.includes(action.payload.userAddress)
        }

        return {
            ...state,
            isDistributor: verifyDistributorRight(),
            isVehicleOwner: verifyvehicleOwnerRight()
        }
    }

    return state;
}

export default carMaintenanceBookContextReducer;

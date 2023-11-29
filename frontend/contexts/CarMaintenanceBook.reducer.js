export const CARMAINTENANCEBOOK_EVENTS_UPDATE_ACTION = 'carMaintenanceBook/events/update';
export const CARMAINTENANCEBOOK_USER_CHANGES = 'carMaintenanceBook/user/changes';

const carMaintenanceBookContextReducer = (state, action) => {
    if (action.type === CARMAINTENANCEBOOK_EVENTS_UPDATE_ACTION) {
        return {
            ...state
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
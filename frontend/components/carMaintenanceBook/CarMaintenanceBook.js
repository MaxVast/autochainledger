"use client"

import useCarMaintenanceBook from "@/hooks/useCarMaintenanceBook";

const CarMaintenanceBook = () => {
    /* State & Context */
    const { isUserConnected, isUserOwner, isDistributor } = useCarMaintenanceBook()

    return (
        <> {isUserConnected ? (
            isUserOwner ? (
                <h1>Owner connected</h1>
            ) :(
                <h1>Not owner connected</h1>
            )) : isDistributor ?(
                <h1>Distributor connected</h1>
            ) :(
                <h1>Not connected</h1>
            )}
        </>
    )
}

export default CarMaintenanceBook

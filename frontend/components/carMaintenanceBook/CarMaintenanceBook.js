"use client"

import useCarMaintenanceBook from "@/hooks/useCarMaintenanceBook";

const CarMaintenanceBook = () => {
    /* State & Context */

    const { isUserConnected, isDistributor } = useCarMaintenanceBook()

    return (
        <>
            {isUserConnected}
        </>
    )
}

export default CarMaintenanceBook
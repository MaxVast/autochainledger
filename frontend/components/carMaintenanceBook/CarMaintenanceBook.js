"use client"

import useCarMaintenanceBook from "@/hooks/useCarMaintenanceBook";
import OwnerView from "../owner/OwnerView/OwnerView";
import DistributorView from "../ distributor/DistributorView/DistributorView";
import { Center, Flex } from "@chakra-ui/react";

const CarMaintenanceBook = () => {
    /* State & Context */
    const { isUserConnected, isUserOwner, isDistributor, isVehicleOwner } = useCarMaintenanceBook()

    return (
        <> 
            <Flex style={{ borderBottom: '1px solid #eee' }}>
                {isUserConnected ? (
                isUserOwner ? (
                    <>
                        <Flex direction="column" width='100%'>
                            <h1>Owner connected</h1>
                            <OwnerView />
                        </Flex>
                    </>
                ) : (
                    <>
                        {isDistributor ? (
                            <>
                                <Flex direction="column" width='100%'>
                                    <DistributorView />
                                </Flex>
                            </>
                        ) : (
                            <>
                                {isVehicleOwner ? (
                                    <h1>User with NFT vehicle connected</h1>
                                ) : (
                                    <h1>Not connected</h1>
                                )}
                            </>
                        )}
                    </>
                )) : (
                    <h1>Not connected</h1>
                )}
            </Flex>
        </>
    )
}

export default CarMaintenanceBook

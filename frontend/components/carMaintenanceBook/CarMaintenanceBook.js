"use client"

import useCarMaintenanceBook from "@/hooks/useCarMaintenanceBook";
import { Center, Flex, Text } from "@chakra-ui/react";

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
                                <Center>
                                    <h1>Owner connected</h1>
                                </Center>
                                <Text>Welcome</Text>
                            </Flex>
                        </>
                    ) : (
                        <>
                            {isDistributor ? (
                                <>
                                    <Flex direction="column" width='100%'>
                                    <Center>
                                        <h1>Distributor connected</h1>
                                    </Center>
                                        <Text>Welcome</Text>
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
                    )
                }
            </Flex>
        </>
    )
}

export default CarMaintenanceBook

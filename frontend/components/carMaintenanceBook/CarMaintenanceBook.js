"use client"

import useCarMaintenanceBook from "@/hooks/useCarMaintenanceBook";
import { Center, Flex, Text } from "@chakra-ui/react";
import ListBookCar from "@/components/driver/ListBookCar/ListBookCar";

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
                                    <h1>Administrateur connecté</h1>
                                </Center>
                                <Text>Bienvenue</Text>
                            </Flex>
                        </>
                    ) : (
                        <>
                            {isDistributor ? (
                                <>
                                    <Flex direction="column" width='100%'>
                                    <Center>
                                        <h1>Concessionnaire connecté</h1>
                                    </Center>
                                        <Text>Bienvenue</Text>
                                    </Flex>
                                </>
                            ) : (
                                <>
                                    {isVehicleOwner ? (
                                        <>
                                            <h1>User with NFT vehicle connected</h1>
                                            <ListBookCar />
                                        </>
                                    ) : (
                                        <h1>Not connected</h1>
                                    )}
                                </>
                            )}
                        </>
                    )) : (
                        <h1>Vous n'êtes pas connecté</h1>
                    )
                }
            </Flex>
        </>
    )
}

export default CarMaintenanceBook

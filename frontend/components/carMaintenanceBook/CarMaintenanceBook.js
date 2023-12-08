"use client"

import useCarMaintenanceBook from "@/hooks/useCarMaintenanceBook";
import { Box, Center, Flex, Heading, Image, Text } from "@chakra-ui/react";
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
                            <Flex direction="column" width='100%' p={4}>
                                <Center>
                                    <Heading mb="4">Administrateur connecté</Heading>
                                </Center>
                                <Text>Bienvenue</Text>
                            </Flex>
                            <Flex direction="column" width='100%'>
                                <Box>
                                    <Image src='image.png' alt='AutoChain Ledger' loading="lazy" /> 
                                </Box>
                            </Flex>
                        </>
                    ) : (
                        <>
                            {isDistributor ? (
                                <>
                                    <Flex direction="column" width='100%' p={4}>
                                        <Center>
                                            <Heading mb="4">Concessionnaire connecté</Heading>
                                        </Center>
                                        <Text>Bienvenue</Text>
                                    </Flex>
                                    <Flex direction="column" width='100%'>
                                        <Box>
                                            <Image src='image.png' alt='AutoChain Ledger' loading="lazy" /> 
                                        </Box>
                                    </Flex>
                                </>
                            ) : (
                                <>
                                    <Flex direction="column" width='100%'>
                                        <Center>
                                            <Heading mb="4">Utilisateur connecté</Heading>
                                        </Center>
                                        <ListBookCar />
                                    </Flex>
                                </>
                            )}
                        </>
                    )) : (
                        <>
                            <Flex direction="column" width='100%' p={4}>
                                <Center>
                                    <Text>Bienvenue sur Autochain Ledger</Text>
                                </Center>
                            </Flex>

                            <Flex direction="column" width='100%' p={4}>
                                <Box>
                                    <Image src='image.png' alt='AutoChain Ledger' loading="lazy" /> 
                                </Box>
                            </Flex>
                        </>
                    )
                }
            </Flex>
        </>
    )
}

export default CarMaintenanceBook

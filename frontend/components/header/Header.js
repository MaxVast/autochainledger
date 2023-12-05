'use client'

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Flex, Spacer, Heading, Box, Text, Center, Image } from '@chakra-ui/react'
import Link from "next/link"
import useCarMaintenanceBook from "@/hooks/useCarMaintenanceBook"

const Header = () => {
    /* State & Context */
    const { isUserOwner, isDistributor } = useCarMaintenanceBook()
    return (
        <>
            <Flex p="1rem" bg="#eee" width='100%' height='auto' alignItems="center" justifyContent="space-between">
                <Box>
                    <Heading>
                        <Link href="/">
                            <Image
                                boxSize='100px'
                                objectFit='cover'
                                src='Logo.png'
                                alt='AutoChain Ledger'
                            />
                        </Link>
                    </Heading>
                </Box>

                <Box>
                    <Flex alignItems="center">
                        {(isDistributor || isUserOwner) && (
                            <Link href="/distributor">
                                <Text cursor="pointer" fontWeight="bold" mx="2">
                                    Espace Concessionnaire
                                </Text>
                            </Link>
                        )}

                        {isUserOwner && (
                            <Link href="/admin">
                                <Text cursor="pointer" fontWeight="bold" mx="2">
                                    Espace Administrateur
                                </Text>
                            </Link>
                        )}
                    </Flex>
                </Box>

                <Spacer />
                
                <Box>
                    <ConnectButton />
                </Box>
            </Flex>
        </>
    )
}

export default Header

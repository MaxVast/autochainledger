'use client'

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Flex, Spacer, Heading, Box, Text, Center, Image } from '@chakra-ui/react'
import Link from "next/link"

const Header = ({ path }) => {
    return (
        <>
            <Flex p="1rem" bg="#eee" pos="fixed" width='100%' min-height='100px' height='auto'>
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
                <Spacer />
                <Box>
                    <ConnectButton />
                </Box>
            </Flex>
        </>
    )
}

export default Header
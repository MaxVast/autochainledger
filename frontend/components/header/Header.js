'use client'

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Flex, Spacer, Heading, Box, Text, Center, Image } from '@chakra-ui/react'
import Link from "next/link"

const Header = ({ path }) => {
    return (
        <>
            <Flex p="2rem" bg="#eee">
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
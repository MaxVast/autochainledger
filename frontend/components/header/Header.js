'use client'

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Flex, Spacer, Heading, Box, Text, Center } from '@chakra-ui/react'
import Link from "next/link"

const Header = ({ path }) => {
    return (
        <>
            <Flex p="2rem" bg="#eee">
                <Box>
                    <Heading>
                        <Link href="/" style={{ border: '3px solid black', borderRadius: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '1.75rem' }}>
                            AutoChain Ledger
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
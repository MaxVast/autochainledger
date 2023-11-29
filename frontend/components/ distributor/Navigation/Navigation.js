"use client"
import React from 'react'
import { Flex, Box, Text, VStack } from '@chakra-ui/react';
import Link from "next/link"

const Navigation = () => {
  return (
    <>
        <Flex Flex direction="column" width='10%'>
            <Box
                bg="gray.800"
                color="white"
                p="4"
                pos="fixed"
                h="full"
                >
                <Flex h="20" alignItems="left" justifyContent="space-start">
                    <VStack align="start" spacing="4">
                        <Link href="/">
                            <Text fontSize="lg" fontWeight="bold">
                                Home
                            </Text>
                        </Link>
                        <Link href="/">
                            <Text fontSize="lg" fontWeight="bold">
                                Emit a maintenance book
                            </Text>
                        </Link>
                        <Link href="/">
                            <Text fontSize="lg" fontWeight="bold">
                                Add maintenance
                            </Text>
                        </Link>
                        <Link href="/">
                            <Text fontSize="lg" fontWeight="bold">
                                Transfer an book
                            </Text>
                        </Link>
                        {/* Add more menu items as needed */}
                    </VStack>
                </Flex>
            </Box>
        </Flex>
    </>
  )
}

export default Navigation
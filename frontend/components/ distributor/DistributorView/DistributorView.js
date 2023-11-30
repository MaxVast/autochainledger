"use client"
import {useEffect, useState} from 'react'
import {Box, Flex, Heading, Text, VStack} from '@chakra-ui/react'

const DistributorView = () => {
    const [path, setPath] = useState('');

    return (
        <>
            <Flex direction="column" width='100%'>
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
                                <Text fontSize="lg" fontWeight="bold" cursor="pointer" onClick={() => setPath('/')}>
                                    Home
                                </Text>

                                <Text fontSize="lg" fontWeight="bold" cursor="pointer" onClick={() => setPath('/emit-book')} >
                                    Emit a maintenance book
                                </Text>

                                <Text fontSize="lg" fontWeight="bold" cursor="pointer">
                                    Add maintenance
                                </Text>
                                <Text fontSize="lg" fontWeight="bold" cursor="pointer">
                                    Transfer an book
                                </Text>
                            </VStack>
                        </Flex>
                    </Box>
                </Flex>
                <Flex ml="250px" p="4">
                    {path}
                    <Heading size="xl">Distributor connected</Heading>
                </Flex>
            </Flex>
        </>
    )
}

export default DistributorView

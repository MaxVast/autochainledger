"use client"
import {useState} from 'react'
import {Box, Center, Flex, Heading, Text, VStack} from '@chakra-ui/react'
import EmitBookCarView from '../EmitBookCarView/EmitBookCarView';
import ListBookCarView from '../ListBookCarView/ListBookCarView';


const DistributorView = () => {
    /* State & Context */
    const [path, setPath] = useState('');

    const renderDistributorActionComponent = () => {
        if (path === 'emit-book') {
            return <EmitBookCarView />
        }
        else if (path === 'add-maintenance') {
            return <></>
        }
        else if (path === 'transfer-book') {
            return <></>
        }
        else {
            return <ListBookCarView />
        }
    }

    return (
        <>
            <Flex direction="column" width='100%'>
                <Flex direction="column" width='10%'  bg="gray.800">
                    <Box
                        bg="gray.800"
                        color="white"
                        p="4"
                        pos="fixed"
                        h="full"
                        top="135"
                    >
                        <Flex h="20" alignItems="left" justifyContent="space-start">
                            <VStack align="start" spacing="4">
                                <Text fontSize="lg" fontWeight="bold" cursor="pointer" onClick={() => setPath('')}>
                                    Home
                                </Text>

                                <Text fontSize="lg" fontWeight="bold" cursor="pointer" onClick={() => setPath('emit-book')} >
                                    Emit a maintenance book
                                </Text>

                                <Text fontSize="lg" fontWeight="bold" cursor="pointer" onClick={() => setPath('add-maintenance')}>
                                    Add maintenance
                                </Text>
                                <Text fontSize="lg" fontWeight="bold" cursor="pointer" onClick={() => setPath('transfer-book')}>
                                    Transfer an book
                                </Text>
                            </VStack>
                        </Flex>
                    </Box>
                </Flex>
                <Flex ml="250px" mt="130px" p="4" >
                    <VStack spacing={4}  width='100%'>
                        <Box>
                            <Center width='100%'>
                                <Heading size="xs">Distributor connected</Heading>
                            </Center>
                        </Box>
                        <Flex p="1rem" width='100%'>
                            <Box>
                                { renderDistributorActionComponent() }
                            </Box>
                        </Flex>

                    </VStack>
                </Flex>
            </Flex>
        </>
    )
}

export default DistributorView

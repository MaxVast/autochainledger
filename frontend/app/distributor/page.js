"use client"
import ListBookCarView from '@/components/distributor/ListBookCarView/ListBookCarView'
import Header from '@/components/header/Header'
import useCarMaintenanceBook from '@/hooks/useCarMaintenanceBook'
import {useState} from 'react'
import { Box, Button, Card, CardBody, CardHeader, Flex, Heading, Stack, StackDivider, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link';
import EmitBookCarView from '@/components/distributor/EmitBookCarView/EmitBookCarView'
import AddMaintencance from '@/components/distributor/AddMaintenance/AddMaintencance'

const DistributorPage = () => {
     /* State & Context */
     const { isDistributor } = useCarMaintenanceBook()
     const [activePath, setActivePath] = useState('');

    const renderDistributorActionComponent = () => {
        if (activePath === 'emit-book') {
            return <EmitBookCarView />
        }
        else if (activePath === 'add-maintenance') {
            return <AddMaintencance />
        }
        else if (activePath === 'transfer-book') {
            return <></>
        }
        else {
            return <ListBookCarView />
        }
    }
    return (
        <>
            <Header path='/distributor' />
            {isDistributor ? (
                <> 
                    <Flex bg="gray.800" color="white" p="4" alignItems="center">
                        <Text
                            fontSize="lg"
                            fontWeight="bold"
                            cursor="pointer"
                            onClick={() => setActivePath('')}
                            color={activePath === '' ? 'blue.500' : 'white'}
                            mr="4"
                        >
                            Home
                        </Text>
                        <Text
                            fontSize="lg"
                            fontWeight="bold"
                            cursor="pointer"
                            onClick={() => setActivePath('emit-book')}
                            color={activePath === 'emit-book' ? 'blue.500' : 'white'}
                            mr="4"
                        >
                            Emit a maintenance book
                        </Text>
                        <Text
                            fontSize="lg"
                            fontWeight="bold"
                            cursor="pointer"
                            onClick={() => setActivePath('add-maintenance')}
                            color={activePath === 'add-maintenance' ? 'blue.500' : 'white'}
                            mr="4"
                        >
                            Add maintenance
                        </Text>
                        <Text
                            fontSize="lg"
                            fontWeight="bold"
                            cursor="pointer"
                            onClick={() => setActivePath('transfer-book')}
                            color={activePath === 'transfer-book' ? 'blue.500' : 'white'}
                        >
                            Transfer a book
                        </Text>
                    </Flex>
                    { renderDistributorActionComponent() }
                    { activePath != '' && (
                        <Flex p="1rem" width='100%'>
                            <Box>
                            <Button type="submit" colorScheme="red" cursor="pointer" onClick={() => setActivePath('')}>Retour</Button>
                            </Box>
                        </Flex>
                    ) }
                </>
            ) : (
                <Card paddingTop='1rem' marginTop='2rem' marginBottom='2.5rem'>
                    <CardHeader>
                        <Heading size='md'>Distributor Space</Heading>
                    </CardHeader>
            
                    <CardBody>
                        <Stack divider={<StackDivider />} spacing='4'>
                            <Box>
                            <Heading size='xs' textTransform='uppercase'>
                                Message
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                You're not identified as Distributor
                            </Text>
                            </Box>
                            <Box>
                            <Heading size='xs' textTransform='uppercase'>
                                What to do ?
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                Please <b>login as Distributor</b> or go to the <b><Link href="/" color='#0e76fd'>Home</Link></b> space
                            </Text>
                            </Box>
                        </Stack>
                    </CardBody>
                </Card>
            )}
        </>
    )
}

export default DistributorPage
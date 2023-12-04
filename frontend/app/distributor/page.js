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
     const [selectedToken, setSelectedToken] = useState(null);

    const handleSetActivePath = (path) => {
        setActivePath(path);
    };

    const handleSelectedTokenChange = (tokenId) => {
        setSelectedToken(tokenId);
    };

    const renderDistributorActionComponent = () => {
        if (activePath === 'emit-book') {
            return <EmitBookCarView />
        }
        else if (activePath === 'add-maintenance-by-detailview') {
            return <AddMaintencance selectedToken={selectedToken} />
        }
        else if (activePath === 'add-maintenance') {
            return <AddMaintencance selectedToken={null} />
        }
        else if (activePath === 'transfer-book') {
            return <></>
        }
        else {
            return <ListBookCarView setActivePath={handleSetActivePath} onSelectedTokenChange={handleSelectedTokenChange} />
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
                            Délivrer un carnet
                        </Text>
                        <Text
                            fontSize="lg"
                            fontWeight="bold"
                            cursor="pointer"
                            onClick={() => setActivePath('add-maintenance')}
                            color={activePath === 'add-maintenance' ? 'blue.500' : 'white'}
                            mr="4"
                        >
                            Ajouter une maintenance
                        </Text>
                        <Text
                            fontSize="lg"
                            fontWeight="bold"
                            cursor="pointer"
                            onClick={() => setActivePath('transfer-book')}
                            color={activePath === 'transfer-book' ? 'blue.500' : 'white'}
                        >
                            Transferer un carnet
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
                        <Heading size='md'>Espace concessionnaire</Heading>
                    </CardHeader>
            
                    <CardBody>
                        <Stack divider={<StackDivider />} spacing='4'>
                            <Box>
                            <Heading size='xs' textTransform='uppercase'>
                                Message
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                Vous n'êtes pas identifié comme concessionnaire
                            </Text>
                            </Box>
                            <Box>
                            <Heading size='xs' textTransform='uppercase'>
                                Ce qu'il faut faire ?
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                Veuillez <b>vous connecter en tant que concessionnaire</b> ou rendez-vous sur la page <b><Link href="/" color='#0e76fd'>Home</Link></b>
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

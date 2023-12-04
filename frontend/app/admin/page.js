"use client"

import Header from '@/components/header/Header'
import useCarMaintenanceBook from '@/hooks/useCarMaintenanceBook'
import {useState} from 'react'
import { Box, Button, Card, CardBody, CardHeader, Flex, Heading, Stack, StackDivider, Text, VStack } from '@chakra-ui/react'
import OwnerView from '@/components/owner/OwnerView/OwnerView'
import Link from 'next/link'

const OwnerPage = () => {
    /* State & Context */
    const { isUserOwner } = useCarMaintenanceBook()
    return (
        <>
            <Header path='/admin' />
            {isUserOwner ? (
                <OwnerView />
            ) : (
                <Card paddingTop='1rem' marginTop='2rem' marginBottom='2.5rem'>
                    <CardHeader>
                        <Heading size='md'>Espace Administrateur</Heading>
                    </CardHeader>
            
                    <CardBody>
                        <Stack divider={<StackDivider />} spacing='4'>
                            <Box>
                            <Heading size='xs' textTransform='uppercase'>
                                Message
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                Vous n'êtes pas identifié comme administrateur
                            </Text>
                            </Box>
                            <Box>
                            <Heading size='xs' textTransform='uppercase'>
                                Ce qu'il faut faire ?
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                Veuillez <b>vous connecter en tant qu'administrateur</b> ou rendez-vous sur la page <b><Link href="/" color='#0e76fd'>Home</Link></b>
                            </Text>
                            </Box>
                        </Stack>
                    </CardBody>
                </Card>
            )}
        </>
    )
}

export default OwnerPage

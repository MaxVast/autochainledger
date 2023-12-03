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

export default OwnerPage
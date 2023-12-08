"use client"

import Header from '@/components/header/Header'
import useCarMaintenanceBook from '@/hooks/useCarMaintenanceBook'
import {useEffect, useState} from 'react'
import { Box, Card, CardBody, CardHeader, Flex, Heading, Stack, StackDivider, Text } from '@chakra-ui/react'
import OwnerView from '@/components/owner/OwnerView/OwnerView'
import Link from 'next/link'
import { readContract  } from '@wagmi/core'
import { contractAbiCarMaintenanceLoyalty, contractAddressCarMaintenanceLoyalty } from '@/constants/index'

const OwnerPage = () => {
    /* State & Context */
    const { isUserOwner, idsToken } = useCarMaintenanceBook()
    const [balanceOfToken, setBalanceOfToken] =  useState('')

    const balanceOfTokenERC20 =  async () => {
        const number = await readContract({
            address: contractAddressCarMaintenanceLoyalty,
            abi: contractAbiCarMaintenanceLoyalty,
            functionName: 'totalSupply'
        });
        setBalanceOfToken(number.toString())
    }

    useEffect(() => {
        balanceOfTokenERC20()
    }, [])
    return (
        <>
            <Header path='/admin' />
            {isUserOwner ? (
                <>
                    <Flex p="1rem" width='100%' alignItems={'center'}>
                        <Box width='50%' paddingRight='2rem'>
                            <Text  as='b' >Nombre de carnet emis : {idsToken.length}</Text>
                        </Box>

                        <Box width='50%' paddingRight='2rem'>
                            <Text  as='b'>Nombre de token en circulation : {balanceOfToken != '0' ? balanceOfToken : 0} ACLT</Text>
                        </Box>
                    </Flex>
                    <OwnerView />
                </>
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

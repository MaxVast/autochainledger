'use client'
//ReactJS
import { useState } from 'react'
// Chackra UI
import { CopyIcon, DeleteIcon } from '@chakra-ui/icons'
import { Flex, Heading, useToast, Input, Button, Text, VStack, Box, TableContainer, Table, Thead, Tr, Td, Th, Tbody, Center, Spacer, Badge } from '@chakra-ui/react'
//Constants information SmartContract
import { contractAbiCarMaintenanceBook, contractAddressCarMaintenanceBook, contractAbiCarMaintenanceLoyalty, contractAddressCarMaintenanceLoyalty } from '@/constants/index'
// Wagmi
import { prepareWriteContract, writeContract,waitForTransaction } from '@wagmi/core'
// Viem
import { ContractFunctionExecutionError } from 'viem'
// Hooks Context
import useCarMaintenanceBook from '@/hooks/useCarMaintenanceBook'

const OwnerView = () => {
    /* State & Context */
    const { isDistributor, distributorCount, distributorAddress, ownerAddress } = useCarMaintenanceBook()
    // Input States
    const [distributor, setDistributor] = useState('')

    const getEthAddressStart = (address) => address.substring(0, 5);
    const getEthAddressMiddle = (address) => address.substring(6, address.length-5);
    const getEthAddressEnd = (address) => address.substring(address.length-4, address.length);
    const copyToClipboard = (address) => navigator.clipboard.writeText(address);
    // Toasts
    const toast = useToast()
    //function add Distributor
    const addDistributor = async () => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddressCarMaintenanceBook,
                abi: contractAbiCarMaintenanceBook,
                functionName: "setDistributor",
                args: [distributor]
            });
            const { hash } = await writeContract(request);
            toast({
                title: 'En transaction.',
                description: "Enregistrement en cours",
                status: 'info',
                duration: 4000,
                isClosable: true,
            })
            const data = await waitForTransaction({hash: hash})
            toast({
                title: 'Félécitation.',
                    description: "Vous ajouté un concessionnaire",
                status: 'success',
                duration: 4000,
                isClosable: true,
            })
            setDistributor('')
            return hash;
        } catch (err) {
            console.log(err)
            if( err instanceof ContractFunctionExecutionError) {
                toast({
                    title: 'Error',
                    description: err.cause.reason,
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: 'Error.',
                    description: "An error occured",
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                })
            }
            
        }
    }
    return (
        <>
            <Flex p="1rem" width='100%'>
                <VStack spacing={10} height='100%' width='100%'>
                    <Box>
                        <Heading as='h4' size='md'>
                            Enregistrer des adresses concessionnaire
                        </Heading>
                    </Box>

                    <Flex p="1rem" width='100%'>
                        <Box width='50%' paddingRight='2rem'>

                            <Flex mt="1rem">
                                <Input type="text" value={distributor} onChange={e => setDistributor(e.target.value)} placeholder="renseigner une nouvelle adresse concessionnaire" fontSize='0.8rem' background='white'/>
                                <Button onClick={() => addDistributor()} marginLeft='1rem'>
                                    <Text fontSize='0.8rem'>register</Text>
                                </Button>
                            </Flex>

                        </Box>

                        <Box w='50%' textAlign='left'>

                            <Text as='b' paddingLeft='1rem' fontSize='sm' color='#3e3f42'>Concessionnaire ({distributorCount})</Text>

                            <Box w='100%' marginTop='0.5rem' paddingRight='2rem' overflow='scroll' maxHeight='20rem'>

                                <TableContainer w='100%'>
                                    <Table size='sm' w='100%'>
                                        <Tbody>
                                            {
                                                distributorCount > 0 ? distributorAddress.map((distributorAddress) => {
                                                    const shorten = distributorAddress;
                                                    return <Tr key={ shorten }>
                                                        <Td>
                                                            <Flex>
                                                                <Center color='#444c5d' fontSize='0.8rem'>
                                                                    <Text as='samp'><b>{ getEthAddressStart(shorten) }</b></Text>
                                                                    <Text as='samp'>{ getEthAddressMiddle(shorten) }</Text>
                                                                    <Text as='samp'><b>{ getEthAddressEnd(shorten) }</b></Text>
                                                                    {(shorten === ownerAddress) && (
                                                                            <Badge colorScheme='purple' marginLeft='0.5rem'>Owner</Badge>
                                                                    )}
                                                                </Center>
                                                                <Spacer />
                                                                <Center>
                                                                    <Button marginLeft='0.25rem' size='xs' colorScheme='gray' variant='ghost' onClick={ () => copyToClipboard(distributorAddress) }>
                                                                        <CopyIcon />
                                                                    </Button>
                                                                </Center>
                                                                <Center>
                                                                    <Button marginLeft='1.5rem' size='xs' colorScheme='gray' variant='ghost' onClick={ () => copyToClipboard(distributorAddress) }>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Center>
                                                            </Flex>
                                                        </Td>
                                                    </Tr>
                                                }) : (
                                                    <Tr>
                                                        <Td>
                                                            <Center>
                                                                <Text fontSize='0.9rem'>Aucun concessionaire est enregistré</Text>
                                                            </Center>
                                                        </Td>
                                                    </Tr>
                                                )
                                            }
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Box>
                    </Flex>

                </VStack>
            </Flex>  
        </>
    )
}

export default OwnerView

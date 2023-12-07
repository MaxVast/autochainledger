"use client"
//ReactJS
import {useEffect, useState} from 'react'
// Chackra UI
import { Heading, FormControl, FormLabel, Input, Select, Button, Textarea, useToast, Flex, Box } from '@chakra-ui/react';
//Constants information SmartContract
import { contractAbiCarMaintenanceBook, contractAddressCarMaintenanceBook } from '@/constants/index'
// Wagmi
import {prepareWriteContract, writeContract, waitForTransaction, readContract} from '@wagmi/core'
// Viem
import { ContractFunctionExecutionError } from 'viem'
// Hooks Context
import useCarMaintenanceBook from '@/hooks/useCarMaintenanceBook'
const TransferBookCar = ({selectedToken}) => {
    /* State & Context */
    const { distributorAddress } = useCarMaintenanceBook();
    const [idToken, setIdToken] = useState('');
    const [ownerToken, setOwnerToken] = useState('');
    const [futurOwnerToken, setFuturOwnerToken] = useState('');
    // Toasts
    const toast = useToast()

    const resetFrom = async () => {
        setIdToken('')
        setOwnerToken('')
        setFuturOwnerToken('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Données pour un transfère :', idToken, ownerToken, futurOwnerToken);
        await transferToken()
    };

    const transferToken = async () => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddressCarMaintenanceBook,
                abi: contractAbiCarMaintenanceBook,
                functionName: "transferTokenNew",
                args: [ownerToken, futurOwnerToken, idToken]
            });
            const { hash } = await writeContract(request);
            toast({
                title: 'In transaction.',
                description: "Transfer in progress",
                status: 'info',
                duration: 4000,
                isClosable: true,
            })
            const data = await waitForTransaction({hash: hash})
            toast({
                title: 'Congratulations.',
                description: "You have transfer the book !",
                status: 'success',
                duration: 4000,
                isClosable: true,
            })
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

    const ownerOfToken = async (selectedToken) => {
        return await readContract({
            address: contractAddressCarMaintenanceBook,
            abi: contractAbiCarMaintenanceBook,
            functionName: 'ownerOf',
            args: [BigInt(selectedToken)]
        });
    }

    useEffect( () => {
        if(selectedToken !== null && BigInt(selectedToken)) {
            setIdToken(selectedToken.toString())
            let owner = ownerOfToken(selectedToken)
            owner.then((res) => {
                setOwnerToken(res)
            })
        }
    }, []);

    return (
        <>
            <Flex align="center" justify="center" margin={4}>
                <Box width="100%" p="4" borderWidth="1px" borderRadius="lg" boxShadow="lg">
                    <Heading mb={4}>Transferer un carnet</Heading>
                    <Flex align="center" justify="end" margin={4}>
                        <Box justify="" m={2}>
                            <Button  colorScheme="teal" onClick={() => resetFrom()}>
                                Annuler
                            </Button>
                        </Box>
                    </Flex>
                    <form onSubmit={handleSubmit}>
                        <FormControl mb={4}>
                            <FormLabel>ID Token:</FormLabel>
                            <Input type="text" value={idToken} onChange={(e) => setIdToken(e.target.value)} />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Propriétaire du carnet :</FormLabel>
                            <Input
                                value={ownerToken}
                                onChange={(e) => setOwnerToken(e.target.value)}
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Futur propriétaire du carnet :</FormLabel>
                            <Input
                                value={futurOwnerToken}
                                onChange={(e) => setFuturOwnerToken(e.target.value)}
                            />
                        </FormControl>
                        <Button type="submit" colorScheme="teal">Transferer</Button>
                    </form>
                </Box>
            </Flex>
        </>
    )
}

export default TransferBookCar

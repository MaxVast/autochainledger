"use client"
//ReactJS
import {useEffect, useState} from 'react'
// Chackra UI
import { Heading, FormControl, FormLabel, Input, Select, Button, Textarea, useToast, Flex, Box } from '@chakra-ui/react';
//Constants information SmartContract
import { contractAbiCarMaintenanceBook, contractAddressCarMaintenanceBook } from '@/constants/index'
// Wagmi
import { prepareWriteContract, writeContract,waitForTransaction } from '@wagmi/core'
// Viem
import { ContractFunctionExecutionError } from 'viem'
// Hooks Context
import useCarMaintenanceBook from '@/hooks/useCarMaintenanceBook'
const AddMaintencance = ({selectedToken}) => {
    /* State & Context */
    const { distributorAddress } = useCarMaintenanceBook()
    // Liste des options pour le champ "Maintenance"
    const maintenanceOptions = [
        'Entretien',
        'Pré-contrôle technique',
        'Vidange simple',
        'Vidange intervention FAP',
        'Carrosserie',
        'Pneu',
        'Batterie',
        'Climatisation',
        'Essuie-glace',
        'Amortisseurs',
        'Freins',
        'Filtres',
        'Echappement',
        'Visite de courtoisie (véhicule de - de 4 mois)',
        'Campagne de rappel',
        'Intervention sous garantie',
        'Autres',
      ];
    const [idToken, setIdToken] = useState('');
    const [mileage, setMileage] = useState(null);
    const [maintenance, setMaintenance] = useState('');
    const [description, setDescription] = useState('');
    // Toasts
    const toast = useToast()

    const resetFrom = async () => {
        setIdToken('')
        setMileage(null)
        setMaintenance('')
        setDescription('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Données soumises :', idToken, mileage, maintenance, description);
        await addMaintenance()
    };

    //function add Distributor
    const addMaintenance = async () => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddressCarMaintenanceBook,
                abi: contractAbiCarMaintenanceBook,
                functionName: "addMaintenance",
                args: [idToken, mileage, maintenance, description]
            });
            const { hash } = await writeContract(request);
            toast({
                title: 'In transaction.',
                description: "Registration in progress",
                status: 'info',
                duration: 4000,
                isClosable: true,
            })
            const data = await waitForTransaction({hash: hash})
            toast({
                title: 'Congratulations.',
                description: "You have added a maintenance !",
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

    useEffect(() => {
       if(selectedToken !== null && BigInt(selectedToken)) {
           setIdToken(selectedToken.toString())
       }
    }, []);

    return (
        <>
            <Flex align="center" justify="center" margin={4}>
            <Box width="100%" p="4" borderWidth="1px" borderRadius="lg" boxShadow="lg">
                <Heading mb={4}>Ajouter une maintenance</Heading>
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
                        <FormLabel>Kilométrage :</FormLabel>
                        <Input
                            type="number"
                            inputMode="numeric"
                            min="0"
                            value={mileage}
                            onChange={(e) => setMileage(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Maintenance:</FormLabel>
                        <Select
                            placeholder="Motif de maintenance*"
                            value={maintenance}
                            onChange={(e) => setMaintenance(e.target.value)}
                        >
                            {maintenanceOptions.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Description:</FormLabel>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={256}
                        />
                    </FormControl>
                    <Button type="submit" colorScheme="teal">Envoyer</Button>
                </form>
                </Box>
            </Flex>
    </>
    )
}

export default AddMaintencance

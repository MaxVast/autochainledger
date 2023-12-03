"use client"
//REACT
import {useEffect, useState} from 'react';
// Chakra UI
import { Box, Text, Button, Table, Thead, Tbody, Tr, Th, Td, Center, TableContainer } from '@chakra-ui/react';
import { contractAbiCarMaintenanceBook, contractAddressCarMaintenanceBook } from '@/constants/index'

import { readContract } from '@wagmi/core'

const DetailView = ({ selectedToken, onClose }) => {
    const [ lengthMaintenance, setLengthMaintenance ] = useState(0)
    const [ maintenanceHistory, setMaintenanceHistory ] = useState([])

    const getLengthMaintenance = async () => {
        try {
            const numbers = await readContract({
                address: contractAddressCarMaintenanceBook,
                abi: contractAbiCarMaintenanceBook,
                functionName: 'getLengthMaintenanceHistory',
                args: [BigInt(selectedToken.id)]
            });
            setLengthMaintenance(numbers)
        } catch (err) {
            console.log(err)
        }
    }

    const gethMaintenanceHistory = async () => {
        const fetchedMaintenance = [];
        try {
            let historys = await readContract({
                address: contractAddressCarMaintenanceBook,
                abi: contractAbiCarMaintenanceBook,
                functionName: 'getMaintenanceHistory',
                args: [BigInt(selectedToken.id)]
            });
            console.log(historys)
            for(let history of historys){
                console.log(history)
                 // Créez un nouvel objet Date en utilisant le timestamp
                 let dateNumber = Number(history.dateMaintenance) * 1000
                 let date = new Date(dateNumber);

                // Obtenez les composants de la date (année, mois, jour)
                let year = date.getUTCFullYear().toString(); // Obtenez les deux derniers chiffres de l'année
                let month = ('0' + (date.getUTCMonth() + 1)).slice(-2); // Ajoutez un zéro devant le mois si nécessaire
                let day = ('0' + date.getUTCDate()).slice(-2); // Ajoutez un zéro devant le jour si nécessaire
                // Formatez la date comme "dd/mm/yy"
                let formattedDate = day + '/' + month + '/' + year;
                console.log(formattedDate)
                 fetchedMaintenance.push({
                     dateMaintenance: formattedDate,
                     mileage: history.mileage,
                     maintenance: history.maintenance,
                     description: history.description
                 })
            }
            
            setMaintenanceHistory(fetchedMaintenance)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getLengthMaintenance()
        gethMaintenanceHistory()
    }, [selectedToken])

    return (
        <Box margin={6}>
            <Button colorScheme="teal" onClick={onClose}>
                Fermer les détails
            </Button>

            <Box mt={4}>
                <Text>ID du token: {selectedToken.id.toString()}</Text>
                <Text>Propriétaire: {selectedToken.owner}</Text>
            </Box>

            <Box mt={4} overflow='scroll'>
                <Text fontWeight="bold">Maintenances associées:</Text>
                <TableContainer w='100%'>
                    <Table size='sm' w='100%' alignItems='center'>
                        <Thead>
                            <Tr>
                                <Th>Date</Th>
                                <Th>Kilométrage</Th>
                                <Th>Type Maintenance</Th>
                                <Th>Description</Th>
                            </Tr>
                        </Thead>
                        
                        <Tbody>
                            {lengthMaintenance > 0 ? maintenanceHistory.map((maintenance, index) => (
                                <Tr key={index}>
                                    <Td>{maintenance.dateMaintenance}</Td>
                                    <Td>{maintenance.mileage.toString()}</Td>
                                    <Td>{maintenance.maintenance}</Td>
                                    <Td>{maintenance.description}</Td>
                                </Tr>
                            )) : (
                                <Tr>
                                    <Td>
                                        <Center>
                                            <Text fontSize='0.9rem'>There is no registered maintenance yet</Text>
                                        </Center>
                                    </Td>
                                </Tr>
                            )}
                            </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default DetailView;

"use client"
// REACT
import {useState} from 'react'
// CONTEXT
import useCarMaintenanceBook from '@/hooks/useCarMaintenanceBook'
// Chackra UI
import { CopyIcon } from '@chakra-ui/icons'
import { Box, SimpleGrid, Text, Image, Flex, Badge, Button } from '@chakra-ui/react'
//COMPONENT
import DetailView from '@/components/maintenance/DetailView/DetailView'

const ListBookCar = () => {
    /* State & Context */
    const { userAddress, tokens, idsToken } = useCarMaintenanceBook()
    const [selectedTokenId, setSelectedTokenId] = useState(null);
    const selectedToken = tokens.find((token) => token.id === selectedTokenId);
    console.log(userAddress)
    console.log(tokens)
    console.log(idsToken)
    const handleCardClick = (tokenId) => {
        setSelectedTokenId(tokenId);
    };

    const handleCloseDetails = () => {
        setSelectedTokenId(null);
    };

    return (
        <>
            {selectedTokenId ? (
                <DetailView selectedToken={selectedToken} onClose={handleCloseDetails} />
            ) : (
                <SimpleGrid columns={2} spacing={4} margin={4}>
                    {tokens.map((token) => (
                        // Ajoutez une condition pour filtrer les tokens
                        token.owner === userAddress && (
                            <Box key={token.id} borderWidth="1px" borderRadius="lg">
                                <Box onClick={() => handleCardClick(token.id)} cursor="pointer">
                                    <Image src={token.image} alt={`Car ${token.id}`} maxWidth="250px" loading="lazy" />
                                </Box>
                                <Box p="6">
                                    <Box onClick={() => handleCardClick(token.id)} cursor="pointer">
                                        <Flex align="baseline">
                                            <Badge borderRadius="full" px="2" colorScheme="teal">
                                                {token.brand}
                                            </Badge>
                                            <Text ml={2} textTransform="uppercase" fontSize="sm" fontWeight="bold" color="teal.800">
                                                {token.model}
                                            </Text>
                                        </Flex>
                                    </Box>
                                    <Box>
                                        <Text mt={2} color="gray.600">
                                            ID: {token.id.toString()}
                                        </Text>
                                    </Box>
                                </Box>
                            </Box>
                        )
                    ))}
                </SimpleGrid>
            )}
        </>
    )
}

export default ListBookCar
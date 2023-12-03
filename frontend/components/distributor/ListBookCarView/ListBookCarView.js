"use client"
// REACT
import {useState} from 'react'
// CONTEXT
import useCarMaintenanceBook from '@/hooks/useCarMaintenanceBook'

// Chackra UI
import { CopyIcon } from '@chakra-ui/icons'
import { Box, SimpleGrid, Text, Image, Flex, Badge, Button } from '@chakra-ui/react'
import DetailView from '@/components/maintenance/DetailView/DetailView'

const ListBookCarView = () => {
    const [selectedTokenId, setSelectedTokenId] = useState(null);
    const { idsToken, tokens } = useCarMaintenanceBook()
    const copyToClipboard = (address) => navigator.clipboard.writeText(address);
    const selectedToken = tokens.find((token) => token.id === selectedTokenId);
  
    const handleCardClick = (tokenId) => {
        setSelectedTokenId(tokenId);
    };
    
    const handleCloseDetails = () => {
        setSelectedTokenId(null);
    };
    
    return (
        <>
            <SimpleGrid columns={2} spacing={4} margin={4}>
                {tokens.map((token) => (
                    <Box key={token.id} borderWidth="1px" borderRadius="lg" overflow="hidden" onClick={() => handleCardClick(token.id)}>
                        <Image src={token.image} alt={`Car ${token.id}`} maxWidth='250px' loading="lazy" />

                        <Box p="6">
                            <Flex align="baseline">
                                <Badge borderRadius="full" px="2" colorScheme="teal">
                                    {token.brand}
                                </Badge>
                                <Text
                                    ml={2}
                                    textTransform="uppercase"
                                    fontSize="sm"
                                    fontWeight="bold"
                                    color="teal.800"
                                >
                                    {token.model}
                                </Text>
                            </Flex>

                            <Box>
                                <Text mt={2} color="gray.600">
                                    ID: {token.id.toString()}
                                    <Button
                                        marginLeft="0.25rem"
                                        size="xs"
                                        colorScheme="gray"
                                        variant="ghost"
                                        onClick={() => copyToClipboard(token.id.toString())}
                                    >
                                        <CopyIcon />
                                    </Button>
                                </Text>
                            </Box>

                            <Box>
                                <Text mt={2} color="gray.600">
                                    Owner: {token.owner}
                                    <Button
                                        marginLeft="0.25rem"
                                        size="xs"
                                        colorScheme="gray"
                                        variant="ghost"
                                        onClick={() => copyToClipboard(token.owner)}
                                    >
                                        <CopyIcon />
                                    </Button>
                                </Text>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </SimpleGrid>

            {selectedToken && (
                <DetailView selectedToken={selectedToken} onClose={handleCloseDetails} />
            )}
        </>
    )
}

export default ListBookCarView
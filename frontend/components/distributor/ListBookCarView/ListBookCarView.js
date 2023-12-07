"use client"
// REACT
import {useState} from 'react'
// CONTEXT
import useCarMaintenanceBook from '@/hooks/useCarMaintenanceBook'
// Chackra UI
import { CopyIcon } from '@chakra-ui/icons'
import {Box, SimpleGrid, Text, Image, Flex, Badge, Button, Center} from '@chakra-ui/react'
//COMPONENT
import DetailView from '@/components/maintenance/DetailView/DetailView'

const ListBookCarView = ({setActivePath, onSelectedTokenChange}) => {
    const [selectedTokenId, setSelectedTokenId] = useState(null);
    const { idsToken, tokens } = useCarMaintenanceBook()
    const copyToClipboard = (address) => navigator.clipboard.writeText(address);
    const selectedToken = tokens.find((token) => token.id === selectedTokenId);

    const handleCardClick = (tokenId) => {
        setSelectedTokenId(tokenId);
        onSelectedTokenChange && onSelectedTokenChange(tokenId);
    };
    
    const handleCloseDetails = () => {
        setSelectedTokenId(null);
    };

    const handleSetActivePath = () => {
        setActivePath('add-maintenance-by-detailview');
    };

    const handleSetPathTransfer = () => {
        setActivePath('transfer-book-idToken');
    };
    
    return (
        <>
            {selectedTokenId ? (
                <DetailView selectedToken={selectedToken} onClose={handleCloseDetails} setActivePath={handleSetActivePath} setPathTransfer={handleSetPathTransfer} />
            ) : (
                (tokens.length > 0) ? (
                    <SimpleGrid columns={2} spacing={4} margin={4}>
                        {tokens.map((token) => (
                            <Box key={token.id} borderWidth="1px" borderRadius="lg">
                                <Box onClick={() => handleCardClick(token.id)}  cursor="pointer">
                                    <Image src={token.image} alt={`Car ${token.id}`} maxWidth='250px' loading="lazy" />
                                </Box>
                                <Box p="6">
                                    <Box onClick={() => handleCardClick(token.id)}  cursor="pointer">
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
                                    </Box>
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
                                            Propriétaire: {token.owner}
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
                ) : (
                    <>
                        <Center>
                            <Text>Aucun carnet</Text>
                        </Center>
                    </>
                )

            )}
        </>
    )
}

export default ListBookCarView

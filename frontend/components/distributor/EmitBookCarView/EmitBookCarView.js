"use client"
require('dotenv').config();
// main.mjs
import { useState } from 'react'
import { Flex, Box, Heading, Input, Select, Text, Button,useToast } from '@chakra-ui/react';
//Constants information SmartContract
import { contractAbiCarMaintenanceBook, contractAddressCarMaintenanceBook } from '@/constants/index'
// Wagmi
import { readContract, prepareWriteContract, writeContract,waitForTransaction } from '@wagmi/core'
// Viem
import { ContractFunctionExecutionError } from 'viem'
import { NFTStorage, File, Blob } from 'nft.storage'

const EmitBookCarView = () => {
    const carBrands = ['Toyota', 'Honda', 'Suzuki', 'Ford', 'Chevrolet', 'Nissan', 'Volkswagen', 'Mercedes-Benz', 'BMW', 'Audi', 'Tesla'];
    const [ownerAddres, setOwnerAddress] = useState('');
    const [carPhoto, setCarPhoto] = useState('');
    const [vin, setVin] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [carModel, setCarModel] = useState('');
    const [idToken, setIdToken] = useState(null);
    const [tokenUri, setTokenUri] = useState('');
    // Toasts
    const toast = useToast()

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Convertir le fichier en une URL de données pour l'affichage de l'image
            const reader = new FileReader();
            reader.onloadend = () => {
                setCarPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetFrom = async () => {
        setOwnerAddress('')
        setCarPhoto('')
        setVin('')
        setSelectedBrand('')
        setCarModel('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ajoutez ici la logique pour traiter les données du formulaire
        console.log('Données du formulaire :', { ownerAddres, carPhoto, vin, selectedBrand, carModel });
        try {
            const [idToken, tokenUri] = await Promise.all([generateIdToken(), storeNFT()]);
            await emitNft(idToken, tokenUri)
        } catch (error) {
            // Handle errors from generateIdToken, storeNFT, or emitNft
            console.error('Error during form submission:', error);
        }
    };

    const getImage = async () => {
        const blob = dataURLtoBlob(carPhoto);
        console.log(blob)
        return new File([blob], idToken, { type: blob.type });
    };
    
    // Helper function to convert data URL to Blob
    const dataURLtoBlob = (dataURL) => {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const byteString = atob(arr[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }
        return new Blob([arrayBuffer], { type: mime });
    };

    const storeNFT = async () => {
        try {
            const imageNft = await getImage()
            console.log(imageNft)
            const nft = {
                image: imageNft,
                name: "NFT AutoChain Ledger",
                description: "This NFT is the identification book on the blockchain",
                properties: {
                brand: selectedBrand,
                model: carModel,
                authors: [{ name: "Autochain Ledger" }],
                }
            }
            const clientNftStorage = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFTSTORAGE_API_KEY })
            const metadata = await clientNftStorage.store(nft)
            console.log('NFT data stored!')
            setTokenUri(metadata.url)
            return metadata.url;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    const generateIdToken = async () => {
        try {
            const tokenId = await readContract({
                address: contractAddressCarMaintenanceBook,
                abi: contractAbiCarMaintenanceBook,
                functionName: "generateTokenId",
                args: [vin]
            });
            console.log(tokenId)
            setIdToken(tokenId)
            return tokenId;
        } catch (err) {
            console.log(err)
        }
    }

    const emitNft = async (idToken, tokenUri) => {
        console.log(`args : ${ownerAddres}, ${idToken}, ${tokenUri}`)
        try {
            const { request } = await prepareWriteContract({
                address: contractAddressCarMaintenanceBook,
                abi: contractAbiCarMaintenanceBook,
                functionName: "safeMint",
                args: [ownerAddres, idToken, tokenUri]
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
                description: "You have emit a NFT Car Book !",
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


    return (
        <>
            <Flex align="center" justify="center" margin={4}>
                <Box width="100%" p="4" borderWidth="1px" borderRadius="lg" boxShadow="lg">
                    <Heading mb="4">Formulaire de Réservation de Véhicule</Heading>
                    <Flex align="center" justify="end" margin={4}>
                        <Box justify="" m={2}>
                            <Button  colorScheme="teal" onClick={() => resetFrom()}>
                                Annuler
                            </Button>
                        </Box>
                    </Flex>
                    <form onSubmit={handleSubmit}>
                        <Box mb="4">
                            <Text mb="2">Address wallet : </Text>
                            <Input
                                type="text"
                                placeholder="0x000000000000000000000"
                                value={ownerAddres}
                                onChange={(e) => setOwnerAddress(e.target.value)}
                            />
                        </Box>
                        <Box mb="4">
                            <Text mb="2">Photo du Véhicule :</Text>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {carPhoto && <img src={carPhoto} alt="Car" style={{ marginTop: '10px', maxWidth: '100%' }} />}

                        </Box>
                        <Box mb="4">
                            <Text mb="2">VIN (Numéro d'Identification du Véhicule) :</Text>
                            <Input
                                type="text"
                                placeholder="VIN du véhicule"
                                value={vin}
                                onChange={(e) => setVin(e.target.value)}
                            />
                        </Box>
                        <Box mb="4">
                            <Text mb="2">Marque du Véhicule :</Text>
                            <Select
                                placeholder="Sélectionnez la marque"
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                            >
                                {carBrands.map((brand) => (
                                    <option key={brand} value={brand}>
                                        {brand}
                                    </option>
                                ))}
                            </Select>
                        </Box>
                        <Box mb="4">
                            <Text mb="2">Modèle/Gamme du Véhicule :</Text>
                            <Input
                                type="text"
                                placeholder="Modèle ou gamme du véhicule"
                                value={carModel}
                                onChange={(e) => setCarModel(e.target.value)}
                            />
                        </Box>
                        <Button type="submit" colorScheme="teal">
                            Envoyer
                        </Button>
                        
                    </form>
                </Box>
            </Flex>
        </>
    )
}

export default EmitBookCarView
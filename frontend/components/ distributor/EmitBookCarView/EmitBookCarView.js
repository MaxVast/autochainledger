"use client"
import {useEffect, useState} from 'react'
import { Flex, Box, Heading, Input, Select, Text, Button } from '@chakra-ui/react';

const EmitBookCarView = () => {
    const carBrands = ['Toyota', 'Honda', 'Suzuki', 'Ford', 'Chevrolet', 'Nissan', 'Volkswagen', 'Mercedes-Benz', 'BMW', 'Audi', 'Tesla'];
    const [ownerAddres, setOwnerAddress] = useState('');
    const [carPhoto, setCarPhoto] = useState('');
    const [vin, setVin] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [carModel, setCarModel] = useState('');

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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Ajoutez ici la logique pour traiter les données du formulaire
        console.log('Données du formulaire :', { ownerAddres, carPhoto, vin, selectedBrand, carModel });
    };


    return (
        <>
            <Flex align="center" justify="center">
                <Box width="100%" p="4" borderWidth="1px" borderRadius="lg" boxShadow="lg">
                    <Heading mb="4">Formulaire de Réservation de Véhicule</Heading>
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
"use client"
import React from 'react'
import Navigation from '../Navigation/Navigation'
import { Flex, Heading } from '@chakra-ui/react'
import { useRouter } from 'next/router';

const DistributorView = () => {
  const router = useRouter();
  // Vérifiez la route actuelle et déterminez le contenu à afficher
  if (router.pathname === '/profile') {
    content = <Text>Contenu du profil</Text>;
  } else {
    content = <Heading size="xl">Distributor connected</Heading>;
  }
  return (
    <>
        <Flex direction="column" width='100%'>
            <Navigation />
            <Flex width='90%' ml="250px" p="4"> {}
                <Heading size="xl">Distributor connected</Heading>
            </Flex>
        </Flex>
    </>
  )
}

export default DistributorView
"use client"
import React from 'react'
import Navigation from '../Navigation/Navigation'
import { Flex, Heading } from '@chakra-ui/react'

const DistributorView = () => {
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
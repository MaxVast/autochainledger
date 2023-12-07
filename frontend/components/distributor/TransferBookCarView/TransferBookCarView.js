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
const TransferBookCar = ({selectedToken}) => {

}

export default TransferBookCar
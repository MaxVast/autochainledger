"use client"
const cors = require("cors");

import { ChakraProvider } from '@chakra-ui/react'

import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from '@wagmi/core/providers/infura';
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { hardhat, sepolia } from 'wagmi/chains';
import {CarMaintenanceBookContextProvider} from "@/contexts/CarMaintenanceBook.context";

const { chains, publicClient } = configureChains(
    [/*sepolia,*/ hardhat],
    [/*alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),*/ publicProvider()]
);

const { connectors } = getDefaultWallets({
    appName: 'AutoChain-ledger',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID,
    chains
});

const wagmiConfig = createConfig({
    autoConnect: false,
    connectors,
    publicClient
})

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <WagmiConfig config={wagmiConfig}>
                    <RainbowKitProvider chains={chains}>
                        <CarMaintenanceBookContextProvider>
                            <ChakraProvider>
                                {children}
                            </ChakraProvider>
                        </CarMaintenanceBookContextProvider>
                    </RainbowKitProvider>
                </WagmiConfig>
            </body>
        </html>
    )
}

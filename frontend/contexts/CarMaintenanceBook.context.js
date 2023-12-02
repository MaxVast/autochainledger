"use client"

require('dotenv').config();

import {useState, useEffect, useReducer, createContext} from 'react';
import { readContract, watchContractEvent  } from '@wagmi/core'
import { usePublicClient, useAccount } from 'wagmi';
import CarMaintenanceBookReducer, { CARMAINTENANCEBOOK_EVENTS_UPDATE_ACTION, CARMAINTENANCEBOOK_USER_CHANGES } from "@/contexts/CarMaintenanceBook.reducer";

import { contractAbiCarMaintenanceBook, contractAddressCarMaintenanceBook, contractAbiCarMaintenanceLoyalty, contractAddressCarMaintenanceLoyalty } from '@/constants/index'

const CarMaintenanceBookContext = createContext(null)

export default CarMaintenanceBookContext;

const CarMaintenanceBookContextProvider = ({children}) => {
    // Viem
    const viemPublicClient = usePublicClient();

    /* Context state */

    // user related informations states
    const { address, isConnected } = useAccount();
    const [ isOwner, setIsOwner ] = useState(false);
    const [ ownerAddress, setOwnerAddress ] = useState('');
    const [ tokens, setTokens ] = useState([]);

    const [ state, dispatchFromEventsAction ] = useReducer(CarMaintenanceBookReducer, {
        distributorAddress: [],
        isDistributor: false,
        vehicleOwnerAddress: [],
        isVehicleOwner: false,
        idsToken: [],
    });

    // Function to listen all Events of Smart Contract
    const listenToAllEvents = async () => {
        try {
            console.log(process.env.NEXT_PUBLIC_BLOCK_NUMBER)
            const allEvents = await viemPublicClient.getContractEvents({
                address: contractAddressCarMaintenanceBook,
                abi: contractAbiCarMaintenanceBook,
                fromBlock: BigInt(process.env.NEXT_PUBLIC_BLOCK_NUMBER),
                toBlock: 'latest'
            });

            // Set the state with the Event get
            dispatchFromEventsAction({
                type: CARMAINTENANCEBOOK_EVENTS_UPDATE_ACTION,
                payload: { userAddress: address, logs: allEvents }
            });
        } catch (error) {
            console.error("Error fetching events :", error);
        }

        // Écoutez en continu les nouveaux événements
        const eventListener = watchContractEvent(
            {
                abi: contractAbiCarMaintenanceBook,
                address: contractAddressCarMaintenanceBook,
                eventName: 'allEvents',
            },
            (logs) => {
                // Set the state with the new Event
                console.log(logs)
                dispatchFromEventsAction({
                    type: CARMAINTENANCEBOOK_EVENTS_UPDATE_ACTION,
                    payload: { userAddress: address, logs }
                });
            },
        );

        // Return the listener when the components is break
        return () => eventListener.stop();
    };

    // Verify is the connected user is the admin
    const isUserTheOwner = async () => {
        const owner = await readContract({
            address: contractAddressCarMaintenanceBook,
            abi: contractAbiCarMaintenanceBook,
            functionName: 'owner',
        });
        setOwnerAddress(owner);
        setIsOwner(address === owner);
    }

     // Fetch unfetched token Nft details
     const fetchDetailedNfts = async () => {
        
        if (!state.isDistributor) return;

        if (state.idsToken.length <= 0) return;
    
        const unfetchedTokenIds = state.idsToken;

        if (unfetchedTokenIds.length <= 0) return;

        const fetchedTokens = [];
    
        for(let ID of unfetchedTokenIds) {
            if(BigInt(ID) != 0) {
                try {
                    const fetchedToken = await readContract({
                        address: contractAddressCarMaintenanceBook,
                        abi: contractAbiCarMaintenanceBook,
                        functionName: 'tokenURI',
                        args: [BigInt(ID)]
                    });

                    const ownerToken = await readContract({
                        address: contractAddressCarMaintenanceBook,
                        abi: contractAbiCarMaintenanceBook,
                        functionName: 'ownerOf',
                        args: [BigInt(ID)]
                    });
            
                    const tokenURI = fetchedToken.slice(7)
                    const newUriToken = 'https://ipfs.io/ipfs/'+tokenURI
                    const response = await fetch(newUriToken)
                    if (!response.ok) {
                        if (response.status === 504) {
                            console.error('504 Gateway Timeout Error');
                        } else {
                            console.error('Error fetching data:', response.statusText);
                        }
                        continue; // Skip to the next iteration
                    } else {
                        const result = await response.json()
                        let linkImage = result.image.slice(7)
                        let newUriImage = 'https://ipfs.io/ipfs/'+linkImage
                
                        fetchedTokens.push({
                            id: ID,
                            owner: ownerToken,
                            brand: result.properties.brand,
                            model: result.properties.model,
                            image: newUriImage
                        });
                    }
                } catch (error) {
                    console.error('Error fetching data:', error.message);
                }
            }
          
        }
        setTokens([...fetchedTokens]);
    }

    useEffect(() => {

        if (!state.isDistributor) return;
        if (state.idsToken.length > 0) fetchDetailedNfts();

    }, [state.isDistributor]);

    useEffect(() => {

        if (!state.isDistributor) return;
        if (state.idsToken.length > 0) fetchDetailedNfts();

    }, [state.idsToken]);

    useEffect(() => {

        if (!state.isDistributor) return;
        fetchDetailedNfts();
    }, [state.isDistributor]);

    // When the user connection state or address changes checks if the user is the admin or not
    useEffect( () => {
        if (isConnected) { // If the user is connected
            // checks if the connected user is the admin
            isUserTheOwner();
            // fetch past events and start watching for all new incoming events
            listenToAllEvents();
            // ask the reducer to update the state as the user has changed
            dispatchFromEventsAction({
                type: CARMAINTENANCEBOOK_USER_CHANGES,
                payload: {
                    isUserConnected: isConnected,
                    userAddress: address
                }
            });
        } else { // If no user is connected, there is no admin here
            setIsOwner(false);
        }
    }, [isConnected, address]);
    useEffect(() => {
        if (isConnected) {
            isUserTheOwner();
            dispatchFromEventsAction({
                type: CARMAINTENANCEBOOK_USER_CHANGES,
                payload: {
                    isUserConnected: isConnected,
                    userAddress: address
                }
            });
        } else {
            setIsOwner(false);
        }
    }, [])
    // Return the context provider element with its updated state
    return (

        <CarMaintenanceBookContext.Provider value={{
            isUserConnected: isConnected,
            userAddress: address,
            //Owner
            ownerAddress: ownerAddress,
            isUserOwner: isOwner,
            //Distributor
            distributorAddress: state.distributorAddress,
            distributorCount: state.distributorAddress.length,
            isDistributor: state.isDistributor,
            //Vehicle Owner
            vehicleOwnerAddress: state.vehicleOwnerAddress,
            isVehicleOwner: state.isVehicleOwner,
            //ID TOKEN NFT
            idsToken: state.idsToken,
            tokens: tokens
        }}>
            { children }
        </CarMaintenanceBookContext.Provider>
    )
}

export { CarMaintenanceBookContextProvider }

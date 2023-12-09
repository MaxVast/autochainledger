## Autochain Ledger

## Pour correction :

Lien vidéo: [Vidéo démo  ]() <br/>
Lien Déploiement: [LINK  ]() <br/>
Déployé sur sépolia : <br/>
[CarMaintenanceLoyalty](https://sepolia.etherscan.io/address/0xa9dFFD8e576ea282821e762066df53ee71d3e411#code)<br/>
[CarMaintenanceBook](https://sepolia.etherscan.io/address/0x1DfaaaEc2A1d7bD7759BBB7E726263F061F7eaF4)

Developpé par :  
Maxence VAST : 0xe79B2cc4c07dB560f8e1eE63ed407DD2DCFdE80e

## Détails

### Contract
Le contrat CarMaintenanceBook est un contrat ERC721 basé sur OpenZeppelin, permettant de créer et gérer des NFT (carnet d’entretient) représentant des historiques d'entretien de véhicules. Les distributeurs peuvent créer, transférer, et déverrouiller ces NFT. 

Le contrat CarMaintenanceLoyalty est un ERC20 gérant un programme de fidélité de tokens pour l'entretien de véhicules. Les administrateurs peuvent créditer et livrer des tokens aux utilisateurs, et les utilisateurs peuvent accumuler des tokens en fonction de leurs actions. Les tokens peuvent être crédités à un pool de récompenses et livrés aux utilisateurs. Le contrat offre une fonctionnalité de gestion des administrateurs pour ajouter ou supprimer des privilèges administratifs.

Le contrat d'interface IERC5192 définit des événements et des fonctions pour gérer l'état de verrouillage des Soulbound Tokens (SBT). Les événements "Locked" et "Unlocked" sont émis lorsqu'un SBT est verrouillé ou déverrouillé, respectivement. La fonction "locked" permet de vérifier l'état de verrouillage d'un SBT en fonction de son identifiant.

### Front
Voici la liste de la stack utilisée pour la réalisation du projet.
- Rainbow Kit
- Wagmi
- Viem
- NextJs
- Chakra UI
  <br/><br/>

### Back/Smart Contract
Voici la liste de la stack utilisée pour la partie Smart Contract.
- Hardhat

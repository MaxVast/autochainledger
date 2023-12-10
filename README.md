## Autochain Ledger

## Pour correction :

#### Lien vidéo: [Vidéo démo  ](https://www.loom.com/share/deb498097f844b4ea188aeb4b98bb89b?sid=184f92b4-06e8-4699-9347-40e25abd1871) <br/>
On ne voit pas Metamask, je ne sais pas pourquoi.<br/>
J'ai eu lors de la vidéo une erreur sur une transaction qui est lié au problème de cache de Metamask.<br/>
#### Lien Déploiement Vercel: [LINK  ](https://autochain-ledger.vercel.app/) <br/>
#### Déployé sur sépolia : <br/>
[CarMaintenanceLoyalty](https://sepolia.etherscan.io/address/0xa9dFFD8e576ea282821e762066df53ee71d3e411#code)<br/>
[CarMaintenanceBook](https://sepolia.etherscan.io/address/0x1DfaaaEc2A1d7bD7759BBB7E726263F061F7eaF4#code)

Developpé et déployé par :  
Maxence VAST : 0xe79B2cc4c07dB560f8e1eE63ed407DD2DCFdE80e

## Détails

### Contract
Le contrat CarMaintenanceBook est un contrat ERC721, permettant de créer et gérer des NFT (carnet d’entretient), il permet de renseigner d'entretien de véhicules rattacher à l’ID du NFT, ceci représente l’historique d’entretien des véhicules. Les distributeurs peuvent créer, transférer, et déverrouiller ces NFT. 

Le contrat CarMaintenanceLoyalty est un ERC20 gérant un programme de fidélité de tokens pour l'entretien de véhicules. Les administrateurs peuvent créditer et livrer des tokens aux utilisateurs, et les utilisateurs peuvent accumuler des tokens en fonction de leurs actions. Les tokens peuvent être crédités à un pool de récompenses et livrés aux utilisateurs. Le contrat offre une fonctionnalité de gestion des administrateurs pour ajouter ou supprimer des privilèges administratifs.

Le contrat d'interface IERC5192 définit des événements et des fonctions pour gérer l'état de verrouillage des Soulbound Tokens (SBT). Les événements "Locked" et "Unlocked" sont émis lorsqu'un SBT est verrouillé ou déverrouillé, respectivement. La fonction "locked" permet de vérifier l'état de verrouillage d'un SBT en fonction de son identifiant.

### Test

Tous les smart contracts ont une couverture de 100% pour les lignes, les branches, les fonctions et les instructions.

| File                        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines |
|-----------------------------|---------|----------|---------|---------|-----------------|
| contracts/                  |  100    |  100     |  100    |  100    |                 |
|  CarMaintenanceBook.sol     |  100    |  100     |  100    |  100    |                 |
|  CarMaintenanceLoyalty.sol  |  100    |  100     |  100    |  100    |                 |
|  IERC5192.sol               |  100    |  100     |  100    |  100    |                 |
|-----------------------------|---------|----------|---------|---------|-----------------|
| All files                   |  100    |  100     |  100    |  100    |                 |
|-----------------------------|---------|----------|---------|---------|-----------------|


### Front
Voici la liste de la stack utilisée pour la réalisation du projet.
- Rainbow Kit
- Wagmi
- Viem
- NextJs
- Chakra UI
- NFT STORAGE
  <br/><br/>

### Back/Smart Contract
Voici la liste de la stack utilisée pour la partie Smart Contract.
- Hardhat
- ERC721
- IERC5192
- ERC20
- Librairie OpenZeppelin
<br/><br/>

### Image Front
<img src="https://cdn.discordapp.com/attachments/369933291916361728/1183361726293475411/autochain-ledger.png" alt="homepage autochain Ledger" width="650" height="auto" loading="lazy" />

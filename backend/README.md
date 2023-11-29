# Contrats Intelligents pour la Gestion de la Maintenance Automobile

Ce référentiel contient deux contrats intelligents (smart contracts) écrits en Solidity pour la gestion de la maintenance automobile.

## CarMaintenanceBook.sol

Le contrat `CarMaintenanceBook` est un contrat ERC721 qui permet de délivrer des NFT (Jetons Non Fongibles) représentant la propriété d'un véhicule et de consigner les différents entretiens associés à chaque NFT. Les fonctionnalités principales comprennent :

- Création et transfert de NFT représentant la propriété d'un véhicule.
- Enregistrement d'entretiens associés à chaque NFT.
- Verrouillage et déverrouillage des NFT.
- Récompenses en jetons ERC20 pour les actions liées à la maintenance.

## CarMaintenanceLoyalty.sol

Le contrat `CarMaintenanceLoyalty` est un contrat ERC20 qui gère une cagnotte de fidélité associée aux NFT émis par le contrat `CarMaintenanceBook`. Les fonctionnalités principales comprennent :

- Création et distribution de jetons ERC20 représentant la fidélité pour les NFT.
- Attribution d'administrateurs autorisés à gérer la cagnotte.
- Fonctions pour créditer et réclamer des récompenses à partir de la cagnotte.

## Couverture du Code

```shell
npx hardhat test
nx hardhat coverage
REPORT_GAS=true npx hardhat test
```
Le tableau suivant présente le pourcentage de couverture du code pour chaque fichier dans le répertoire `contracts/`. Tous les fichiers ont une couverture de 100% pour les lignes, les branches, les fonctions et les instructions.

| File                        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines |
|-----------------------------|---------|----------|---------|---------|-----------------|
| contracts/                  |  100    |  100     |  100    |  100    |                 |
|  CarMaintenanceBook.sol     |  100    |  100     |  100    |  100    |                 |
|  CarMaintenanceLoyalty.sol  |  100    |  100     |  100    |  100    |                 |
|  IERC5192.sol               |  100    |  100     |  100    |  100    |                 |
|-----------------------------|---------|----------|---------|---------|-----------------|
| All files                   |  100    |  100     |  100    |  100    |                 |
|-----------------------------|---------|----------|---------|---------|-----------------|

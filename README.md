# Billed - Application de gestion de notes de frais

Billed est une application de gestion de notes de frais qui permet aux utilisateurs (administrateurs RH et employés) de soumettre et gérer les notes de frais.

## Architecture du projet

Ce projet est divisé en deux parties : le frontend et le backend.

### Backend

Le projet backend est responsable de fournir l'API nécessaire au fonctionnement de l'application. Il est hébergé dans le référentiel suivant : [Billed-app-FR-Back](https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Back)

### Frontend

Le projet frontend est la partie de l'application visible par les utilisateurs. Il est responsable de l'interface utilisateur et se connecte à l'API backend pour récupérer et soumettre des données. Le frontend est hébergé dans le référentiel suivant : [Billed-app-FR-Front](https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Front)

## Comment utiliser l'application en local ?

Il vous faut dans un premier temps cloner ce repository. Pour cela vous pouvez créer un dossier "bill-app" par exemple et y cloner le projet : [Billed-app] (https://github.com/NairodP/P9-Billed.git)

## Comment lancer l'application en local ?

### Étape 1 - Lancer le backend

**Utliser une version de node compatible.**

Si vous utilisez une version récente de node sur votre ordinateur, il se peut qu'il y ai des erreurs lors de l'installation de certaines dépendances. Pour cela il est important de vous assurer que vous ayez une version de node compatible par exemple node v16 ou v18. 

Voici quelques indications pour gérer les version de node sur votre ordinateur: 

#### Sur Windows
- Installer NVM pour windows (https://github.com/coreybutler/nvm-windows/tags)
- changer la version de node pour une version compatible (par exemple 18.16.1) pous cela suivre les instruction de NVM pour windows : 
    - `nvm install 18.16.1`
    - `nvm use 18.16.1`
- Ouvrir Powershell en mode administrateur
- Entrer la commande «  Set-ExecutionPolicy RemoteSigned » pour pouvoir gérer l’execution de scripts dans powershell
- Fermer toutes les instances de terminal
- entrer la commande `npm install -g win-node-env` pour installer la gestion des variables d’environnement node pour window

#### Sur Mac
- Installer NVM (Node Version Manager) - https://github.com/nvm-sh/nvm
- changer la version de node pour une version compatible (par exemple 18.16.1) pous cela suivre les instruction de NVM: 
    - `nvm install 18.16.1`
    - `nvm use 18.16.1`

#### Acceder au repertoire Backend du projet :

```
cd Billed-app-FR-Back
```

#### Installer les dépendances du projet :

```
npm install
```

#### Lancer l'API :

```
npm run run:dev
```

#### Accéder à l'API :

L'api est accessible sur le port `5678` en local, c'est à dire `http://localhost:5678`

### Étape 2 - Lancer le frontend

#### Acceder au repertoire Frontend du projet :

```
cd Billed-app-FR-Front
```

#### Installer les dépendances du projet :

```
npm install
```

#### Installer live-server pour lancer un serveur local :

```
npm install -g live-server
```
ou dans le cas d'une demande de permission
```
sudo npm install -g live-server
```

#### Lancer l'application :

```
live-server
```

## Comment lancer tous les tests en local avec Jest ?

Pour exécuter tous les tests en local, utilisez la commande suivante :

```
npm run test
```

Si vous souhaitez exécuter un seul test, vous pouvez installer jest-cli globalement et exécuter le test souhaité :

```
npm i -g jest-cli
```
puis
```
jest src/tests/votre_fichier_de_test.js
```

### Comment voir la couverture de test ?

Après avoir exécuté les tests, vous pouvez consulter la couverture de test en visitant l'adresse suivante : http://127.0.0.1:8080/coverage/lcov-report/

### Comptes et utilisateurs

L'application Billed dispose de deux types de comptes :

#### Administrateur

- Utilisateur : ```admin@test.tld```
- Mot de passe : ```admin```

#### Employé

- Utilisateur : ```employee@test.tld```
- Mot de passe : ```employee```

Ces comptes permettent de tester différentes fonctionnalités de l'application en tant qu'administrateur ou employé.

# Hackathon TEAM ARMAGEDDON

## Setup

**Warning**

> Verify that you are running at least node 8.9.4 and npm 5.6.0 by running node -v and npm -v in a terminal/console window.

## Before starting

Please install all the prerequisites with this two sites :

https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html
https://hyperledger-fabric.readthedocs.io/en/latest/install.html

1. Install node_modules in the root folder.
 ```
 npm install
 ```

2. Install node_modules in /backend.
 ```
 npm install
 ```

## Deploy the BlockChain

1. Open terminal in /fabcar.

2. Run "./startFabric.sh".

3. If everything is ok you will see "Total setup execution time : xxx secs ...".

## Deploy the BackEnd

1. Open terminal in /backend.

2. Create the Admin, run "node enrollAdmin.js".

> If no wallet folder is present in this folder go to the next instruction, else go to 5.

3. If everything is ok you will see "Successfully enrolled admin user "admin" and imported it into the wallet".

3. Create the User, run "node registerUser.js".

4. If everything is ok you will see "Successfully registered and enrolled admin user "user1" and imported it into the wallet".

5. Run "node backendhackathon.js"

6. If everything is ok you will see "Server running on port 3000".

## Deploy the FrontEnd

1. Open terminal in the root folder.

2. Run "npm start"

3. On browser go to http://localhost:4200/

4. If you need help to use the application go to the section "AIDE".

## Bonus

1. A postman collection can be found in folder /postman.

2. Connect to the application with username and password = "Admin" (after having restister an user with the same username/password) will redirect you to an administration page where you can delete users informations.

## Maintainer/Creator

benoitdarenne@capgemini.com

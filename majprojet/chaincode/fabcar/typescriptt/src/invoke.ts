/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileSystemWallet, Gateway } from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';
import { Diploma } from './diploma';
import { Project } from './project';
import { Skill } from './skill';

const ccpPath = path.resolve(__dirname, '..', '..', '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.ts application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('smartcontract');

        // Submit the specified transaction.
        await contract.submitTransaction('createAgent', 'AGENT10', 'nametest', 'lastnametest', '01/01/2010', '0', '987654', '0', '[]', '[]', '[]', 'agent10', 'agent10');
        console.log(`Transaction has been submitted`);

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();

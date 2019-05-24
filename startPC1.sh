#!/bin/bash

cd composer
rm -rf crypto-config
./certificatesallpeers.sh
cd ..
./teardownFabric.sh && ./startFabric.sh && ./createPeerAdminCard.sh
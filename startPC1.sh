#!/bin/bash

cd composer
./certificatesallpeers.sh
cd ..
./teardownFabric.sh && ./startFabric.sh && ./createPeerAdminCard.sh
#!/bin/bash

if [ -z ${FABRIC_START_TIMEOUT+x} ]; then
 echo "FABRIC_START_TIMEOUT is unset, assuming 15 (seconds)"
 export FABRIC_START_TIMEOUT=15
else

   re='^[0-9]+$'
   if ! [[ $FABRIC_START_TIMEOUT =~ $re ]] ; then
      echo "FABRIC_START_TIMEOUT: Not a number" >&2; exit 1
   fi

 echo "FABRIC_START_TIMEOUT is set to '$FABRIC_START_TIMEOUT'"
fi

# Exit on first error, print all commands.
set -ev

# Set VERSION
VERSION=`uname -m`-1.0.4

# Grab the current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#
VERSION=$VERSION docker-compose -f "${DIR}"/composer/docker-compose.yml down
VERSION=$VERSION docker-compose -f "${DIR}"/composer/docker-compose.yml up -d

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

# Debug Error: channel create configuration tx file not found open C:/Program Files/Git/etc/hyperledger/configtx/composer-channel.tx: no such file or directory
export MSYS_NO_PATHCONV=1

# Create the channel
docker exec peer0.org1.example.com peer channel create -o orderer.example.com:7050 -c composerchannel -f /etc/hyperledger/configtx/composer-channel.tx

# Join peer0.org1.example.com to the channel.
docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel join -b composerchannel.block

# # Create the channel
docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer1.org1.example.com peer channel fetch config -o orderer.example.com:7050 -c composerchannel
# docker exec peer1.org1.example.com peer channel create -o orderer.example.com:7050 -c composerchannel -f /etc/hyperledger/configtx/composer-channel.tx

# # Join peer1.org1.example.com to the channel.
docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer1.org1.example.com peer channel join -b composerchannel_config.block

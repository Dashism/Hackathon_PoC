#!/bin/bash

# Exit on first error, print all commands.
set -ev

# Set VERSION
VERSION=latest

# Grab the current directory.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Pull and tag the latest Hyperledger Fabric base image.
docker pull hyperledger/fabric-peer:$VERSION
docker pull hyperledger/fabric-ca:$VERSION
docker pull hyperledger/fabric-ccenv:$VERSION
docker pull hyperledger/fabric-orderer:$VERSION
docker pull hyperledger/fabric-couchdb:$VERSION

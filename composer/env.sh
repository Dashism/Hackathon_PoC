#!/bin/bash

FABRIC_CA_SERVER_CA_CERTFILE=/etc/hyperledger/fabric-ca-server-config/org1.example.com-cert.pem
PK_NAME=$(basename /etc/hyperledger/fabric-ca-server-config/*_sk)
FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/"${PK_NAME}"
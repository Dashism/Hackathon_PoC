#!/bin/bash

# Exit on first error, print all commands.
set -ev

# Set VERSION
VERSION=latest

# Grab the current directorydirectory.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Shut down the Docker containers that might be currently running.
cd "${DIR}"/composer
VERSION=$VERSION docker-compose -f "${DIR}"/composer/docker-compose.yml stop

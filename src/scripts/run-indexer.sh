#!/bin/bash

# Function to validate chain name
validate_chain() {
    local input_chain=$1
    case $input_chain in
        "arbitrum-sepolia"|"sepolia"|"op-sepolia"|"polygon"|"base-sepolia")
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# Check if CHAIN env variable is set (required for production)
if [ -z "$CHAIN" ]; then
    echo "Error: CHAIN environment variable must be set"
    echo "Valid options are: arbitrum-sepolia, sepolia, op-sepolia, polygon, base-sepolia"
    exit 1
fi

# Validate the provided chain
if ! validate_chain "$CHAIN"; then
    echo "Error: Invalid chain specified in CHAIN environment variable"
    echo "Valid options are: arbitrum-sepolia, sepolia, op-sepolia, polygon, base-sepolia"
    exit 1
fi

echo "Running indexer for $CHAIN..."

# Run the TypeScript command with the selected chain
npx ts-node dist/indexer/chains/$CHAIN/USDC.js
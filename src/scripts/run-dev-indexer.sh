#!/bin/bash

# Define color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Cool banner function
print_banner() {
    echo -e "${PURPLE}"
    echo "╔════════════════════════════════════════╗"
    echo "║             CHAIN INDEXER              ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Present options to the user
print_banner
echo -e "${CYAN}${BOLD}Please select the chain to run the indexer on:${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
select chain in "arbitrum" "sepolia" "opt-sepolia" "polygon-amoy" "base-sepolia"
do
    case $chain in
        "arbitrum")
            CHAIN="arbitrum-sepolia"
            break
            ;;
        "sepolia")
            CHAIN="sepolia"
            break
            ;;
        "opt-sepolia")
            CHAIN="op-sepolia"
            break
            ;;
        "polygon-amoy")
            CHAIN="polygon"
            break
            ;;
        "base-sepolia")
            CHAIN="base-sepolia"
            break
            ;;
        *) 
            echo -e "${RED}✘ Invalid option. Please select a number from 1-5.${NC}"
            ;;
    esac
done

# Clear screen for dramatic effect
clear

# Show selection confirmation with some style
echo -e "\n${GREEN}✔ Selected chain: ${BOLD}$CHAIN${NC}"
echo -e "${BLUE}⚡ Initializing indexer...${NC}\n"

# Animated loading
for i in {1..3}; do
    echo -ne "${YELLOW}Loading${NC}"
    for j in {1..3}; do
        echo -ne "${YELLOW}.${NC}"
        sleep 0.2
    done
    echo -ne "\r\033[K"
    sleep 0.2
done

echo -e "${GREEN}${BOLD}🚀 Starting indexer for $CHAIN...${NC}\n"

# Run the TypeScript command with the selected chain
npx ts-node-dev --respawn --transpile-only src/indexer/chains/$CHAIN/USDC.ts
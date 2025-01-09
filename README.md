# Farbarter

The first on-chain P2P marketplace built on Farcaster. Farbarter enables secure trading of digital goods, services and collectibles through smart contracts and reputation-based trust.

## Core Features

- **Smart Contract Escrow**: Secure trading with automated escrow system
- **Reputation System**: Build trust through successful trades
- **Farcaster Integration**: Seamless listing creation by tagging @farbarterbot
- **Multi-Chain Payments**: Accept any token on any chain
- **Lightning Fast Listings**: No forms - just tag, price, and go live

## Tech Stack

- React 18 + TypeScript
- Vite for blazing fast builds
- TailwindCSS for styling
- @farcaster/frame-sdk for Farcaster integration
- Ponder for blockchain indexing
- IPFS/Pinata for metadata storage

## Local Development

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file with required environment variables
4. Run `npm run dev` to start the development server

## Deploying via orbiter

1. Clone the repository
2. Install dependencies with `npm run build`
3. Go to [orbiter.host](https://orbiter.host) and create a new project
4. Drag and drop the `dist` folder that was built into the orbiter project
5. Click "Deploy"
6. Once the deployment is complete, click "View" to view your deployed app

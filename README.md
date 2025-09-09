# PropChain

PropChain is a blockchain-based property marketplace that allows users to browse, favorite, and interact with property listings using their crypto wallets.

![PropChain Banner](https://placehold.co/800x200?text=PropChain+Marketplace)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Development Task](#development-task)
- [Evaluation Criteria](#evaluation-criteria)
- [Submission Guidelines](#submission-guidelines)

## Overview

PropChain combines real estate with blockchain technology, creating a decentralized marketplace for property listings. Users can connect their crypto wallets to interact with properties on the blockchain.

## Features

- Browse property listings
- View detailed property information
- Save favorite properties
- Connect crypto wallets
- User dashboard

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- TailwindCSS
- MetaMask integration

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MetaMask browser extension installed

### Installation

1. Clone the repository:

```bash
git clone https://github.com/macoaure/propchain.git
cd propchain
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

### Running the Project

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173/`

## Project Structure

```
propchain/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Layout/       # Layout components like Navbar
│   │   ├── PropertyCard/ # Property listing card
│   │   └── SearchFilters/# Filtering components
│   ├── data/            # Mock data and data utilities
│   ├── pages/           # Page components
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── public/              # Static assets
└── ...configuration files
```

## Development Task

In the existing app, there is a "Connect Wallet" button. Currently, it works as a mockup (just UI).

### Your task: Implement real functionality so that it connects to MetaMask when clicked.

When the user clicks "Connect Wallet":

- A modal should open.
- The modal should show a list of available wallets (for this test, supporting MetaMask is enough).
- On selecting MetaMask:
  - Request connection via the Ethereum provider (window.ethereum).
  - If successful, display the connected wallet address inside the modal (e.g., 0xabc...123).
  - If MetaMask is not installed, show a helpful message (e.g., "Please install MetaMask" with a link).
- Store the connected account in the app state (React context or local state).
- If the wallet is connected, the button should change from "Connect Wallet" → "0xabc...123".

### 🎯 What We're Evaluating

We are not looking for a production-ready dApp or smart contract integration. We mainly want to evaluate your blockchain integration fundamentals and code style:

- Clean, readable, and well-structured TypeScript/React code
- Proper use of async/await and error handling (e.g., user rejects connection)
- UI/UX handling (modal state, connection state, error messages)
- Code reusability and maintainability (is your wallet connection logic modular?)

### ⚙️ Technical Requirements

- Use React + TypeScript (already set up in the base project).
- Use window.ethereum API for MetaMask integration (no need for heavy libraries like Web3.js or Ethers.js unless you prefer).
- Ensure the app runs locally after your changes (npm install && npm run dev).

### 📤 Submission

- Fork/clone the provided repo.
- Implement the feature.
- Push your work to your own GitHub / GitLab / Bitbucket repository.
- Share the repository link with us.

### 🕒 Expected Time

This is a small, focused task to evaluate your Web3 integration skills + code quality. We recommend 5 hours max. Please submit as soon as possible.

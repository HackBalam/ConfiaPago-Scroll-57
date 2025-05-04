🛡️ ConfiaPago
ConfiaPago is a decentralized platform that leverages blockchain technology to facilitate secure peer-to-peer transactions between buyers and sellers who meet on external channels like Facebook Marketplace, WhatsApp, or Instagram. It acts as a smart escrow system, enabling trust without relying on traditional intermediaries.

🚀 Technologies Used
Blockchain: Scroll

Stablecoin: USDT

Frontend Stack: Next.js

Smart Contracts: Hardhat

Codebase: Scaffold-ETH 2

Authentication: Wallet-based login (MetaMask, WalletConnect, etc.)

🎯 Purpose
ConfiaPago enables secure online deals between strangers by using smart contracts, decentralized escrow, AI-assisted visual proof, and a user-centered design approach.

👥 Main Actors
Seller: Offers a product or service.

Buyer: Pays to receive the product or service.

ConfiaPago Platform: Manages contracts, escrow, and user interactions.

🔄 Transaction Flow
Initial Deal (Off-Platform): Buyer and seller agree on basic terms via social platforms.

Agreement Creation: One party initiates an agreement on ConfiaPago using a simple form.

Mutual Acceptance: The other party reviews and accepts or rejects the deal.

Escrow Deposit: Buyer deposits the agreed amount in the smart contract.

Delivery & Proof: Seller ships the item and uploads visual proof (photo/video).

Confirmation & Release: Buyer verifies the item and authorizes payment release.

Final Payment: The smart contract releases funds to the seller and a fee to ConfiaPago.

🧠 UI/UX Design Guidelines
Designed for non-technical users.

Consistent visual and interaction language.

Step-by-step guided workflow to prevent errors.

Clear interface for agreement tracking.

🛠️ Local Installation (Development)
bash
Copiar
Editar
# Clone the base repository
git clone https://github.com/scaffold-eth/scaffold-eth-2.git confiapago
cd confiapago

# Install dependencies
npm install

# Run the development server
npm run dev
Make sure Hardhat and the Scroll network (local/testnet) are properly configured to deploy smart contracts.

📂 Project Structure
pgsql
Copiar
Editar
/contracts       --> Smart contracts (Hardhat)
/app             --> Web interface (Next.js)
/public          --> Static assets
/scripts         --> Deployment scripts
🔒 Trust & Security
100% on-chain escrow handling.

Funds released only upon explicit buyer confirmation.

Visual proof as delivery evidence.

Wallet-based identity and fund control.

👤 Author
Developed by [Your Name or Team], part of the ConfiaPago initiative to empower safer peer-to-peer commerce in LATAM.

📄 License
This project is licensed under the MIT License.

Let me know if you'd like me to generate a README.md file for download.

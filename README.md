
---

# 🛡️ ConfiaPago

**ConfiaPago** is a decentralized platform that leverages blockchain technology to facilitate secure peer-to-peer transactions between buyers and sellers who meet on external channels like **Facebook Marketplace**, **WhatsApp**, or **Instagram**. It acts as a smart escrow system, enabling trust without relying on traditional intermediaries.

---

## 🚀 Technologies Used

* **Blockchain**: [Scroll](https://scroll.io/)
* **Frontend Stack**: [Next.js](https://nextjs.org/)
* **Smart Contracts**: [Hardhat](https://hardhat.org/)
* **Codebase**: [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2)
* **Authentication**: Wallet-based login (MetaMask, WalletConnect, etc.)

---

## 🎯 Purpose

ConfiaPago enables secure online deals between strangers by using:

* ✅ Smart contracts
* 🔐 Decentralized escrow
* 🧠 AI-assisted visual proof (future roadmap)
* 👨‍💻 User-centered design approach

---

## 👤 Main Actors

* **Seller**: Offers a product or service.
* **Buyer**: Pays to receive the product or service.
* **ConfiaPago Platform**: Manages contracts, escrow, and user interactions.

---

## 🔄 Transaction Flow

1. **Initial Deal (Off-Platform)**
   Buyer and seller agree on basic terms via social platforms.

2. **Agreement Creation**
   One party initiates an agreement on ConfiaPago using a simple form.

3. **Mutual Acceptance**
   The other party reviews and accepts or rejects the deal.

4. **Escrow Deposit**
   Buyer deposits the agreed amount in the smart contract.

5. **Delivery & Proof**
   Seller ships the item and uploads visual proof (photo/video).

6. **Confirmation & Release**
   Buyer verifies the item and authorizes payment release.

7. **Final Payment**
   Smart contract releases funds to the seller and fee to ConfiaPago.

---

## 🧠 UI/UX Design Guidelines

* Designed for **non-technical** users.
* Consistent **visual and interaction language**.
* **Step-by-step** guided workflow to prevent errors.
* Clear interface for **agreement tracking**.

---

## 🛠️ Local Installation (Development)

```bash
# Clone the base repository
git clone https://github.com/scaffold-eth/scaffold-eth-2.git confiapago
cd confiapago

# Install dependencies
npm install

# Run the development server
npm run dev
```

> 💡 Make sure Hardhat and the Scroll network (local/testnet) are properly configured to deploy smart contracts.
smart contract deploy: https://sepolia.scrollscan.com/address/0x5b2f76dd2a0e5e55611ffbdd2bb5c3cb68d0db9d
---

## 📂 Project Structure

```
/contracts       --> Smart contracts (Hardhat)
/app             --> Web interface (Next.js)
/public          --> Static assets
/scripts         --> Deployment scripts
```

---

## 🔒 Trust & Security

* 💯 100% on-chain escrow handling.
* 🔐 Funds released only upon **explicit buyer confirmation**.
* 📸 Visual proof as delivery evidence.
* 👛 Wallet-based identity and fund control.

---

## 👤 Author

Developed by **Vianey Alvarez Alvarado and Daniel Bustamante Lagart**, part of the ConfiaPago initiative to empower safer peer-to-peer commerce in **LATAM**.

---

## 📄 License

This project is licensed under the **MIT License**.

---


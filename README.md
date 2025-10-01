# Sentinel 🔐

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Solana](https://img.shields.io/badge/Solana-3C3C3D?style=flat&logo=solana&logoColor=white)](https://solana.com/)

**Sentinel: Real-time Solana Transaction Security & Trust Verification**

Sentinel is a comprehensive security platform that protects users from malicious Solana transactions, scams, and suspicious dApps through real-time AI-powered analysis and community-driven trust ratings.

## ✨ Features

- **🛡️ Transaction Security Scanner** - Real-time analysis of Solana transactions before signing
- **🚨 Malicious dApp Detection** - AI-powered identification of suspicious decentralized applications
- **📊 Trust Scoring** - Community-driven trust ratings for Solana programs and tokens
- **🔍 Smart Contract Audit** - Automated ce analysis of Solana programs
- **👥 Crowdsourced Intelligence** - Community reports and scam alerts
- **🤖 AI-Powered Analysis** - Gemini AI integration for advanced threat detection
- **⚡ Real-time Protection** - Instant warnings for dangerous transactions
- **📱 Browser Extension** - Seamless integration with Solana wallets

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Blockchain**: Solana Web3.js, @solana/wallet-adapter
- **AI/ML**: Google Gemini AI for threat analysis
- **Data**: Helius RPC endpoints for Solana data
- **Caching**: Redis for real-time data
- **Database**: PostgreSQL with Prisma
- **Authentication**: NextAuth.js

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Solana CLI tools
- Helius API account
- Google Gemini AI API key

### Installation

1. **Clone & Install**

```bash
git clone https://github.com/your-username/sentinel.git
cd sentinel
npm install
```

2. **Environment Setup**

```bash
cp .env.example .env.local
```

3. **Configure Environment**

```bash
# Solana
HELIUS_API_KEY=your_helius_api_key_here

# AI Analysis
GEMINI_API_KEY=your_gemini_api_key_here

# Redis for caching
REDIS_URL=your_redis_url
REDIS_PASSWORD=your_redis_password
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port

```

4. **Run Development Server**

```bash
npm run dev
```

## 📦 Project Structure

```bash
sentinel/
├── app/                    # Next.js app router
│   ├── analyse/           # Transaction Analyser
                ├── page.tsx           # Token analyser page
│   ├── page.tsx         # Home dashboard
│   └── api/               # API routes
├── components/
│   ├── custom-ui/          # custom-ui components
│   ├── hero/            # components for home hero section
│   └── ui/                # UI components
├── lib/
│   ├── aiservice.ts            # Ai service funtions
│   ├── redisclient.ts             # Caching layer
│   ├── utils           # Solana utilities
└── types.d.ts                 # TypeScript definitions
```

## 🤝 Contributing

We welcome security researchers, Solana developers, and community members to help make Solana safer for everyone.

See [CONTRIBUTING.md](/.github/CONTRIBUTING.md) for details.

### 🛡️ Security Focus Areas

- Transaction Monitoring: Real-time analysis of transaction instructions(coming soon...)
- Program Verification: Security scoring of Solana programs
- Phishing Detection: Malicious website and dApp identification(coming soon...)
- Rug Pull Prevention: Token and liquidity pool analysis
- Community Alerts: Real-time scam warnings and reports

### 📞 Support(Coming Soon...)

- Security Reports: coming soon...
- Documentation: coming soon...
- Twitter: coming soon...
- Discord: Join our Security Community (coming soon...)

### 📄 License

MIT License - see [LICENSE](LICENSE.md) for details.

### Protecting the Solana Ecosystem, One Transaction at a Time 🛡️


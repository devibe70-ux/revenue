# 🏛️ Core System Architecture & Complete Product Specification: Unified Revenue Dashboard

**Role Assignment for Antigravity:** Senior Full-Stack Engineer, System Architect, and Windows Cross-Platform Developer.
**Objective:** Build, optimize, secure, and deploy a multi-tenant cross-platform financial aggregation engine based on this document. Execute this entire specification without requiring further conceptual inputs or architectural iterations.

---

## 1. Project & Platform Architecture

### 1.1 Core Value Proposition
A unified financial intelligence dashboard that aggregates real-time earnings, payouts, and performance metrics for digital creators and multi-channel e-commerce sellers into a single unified workspace.

### 1.2 Multi-Platform Target Distribution
* **Mobile App:** Target compilation for iOS (`.ipa`) & Android (`.aab`) distributed through the Apple App Store and Google Play Store using Expo/React Native.
* **Web Dashboard:** Responsive Single Page Application (SPA) deployed across global edge networks/CDNs.
* **Windows Desktop App:** Distributed via the **Microsoft Store** by packaging the web frontend within a native **Tauri** (Rust runtime) wrapper to produce a secure, signed `.msix` / Windows installer package compliant with Windows 10/11 runtime standards.

---

## 2. API Integration Layer & Auth Protocols

The platform operates two distinct processing modules using explicit integration patterns:

### 2.1 Module A: The Creator Module
* **YouTube Studio & Google AdSense:** Integrates via Google OAuth 2.0 with read-only access scopes (`https://www.googleapis.com/auth/yt-analytics.readonly` and `https://www.googleapis.com/auth/adsense.readonly`). Ingests video ad revenue, channel memberships, premium payouts, and creator rewards.
* **Meta Business Suite:** Leverages Meta Graph API via Facebook Login for Business to capture Instagram and Facebook subscriptions, Stars, and performance bonuses.
* **TikTok Creator Rewards:** Connects via TikTok Developer Platform API endpoints to fetch monetization wallet ledger histories and live stream gift conversions.

### 2.2 Module B: The Seller Module
* **Amazon Seller Central:** Connects using the Amazon Selling Partner API (SP-API). Implements AWS IAM role delegation and LWA (Login with Amazon) OAuth tokens to fetch daily gross order values, pending fulfillment items, and structural Amazon FBA referral/closing fees.
* **Flipkart Seller Hub:** Interacts with the Flipkart Developer Platform Marketplace API to ingest settlement schedules, tax deductions, and tracking updates.
* **Meesho & Myntra:** For legacy endpoints or platforms lacking public developer REST API interfaces, build sandboxed backend Puppeteer configurations utilizing automated headless browsers to pull daily seller metrics securely, using encrypted session storage. Provide a manual `.csv` / `.xlsx` template parsing interface as a structural fallback.

---

## 3. Technology Stack Specification


```text
+-------------------------------------------------------------------------------+
|                       User Workspace (Web / Mobile / Tauri Desktop)          |
+-------------------------------------------------------------------------------+
|
| (Secure HTTPS / WSS Connections)
v
+-------------------------------------------------------------------------------+
|                        Backend API Cluster (Node.js or Python)               |
|  [ Auth Router & Crypt Vault ] <---> [ Redis Cache Layer ] <---> [ DB Layer ] |
+-------------------------------------------------------------------------------+
|                            |                        |
| (OAuth 2.0 Client Handshake) | (Amazon SP-API / IAM)  | (Headless Scraping)
v                            v                        v
+-----------------------+    +-----------------------+    +---------------------+
| YouTube & Meta APIs   |    | Amazon Seller Central |    | Regional Hubs /     |
| (AdSense Data Sync)   |    | (Order/Fee Ingestion) |    | Manual CSV Fallback |
+-----------------------+    +-----------------------+    +---------------------+
```

### 3.1 Frontend & Cross-Platform Wrapper
* **Development Framework:** TypeScript + React Native (Expo Framework Ecosystem) using React Native for Web for unified workspace rendering.
* **Windows Layer:** Tauri framework integration. Bundles compiled assets with a Rust-based system webview controller to produce lightweight, highly performant Windows desktop executable environments.
* **State & Cache Engine:** **Zustand** for predictable local client state storage paired with **@tanstack/react-query** to handle server caching, automated backoff refetching, and offline persistence.

### 3.2 Backend Platform & Data Architecture
* **Server Stack:** Node.js (TypeScript) running on **Fastify** (prioritizing high-throughput JSON mutation speeds), OR Python using **FastAPI** to facilitate structured data normalization pipelines.
* **Primary Database Engine:** **PostgreSQL** (Managed deployment using Prisma or Drizzle ORM layer to ensure strict ACID compliance for financial transaction integrity).
* **Caching & Background Workers:** **Redis** for state tracking, session management, and API rate-limiting guardrails. **BullMQ** (or Celery) acts as the primary distributed queue manager to execute background worker synchronization routines.

### 3.3 Security & Cryptographic Vaulting
* **Token Separation Architecture:** Refresh and long-lived authorization tokens must never be sent to or stored on the client UI layer.
* **Encryption at Rest:** Secure all third-party credentials, refresh tokens, and operational API keys using authenticated **AES-256-GCM** encryption routines. Storage of decryption key salts must reside strictly within external production environment vaults (e.g., AWS Secrets Manager or Doppler).

---

## 4. Comprehensive Database Design (PostgreSQL DDL)

```sql
-- User Profile Model
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    base_currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Secure Connected Integration Vault
CREATE TABLE platform_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform_name VARCHAR(50) NOT NULL, -- e.g., 'youtube', 'amazon', 'meta', 'flipkart'
    encrypted_access_token TEXT NOT NULL,
    encrypted_refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'reauth_required', 'paused'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Standardized Unified Revenue Ledger
CREATE TABLE revenue_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    integration_id UUID REFERENCES platform_integrations(id) ON DELETE SET NULL,
    platform VARCHAR(50) NOT NULL,
    stream_type VARCHAR(50) NOT NULL, -- 'ad_revenue', 'direct_sales', 'subscription', etc.
    gross_amount NUMERIC(15, 4) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    exchange_rate_to_base NUMERIC(10, 6) DEFAULT 1.000000,
    net_settled_amount NUMERIC(15, 4) NOT NULL,
    payout_status VARCHAR(20) NOT NULL, -- 'pending', 'processing', 'cleared'
    estimated_payout_date TIMESTAMP WITH TIME ZONE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Composite Index Optimizations for Analytical Performance
CREATE INDEX idx_revenue_user_timestamp ON revenue_records(user_id, timestamp);
CREATE INDEX idx_revenue_platform_status ON revenue_records(platform, payout_status);
```

---

## 5. Normalized Internal Data Contract (JSON)

Every data block intercepted by platform connectors must be passed through a normalization adapter layer to match this canonical data model prior to ingestion into the database:

```json
{
  "id": "rev_78fa90b2-3261-4c12-a890-0987654321ab",
  "user_id": "usr_c340fa18-091a-42cd-b901-1234567890cd",
  "platform": "amazon",
  "stream_type": "direct_sales",
  "gross_amount": 14999.00,
  "currency": "INR",
  "exchange_rate_to_base": 0.012, 
  "net_settled_amount": 13420.10,
  "payout_status": "processing",
  "estimated_payout_date": "2026-07-05T00:00:00Z",
  "updated_at": "2026-06-29T18:50:00Z"
}
```

---

## 6. Financial Charts Data Schemas & UI Visualizations

These core payloads supply data to visual tracking components on the dashboard:

### 6.1 Time-Series Aggregation Payload (Line/Bar Analytics)

*Endpoint Reference: `/api/v1/analytics/time-series?range=30d*`

```json
{
  "metric": "net_revenue",
  "base_currency": "USD",
  "timeline": [
    {
      "date": "2026-06-28",
      "total_gross": 1200.50,
      "total_net": 1050.00,
      "breakdown": { "youtube": 250.00, "amazon": 800.00 }
    },
    {
      "date": "2026-06-29",
      "total_gross": 1450.00,
      "total_net": 1280.20,
      "breakdown": { "youtube": 280.20, "amazon": 1000.00 }
    }
  ]
}
```

### 6.2 Platform Allocation Payload (Donut/Pie Visualization)

*Endpoint Reference: `/api/v1/analytics/share*`

```json
{
  "time_frame": "current_month",
  "total_combined_net": 2330.20,
  "distribution": [
    { "platform": "amazon", "net_amount": 1800.00, "percentage": 77.25 },
    { "platform": "youtube", "net_amount": 530.20, "percentage": 22.75 }
  ]
}
```

---

## 7. Operational Data Export Specifications

### 7.1 CSV & Microsoft Excel (.xlsx) Export Layout Matrix

Tabular formatting reports generated by the processing engine must match this column setup:

* `Date (YYYY-MM-DD)` | `Source Platform` | `Revenue Stream Category` | `Gross Amount (Local)` | `Local Currency` | `FX Conversion Rate` | `Platform Fees / Deductions` | `Net Payout Generated (Base Currency)` | `Settlement Payout Status`

### 7.2 Professional Document PDF Layout Architecture

* **Header Section:** Includes customer branding, enterprise classification variables, targeted summary dates, and user base currency indices.
* **Executive Summary KPI Matrix:** Clean presentation of Consolidated Cross-Platform Gross Income, Deductions/Fees, Net Margin, and the Top Financial Revenue Stream Contributor.
* **Data Aggregation Matrix:** Paginated tables displaying transaction histories grouped by week, with clean layout spacing and borders.

---

## 8. Development Implementation Roadmap

1. **Phase 1 (Core Environment Orchestration):** Establish backend systems, complete database initialization tasks, and deploy Redis structures alongside worker infrastructure.
2. **Phase 2 (Credential Ingestion Infrastructure):** Deploy OAuth handshake handling managers and set up background tasks to refresh short-lived validation tokens automatically.
3. **Phase 3 (Data Transformation & Normalization):** Deploy API parsing layers to map disparate external payloads directly to the application's internal JSON specification.
4. **Phase 4 (UI Application Construction):** Build frontend screens across target deployment environments, routing telemetry insights through Zustand and React Query hooks.
5. **Phase 5 (Windows Deployment Wrap):** Run production Tauri compilation tasks to produce verified, signed `.msix` install files for deployment to the Microsoft Store Partner Center.

# Burdaa 🛡️📋

**Burdaa** is a professional-grade attendance and member management platform built with a high-performance **Vertical Slice Architecture**. Designed for organizations that require absolute data privacy and executive-level insights, it transforms routine tracking into a secure, streamlined digital experience.

The solution is powered by a **.NET 10 Web API** backend and a high-performance **React Native (Expo 54)** mobile client.

## 🌐 Overview

Burdaa establishes a high standard for professional accountability and organizational management:

* **Strict Data Isolation:** Implemented logic-driven data perimeters to block cross-organization visibility and prevent leaks.
* **Executive Ledger:** A refined interface for managing live rollcalls with customizable session windows and real-time status tracking.
* **Member Insights:** Dedicated member detail screens featuring performance metrics, attendance breakdowns, and historical data.
* **Modern Visual Identity:** A "Deep Dark" branding approach utilizing Geist fonts and **React Native Paper** for a polished, consistent user experience.

The solution follows **Screaming Architecture** principles, organizing the codebase so that domain logic (Members, Organizations, Rollcalls) is self-contained and easily discoverable.

## ✨ Features

* **🔐 Security & Data Integrity**
  * Data Leak Prevention: Hardened security architecture ensuring users only access information within their own organization.
  * Robust Authentication: ASP.NET Core Identity with JWT validation and secure token handling.
  * Seamless Typings: Synchronized backend DTOs with TypeScript 5.9 interfaces for a more user-friendly experience.

* **📋 Executive Ledger & Rollcalls**
  * Live Session Management: Real-time rollcall interface with "Present," "Absent," and "Late" status controls.
  * Configurable Windows: Dynamic session start/end time management with keyboard-aware UI components.
  * Attendance Summary: Automated calculation of remaining and marked members during active sessions.

* **👤 Member Management**
  * Member Detail Screen: Comprehensive view of registration dates, birthdates, and specific attendance rates.
  * Centralized Helpers: Deployed global utilities for image handling (`imageUtils`) and date formatting (`dateUtils`).
  * Status Tracking: Visual badges for verified status and automated "Last Seen" metrics.

## 🛠️ Tech Stack

**Backend**
* .NET 10 (ASP.NET Core Web API)
* Entity Framework Core 10 (PostgreSQL)
* Riok.Mapperly (Source-generated mapping)
* FluentValidation v12

**Mobile Client**
* React Native 0.81 (Expo 54) + React 19
* TypeScript 5.9
* Redux Toolkit
* Expo Router v6 (File-based navigation)
* React Native Paper (Material Design system)

## 📂 Project Structure

### ⚙️ Api (Backend)
```text
Api/
├── Core/                           # Infrastructure & Shared Logic
│   ├── Controllers/                # CustomBaseController.cs
│   ├── Entities/                   # Entity.cs (Base class)
│   ├── Exceptions/                 # AuthorizationException.cs, BusinessException.cs
│   ├── Helpers/                    # FileHelper.cs
│   ├── Middlewares/                # GlobalExceptionHandler.cs
│   ├── Repositories/               # EfBaseRepository.cs, IRepository.cs, IUnitOfWork.cs
│   ├── Responses/                  # ReturnModel.cs, NoData.cs
│   └── Security/                   # HashingHelper.cs, TokenOptions.cs
├── Data/                           # Persistence Layer
│   ├── BaseDbContext.cs            # Identity & PostgreSQL context
│   ├── DataRegistration.cs         # EF Service registrations
│   └── UnitOfWork.cs               # Transaction management implementation
├── Features/                       # Vertical Feature Slices (Domain Logic)
│   ├── Members/                    # Self-contained Member domain
│   │   ├── IMemberRepository.cs    # Repository Abstraction
│   │   ├── EfMemberRepository.cs   # Concrete Implementation
│   │   ├── IMemberService.cs       # Service Abstraction
│   │   ├── MemberService.cs        # Business Logic Implementation
│   │   ├── Member.cs               # DB Entity & EF Configuration
│   │   ├── MembersController.cs    # API Endpoints
│   │   ├── MemberDtos.cs           # Request/Response models
│   │   ├── MemberMapper.cs         # Riok.Mapperly profile
│   │   ├── MemberBusinessRules.cs  # Cross-cutting validation logic
│   │   ├── MemberRegistration.cs   # Feature-specific DI registration
│   │   └── MemberValidator.cs      # FluentValidation rules
│   └── Rollcalls/                  # Session & Attendance logic
└── Program.cs                      # Service registration & Middleware pipeline
```

### ⚙️ Client (Mobile)
```text
Client/
├── app/                            # Expo Router (File-based Routing)
│   ├── (auth)/                     # _layout.tsx, login.tsx, register.tsx
│   ├── (tabs)/                     # _layout.tsx, index.tsx, organizations.tsx
│   ├── groups/                     # [id].tsx
│   ├── members/                    # [id].tsx (Member Detail route)
│   ├── rollcalls/                  # _layout.tsx, live.tsx, summary.tsx, [id].tsx
│   └── settings/                   # index.tsx, _layout.tsx, +not-found.tsx
├── src/
│   ├── core/                       # App-wide Shared Logic
│   │   ├── components/             # ExecutiveBackButton.tsx, ProfileButton.tsx
│   │   ├── constants/              # Theme.ts (Palette, Spacing, Radius)
│   │   ├── hooks/                  # useRedux.ts
│   │   └── utils/                  # imageUtils.ts, dateUtils.ts
│   ├── features/                   # Feature-Sliced UI & Logic
│   │   ├── members/                # Member Domain Slice
│   │   │   ├── components/         # StatBox.tsx, CreateMemberModal.tsx
│   │   │   ├── screens/            # MemberDetailScreen.tsx
│   │   │   ├── services/           # memberService.ts (Axios clients)
│   │   │   ├── store/              # memberSlice.ts (Redux thunks/actions)
│   │   │   └── types/              # Member.ts (TypeScript Interfaces)
│   │   ├── rollcalls/              # Session-specific logic & components
│   │   ├── organizations/          # Organization UI & logic
│   │   └── auth/                   # Authentication forms & logic
│   └── store/                      # Root Redux store configuration (store.ts)
├── assets/                         # Fonts, Images, and Splash screens
└── app.json                        # Expo & App metadata configuration
```

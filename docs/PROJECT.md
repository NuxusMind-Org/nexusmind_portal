# NexusMind Platform - Project & Business Documentation

Welcome to the **NexusMind** enterprise portal project documentation. This document outlines the business context, goals, structural hierarchy, and core functional specifications of the NexusMind multi-tenant SaaS platform. 

---

## 1. Executive Summary

### What is NexusMind?
NexusMind is a state-of-the-art, enterprise-grade multi-tenant Software-as-a-Service (SaaS) platform designed to orchestrate mental health services, patient management, psychological counseling, and analytics at scale. It provides a centralized digital ecosystem for healthcare providers, clinical psychologists, institutions, and patients.

### Why was it built?
Healthcare groups, clinics, and private practices suffer from fragmented software systems. Administrative workflows, scheduling, billing, clinical logs, and patient communication are typically spread across different, un-integrated tools. NexusMind was built to unify these operations into a single secure, HIPAA-compliant platform.

### What problem does it solve?
1. **Administrative Overhead**: Automates scheduling, patient intake, notifications, and analytics.
2. **Data Silos**: Consolidates clinical records, diagnostics, and patient progress logs into a structured, historical record.
3. **Tenant Customization & Isolation**: Enables multiple independent health organizations to share a single platform infrastructure while keeping client and clinical data fully partitioned.
4. **Security & Compliance**: Implements strict access controls, logs, and security standards necessary for handling sensitive health data.

---

## 2. Platform Architecture & Multi-Tenancy

NexusMind is designed from the ground up as a **multi-tenant SaaS application**.

### The Tenant Isolation Concept
In NexusMind, an **Organization** is equivalent to a **Tenant**. A tenant represents an independent business entity (such as a private hospital group, a local clinic, or a university counseling department). 

- **Logical Data Partitioning**: All data records (patients, sessions, logs, messages) belong to a specific tenant ID.
- **Tenant Isolation Boundaries**: Database queries and API requests are automatically scoped to the active tenant ID (communicated via custom HTTP request headers). Users belonging to Tenant A have no visibility or path to access records belonging to Tenant B, even though they share the same physical server instance.
- **Custom Branding & Settings**: Tenants configure their own portals, domains, notification schedules, and local rules independently.

### Platform Hierarchy

The operational hierarchy of NexusMind is structured as follows:

```
                  ┌────────────────────────────────────────┐
                  │          NexusMind Platform            │
                  │   (Managed by Platform Super Admins)   │
                  └───────────────────┬────────────────────┘
                                      │
           ┌──────────────────────────┼──────────────────────────┐
           ▼                          ▼                          ▼
┌────────────────────┐      ┌────────────────────┐      ┌────────────────────┐
│   Organization A   │      │   Organization B   │      │   Organization C   │
│   (Tenant Group)   │      │   (Tenant Group)   │      │   (Tenant Group)   │
└──────────┬─────────┘      └──────────┬─────────┘      └──────────┬─────────┘
           │                           │                           │
     ┌─────┴──────────┐          ┌─────┴──────────┐          ┌─────┴──────────┐
     ▼                ▼          ▼                ▼          ▼                ▼
┌──────────┐    ┌──────────┐┌──────────┐    ┌──────────┐┌──────────┐    ┌──────────┐
│  Users   │    │  Data    ││  Users   │    │  Data    ││  Users   │    │  Data    │
│(Clinicians│   │(Sessions,││(Clinicians│   │(Sessions,││(Clinicians│   │(Sessions,│
│ Patients)│    │ Records) ││ Patients)│    │ Records) ││ Patients)│    │ Records) │
└──────────┘    └──────────┘└──────────┘    └──────────┘└──────────┘    └──────────┘
```

1. **Platform**: The global infrastructure level. Contains configurations for global settings, subscription tiers, resource constraints, and global tenant lifecycle logs.
2. **Organization (Tenant)**: An isolated container representing a clinic or network of clinics.
3. **Users**: Individuals who belong to a specific Organization (e.g., Organization Admins, Psychologists, Patients, Support Staff).
4. **Data**: The clinic files, session recordings, medical histories, schemas, and configurations owned exclusively by that tenant.

---

## 3. Identity, Authentication, and RBAC

Security is governed by a robust Identity Provider (IdP) backend, token exchange, and dynamic **Role-Based Access Control (RBAC)**.

### Authentication Flow
1. **Initiation**: The user logs in via the Auth Portal.
2. **Tenant Resolution**: Based on the username/email domain or sub-domain route (e.g., `clinic1.nexusmind.com`), the client determines the tenant context.
3. **Credential Exchange**: The login request containing user credentials and `tenantId` is processed by the server.
4. **Token Generation**: On successful authentication, the server returns an access token (JWT) containing the user’s identity, assigned role, active tenant, and permission matrix.
5. **Session Persistence**: The client stores the token globally in memory and syncs persistent metadata in local storage. Every subsequent API call appends the JWT in the `Authorization` header and the tenant context in the custom `X-Tenant-ID` header.

### User Roles & Responsibilities

| Role | Domain Scope | Permissions & System Scope | Responsibilities |
| :--- | :--- | :--- | :--- |
| **NexusMind Super Admin** | Global Platform | Full global read/write across all organizations, billing systems, and server logs. | Manages tenants, monitors platform health, configures global integration tokens, reviews cross-tenant analytics, and manages subscription tiers. |
| **Organization Admin** | Single Organization | Full administrative access to the specific tenant's space. | Manages local users (clinicians, staff), modifies organization settings, views organizational reports, configures scheduling templates, and manages local billing/integrations. |
| **Psychologist** | Single Organization | Read/Write access limited to assigned patients and therapy sessions. | Conducts clinical assessments, updates electronic medical records, manages scheduling calendars, logs session notes, and communicates with patients. |
| **Patient** | Single Organization | Read/Write access strictly bounded to their personal profile, schedules, and active care plans. | books appointments, completes intake questionnaires, views therapy homework assignments, updates personal details, and chats with their therapist. |

---

## 4. Platform Modules

### Current Core Modules
* **Authentication & Identity**: Handles JWT management, forgot/reset password flows, multi-factor verification, and profile management.
* **Dashboard**: Role-specific, real-time control panels displaying key metrics, tasks, logs, and calendar items.
* **Organizations (Tenants)**: Handles onboarding of organizations, custom branding configs, subdomain setups, and workspace configurations.
* **Users & Staff Directory**: Manage staff accounts, invitation workflows, user status (active, disabled), and role permissions.
* **Psychologists Management**: Custom profiles, specializations, therapist availability templates, and performance stats.
* **Patients Directory**: Multi-layered patient profiles containing care histories, contact info, clinical documents, and billing history.
* **Sessions (Therapy logs)**: Scheduling system, appointment booking engines, virtual conference rooms, therapist log summaries, and status tracking (scheduled, completed, cancelled).
* **Blogs & Content Management**: Secure patient resources hub, article databases, client guides, and medical advice publications.

### Future Planned Modules
* **AI Copilot for Clinicians**: Real-time voice-to-text session transcription, automatic clinical SOAP note drafting, and assessment analysis.
* **VR Exposure Therapy Orchestration**: Integrations for scheduling, conducting, and logging Virtual Reality exposure therapy protocols.
* **Advanced Reports & Billing Engine**: Automated health insurance claim submissions, subscription billing integration, and organization revenue analytics.
* **Telehealth Video Rooms**: Custom embedded HIPAA-compliant video conference rooms with real-time feedback loops.

---

## 5. Long-Term Vision and Scalability Goals

The overarching objective of the NexusMind project is to serve as the unified software engine for small clinics up to massive healthcare groups with thousands of active therapists.

* **Scale to 300+ Pages**: The application is built to accommodate hundreds of pages across different modules and user roles without experiencing performance degradation or codebase bloat.
* **Modular Upgrades**: New functional domains (e.g., AI assistants, medical billing) must slot directly into the architecture as isolated business units.
* **Data Security & Privacy Compliance**: Maintain absolute isolation of patient clinical records in compliance with global health regulations (HIPAA, GDPR, CCPA).

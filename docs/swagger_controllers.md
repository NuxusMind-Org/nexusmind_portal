# NexusMind API - Swagger Controllers Documentation

This document provides a comprehensive overview of all backend REST API controllers and endpoints defined in the NexusMind OpenAPI specification (`https://nexusmind-889936615032.europe-west3.run.app`). It categorizes endpoints by controller domain, details request/response schemas, and specifies role access rules across the **NexusMind Portal** (`nexusmind_portal`) and **NexusMind Web** (`nexusmind_web`).

---

## Base Configuration

- **Server URL**: `https://nexusmind-889936615032.europe-west3.run.app`
- **Security Standard**: `Bearer <JWT_TOKEN>` in `Authorization` header
- **OpenAPI Version**: `v3.1.0`

---

## 1. Role-Based Access Control (RBAC) Matrix

| Controller / Endpoint Group | NexusMind Admin | BPM Admin | Psychologist | Patient (NexusMind Web) |
|---|:---:|:---:|:---:|:---:|
| **Auth (`/auth/*`)** | Super Admin Login | BPM Login | Doctor Login | Patient Login (Web App) |
| **Xeber (`/xeber`)** | `POST`, `PUT`, `DELETE` | `POST`, `PUT`, `DELETE` | `GET` | `GET` |
| **Məqalə (`/meqale`)** | `POST`, `PUT`, `DELETE` | `POST`, `PUT`, `DELETE` | `GET` | `GET` |
| **Blog (`/blog`)** | `POST`, `PUT`, `DELETE` | `POST`, `PUT`, `DELETE` | `GET` | `GET` |
| **Gallery (`/gallery`)** | `POST`, `PUT`, `DELETE` | `POST`, `PUT`, `DELETE` | `GET` | `GET` |
| **Trainings (`/trainings`)** | Full Access | Full Access | `POST`, `PUT`, `DELETE` | `GET`, `POST (register)` |
| **BPM Operations (`/bpm/*`)** | Read-Only / Manage | `GET /patients`, `GET /doctors` | No Access | No Access |
| **NexusMind Operations (`/nexusmind/*`)** | Patients & Doctors Management | No Access | No Access | No Access |

---

## 2. Controllers & Endpoint Reference

### 2.1. Authentication Controller (`auth-controller`)

Used for credential validation and JWT token issuance across roles.

| Method | Endpoint | Description | Request Body Schema | Response Schema | Portal Scope |
|---|---|---|---|---|---|
| `POST` | `/auth/bpm-login` | BPM Admin authentication | `AdminLoginRequest` | `AuthResponse` | `nexusmind_portal` |
| `POST` | `/auth/super-admin-login` | NexusMind Super Admin authentication | `AdminLoginRequest` | `AuthResponse` | `nexusmind_portal` |
| `POST` | `/auth/doctor-login` | Doctor / Psychologist authentication | `LoginRequest` | `AuthResponse` | `nexusmind_portal` |
| `POST` | `/auth/doctor-panel-login` | Doctor Panel authentication | `AdminLoginRequest` | `AuthResponse` | `nexusmind_portal` |
| `POST` | `/auth/login` | Patient authentication | `LoginRequest` | `AuthResponse` | `nexusmind_web` |
| `PUT` | `/auth/change-password` | Change account password | `ChangePasswordRequest` | `string` | Both |
| `POST` | `/auth/forgot-password` | Request password reset OTP | `ForgotPasswordRequest` | `string` | Both |
| `POST` | `/auth/reset-password` | Reset password using OTP | `ResetPasswordWithOtpRequest` | `string` | Both |

---

### 2.2. Site Settings Controller (`site-settings-controller`)

Used by Platform & Admin roles for global portal settings management.

| Method | Endpoint | Description | Request Body Schema | Response Schema | Portal Scope |
|---|---|---|---|---|---|
| `GET` | `/admin/site-settings` | Fetch platform site settings | - | `SiteSettingsResponseDto` | `nexusmind_portal` |
| `PUT` | `/admin/site-settings` | Update platform site settings | `SiteSettingsRequestDto` | `SiteSettingsResponseDto` | `nexusmind_portal` |

---

### 2.3. Content Controllers (Xeber, Meqale, Blog, Gallery)


Provides public viewing for visitors and CRUD capabilities for organization admins.

#### News Controller (`xeber-controller`)
- `GET /xeber` - Paginated news list (`Pageable` -> `PageXeberResponseDto`)
- `GET /xeber/{id}` - Single news item by ID (`XeberResponseDto`)
- `POST /xeber` - Create news item (`XeberRequestDto` -> `XeberResponseDto`)
- `PUT /xeber/{id}` - Update news item (`XeberRequestDto` -> `XeberResponseDto`)
- `DELETE /xeber/{id}` - Delete news item (`200 OK`)

#### Article Controller (`meqale-controller`)
- `GET /meqale` - Paginated article list (`Pageable` -> `PageMeqaleResponseDto`)
- `GET /meqale/{id}` - Single article by ID (`MeqaleResponseDto`)
- `POST /meqale` - Create article (`MeqaleRequestDto` -> `MeqaleResponseDto`)
- `PUT /meqale/{id}` - Update article (`MeqaleRequestDto` -> `MeqaleResponseDto`)
- `DELETE /meqale/{id}` - Delete article (`200 OK`)

#### Blog Controller (`blog-controller`)
- `GET /blog` - Paginated blog posts (`Pageable` -> `PageBlogResponse`)
- `GET /blog/{id}` - Single blog post by ID (`BlogResponse`)
- `POST /blog` - Create blog post (`BlogRequest` -> `BlogResponse`)
- `PUT /blog/{id}` - Update blog post (`BlogRequest` -> `BlogResponse`)
- `DELETE /blog/{id}` - Delete blog post (`200 OK`)

#### Gallery Controller (`gallery-controller`)
- `GET /gallery` - Filtered gallery items (`category`, `sort`, `page`, `size` -> `PageGalleryItemResponse`)
- `POST /gallery` - Upload gallery entry (`GalleryItemRequest` -> `GalleryItemResponse`)
- `PUT /gallery/{id}` - Update gallery entry (`GalleryItemRequest` -> `GalleryItemResponse`)
- `DELETE /gallery/{id}` - Delete gallery item (`200 OK`)

---

### 2.3. BPM Organization Controller (`bpm-controller`)

Used exclusively by **BPM Admins** to view clinic staff and registered patients.

| Method | Endpoint | Parameters | Response Schema | Scope |
|---|---|---|---|---|
| `GET` | `/bpm/patients` | Query: `pageable` | `PagePatientDto` | `nexusmind_portal` |
| `GET` | `/bpm/doctors` | Query: `pageable` | `PageDoctorDto` | `nexusmind_portal` |

---

### 2.4. NexusMind Super Admin Controller (`nexus-mind-controller`)

Used exclusively by **NexusMind Admins** for multi-organization system administration.

| Method | Endpoint | Parameters | Response Schema | Scope |
|---|---|---|---|---|
| `GET` | `/nexusmind/patients` | Query: `pageable` | `PagePatientDto` | `nexusmind_portal` |
| `GET` | `/nexusmind/doctors` | Query: `pageable` | `PageDoctorDto` | `nexusmind_portal` |
| `DELETE` | `/nexusmind/doctors/{id}` | Path: `id` (int64) | `200 OK` | `nexusmind_portal` |
| `DELETE` | `/nexusmind/bpm/{id}` | Path: `id` (int64) | `200 OK` | `nexusmind_portal` |

---

### 2.5. Training Controller (`training-controller`)

Managed primarily by **Psychologists** and Organization Admins.

- `GET /trainings` - Search trainings (`type`: ONLINE/IN_PERSON, `search`: string, `pageable` -> `PageTrainingResponse`)
- `POST /trainings` - Create training (`TrainingRequest` -> `TrainingResponse`)
- `PUT /trainings/{id}` - Update training (`TrainingRequest` -> `TrainingResponse`)
- `DELETE /trainings/{id}` - Delete training (`200 OK`)
- `POST /trainings/{trainingId}/register` - Patient registration (`200 OK`)
- `DELETE /trainings/{trainingId}/register` - Unregister patient (`200 OK`)

---

### 2.6. Doctor Controller (`doctor-controller`)

- `POST /doctors/register` - Doctor account registration (`multipart/form-data`: `DoctorRegisterDto` -> `string`)

---

### 2.7. Patient & Mood Controller (`pasient-controller`)

- `GET /auth/{id}` - Get patient profile by ID (`PasientRegisterDto`)
- `POST /auth/add` - Register new patient (`PasientRegisterDto` -> `PasientRegisterDto`)
- `PUT /auth/{id}` - Update patient info (`PasientRegisterDto` -> `string`)
- `DELETE /auth/{id}` - Delete patient (`string`)
- `PUT /auth/{patientId}/mood` - Update daily mood (`mood`: SAD, HAPPY, TIRED, CALM, NORMAL -> `200 OK`)

---

### 2.8. User Profile Controller (`profile-controller`)

- `PUT /profile/name` - Update user display name (`UpdateNameRequest` -> `ProfileResponse`)
- `PUT /profile/email` - Update user email (`UpdateEmailRequest` -> `ProfileResponse`)
- `PUT /profile/password` - Change account password (`ChangePasswordRequest` -> `string`)
- `PUT /profile/status` - Update status message (`UpdateProfileStatusRequest` -> `ProfileResponse`)
- `PUT /profile/language` - Update preferred locale (`UpdateLanguageRequest` -> `ProfileResponse`)
- `PUT /profile/2fa` - Enable/disable 2FA (`enabled`: boolean -> `string`)
- `POST /profile/photo` - Upload avatar (`multipart/form-data`: file -> `ProfileResponse`)
- `DELETE /profile/photo` - Remove avatar (`200 OK`)

---

### 2.9. Supporting Utility Controllers

- **Onboarding (`onboarding-controller`)**: `POST /onboarding/submit` (`OnboardingRequest` -> `OnboardingResponse`)
- **OTP Verification (`otp-controller`)**: `POST /otp/verify` (`VerifyOtpRequest` -> `string`)
- **Journal Logging (`journal-controller`)**: `POST /journal` (`JournalEntryRequest` -> `JournalEntryResponse`)

---

## 3. Data Transfer Objects (DTOs) Summary

The frontend Portal consumes DTO types defined in [src/types/portalDtos.ts](file:///Users/rafiqsafarov/Documents/projects/nexusmind_portal/src/types/portalDtos.ts):

- `XeberRequestDto` / `XeberResponseDto`
- `MeqaleRequestDto` / `MeqaleResponseDto`
- `BlogRequest` / `BlogResponse`
- `GalleryItemRequest` / `GalleryItemResponse`
- `TrainingRequest` / `TrainingResponse`
- `DoctorDto` / `DoctorRegisterDto`
- `PatientDto` / `PasientRegisterDto`
- `AuthResponse` / `AdminLoginRequest` / `LoginRequest`
- `Page<T>` (Paginated generic response container)

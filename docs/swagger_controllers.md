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
| **Appointments (`/appointments`)** | Read-Only | Read-Only | Full Access | Full Access |
| **BPM Operations (`/bpm/*`)** | Read-Only / Manage | `GET /patients`, `GET /doctors` | No Access | No Access |
| **NexusMind Operations (`/nexusmind/*`)** | Patients & Doctors Management | No Access | No Access | No Access |

---

## 2. Controllers & Endpoint Reference

### 2.1. Authentication Controller (`auth-controller`)

Used for credential validation and JWT token issuance across roles.

| Method | Endpoint | Description | Request Body Schema | Response Schema | Scope |
|---|---|---|---|---|---|
| `GET` | `/auth` | Get all users | - | `PasientRegisterDto[]` | `nexusmind_portal` |
| `GET` | `/auth/validate` | Validate token | - | `boolean` | Both |
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

| Method | Endpoint | Description | Request/Response Schema | Scope |
|---|---|---|---|---|
| `GET` / `POST` | `/sitemap.xml` | Fetch or update sitemap.xml | `string` (XML) | `nexusmind_portal` |
| `GET` / `POST` | `/robots.txt` | Fetch or update robots.txt | `string` (Text) | `nexusmind_portal` |
| `GET` / `POST` | `/llms.txt` | Fetch or update llms.txt | `string` (Text) | `nexusmind_portal` |
| `GET` | `/site-settings/scripts` | Get public custom scripts | `SiteSettingsResponseDto` | `nexusmind_web` |

---

### 2.3. Content Controllers (Xeber, Meqale, Blog, Gallery)

Provides public viewing for visitors and CRUD capabilities for organization admins.

#### News Controller (`news-controller`)
- `GET /xeber` - Paginated news list (`Pageable` -> `PageXeberResponseDto`)
- `GET /xeber/{id}` - Single news item by ID (`XeberResponseDto`)
- `GET /xeber/search` - Search news by keyword (`PageXeberResponseDto`)
- `GET /xeber/category/{category}` - Get news by category (`PageXeberResponseDto`)
- `GET /xeber/admin/all` - Get all news for admin (`PageXeberResponseDto`)
- `POST /xeber` - Create news item (`XeberRequestDto` -> `XeberResponseDto`)
- `PUT /xeber/{id}` - Update news item (`XeberRequestDto` -> `XeberResponseDto`)
- `DELETE /xeber/{id}` - Delete news item (`200 OK`)

#### Article Controller (`article-controller`)
- `GET /meqale` - Paginated article list (`Pageable` -> `PageMeqaleResponseDto`)
- `GET /meqale/{id}` - Single article by ID (`MeqaleResponseDto`)
- `GET /meqale/search` - Search articles by keyword (`PageMeqaleResponseDto`)
- `GET /meqale/category/{category}` - Get articles by category (`PageMeqaleResponseDto`)
- `GET /meqale/admin/all` - Get all articles for admin (`PageMeqaleResponseDto`)
- `POST /meqale` - Create article (`MeqaleRequestDto` -> `MeqaleResponseDto`)
- `PUT /meqale/{id}` - Update article (`MeqaleRequestDto` -> `MeqaleResponseDto`)
- `DELETE /meqale/{id}` - Delete article (`200 OK`)

#### Blog Controller (`blog-controller`)
- `GET /blog` - Paginated blog posts (`Pageable` -> `PageBlogResponse`)
- `GET /blog/{id}` - Single blog post by ID (`BlogResponse`)
- `GET /blog/search` - Search blogs by keyword (`PageBlogResponse`)
- `GET /blog/category/{category}` - Get blogs by category (`PageBlogResponse`)
- `POST /blog` - Create blog post (`BlogRequest` -> `BlogResponse`)
- `PUT /blog/{id}` - Update blog post (`BlogRequest` -> `BlogResponse`)
- `DELETE /blog/{id}` - Delete blog post (`200 OK`)

#### Gallery Controller (`gallery-controller`)
- `GET /gallery` - Filtered gallery items (`category`, `sort`, `page`, `size` -> `PageGalleryItemResponse`)
- `POST /gallery` - Upload gallery entry (`GalleryItemRequest` -> `GalleryItemResponse`)
- `PUT /gallery/{id}` - Update gallery entry (`GalleryItemRequest` -> `GalleryItemResponse`)
- `DELETE /gallery/{id}` - Delete gallery item (`200 OK`)

---

### 2.4. Appointments Controller (`appointment-controller`)

Handles patient-doctor sessions scheduling, status updates, notes, and LiveKit tokens.

- `GET /appointments` - Get user's appointments (`AppointmentDto[]`)
- `POST /appointments` - Create new appointment (`CreateAppointmentRequest` -> `AppointmentDto`)
- `GET /appointments/{id}` - Get appointment details (`AppointmentDto`)
- `PATCH /appointments/{id}/status` - Update appointment status (`UpdateUserStatusRequest` -> `AppointmentDto`)
- `PATCH /appointments/{id}/cancel` - Cancel appointment (`AppointmentDto`)
- `GET /appointments/{id}/notes` - Get session note (`SessionNoteDto`)
- `POST /appointments/{id}/notes` - Add session note (`CreateSessionNoteRequest` -> `SessionNoteDto`)
- `POST /appointments/{id}/join-token` - Get LiveKit join token (`object` with token)
- `GET /appointments/stats` - Get appointment statistics (`AppointmentStatsDto`)

---

### 2.5. Chat REST Controller (`chat-rest-controller`)

- `GET /chat/{appointmentId}/messages` - Fetch chat messages for a specific appointment session (`ChatMessageResponseDto[]`)

---

### 2.6. Webhook Controller (`webhook-controller`)

- `POST /api/webhooks/livekit` - Handle incoming events from LiveKit server.

---

### 2.7. BPM Organization Controller (`bpm-controller`)

Used exclusively by **BPM Admins** to view clinic staff and registered patients.

| Method | Endpoint | Response Schema | Scope |
|---|---|---|---|
| `GET` | `/bpm/patients` | `PasientRegisterEntity[]` | `nexusmind_portal` |
| `GET` | `/bpm/doctors` | `DoctorResponseDto[]` | `nexusmind_portal` |

---

### 2.8. Super Admin Controller (`super-admin-controller`)

Used exclusively by **NexusMind Admins** for multi-organization system administration.

| Method | Endpoint | Parameters | Response Schema | Scope |
|---|---|---|---|---|
| `GET` | `/nexusmind/patients` | - | `object[]` | `nexusmind_portal` |
| `GET` | `/nexusmind/doctors` | - | `DoctorEntity[]` | `nexusmind_portal` |
| `DELETE` | `/nexusmind/doctors/{id}` | Path: `id` (int64) | `200 OK` | `nexusmind_portal` |

---

### 2.9. Training Controller (`training-controller`)

Managed primarily by **Psychologists** and Organization Admins.

- `GET /trainings` - Search trainings (`type`: ONLINE/IN_PERSON, `search`: string, `pageable` -> `PageTrainingResponse`)
- `GET /trainings/type-counts` - Get count by training type (`TrainingTypeCountResponse[]`)
- `GET /trainings/popular-tags` - Get popular tags (`string[]`)
- `GET /trainings/calendar` - Get trainings by month (`TrainingResponse[]`)
- `POST /trainings` - Create training (`TrainingRequest` -> `TrainingResponse`)
- `PUT /trainings/{id}` - Update training (`TrainingRequest` -> `TrainingResponse`)
- `DELETE /trainings/{id}` - Delete training (`200 OK`)
- `POST /trainings/{trainingId}/register` - Patient registration (`200 OK`)
- `DELETE /trainings/{trainingId}/register` - Unregister patient (`200 OK`)

---

### 2.10. Doctor Controllers (`doctor-controller` & `doctor-profile-controller`)

Handles doctor profiles, registration, and patient associations.

#### Doctor Controller
- `POST /doctors/register` - Doctor account registration (`DoctorRegisterDto` -> `string`)
- `GET /doctors/me/patients` - Get my assigned patients (`PasientRegisterEntity[]`)
- `GET /doctors/doctors` - Get all doctors list (`DoctorResponseDto[]`)

#### Doctor Profile Controller
- `GET /doctors` - Get all doctor profiles (`DoctorDto[]`)
- `GET /doctors/{id}` - Get doctor profile by ID (`DoctorDto`)

---

### 2.11. Patient & Mood Controller (`auth-controller`)

*Note: Handled under `/auth` routes as user/patient operations.*

- `GET /auth/{id}` - Get patient profile by ID (`PasientRegisterDto`)
- `POST /auth/add` - Register new patient (`PasientRegisterDto` -> `string`)
- `PUT /auth/{id}` - Update patient info (`PasientRegisterDto` -> `string`)
- `DELETE /auth/{id}` - Delete patient (`string`)
- `PUT /auth/{patientId}/mood` - Update daily mood (`mood`: SAD, HAPPY, TIRED, CALM, NORMAL -> `200 OK`)

---

### 2.12. User Profile Controller (`profile-controller`)

- `PUT /profile/name` - Update user display name (`UpdateNameRequest` -> `ProfileResponse`)
- `PUT /profile/email` - Update user email (`UpdateEmailRequest` -> `ProfileResponse`)
- `PUT /profile/status` - Update status message (`UpdateProfileStatusRequest` -> `ProfileResponse`)
- `PUT /profile/language` - Update preferred locale (`UpdateLanguageRequest` -> `ProfileResponse`)
- `PUT /profile/2fa` - Enable/disable 2FA (`enabled`: boolean -> `string`)
- `POST /profile/photo` - Upload avatar (`multipart/form-data`: file -> `ProfileResponse`)
- `DELETE /profile/photo` - Remove avatar (`200 OK`)

---

### 2.13. Supporting Utility Controllers

#### Onboarding (`onboarding-controller`)
- `POST /onboarding/submit` - Submit onboarding data (`OnboardingRequest` -> `OnboardingResponse`)
- `GET /onboarding/status` - Check onboarding completion (`boolean`)
- `GET /onboarding/me` - Get onboarding details (`OnboardingResponse`)

#### OTP Verification (`otp-controller`)
- `POST /otp/verify` - Verify OTP code (`VerifyOtpRequest` -> `string`)

#### Journal Logging (`journal-controller`)
- `GET /journal/today` - Get today's journal entry (`JournalEntryResponse`)
- `GET /journal/history` - Get paginated journal history (`PageJournalEntryResponse`)
- `GET /journal/{id}` - Get journal entry by ID (`JournalEntryResponse`)
- `POST /journal` - Save today's journal (`JournalEntryRequest` -> `JournalEntryResponse`)
- `DELETE /journal/{id}` - Delete journal entry (`200 OK`)

---

## 3. Data Transfer Objects (DTOs) Summary

The frontend Portal consumes DTO types defined in [src/types/portalDtos.ts](file:///Users/rafiqsafarov/Documents/projects/nexusmind_portal/src/types/portalDtos.ts):

- `XeberRequestDto` / `XeberResponseDto`
- `MeqaleRequestDto` / `MeqaleResponseDto`
- `BlogRequest` / `BlogResponse`
- `GalleryItemRequest` / `GalleryItemResponse`
- `TrainingRequest` / `TrainingResponse`
- `DoctorDto` / `DoctorRegisterDto` / `DoctorEntity` / `DoctorResponseDto`
- `PasientRegisterDto` / `PasientRegisterEntity`
- `AuthResponse` / `AdminLoginRequest` / `LoginRequest`
- `AppointmentDto` / `CreateAppointmentRequest` / `SessionNoteDto`
- `OnboardingRequest` / `OnboardingResponse`
- `JournalEntryRequest` / `JournalEntryResponse`
- `Page<T>` (Paginated generic response container)

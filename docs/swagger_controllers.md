# NexusMind API - Swagger Controllers Documentation

This document provides a comprehensive and up-to-date technical reference of all backend REST API controllers, endpoints, data transfer objects (DTOs), and schemas defined in the NexusMind OpenAPI specification (`https://nexusmind-889936615032.europe-west3.run.app`). It covers role permissions across the **NexusMind Portal** (`nexusmind_portal`) and **NexusMind Web** (`nexusmind_web`).

---

## Base Configuration

- **Server URL**: `https://nexusmind-889936615032.europe-west3.run.app`
- **Security Standard**: `Bearer <JWT_TOKEN>` in `Authorization` header
- **OpenAPI Version**: `3.1.0` (API Title: `NexusMind API`, Version: `v1.0`)

---

## 1. Role-Based Access Control (RBAC) Matrix

| Controller / Domain | NexusMind Super Admin | BPM Admin | Doctor / Psychologist | Patient (NexusMind Web) | Public / Guest |
|---|:---:|:---:|:---:|:---:|:---:|
| **Auth (`/auth/*`)** | Super Admin Login, Manage Users | BPM Login | Doctor & Panel Login | Login, Register, Forgot Password | Validate, Login, Register |
| **User Profile (`/profile/*`)** | Full Access | Full Access | Full Access | Full Access | No Access |
| **Site Settings (`/site-settings/*`, `/*.xml`, `/*.txt`)** | Full Read/Write | Full Read/Write | Read-Only | Read-Only | Read-Only Scripts & Robots |
| **News (`/xeber/*`)** | Full CRUD & Admin View | Full CRUD & Admin View | Read-Only | Read-Only | Read-Only |
| **Articles (`/meqale/*`)** | Full CRUD & Admin View | Full CRUD & Admin View | Read-Only | Read-Only | Read-Only |
| **Blog (`/blog/*`)** | Full CRUD | Full CRUD | Read-Only | Read-Only | Read-Only |
| **Gallery (`/gallery/*`)** | Full CRUD | Full CRUD | Read-Only | Read-Only | Read-Only |
| **Trainings (`/trainings/*`)** | Full Access | Full Access | Full Access (Create/Edit) | Search, Calendar, Register | Search, Calendar |
| **Appointments (`/appointments/*`)** | Read Stats | Read Stats | View, Status, Notes, LiveKit Token, Image | Create, Cancel, Join LiveKit | No Access |
| **Doctor Profiles & Hours (`/doctors/*`)** | Read All, Delete Doctor | Read Doctors | Manage Schedule (`/me`), View Patients | View Profiles, View Slots | View Profiles, Register Doctor |
| **BPM Admin Ops (`/bpm/*`)** | Full Access | View Patients & Doctors | No Access | No Access | No Access |
| **Super Admin Ops (`/nexusmind/*`)** | View Patients, Manage Doctors | No Access | No Access | No Access | No Access |
| **Onboarding (`/onboarding/*`)** | Read-Only | Read-Only | Read-Only | Submit, Check Status, Get Mine | No Access |
| **Journal (`/journal/*`)** | No Access | No Access | No Access | Full CRUD (Today, History, Single) | No Access |
| **Chat & Webhook (`/chat/*`, `/api/webhooks/*`)** | No Access | No Access | View Messages | View Messages | LiveKit Webhook Handler |
| **File Upload (`/upload`)** | Full Access (Upload Images/Assets) | Full Access (Upload Images/Assets) | Full Access | Full Access | No Access |

---

## 2. Controllers & Endpoints Reference

### 2.1. Authentication Controller (`auth-controller`)

Handles authentication, registration, password lifecycle, token refresh, and user records.

| Method | Endpoint | Operation ID | Parameters / Headers | Request Body | Response Schema | Scope |
|---|---|---|---|---|---|---|
| `GET` | `/auth` | `getAllUsers` | - | - | `PasientRegisterDto[]` | Portal |
| `GET` | `/auth/validate` | `validate` | Header: `Authorization` (string) | - | `boolean` | Both |
| `GET` | `/auth/{id}` | `getUserById` | Path: `id` (int64) | - | `PasientRegisterDto` | Both |
| `POST` | `/auth/add` | `addPasient` | - | `PasientRegisterDto` | `string` | Both |
| `PUT` | `/auth/{id}` | `updateUser` | Path: `id` (int64) | `PasientRegisterDto` | `string` | Both |
| `DELETE` | `/auth/{id}` | `deleteUser` | Path: `id` (int64) | - | `string` | Portal |
| `POST` | `/auth/login` | `login` | - | `LoginRequest` | `AuthResponse` | Web |
| `POST` | `/auth/bpm-login` | `bpmLogin` | - | `AdminLoginRequest` | `AuthResponse` | Portal |
| `POST` | `/auth/super-admin-login` | `superAdminLogin` | - | `AdminLoginRequest` | `AuthResponse` | Portal |
| `POST` | `/auth/doctor-login` | `doctorLogin` | - | `LoginRequest` | `AuthResponse` | Portal |
| `POST` | `/auth/doctor-panel-login` | `doctorPanelLogin` | - | `DoctorLoginRequest` | `AuthResponse` | Portal |
| `POST` | `/auth/refresh` | `refresh` | - | `Record<string, string>` | `AuthResponse` | Both |
| `POST` | `/auth/logout` | `logout` | - | - | `string` | Both |
| `PUT` | `/auth/change-password` | `changePassword` | Header: `Authorization` (string) | `ChangePasswordRequest` | `string` | Both |
| `POST` | `/auth/forgot-password` | `forgotPassword` | - | `ForgotPasswordRequest` | `string` | Both |
| `POST` | `/auth/reset-password` | `resetPassword` | - | `ResetPasswordWithOtpRequest` | `string` | Both |
| `PUT` | `/auth/{patientId}/mood` | `updateMood` | Path: `patientId` (int64)<br>Query: `mood` (`SAD` \| `HAPPY` \| `TIRED` \| `CALM` \| `NORMAL`) | - | `200 OK` | Web |

---

### 2.2. User Profile Controller (`profile-controller`)

Manages authenticated user profile data, avatars, localization, and two-factor authentication.

| Method | Endpoint | Operation ID | Parameters | Request Body | Response Schema | Scope |
|---|---|---|---|---|---|---|
| `PUT` | `/profile/name` | `updateName` | - | `UpdateNameRequest` | `ProfileResponse` | Both |
| `PUT` | `/profile/email` | `updateEmail` | - | `UpdateEmailRequest` | `ProfileResponse` | Both |
| `PUT` | `/profile/status` | `updateStatus` | - | `UpdateProfileStatusRequest` | `ProfileResponse` | Both |
| `PUT` | `/profile/language` | `updateLanguage` | - | `UpdateLanguageRequest` | `ProfileResponse` | Both |
| `PUT` | `/profile/2fa` | `updateTwoFactor` | Query: `enabled` (boolean) | - | `string` | Both |
| `POST` | `/profile/photo` | `uploadPhoto` | - | `multipart/form-data`: `file` (binary) | `ProfileResponse` | Both |
| `DELETE` | `/profile/photo` | `deletePhoto` | - | - | `200 OK` | Both |

---

### 2.3. Site Settings Controller (`site-settings-controller`)

Manages search engine files, custom script injection, and metadata.

| Method | Endpoint | Operation ID | Request Body / Content Type | Response Schema | Scope |
|---|---|---|---|---|---|
| `GET` | `/sitemap.xml` | `sitemapXml` | - | `application/xml`: `string` | Both |
| `POST` | `/sitemap.xml` | `updateSitemapXml` | `application/xml`: `string` | `200 OK` | Portal |
| `GET` | `/robots.txt` | `robotsTxt` | - | `text/plain`: `string` | Both |
| `POST` | `/robots.txt` | `updateRobotsTxt` | `text/plain`: `string` | `200 OK` | Portal |
| `GET` | `/llms.txt` | `llmsTxt` | - | `text/plain`: `string` | Both |
| `POST` | `/llms.txt` | `updateLlmsTxt` | `text/plain`: `string` | `200 OK` | Portal |
| `GET` | `/site-settings/scripts` | `getPublicScripts` | - | `SiteSettingsResponseDto` | Web |

---

### 2.4. News Controller (`news-controller`)

Manages press releases and news items under `/xeber`. Root titles and section titles use multilingual `TitleDto` (`az`, `en`, `ru`).

| Method | Endpoint | Operation ID | Parameters | Request Body | Response Schema | Scope |
|---|---|---|---|---|---|---|
| `GET` | `/xeber` | `getAll` | - | - | `XeberResponseDto[]` | Both |
| `POST` | `/xeber` | `create` | - | `XeberRequestDto` | `XeberResponseDto` | Portal |
| `GET` | `/xeber/{id}` | `getById` | Path: `id` (int64) | - | `XeberResponseDto` | Both |
| `PUT` | `/xeber/{id}` | `update` | Path: `id` (int64) | `XeberRequestDto` | `XeberResponseDto` | Portal |
| `DELETE` | `/xeber/{id}` | `delete` | Path: `id` (int64) | - | `200 OK` | Portal |
| `GET` | `/xeber/search` | `search_1` | Query: `keyword` (string), `pageable` (`Pageable`) | - | `PageXeberResponseDto` | Both |
| `GET` | `/xeber/category/{category}` | `getByCategory` | Path: `category` (string)<br>Query: `pageable` (`Pageable`) | - | `PageXeberResponseDto` | Both |
| `GET` | `/xeber/admin/all` | `getAllForAdmin` | Query: `pageable` (`Pageable`) | - | `PageXeberResponseDto` | Portal |

---

### 2.5. Article Controller (`article-controller`)

Manages professional psychologist articles under `/meqale`. Root titles and section titles use multilingual `TitleDto` (`az`, `en`, `ru`). In response, the multilingual title is mapped to `titleDto`. Formally supports SEO metadata (`metaTitle`, `metaDescription`, `slug`).

| Method | Endpoint | Operation ID | Parameters | Request Body | Response Schema | Scope |
|---|---|---|---|---|---|---|
| `GET` | `/meqale` | `getAll_1` | - | - | `MeqaleResponseDto[]` | Both |
| `POST` | `/meqale` | `create_2` | - | `MeqaleRequestDto` | `MeqaleResponseDto` | Portal |
| `GET` | `/meqale/{id}` | `getById_1` | Path: `id` (int64) | - | `MeqaleResponseDto` | Both |
| `PUT` | `/meqale/{id}` | `update_2` | Path: `id` (int64) | `MeqaleRequestDto` | `MeqaleResponseDto` | Portal |
| `DELETE` | `/meqale/{id}` | `delete_2` | Path: `id` (int64) | - | `200 OK` | Portal |
| `GET` | `/meqale/search` | `search_2` | Query: `keyword` (string), `pageable` (`Pageable`) | - | `PageMeqaleResponseDto` | Both |
| `GET` | `/meqale/category/{category}` | `getByCategory_1` | Path: `category` (string)<br>Query: `pageable` (`Pageable`) | - | `PageMeqaleResponseDto` | Both |
| `GET` | `/meqale/admin/all` | `getAllForAdmin_1` | Query: `pageable` (`Pageable`) | - | `PageMeqaleResponseDto` | Portal |

---

### 2.6. Blog Controller (`blog-controller`)

Manages general blog posts and educational reads under `/blog`. Root titles and section titles use multilingual `TitleDto` (`az`, `en`, `ru`). Section title and text are required. Includes SEO metadata (`metaTitle`, `metaDescription`, `slug`) across both request and response.

| Method | Endpoint | Operation ID | Parameters | Request Body | Response Schema | Scope |
|---|---|---|---|---|---|---|
| `GET` | `/blog` | `getAll_2` | - | - | `BlogResponse[]` | Both |
| `POST` | `/blog` | `create_4` | - | `BlogRequest` | `BlogResponse` | Portal |
| `GET` | `/blog/{id}` | `getById_2` | Path: `id` (int64) | - | `BlogResponse` | Both |
| `PUT` | `/blog/{id}` | `update_4` | Path: `id` (int64) | `BlogRequest` | `BlogResponse` | Portal |
| `DELETE` | `/blog/{id}` | `delete_4` | Path: `id` (int64) | - | `200 OK` | Portal |
| `GET` | `/blog/search` | `search_3` | Query: `keyword` (string), `pageable` (`Pageable`) | - | `PageBlogResponse` | Both |
| `GET` | `/blog/category/{category}` | `getByCategory_2` | Path: `category` (string)<br>Query: `pageable` (`Pageable`) | - | `PageBlogResponse` | Both |

---

### 2.7. Gallery Controller (`gallery-controller`)

Manages media assets and photos/videos categorized by clinic, sessions, or events.

| Method | Endpoint | Operation ID | Parameters | Request Body | Response Schema | Scope |
|---|---|---|---|---|---|---|
| `GET` | `/gallery` | `getItems` | Query: `category` (string, optional)<br>Query: `sort` (string, default: `popularity`)<br>Query: `page` (int32, default: `0`)<br>Query: `size` (int32, default: `8`) | - | `PageGalleryItemResponse` | Both |
| `POST` | `/gallery` | `create_3` | - | `GalleryItemRequest` | `GalleryItemResponse` | Portal |
| `PUT` | `/gallery/{id}` | `update_3` | Path: `id` (int64) | `GalleryItemRequest` | `GalleryItemResponse` | Portal |
| `DELETE` | `/gallery/{id}` | `delete_3` | Path: `id` (int64) | - | `200 OK` | Portal |

---

### 2.8. Training Controller (`training-controller`)

Manages psychologist workshops, webinars, masterclasses, and user registrations.

| Method | Endpoint | Operation ID | Parameters | Request Body | Response Schema | Scope |
|---|---|---|---|---|---|---|
| `GET` | `/trainings` | `search` | Query: `type` (`ONLINE` \| `IN_PERSON`, optional)<br>Query: `search` (string, optional)<br>Query: `pageable` (`Pageable`, required) | - | `PageTrainingResponse` | Both |
| `POST` | `/trainings` | `create_1` | - | `TrainingRequest` | `TrainingResponse` | Portal |
| `PUT` | `/trainings/{id}` | `update_1` | Path: `id` (int64) | `TrainingRequest` | `TrainingResponse` | Portal |
| `DELETE` | `/trainings/{id}` | `delete_1` | Path: `id` (int64) | - | `200 OK` | Portal |
| `POST` | `/trainings/{trainingId}/register` | `register` | Path: `trainingId` (int64) | - | `200 OK` | Web |
| `DELETE` | `/trainings/{trainingId}/register` | `unregister` | Path: `trainingId` (int64) | - | `200 OK` | Web |
| `GET` | `/trainings/type-counts` | `getTypeCounts` | - | - | `TrainingTypeCountResponse[]` | Both |
| `GET` | `/trainings/popular-tags` | `getPopularTags` | Query: `limit` (int32, default: `10`, optional) | - | `string[]` | Both |
| `GET` | `/trainings/calendar` | `getMonth` | Query: `year` (int32, required)<br>Query: `month` (int32, required) | - | `TrainingResponse[]` | Both |

---

### 2.9. Appointments Controller (`appointment-controller`)

Handles patient-doctor consultations, status transitions, SOAP notes, LiveKit video rooms, and dashboard metrics.

| Method | Endpoint | Operation ID | Parameters | Request Body | Response Schema | Scope |
|---|---|---|---|---|---|---|
| `GET` | `/appointments` | `getMyAppointments` | Query: `range` (string, optional) | - | `AppointmentDto[]` | Both |
| `POST` | `/appointments` | `create_5` | - | `CreateAppointmentRequest` | `AppointmentDto` | Web |
| `GET` | `/appointments/{doctorId}` | `getById_4` | Path: `doctorId` (int64) | - | `AppointmentDto[]` | Both |
| `PATCH` | `/appointments/{id}/status` | `updateStatus_1` | Path: `id` (int64) | `UpdateUserStatusRequest` | `AppointmentDto` | Portal |
| `PATCH` | `/appointments/{id}/cancel` | `cancel` | Path: `id` (int64) | - | `AppointmentDto` | Both |
| `GET` | `/appointments/{id}/notes` | `getNote` | Path: `id` (int64) | - | `SessionNoteDto` | Portal |
| `POST` | `/appointments/{id}/notes` | `addNote` | Path: `id` (int64) | `CreateSessionNoteRequest` | `SessionNoteDto` | Portal |
| `POST` | `/appointments/{id}/join-token` | `getJoinToken` | Path: `id` (int64) | - | `Record<string, string>` | Both |
| `POST` | `/appointments/doctors/me/profile-image` | `uploadProfileImage` | - | `multipart/form-data`: `file` (binary) | `Record<string, string>` | Portal |
| `GET` | `/appointments/stats` | `getStats` | - | - | `AppointmentStatsDto` | Portal |
| `GET` | `/appointments/doctor/stats` | `getDoctorStats` | - | - | `AppointmentStatsDto` | Portal |

---

### 2.10. Doctor, Profile, and Working Hour Controllers

#### Doctor Controller (`doctor-controller`)
| Method | Endpoint | Operation ID | Parameters | Request Body | Response Schema | Scope |
|---|---|---|---|---|---|---|
| `POST` | `/doctors/register` | `registerDoctor` | - | `multipart/form-data`: `DoctorRegisterDto` | `string` | Web |
| `GET` | `/doctors/me/patients` | `getMyPatients` | - | - | `PasientRegisterEntity[]` | Portal |
| `GET` | `/doctors/doctors` | `getAllDoctors_2` | - | - | `DoctorResponseDto[]` | Portal |

#### Doctor Profile Controller (`doctor-profile-controller`)
| Method | Endpoint | Operation ID | Parameters | Response Schema | Scope |
|---|---|---|---|---|---|
| `GET` | `/doctors` | `getAllDoctors_1` | - | `DoctorDto[]` | Both |
| `GET` | `/doctors/{id}` | `getDoctorProfile` | Path: `id` (int64) | `DoctorDto` | Both |

#### Working Hour Controller (`working-hour-controller`)
| Method | Endpoint | Operation ID | Parameters | Request Body | Response Schema | Scope |
|---|---|---|---|---|---|---|
| `GET` | `/doctors/me/working-hours/template` | `getMyTemplate` | - | - | `DayTemplate[]` | Portal |
| `POST` | `/doctors/me/working-hours/template` | `saveMyTemplate` | - | `SaveWeeklyTemplateRequest` | `200 OK` | Portal |
| `GET` | `/doctors/{doctorId}/working-hours/available` | `getAvailableSlots` | Path: `doctorId` (int64)<br>Query: `from` (date, required)<br>Query: `to` (date, required) | - | `AvailableSlotDto[]` | Both |

---

### 2.11. BPM Organization Controller (`bpm-controller`)

Used by BPM administrators to manage assigned patients and view medical staff.

| Method | Endpoint | Operation ID | Response Schema | Scope |
|---|---|---|---|---|
| `GET` | `/bpm/patients` | `getPatients` | `PasientRegisterEntity[]` | Portal |
| `GET` | `/bpm/doctors` | `getDoctors` | `DoctorResponseDto[]` | Portal |

---

### 2.12. Super Admin Controller (`super-admin-controller`)

Used by NexusMind super administrators to manage all platform doctors and patients.

| Method | Endpoint | Operation ID | Parameters | Response Schema | Scope |
|---|---|---|---|---|---|
| `GET` | `/nexusmind/patients` | `getAllPatients` | - | `object[]` | Portal |
| `GET` | `/nexusmind/doctors` | `getAllDoctors` | - | `DoctorEntity[]` | Portal |
| `DELETE` | `/nexusmind/doctors/{id}` | `deleteDoctor` | Path: `id` (int64) | `200 OK` | Portal |

---

### 2.13. Supporting Utility Controllers

#### Onboarding Controller (`onboarding-controller`)
| Method | Endpoint | Operation ID | Headers / Parameters | Request Body | Response Schema | Scope |
|---|---|---|---|---|---|---|
| `POST` | `/onboarding/submit` | `submit` | Header: `Authorization` (string) | `OnboardingRequest` | `OnboardingResponse` | Web |
| `GET` | `/onboarding/status` | `status` | Header: `Authorization` (string) | - | `boolean` | Web |
| `GET` | `/onboarding/me` | `getMine` | Header: `Authorization` (string) | - | `OnboardingResponse` | Web |

#### OTP Controller (`otp-controller`)
| Method | Endpoint | Operation ID | Request Body | Response Schema | Scope |
|---|---|---|---|---|---|
| `POST` | `/otp/verify` | `verifyOtp` | `VerifyOtpRequest` | `string` | Both |

#### Journal Controller (`journal-controller`)
| Method | Endpoint | Operation ID | Parameters | Request Body | Response Schema | Scope |
|---|---|---|---|---|---|---|
| `POST` | `/journal` | `saveToday` | - | `JournalEntryRequest` | `JournalEntryResponse` | Web |
| `GET` | `/journal/today` | `getToday` | - | - | `JournalEntryResponse` | Web |
| `GET` | `/journal/history` | `getHistory` | Query: `page` (int32, default: `0`)<br>Query: `size` (int32, default: `10`) | - | `PageJournalEntryResponse` | Web |
| `GET` | `/journal/{id}` | `getById_3` | Path: `id` (int64) | - | `JournalEntryResponse` | Web |
| `DELETE` | `/journal/{id}` | `delete_5` | Path: `id` (int64) | - | `200 OK` | Web |

#### Chat Controller (`chat-rest-controller`)
| Method | Endpoint | Operation ID | Headers / Parameters | Response Schema | Scope |
|---|---|---|---|---|---|
| `GET` | `/chat/{appointmentId}/messages` | `getMessages` | Path: `appointmentId` (int64)<br>Header: `Authorization` (string) | `ChatMessageResponseDto[]` | Both |

#### Webhook Controller (`webhook-controller`)
| Method | Endpoint | Operation ID | Headers | Request Body | Response Schema | Scope |
|---|---|---|---|---|---|---|
| `POST` | `/api/webhooks/livekit` | `receiveWebhook` | Header: `Authorization` (string) | `application/webhook+json`: `string` | `string` | Webhook / Server |

---

### 2.14. File Upload Controller (`file-upload-controller`)

Handles multipart binary file uploads and asset storage across content domains (News, Articles, Blogs, Gallery, etc.).

| Method | Endpoint | Operation ID | Parameters / Headers | Request Body | Response Schema | Scope |
|---|---|---|---|---|---|---|
| `POST` | `/upload` | `uploadImage` | Query: `folder` (string, optional - e.g. `news`, `blogs`, `articles`, `gallery`)<br>Header: `Authorization` (string) | `multipart/form-data`:<br>`file` (binary, required) | `FileUploadResponseDto` | Both (Portal & Web) |

---

## 3. Data Transfer Objects & Schemas Reference

All DTOs corresponding to backend `components.schemas`:

### 3.0. Common Multilingual Models

Shared model across all multi-language content controllers (News, Articles, Blogs).

```typescript
export interface TitleDto {
  az: string // e.g. "Başlıq mətni"
  en: string // e.g. "Title text"
  ru: string // e.g. "Заголовок"
}
```

### 3.1. Authentication & User Profile DTOs

```typescript
export interface LoginRequest {
  email: string
  password: string
}

export interface AdminLoginRequest {
  username: string
  password: string
}

export interface DoctorLoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string // min: 8, max: 50, pattern: ^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$
  confirmPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordWithOtpRequest {
  email: string
  otp: string
  newPassword: string
  confirmPassword: string
}

export interface VerifyOtpRequest {
  email?: string
  otp?: string
}

export interface UpdateNameRequest {
  name: string
  surname?: string
}

export interface UpdateEmailRequest {
  newEmail: string
}

export interface UpdateLanguageRequest {
  language: 'AZ' | 'EN' | 'RU'
}

export interface UpdateProfileStatusRequest {
  status: 'TELEBE' | 'ISCI' | 'DIGER'
}

export interface ProfileResponse {
  id: number
  name?: string
  surname?: string
  email?: string
  profileImageUrl?: string
  status?: 'TELEBE' | 'ISCI' | 'DIGER'
  language?: 'AZ' | 'EN' | 'RU'
  twoFactorEnabled?: boolean
}

export interface PasientRegisterDto {
  name: string
  surname: string
  age?: number // min: 17, max: 45
  email: string
  password: string
  phone?: string // pattern: ^\+994(50|51|55|70|77|10|99)\d{7}$
}

export interface PasientRegisterEntity {
  id: number
  name?: string
  surname?: string
  email?: string
  age: number
  password?: string
  phone?: string
  deletedAt?: string
  mood?: 'SAD' | 'HAPPY' | 'TIRED' | 'CALM' | 'NORMAL'
  moodUpdatedDate?: string // YYYY-MM-DD
  profileImageUrl?: string
  status?: 'TELEBE' | 'ISCI' | 'DIGER'
  language?: 'AZ' | 'EN' | 'RU'
  twoFactorEnabled?: boolean
  appointments?: AppointmentEntity[]
  verified?: boolean
}
```

---

### 3.2. News DTOs (`/xeber`)

```typescript
export interface XeberSectionRequestDto {
  title?: TitleDto
  text?: string
}

export interface XeberSectionResponseDto {
  title?: TitleDto
  text?: string
  sectionOrder?: number
}

export interface XeberRequestDto {
  title: TitleDto // required
  shortDescription?: string
  introText?: string
  sections?: XeberSectionRequestDto[]
  quote?: string
  quoteAuthor?: string
  imageUrl?: string
  category?: string
  readTimeMinutes?: number
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  metaTitle?: string
  metaDescription?: string
  slug?: string
  schemaMarkup?: string
  metaKeywords?: string[]
}

export interface XeberResponseDto {
  id: number
  title?: TitleDto
  shortDescription?: string
  introText?: string
  sections?: XeberSectionResponseDto[]
  quote?: string
  quoteAuthor?: string
  imageUrl?: string
  category?: string
  readTimeMinutes?: number
  viewCount?: number
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  createdAt?: string
  updatedAt?: string
  metaTitle?: string
  metaDescription?: string
  slug?: string
  schemaMarkup?: string
  metaKeywords?: string[]
}

export interface PageXeberResponseDto extends Page<XeberResponseDto> {}
```

---

### 3.3. Article DTOs (`/meqale`)

```typescript
export interface MeqaleSectionRequestDto {
  title?: TitleDto
  text?: string
}

export interface MeqaleSectionResponseDto {
  title?: TitleDto
  text?: string
  sectionOrder?: number
}

export interface MeqaleHighlightCardRequestDto {
  icon?: string
  title?: string
  text?: string
}

export interface MeqaleHighlightCardResponseDto {
  icon?: string
  title?: string
  text?: string
  cardOrder?: number
}

export interface MeqaleRequestDto {
  title: TitleDto // required
  shortDescription?: string
  introText?: string
  sections?: MeqaleSectionRequestDto[]
  quote?: string
  highlightCards?: MeqaleHighlightCardRequestDto[]
  imageUrl?: string
  category?: string
  doctorId?: number
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  schemaMarkup?: string
  metaKeywords?: string[]
  metaTitle?: string
  metaDescription?: string
  slug?: string
}

export interface MeqaleResponseDto {
  id: number
  titleDto?: TitleDto // Backend response property is named 'titleDto'
  shortDescription?: string
  introText?: string
  sections?: MeqaleSectionResponseDto[]
  quote?: string
  highlightCards?: MeqaleHighlightCardResponseDto[]
  imageUrl?: string
  category?: string
  doctorId?: number
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  createdAt?: string
  updatedAt?: string
  schemaMarkup?: string
  metaKeywords?: string[]
  metaTitle?: string
  metaDescription?: string
  slug?: string
}

export interface PageMeqaleResponseDto extends Page<MeqaleResponseDto> {}
```

---

### 3.4. Blog DTOs (`/blog`)

```typescript
export interface BlogSectionRequest {
  title: TitleDto // required
  text: string // required
}

export interface BlogSectionResponse {
  title?: TitleDto
  text?: string
  order?: number
}

export interface BlogRequest {
  title: TitleDto // required
  shortDescription?: string
  introText?: string
  sections?: BlogSectionRequest[]
  imageUrl?: string
  category?: string
  authorName?: string
  schemaMarkup?: string
  metaKeywords?: string[]
  metaTitle?: string
  metaDescription?: string
  slug?: string
}

export interface BlogResponse {
  id: number
  title?: TitleDto
  shortDescription?: string
  introText?: string
  sections?: BlogSectionResponse[]
  imageUrl?: string
  category?: string
  authorName?: string
  createdAt?: string
  updatedAt?: string
  schemaMarkup?: string
  metaKeywords?: string[]
  metaTitle?: string
  metaDescription?: string
  slug?: string
}

export interface PageBlogResponse extends Page<BlogResponse> {}
```

---

### 3.5. Gallery DTOs (`/gallery`)

```typescript
export interface GalleryItemRequest {
  title: string
  thumbnailUrl: string
  mediaUrl?: string
  mediaType: 'IMAGE' | 'VIDEO'
  category: 'TERAPIYALAR' | 'OTAQLAR' | 'TELIMLER'
}

export interface GalleryItemResponse {
  id: number
  title?: string
  thumbnailUrl?: string
  mediaUrl?: string
  mediaType?: string
  category?: string
  categoryLabel?: string
  popularityScore?: number
  createdAt?: string
}

export interface PageGalleryItemResponse extends Page<GalleryItemResponse> {}
```

---

### 3.6. Training DTOs (`/trainings`)

```typescript
export interface LocalTime {
  hour?: number
  minute?: number
  second?: number
  nano?: number
}

export interface TrainingRequest {
  title: string
  tags?: string[]
  type: 'ONLINE' | 'IN_PERSON'
  trainingDate: string // YYYY-MM-DD
  trainingTime: LocalTime
  location: string
  priceAzn: number
  imageUrl?: string
  live?: boolean
}

export interface TrainingResponse {
  id: number
  title?: string
  tags?: string[]
  type?: string
  typeLabel?: string
  trainingDate?: string
  trainingTime?: LocalTime
  location?: string
  priceAzn?: number
  imageUrl?: string
  live?: boolean
}

export interface TrainingTypeCountResponse {
  value?: string
  label?: string
  count?: number
}

export interface PageTrainingResponse extends Page<TrainingResponse> {}
```

---

### 3.7. Doctor & Working Hours DTOs

```typescript
export interface DoctorRegisterDto {
  name?: string
  surname?: string
  fatherName?: string
  age?: number
  phone?: string
  cv?: File | string // binary upload
}

export interface DoctorResponseDto {
  id: number
  name?: string
  surname?: string
  fatherName?: string
  age?: number
  phone?: string
  cvUrl?: string
}

export interface DoctorDto {
  id: number
  username?: string
  fullName?: string
  title?: string
  price?: number
  experienceYear?: number
  rating?: number
  bio?: string
  imageUrl?: string
  languages?: string[]
  education?: string[]
  certificates?: string[]
  specializations?: string[]
}

export interface DoctorEntity {
  id: number
  username?: string
  name?: string
  surname?: string
  fatherName?: string
  university?: string
  major?: string
  imageURl?: string
  bio?: string
  price?: number
  age?: number
  experienceYear?: number
  profileImageUrl?: string
  email?: string
  password?: string
  title?: string
  rating?: number
  role?: 'SUPER_ADMIN' | 'BPM' | 'DOCTOR' | 'PATIENT' | 'SEO'
  languages?: string[]
  education?: string[]
  certificates?: string[]
  specializations?: string[]
}

export interface DayTemplate {
  dayOfWeek?: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
  hours?: number[]
}

export interface SaveWeeklyTemplateRequest {
  days?: DayTemplate[]
}

export interface AvailableSlotDto {
  date?: string
  time?: LocalTime
  booked?: boolean
}
```

---

### 3.8. Appointment & Session Notes DTOs

```typescript
export interface CreateAppointmentRequest {
  doctorId: number
  appointmentDate: string // YYYY-MM-DD
  appointmentTime: LocalTime
  mode: 'VR' | 'VIDEO_CALL' | 'APP'
}

export interface UpdateUserStatusRequest {
  status: 'SCHEDULED' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
}

export interface AppointmentDto {
  id: number
  patientId?: number
  patientName?: string
  doctorId?: number
  doctorName?: string
  doctorProfileImageUrl?: string
  appointmentDate?: string
  appointmentTime?: LocalTime
  status?: 'SCHEDULED' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  mode?: 'VR' | 'VIDEO_CALL' | 'APP'
  roomUrl?: string
  hasNote?: boolean
}

export interface AppointmentStatsDto {
  todayCount?: number
  weekCount?: number
  monthCount?: number
}

export interface CreateSessionNoteRequest {
  subjective: string
  objective: string
  assessment: string
  plan: string
}

export interface SessionNoteDto {
  id: number
  subjective?: string
  objective?: string
  assessment?: string
  plan?: string
}

export interface SessionNote {
  id: number
  appointment?: AppointmentEntity
  subjective?: string
  objective?: string
  assessment?: string
  plan?: string
  createdAt?: string
}

export interface AppointmentEntity {
  id: number
  pasient?: PasientRegisterEntity
  doctor?: DoctorEntity
  appointmentDate?: string
  appointmentTime?: LocalTime
  finishTime?: string
  status?: 'SCHEDULED' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  mode?: 'VR' | 'VIDEO_CALL' | 'APP'
  roomUrl?: string
  note?: SessionNote
}
```

---

### 3.9. Onboarding, Journal, & Chat DTOs

```typescript
export interface OnboardingRequest {
  addressType: 'XANIM' | 'BEY'
  therapyFormat: 'TEK' | 'CUTLUK' | 'AILE' | 'DOSTLAR'
  parentCount?: number
  childCount?: number
  femaleCount?: number
  maleCount?: number
  environments: Array<'SESSIZ' | 'YARADICI' | 'TEBIET' | 'KITABXANA' | 'MINIMALIST' | 'SEMIMI'> // 1-3 items
  concerns: Array<'AILE_PROBLEMLERI' | 'SEVGI_PROBLEMLERI' | 'TEKLIK' | 'GELECEK_QAYGISI' | 'AGIR_DEPRESSIYA' | 'XRONIKI_YORGUNLUQ'> // 1-3 items
}

export interface OnboardingResponse {
  id?: number
  addressType?: 'XANIM' | 'BEY'
  therapyFormat?: 'TEK' | 'CUTLUK' | 'AILE' | 'DOSTLAR'
  parentCount?: number
  childCount?: number
  femaleCount?: number
  maleCount?: number
  environments?: string[]
  concerns?: string[]
  completed?: boolean
}

export interface JournalEntryRequest {
  mood: 'VERY_LOW' | 'LOW' | 'NEUTRAL' | 'GOOD' | 'VERY_GOOD'
  thoughts?: string
}

export interface JournalEntryResponse {
  id: number
  entryDate?: string // YYYY-MM-DD
  mood?: string
  moodLabel?: string
  moodScore?: number
  thoughts?: string
  createdAt?: string
  updatedAt?: string
}

export interface PageJournalEntryResponse extends Page<JournalEntryResponse> {}

export interface ChatMessageResponseDto {
  id?: number
  appointmentId?: number
  senderRole?: 'SUPER_ADMIN' | 'BPM' | 'DOCTOR' | 'PATIENT' | 'SEO'
  senderId?: number
  content?: string
  sentAt?: string
}

export interface SiteSettingsResponseDto {
  customHeadScripts?: string
  customBodyScripts?: string
  robotsTxt?: string
  llmsTxt?: string
  updatedAt?: string
}

export interface FileUploadResponseDto {
  imageUrl?: string
}
```

---

### 3.10. Pagination & Sorting Generic Models

```typescript
export interface Pageable {
  page?: number // min: 0
  size?: number // min: 1
  sort?: string[]
}

export interface PageableObject {
  paged?: boolean
  pageNumber?: number
  pageSize?: number
  offset?: number
  sort?: SortObject
  unpaged?: boolean
}

export interface SortObject {
  sorted?: boolean
  empty?: boolean
  unsorted?: boolean
}

export interface Page<T> {
  totalElements?: number
  totalPages?: number
  pageable?: PageableObject
  size?: number
  content?: T[]
  number?: number
  sort?: SortObject
  numberOfElements?: number
  first?: boolean
  last?: boolean
  empty?: boolean
}
```

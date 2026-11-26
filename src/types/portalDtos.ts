// Pageable and Spring Page wrapper
export interface PageableParams {
  page?: number
  size?: number
  sort?: string
}

export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

// Backend Role enum
export type BackendRole = 'SUPER_ADMIN' | 'BPM' | 'DOCTOR' | 'PATIENT' | 'SEO'
export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type ProfileStatus = 'TELEBE' | 'ISCI' | 'DIGER'
export type ProfileLanguage = 'AZ' | 'EN' | 'RU'

// Authentication DTOs
export interface LoginRequest {
  email?: string
  username?: string
  password: string
}

export interface DoctorPanelLoginRequest {
  email: string
  password: string
}

export interface AdminLoginRequest {
  username?: string
  email?: string
  password: string
}

export interface AuthResponse {
  id?: number
  token?: string
  accessToken?: string
  refreshToken?: string
  tokenType?: string
  role?: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export interface VerifyOtpRequest {
  email?: string
  otp: string
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

// Site Settings DTOs
export interface SiteSettingsRequestDto {
  siteName?: string
  siteDescription?: string
  logoUrl?: string
  faviconUrl?: string
  contactEmail?: string
  contactPhone?: string
  footerText?: string
  maintenanceMode?: boolean
  socialLinks?: Record<string, string>
  [key: string]: unknown
}

export interface SiteSettingsResponseDto {
  customHeadScripts?: string
  customBodyScripts?: string
  robotsTxt?: string
  llmsTxt?: string
  updatedAt?: string
  custom_head_scripts?: string
  custom_body_scripts?: string
  [key: string]: unknown
}


// Multilingual Model
export interface TitleDto {
  az: string
  en: string
  ru: string
}

// Content DTOs (Xeber, Meqale, Blog, Gallery)
export interface ContentSection {
  title?: TitleDto | string
  text: string
  sectionOrder?: number
}

export interface XeberSectionRequestDto {
  title?: TitleDto
  text?: TitleDto
}

export interface XeberSectionResponseDto {
  title?: TitleDto
  text?: TitleDto
  sectionOrder?: number
}

export interface HighlightCard {
  icon?: string
  title: string
  text: string
  cardOrder?: number
}

export interface MeqaleSectionRequestDto {
  title: TitleDto   // required
  text: TitleDto    // required
}

export interface MeqaleSectionResponseDto {
  title?: TitleDto
  text?: TitleDto
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

export interface BlogSectionRequest {
  title: TitleDto
  text: TitleDto
}

export interface BlogSectionResponse {
  title?: TitleDto | string
  text?: TitleDto | string
  order?: number
}

export interface XeberRequestDto {
  title: TitleDto | string
  shortDescription?: TitleDto
  introText?: TitleDto
  sections?: XeberSectionRequestDto[]
  quote?: string
  quoteAuthor?: string
  imageUrl?: string
  category?: string
  readTimeMinutes?: number
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | string
  content?: string
  metaTitle?: string
  metaDescription?: TitleDto
  slug?: string
  schemaMarkup?: string
  metaKeywords?: string[]
}

export interface XeberResponseDto {
  id: number
  title: TitleDto | string
  shortDescription?: TitleDto
  introText?: TitleDto
  sections?: XeberSectionResponseDto[]
  quote?: string
  quoteAuthor?: string
  keywords?: string
  imageUrl?: string
  category?: string
  readTimeMinutes?: number
  viewCount?: number
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | string
  content?: string
  createdAt?: string
  updatedAt?: string
  metaTitle?: string
  metaDescription?: TitleDto
  slug?: string
  schemaMarkup?: string
  metaKeywords?: string[]
}

export interface MeqaleRequestDto {
  title: TitleDto | string
  shortDescription?: TitleDto
  introText?: TitleDto
  sections?: MeqaleSectionRequestDto[]
  quote?: string
  highlightCards?: HighlightCard[] | MeqaleHighlightCardRequestDto[]
  imageUrl?: string
  category?: string
  doctorId?: number
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | string
  author?: string
  content?: string
  keywords?: string
  schemaMarkup?: string
  metaKeywords?: string[]
  metaTitle?: string
  metaDescription?: TitleDto
  slug?: string
}

export interface MeqaleResponseDto {
  id: number
  title: TitleDto | string
  shortDescription?: TitleDto
  introText?: TitleDto
  sections?: MeqaleSectionResponseDto[]
  quote?: string
  highlightCards?: MeqaleHighlightCardResponseDto[] | HighlightCard[]
  keywords?: string
  imageUrl?: string
  category?: string
  doctorId?: number
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | string
  author?: string
  content?: string
  createdAt?: string
  updatedAt?: string
  schemaMarkup?: string
  metaKeywords?: string[]
  metaTitle?: string
  metaDescription?: TitleDto
  slug?: string
}

export interface BlogRequest {
  title: TitleDto | string
  shortDescription?: TitleDto | string
  introText?: TitleDto | string
  sections?: ContentSection[] | BlogSectionRequest[]
  imageUrl?: string
  coverImage?: string
  category?: string
  authorName?: string
  tags?: string[]
  body?: string
  metaTitle?: string
  metaDescription?: TitleDto
  slug?: string
  schemaMarkup?: string
  metaKeywords?: string[]
  // Legacy alias support
  schema_markup?: string
  meta_keywords?: string[]
}

export interface BlogResponse {
  id: number
  title: TitleDto | string
  shortDescription?: TitleDto | string
  introText?: TitleDto | string
  sections?: BlogSectionResponse[] | ContentSection[]
  imageUrl?: string
  coverImage?: string
  category?: string
  authorName?: string
  tags?: string[]
  body?: string
  metaTitle?: string
  metaDescription?: TitleDto
  slug?: string
  schemaMarkup?: string
  metaKeywords?: string[]
  // Legacy alias support
  schema_markup?: string
  meta_keywords?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface GalleryItemRequest {
  title: TitleDto
  thumbnailUrl: string
  mediaUrl?: string
  mediaType: 'IMAGE' | 'VIDEO'
  category: 'TERAPIYALAR' | 'OTAQLAR' | 'TELIMLER'
  altText?: TitleDto
}

export interface GalleryItemResponse {
  id: number
  title?: TitleDto
  altText?: TitleDto
  thumbnailUrl?: string
  mediaUrl?: string
  imageUrl?: string
  mediaType?: 'IMAGE' | 'VIDEO' | string
  category?: 'TERAPIYALAR' | 'OTAQLAR' | 'TELIMLER' | string
  categoryLabel?: string
  popularityScore?: number
  createdAt?: string
}

// Training DTOs
export interface TrainingRequest {
  title: string
  tags?: string[]
  type?: 'ONLINE' | 'IN_PERSON' | string
  trainingDate?: string // YYYY-MM-DD
  trainingTime?: LocalTime
  location?: string
  priceAzn?: number
  imageUrl?: string
  live?: boolean
  description?: string
  date?: string
  durationMinutes?: number
  maxParticipants?: number
}

export interface TrainingResponse {
  id: number
  title: string
  tags?: string[]
  type?: string
  typeLabel?: string
  trainingDate?: string
  trainingTime?: LocalTime
  location?: string
  priceAzn?: number
  imageUrl?: string
  live?: boolean
  description?: string
  date?: string
  durationMinutes?: number
  maxParticipants?: number
  registeredCount?: number
}

export interface TrainingTypeCountResponse {
  value?: string
  label?: string
  count?: number
}

// Doctor Working Hours DTOs (date-based ranges)
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

/** Wire format for LocalTime: backend accepts/returns "HH:mm:ss" strings (or legacy objects). */
export type LocalTimeValue = LocalTime | string | number[]

/** POST /doctors/me/working-hours */
export interface WorkingHourRangeRequest {
  date: string // YYYY-MM-DD, e.g. "2026-11-20"
  startTime: string // HH:mm, e.g. "10:00"
  endTime: string // HH:mm, e.g. "11:00"
}

/** POST /doctors/me/working-hours/batch */
export interface WorkingDayRequest {
  date?: string // YYYY-MM-DD
  times?: Array<LocalTime | string> // Backend LocalTime wire format ("HH:mm:ss")
}

export interface WorkingHoursBatchRequest {
  days?: WorkingDayRequest[]
}

/** GET /doctors/me/working-hours?from&to */
export interface WorkingRangeDto {
  id: number
  date?: string // "DD.MM.YYYY" (e.g. "20.11.2026") or "YYYY-MM-DD"
  startTime?: string | LocalTimeValue // HH:mm, e.g. "10:00"
  endTime?: string | LocalTimeValue // HH:mm, e.g. "11:00"
}

export interface AvailableSlotDto {
  date?: string
  time?: LocalTimeValue
  booked?: boolean
}

// Doctor Price DTOs (doctor-price-controller)
export interface DoctorPriceRequest {
  label: string
  minAge?: number
  maxAge?: number
  sessionType?: string
  durationMin?: number
  durationMax?: number
  amount: number
  currency?: string
}

export interface DoctorPriceResponse {
  id: number
  doctorId?: number
  label?: string
  minAge?: number
  maxAge?: number
  sessionType?: string
  durationMin?: number
  durationMax?: number
  amount?: number
  currency?: string
}

/** Embedded (id-less) price item on DoctorResponseDto */
export type DoctorPriceDto = DoctorPriceRequest

export interface DoctorPriceEntity extends DoctorPriceRequest {
  id: number
  doctor?: DoctorEntity
}

export interface DoctorResponseDto {
  id: number
  name?: string
  surname?: string
  username?: string
  profileImageUrl?: string
  bio?: TitleDto
  major?: TitleDto
  prices?: DoctorPriceDto[]
}

export interface DoctorEntity {
  id: number
  username?: string
  name?: string
  surname?: string
  university?: string
  imageURl?: string
  profileImageUrl?: string
  email?: string
  password?: string
  major?: TitleDto
  bio?: TitleDto
  experienceYear?: number
  role?: BackendRole
  languages?: string[]
  education?: string[]
  specializations?: string[]
  trainings?: string[]
  prices?: DoctorPriceEntity[]
}

// Call invite DTOs (call-invite-controller) — responses are free-form string maps
export type CallInviteResponse = Record<string, string>

// Payment DTOs (payment-controller) — used by the patient web app; typed for completeness
export interface StartPaymentRequest {
  appointmentId?: number
  amount?: number
  description?: string
}

// Token-based password reset (password-reset-controller, /api/auth/*)
export interface ResetPasswordTokenRequest {
  token?: string
  newPassword?: string
}

// Patient & Doctor DTOs
export type PatientMood = 'SAD' | 'HAPPY' | 'TIRED' | 'CALM' | 'NORMAL'

export interface PatientDto {
  id: number
  fullName?: string
  name?: string
  email: string
  phone?: string
  status?: string
  birthDate?: string
  gender?: string
  address?: string
  mood?: PatientMood
  registeredAt?: string
  createdAt?: string
  assignedPsychologist?: string
  treatmentTag?: string
  priority?: 'High' | 'Medium' | 'Normal' | string
  sessionsTotal?: number
  lastSession?: string
  nextSession?: string
  [key: string]: unknown
}

export interface PasientRegisterDto {
  id?: number
  name?: string
  surname?: string
  fullName?: string
  email?: string
  password?: string
  phone?: string
  birthDate?: string
  age?: number
  gender?: string
  address?: string
  mood?: PatientMood
  registrationImageUrl?: string
  [key: string]: unknown
}

export interface PasientRegisterEntity {
  id: number
  name?: string
  surname?: string
  email?: string
  age?: number
  password?: string
  phone?: string
  deletedAt?: string
  mood?: PatientMood
  moodUpdatedDate?: string
  profileImageUrl?: string
  registrationImageUrl?: string
  status?: ProfileStatus | string
  language?: ProfileLanguage | string
  twoFactorEnabled?: boolean
  appointments?: AppointmentEntity[]
  verified?: boolean
  [key: string]: unknown
}

/** GET /nexusmind/patients and GET /doctors/me/patients */
export interface PasientResponseDto {
  id: number
  username?: string
  name?: string
  surname?: string
  email?: string
  age?: number
  phone?: string
  role?: BackendRole
  verified?: boolean
}

export interface DoctorDto {
  id: number
  username?: string
  fullName?: string
  name?: string
  email?: string
  specialization?: string
  specializations?: string[]
  title?: TitleDto
  price?: number
  experienceYear?: number
  rating?: number
  bio?: TitleDto
  imageUrl?: string
  avatarUrl?: string
  status?: string
  phone?: string
  licenseNumber?: string
  patientCount?: number
  sessionCount?: number
  satisfactionRate?: number
  nextAvailability?: string
  joinedDate?: string
  languages?: string[]
  education?: string[]
  certificates?: string[]
  trainings?: string[]
  /** Present on DoctorResponseDto (/nexusmind/doctors, /bpm/doctors, /doctors/doctors) */
  prices?: Array<DoctorPriceDto & { id?: number }>
  [key: string]: unknown
}

export interface DoctorRegisterDto {
  name?: string
  surname?: string
  fatherName?: string
  fullName?: string
  email?: string
  password?: string
  specialization?: string
  age?: number
  phone?: string
  cv?: File | string
}

// Profile DTOs
export interface UpdateProfileStatusRequest {
  status: ProfileStatus
}

export interface UpdateNameRequest {
  name: string
  surname?: string
}

export interface UpdateLanguageRequest {
  language: ProfileLanguage
}

export interface UpdateEmailRequest {
  newEmail: string
}

export interface ProfileResponse {
  id: number
  name?: string
  surname?: string
  email?: string
  profileImageUrl?: string
  status?: ProfileStatus
  language?: ProfileLanguage
  twoFactorEnabled?: boolean
  role?: BackendRole | string
}

// Onboarding & Journal DTOs
export type OnboardingAddressType = 'XANIM' | 'BEY'
export type OnboardingTherapyFormat = 'TEK' | 'CUTLUK' | 'AILE' | 'DOSTLAR'
export type OnboardingEnvironment =
  | 'SESSIZ'
  | 'YARADICI'
  | 'TEBIET'
  | 'KITABXANA'
  | 'MINIMALIST'
  | 'SEMIMI'
export type OnboardingConcern =
  | 'AILE_PROBLEMLERI'
  | 'SEVGI_PROBLEMLERI'
  | 'TEKLIK'
  | 'GELECEK_QAYGISI'
  | 'AGIR_DEPRESSIYA'
  | 'XRONIKI_YORGUNLUQ'

export interface OnboardingRequest {
  addressType: OnboardingAddressType
  therapyFormat: OnboardingTherapyFormat
  parentCount?: number
  childCount?: number
  femaleCount?: number
  maleCount?: number
  environments: OnboardingEnvironment[]
  concerns: OnboardingConcern[]
}

export interface OnboardingResponse {
  id?: number
  addressType?: OnboardingAddressType
  therapyFormat?: OnboardingTherapyFormat
  parentCount?: number
  childCount?: number
  femaleCount?: number
  maleCount?: number
  environments?: OnboardingEnvironment[]
  concerns?: OnboardingConcern[]
  completed?: boolean
}

export interface JournalEntryRequest {
  mood: 'VERY_LOW' | 'LOW' | 'NEUTRAL' | 'GOOD' | 'VERY_GOOD' | string
  thoughts?: string
  content?: string
  tags?: string[]
  [key: string]: unknown
}

export interface JournalEntryResponse {
  id: number
  entryDate?: string
  mood?: string
  moodLabel?: string
  moodScore?: number
  thoughts?: string
  content?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}

// SEO Management DTOs
export interface SeoScriptsDto {
  customHeadScripts?: string
  customBodyScripts?: string
  custom_head_scripts?: string
  custom_body_scripts?: string
  [key: string]: unknown
}

export interface SitemapUrlEntry {
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' | string
  priority?: number
}

export interface SitemapDto {
  xml?: string
  urls?: SitemapUrlEntry[]
}

export interface RobotsTxtDto {
  content: string
}

export interface LlmsTxtDto {
  content: string
}

// Appointment & Session DTOs
export interface LocalTime {
  hour: number
  minute: number
  second?: number
  nano?: number
}

export type AppointmentStatus =
  | 'SCHEDULED'
  | 'WAITING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'PENDING_PAYMENT'

export type AppointmentMode = 'VR' | 'VIDEO_CALL' | 'APP'

export interface AppointmentDto {
  id: number
  patientId?: number
  patientName?: string
  doctorId?: number
  doctorName?: string
  doctorProfileImageUrl?: string
  appointmentDate?: string
  appointmentTime?: LocalTime | string
  status?: AppointmentStatus
  mode?: AppointmentMode
  roomUrl?: string
  hasNote?: boolean
  [key: string]: unknown
}

export interface CreateAppointmentRequest {
  doctorId: number
  appointmentDate: string // YYYY-MM-DD
  appointmentTime: string // HH:mm:ss (format: time)
  mode: AppointmentMode
  durationMinutes?: number
  sessionsType?: 'INDIVIDUAL' | 'COUPLE'
}

export interface UpdateUserStatusRequest {
  status: AppointmentStatus | string
}

export interface SessionNoteDto {
  id: number
  subjective?: string
  objective?: string
  assessment?: string
  plan?: string
  [key: string]: unknown
}

export interface CreateSessionNoteRequest {
  subjective: string
  objective: string
  assessment: string
  plan: string
}

export interface AppointmentStatsDto {
  todayCount?: number
  weekCount?: number
  monthCount?: number
  totalAppointments?: number
  completedAppointments?: number
  upcomingAppointments?: number
  cancelledAppointments?: number
  [key: string]: unknown
}

export interface LiveKitJoinTokenResponse {
  token?: string
  serverUrl?: string
  roomName?: string
  livekitUrl?: string
  [key: string]: unknown
}


export interface ChatMessageResponseDto {
  id?: number | string
  appointmentId?: number | string
  senderId?: number | string
  senderName?: string
  senderRole?: string
  message?: string
  content?: string
  timestamp?: string
  sentAt?: string
  createdAt?: string
  [key: string]: unknown
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
  appointmentTime?: LocalTime | string
  finishTime?: string
  durationMinutes?: number
  sessionsType?: 'INDIVIDUAL' | 'COUPLE'
  status?: AppointmentStatus
  mode?: AppointmentMode
  roomUrl?: string
  createdAt?: string
  note?: SessionNote
}

// Notification DTOs (notification-controller)
export type EmailTemplate =
  | 'SESSION_REMINDER_24H'
  | 'SESSION_REMINDER_3H'
  | 'SESSION_REMINDER_30MIN'
  | 'OTP_CODE'
  | 'SESSION_CONFIRMED'
  | 'RESCHEDULE_CONFIRMED'
  | 'RESCHEDULE_REQUEST'
  | 'SPECIALIST_AVAILABILITY'
  | 'PAYMENT_RECEIPT'
  | 'SESSION_FEEDBACK'
  | 'RECOMMENDED_MATERIALS'
  | 'MILESTONE'
  | 'HABIT_DAILY'
  | 'MOOD_CHECK'
  | 'BREATHING'
  | 'JOURNAL'
  | 'PSYCH_FACT'
  | 'DAILY_RECOMMENDATION'
  | 'PODCAST_AND_BOOK_OF_DAY'
  | 'SCHEDULE_UPDATED'
  | 'FAVORITE_AVAILABLE'
  | 'WELCOME'
  | 'GUIDE_NEKSI'
  | 'FIRST_SESSION'
  | 'INACTIVE_15_DAYS'
  | 'INACTIVE_30_DAYS'
  | 'INACTIVE_60_DAYS'
  | 'NEW_SPECIALISTS'

export interface EmailNotificationRequest {
  to: string
  template: EmailTemplate
  params?: Record<string, string>
}

export interface EmailNotificationResponse {
  success: boolean
  message: string
  template: EmailTemplate
  sentAt: string
}

// Search DTOs (search-controller)
export interface DoctorSearchResult {
  id: number
  fullName?: string
  bio?: string
}

export interface ContentSearchResult {
  type: string
  id: number
  title: string
}

export type FileUploadRawResponse = string

export interface FileUploadResponse {
  imageUrl: string
  [key: string]: unknown
}

export type FileUploadResponseDto = FileUploadResponse




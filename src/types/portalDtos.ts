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
  token?: string
  accessToken?: string
  refreshToken?: string
  tokenType?: string
  role?: string
}

export interface ChangePasswordRequest {
  oldPassword?: string
  currentPassword?: string
  newPassword: string
}

export interface VerifyOtpRequest {
  email?: string
  otp: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordWithOtpRequest {
  email?: string
  phone?: string
  otp: string
  newPassword: string
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
  id?: number
  siteName?: string
  siteDescription?: string
  logoUrl?: string
  faviconUrl?: string
  contactEmail?: string
  contactPhone?: string
  footerText?: string
  maintenanceMode?: boolean
  socialLinks?: Record<string, string>
  updatedAt?: string
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
  title?: TitleDto | string
  text?: string
}

export interface XeberSectionResponseDto {
  title?: TitleDto | string
  text?: string
  sectionOrder?: number
}

export interface HighlightCard {
  icon?: string
  title: string
  text: string
  cardOrder?: number
}

export interface MeqaleSectionRequestDto {
  title?: TitleDto | string
  text?: string
}

export interface MeqaleSectionResponseDto {
  title?: TitleDto | string
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

export interface BlogSectionRequest {
  title: TitleDto | string
  text: string
}

export interface BlogSectionResponse {
  title?: TitleDto | string
  text?: string
  order?: number
}

export interface XeberRequestDto {
  title: TitleDto | string
  shortDescription?: string
  introText?: string
  sections?: ContentSection[] | XeberSectionRequestDto[]
  quote?: string
  quoteAuthor?: string
  imageUrl?: string
  category?: string
  readTimeMinutes?: number
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | string
  content?: string
  metaTitle?: string
  metaDescription?: string
  slug?: string
  schemaMarkup?: string
  metaKeywords?: string[]
}

export interface XeberResponseDto {
  id: number
  title: TitleDto | string
  shortDescription?: string
  introText?: string
  sections?: XeberSectionResponseDto[] | ContentSection[]
  quote?: string
  quoteAuthor?: string
  imageUrl?: string
  category?: string
  readTimeMinutes?: number
  viewCount?: number
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | string
  content?: string
  createdAt?: string
  updatedAt?: string
  metaTitle?: string
  metaDescription?: string
  slug?: string
  schemaMarkup?: string
  metaKeywords?: string[]
}

export interface MeqaleRequestDto {
  title: TitleDto | string
  shortDescription?: string
  introText?: string
  sections?: ContentSection[] | MeqaleSectionRequestDto[]
  quote?: string
  highlightCards?: HighlightCard[] | MeqaleHighlightCardRequestDto[]
  imageUrl?: string
  category?: string
  doctorId?: number
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | string
  author?: string
  content?: string
  schemaMarkup?: string
  metaKeywords?: string[]
  metaTitle?: string
  metaDescription?: string
  slug?: string
}

export interface MeqaleResponseDto {
  id: number
  title: TitleDto | string
  titleDto?: TitleDto
  shortDescription?: string
  introText?: string
  sections?: MeqaleSectionResponseDto[] | ContentSection[]
  quote?: string
  highlightCards?: MeqaleHighlightCardResponseDto[] | HighlightCard[]
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
  metaDescription?: string
  slug?: string
}

export interface BlogRequest {
  title: TitleDto | string
  shortDescription?: string
  introText?: string
  sections?: ContentSection[] | BlogSectionRequest[]
  imageUrl?: string
  coverImage?: string
  category?: string
  authorName?: string
  tags?: string[]
  body?: string
  metaTitle?: string
  metaDescription?: string
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
  shortDescription?: string
  introText?: string
  sections?: BlogSectionResponse[] | ContentSection[]
  imageUrl?: string
  coverImage?: string
  category?: string
  authorName?: string
  tags?: string[]
  body?: string
  metaTitle?: string
  metaDescription?: string
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
  title?: string
  thumbnailUrl?: string
  mediaUrl: string
  imageUrl?: string
  mediaType?: 'IMAGE' | 'VIDEO' | string
  category?: 'TERAPIYALAR' | 'OTAQLAR' | 'TELIMLER' | string
}

export interface GalleryItemResponse {
  id: number
  title?: string
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
  description: string
  type?: string
  date?: string
  durationMinutes?: number
  maxParticipants?: number
}

export interface TrainingResponse {
  id: number
  title: string
  description: string
  type?: string
  date?: string
  durationMinutes?: number
  maxParticipants?: number
  registeredCount?: number
}

// Doctor Working Hours DTOs
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

export interface DaySchedule {
  dayOfWeek: DayOfWeek
  hours: number[]
}

export interface SaveScheduleRequest {
  days: DaySchedule[]
}

// GET response from /doctors/me/working-hours/template mirrors the POST body
export type WorkingHoursResponse = SaveScheduleRequest

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
  fullName?: string
  email?: string
  password?: string
  phone?: string
  birthDate?: string
  gender?: string
  address?: string
  mood?: PatientMood
  [key: string]: unknown
}

export interface DoctorDto {
  id: number
  fullName?: string
  name?: string
  email: string
  specialization?: string
  status?: string
  phone?: string
  avatarUrl?: string
  licenseNumber?: string
  patientCount?: number
  sessionCount?: number
  satisfactionRate?: number
  nextAvailability?: string
  joinedDate?: string
  [key: string]: unknown
}

export interface DoctorRegisterDto {
  fullName: string
  email: string
  password: string
  specialization: string
  phone?: string
}

// Profile DTOs
export interface UpdateProfileStatusRequest {
  status: string
}

export interface UpdateNameRequest {
  name: string
}

export interface UpdateLanguageRequest {
  language: string
}

export interface UpdateEmailRequest {
  newEmail?: string
  email?: string
}

export interface ProfileResponse {
  id: number
  name: string
  email: string
  status?: string
  language?: string
  twoFactorEnabled?: boolean
  role?: string
}

// Onboarding & Journal DTOs
export interface OnboardingRequest {
  answers?: Record<string, unknown>
  [key: string]: unknown
}

export interface OnboardingResponse {
  id?: number
  status?: string
  [key: string]: unknown
}

export interface JournalEntryRequest {
  content: string
  mood?: string
  tags?: string[]
  [key: string]: unknown
}

export interface JournalEntryResponse {
  id: number
  content: string
  createdAt?: string
  [key: string]: unknown
}

// SEO Management DTOs
export interface SeoScriptsDto {
  custom_head_scripts?: string
  custom_body_scripts?: string
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

export type AppointmentMode = 'VR' | 'VIDEO_CALL' | 'APP'

export interface AppointmentDto {
  id: number
  patientName?: string
  doctorName?: string
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
  appointmentDate: string
  appointmentTime: LocalTime | string
  mode: AppointmentMode
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
  subjective?: string
  objective?: string
  assessment?: string
  plan?: string
}

export interface AppointmentStatsDto {
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
  message: string
  timestamp?: string
  createdAt?: string
  [key: string]: unknown
}

export interface FileUploadResponse {
  imageUrl: string
  [key: string]: unknown
}

export type FileUploadResponseDto = FileUploadResponse




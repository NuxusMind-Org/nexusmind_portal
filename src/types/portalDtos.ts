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
  title?: TitleDto
  altText?: TitleDto
  thumbnailUrl?: string
  mediaUrl: string
  imageUrl?: string
  mediaType?: 'IMAGE' | 'VIDEO' | string
  category?: 'TERAPIYALAR' | 'OTAQLAR' | 'TELIMLER' | string
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

export type DayTemplate = DaySchedule

export interface SaveScheduleRequest {
  days: DaySchedule[]
}

export interface SaveWeeklyTemplateRequest {
  days?: DayTemplate[]
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
  status?: 'TELEBE' | 'ISCI' | 'DIGER' | string
  language?: 'AZ' | 'EN' | 'RU' | string
  twoFactorEnabled?: boolean
  appointments?: AppointmentDto[]
  verified?: boolean
  [key: string]: unknown
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

export interface FileUploadResponse {
  imageUrl: string
  [key: string]: unknown
}

export type FileUploadResponseDto = FileUploadResponse




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

export interface AdminLoginRequest {
  username?: string
  email?: string
  password: string
}

export interface AuthResponse {
  token?: string
  accessToken?: string
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
  [key: string]: any
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
  [key: string]: any
}


// Content DTOs (Xeber, Meqale, Blog, Gallery)
export interface ContentSection {
  title?: string
  text: string
}

export interface HighlightCard {
  icon?: string
  title: string
  text: string
}

export interface XeberRequestDto {
  title: string
  shortDescription?: string
  introText?: string
  sections?: ContentSection[]
  quote?: string
  quoteAuthor?: string
  imageUrl?: string
  category?: string
  readTimeMinutes?: number
  status?: 'DRAFT' | 'PUBLISHED' | string
  content?: string
}

export interface XeberResponseDto {
  id: number
  title: string
  shortDescription?: string
  introText?: string
  sections?: ContentSection[]
  quote?: string
  quoteAuthor?: string
  imageUrl?: string
  category?: string
  readTimeMinutes?: number
  status?: 'DRAFT' | 'PUBLISHED' | string
  content?: string
  createdAt?: string
  updatedAt?: string
}

export interface MeqaleRequestDto {
  title: string
  shortDescription?: string
  introText?: string
  sections?: ContentSection[]
  quote?: string
  highlightCards?: HighlightCard[]
  imageUrl?: string
  category?: string
  doctorId?: number
  status?: 'DRAFT' | 'PUBLISHED' | string
  author?: string
  content?: string
}

export interface MeqaleResponseDto {
  id: number
  title: string
  shortDescription?: string
  introText?: string
  sections?: ContentSection[]
  quote?: string
  highlightCards?: HighlightCard[]
  imageUrl?: string
  category?: string
  doctorId?: number
  status?: 'DRAFT' | 'PUBLISHED' | string
  author?: string
  content?: string
  createdAt?: string
}

export interface BlogRequest {
  title: string
  shortDescription?: string
  introText?: string
  sections?: ContentSection[]
  imageUrl?: string
  coverImage?: string
  category?: string
  authorName?: string
  tags?: string[]
  body?: string
  schema_markup?: string
  meta_keywords?: string[]
}

export interface BlogResponse {
  id: number
  title: string
  shortDescription?: string
  introText?: string
  sections?: ContentSection[]
  imageUrl?: string
  coverImage?: string
  category?: string
  authorName?: string
  tags?: string[]
  body?: string
  schema_markup?: string
  meta_keywords?: string[]
  createdAt?: string
}

export interface GalleryItemRequest {
  title?: string
  thumbnailUrl?: string
  mediaUrl: string
  imageUrl?: string
  mediaType?: 'IMAGE' | 'VIDEO' | string
  category?: string
}

export interface GalleryItemResponse {
  id: number
  title?: string
  thumbnailUrl?: string
  mediaUrl?: string
  imageUrl?: string
  mediaType?: 'IMAGE' | 'VIDEO' | string
  category?: string
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

// Patient & Doctor DTOs
export type PatientMood = 'SAD' | 'HAPPY' | 'TIRED' | 'CALM' | 'NORMAL'

export interface PatientDto {
  id: number
  fullName: string
  email: string
  phone?: string
  status?: string
  registeredAt?: string
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
  [key: string]: any
}

export interface DoctorDto {
  id: number
  fullName: string
  email: string
  specialization?: string
  status?: string
  phone?: string
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
  email: string
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
  answers?: Record<string, any>
  [key: string]: any
}

export interface OnboardingResponse {
  id?: number
  status?: string
  [key: string]: any
}

export interface JournalEntryRequest {
  content: string
  mood?: string
  tags?: string[]
  [key: string]: any
}

export interface JournalEntryResponse {
  id: number
  content: string
  createdAt?: string
  [key: string]: any
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


import React, { useState, useRef } from 'react'
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  Loader2, 
  Link as LinkIcon, 
  AlertCircle, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react'
import { uploadService } from '../../api/services/uploadService'

export interface ImageUploadInputProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  helperText?: string
  accentColor?: 'violet' | 'indigo' | 'purple' | 'emerald' | 'blue'
  accept?: string
  maxSizeMB?: number
  className?: string
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  value,
  onChange,
  folder = 'general',
  label = 'Image URL / Upload',
  placeholder = 'https://... or upload an image file',
  required = false,
  disabled = false,
  helperText,
  accentColor = 'violet',
  accept = 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml',
  maxSizeMB = 10,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [previewError, setPreviewError] = useState(false)

  // Determine accent color classes
  const getAccentStyles = () => {
    switch (accentColor) {
      case 'indigo':
        return {
          borderFocus: 'focus:border-indigo-500',
          dropzoneBorder: isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-[#2e3146] hover:border-indigo-500/50',
          iconColor: 'text-indigo-400',
          badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
          button: 'bg-indigo-600 hover:bg-indigo-500 text-white',
        }
      case 'purple':
        return {
          borderFocus: 'focus:border-purple-500',
          dropzoneBorder: isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-[#2e3146] hover:border-purple-500/50',
          iconColor: 'text-purple-400',
          badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          button: 'bg-purple-600 hover:bg-purple-500 text-white',
        }
      case 'emerald':
        return {
          borderFocus: 'focus:border-emerald-500',
          dropzoneBorder: isDragging ? 'border-emerald-500 bg-emerald-500/10' : 'border-[#2e3146] hover:border-emerald-500/50',
          iconColor: 'text-emerald-400',
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          button: 'bg-emerald-600 hover:bg-emerald-500 text-white',
        }
      case 'blue':
        return {
          borderFocus: 'focus:border-blue-500',
          dropzoneBorder: isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-[#2e3146] hover:border-blue-500/50',
          iconColor: 'text-blue-400',
          badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
          button: 'bg-blue-600 hover:bg-blue-500 text-white',
        }
      case 'violet':
      default:
        return {
          borderFocus: 'focus:border-violet-500',
          dropzoneBorder: isDragging ? 'border-violet-500 bg-violet-500/10' : 'border-[#2e3146] hover:border-violet-500/50',
          iconColor: 'text-violet-400',
          badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
          button: 'bg-violet-600 hover:bg-violet-500 text-white',
        }
    }
  }

  const styles = getAccentStyles()

  const handleFile = async (file: File) => {
    setErrorMessage(null)

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMessage(`File size exceeds maximum allowed ${maxSizeMB}MB limit.`)
      return
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP, SVG, etc.).')
      return
    }

    setIsUploading(true)
    setPreviewError(false)

    try {
      const response = await uploadService.uploadFile(file, folder)
      if (response && response.imageUrl) {
        onChange(response.imageUrl)
      } else {
        throw new Error('Upload succeeded but server did not return an imageUrl.')
      }
    } catch (err: any) {
      console.error('File upload error:', err)
      const message = 
        err?.response?.data?.message || 
        err?.response?.data?.error || 
        (err?.response?.status ? `Upload failed (${err.response.status}: ${err.response.statusText || 'Server Error'})` : null) || 
        err?.message || 
        'Failed to upload image. Please try again.'
      setErrorMessage(message)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled && !isUploading) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled || isUploading) return

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleClearImage = () => {
    onChange('')
    setErrorMessage(null)
    setPreviewError(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Mode Toggle Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-300">
            {label} {required && <span className="text-rose-400">*</span>}
          </label>
          {folder && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${styles.badge}`}>
              folder: {folder}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL text' : 'Direct URL edit'}</span>
        </button>
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        disabled={disabled || isUploading}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Upload / Preview Area */}
      {value ? (
        <div className="relative p-3 bg-[#171827] border border-[#2e3146] rounded-xl flex items-center gap-3 group transition-all">
          {/* Thumbnail / Icon */}
          <div className="w-16 h-16 rounded-lg bg-[#0e0f19] border border-[#26283b] flex items-center justify-center overflow-hidden shrink-0 relative">
            {!previewError ? (
              <img
                src={value}
                alt="Upload preview"
                className="w-full h-full object-cover"
                onError={() => setPreviewError(true)}
              />
            ) : (
              <ImageIcon className="w-6 h-6 text-slate-500" />
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              </div>
            )}
          </div>

          {/* Details & Link */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-white truncate">Image Attached</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono truncate max-w-full">
              {value}
            </p>
            <div className="flex items-center gap-3 mt-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                className="text-[11px] font-medium text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <UploadCloud className="w-3 h-3" />
                <span>Replace file</span>
              </button>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-medium text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open image</span>
              </a>
            </div>
          </div>

          {/* Delete / Clear Action */}
          <button
            type="button"
            onClick={handleClearImage}
            disabled={disabled || isUploading}
            title="Remove image"
            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors shrink-0 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Empty State Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-4 bg-[#171827] flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all duration-200 ${styles.dropzoneBorder} ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <Loader2 className={`w-8 h-8 animate-spin ${styles.iconColor}`} />
              <div className="text-xs font-semibold text-white">Uploading to {folder} folder...</div>
              <div className="text-[10px] text-slate-400 font-mono">POST /upload?folder={folder}</div>
            </div>
          ) : (
            <>
              <div className={`p-2.5 rounded-full bg-[#1b1c2b] border border-[#2e3146] ${styles.iconColor}`}>
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-white">
                  <span className="underline decoration-dotted underline-offset-4">Click to browse</span> or drag and drop image
                </p>
                <p className="text-[11px] text-slate-400">
                  PNG, JPG, WEBP, SVG or GIF up to {maxSizeMB}MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Direct URL text input (Always accessible or togglable) */}
      {(showUrlInput || !value) && (
        <div className="space-y-1">
          <div className="relative">
            <input
              type="url"
              value={value}
              required={required && !value}
              disabled={disabled || isUploading}
              onChange={(e) => {
                onChange(e.target.value)
                setPreviewError(false)
                setErrorMessage(null)
              }}
              placeholder={placeholder}
              className={`w-full px-3.5 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${styles.borderFocus}`}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Helper text */}
      {helperText && !errorMessage && (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      )}
    </div>
  )
}

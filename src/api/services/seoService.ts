import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type {
  SeoScriptsDto,
  SitemapDto,
  SitemapUrlEntry,
  SiteSettingsResponseDto,
} from '../../types/portalDtos'

export const seoService = {
  // Site Scripts (<head> & <body>) from GET /site-settings/scripts
  getSiteScripts: async (): Promise<SeoScriptsDto> => {
    try {
      const response = await api.get<SiteSettingsResponseDto>(API_ENDPOINTS.SITE_SETTINGS.SCRIPTS)
      const data = response.data || {}
      return {
        customHeadScripts: data.customHeadScripts || '',
        customBodyScripts: data.customBodyScripts || '',
        custom_head_scripts: data.customHeadScripts || '',
        custom_body_scripts: data.customBodyScripts || '',
      }
    } catch (err) {
      console.warn('Could not fetch site scripts from server:', err)
      const cached = localStorage.getItem('nexusmind_seo_scripts')
      return cached ? JSON.parse(cached) : { custom_head_scripts: '', custom_body_scripts: '' }
    }
  },

  updateSiteScripts: async (data: SeoScriptsDto): Promise<SeoScriptsDto> => {
    localStorage.setItem('nexusmind_seo_scripts', JSON.stringify(data))
    // Attempt real backend write endpoint if available on server
    try {
      const response = await api.post<SiteSettingsResponseDto>(
        API_ENDPOINTS.SITE_SETTINGS.SCRIPTS,
        data
      )
      return {
        customHeadScripts: response.data.customHeadScripts,
        customBodyScripts: response.data.customBodyScripts,
        custom_head_scripts: response.data.customHeadScripts,
        custom_body_scripts: response.data.customBodyScripts,
      }
    } catch {
      // Return local data as fallback
      return data
    }
  },

  // robots.txt (GET /robots.txt & POST /robots.txt with text/plain)
  getRobotsTxt: async (): Promise<string> => {
    try {
      const response = await api.get<string>(API_ENDPOINTS.SITE_SETTINGS.ROBOTS, {
        responseType: 'text',
        transformResponse: [(d) => d],
      })
      const text = typeof response.data === 'string' ? response.data : String(response.data || '')
      localStorage.setItem('nexusmind_seo_robots', text)
      return text
    } catch (err) {
      console.warn('Could not fetch robots.txt from server:', err)
      const cached = localStorage.getItem('nexusmind_seo_robots')
      return cached || `User-agent: *\nAllow: /\n`
    }
  },

  updateRobotsTxt: async (content: string): Promise<string> => {
    await api.post(API_ENDPOINTS.SITE_SETTINGS.ROBOTS, content, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
    localStorage.setItem('nexusmind_seo_robots', content)
    return content
  },

  // sitemap.xml (GET /sitemap.xml & POST /sitemap.xml with application/xml)
  getSitemap: async (): Promise<SitemapDto> => {
    try {
      const response = await api.get<string>(API_ENDPOINTS.SITE_SETTINGS.SITEMAP, {
        responseType: 'text',
        transformResponse: [(d) => d],
      })
      const xml = typeof response.data === 'string' ? response.data : String(response.data || '')
      localStorage.setItem('nexusmind_seo_sitemap_xml', xml)

      const urls: SitemapUrlEntry[] = []
      const locMatches = xml.matchAll(/<loc>(.*?)<\/loc>/g)
      for (const match of locMatches) {
        if (match[1]) urls.push({ loc: match[1] })
      }

      return {
        xml,
        urls: urls.length > 0 ? urls : [{ loc: 'https://nexusmind.az' }],
      }
    } catch (err) {
      console.warn('Could not fetch sitemap.xml from server:', err)
      const cachedXml = localStorage.getItem('nexusmind_seo_sitemap_xml')
      return {
        xml: cachedXml || `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://nexusmind.az</loc></url>\n</urlset>`,
        urls: [{ loc: 'https://nexusmind.az' }],
      }
    }
  },

  updateSitemap: async (data: SitemapDto): Promise<SitemapDto> => {
    const xmlContent = data.xml || ''
    await api.post(API_ENDPOINTS.SITE_SETTINGS.SITEMAP, xmlContent, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
    localStorage.setItem('nexusmind_seo_sitemap_xml', xmlContent)
    return data
  },

  // llms.txt (GET /llms.txt & POST /llms.txt with text/plain)
  getLlmsTxt: async (): Promise<string> => {
    try {
      const response = await api.get<string>(API_ENDPOINTS.SITE_SETTINGS.LLMS, {
        responseType: 'text',
        transformResponse: [(d) => d],
      })
      const text = typeof response.data === 'string' ? response.data : String(response.data || '')
      localStorage.setItem('nexusmind_seo_llms', text)
      return text
    } catch (err) {
      console.warn('Could not fetch llms.txt from server:', err)
      const cached = localStorage.getItem('nexusmind_seo_llms')
      return cached || `# NexusMind\n\n> NexusMind AI platform.\n`
    }
  },

  updateLlmsTxt: async (content: string): Promise<string> => {
    await api.post(API_ENDPOINTS.SITE_SETTINGS.LLMS, content, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
    localStorage.setItem('nexusmind_seo_llms', content)
    return content
  },
}

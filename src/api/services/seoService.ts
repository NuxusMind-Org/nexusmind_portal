import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type {
  SeoScriptsDto,
  RobotsTxtDto,
  SitemapDto,
  LlmsTxtDto,
} from '../../types/portalDtos'

export const seoService = {
  // Site Scripts (<head> & <body>)
  getSiteScripts: async (): Promise<SeoScriptsDto> => {
    try {
      const response = await api.get<SeoScriptsDto>(API_ENDPOINTS.SEO.SCRIPTS)
      return response.data || {}
    } catch {
      // Fallback local storage / cache if backend endpoint returns 404
      const cached = localStorage.getItem('nexusmind_seo_scripts')
      return cached ? JSON.parse(cached) : { custom_head_scripts: '', custom_body_scripts: '' }
    }
  },

  updateSiteScripts: async (data: SeoScriptsDto): Promise<SeoScriptsDto> => {
    localStorage.setItem('nexusmind_seo_scripts', JSON.stringify(data))
    try {
      const response = await api.put<SeoScriptsDto>(API_ENDPOINTS.SEO.SCRIPTS, data)
      return response.data
    } catch {
      return data
    }
  },

  // robots.txt
  getRobotsTxt: async (): Promise<string> => {
    try {
      const response = await api.get<RobotsTxtDto | string>(API_ENDPOINTS.SEO.ROBOTS)
      if (typeof response.data === 'string') return response.data
      return response.data?.content || ''
    } catch {
      const cached = localStorage.getItem('nexusmind_seo_robots')
      return cached || `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: https://nexusmind.az/sitemap.xml`
    }
  },

  updateRobotsTxt: async (content: string): Promise<string> => {
    localStorage.setItem('nexusmind_seo_robots', content)
    try {
      await api.put(API_ENDPOINTS.SEO.ROBOTS, { content })
      return content
    } catch {
      return content
    }
  },

  // sitemap.xml
  getSitemap: async (): Promise<SitemapDto> => {
    try {
      const response = await api.get<SitemapDto>(API_ENDPOINTS.SEO.SITEMAP)
      return response.data
    } catch {
      const cached = localStorage.getItem('nexusmind_seo_sitemap')
      if (cached) return JSON.parse(cached)
      return {
        urls: [
          { loc: 'https://nexusmind.az/', priority: 1.0, changefreq: 'daily' },
          { loc: 'https://nexusmind.az/xeber', priority: 0.8, changefreq: 'daily' },
          { loc: 'https://nexusmind.az/meqale', priority: 0.8, changefreq: 'weekly' },
          { loc: 'https://nexusmind.az/blogs', priority: 0.8, changefreq: 'weekly' },
          { loc: 'https://nexusmind.az/gallery', priority: 0.6, changefreq: 'monthly' },
        ],
        xml: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://nexusmind.az/</loc>\n    <priority>1.0</priority>\n    <changefreq>daily</changefreq>\n  </url>\n</urlset>`,
      }
    }
  },

  updateSitemap: async (data: SitemapDto): Promise<SitemapDto> => {
    localStorage.setItem('nexusmind_seo_sitemap', JSON.stringify(data))
    try {
      const response = await api.put<SitemapDto>(API_ENDPOINTS.SEO.SITEMAP, data)
      return response.data
    } catch {
      return data
    }
  },

  // llms.txt
  getLlmsTxt: async (): Promise<string> => {
    try {
      const response = await api.get<LlmsTxtDto | string>(API_ENDPOINTS.SEO.LLMS)
      if (typeof response.data === 'string') return response.data
      return response.data?.content || ''
    } catch {
      const cached = localStorage.getItem('nexusmind_seo_llms')
      return (
        cached ||
        `# NexusMind Portal & Healthcare Platform\n\n> NexusMind is an AI-powered psychological healthcare & patient management platform.\n\n## Key Information\n- Platform: NexusMind Health Portal\n- API Base: https://nexusmind-889936615032.europe-west3.run.app\n- Services: Psychological consultation, Therapy sessions, Patient monitoring.`
      )
    }
  },

  updateLlmsTxt: async (content: string): Promise<string> => {
    localStorage.setItem('nexusmind_seo_llms', content)
    try {
      await api.put(API_ENDPOINTS.SEO.LLMS, { content })
      return content
    } catch {
      return content
    }
  },
}

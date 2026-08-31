import type { RouteObject } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import { RoleGuard } from '../permissions/guards'
import PsychologistsList from '../features/psychologists/pages/PsychologistsList'
import OrgPatientsList from '../features/patients/pages/OrgPatientsList'
import XeberManagement from '../features/xeber/pages/XeberManagement'
import XeberPreview from '../features/xeber/pages/XeberPreview'
import MeqaleManagement from '../features/meqale/pages/MeqaleManagement'
import MeqalePreview from '../features/meqale/pages/MeqalePreview'
import BlogManagement from '../features/blogs/pages/BlogManagement'
import BlogPreview from '../features/blogs/pages/BlogPreview'
import GalleryManagement from '../features/gallery/pages/GalleryManagement'
import GalleryPreview from '../features/gallery/pages/GalleryPreview'
import SeoManagement from '../features/seo/pages/SeoManagement'

export const organizationRoutes: RouteObject = {
  path: 'org',
  element: <RoleGuard allowedRoles={['org_admin', 'platform_admin']} />,
  children: [
    {
      element: <DashboardLayout />,
      children: [
        {
          path: 'xeber',
          element: <XeberManagement />,
        },
        {
          path: 'xeber/:id',
          element: <XeberPreview />,
        },
        {
          path: 'meqale',
          element: <MeqaleManagement />,
        },
        {
          path: 'meqale/:id',
          element: <MeqalePreview />,
        },
        {
          path: 'blogs',
          element: <BlogManagement />,
        },
        {
          path: 'blogs/:id',
          element: <BlogPreview />,
        },
        {
          path: 'gallery',
          element: <GalleryManagement />,
        },
        {
          path: 'gallery/:id',
          element: <GalleryPreview />,
        },
        {
          path: 'psychologists',
          element: <PsychologistsList />,
        },
        {
          path: 'patients',
          element: <OrgPatientsList />,
        },
        {
          path: 'seo',
          element: (
            <RoleGuard allowedRoles={['org_admin']}>
              <SeoManagement />
            </RoleGuard>
          ),
        },
      ],
    },
  ],
}

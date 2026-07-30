import type { RouteObject } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import { RoleGuard } from '../permissions/guards'
import PsychologistsList from '../features/psychologists/pages/PsychologistsList'
import OrgPatientsList from '../features/patients/pages/OrgPatientsList'
import XeberManagement from '../features/xeber/pages/XeberManagement'
import MeqaleManagement from '../features/meqale/pages/MeqaleManagement'
import BlogManagement from '../features/blogs/pages/BlogManagement'
import GalleryManagement from '../features/gallery/pages/GalleryManagement'
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
          path: 'meqale',
          element: <MeqaleManagement />,
        },
        {
          path: 'blogs',
          element: <BlogManagement />,
        },
        {
          path: 'gallery',
          element: <GalleryManagement />,
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

import { CourseSidebarIcons } from '@/components/Icons';

interface SidebarItem {
  name: string;
  icon: React.ElementType;
  link: string;
}

export const sidebarConfig = {
  getItems: (courseId: string): SidebarItem[] => [
    {
      name: 'Overview',
      icon: CourseSidebarIcons.PanelsTopLeft,
      link: `/courses/${courseId}/overview`,
    },
    {
      name: 'Materials',
      icon: CourseSidebarIcons.Database,
      link: `/courses/${courseId}/materials`,
    },
    {
      name: 'Templates',
      icon: CourseSidebarIcons.SlidersHorizontal,
      link: `/courses/${courseId}/templates`,
    },
    {
      name: 'Dashboard',
      icon: CourseSidebarIcons.LayoutDashboard,
      link: `/dashboard/courses`,
    },
  ],
};

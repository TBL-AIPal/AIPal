import { CourseSidebarIcons } from '@/components/Icons';

interface SidebarItem {
  name: string;
  icon: React.ElementType;
  link: string;
}

export const sidebarConfig = {
  getItems: (courseId: string, userRole: string): SidebarItem[] => {
    const items: SidebarItem[] = [
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
        name: 'Rooms',
        icon: CourseSidebarIcons.DoorOpen,
        link: `/courses/${courseId}/rooms`,
      },
      {
        name: 'Dashboard',
        icon: CourseSidebarIcons.LayoutDashboard,
        link: `/dashboard/courses`,
      },
    ];

    // Filter out 'Materials' and 'Templates' if the user is a student
    if (userRole === 'student') {
      return items.filter(item => item.name !== 'Materials' && item.name !== 'Templates');
    }

    return items;
  },
};

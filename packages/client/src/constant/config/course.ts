import { CourseSidebarIcons } from '@/components/Icons';

export interface SidebarItemType {
  name: string;
  icon: React.ElementType;
  link: string;
  position: string;
}

export const sidebarConfig = {
  getItems: (courseId: string, userRole: string): SidebarItemType[] => {
    const items: SidebarItemType[] = [
      // Top items
      {
        name: 'Overview',
        icon: CourseSidebarIcons.PanelsTopLeft,
        link: `/courses/${courseId}/overview`,
        position: 'top',
      },
      {
        name: 'Materials',
        icon: CourseSidebarIcons.Database,
        link: `/courses/${courseId}/materials`,
        position: 'top',
      },
      {
        name: 'Templates',
        icon: CourseSidebarIcons.SlidersHorizontal,
        link: `/courses/${courseId}/templates`,
        position: 'top',
      },
      {
        name: 'Rooms',
        icon: CourseSidebarIcons.DoorOpen,
        link: `/courses/${courseId}/rooms`,
        position: 'top',
      },
      
      // Bottom items
      {
        name: 'Dashboard',
        icon: CourseSidebarIcons.ChevronLeft,
        link: `/dashboard/courses`,
        position: 'bottom',
      },
    ];

    // Filter out 'Materials' and 'Templates' if the user is a student
    if (userRole === 'student') {
      return items.filter(item => item.name !== 'Materials' && item.name !== 'Templates');
    }

    return items;
  },
};

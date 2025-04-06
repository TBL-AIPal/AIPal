import api from '@/lib/API/auth/interceptor';

export const UpdateTutorialGroup = async ({
    courseId,
    tutorialGroupId,
    userIds,
  }: {
    courseId: string;
    tutorialGroupId: string;
    userIds: string[];
  }) => {
    try {
      await api.patch(`/courses/${courseId}/tutorial-groups/${tutorialGroupId}/users`, { userIds });
    } catch (err: any) {
      console.error('Error updating tutorial group:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to update tutorial group');
    }
  };
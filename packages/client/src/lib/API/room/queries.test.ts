import {
    GetRoomsByTemplateId,
    GetRoomsByTemplateIds,
    GetRoomById,
    GetMessagesByRoomId,
  } from './queries';
  
  import api from '@/lib/API/auth/interceptor';
  import logger from '@/lib/utils/logger';
  
  jest.mock('@/lib/API/auth/interceptor', () => ({
    get: jest.fn(),
  }));
  
  jest.mock('@/lib/utils/logger', () => jest.fn());
  
  describe('Room API Queries', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    const mockRoom = { id: 'r1', name: 'Room 1' };
    const mockMessage = { id: 'm1', content: 'Hello' };
  
    it('GetRoomsByTemplateId - success', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: [mockRoom] });
      const res = await GetRoomsByTemplateId('course1', 'template1');
      expect(api.get).toHaveBeenCalledWith('/courses/course1/templates/template1/rooms');
      expect(res).toEqual([mockRoom]);
    });
  
    it('GetRoomsByTemplateId - failure', async () => {
      (api.get as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      await expect(GetRoomsByTemplateId('c', 't')).rejects.toThrow();
      expect(logger).toHaveBeenCalledWith(expect.anything(), expect.stringContaining('template t'));
    });
  
    it('GetRoomsByTemplateIds - success', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: [mockRoom] });
      const res = await GetRoomsByTemplateIds('course1', ['t1', 't2']);
      expect(api.get).toHaveBeenCalledWith('/courses/course1/rooms', {
        params: { templateIds: 't1,t2' },
      });
      expect(res).toEqual([mockRoom]);
    });
  
    it('GetRoomsByTemplateIds - failure', async () => {
      (api.get as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      await expect(GetRoomsByTemplateIds('c', ['t'])).rejects.toThrow();
      expect(logger).toHaveBeenCalledWith(expect.anything(), expect.stringContaining('multiple templates'));
    });
  
    it('GetRoomById - success', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockRoom });
      const res = await GetRoomById('c1', 'r1');
      expect(api.get).toHaveBeenCalledWith('/courses/c1/rooms/r1');
      expect(res).toEqual(mockRoom);
    });
  
    it('GetRoomById - failure', async () => {
      (api.get as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      await expect(GetRoomById('c1', 'r1')).rejects.toThrow();
      expect(logger).toHaveBeenCalledWith(expect.anything(), expect.stringContaining('room r1'));
    });
  
    it('GetMessagesByRoomId - success', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: [mockMessage] });
      const res = await GetMessagesByRoomId('c1', 'r1');
      expect(api.get).toHaveBeenCalledWith('/courses/c1/rooms/r1/messages');
      expect(res).toEqual([mockMessage]);
    });
  
    it('GetMessagesByRoomId - failure', async () => {
      (api.get as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      await expect(GetMessagesByRoomId('c1', 'r1')).rejects.toThrow();
      expect(logger).toHaveBeenCalledWith(expect.anything(), expect.stringContaining('messages for room'));
    });
  });
  
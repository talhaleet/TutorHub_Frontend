import axiosInstance from './axiosInstance';
import { normalizeAssistantResponse } from '../utils/assistantUtils';

export const chatWithTutorAssistant = async (message, history = []) => {
  const res = await axiosInstance.post('/api/ai/tutor-assistant/chat', {
    message,
    history,
  });
  const raw = res.data?.data ?? res.data;
  return normalizeAssistantResponse(raw);
};


import { api } from './api';

export interface VerificationSubmitData {
  id_front: File;
  id_back: File;
  selfie: File;
}

export interface VerificationStatus {
  id: string;
  email: string;
  full_name: string;
  id_verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  id_verification_submitted_at: string | null;
  id_verification_reviewed_at: string | null;
  id_verification_notes: string | null;
}

export const verificationAPI = {
  submit: async (data: VerificationSubmitData) => {
    const formData = new FormData();
    formData.append('id_front', data.id_front);
    formData.append('id_back', data.id_back);
    formData.append('selfie', data.selfie);
    return api.post('/verification/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  getStatus: async (): Promise<VerificationStatus> => {
    return api.get('/verification/status');
  },
};

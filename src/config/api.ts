export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const API = {
  REQUEST_OTP: `${API_BASE_URL}/user-management/auth/request-otp`,
  VERIFY_OTP: `${API_BASE_URL}/user-management/auth/verify-otp`,
};

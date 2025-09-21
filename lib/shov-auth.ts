// Shov API client for login
// This is a minimal wrapper for the SEND-OTP and VERIFY-OTP endpoints

const SHOV_API_URL = 'https://api.shov.com'; // Replace with actual API endpoint if different
const SHOV_API_KEY = process.env.SHOV_API_KEY || '';

export async function sendOtp(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
  const res = await fetch(`${SHOV_API_URL}/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SHOV_API_KEY}`,
    },
    body: JSON.stringify({ identifier: email }),
  });
  const data = await res.json();
  if (res.ok && data.success) {
    return { success: true, message: data.message };
  }
  return { success: false, error: data.message || 'Failed to send OTP' };
}

export async function verifyOtp(email: string, pin: string): Promise<{ success: boolean; message?: string; error?: string }> {
  const res = await fetch(`${SHOV_API_URL}/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SHOV_API_KEY}`,
    },
    body: JSON.stringify({ identifier: email, pin }),
  });
  const data = await res.json();
  if (res.ok && data.success) {
    return { success: true, message: data.message };
  }
  return { success: false, error: data.message || 'Failed to verify OTP' };
}

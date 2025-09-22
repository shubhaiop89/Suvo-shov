// Shov API client for login
// This is a minimal wrapper for the SEND-OTP and VERIFY-OTP endpoints
// Shov API configuration
const SHOV_PROJECT = 'brandy'; // Updated to new project name

const SHOV_API_URL = 'https://shov.com/api'; // API endpoint remains the same
const SHOV_API_KEY = 'shov_live_97a76bd6ae43423c81425ed50f6808b8'; // Updated to new API key


export async function sendOtp(email: string): Promise<{ success: boolean; message?: string; error?: string; details?: any }> {
  // Replace 'my-project' with your actual project name if needed
  try {
    const res = await fetch(`${SHOV_API_URL}/send-otp/${SHOV_PROJECT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SHOV_API_KEY}`,
      },
      body: JSON.stringify({ identifier: email }),
    });
    let data;
    try {
      data = await res.json();
    } catch (jsonErr) {
      data = { message: 'Invalid JSON response', raw: await res.text() };
    }
    if (res.ok && data.success) {
      return { success: true, message: data.message };
    }
    return {
      success: false,
      error: `OTP Error: ${data.message || 'Failed to send OTP'} (HTTP ${res.status})`,
      details: data
    };
  } catch (err: any) {
    return { success: false, error: `Network/API error: ${err?.message || err}` };
  }
}

export async function verifyOtp(email: string, pin: string): Promise<{ success: boolean; message?: string; error?: string; details?: any }> {
  // Replace 'my-project' with your actual project name if needed
  try {
    const res = await fetch(`${SHOV_API_URL}/verify-otp/${SHOV_PROJECT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SHOV_API_KEY}`,
      },
      body: JSON.stringify({ identifier: email, pin }),
    });
    let data;
    try {
      data = await res.json();
    } catch (jsonErr) {
      data = { message: 'Invalid JSON response', raw: await res.text() };
    }
    if (res.ok && data.success) {
      return { success: true, message: data.message };
    }
    return {
      success: false,
      error: `Verify OTP Error: ${data.message || 'Failed to verify OTP'} (HTTP ${res.status})`,
      details: data
    };
  } catch (err: any) {
    return { success: false, error: `Network/API error: ${err?.message || err}` };
  }
}

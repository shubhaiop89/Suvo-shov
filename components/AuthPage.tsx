import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon, SpinnerIcon } from './icons';
import { supabase } from '../lib/supabase';
import { useLocation } from 'react-router-dom';

interface AuthPageProps {
  onClose: () => void;
}

const AuthInput: React.FC<{ id: string, type: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, disabled: boolean }> = ({ id, type, placeholder, value, onChange, disabled }) => (
  <input
    id={id}
    name={id}
    type={type}
    required
    value={value}
    onChange={onChange}
    disabled={disabled}
    placeholder={placeholder}
    autoComplete="email"
    className="w-full p-3 bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition disabled:opacity-50"
  />
);

const OtpInput: React.FC<{
  value: string[];
  onChange: (value: string[]) => void;
  disabled: boolean;
}> = ({ value, onChange, disabled }) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const digit = e.target.value.match(/[0-9]/)?.[0] || '';
    const newOtp = [...value];
    newOtp[index] = digit;
    onChange(newOtp);

    if (digit && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
    if (pasteData.length === 4) {
      const newOtp = pasteData.split('');
      onChange(newOtp);
      inputsRef.current[3]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-3" onPaste={handlePaste}>
      {Array.from({ length: 4 }).map((_, index) => (
        <input
          key={index}
          // FIX: The ref callback should not return a value. The original implicit return was invalid.
          ref={(el) => { inputsRef.current[index] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={value[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          disabled={disabled}
          className="w-14 h-14 text-center text-2xl font-semibold bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-md text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition disabled:opacity-50"
        />
      ))}
    </div>
  );
};


export const AuthPage: React.FC<AuthPageProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [view, setView] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };
  
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      }
    });

    if (authError) {
        setError(authError.message);
    } else {
        setMessage(`We've sent a code to ${email}.`);
        setView('otp');
    }
    setLoading(false);
  };
  
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const token = otp.join('');
    if (token.length !== 4) {
      setError("Please enter the complete 4-digit code.");
      setLoading(false);
      return;
    }

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });

    if (verifyError) {
      setError(verifyError.message);
      setOtp(['', '', '', '']); // Clear OTP on error
    } else if (data.session) {
      setMessage("Success! You're now logged in.");
      setTimeout(() => {
        handleClose();
        window.location.reload(); // Reload to reflect session change
      }, 1500);
    } else {
      setError("An unknown error occurred during verification.");
    }
    setLoading(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-md bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 shadow-2xl overflow-hidden rounded-2xl transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} disabled={loading} className="absolute top-4 right-4 p-1.5 text-slate-400 dark:text-zinc-500 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 z-20 disabled:opacity-50">
          <CloseIcon className="w-5 h-5" />
        </button>

        <div className="p-10 flex flex-col justify-center">
            <div className="w-full max-w-sm mx-auto text-center">
                {view === 'email' ? (
                    <>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome to Suvo</h2>
                        <p className="text-slate-500 dark:text-zinc-400 mb-8">Enter your email to log in or sign up.</p>
                    </>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Check your email</h2>
                        <p className="text-slate-500 dark:text-zinc-400 mb-8">Enter the 4-digit code we sent to your inbox to continue.</p>
                    </>
                )}

                {error && (
                    <div className="bg-red-100/50 dark:bg-red-900/50 border border-red-200/50 dark:border-red-500/50 text-red-700 dark:text-red-300 px-4 py-3 relative mb-6 text-sm text-left rounded-md" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                {message && (
                     <div className="bg-green-100/50 dark:bg-green-900/50 border border-green-200/50 dark:border-green-500/50 text-green-700 dark:text-green-300 px-4 py-3 relative mb-6 text-sm text-left rounded-md" role="alert">
                        <span className="block sm:inline">{message}</span>
                    </div>
                )}
                
                {view === 'email' ? (
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                      <AuthInput id="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />

                      <button type="submit" disabled={loading} className="w-full p-3 font-medium text-white dark:text-black bg-slate-900 dark:bg-white rounded-md hover:bg-slate-700 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center disabled:opacity-60">
                          {loading ? <SpinnerIcon className="w-6 h-6 text-white dark:text-black" /> : "Continue with Email"}
                      </button>
                  </form>
                ) : (
                  <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <OtpInput value={otp} onChange={setOtp} disabled={loading} />
                    <button type="submit" disabled={loading || otp.join('').length < 4} className="w-full p-3 font-medium text-white dark:text-black bg-slate-900 dark:bg-white rounded-md hover:bg-slate-700 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center disabled:opacity-60">
                        {loading ? <SpinnerIcon className="w-6 h-6 text-white dark:text-black" /> : "Verify & Sign In"}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setView('email');
                            setError(null);
                            setMessage(null);
                            setOtp(['', '', '', '']);
                        }}
                        disabled={loading}
                        className="text-sm text-slate-500 dark:text-zinc-400 hover:underline disabled:opacity-50"
                    >
                      Use a different email
                    </button>
                  </form>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
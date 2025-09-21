
import React from 'react';

// A different icon style for the settings page for a distinct visual feel.
// These are more solid/filled compared to the main outline-style icon set.

export const SettingsAccountIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
    </svg>
);

export const SettingsAppearanceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M10 3.5a1.5 1.5 0 0 1 3 0V4a1 1 0 0 0 1 1h.5a1.5 1.5 0 0 1 0 3h-.5a1 1 0 0 0-1 1v.5a1.5 1.5 0 0 1-3 0V8a1 1 0 0 0-1-1h-.5a1.5 1.5 0 0 1 0-3h.5a1 1 0 0 0 1-1v-.5ZM10 15.5a1.5 1.5 0 0 1-3 0V15a1 1 0 0 0-1-1h-.5a1.5 1.5 0 0 1 0-3h.5a1 1 0 0 0 1-1v-.5a1.5 1.5 0 0 1 3 0V11a1 1 0 0 0 1 1h.5a1.5 1.5 0 0 1 0 3h-.5a1 1 0 0 0-1 1v.5Z" />
    </svg>
);

export const SettingsIntegrationsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M11.49 3.17a.75.75 0 0 1 1.02.07l3 3.5a.75.75 0 0 1-1.11.96l-3-3.5a.75.75 0 0 1 .09-1.03ZM8.51 3.17a.75.75 0 0 0-1.02.07l-3 3.5A.75.75 0 0 0 5.6 7.7l3-3.5a.75.75 0 0 0-.09-1.03Z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v5.337l1.72-2.006a.75.75 0 1 1 1.11.96l-3.001 3.5a.75.75 0 0 1-1.11 0l-3-3.5a.75.75 0 0 1 1.11-.96L9.25 8.087V2.75A.75.75 0 0 1 10 2ZM5.6 12.3a.75.75 0 0 1 1.11-.96l3 3.5a.75.75 0 0 1-.09 1.03l-3 3.5a.75.75 0 0 1-1.02-.07l-3-3.5a.75.75 0 0 1 .09-1.03l3-3.5Zm8.88 0a.75.75 0 0 0-1.11-.96l-3 3.5a.75.75 0 0 0 .09 1.03l3 3.5a.75.75 0 0 0 1.02-.07l3-3.5a.75.75 0 0 0-.09-1.03l-3-3.5Z" clipRule="evenodd" />
    </svg>
);

export const SettingsSubscriptionIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M4 4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.586a1 1 0 0 0-.293-.707l-2.828-2.828A1 1 0 0 0 14.586 5H12a1 1 0 0 1-1-1V3a1 1 0 0 0-1-1H4Zm3 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5Z" />
    </svg>
);

export const SettingsMemoryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM8.324 6.202a.75.75 0 0 1 1.488-.36l1.325 5.492a.75.75 0 0 1-.36 1.488l-5.492-1.325a.75.75 0 0 1 .36-1.488l2.679.645 1.5-6.212Z" />
    </svg>
);



import React from 'react';
import { Link } from 'react-router-dom';

export const LegalHeader = () => (
    <header className="bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-[#2a2a2a]">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-slate-900 dark:text-white select-none font-logo">Suvo</Link>
            <Link to="/w" className="px-4 py-2 bg-slate-800 text-white dark:bg-slate-200 dark:text-black rounded-md hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors font-medium">
                Back to App
            </Link>
        </nav>
    </header>
);

export const LegalFooter = () => (
    <footer className="bg-slate-50 dark:bg-black z-10 relative">
        <div className="container mx-auto px-6 py-12 text-center text-slate-500 dark:text-[#aaaaaa]">
            &copy; {new Date().getFullYear()} Suvo. All rights reserved.
        </div>
    </footer>
);

export const PrivacyPolicyPage = () => {
  return (
    <div className="bg-white dark:bg-black text-slate-800 dark:text-white antialiased min-h-screen flex flex-col">
      <LegalHeader />
      <main className="flex-grow container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white">Privacy Policy</h1>
        <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
          <p><strong>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
          <p>YourBrand ("us", "we", or "our") operates the YourBrand website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>
          <h2>Information Collection and Use</h2>
          <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
          <h3>Types of Data Collected</h3>
          <h4>Personal Data</h4>
          <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>
          <ul>
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Cookies and Usage Data</li>
          </ul>
          <h4>Usage Data</h4>
          <p>We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
          <h2>Use of Data</h2>
          <p>YourBrand uses the collected data for various purposes:</p>
          <ul>
            <li>To provide and maintain the Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
            <li>To provide customer care and support</li>
            <li>To provide analysis or valuable information so that we can improve the Service</li>
            <li>To monitor the usage of the Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
          <h2>Security of Data</h2>
          <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
          <h2>Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.</p>
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us by email: contact@yourbrand.com</p>
        </div>
      </main>
      <LegalFooter />
    </div>
  );
};

export const TermsOfServicePage = () => {
  return (
    <div className="bg-white dark:bg-black text-slate-800 dark:text-white antialiased min-h-screen flex flex-col">
      <LegalHeader />
      <main className="flex-grow container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white">Terms of Service</h1>
        <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
           <p><strong>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
          <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the YourBrand website (the "Service") operated by YourBrand ("us", "we", or "our").</p>
          <h2>Accounts</h2>
          <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
          <h2>Intellectual Property</h2>
          <p>The Service and its original content, features and functionality are and will remain the exclusive property of YourBrand and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>
          <h2>Links To Other Web Sites</h2>
          <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by YourBrand. YourBrand has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that YourBrand shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.</p>
          <h2>Termination</h2>
          <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
          <h2>Governing Law</h2>
          <p>These Terms shall be governed and construed in accordance with the laws of California, United States, without regard to its conflict of law provisions.</p>
          <h2>Changes</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
          <h2>Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at: contact@yourbrand.com</p>
        </div>
      </main>
      <LegalFooter />
    </div>
  );
};
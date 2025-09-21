
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LegalHeader, LegalFooter } from './LegalPages';
import { CheckIcon, ChevronDownIcon } from './icons';

const FAQItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => (
    <details className="border-b border-slate-200 dark:border-zinc-800 py-4 last:border-b-0">
        <summary className="flex items-center justify-between font-semibold text-lg cursor-pointer list-none">
            {question}
            <ChevronDownIcon className="w-5 h-5 transition-transform rotatable" />
        </summary>
        <div className="mt-4 text-slate-600 dark:text-zinc-400 text-left">
            {children}
        </div>
    </details>
);

const PricingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-black text-slate-900 dark:text-white min-h-screen flex flex-col">
            <div className="absolute inset-0 h-full w-full bg-white dark:bg-black grid-pattern z-0"></div>
            <LegalHeader />
            <main className="flex-1 flex flex-col items-center w-full max-w-5xl mx-auto z-10 px-4 py-16 sm:py-24 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">
                    Find the right plan for you
                </h1>
                <p className="mt-4 text-xl text-slate-500 dark:text-zinc-400 max-w-2xl">
                    Simple, transparent pricing for projects of all sizes.
                </p>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 items-start">
                    {/* Free Plan */}
                    <div className="p-8 flex flex-col h-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-md">
                        <h3 className="text-2xl font-semibold">Free</h3>
                        <p className="mt-2 text-slate-500 dark:text-zinc-400">For getting started & personal projects.</p>
                        <div className="mt-6">
                            <span className="text-5xl font-bold">$0</span>
                            <span className="text-zinc-400 text-lg">/month</span>
                        </div>
                        <ul className="space-y-4 text-slate-600 dark:text-zinc-300 mt-8 text-left">
                            <li className="flex items-center gap-3">
                                <CheckIcon className="w-5 h-5 text-purple-500" />
                                <span>5 daily credits</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckIcon className="w-5 h-5 text-purple-500" />
                                <span>Public projects</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckIcon className="w-5 h-5 text-purple-500" />
                                <span>Up to 2 collaborators</span>
                            </li>
                        </ul>
                        <div className="flex-grow"></div>
                        <button onClick={() => navigate('/w')} className="w-full mt-8 py-3 px-6 font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors rounded-lg">
                            Go to Workspace
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="p-8 flex flex-col h-full relative border-2 border-purple-600 dark:border-purple-500 rounded-2xl shadow-2xl shadow-purple-500/10 bg-white/50 dark:bg-black/50 backdrop-blur-md">
                         <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1.5 text-sm font-semibold uppercase tracking-wider rounded-full">Most Popular</div>
                        <h3 className="text-2xl font-semibold">Pro</h3>
                        <p className="mt-2 text-slate-500 dark:text-zinc-400">For more power and collaboration.</p>
                        <div className="mt-6">
                            <span className="text-5xl font-bold">$25</span>
                            <span className="text-zinc-400 text-lg">/month</span>
                        </div>
                        <ul className="space-y-4 text-slate-600 dark:text-zinc-300 mt-8 text-left">
                            <li className="flex items-center gap-3">
                                <CheckIcon className="w-5 h-5 text-purple-500" />
                                <span>100 monthly credits</span>
                            </li>
                             <li className="flex items-center gap-3">
                                <CheckIcon className="w-5 h-5 text-purple-500" />
                                <span>Private projects</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckIcon className="w-5 h-5 text-purple-500" />
                                <span>Custom domains</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckIcon className="w-5 h-5 text-purple-500" />
                                <span>Advanced AI models</span>
                            </li>
                             <li className="flex items-center gap-3">
                                <CheckIcon className="w-5 h-5 text-purple-500" />
                                <span>Priority support</span>
                            </li>
                        </ul>
                        <div className="flex-grow"></div>
                        <button className="w-full mt-8 py-3 px-6 font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-opacity rounded-lg">
                            Upgrade to Pro
                        </button>
                    </div>
                </div>

                <div className="w-full max-w-3xl mx-auto mt-24 text-left">
                    <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                    <FAQItem question="What counts as a credit?">
                        <p>One credit is used for each major generation request you send to the AI, such as creating a new component, updating a page layout, or fixing an error. Simple chat messages do not consume credits.</p>
                    </FAQItem>
                    <FAQItem question="Can I upgrade or downgrade my plan at any time?">
                        <p>Yes, you can change your plan at any time from your account settings. Upgrades are applied immediately, while downgrades take effect at the end of your current billing cycle.</p>
                    </FAQItem>
                    <FAQItem question="What happens if I use all my credits?">
                        <p>If you run out of credits on the Pro plan, you can purchase additional credit packs or wait until your credits reset at the start of your next billing cycle. We'll always notify you before you run out.</p>
                    </FAQItem>
                     <FAQItem question="Do you offer a plan for large enterprises?">
                        <p>Absolutely. We offer custom enterprise plans with enhanced security, dedicated support, and custom integrations. Please contact our sales team to discuss your needs.</p>
                    </FAQItem>
                </div>
            </main>
            <LegalFooter />
        </div>
    );
};

export default PricingPage;

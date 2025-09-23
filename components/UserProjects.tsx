

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SpinnerIcon } from './icons';

interface Project {
    id: number;
    name: string;
    description: string;
    lastUpdated: string;
}

const mockProjects: Project[] = [
  { id: 1, name: 'Personal Portfolio', description: 'A sleek, modern portfolio to showcase my web development projects and skills.', lastUpdated: '2 hours ago' },
  { id: 2, name: 'Gourmet Burger Co.', description: 'E-commerce website for a local restaurant, featuring online ordering and table booking.', lastUpdated: '1 day ago' },
  { id: 3, name: 'SaaS Dashboard', description: 'Analytics dashboard for a new software service, built with React and custom charts.', lastUpdated: '3 days ago' },
  { id: 4, name: 'Travel Blog', description: 'A content-focused blog with a clean layout, photo galleries, and map integration.', lastUpdated: '1 week ago' },
];

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <Link to="/w" className="block p-6 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-[#2a2a2a] rounded-xl shadow-sm hover:shadow-lg hover:border-slate-400 dark:hover:border-slate-500 hover:-translate-y-1 transition-all duration-300">
        <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{project.name}</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-[#aaaaaa] h-10">{project.description}</p>
        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">Last updated {project.lastUpdated}</p>
    </Link>
);

const SkeletonCard: React.FC = () => (
    <div className="p-6 bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-[#2a2a2a] rounded-xl animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-[#2a2a2a] rounded w-3/4"></div>
        <div className="mt-3 h-4 bg-slate-200 dark:bg-[#2a2a2a] rounded"></div>
        <div className="h-4 bg-slate-200 dark:bg-[#2a2a2a] rounded w-5/6 mt-1"></div>
        <div className="mt-5 h-3 bg-slate-200 dark:bg-[#2a2a2a] rounded w-1/3"></div>
    </div>
);

const CreateNewCard: React.FC = () => (
    <Link to="/w" className="flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-[#1e1e1e] border-2 border-dashed border-slate-300 dark:border-[#2a2a2a] rounded-xl hover:border-solid hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-[#252525] transition-all duration-300 group">
         <div className="w-12 h-12 bg-slate-200 dark:bg-[#2a2a2a] rounded-lg flex items-center justify-center text-slate-500 dark:text-[#aaaaaa] group-hover:bg-slate-800 dark:group-hover:bg-slate-200 group-hover:text-white dark:group-hover:text-black transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
         </div>
         <p className="mt-3 font-medium text-slate-700 dark:text-slate-300">Create New Project</p>
    </Link>
);


export const UserProjects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching projects from a backend
        // In a real application, you would make an API call here.
        setLoading(true);
        const timer = setTimeout(() => {
            setProjects(mockProjects);
            setLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="w-full max-w-5xl mx-auto px-4 pb-16">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6 text-center">Your Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 <CreateNewCard />
                {loading ? (
                    <>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </>
                ) : (
                    projects.map(project => <ProjectCard key={project.id} project={project} />)
                )}
            </div>
        </section>
    );
};
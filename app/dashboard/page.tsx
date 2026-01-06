'use client';
import useDataStore from '@/store/data';

import { useEffect } from 'react';
import { ProtectedRoute } from '@/hoc/protectedRoute';
import { Category } from '@/components/dashboard/category';
import { Profile } from '@/components/dashboard/profile';
import { Education } from '@/components/dashboard/education';
import { Experience } from '@/components/dashboard/experience';
import { Project } from '@/components/dashboard/project';
import { Contact } from '@/components/dashboard/contact';
import { Navbar } from '@/components/dashboard/navbar';
import { Footer } from '@/components/dashboard/footer';
import { DashboardLanguageSelector } from '@/components/dashboard/dashboardLanguageSelector';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';


function DashboardContent() {
  const { isLoading, loadAllData, profiles, categories, contacts, educations, experiences, projects } = useDataStore();
  const { detectAndSetLanguages } = useLanguage();

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Auto-detect languages after data loads
  useEffect(() => {
    if (!isLoading) {
      detectAndSetLanguages({
        profiles,
        categories,
        contacts,
        educations,
        experiences,
        projects,
      });
    }
  }, [isLoading, profiles, categories, contacts, educations, experiences, projects, detectAndSetLanguages]);


  return (
    <div className="relative min-h-screen bg-linear-to-br from-gray-900 to-gray-800">
      <Navbar/>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Global Language Settings */}
        <DashboardLanguageSelector />
        
        {/* Card 1: Profile */}
        <Profile isDataLoading={isLoading} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className='space-y-6'>
             {/* Card 2: Contact */}
            <Contact isDataLoading={isLoading} />
          </div>

          {/* Card 3: Categories */}
          <Category isDataLoading={isLoading} />

          {/* Card 4: Education */}
          <Education isDataLoading={isLoading} />

          {/* Card 5: Experience */}
          <Experience isDataLoading={isLoading} />
        </div>
        
        {/* Card 6: Projects */}
        <Project isDataLoading={isLoading} />
        <div className='text-center my-8 mb-12'>
          <p className="text-gray-300 text-sm">You just logged in</p>
          <p className="text-gray-400 text-xs mt-2">{new Date().toLocaleString()}</p>
        </div>
      </main>
      <Footer/>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <LanguageProvider>
        <DashboardContent />
      </LanguageProvider>
    </ProtectedRoute>
  );
}

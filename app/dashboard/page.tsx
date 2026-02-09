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
import { useLanguageStore } from '@/store/language';

function DashboardContent() {
  const {
    isLoading,
    loadAllData,
    profiles,
    categories,
    contacts,
    educations,
    experiences,
    projects,
  } = useDataStore();
  const detectAndSetLanguages = useLanguageStore(
    state => state.detectAndSetLanguages
  );

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
  }, [
    isLoading,
    profiles,
    categories,
    contacts,
    educations,
    experiences,
    projects,
    detectAndSetLanguages,
  ]);

  return (
    <div className='relative min-h-screen bg-linear-to-br from-gray-900 to-gray-800'>
      <Navbar />
      <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Global Language Settings */}
        <DashboardLanguageSelector />

        {/* Card 1: Profile */}
        <Profile isDataLoading={isLoading} />
        <div className='my-8 grid grid-cols-1 gap-6 md:grid-cols-2'>
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
        <div className='my-8 mb-12 text-center'>
          <p className='text-sm text-gray-300'>You just logged in</p>
          <p className='mt-2 text-xs text-gray-400'>
            {new Date().toLocaleString()}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

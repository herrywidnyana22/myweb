'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/hoc/protectedRoute';
import { Category } from '@/components/dashboard/category';
import { Profile } from '@/components/dashboard/profile';
import { Education } from '@/components/dashboard/education';
import { Experience } from '@/components/dashboard/experience';
import { Project } from '@/components/dashboard/project';
import { Contact } from '@/components/dashboard/contact';
import { Navbar } from '@/components/dashboard/navbar';
import { Footer } from '@/components/dashboard/footer';
import { readCache, writeCache } from '@/lib/cache';


function DashboardContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to load from cache first
        const cachedProfiles = readCache<Profile[]>('profiles_cache');
        const cachedCategories = readCache<Category[]>('categories_cache');
        const cachedContacts = readCache<Contact[]>('contacts_cache');
        const cachedEducations = readCache<Education[]>('educations_cache');
        const cachedExperiences = readCache<Experience[]>('experiences_cache');
        const cachedProjects = readCache<Project[]>('projects_cache');

        // Set cached data immediately
        if (cachedProfiles) setProfiles(cachedProfiles);
        if (cachedCategories) setCategories(cachedCategories);
        if (cachedContacts) setContacts(cachedContacts);
        if (cachedEducations) setEducations(cachedEducations);
        if (cachedExperiences) setExperiences(cachedExperiences);
        if (cachedProjects) setProjects(cachedProjects);

        // If all data is cached, skip API calls
        if (cachedProfiles && cachedCategories && cachedContacts && cachedEducations && cachedExperiences && cachedProjects) {
          setIsLoading(false);
          return;
        }

        // Fetch profiles
        const profileRes = await fetch('/api/profiles');
        if (profileRes.ok) {
          const profileData = (await profileRes.json()) as Profile[];
          setProfiles(profileData);
          writeCache('profiles_cache', profileData);
        }

        // category
        const categoryRes = await fetch('/api/categories');
        if (categoryRes.ok) {
            const categoryData = (await categoryRes.json()) as Category[];
            setCategories(categoryData);
            writeCache('categories_cache', categoryData);
        }

        // contacts
        const contactRes = await fetch('/api/contacts');
        if (contactRes.ok) {
            const contactData = (await contactRes.json()) as Contact[];
            setContacts(contactData);
            writeCache('contacts_cache', contactData);
        }

        // educations
        const educationRes = await fetch('/api/educations');
        if (educationRes.ok) {
            const educationData = (await educationRes.json()) as Education[];
            setEducations(educationData);
            writeCache('educations_cache', educationData);
        }

        // experiences
        const experienceRes = await fetch('/api/experiences');
        if (experienceRes.ok) {
            const experienceData = (await experienceRes.json()) as Experience[];
            setExperiences(experienceData);
            writeCache('experiences_cache', experienceData);
        }

        // projects
        const projectRes = await fetch('/api/projects');
        if (projectRes.ok) {
            const projectData = (await projectRes.json()) as Project[];
            setProjects(projectData);
            writeCache('projects_cache', projectData);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  

  return (
    <div className="relative min-h-screen bg-linear-to-br from-gray-900 to-gray-800">
      <Navbar/>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Profile 
              categories={categories}
              data={profiles}
              setData={setProfiles}
              isDataLoading={isLoading}
            />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className='space-y-6'>
            {/* Card 1: Profile */}
             {/* Card 2: Contact */}
            <Contact 
              categories={categories}
              data={contacts}
              setData={setContacts}
              isDataLoading={isLoading}
            />
          </div>

          {/* Card 3: Categories */}
          <Category
            data={categories}
            setData={setCategories}
            isDataLoading={isLoading}
          />

          {/* Card 4: Education */}
          <Education
            categories={categories}
            data={educations}
            setData={setEducations}
            isDataLoading={isLoading}
          />

          {/* Card 5: Experience */}
          <Experience
            categories={categories}
            data={experiences}
            setData={setExperiences}
            isDataLoading={isLoading}
          />
        </div>
        
        {/* Card 6: Projects */}
        <Project
          categories={categories}
          data={projects}
          setData={setProjects}
          isDataLoading={isLoading}
        />
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
      <DashboardContent />
    </ProtectedRoute>
  );
}

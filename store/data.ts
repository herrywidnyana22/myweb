'use client';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { readCache, writeCache } from '@/lib/cache';

interface DataStore {
  profiles: Profile[];
  categories: Category[];
  contacts: Contact[];
  educations: Education[];
  experiences: Experience[];
  projects: Project[];
  isLoading: boolean;
  error: string | null;

  loadAllData: () => Promise<void>;
  setProfiles: (data: Profile[]) => void;
  setCategories: (data: Category[]) => void;
  setContacts: (data: Contact[]) => void;
  setEducations: (data: Education[]) => void;
  setExperiences: (data: Experience[]) => void;
  setProjects: (data: Project[]) => void;
}

const useDataStore = create<DataStore>()(
  immer((set) => ({
    profiles: [],
    categories: [],
    contacts: [],
    educations: [],
    experiences: [],
    projects: [],
    isLoading: true,
    error: null,

    setProfiles: (data) =>
      set((state) => {
        state.profiles = Array.isArray(data) ? data : [];
      }),

    setCategories: (data) =>
      set((state) => {
        state.categories = Array.isArray(data) ? data : [];
      }),

    setContacts: (data) =>
      set((state) => {
        state.contacts = Array.isArray(data) ? data : [];
      }),

    setEducations: (data) =>
      set((state) => {
        state.educations = Array.isArray(data) ? data : [];
      }),

    setExperiences: (data) =>
      set((state) => {
        state.experiences = Array.isArray(data) ? data : [];
      }),

    setProjects: (data) =>
      set((state) => {
        state.projects = Array.isArray(data) ? data : [];
      }),

    loadAllData: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // Try to load from cache first
        const cachedProfiles = readCache<Profile[]>('profiles_cache');
        const cachedCategories = readCache<Category[]>('categories_cache');
        const cachedContacts = readCache<Contact[]>('contacts_cache');
        const cachedEducations = readCache<Education[]>('educations_cache');
        const cachedExperiences = readCache<Experience[]>('experiences_cache');
        const cachedProjects = readCache<Project[]>('projects_cache');

        // Set cached data immediately
        set((state) => {
          if (cachedProfiles && Array.isArray(cachedProfiles)) state.profiles = cachedProfiles;
          if (cachedCategories && Array.isArray(cachedCategories)) state.categories = cachedCategories;
          if (cachedContacts && Array.isArray(cachedContacts)) state.contacts = cachedContacts;
          if (cachedEducations && Array.isArray(cachedEducations)) state.educations = cachedEducations;
          if (cachedExperiences && Array.isArray(cachedExperiences)) state.experiences = cachedExperiences;
          if (cachedProjects && Array.isArray(cachedProjects)) state.projects = cachedProjects;
        });

        // If all data is cached, skip API calls
        if (
          cachedProfiles &&
          cachedCategories &&
          cachedContacts &&
          cachedEducations &&
          cachedExperiences &&
          cachedProjects
        ) {
          set((state) => {
            state.isLoading = false;
          });
          return;
        }

        // Fetch missing data from APIs
        const requests = [
          !cachedProfiles && fetch('/api/profiles').then((r) => r.json().then((d) => ({ key: 'profiles', data: d }))),
          !cachedCategories && fetch('/api/categories').then((r) => r.json().then((d) => ({ key: 'categories', data: d }))),
          !cachedContacts && fetch('/api/contacts').then((r) => r.json().then((d) => ({ key: 'contacts', data: d }))),
          !cachedEducations && fetch('/api/educations').then((r) => r.json().then((d) => ({ key: 'educations', data: d }))),
          !cachedExperiences && fetch('/api/experiences').then((r) => r.json().then((d) => ({ key: 'experiences', data: d }))),
          !cachedProjects && fetch('/api/projects').then((r) => r.json().then((d) => ({ key: 'projects', data: d }))),
        ].filter(Boolean) as Promise<{ key: string; data: any }>[];

        const results = await Promise.all(requests);

        // Process results and cache
        results.forEach(({ key, data }: { key: string; data: any }) => {
          if (key === 'profiles') {
            set((state) => {
              state.profiles = Array.isArray(data) ? data : [];
            });
            writeCache('profiles_cache', data);
          } else if (key === 'categories') {
            set((state) => {
              state.categories = Array.isArray(data) ? data : [];
            });
            writeCache('categories_cache', data);
          } else if (key === 'contacts') {
            set((state) => {
              state.contacts = Array.isArray(data) ? data : [];
            });
            writeCache('contacts_cache', data);
          } else if (key === 'educations') {
            set((state) => {
              state.educations = Array.isArray(data) ? data : [];
            });
            writeCache('educations_cache', data);
          } else if (key === 'experiences') {
            set((state) => {
              state.experiences = Array.isArray(data) ? data : [];
            });
            writeCache('experiences_cache', data);
          } else if (key === 'projects') {
            set((state) => {
              state.projects = Array.isArray(data) ? data : [];
            });
            writeCache('projects_cache', data);
          }
        });

        set((state) => {
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to load data';
          state.isLoading = false;
        });
      }
    },
  }))
);

export default useDataStore;

'use client';

import React, { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { SimpleProject, transformProjectsData, countProjectEntries } from '@/lib/utils/projectImportHelper';
import {locations} from '@/lib/constants';

interface ProjectImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  onImportSuccess?: (count: number) => void;
}

export default function ProjectImportModal({
  isOpen,
  onClose,
  categoryId,
  onImportSuccess,
}: ProjectImportModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());

  // Transform the static data
  const projectsData = transformProjectsData(locations.project);
  const totalEntries = projectsData.reduce((sum, p) => sum + countProjectEntries(p), 0);

  const handleSelectProject = (projectId: string) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(projectId)) {
      newSelected.delete(projectId);
    } else {
      newSelected.add(projectId);
    }
    setSelectedProjects(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProjects.size === projectsData.length) {
      setSelectedProjects(new Set());
    } else {
      setSelectedProjects(new Set(projectsData.map((p) => p.id)));
    }
  };

  const handleImport = async () => {
    if (selectedProjects.size === 0) {
      setError('Please select at least one project to import');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const projectsToImport = projectsData.filter((p) =>
        selectedProjects.has(p.id)
      );

      const response = await fetch('/api/projects/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projects: projectsToImport,
          categoryId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import projects');
      }

      const result = await response.json();
      const importedCount = result.projects.length;
      const entriesCount = result.projects.reduce(
        (sum: number, p: any) => sum + (p.entriesCount || 0),
        0
      );

      setSuccessMessage(
        `Successfully imported ${importedCount} project(s) with ${entriesCount} entries!`
      );
      
      onImportSuccess?.(importedCount);

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSelectedProjects(new Set());
        setSuccessMessage(null);
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl rounded-lg border border-gray-700 bg-gray-900 shadow-xl">
        {/* Custom header since our ModalHeader is styled for light theme */}
        <div className="flex justify-between items-center border-b border-gray-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Import Projects</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-200 disabled:opacity-50 transition"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6 mt-4 space-y-4 px-6">
          {/* Summary */}
          <div className="rounded-lg bg-gray-800 p-4">
            <p className="text-sm text-gray-300">
              Found <span className="font-semibold">{projectsData.length}</span> project(s) with{' '}
              <span className="font-semibold">{totalEntries}</span> total entries ready to import.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-900/20 p-4 text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="flex items-center gap-2 rounded-lg bg-green-900/20 p-4 text-green-300">
              <span className="text-sm">{successMessage}</span>
            </div>
          )}

          {/* Select All */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="selectAll"
              checked={selectedProjects.size === projectsData.length}
              onChange={handleSelectAll}
              disabled={isLoading}
              className="h-4 w-4 cursor-pointer rounded border-gray-600 bg-gray-800"
            />
            <label
              htmlFor="selectAll"
              className="cursor-pointer text-sm font-medium text-gray-200"
            >
              Select All Projects
            </label>
          </div>

          {/* Projects List */}
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {projectsData.map((project) => {
              const entryCount = countProjectEntries(project);
              const isSelected = selectedProjects.has(project.id);

              return (
                <div
                  key={project.id}
                  className="flex items-center gap-3 rounded-lg border border-gray-700 p-3 hover:border-gray-600 hover:bg-gray-800/50"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectProject(project.id)}
                    disabled={isLoading}
                    className="h-4 w-4 cursor-pointer rounded border-gray-600 bg-gray-800"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-100">{project.name}</p>
                    <p className="text-xs text-gray-400">
                      {entryCount} entries
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-gray-700 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={isLoading || selectedProjects.size === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? 'Importing...' : 'Import Selected'}
          </button>
        </div>
      </div>
    </div>
  );
}

import Image from 'next/image';
import useDataStore from '@/store/data';
import { useState } from 'react';
import { writeCache } from '@/lib/cache';
import { DeleteConfirmModal } from '../modal/deleteConfirmModal';
import { ActionButtonGroup } from './actionButtonGroup';
import { ContactModal } from '../modal/contactModal';
import { ActionButton } from './actionButton';
import { CollapsibleCard } from './collapsibleCard';
import { Plus } from 'lucide-react';
import { useLocalizedText } from '@/hooks/useLocalizedText';

export const Contact = ({
  isDataLoading = false,
}: {
  isDataLoading?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Get contacts from global store
  const { contacts, setContacts, categories } = useDataStore();
  const { getText } = useLocalizedText();

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsModalOpen(true);
  };

  const handleSaveContact = async (contactData: Contact) => {
    setIsLoading(true);
    try {
      const url = contactData.id
        ? `/api/contacts/${contactData.id}`
        : '/api/contacts';
      const method = contactData.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });
      const result = await res.json();

      if (result.status === 'ok') {
        const newContact = result.data as Contact;

        // Update global store and cache
        let updatedContacts: Contact[];
        if (contactData.id) {
          // Update existing contact
          updatedContacts = contacts.map(c =>
            c.id === newContact.id ? newContact : c
          );
        } else {
          // Add new contact
          updatedContacts = [...contacts, newContact];
        }

        setContacts(updatedContacts);
        writeCache('contacts_cache', updatedContacts);
        setIsModalOpen(false);
      } else {
        throw new Error(result.msg || result.error || 'Failed to save contact');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/contacts/${deletingId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();

      if (result.status === 'ok') {
        // Remove contact from global store and update cache
        const updatedContacts = contacts.filter(c => c.id !== deletingId);
        setContacts(updatedContacts);
        writeCache('contacts_cache', updatedContacts);

        setIsDeleteModalOpen(false);
        setDeletingId(null);
      } else {
        throw new Error(
          result.msg || result.error || 'Failed to delete contact'
        );
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className='rounded-lg border border-gray-600 bg-gray-700 p-6 shadow-lg'>
        <div className='mb-4 flex items-start justify-between'>
          <div className='h-7 w-20 animate-pulse rounded bg-gray-600' />
          <div className='h-7 w-16 animate-pulse rounded bg-gray-600' />
        </div>
        <div className='space-y-2'>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className='flex animate-pulse items-center justify-between rounded border border-gray-500 bg-gray-600 p-3'
            >
              <div className='flex items-center gap-2'>
                <div className='h-9 w-9 rounded-md bg-gray-500' />
                <div className='h-5 w-24 rounded bg-gray-500' />
              </div>
              <div className='h-6 w-12 rounded bg-gray-500' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <CollapsibleCard title='Contacts'>
        <div className='mb-4 flex items-start justify-end'>
          <ActionButton
            onClick={handleAddContact}
            variant='add'
            icon={
              <>
                {' '}
                <Plus className='size-3' /> Add{' '}
              </>
            }
            title='Add Contact'
          />
        </div>

        {!Array.isArray(contacts) || contacts.length === 0 ? (
          <p className='text-sm text-gray-400'>
            No contacts found. Click "Add" to create one.
          </p>
        ) : (
          <div className='max-h-64 space-y-2 overflow-y-auto'>
            {contacts.map(contact => (
              <div
                key={contact.id}
                className='group flex items-center justify-between rounded border border-gray-500 bg-gray-600 p-3'
              >
                <div className='flex items-center gap-2'>
                  {contact.icon && (
                    <Image
                      src={contact.icon}
                      alt='Contact Icon'
                      width={32}
                      height={32}
                      className='inline-block size-8 rounded-md object-cover'
                    />
                  )}
                  <div>
                    <p className='font-semibold text-white'>{contact.title}</p>
                    {contact.tooltipText && (
                      <p className='text-xs text-gray-300'>
                        {getText(contact.description)}
                      </p>
                    )}
                  </div>
                </div>
                <ActionButtonGroup
                  onEdit={() => handleEditContact(contact)}
                  onDelete={() => handleDeleteContact(contact.id)}
                  isLoading={isLoading}
                />
              </div>
            ))}
          </div>
        )}
      </CollapsibleCard>
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveContact}
        contact={selectedContact || undefined}
        categories={categories.map(cat => ({
          id: cat.id,
          name: typeof cat.name === 'string' ? cat.name : getText(cat.name),
        }))}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title='Delete Contact'
        message='Are you sure you want to delete this contact? This action cannot be undone.'
        isLoading={isLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingId(null);
        }}
      />
    </>
  );
};

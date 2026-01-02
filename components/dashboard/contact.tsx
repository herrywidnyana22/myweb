import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { DeleteConfirmModal } from "../modal/deleteConfirmModal";
import { ButtonActionGroup } from "./buttonActionGroup";
import { ContactModal } from "../modal/contactModal";


interface ContactDashboardProps {
    categories: Category[];
    data: Contact[];
    setData: Dispatch<SetStateAction<Contact[]>>;
    isDataLoading?: boolean;
}

export const Contact = ({categories, data, setData, isDataLoading = false}: ContactDashboardProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

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
            const url = contactData.id ? `/api/contacts/${contactData.id}` : '/api/contacts';
            const method = contactData.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactData),
            });

            if (res.ok) {
                const newContact = (await res.json()) as Contact;

                if (contactData.id) {
                    // Update existing contact
                    setData((prev) =>
                        prev.map((c) => (c.id === newContact.id ? newContact : c))
                    );
                } else {
                    // Add new contact
                    setData((prev) => [...prev, newContact]);
                }
            } else {
                const error = (await res.json()) as { error?: string };
                throw new Error(error.error || 'Failed to save contact');
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

            if (res.ok) {
                // Remove contact from local state
                setData((prev) => prev.filter((c) => c.id !== deletingId));
                setIsDeleteModalOpen(false);
                setDeletingId(null);
            } else {
                const error = (await res.json()) as { error?: string };
                throw new Error(error.error || 'Failed to delete contact');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };


    if (isDataLoading) {
        return (
            <div className="bg-gray-700 rounded-lg shadow-lg p-6 border border-gray-600">
                <div className="flex justify-between items-start mb-4">
                    <div className="h-7 w-20 bg-gray-600 rounded animate-pulse" />
                    <div className="h-7 w-16 bg-gray-600 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-600 rounded p-3 border border-gray-500 flex justify-between items-center animate-pulse">
                            <div className='flex items-center gap-2'>
                                <div className="w-9 h-9 bg-gray-500 rounded-md" />
                                <div className="h-5 w-24 bg-gray-500 rounded" />
                            </div>
                            <div className="h-6 w-12 bg-gray-500 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-gray-700 rounded-lg shadow-lg p-6 border border-gray-600">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-white">Contacts</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddContact}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded text-sm transition"
                        >
                            + Add
                        </button>
                    </div>
                </div>

                {data.length === 0 ? (
                    <p className="text-gray-400 text-sm">No contacts found. Click "Add" to create one.</p>
                ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                    {data.map((contact) => (
                        <div key={contact.id} className="bg-gray-600 rounded p-3 border border-gray-500 flex justify-between items-center">
                            <div className='flex items-center gap-2'>
                                {contact.icon &&(
                                    <Image
                                        src={contact.icon}
                                        alt="Contact Icon"
                                        width={36}
                                        height={36}
                                        className="inline-block rounded-md object-cover"
                                    />
                                )}
                                <div>
                                    <p className="text-white font-semibold">
                                        {contact.title}
                                    </p>
                                    {contact.tooltipText && (
                                        <p className="text-gray-300 text-xs">{contact.tooltipText}</p>
                                    )}
                                </div>
                            </div>
                            <ButtonActionGroup
                                onEdit={() => handleEditContact(contact)}
                                onDelete={() => handleDeleteContact(contact.id)}
                                isLoading={isLoading}
                            />
                        </div>
                    ))}
                    </div>
                )}
            </div>
            <ContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveContact}
                contact={selectedContact || undefined}
                categories={categories}
            />
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                title="Delete Contact"
                message="Are you sure you want to delete this contact? This action cannot be undone."
                isLoading={isLoading}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setDeletingId(null);
                }}
            />
    
        </>
    )
}

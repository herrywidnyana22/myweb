import useDataStore from '@/store/data';

import { Icon } from './icon';
import { Notice } from './notice';

export const ContactList = () => {

    const { contacts } = useDataStore();

    return (
        <>

            {/* Contact List - Information Only */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Contact List
                </label>
                <div className="p-4 rounded border border-gray-200 max-h-48 overflow-y-auto">
                    {contacts.length > 0 ? (
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                        {(contacts || []).map((contact) => (
                            <Icon
                                key={contact.id}
                                tooltipLabel={contact.title}
                                src={contact.icon}
                                size={18}
                                className="
                                    p-0.5 sm:p-1 
                                    rounded-full 
                                    border border-white
                                    size-8
                                "
                                style={{backgroundColor: contact.bgColor}}
                            />
                        ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">No contacts available</p>
                    )}
                </div>
            </div>
        </>
    );
};

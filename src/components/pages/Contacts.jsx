import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import FilterBuilder from "@/components/molecules/FilterBuilder";
import { contactService } from "@/services/api/contactService";
import SkeletonLoader from "@/components/molecules/SkeletonLoader";
import EmptyState from "@/components/molecules/EmptyState";
import SearchBar from "@/components/molecules/SearchBar";
import ErrorState from "@/components/molecules/ErrorState";
import ContactList from "@/components/organisms/ContactList";
import Button from "@/components/atoms/Button";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState([]);
  const [showFilterBuilder, setShowFilterBuilder] = useState(false);
  useEffect(() => {
    loadContacts();
  }, []);

useEffect(() => {
    applySearchAndFilters();
  }, [contacts, searchQuery, filters]);

  const applySearchAndFilters = async () => {
    let result = [...contacts];

    // Apply filters first
    if (filters.length > 0) {
      try {
        result = await contactService.filter(filters);
      } catch (error) {
        toast.error('Error applying filters');
        result = [...contacts];
      }
    }

// Then apply search query
    if (searchQuery.trim() !== '') {
      result = result.filter(contact =>
        contact?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact?.company?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredContacts(result);
  };

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await contactService.getAll();
      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

const handleDeleteContact = async (contact) => {
    if (!contact?.name || !contact?.Id) {
      toast.error('Invalid contact data');
      return;
    }
    
    if (!confirm(`Are you sure you want to delete ${contact.name}?`)) return;
    
    try {
      await contactService.delete(contact.Id);
      setContacts(prevContacts => prevContacts.filter(c => c.Id !== contact.Id));
      toast.success('Contact deleted successfully');
    } catch (err) {
      console.error('Delete contact error:', err);
      toast.error('Failed to delete contact');
    }
  };

  const handleEditContact = (contact) => {
    // Placeholder for edit functionality
    toast.info('Edit functionality coming soon');
  };

  const handleViewContact = (contact) => {
    // Placeholder for view functionality
    toast.info('Contact details view coming soon');
  };

  const handleCreateContact = () => {
    // Placeholder for create functionality
    toast.info('Create contact functionality coming soon');
  };

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader count={1} type="table" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadContacts} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Contacts</h1>
          <p className="text-gray-600">Manage your customer relationships and contacts.</p>
        </div>
        <Button onClick={handleCreateContact} icon="Plus">
          Add Contact
        </Button>
      </div>

{/* Search and Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <SearchBar 
            placeholder="Search contacts..." 
            onSearch={handleSearch}
            className="w-auto"
          />
          <div className="relative">
            <FilterBuilder
              type="contacts"
              filters={filters}
              onFiltersChange={setFilters}
              isOpen={showFilterBuilder}
              onToggle={() => setShowFilterBuilder(!showFilterBuilder)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {filteredContacts.length} of {contacts.length} contacts
          </span>
        </div>
      </div>

{/* Content */}
      {filteredContacts.length === 0 && searchQuery === '' ? (
        <EmptyState
          icon="Users"
          title="No contacts yet"
          description="Start building your network by adding your first contact"
          actionLabel="Add Contact"
          onAction={handleCreateContact}
        />
      ) : filteredContacts.length === 0 && searchQuery !== '' ? (
        <EmptyState
          icon="Search"
          title="No contacts found"
          description={`No contacts match "${searchQuery}". Try adjusting your search.`}
          actionLabel="Clear Search"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <ContactList
          contacts={filteredContacts}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
          onView={handleViewContact}
        />
      )}
    </motion.div>
  );
};

export default Contacts;
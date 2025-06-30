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
import ApperIcon from "@/components/ApperIcon";

// ContactForm Component
const ContactForm = ({ onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    tags: []
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    handleChange('tags', tags);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
          placeholder="Enter contact name"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
          placeholder="Enter email address"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isSubmitting}
          placeholder="Enter phone number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company *
        </label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => handleChange('company', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.company ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
          placeholder="Enter company name"
        />
        {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isSubmitting}
          placeholder="Enter job title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <input
          type="text"
          value={formData.tags.join(', ')}
          onChange={handleTagsChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isSubmitting}
          placeholder="Enter tags separated by commas"
        />
        <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          icon={isSubmitting ? "Loader2" : "Plus"}
        >
          {isSubmitting ? 'Creating...' : 'Create Contact'}
        </Button>
      </div>
    </form>
  );
};
const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState([]);
  const [showFilterBuilder, setShowFilterBuilder] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
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
    setShowCreateModal(true);
  };

  const handleSubmitContact = async (contactData) => {
    setIsCreating(true);
    try {
      const newContact = await contactService.create(contactData);
      setContacts(prevContacts => [...prevContacts, newContact]);
      setShowCreateModal(false);
      toast.success('Contact created successfully');
    } catch (err) {
      console.error('Create contact error:', err);
      toast.error('Failed to create contact');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCloseCreateModal = () => {
    if (!isCreating) {
      setShowCreateModal(false);
    }
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

      {/* Create Contact Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleCloseCreateModal}></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Contact</h3>
                  <button
                    onClick={handleCloseCreateModal}
                    disabled={isCreating}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                <ContactForm
                  onSubmit={handleSubmitContact}
                  onCancel={handleCloseCreateModal}
                  isSubmitting={isCreating}
                />
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Contacts;
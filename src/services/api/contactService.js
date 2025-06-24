import contactData from '../mockData/contacts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let contacts = [...contactData];

export const contactService = {
  async getAll() {
    await delay(300);
    return [...contacts];
  },

  async getById(id) {
    await delay(200);
    const contact = contacts.find(c => c.Id === parseInt(id, 10));
    if (!contact) {
      throw new Error('Contact not found');
    }
    return { ...contact };
  },

  async create(contactData) {
    await delay(400);
    const maxId = Math.max(...contacts.map(c => c.Id), 0);
    const newContact = {
      ...contactData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
    contacts.push(newContact);
    return { ...newContact };
  },

  async update(id, updateData) {
    await delay(350);
    const index = contacts.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Contact not found');
    }
    
    const updatedContact = {
      ...contacts[index],
      ...updateData,
      Id: contacts[index].Id, // Prevent ID modification
      updatedAt: new Date().toISOString()
    };
    
    contacts[index] = updatedContact;
    return { ...updatedContact };
  },

  async delete(id) {
    await delay(250);
    const index = contacts.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Contact not found');
    }
    
    const deletedContact = { ...contacts[index] };
    contacts.splice(index, 1);
    return deletedContact;
  },

  async search(query) {
    await delay(200);
    const lowercaseQuery = query.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(lowercaseQuery) ||
contact.email.toLowerCase().includes(lowercaseQuery) ||
      contact.company.toLowerCase().includes(lowercaseQuery)
    );
  },

  async filter(filters) {
    await delay(250);
    if (!filters || filters.length === 0) {
      return [...contacts];
    }

    return contacts.filter(contact => {
      return filters.every(filter => {
        const { field, operator, value } = filter;
        const contactValue = contact[field];

        if (contactValue === undefined || contactValue === null) {
          return operator === 'isEmpty';
        }

        switch (operator) {
          case 'equals':
            return String(contactValue).toLowerCase() === String(value).toLowerCase();
          case 'contains':
            return String(contactValue).toLowerCase().includes(String(value).toLowerCase());
          case 'startsWith':
            return String(contactValue).toLowerCase().startsWith(String(value).toLowerCase());
          case 'endsWith':
            return String(contactValue).toLowerCase().endsWith(String(value).toLowerCase());
          case 'isEmpty':
            return !contactValue || String(contactValue).trim() === '';
          case 'isNotEmpty':
            return contactValue && String(contactValue).trim() !== '';
          case 'greaterThan':
            return Number(contactValue) > Number(value);
          case 'lessThan':
            return Number(contactValue) < Number(value);
          case 'greaterThanOrEqual':
            return Number(contactValue) >= Number(value);
          case 'lessThanOrEqual':
            return Number(contactValue) <= Number(value);
          case 'arrayContains':
            return Array.isArray(contactValue) && contactValue.some(item => 
              String(item).toLowerCase().includes(String(value).toLowerCase())
            );
          default:
            return true;
        }
      });
    });
  }
};
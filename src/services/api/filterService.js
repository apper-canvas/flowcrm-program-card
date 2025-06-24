const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Field definitions for different entity types
const fieldDefinitions = {
  contacts: [
    { 
      key: 'name', 
      label: 'Name', 
      type: 'text',
      operators: ['equals', 'contains', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty']
    },
    { 
      key: 'email', 
      label: 'Email', 
      type: 'email',
      operators: ['equals', 'contains', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty']
    },
    { 
      key: 'company', 
      label: 'Company', 
      type: 'text',
      operators: ['equals', 'contains', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty']
    },
    { 
      key: 'title', 
      label: 'Title', 
      type: 'text',
      operators: ['equals', 'contains', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty']
    },
    { 
      key: 'phone', 
      label: 'Phone', 
      type: 'text',
      operators: ['equals', 'contains', 'isEmpty', 'isNotEmpty']
    },
    { 
      key: 'tags', 
      label: 'Tags', 
      type: 'array',
      operators: ['arrayContains', 'isEmpty', 'isNotEmpty']
    },
    { 
      key: 'createdAt', 
      label: 'Created Date', 
      type: 'date',
      operators: ['equals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual']
    },
    { 
      key: 'lastActivity', 
      label: 'Last Activity', 
      type: 'date',
      operators: ['equals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual']
    }
  ],
  deals: [
    { 
      key: 'title', 
      label: 'Deal Title', 
      type: 'text',
      operators: ['equals', 'contains', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty']
    },
    { 
      key: 'value', 
      label: 'Deal Value', 
      type: 'number',
      operators: ['equals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual']
    },
    { 
      key: 'stage', 
      label: 'Stage', 
      type: 'select',
      operators: ['equals'],
      options: [
        { value: 'Discovery', label: 'Discovery' },
        { value: 'Qualified', label: 'Qualified' },
        { value: 'Proposal', label: 'Proposal' },
        { value: 'Negotiation', label: 'Negotiation' },
        { value: 'Closed Won', label: 'Closed Won' },
        { value: 'Closed Lost', label: 'Closed Lost' }
      ]
    },
    { 
      key: 'probability', 
      label: 'Probability', 
      type: 'number',
      operators: ['equals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual']
    },
    { 
      key: 'owner', 
      label: 'Owner', 
      type: 'text',
      operators: ['equals', 'contains', 'isEmpty', 'isNotEmpty']
    },
    { 
      key: 'expectedClose', 
      label: 'Expected Close', 
      type: 'date',
      operators: ['equals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual']
    },
    { 
      key: 'createdAt', 
      label: 'Created Date', 
      type: 'date',
      operators: ['equals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual']
    }
  ]
};

// Operator definitions
const operatorDefinitions = {
  equals: { label: 'Equals', symbol: '=' },
  contains: { label: 'Contains', symbol: '⊃' },
  startsWith: { label: 'Starts with', symbol: '⊃*' },
  endsWith: { label: 'Ends with', symbol: '*⊃' },
  isEmpty: { label: 'Is empty', symbol: '∅' },
  isNotEmpty: { label: 'Is not empty', symbol: '≠∅' },
  greaterThan: { label: 'Greater than', symbol: '>' },
  lessThan: { label: 'Less than', symbol: '<' },
  greaterThanOrEqual: { label: 'Greater than or equal', symbol: '≥' },
  lessThanOrEqual: { label: 'Less than or equal', symbol: '≤' },
  arrayContains: { label: 'Contains', symbol: '∋' }
};

export const filterService = {
  async getFieldsForType(type) {
    await delay(100);
    return fieldDefinitions[type] || [];
  },

  async getOperators() {
    await delay(50);
    return operatorDefinitions;
  },

  async validateFilter(filter) {
    await delay(50);
    const { field, operator, value } = filter;
    
    if (!field || !operator) {
      return { valid: false, error: 'Field and operator are required' };
    }

    // Check if value is required for this operator
    const noValueOperators = ['isEmpty', 'isNotEmpty'];
    if (!noValueOperators.includes(operator) && (value === undefined || value === null || value === '')) {
      return { valid: false, error: 'Value is required for this operator' };
    }

    return { valid: true };
  },

  async applyFilters(data, filters, type) {
    await delay(200);
    
    if (!filters || filters.length === 0) {
      return [...data];
    }

    // Validate all filters first
    for (const filter of filters) {
      const validation = await this.validateFilter(filter);
      if (!validation.valid) {
        throw new Error(`Invalid filter: ${validation.error}`);
      }
    }

    return data.filter(item => {
      return filters.every(filter => {
        const { field, operator, value } = filter;
        const itemValue = item[field];

        if (itemValue === undefined || itemValue === null) {
          return operator === 'isEmpty';
        }

        switch (operator) {
          case 'equals':
            return String(itemValue).toLowerCase() === String(value).toLowerCase();
          case 'contains':
            return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
          case 'startsWith':
            return String(itemValue).toLowerCase().startsWith(String(value).toLowerCase());
          case 'endsWith':
            return String(itemValue).toLowerCase().endsWith(String(value).toLowerCase());
          case 'isEmpty':
            return !itemValue || String(itemValue).trim() === '';
          case 'isNotEmpty':
            return itemValue && String(itemValue).trim() !== '';
          case 'greaterThan':
            return Number(itemValue) > Number(value);
          case 'lessThan':
            return Number(itemValue) < Number(value);
          case 'greaterThanOrEqual':
            return Number(itemValue) >= Number(value);
          case 'lessThanOrEqual':
            return Number(itemValue) <= Number(value);
          case 'arrayContains':
            return Array.isArray(itemValue) && itemValue.some(arrayItem => 
              String(arrayItem).toLowerCase().includes(String(value).toLowerCase())
            );
          default:
            return true;
        }
      });
    });
  },

  // Helper method to create a new filter condition
  createFilter(field = '', operator = '', value = '') {
    return {
      id: Date.now() + Math.random(),
      field,
      operator,
      value
    };
  },

  // Helper method to get default operator for a field type
  getDefaultOperator(fieldType) {
    switch (fieldType) {
      case 'text':
      case 'email':
        return 'contains';
      case 'number':
        return 'equals';
      case 'date':
        return 'equals';
      case 'select':
        return 'equals';
      case 'array':
        return 'arrayContains';
      default:
        return 'equals';
    }
  }
};
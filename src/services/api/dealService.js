import dealData from '../mockData/deals.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let deals = [...dealData];

export const dealService = {
  async getAll() {
    await delay(300);
    return [...deals];
  },

  async getById(id) {
    await delay(200);
    const deal = deals.find(d => d.Id === parseInt(id, 10));
    if (!deal) {
      throw new Error('Deal not found');
    }
    return { ...deal };
  },

  async create(dealData) {
    await delay(400);
    const maxId = Math.max(...deals.map(d => d.Id), 0);
    const newDeal = {
      ...dealData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, updateData) {
    await delay(350);
    const index = deals.findIndex(d => d.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Deal not found');
    }
    
    const updatedDeal = {
      ...deals[index],
      ...updateData,
      Id: deals[index].Id, // Prevent ID modification
      updatedAt: new Date().toISOString()
    };
    
    deals[index] = updatedDeal;
    return { ...updatedDeal };
  },

  async delete(id) {
    await delay(250);
    const index = deals.findIndex(d => d.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Deal not found');
    }
    
    const deletedDeal = { ...deals[index] };
    deals.splice(index, 1);
    return deletedDeal;
  },

  async getByStage(stage) {
    await delay(200);
    return deals.filter(deal => deal.stage === stage);
  },

async updateStage(id, newStage) {
    await delay(300);
    return this.update(id, { stage: newStage });
  },

  async filter(filters) {
    await delay(250);
    if (!filters || filters.length === 0) {
      return [...deals];
    }

    return deals.filter(deal => {
      return filters.every(filter => {
        const { field, operator, value } = filter;
        const dealValue = deal[field];

        if (dealValue === undefined || dealValue === null) {
          return operator === 'isEmpty';
        }

        switch (operator) {
          case 'equals':
            return String(dealValue).toLowerCase() === String(value).toLowerCase();
          case 'contains':
            return String(dealValue).toLowerCase().includes(String(value).toLowerCase());
          case 'startsWith':
            return String(dealValue).toLowerCase().startsWith(String(value).toLowerCase());
          case 'endsWith':
            return String(dealValue).toLowerCase().endsWith(String(value).toLowerCase());
          case 'isEmpty':
            return !dealValue || String(dealValue).trim() === '';
          case 'isNotEmpty':
            return dealValue && String(dealValue).trim() !== '';
          case 'greaterThan':
            return Number(dealValue) > Number(value);
          case 'lessThan':
            return Number(dealValue) < Number(value);
          case 'greaterThanOrEqual':
            return Number(dealValue) >= Number(value);
          case 'lessThanOrEqual':
            return Number(dealValue) <= Number(value);
          case 'arrayContains':
            return Array.isArray(dealValue) && dealValue.some(item => 
              String(item).toLowerCase().includes(String(value).toLowerCase())
            );
          default:
            return true;
        }
      });
    });
  }
};
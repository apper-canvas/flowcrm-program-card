import activityData from '../mockData/activities.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let activities = [...activityData];

export const activityService = {
  async getAll() {
    await delay(300);
    return [...activities];
  },

  async getById(id) {
    await delay(200);
    const activity = activities.find(a => a.Id === parseInt(id, 10));
    if (!activity) {
      throw new Error('Activity not found');
    }
    return { ...activity };
  },

  async create(activityData) {
    await delay(400);
    const maxId = Math.max(...activities.map(a => a.Id), 0);
    const newActivity = {
      ...activityData,
      Id: maxId + 1,
      date: activityData.date || new Date().toISOString()
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  async update(id, updateData) {
    await delay(350);
    const index = activities.findIndex(a => a.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Activity not found');
    }
    
    const updatedActivity = {
      ...activities[index],
      ...updateData,
      Id: activities[index].Id // Prevent ID modification
    };
    
    activities[index] = updatedActivity;
    return { ...updatedActivity };
  },

  async delete(id) {
    await delay(250);
    const index = activities.findIndex(a => a.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Activity not found');
    }
    
    const deletedActivity = { ...activities[index] };
    activities.splice(index, 1);
    return deletedActivity;
  },

  async getByContact(contactId) {
    await delay(200);
    return activities.filter(activity => activity.contactId === contactId);
  },

  async getByDeal(dealId) {
    await delay(200);
    return activities.filter(activity => activity.dealId === dealId);
  }
};
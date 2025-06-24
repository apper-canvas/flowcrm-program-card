import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import ActivityTimeline from '@/components/organisms/ActivityTimeline';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import SearchBar from '@/components/molecules/SearchBar';
import { activityService } from '@/services/api/activityService';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    // Filter activities based on search query and type
    let filtered = activities;

    if (typeFilter !== 'all') {
      filtered = filtered.filter(activity => activity.type === typeFilter);
    }

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(activity =>
        activity.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredActivities(filtered);
  }, [activities, searchQuery, typeFilter]);

  const loadActivities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await activityService.getAll();
      setActivities(data);
      setFilteredActivities(data);
    } catch (err) {
      setError(err.message || 'Failed to load activities');
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCreateActivity = () => {
    // Placeholder for create functionality
    toast.info('Create activity functionality coming soon');
  };

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'call', label: 'Calls' },
    { value: 'email', label: 'Emails' },
    { value: 'meeting', label: 'Meetings' }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader count={5} type="list" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadActivities} />
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Activities</h1>
          <p className="text-gray-600">Track all customer interactions and communications.</p>
        </div>
        <Button onClick={handleCreateActivity} icon="Plus">
          Log Activity
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <SearchBar 
          placeholder="Search activities..." 
          onSearch={handleSearch}
          className="w-auto"
        />
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {activityTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setTypeFilter(type.value)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  typeFilter === type.value
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          
          <span className="text-sm text-gray-500">
            {filteredActivities.length} of {activities.length} activities
          </span>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {activityTypes.slice(1).map((type, index) => {
          const count = activities.filter(a => a.type === type.value).length;
          return (
            <motion.div
              key={type.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <p className="text-sm font-medium text-gray-600 mb-1">{type.label}</p>
              <p className="text-2xl font-bold text-primary">{count}</p>
            </motion.div>
          );
        })}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-4 border border-gray-200"
        >
          <p className="text-sm font-medium text-gray-600 mb-1">This Week</p>
          <p className="text-2xl font-bold text-success">
            {activities.filter(a => {
              const activityDate = new Date(a.date);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return activityDate >= weekAgo;
            }).length}
          </p>
        </motion.div>
      </div>

      {/* Content */}
      {filteredActivities.length === 0 && searchQuery === '' && typeFilter === 'all' ? (
        <EmptyState
          icon="Activity"
          title="No activities yet"
          description="Start logging your customer interactions to track engagement"
          actionLabel="Log Activity"
          onAction={handleCreateActivity}
        />
      ) : filteredActivities.length === 0 ? (
        <EmptyState
          icon="Search"
          title="No activities found"
          description="No activities match your current filters"
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setTypeFilter('all');
          }}
        />
      ) : (
        <ActivityTimeline activities={filteredActivities} showAll />
      )}
    </motion.div>
  );
};

export default Activities;
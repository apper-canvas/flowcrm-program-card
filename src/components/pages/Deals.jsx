import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import DealBoard from '@/components/organisms/DealBoard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import { dealService } from '@/services/api/dealService';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await dealService.getAll();
      setDeals(data);
    } catch (err) {
      setError(err.message || 'Failed to load deals');
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const handleDealMove = async (dealId, newStage) => {
    try {
      const updatedDeal = await dealService.updateStage(dealId, newStage);
      setDeals(deals.map(deal => 
        deal.Id === dealId ? updatedDeal : deal
      ));
      toast.success(`Deal moved to ${newStage}`);
    } catch (err) {
      toast.error('Failed to update deal stage');
    }
  };

  const handleDealClick = (deal) => {
    // Placeholder for deal details functionality
    toast.info('Deal details view coming soon');
  };

  const handleCreateDeal = () => {
    // Placeholder for create functionality
    toast.info('Create deal functionality coming soon');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="flex space-x-6 overflow-x-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-80 space-y-4">
              <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
              <SkeletonLoader count={3} type="card" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadDeals} />
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Deal Pipeline</h1>
          <p className="text-gray-600">Track your deals through the sales process.</p>
        </div>
        <Button onClick={handleCreateDeal} icon="Plus">
          Add Deal
        </Button>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { 
            label: 'Total Deals', 
            value: deals.length,
            color: 'text-gray-600'
          },
          { 
            label: 'Pipeline Value', 
            value: `$${(deals.reduce((sum, deal) => sum + deal.value, 0) / 1000).toFixed(0)}K`,
            color: 'text-primary'
          },
          { 
            label: 'Won This Month', 
            value: deals.filter(d => d.stage === 'Closed Won').length,
            color: 'text-success'
          },
          { 
            label: 'Avg Deal Size', 
            value: deals.length > 0 ? `$${(deals.reduce((sum, deal) => sum + deal.value, 0) / deals.length / 1000).toFixed(0)}K` : '$0',
            color: 'text-info'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 border border-gray-200"
          >
            <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Deal Board */}
      {deals.length === 0 ? (
        <EmptyState
          icon="Target"
          title="No deals yet"
          description="Start tracking your sales opportunities by creating your first deal"
          actionLabel="Add Deal"
          onAction={handleCreateDeal}
        />
      ) : (
        <DealBoard
          deals={deals}
          onDealMove={handleDealMove}
          onDealClick={handleDealClick}
        />
      )}
    </motion.div>
  );
};

export default Deals;
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import FilterBuilder from "@/components/molecules/FilterBuilder";
import { dealService } from "@/services/api/dealService";
import SkeletonLoader from "@/components/molecules/SkeletonLoader";
import EmptyState from "@/components/molecules/EmptyState";
import ErrorState from "@/components/molecules/ErrorState";
import DealBoard from "@/components/organisms/DealBoard";
import Button from "@/components/atoms/Button";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState([]);
  const [showFilterBuilder, setShowFilterBuilder] = useState(false);

  useEffect(() => {
    loadDeals();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [deals, filters]);

  const loadDeals = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await dealService.getAll();
      setDeals(data);
      setFilteredDeals(data);
    } catch (err) {
      setError(err.message || 'Failed to load deals');
      toast.error('Failed to load deals');
} finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    if (filters.length > 0) {
      try {
        const filtered = await dealService.filter(filters);
        setFilteredDeals(filtered);
      } catch (error) {
        toast.error('Error applying filters');
        setFilteredDeals(deals);
      }
    } else {
      setFilteredDeals(deals);
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
        <div className="flex overflow-x-auto space-x-6 pb-6">
          {[...Array(4)].map((_, i) => (
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
{/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <FilterBuilder
            type="deals"
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={showFilterBuilder}
            onToggle={() => setShowFilterBuilder(!showFilterBuilder)}
          />
        </div>
        <div className="text-sm text-gray-500">
          {filteredDeals.length} of {deals.length} deals
        </div>
      </div>
{/* Pipeline Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { 
            label: 'Total Deals', 
            value: filteredDeals.length,
            color: 'text-gray-600'
          },
          { 
            label: 'Pipeline Value', 
            value: `$${(filteredDeals.reduce((sum, deal) => sum + (deal.value || 0), 0) / 1000).toFixed(0)}K`,
            color: 'text-primary'
          },
          {
            label: 'Won This Month', 
            value: filteredDeals.filter(d => d.stage === 'Closed Won').length,
            color: 'text-success'
          },
          { 
            label: 'Avg Deal Size', 
            value: filteredDeals.length > 0 ? `$${(filteredDeals.reduce((sum, deal) => sum + (deal.value || 0), 0) / filteredDeals.length / 1000).toFixed(0)}K` : '$0',
            color: 'text-info'
          }
].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">
              {stat.label}
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Deal Board */}
      {filteredDeals.length === 0 && filters.length === 0 ? (
        <EmptyState
          icon="Target"
          title="No deals yet"
          description="Start tracking your sales opportunities by creating your first deal"
          actionLabel="Add Deal"
          onAction={handleCreateDeal}
        />
      ) : filteredDeals.length === 0 && filters.length > 0 ? (
        <EmptyState
          icon="Filter"
          title="No deals match filters"
          description="Try adjusting your filter criteria"
          actionLabel="Clear Filters"
          onAction={() => setFilters([])}
        />
      ) : (
        <DealBoard
          deals={filteredDeals}
          onDealMove={handleDealMove}
          onDealClick={handleDealClick}
        />
      )}
    </motion.div>
  );
};

export default Deals;
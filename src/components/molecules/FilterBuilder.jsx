import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';
import { filterService } from '@/services/api/filterService';

const FilterBuilder = ({ 
  type = 'contacts',
  filters = [],
  onFiltersChange,
  onApply,
  onClear,
  isOpen = false,
  onToggle,
  className = ''
}) => {
  const [fields, setFields] = useState([]);
  const [operators, setOperators] = useState({});
  const [localFilters, setLocalFilters] = useState(filters);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFieldsAndOperators();
  }, [type]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const loadFieldsAndOperators = async () => {
    setLoading(true);
    try {
      const [fieldsData, operatorsData] = await Promise.all([
        filterService.getFieldsForType(type),
        filterService.getOperators()
      ]);
      setFields(fieldsData);
      setOperators(operatorsData);
    } catch (error) {
      toast.error('Failed to load filter options');
    } finally {
      setLoading(false);
    }
  };

  const addFilter = () => {
    const newFilter = filterService.createFilter();
    const updatedFilters = [...localFilters, newFilter];
    setLocalFilters(updatedFilters);
  };

  const removeFilter = (filterId) => {
    const updatedFilters = localFilters.filter(f => f.id !== filterId);
    setLocalFilters(updatedFilters);
    if (onFiltersChange) {
      onFiltersChange(updatedFilters);
    }
  };

  const updateFilter = (filterId, updates) => {
    const updatedFilters = localFilters.map(filter => {
      if (filter.id === filterId) {
        const updatedFilter = { ...filter, ...updates };
        
        // Reset operator if field changes
        if (updates.field && updates.field !== filter.field) {
          const fieldDef = fields.find(f => f.key === updates.field);
          const defaultOperator = fieldDef ? filterService.getDefaultOperator(fieldDef.type) : 'equals';
          updatedFilter.operator = defaultOperator;
          updatedFilter.value = '';
        }
        
        return updatedFilter;
      }
      return filter;
    });
    
    setLocalFilters(updatedFilters);
  };

  const handleApply = () => {
    const validFilters = localFilters.filter(f => f.field && f.operator);
    if (onFiltersChange) {
      onFiltersChange(validFilters);
    }
    if (onApply) {
      onApply(validFilters);
    }
    toast.success(`${validFilters.length} filter${validFilters.length !== 1 ? 's' : ''} applied`);
  };

  const handleClear = () => {
    setLocalFilters([]);
    if (onFiltersChange) {
      onFiltersChange([]);
    }
    if (onClear) {
      onClear();
    }
    toast.info('Filters cleared');
  };

  const getFieldOptions = () => {
    return fields.map(field => ({
      value: field.key,
      label: field.label
    }));
  };

  const getOperatorOptions = (fieldKey) => {
    const field = fields.find(f => f.key === fieldKey);
    if (!field) return [];
    
    return field.operators.map(op => ({
      value: op,
      label: operators[op]?.label || op
    }));
  };

  const renderValueInput = (filter) => {
    const field = fields.find(f => f.key === filter.field);
    if (!field) return null;

    const noValueOperators = ['isEmpty', 'isNotEmpty'];
    if (noValueOperators.includes(filter.operator)) {
      return null;
    }

    const commonProps = {
      value: filter.value || '',
      onChange: (e) => updateFilter(filter.id, { value: e.target.value }),
      placeholder: 'Enter value...',
      className: 'flex-1'
    };

    switch (field.type) {
      case 'number':
        return <Input type="number" {...commonProps} />;
      case 'date':
        return <Input type="date" {...commonProps} />;
      case 'email':
        return <Input type="email" {...commonProps} />;
      case 'select':
        return (
          <Select
            value={field.options?.find(opt => opt.value === filter.value) || null}
            onChange={(selected) => updateFilter(filter.id, { value: selected?.value || '' })}
            options={field.options || []}
            placeholder="Select..."
            className="flex-1"
            classNamePrefix="react-select"
          />
        );
      default:
        return <Input type="text" {...commonProps} />;
    }
  };

  const hasActiveFilters = filters.length > 0;

  return (
    <div className={className}>
      {/* Filter Toggle Button */}
      <Button
        variant={hasActiveFilters ? 'primary' : 'ghost'}
        size="medium"
        icon="Filter"
        onClick={onToggle}
        className="relative"
      >
        Filters
        {hasActiveFilters && (
          <Badge 
            variant="primary" 
            size="small" 
            className="ml-2 min-w-[20px] h-5 flex items-center justify-center"
          >
            {filters.length}
          </Badge>
        )}
      </Button>

      {/* Filter Builder Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 z-50 mt-2"
          >
            <Card className="p-4 shadow-lg border-2 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Filter Builder</h3>
                <Button
                  variant="ghost"
                  size="small"
                  icon="X"
                  onClick={onToggle}
                  className="p-1"
                />
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <ApperIcon name="Loader2" className="w-6 h-6 animate-spin text-primary" />
                  <span className="ml-2 text-gray-600">Loading filter options...</span>
                </div>
              ) : (
                <>
                  {/* Filter Conditions */}
                  <div className="space-y-3 mb-4">
                    <AnimatePresence>
                      {localFilters.map((filter, index) => (
                        <motion.div
                          key={filter.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                        >
                          {index > 0 && (
                            <Badge variant="default" size="small" className="mr-2">
                              AND
                            </Badge>
                          )}
                          
                          {/* Field Select */}
                          <Select
                            value={getFieldOptions().find(opt => opt.value === filter.field) || null}
                            onChange={(selected) => updateFilter(filter.id, { field: selected?.value || '' })}
                            options={getFieldOptions()}
                            placeholder="Select field..."
                            className="w-40"
                            classNamePrefix="react-select"
                          />
                          
                          {/* Operator Select */}
                          <Select
                            value={getOperatorOptions(filter.field).find(opt => opt.value === filter.operator) || null}
                            onChange={(selected) => updateFilter(filter.id, { operator: selected?.value || '' })}
                            options={getOperatorOptions(filter.field)}
                            placeholder="Operator..."
                            className="w-36"
                            classNamePrefix="react-select"
                            isDisabled={!filter.field}
                          />
                          
                          {/* Value Input */}
                          {renderValueInput(filter)}
                          
                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="small"
                            icon="Trash2"
                            onClick={() => removeFilter(filter.id)}
                            className="text-error hover:text-error p-1"
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {localFilters.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <ApperIcon name="Filter" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No filters added yet</p>
                        <p className="text-sm">Click "Add Filter" to get started</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="small"
                      icon="Plus"
                      onClick={addFilter}
                    >
                      Add Filter
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={handleClear}
                        disabled={localFilters.length === 0}
                      >
                        Clear All
                      </Button>
                      <Button
                        variant="primary"
                        size="small"
                        onClick={handleApply}
                        disabled={localFilters.length === 0}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBuilder;
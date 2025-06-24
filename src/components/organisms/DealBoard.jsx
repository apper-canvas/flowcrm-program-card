import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

const DealBoard = ({ deals = [], onDealMove, onDealClick }) => {
  const stages = ['Discovery', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  
  const stageColors = {
    'Discovery': 'bg-gray-100',
    'Qualified': 'bg-blue-100',
    'Proposal': 'bg-purple-100',
    'Negotiation': 'bg-indigo-100',
    'Closed Won': 'bg-green-100',
    'Closed Lost': 'bg-red-100'
  };

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const dealId = parseInt(draggableId, 10);
    const newStage = destination.droppableId;

    if (onDealMove) {
      onDealMove(dealId, newStage);
    }
  };

  const formatCurrency = (amount) => {
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 75) return 'success';
    if (probability >= 50) return 'warning';
    return 'error';
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="flex space-x-6 overflow-x-auto pb-6">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage);
          const stageValue = stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);

          return (
            <div key={stage} className="flex-shrink-0 w-80">
              <div className={`rounded-lg p-4 mb-4 ${stageColors[stage]}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{stage}</h3>
                  <Badge variant="default">{stageDeals.length}</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Total: {formatCurrency(stageValue)}
                </p>
              </div>

              <Droppable droppableId={stage}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] space-y-3 p-2 rounded-lg transition-colors duration-200 ${
                      snapshot.isDraggingOver ? 'bg-gray-100' : ''
                    }`}
                  >
                    {stageDeals.map((deal, index) => (
                      <Draggable
                        key={deal.Id}
                        draggableId={deal.Id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`transform transition-transform duration-200 ${
                              snapshot.isDragging ? 'rotate-3 scale-105' : ''
                            }`}
                          >
                            <Card 
                              className="p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                              onClick={() => onDealClick?.(deal)}
                            >
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <h4 className="font-medium text-gray-900 text-sm break-words">
                                    {deal.title}
                                  </h4>
                                  <ApperIcon name="GripVertical" className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-gray-900">
                                    {formatCurrency(deal.value)}
                                  </span>
                                  <Badge variant={getProbabilityColor(deal.probability)} size="small">
                                    {deal.probability}%
                                  </Badge>
                                </div>

                                <div className="flex items-center text-xs text-gray-500">
                                  <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                                  {deal.expectedClose ? 
                                    format(new Date(deal.expectedClose), 'MMM d') : 
                                    'No date'
                                  }
                                </div>

                                <div className="flex items-center text-xs text-gray-500">
                                  <ApperIcon name="User" className="w-3 h-3 mr-1" />
                                  {deal.owner}
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default DealBoard;
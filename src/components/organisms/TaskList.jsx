import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { format, isAfter, isToday, isTomorrow } from 'date-fns';

const TaskList = ({ tasks = [], onToggleComplete, onEdit, onDelete }) => {
  const [filter, setFilter] = useState('all'); //all, pending, completed, overdue

  const getFilteredTasks = () => {
    const now = new Date();
    
    switch (filter) {
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'overdue':
        return tasks.filter(task => !task.completed && isAfter(now, new Date(task.dueDate)));
      default:
        return tasks;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getDateStatus = (dueDate, completed) => {
    if (completed) return { text: 'Completed', color: 'text-success' };
    
    const due = new Date(dueDate);
    const now = new Date();
    
    if (isAfter(now, due)) return { text: 'Overdue', color: 'text-error' };
    if (isToday(due)) return { text: 'Due today', color: 'text-warning' };
    if (isTomorrow(due)) return { text: 'Due tomorrow', color: 'text-info' };
    
    return { text: format(due, 'MMM d'), color: 'text-gray-500' };
  };

  const filteredTasks = getFilteredTasks();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
        <div className="flex space-x-2">
          {['all', 'pending', 'completed', 'overdue'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 text-sm rounded-full capitalize transition-colors ${
                filter === filterType
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredTasks.map((task, index) => {
          const dateStatus = getDateStatus(task.dueDate, task.completed);
          
          return (
            <motion.div
              key={task.Id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                task.completed 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <button
                onClick={() => onToggleComplete?.(task)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  task.completed
                    ? 'bg-success border-success text-white'
                    : 'border-gray-300 hover:border-primary'
                }`}
              >
                {task.completed && <ApperIcon name="Check" className="w-3 h-3" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-sm font-medium truncate ${
                    task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                  }`}>
                    {task.title}
                  </h4>
                  <Badge variant={getPriorityColor(task.priority)} size="small">
                    {task.priority}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 truncate">{task.relatedTo}</span>
                  <span className={dateStatus.color}>{dateStatus.text}</span>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  size="small"
                  variant="ghost"
                  onClick={() => onEdit?.(task)}
                >
                  <ApperIcon name="Edit" className="w-4 h-4" />
                </Button>
                <Button
                  size="small"
                  variant="ghost"
                  onClick={() => onDelete?.(task)}
                >
                  <ApperIcon name="Trash2" className="w-4 h-4 text-error" />
                </Button>
              </div>
            </motion.div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No tasks found</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TaskList;
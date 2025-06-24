import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import TaskList from '@/components/organisms/TaskList';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import SearchBar from '@/components/molecules/SearchBar';
import { taskService } from '@/services/api/taskService';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    // Filter tasks based on search query
    if (searchQuery.trim() === '') {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.relatedTo?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTasks(filtered);
    }
  }, [tasks, searchQuery]);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await taskService.getAll();
      setTasks(data);
      setFilteredTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = await taskService.toggleComplete(task.Id);
      setTasks(tasks.map(t => t.Id === task.Id ? updatedTask : t));
      toast.success(`Task marked as ${updatedTask.completed ? 'completed' : 'incomplete'}`);
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleEditTask = (task) => {
    // Placeholder for edit functionality
    toast.info('Edit task functionality coming soon');
  };

  const handleDeleteTask = async (task) => {
    if (!confirm(`Are you sure you want to delete "${task.title}"?`)) return;
    
    try {
      await taskService.delete(task.Id);
      setTasks(tasks.filter(t => t.Id !== task.Id));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleCreateTask = () => {
    // Placeholder for create functionality
    toast.info('Create task functionality coming soon');
  };

  // Calculate task statistics
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const overdueTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return !task.completed && dueDate < new Date();
  }).length;

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader count={1} type="card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadTasks} />
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tasks</h1>
          <p className="text-gray-600">Manage your to-do list and track progress.</p>
        </div>
        <Button onClick={handleCreateTask} icon="Plus">
          Add Task
        </Button>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { 
            label: 'Total Tasks', 
            value: tasks.length,
            color: 'text-gray-600'
          },
          { 
            label: 'Completed', 
            value: completedTasks,
            color: 'text-success'
          },
          { 
            label: 'Pending', 
            value: pendingTasks,
            color: 'text-warning'
          },
          { 
            label: 'Overdue', 
            value: overdueTasks,
            color: 'text-error'
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

      {/* Search */}
      <div className="flex items-center justify-between mb-6">
        <SearchBar 
          placeholder="Search tasks..." 
          onSearch={handleSearch}
          className="w-auto"
        />
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {filteredTasks.length} of {tasks.length} tasks
          </span>
        </div>
      </div>

      {/* Content */}
      {filteredTasks.length === 0 && searchQuery === '' ? (
        <EmptyState
          icon="CheckSquare"
          title="No tasks yet"
          description="Stay organized by creating your first task"
          actionLabel="Add Task"
          onAction={handleCreateTask}
        />
      ) : filteredTasks.length === 0 && searchQuery !== '' ? (
        <EmptyState
          icon="Search"
          title="No tasks found"
          description={`No tasks match "${searchQuery}"`}
          actionLabel="Clear Search"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <TaskList
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}
    </motion.div>
  );
};

export default Tasks;
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import DashboardStats from '@/components/organisms/DashboardStats';
import PipelineChart from '@/components/organisms/PipelineChart';
import ActivityTimeline from '@/components/organisms/ActivityTimeline';
import TaskList from '@/components/organisms/TaskList';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import { dealService } from '@/services/api/dealService';
import { activityService } from '@/services/api/activityService';
import { taskService } from '@/services/api/taskService';

const Dashboard = () => {
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [dealsData, activitiesData, tasksData] = await Promise.all([
        dealService.getAll(),
        activityService.getAll(),
        taskService.getAll()
      ]);
      
      setDeals(dealsData);
      setActivities(activitiesData.slice(0, 10)); // Show recent activities
      setTasks(tasksData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTaskComplete = async (task) => {
    try {
      const updatedTask = await taskService.toggleComplete(task.Id);
      setTasks(tasks.map(t => t.Id === task.Id ? updatedTask : t));
      toast.success(`Task marked as ${updatedTask.completed ? 'completed' : 'incomplete'}`);
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonLoader count={4} type="card" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonLoader count={2} type="card" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadDashboardData} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your sales.</p>
      </div>

      {/* Stats */}
      <DashboardStats deals={deals} activities={activities} tasks={tasks} />

      {/* Charts and Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PipelineChart deals={deals} />
        <ActivityTimeline activities={activities} />
      </div>

      {/* Tasks */}
      <TaskList 
        tasks={tasks.slice(0, 8)} 
        onToggleComplete={handleToggleTaskComplete}
      />
    </motion.div>
  );
};

export default Dashboard;
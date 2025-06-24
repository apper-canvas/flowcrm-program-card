import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import ProgressRing from '@/components/atoms/ProgressRing';
import ApperIcon from '@/components/ApperIcon';

const DashboardStats = ({ deals = [], activities = [], tasks = [] }) => {
  // Calculate metrics
  const totalPipelineValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  const wonDeals = deals.filter(deal => deal.stage === 'Closed Won');
  const totalWonValue = wonDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  const conversionRate = deals.length > 0 ? (wonDeals.length / deals.length) * 100 : 0;
  const activitiesThisWeek = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return activityDate >= weekAgo;
  }).length;
  const overdueTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return !task.completed && dueDate < new Date();
  }).length;

  const stats = [
    {
      title: 'Pipeline Value',
      value: `$${(totalPipelineValue / 1000).toFixed(0)}K`,
      change: '+12%',
      changeType: 'positive',
      icon: 'TrendingUp'
    },
    {
      title: 'Won This Month',
      value: `$${(totalWonValue / 1000).toFixed(0)}K`,
      change: '+8%',
      changeType: 'positive',
      icon: 'DollarSign'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate.toFixed(0)}%`,
      change: '+3%',
      changeType: 'positive',
      icon: 'Target'
    },
    {
      title: 'Activities This Week',
      value: activitiesThisWeek,
      change: '+15%',
      changeType: 'positive',
      icon: 'Activity'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-success' : 'text-error'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;
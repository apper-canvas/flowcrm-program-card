import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import ActivityIcon from '@/components/molecules/ActivityIcon';
import { format, formatDistanceToNow } from 'date-fns';

const ActivityTimeline = ({ activities = [], showAll = false }) => {
  const displayedActivities = showAll ? activities : activities.slice(0, 5);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
        {!showAll && activities.length > 5 && (
          <button className="text-sm text-primary hover:text-primary/80">
            View all {activities.length}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {displayedActivities.map((activity, index) => (
          <motion.div
            key={activity.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3"
          >
            <ActivityIcon type={activity.type} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {activity.subject}
                </h4>
                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                  {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                </span>
              </div>
              {activity.notes && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {activity.notes}
                </p>
              )}
              <div className="flex items-center text-xs text-gray-500 space-x-4">
                <span>{format(new Date(activity.date), 'MMM d, yyyy h:mm a')}</span>
                {activity.duration > 0 && (
                  <span>{activity.duration} minutes</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {displayedActivities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No activities yet</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ActivityTimeline;
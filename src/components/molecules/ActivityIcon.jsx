import ApperIcon from '@/components/ApperIcon';

const ActivityIcon = ({ type, className = '' }) => {
  const iconMap = {
    call: { icon: 'Phone', color: 'text-blue-500 bg-blue-100' },
    email: { icon: 'Mail', color: 'text-green-500 bg-green-100' },
    meeting: { icon: 'Calendar', color: 'text-purple-500 bg-purple-100' },
    task: { icon: 'CheckSquare', color: 'text-orange-500 bg-orange-100' },
    note: { icon: 'FileText', color: 'text-gray-500 bg-gray-100' }
  };

  const config = iconMap[type] || iconMap.note;

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.color} ${className}`}>
      <ApperIcon name={config.icon} className="w-4 h-4" />
    </div>
  );
};

export default ActivityIcon;
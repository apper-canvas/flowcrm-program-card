import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  hover = false,
  className = '',
  ...props 
}) => {
  const cardClasses = `
    bg-white rounded-lg border border-gray-200 shadow-card
    ${hover ? 'hover:shadow-card-hover cursor-pointer' : ''}
    ${className}
  `;

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className={cardClasses}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;
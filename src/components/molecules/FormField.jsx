import Input from '@/components/atoms/Input';
import { motion } from 'framer-motion';

const FormField = ({ 
  label,
  error,
  required = false,
  children,
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-1 ${className}`}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {children || <Input error={error} {...props} />}
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-sm text-error"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default FormField;
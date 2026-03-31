import { motion } from 'framer-motion';
// import { cn } from '../utils'; 

const Button = ({ children, className = '', variant = 'primary', size = 'md', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0';
  
  const variants = {
    primary: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 focus:ring-amber-500',
    secondary: 'bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50 focus:ring-gray-500',
    outline: 'border-2 border-amber-500 text-amber-600 hover:bg-amber-50 focus:ring-amber-500',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-lg',
    lg: 'px-8 py-4 text-xl',
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;


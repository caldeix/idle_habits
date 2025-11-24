import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSettings } from 'react-icons/fi';
import StoreConfigModal from './StoreConfigModal';

export const StoreConfigButton = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsConfigOpen(true)}
        className="fixed bottom-24 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg z-10"
        title="Configurar tienda"
      >
        <FiSettings size={24} />
      </motion.button>

      {isConfigOpen && (
        <StoreConfigModal onClose={() => setIsConfigOpen(false)} />
      )}
    </>
  );
};

export default StoreConfigButton;

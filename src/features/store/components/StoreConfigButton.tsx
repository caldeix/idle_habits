import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSettings } from 'react-icons/fi';
import StoreConfigModal from './StoreConfigModal';
import './Store.css';

const StoreConfigButton = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsConfigOpen(true)}
        className="store-config-btn"
        title="Configurar tienda"
      >
        <FiSettings size={20} />
      </motion.button>

      {isConfigOpen && (
        <StoreConfigModal onClose={() => setIsConfigOpen(false)} />
      )}
    </>
  );
};

export default StoreConfigButton;

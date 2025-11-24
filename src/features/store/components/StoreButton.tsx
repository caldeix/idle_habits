// src/features/store/components/StoreButton.tsx
import { FiShoppingBag } from 'react-icons/fi';
import { useStore } from '../context/StoreContext';

const StoreButton = () => {
  const { openStore } = useStore();

  const handleClick = () => {
    console.log('Botón de la tienda clickeado');
    openStore();
  };


  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-full shadow-lg transform transition-all hover:scale-110"
      aria-label="Abrir tienda"
    >
      <FiShoppingBag size={24} /> 
    </button>
  );
};

export default StoreButton;
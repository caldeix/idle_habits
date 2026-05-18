import { FiShoppingBag } from 'react-icons/fi';
import { useStore } from '../context/StoreContext';
import './Store.css';

const StoreButton = () => {
  const { openStore } = useStore();

  return (
    <button
      onClick={openStore}
      className="store-open-btn"
      aria-label="Abrir tienda"
    >
      <FiShoppingBag size={22} />
    </button>
  );
};

export default StoreButton;

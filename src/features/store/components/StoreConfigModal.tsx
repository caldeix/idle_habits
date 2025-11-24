import { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { getRarityColor } from '../domain/store.utils';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import type { StoreItem } from '../domain/store.types';
import './Store.css';

interface StoreConfigModalProps {
  onClose: () => void;
}

const DEFAULT_ITEM: Omit<StoreItem, 'id' | 'stock'> = {
  name: '',
  description: '',
  price: 100,
  maxStock: 1,
  icon: '🎁',
  rarity: 'common'
} as const;

const RARITY_OPTIONS = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const;

const StoreConfigModal = ({ onClose }: StoreConfigModalProps) => {
  const {
    items,
    playerCoins,
    updateStoreItem,
    addStoreItem,
    removeStoreItem
  } = useStore();

  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
  const [newItem, setNewItem] = useState<Omit<StoreItem, 'id' | 'stock'>>(DEFAULT_ITEM);
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleEdit = (item: StoreItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      description: item.description,
      price: item.price,
      maxStock: item.maxStock,
      icon: item.icon,
      rarity: item.rarity
    });
    setIsDeleting(false);
  };

  const handleIsDeleting = (item: StoreItem) => {
    handleEdit(item);
    setIsDeleting(true);
    
  };

  const handleSave = () => {
    if (!newItem.name || !newItem.description || newItem.price <= 0 || newItem.maxStock <= 0) {
      setStatus({ type: 'error', message: 'Por favor completa todos los campos requeridos' });
      return;
    }

    if (editingItem) {
      // Update existing item
      updateStoreItem(editingItem.id, {
        ...newItem,
        id: editingItem.id,
        stock: editingItem.stock // Keep the same stock
      });
      setStatus({ type: 'success', message: 'Recompensa actualizada exitosamente' });
    } else {
      // Create new item (costs 100 coins)
      if (playerCoins < 100) {
        setStatus({ type: 'error', message: 'No tienes suficientes monedas (se necesitan 100)' });
        return;
      }

      const newItemWithStock = {
        ...newItem,
        id: `custom_${Date.now()}`,
        stock: newItem.maxStock
      };

      addStoreItem(newItemWithStock, 100);
      setStatus({ type: 'success', message: '¡Recompensa creada exitosamente! (-100 monedas)' });
    }

    // Reset form
    setEditingItem(null);
    setNewItem(DEFAULT_ITEM);
  };

  const handleDelete = () => {
    if (!editingItem) return;

    removeStoreItem(editingItem.id);
    setStatus({ type: 'success', message: 'Recompensa eliminada (+25 monedas)' });
    setEditingItem(null);
    setNewItem(DEFAULT_ITEM);
    setIsDeleting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setNewItem(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'maxStock'
        ? Math.max(0, parseInt(value) || 0)
        : value
    }));
  };

  // Close the modal and reset the form
  const handleClose = () => {
    setEditingItem(null);
    setNewItem(DEFAULT_ITEM);
    setIsDeleting(false);
    onClose();
  };

  return (
    <div
      className="store-content visible"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className=""
        >
          {/* Header */}
          <div className="store-actions">
            <h2 className="">RECOMPENSAS</h2>
            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className=""
              >
                <FiX size={24} />
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="statusbar">
            <div className="coins">
              <span className="">HABITCOINS:</span>
              <span className="text-yellow-400">{playerCoins}</span>
            </div>
          </div>

          <div className="container-configitems">
            {/* Items List */}
            <div className="configitems">
              <h3 className="">Recompensas existentes</h3>
              <div className="">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={` ${editingItem?.id === item.id ? '' : ''
                      }`}
                  >
                    <div className="">
                      <div>
                        <div className="">
                          <span style={{ color: getRarityColor(item.rarity) }}>{item.icon}</span>
                          <span> {item.name} </span>
                          <span className="text-  sm text-gray-500">x{item.stock}/{item.maxStock}</span>
                        </div>
                        <p className="">{item.description}</p>
                        <div className="">
                          <span className="text-yellow-400">{item.price} </span><span>monedas</span>
                          {/*<span style={{ color: getRarityColor(item.rarity) }}>
                            {item.rarity}
                          </span>*/}
                        </div>
                      </div>
                      <div className="">
                        <button
                          onClick={() => handleEdit(item)}
                          className="btn-small"
                          title="Editar"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleIsDeleting(item)}
                         className="btn-small"
                          title="Eliminar"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  <hr/>
                  </div>
                  
                ))}
              </div>
            </div>

            {/* Edit/Create Form */}
            <div className="configform">
              <h3 className="text-lg font-semibold mb-3">
                {editingItem ?  isDeleting ? 'ELIMINAR RECOMPENSA' : 'Editar recompensa' : 'Nueva recompensa'}
              </h3>

              <div className="space-y-4">
                <div className='w-100 pd-15'>
                   <label className="">
                      Nombre <span className="text-red-400">*</span>
                    </label>
                  <input
                    type="text"
                    name="name"
                    value={newItem.name}
                    onChange={handleInputChange}
                    className="w-100 pd-5"
                    placeholder="Nombre de la recompensa"
                  />
                </div>

                <div className='w-100 pd-15'>
                   <label className="">
                     Descripción <span className="text-red-400">*</span>
                    </label>
                  <textarea
                    name="description"
                    value={newItem.description}
                    onChange={handleInputChange}
                    className="w-100 pd-5"
                    placeholder="Descripción de la recompensa"
                  />
                </div>

                <div className="w-100 pd-15 stocksprice">
                  <div className="w-45">
                    <label className="">
                      🪙Precio <span className="text-red-400">*</span>
                    </label>

                    <input
                      type="number"
                      name="price"
                      min="1"
                      value={newItem.price}
                      onChange={handleInputChange}
                      className="w-100 pd-5"
                    />


                  </div>

                  <div className="w-45">
                    <label className="">
                      Stock max <span className="text-red-400">*</span>
                    </label>
                    {<input
                      type="number"
                      name="maxStock"
                      min="1"
                      value={newItem.maxStock}
                      onChange={handleInputChange}
                      className="w-100 pd-5"
                      disabled={!!editingItem}
                    />}
                  </div>



                  <div className="w-15 icon">
                    <label className="">
                      Ícono
                    </label>
                    <input
                      type="text"
                      name="icon"
                      value={newItem.icon}
                      onChange={handleInputChange}
                      className="w-100 pd-5"
                      maxLength={2}
                    />
                  </div>

                  {/*<div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rareza
                    </label>
                    <select
                      name="rarity"
                      value={newItem.rarity}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    >
                      {RARITY_OPTIONS.map((rarity) => (
                        <option key={rarity} value={rarity}>
                          {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>*/}

                </div>

                {/* Action Buttons */}
                <div className="actions pd-15">
                  {editingItem ? (
                    <>
                      <div className="">
                        <button
                          onClick={handleSave}
                          className=""
                        >
                          Guardar cambios
                        </button>
                        
                        <p className="">
                          ¡Estas editando una recompensa!
                        </p>
                      </div>

                      {isDeleting && (
                        <div className="">
                          <p className="">
                            ¿Eliminar esta recompensa? Recuperarás 25 monedas.
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={handleDelete}
                              className=""
                            >
                              Sí, eliminar
                            </button>
                            <button
                              onClick={() => setIsDeleting(false)}
                              className=""
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="">
                      <button
                        onClick={handleSave}
                        className=""
                      >
                        Crear recompensa (100 monedas)
                      </button>
                      <p className="">
                        Crear una nueva recompensa cuesta 100 monedas.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Notification */}
          <AnimatePresence>
            {status && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className={`notification-config ${status.type === 'success' ? 'text-green-400' : 'text-red-400'
                  } `}
              >
                {status.message}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default StoreConfigModal;

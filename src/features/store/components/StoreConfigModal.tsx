import { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { getRarityColor } from '../domain/store.utils';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
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
  rarity: 'common',
} as const;

const StoreConfigModal = ({ onClose }: StoreConfigModalProps) => {
  const { items, playerCoins, updateStoreItem, addStoreItem, removeStoreItem } = useStore();

  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
  const [newItem, setNewItem] = useState<Omit<StoreItem, 'id' | 'stock'>>(DEFAULT_ITEM);
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(null), 3000);
    return () => clearTimeout(timer);
  }, [status]);

  const handleEdit = (item: StoreItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      description: item.description,
      price: item.price,
      maxStock: item.maxStock,
      icon: item.icon,
      rarity: item.rarity,
    });
    setIsDeleting(false);
  };

  const handleStartDelete = (item: StoreItem) => {
    handleEdit(item);
    setIsDeleting(true);
  };

  const handleSave = () => {
    if (!newItem.name || !newItem.description || newItem.price <= 0 || newItem.maxStock <= 0) {
      setStatus({ type: 'error', message: 'Por favor completa todos los campos requeridos' });
      return;
    }

    if (editingItem) {
      updateStoreItem(editingItem.id, { ...newItem, id: editingItem.id, stock: editingItem.stock });
      setStatus({ type: 'success', message: 'Recompensa actualizada exitosamente' });
    } else {
      if (playerCoins < 100) {
        setStatus({ type: 'error', message: 'No tienes suficientes monedas (se necesitan 100)' });
        return;
      }
      addStoreItem({ ...newItem, id: `custom_${Date.now()}`, stock: newItem.maxStock }, 100);
      setStatus({ type: 'success', message: '¡Recompensa creada exitosamente! (-100 monedas)' });
    }

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'maxStock'
        ? Math.max(0, parseInt(value) || 0)
        : value,
    }));
  };

  const handleClose = () => {
    setEditingItem(null);
    setNewItem(DEFAULT_ITEM);
    setIsDeleting(false);
    onClose();
  };

  return (
    <div
      className="store-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="store-panel"
        >
          {/* Header */}
          <div className="store-header">
            <h2>RECOMPENSAS</h2>
            <button onClick={handleClose} className="store-close-btn" aria-label="Cerrar">
              <FiX size={20} />
            </button>
          </div>

          {/* Status bar */}
          <div className="store-statusbar">
            <div className="coins">
              <span>HABITCOINS:</span>
              <span className="coins-value">{playerCoins}</span>
            </div>
          </div>

          <div className="config-grid">
            {/* Items list */}
            <div className="config-items-list">
              <h3>Recompensas existentes</h3>
              {items.map((item) => (
                <div key={item.id} className="config-item-row">
                  <div className="config-item-info">
                    <div className="config-item-name">
                      <span style={{ color: getRarityColor(item.rarity) }}>{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    <span className="config-item-stock">
                      x{item.stock}/{item.maxStock}
                    </span>
                  </div>
                  <p className="config-item-desc">{item.description}</p>
                  <div className="config-item-price">{item.price} monedas</div>
                  <div className="config-item-actions">
                    <button
                      onClick={() => handleEdit(item)}
                      className="btn-small"
                      title="Editar"
                    >
                      <FiEdit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleStartDelete(item)}
                      className="btn-small"
                      title="Eliminar"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit / Create form */}
            <div className="config-form">
              <h3>
                {editingItem
                  ? isDeleting
                    ? 'ELIMINAR RECOMPENSA'
                    : 'Editar recompensa'
                  : 'Nueva recompensa'}
              </h3>

              <div className="form-field">
                <label>Nombre <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={newItem.name}
                  onChange={handleInputChange}
                  placeholder="Nombre de la recompensa"
                />
              </div>

              <div className="form-field">
                <label>Descripción <span className="text-danger">*</span></label>
                <textarea
                  name="description"
                  value={newItem.description}
                  onChange={handleInputChange}
                  placeholder="Descripción de la recompensa"
                />
              </div>

              <div className="fields-row">
                <div className="form-field">
                  <label>🪙 Precio <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    name="price"
                    min="1"
                    value={newItem.price}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-field">
                  <label>Stock máx. <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    name="maxStock"
                    min="1"
                    value={newItem.maxStock}
                    onChange={handleInputChange}
                    disabled={!!editingItem}
                  />
                </div>

                <div className="form-field" style={{ flex: '0 0 64px' }}>
                  <label>Ícono</label>
                  <input
                    type="text"
                    name="icon"
                    value={newItem.icon}
                    onChange={handleInputChange}
                    maxLength={2}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="form-actions">
                {editingItem ? (
                  <>
                    <button onClick={handleSave} className="btn-primary">
                      Guardar cambios
                    </button>
                    <p className="form-hint">Estás editando una recompensa.</p>

                    {isDeleting && (
                      <div className="delete-confirm">
                        <p>¿Eliminar esta recompensa? Recuperarás 25 monedas.</p>
                        <div className="delete-confirm-actions">
                          <button onClick={handleDelete} className="btn-danger">
                            Sí, eliminar
                          </button>
                          <button onClick={() => setIsDeleting(false)} className="btn-ghost">
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <button onClick={handleSave} className="btn-primary">
                      Crear recompensa (100 monedas)
                    </button>
                    <p className="form-hint">Crear una nueva recompensa cuesta 100 monedas.</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Status notification */}
          <AnimatePresence>
            {status && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className={`notification-config ${status.type === 'success' ? 'text-success' : 'text-danger'}`}
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

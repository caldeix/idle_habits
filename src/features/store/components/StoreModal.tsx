import { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiClock } from 'react-icons/fi';
import './Store.css';

const StoreModal = () => {
    const { isStoreOpen, closeStore, items, purchaseItem, playerCoins, nextResetDate } = useStore();

    const [purchaseStatus, setPurchaseStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (!purchaseStatus) return;
        const timer = setTimeout(() => setPurchaseStatus(null), 3000);
        return () => clearTimeout(timer);
    }, [purchaseStatus]);

    const handlePurchase = (itemId: string, price: number) => {
        const { success } = purchaseItem(itemId, 1, price);
        setPurchaseStatus(
            success
                ? { type: 'success', message: '¡Compra exitosa!' }
                : {
                      type: 'error',
                      message: playerCoins < price
                          ? '¡No tienes suficientes monedas!'
                          : 'No se pudo completar la compra',
                  }
        );
    };

    if (!isStoreOpen) return null;

    return (
        <div
            className="store-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) closeStore(); }}
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
                        <h2>HABIT'S STORE</h2>
                        <button onClick={closeStore} className="store-close-btn" aria-label="Cerrar">
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* Status bar */}
                    <div className="store-statusbar">
                        <div className="coins">
                            <span>HABITCOINS:</span>
                            <span className="coins-value">{playerCoins}</span>
                        </div>
                        <div className="reset">
                            <FiClock size={12} />
                            <span>Reinicio: {nextResetDate}</span>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="store-items-grid">
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="item-store"
                            >
                                <div className="item-header">
                                    <h3>{item.icon} {item.name}</h3>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePurchase(item.id, item.price);
                                        }}
                                        disabled={item.stock === 0 || playerCoins < item.price}
                                        className="buy-btn"
                                    >
                                        {item.stock === 0 ? 'AGOTADO' : 'COMPRAR'}
                                    </button>
                                </div>

                                <p className="item-desc">{item.description}</p>

                                <div className="item-footer">
                                    <span className="item-price">
                                        {item.price} <span className="price-unit">habitcoins</span>
                                    </span>
                                    <span className={item.stock > 0 ? 'item-stock-ok' : 'item-stock-out'}>
                                        {item.stock}/{item.maxStock}{' '}
                                        <span className="text-xs">disponibles</span>
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Purchase notification */}
                    <AnimatePresence>
                        {purchaseStatus && (
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                className={`notification-config ${purchaseStatus.type === 'success' ? 'text-success' : 'text-danger'}`}
                            >
                                {purchaseStatus.message}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export { StoreModal };
export default StoreModal;

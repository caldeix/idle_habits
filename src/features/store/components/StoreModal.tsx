// src/features/store/components/StoreModal.tsx
import { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { getRarityColor } from '../domain/store.utils';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiClock } from 'react-icons/fi';
import './Store.css';


const StoreModal = () => {
    const {
        isStoreOpen,
        closeStore,
        items,
        purchaseItem,
        playerCoins,
        nextResetDate
    } = useStore();

    const [purchaseStatus, setPurchaseStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        if (purchaseStatus) {
            const timer = setTimeout(() => setPurchaseStatus(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [purchaseStatus]);

    useEffect(() => {
        console.log('Estado del modal de la tienda:', isStoreOpen ? 'Abierto' : 'Cerrado');
        console.log('Número de ítems en la tienda:', items.length);
    }, [isStoreOpen, items]);

    const handlePurchase = (itemId: string, price: number) => {
        const { success } = purchaseItem(itemId, 1, price);
        if (success) {
            setPurchaseStatus({ type: 'success', message: '¡Compra exitosa!' });
        } else {
            setPurchaseStatus({
                type: 'error',
                message: playerCoins < price
                    ? '¡No tienes suficientes monedas!'
                    : 'No se pudo completar la compra'
            });
        }
    };

    if (!isStoreOpen) return null;

    return (
        <div
            className={`store-content ${isStoreOpen ? 'visible' : ''}`}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    closeStore();
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
                        <h2 className="">HABIT's STORE</h2>
                        <button
                            onClick={closeStore}
                            className=""
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    {/* Status Bar */}
                    <div className="statusbar">
                        <div className="coins">
                            <span className="">HABITCOINS:</span>
                            <span className="text-yellow-400">{playerCoins}</span>
                        </div>
                        <div className="reset">
                            <FiClock />
                            <span> Reinicio: {nextResetDate}</span>
                        </div>
                    </div>

                    {/* Items Grid */}
                    <div className="">
                        <div className="container-items">
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedItem(item)}
                                    className="item-store"
                                >
                                    <div
                                        className=""
                                        style={{ color: getRarityColor(item.rarity) }}
                                    >
                                        {item.icon}
                                    </div>
                                    <div className='title-actions'><h3 className="">{item.name} </h3> <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePurchase(item.id, item.price);
                                            }}
                                            disabled={item.stock === 0 || playerCoins < item.price}
                                            className={` ${item.stock === 0
                                                ? ''
                                                : playerCoins >= item.price
                                                    ? ''
                                                    : ''
                                                } `}
                                        >
                                            {item.stock === 0 ? 'AGOTADO' : 'COMPRAR'}
                                        </button></div>
                                    <p className="">{item.description}</p>
                                    <div className="">
                                        <div className="">
                                            <span className=""><span className="text-yellow-400">{item.price}</span> <span className="text-xs">habitcoins </span></span>
                                            <span className={` ${item.stock > 0 ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                {item.stock}/{item.maxStock}  <span className="text-xs">disponibles</span>
                                            </span>
                                        </div>
                                        
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Purchase Status Notification */}
                    <AnimatePresence>
                        {purchaseStatus && (
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 100, opacity: 0 }}
                                className={`fixed bottom-4 right-4 p-4 rounded-lg ${purchaseStatus.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                                    } text-white shadow-lg`}
                            >
                                {purchaseStatus.message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Item Detail Modal */}
                    {/*<AnimatePresence>
                        {selectedItem && (
                            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-gray-900 border-2 border-yellow-500 rounded-lg p-6 max-w-md w-full relative"
                                >
                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                                    >
                                        <FiX size={24} />
                                    </button>

                                    <div className="text-center">
                                        <div
                                            className="text-6xl mb-4 mx-auto"
                                            style={{ color: getRarityColor(selectedItem.rarity) }}
                                        >
                                            {selectedItem.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{selectedItem.name}</h3>
                                        <p className="text-gray-300 mb-4">{selectedItem.description}</p>

                                        <div className="bg-gray-800 rounded-lg p-4 mb-6">
                                            <div className="grid grid-cols-2 gap-4 text-left">
                                                <div>
                                                    <p className="text-gray-400 text-sm">Precio:</p>
                                                    <p className="text-yellow-400 font-mono text-lg">{selectedItem.price} monedas</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-sm">Disponibles:</p>
                                                    <p className={`${selectedItem.stock > 0 ? 'text-green-400' : 'text-red-400'
                                                        } font-mono`}>
                                                        {selectedItem.stock}/{selectedItem.maxStock}
                                                    </p>
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="text-gray-400 text-sm">Rareza:</p>
                                                    <p
                                                        className="capitalize font-medium"
                                                        style={{ color: getRarityColor(selectedItem.rarity) }}
                                                    >
                                                        {selectedItem.rarity}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                handlePurchase(selectedItem.id, selectedItem.price);
                                                setSelectedItem(null);
                                            }}
                                            disabled={selectedItem.stock === 0 || playerCoins < selectedItem.price}
                                            className={`w-full py-3 rounded-md font-medium text-lg ${selectedItem.stock === 0
                                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                : playerCoins >= selectedItem.price
                                                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                                    : 'bg-red-900 text-red-300 cursor-not-allowed'
                                                } transition-colors flex items-center justify-center space-x-2`}
                                        >
                                            <FiShoppingCart />
                                            <span>
                                                {selectedItem.stock === 0
                                                    ? 'AGOTADO'
                                                    : playerCoins >= selectedItem.price
                                                        ? 'COMPRAR AHORA'
                                                        : 'MONEDAS INSUFICIENTES'
                                                }
                                            </span>
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>*/}
                </motion.div>
            </div>
        </div>
    );
};

export default StoreModal;
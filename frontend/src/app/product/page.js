'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductList from '../../components/Products/ProductList';
import ChemicalList from '../../components/Products/ChemicalList';
import AddProductModal from '../../components/Products/AddProductModal';
import AddChemicalModal from '../../components/Products/AddChemicalModal';
import api from '@/lib/api';
import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showChemicalModal, setShowChemicalModal] = useState(false);
  const router = useRouter();

  const tabs = [
    { name: 'Agricultural Products', component: <ProductList /> },
    { name: 'Chemical Applications', component: <ChemicalList /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Products Management</h1>
        <p className="text-gray-600 mt-2">
          Manage your agricultural products and chemical applications
        </p>
      </motion.div>

      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-green-100 p-1">
          {tabs.map((tab, idx) => (
            <Tab
              key={idx}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-green-700
                ring-white ring-opacity-60 ring-offset-2 ring-offset-green-400 focus:outline-none focus:ring-2
                ${selected ? 'bg-white shadow' : 'text-green-600 hover:bg-white/[0.12] hover:text-green-800'}`
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className={`rounded-xl bg-white p-4 shadow ${
                idx === 0 ? 'ring-white' : 'ring-green-500'
              }`}
            >
              {tab.component}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>

      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => setShowProductModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 hover:scale-105"
        >
          Add New Product
        </button>
        <button
          onClick={() => setShowChemicalModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105"
        >
          Record Chemical Application
        </button>
      </div>

      <AddProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
      />
      <AddChemicalModal
        isOpen={showChemicalModal}
        onClose={() => setShowChemicalModal(false)}
      />
    </div>
  );
}
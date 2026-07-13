"use client";
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await api.get('/properties');
      setProperties(res.data);
    } catch (error) {
      console.error("Failed to fetch properties", error);
    } finally {
      setLoading(false);
    }
  };

  const addTestProperty = async () => {
    try {
      await api.post('/properties', {
        title: 'New Listing',
        type: 'COMMERCIAL',
        price: '25000000',
        location: 'Connaught Place',
        status: 'AVAILABLE'
      });
      fetchProperties();
    } catch (error) {
      console.error(error);
    }
  };

  const getImg = (idx: number) => {
    const images = [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=60'
    ];
    return images[idx % images.length];
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Properties</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your real estate listings and inventory.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 rounded-lg text-sm border border-slate-200 dark:border-slate-800 flex-1 sm:w-64">
            <i className="fas fa-search text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search properties..." 
              className="bg-transparent border-none outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={addTestProperty} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg whitespace-nowrap hover:shadow-xl transition-all">
            <i className="fas fa-plus mr-2"></i> Add Property
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((prop, idx) => (
          <div key={prop.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
            <div className="h-48 overflow-hidden relative">
              <img src={getImg(idx)} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-800 dark:text-slate-200">
                ₹{prop.price.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate" title={prop.title}>{prop.title}</h3>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${prop.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {prop.status}
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-4"><i className="fas fa-map-marker-alt mr-1"></i> {prop.location}</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{prop.type}</span>
                <button className="text-blue-500 text-sm font-medium hover:text-blue-600">View Details <i className="fas fa-arrow-right ml-1"></i></button>
              </div>
            </div>
          </div>
        ))}
        
        {!loading && properties.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            <i className="fas fa-home text-4xl mb-4 opacity-20"></i>
            <p>No properties found in your inventory.</p>
          </div>
        )}
      </div>
    </div>
  );
}

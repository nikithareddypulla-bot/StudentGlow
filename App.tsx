
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { PublishForm } from './components/PublishForm';
import { Product, Category, BookType } from './types';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Logitech MX Anywhere 3',
    category: 'Gadgets',
    description: 'The ultimate compact mouse for coffee shop study sessions. MagSpeed scrolling and works on any surface.',
    price: '₹6,495',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800',
    affiliateUrl: 'https://amazon.in/dp/B08GKW788F',
    studentPerk: 'BESTSELLER',
    tags: ['gadgets', 'tech', 'productivity']
  },
  {
    id: 'b1',
    name: 'Tomorrow, and Tomorrow, and Tomorrow',
    category: 'Books',
    subCategory: 'Fiction',
    description: 'A masterpiece about gaming, friendship, and the creative process. Perfect for students looking for an immersive escape.',
    price: '₹499',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    affiliateUrl: 'https://amazon.in/dp/B099F4W1F9',
    studentPerk: 'EDITOR CHOICE',
    tags: ['reading', 'fiction', 'escape']
  },
  {
    id: 'b3',
    name: 'Introduction to Algorithms',
    category: 'Books',
    subCategory: 'Textbooks',
    description: 'The definitive guide to algorithmic thinking. Essential for computer science students worldwide.',
    price: '₹1,250',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    affiliateUrl: 'https://amazon.in/dp/0262033844',
    studentPerk: 'MUST-HAVE',
    tags: ['coding', 'textbook', 'cs']
  },
  {
    id: '2',
    name: 'Cerave Hydrating Cleanser',
    category: 'Skincare',
    description: 'Gentle on skin, gentle on the student budget. Dermatologist recommended for those stressful weeks.',
    price: '₹1,050',
    imageUrl: 'https://images.unsplash.com/photo-1610915769709-00127e9f3b61?auto=format&fit=crop&q=80&w=800',
    affiliateUrl: 'https://amazon.in/dp/B01MSSDEPK',
    studentPerk: 'BUDGET PICK',
    tags: ['skincare', 'daily', 'essentials']
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<'browse' | 'publish'>('browse');
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedBookType, setSelectedBookType] = useState<BookType>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesBookType = selectedCategory !== 'Books' || 
                             selectedBookType === 'All' || 
                             p.subCategory === selectedBookType;
      
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesBookType && matchesSearch;
    });
  }, [products, selectedCategory, selectedBookType, searchQuery]);

  const handlePublish = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    setView('browse');
  };

  const handleBulkImport = (importedProducts: Product[]) => {
    setProducts(importedProducts);
    setView('browse');
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <Header view={view} setView={setView} />
      
      <main className="container mx-auto px-6 py-8">
        {view === 'browse' ? (
          <>
            <div className="mb-12 text-center max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Amazon Finds for <span className="text-indigo-600">Students</span>
              </h1>
              <p className="text-slate-500 text-lg">
                Curated Gadgets, Books, and Skincare for the savvy scholar.
              </p>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto overflow-x-auto no-scrollbar">
                  {(['All', 'Skincare', 'Gadgets', 'Books'] as Category[]).map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedBookType('All');
                      }}
                      className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                        selectedCategory === cat 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                
                <div className="relative w-full md:w-80 group">
                  <input 
                    type="text" 
                    placeholder="Search by name or tags..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {selectedCategory === 'Books' && (
                <div className="flex justify-center animate-in fade-in zoom-in duration-300 overflow-x-auto pb-2">
                  <div className="inline-flex bg-slate-200/50 p-1 rounded-xl whitespace-nowrap">
                    {(['All', 'Fiction', 'Non-Fiction', 'Textbooks', 'Reference Books'] as BookType[]).map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedBookType(type)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          selectedBookType === type 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <div className="text-slate-300 text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-slate-900">No finds found</h3>
                <p className="text-slate-500">Try changing your filters or add a new link!</p>
              </div>
            )}
          </>
        ) : (
          <PublishForm 
            onPublish={handlePublish} 
            onBulkImport={handleBulkImport}
            currentProducts={products}
          />
        )}
      </main>

      <footer className="mt-20 py-12 border-t bg-slate-100">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-4 text-indigo-600/60">StudentGlow Hub • India</p>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            As an Amazon Associate, this site earns from qualifying purchases. 
            Tailored specifically for the modern student lifestyle in India.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;


import React, { useState } from 'react';
import { Category, Product, BookType } from '../types';
import { generateProductCopy } from '../services/geminiService';

interface PublishFormProps {
  onPublish: (product: Product) => void;
  onBulkImport: (products: Product[]) => void;
  currentProducts: Product[];
}

export const PublishForm: React.FC<PublishFormProps> = ({ onPublish, onBulkImport, currentProducts }) => {
  const [loading, setLoading] = useState(false);
  const [showDataTools, setShowDataTools] = useState(false);
  const [importData, setImportData] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Skincare' as Category,
    subCategory: '',
    price: '₹',
    affiliateUrl: '',
    imageUrl: '',
    description: '',
    studentPerk: '',
    tags: ''
  });

  const handleAISuggest = async () => {
    if (!formData.name) return alert('Enter a product name first!');
    setLoading(true);
    try {
      const copy = await generateProductCopy(formData.name, formData.category, formData.subCategory);
      setFormData(prev => ({
        ...prev,
        description: `${copy.studentHook}\n\n${copy.description}`
      }));
    } catch (err) {
      console.error(err);
      alert('AI failed to generate copy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isAmazon = formData.affiliateUrl.includes('amazon.in') || formData.affiliateUrl.includes('amazon.com');
    if (!isAmazon) {
      if (!confirm('This doesn\'t look like an Amazon India link. Proceed anyway?')) return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      ...formData,
      imageUrl: formData.imageUrl || `https://picsum.photos/seed/${formData.name}/600/400`,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };
    onPublish(newProduct);
    setFormData({
      name: '',
      category: 'Skincare',
      subCategory: '',
      price: '₹',
      affiliateUrl: '',
      imageUrl: '',
      description: '',
      studentPerk: '',
      tags: ''
    });
    alert('Find Published Successfully!');
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importData);
      if (Array.isArray(parsed)) {
        onBulkImport(parsed);
        alert(`Imported ${parsed.length} items!`);
        setImportData('');
        setShowDataTools(false);
      } else {
        alert('Data must be a JSON array of products.');
      }
    } catch (e) {
      alert('Invalid JSON formatting.');
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(currentProducts, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `studentglow-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const bookSections: Exclude<BookType, 'All'>[] = ['Fiction', 'Non-Fiction', 'Textbooks', 'Reference Books'];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8">
          <button 
            type="button"
            onClick={() => setShowDataTools(!showDataTools)}
            className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-[2px] transition-colors"
          >
            {showDataTools ? 'Hide Tools' : 'Manage Data'}
          </button>
        </div>

        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Post a New Find</h2>
          <p className="text-slate-500 mt-2">Grow your affiliate shop with AI-powered marketing.</p>
        </div>

        {showDataTools && (
          <div className="mb-10 p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 animate-in zoom-in duration-300">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <span className="text-xl">🛠️</span> Backup & Restore
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button 
                onClick={handleExport}
                className="py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"
              >
                💾 Export Shop Data
              </button>
              <button 
                onClick={() => setImportData('')}
                className="py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"
              >
                📥 Prepare Import
              </button>
            </div>
            <textarea 
              className="w-full h-24 p-4 text-xs font-mono bg-white border border-slate-200 rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder='Paste exported JSON here to import...'
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
            />
            <button 
              disabled={!importData}
              onClick={handleImport}
              className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black disabled:opacity-30 transition-all"
            >
              Execute Bulk Import
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Amazon Associate Link
            </label>
            <input 
              required
              type="url"
              placeholder="https://www.amazon.in/dp/B0..."
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm"
              value={formData.affiliateUrl}
              onChange={e => setFormData({...formData, affiliateUrl: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-800">Product Name</label>
              <input 
                required
                type="text"
                placeholder="e.g., COSRX Snail Mucin"
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-800">Category</label>
              <select 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-slate-700"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as Category, subCategory: e.target.value === 'Books' ? 'Fiction' : ''})}
              >
                <option value="Skincare">Skincare</option>
                <option value="Gadgets">Gadgets</option>
                <option value="Books">Books</option>
              </select>
            </div>
          </div>

          {formData.category === 'Books' && (
            <div className="space-y-4 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 animate-in fade-in slide-in-from-top-4">
              <label className="text-sm font-bold text-indigo-900">Select Book Section</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {bookSections.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({...formData, subCategory: type})}
                    className={`py-3 rounded-xl border-2 transition-all font-bold text-[10px] uppercase tracking-wider ${
                      formData.subCategory === type 
                      ? 'border-indigo-600 bg-white text-indigo-600 shadow-md scale-[1.02]' 
                      : 'border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-800">Price (INR)</label>
              <input 
                required
                type="text"
                placeholder="₹1,499"
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-800">Special Promo (Optional)</label>
              <input 
                type="text"
                placeholder="e.g., 5% Student Discount"
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.studentPerk}
                onChange={e => setFormData({...formData, studentPerk: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-800">Marketing Content</label>
              <button 
                type="button"
                onClick={handleAISuggest}
                disabled={loading}
                className="flex items-center gap-2 text-xs font-black text-white bg-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : '✨ Generate with Gemini AI'}
              </button>
            </div>
            <textarea 
              required
              rows={5}
              placeholder="Tell students why they need this in their dorm or study routine..."
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-600 leading-relaxed"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-800">Custom Image URL (Optional)</label>
            <input 
              type="url"
              placeholder="https://images.unsplash.com/..."
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={formData.imageUrl}
              onChange={e => setFormData({...formData, imageUrl: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 active:scale-[0.98]"
          >
            Confirm & Publish to Hub
          </button>
        </form>
      </div>
    </div>
  );
};

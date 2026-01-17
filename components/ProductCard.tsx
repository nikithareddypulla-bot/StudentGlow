
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="bg-white/90 backdrop-blur-md text-indigo-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            {product.category}
          </span>
          {product.subCategory && (
            <span className="bg-white/90 backdrop-blur-md text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {product.subCategory}
            </span>
          )}
          {product.studentPerk && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {product.studentPerk}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-slate-900 leading-tight line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <span className="text-indigo-600 font-bold whitespace-nowrap ml-2">{product.price}</span>
        </div>
        
        <p className="text-slate-500 text-sm line-clamp-2 mb-4">
          {product.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {product.tags.map(tag => (
            <span key={tag} className="text-[11px] text-slate-400 font-medium">#{tag}</span>
          ))}
        </div>
        
        <a 
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-slate-900 text-white py-3 rounded-2xl font-semibold text-sm hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200"
        >
          View on Amazon
        </a>
      </div>
    </div>
  );
};

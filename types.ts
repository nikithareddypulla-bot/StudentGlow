
export type Category = 'Skincare' | 'Gadgets' | 'Books' | 'All';
export type BookType = 'Fiction' | 'Non-Fiction' | 'Textbooks' | 'Reference Books' | 'All';

export interface Product {
  id: string;
  name: string;
  category: Category;
  subCategory?: string;
  description: string;
  price: string;
  imageUrl: string;
  affiliateUrl: string;
  studentPerk?: string;
  tags: string[];
}

export interface GeneratedCopy {
  title: string;
  description: string;
  studentHook: string;
}

"use client";
import { useState } from 'react';
import Dropdown from '@/components/ui/Dropdown/Dropdown';

const sortOptions = [
  { 
    value: 'featured', 
    label: 'Featured',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
  },
  { 
    value: 'newest', 
    label: 'Newest Arrivals',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
  },
  { 
    value: 'price-asc', 
    label: 'Price: Low to High',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21V3M5 10l7-7 7 7"/></svg>
  },
  { 
    value: 'price-desc', 
    label: 'Price: High to Low',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M5 14l7 7 7-7"/></svg>
  }
];

export default function CollectionSort() {
  const [sortValue, setSortValue] = useState('featured');

  return (
    <Dropdown 
      options={sortOptions} 
      value={sortValue} 
      onChange={(val) => setSortValue(val)} 
    />
  );
}

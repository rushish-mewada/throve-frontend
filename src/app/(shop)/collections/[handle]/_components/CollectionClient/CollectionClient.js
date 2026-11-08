"use client";

import { useState, useMemo } from 'react';
import Filters from '../Filters/Filters';
import CollectionGrid from '../CollectionGrid/CollectionGrid';
import CollectionSort from '../CollectionSort/CollectionSort';
import styles from '../../page.module.css';

export default function CollectionClient({ initialCategory, initialProducts, filterCategories }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortValue, setSortValue] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);

  // Toggle Category (if none selected, shows all products by default)
  const handleToggleCategory = (cat) => {
    setIsFiltering(true);
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
    setTimeout(() => setIsFiltering(false), 300);
  };

  // Toggle Price Range
  const handleTogglePriceRange = (range) => {
    setIsFiltering(true);
    setSelectedPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
    setCurrentPage(1);
    setTimeout(() => setIsFiltering(false), 300);
  };

  // Toggle Size
  const handleToggleSize = (size) => {
    setIsFiltering(true);
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
    setTimeout(() => setIsFiltering(false), 300);
  };

  // Toggle Color
  const handleToggleColor = (color) => {
    setIsFiltering(true);
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
    setCurrentPage(1);
    setTimeout(() => setIsFiltering(false), 300);
  };

  // Clear All
  const handleClearAll = () => {
    setIsFiltering(true);
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSortValue('featured');
    setCurrentPage(1);
    setTimeout(() => setIsFiltering(false), 300);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedPriceRanges.length > 0 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0;

  // Real-time filtering and sorting logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Filter by category (show all by default when none selected)
    if (selectedCategories.length > 0) {
      result = result.filter((p) =>
        selectedCategories.some((cat) => cat.toLowerCase() === p.category?.toLowerCase())
      );
    }

    // 2. Filter by price ranges
    if (selectedPriceRanges.length > 0) {
      result = result.filter((p) => {
        return selectedPriceRanges.some((range) => {
          if (range === 'Under ₹3,500' || range === 'Under ₹50,000') return p.priceNum < 3500;
          if (range === '₹3,500 - ₹4,500' || range === '₹50,000 - ₹100,000') return p.priceNum >= 3500 && p.priceNum <= 4500;
          if (range === '₹4,500 - ₹5,500' || range === '₹100,000 - ₹150,000') return p.priceNum >= 4500 && p.priceNum <= 5500;
          if (range === 'Over ₹5,500' || range === 'Over ₹150,000') return p.priceNum > 5500;
          return true;
        });
      });
    }

    // 3. Filter by size
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes ? p.sizes.some((s) => selectedSizes.includes(s)) : true
      );
    }

    // 4. Filter by color
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors ? p.colors.some((c) => selectedColors.includes(c)) : true
      );
    }

    // 5. Sort
    if (sortValue === 'price-asc') {
      result.sort((a, b) => a.priceNum - b.priceNum);
    } else if (sortValue === 'price-desc') {
      result.sort((a, b) => b.priceNum - a.priceNum);
    } else if (sortValue === 'newest') {
      result.reverse();
    }

    return result;
  }, [initialProducts, selectedCategories, selectedPriceRanges, selectedSizes, selectedColors, sortValue]);

  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.mainContent}>
      <aside className={styles.sidebar}>
        <Filters
          categories={filterCategories}
          selectedCategories={selectedCategories}
          onToggleCategory={handleToggleCategory}
          selectedPriceRanges={selectedPriceRanges}
          onTogglePriceRange={handleTogglePriceRange}
          selectedSizes={selectedSizes}
          onToggleSize={handleToggleSize}
          selectedColors={selectedColors}
          onToggleColor={handleToggleColor}
          onClearAll={handleClearAll}
          hasActiveFilters={hasActiveFilters}
        />
      </aside>

      <div className={styles.gridContainer}>
        <div className={styles.toolbar}>
          <span className={styles.productCount}>
            Showing {filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
          </span>
          <div className={styles.sortDropdown}>
            <span>Sort by:</span>
            <CollectionSort
              value={sortValue}
              onChange={(val) => {
                setSortValue(val);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {isFiltering ? (
          <div style={{ padding: '64px 0', textAlign: 'center', color: '#666666' }}>
            <p>Refining selection...</p>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div style={{ padding: '64px 0', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#111111' }}>
              No matches found
            </h3>
            <p style={{ color: '#666666', marginBottom: '20px' }}>
              Try adjusting your filter options or clearing active filters.
            </p>
            <button
              type="button"
              onClick={handleClearAll}
              style={{
                padding: '10px 20px',
                backgroundColor: '#111111',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <CollectionGrid products={paginatedProducts} />
        )}

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{ opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <span
                  key={idx + 1}
                  className={currentPage === idx + 1 ? styles.activePage : ''}
                  onClick={() => setCurrentPage(idx + 1)}
                  style={{ cursor: 'pointer' }}
                >
                  {idx + 1}
                </span>
              ))}
            </div>
            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{ opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


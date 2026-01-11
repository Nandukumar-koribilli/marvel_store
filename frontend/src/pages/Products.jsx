import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiGrid, FiList, FiChevronDown } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';
import './Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Get current filters from URL
  const currentCategory = searchParams.get('category') || '';
  const currentCharacter = searchParams.get('character') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('search') || '';
  const featured = searchParams.get('featured') || '';

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'shirts', label: 'T-Shirts' },
    { value: 'hoodies', label: 'Hoodies' },
    { value: 'pants', label: 'Pants' },
    { value: 'bags', label: 'Bags' },
    { value: 'pens', label: 'Pens' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'caps', label: 'Caps' },
    { value: 'collectibles', label: 'Collectibles' },
  ];

  const characters = [
    { value: '', label: 'All Characters' },
    { value: 'iron-man', label: 'Iron Man' },
    { value: 'spider-man', label: 'Spider-Man' },
    { value: 'captain-america', label: 'Captain America' },
    { value: 'thor', label: 'Thor' },
    { value: 'hulk', label: 'Hulk' },
    { value: 'black-panther', label: 'Black Panther' },
    { value: 'black-widow', label: 'Black Widow' },
    { value: 'doctor-strange', label: 'Doctor Strange' },
    { value: 'avengers', label: 'Avengers' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          category: currentCategory,
          character: currentCharacter,
          sort: currentSort,
          page: currentPage,
          limit: 12,
          search: searchQuery,
          featured: featured === 'true' ? true : undefined,
        };

        // Remove empty params
        Object.keys(params).forEach(key => {
          if (!params[key]) delete params[key];
        });

        const { data } = await getProducts(params);
        setProducts(data.products);
        setTotalPages(data.pages);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory, currentCharacter, currentSort, currentPage, searchQuery, featured]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({ page: '1' });
  };

  const activeFiltersCount = [currentCategory, currentCharacter, searchQuery, featured].filter(Boolean).length;

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-header">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {searchQuery ? `Search: "${searchQuery}"` : 
             featured ? 'Featured Products' :
             currentCategory ? categories.find(c => c.value === currentCategory)?.label :
             currentCharacter ? characters.find(c => c.value === currentCharacter)?.label :
             'All Products'}
          </motion.h1>
          <p className="products-count">{products.length} products found</p>
        </div>
      </div>

      <div className="container products-container">
        {/* Filters Sidebar */}
        <AnimatePresence>
          {(showFilters || window.innerWidth > 992) && (
            <motion.aside 
              className={`filters-sidebar ${showFilters ? 'mobile-open' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="filters-header">
                <h3>Filters</h3>
                {activeFiltersCount > 0 && (
                  <button className="clear-filters" onClick={clearFilters}>
                    Clear All ({activeFiltersCount})
                  </button>
                )}
                <button className="close-filters" onClick={() => setShowFilters(false)}>
                  <FiX />
                </button>
              </div>

              {/* Category Filter */}
              <div className="filter-group">
                <h4 className="filter-title">Category</h4>
                <div className="filter-options">
                  {categories.map((cat) => (
                    <label key={cat.value} className="filter-option">
                      <input
                        type="radio"
                        name="category"
                        checked={currentCategory === cat.value}
                        onChange={() => updateFilter('category', cat.value)}
                      />
                      <span className="option-label">{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Character Filter */}
              <div className="filter-group">
                <h4 className="filter-title">Character</h4>
                <div className="filter-options">
                  {characters.map((char) => (
                    <label key={char.value} className="filter-option">
                      <input
                        type="radio"
                        name="character"
                        checked={currentCharacter === char.value}
                        onChange={() => updateFilter('character', char.value)}
                      />
                      <span className="option-label">{char.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <main className="products-main">
          {/* Toolbar */}
          <div className="products-toolbar">
            <button 
              className="filter-toggle btn btn-ghost"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter /> Filters
              {activeFiltersCount > 0 && (
                <span className="filter-count">{activeFiltersCount}</span>
              )}
            </button>

            <div className="toolbar-right">
              <div className="sort-dropdown">
                <select 
                  value={currentSort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="sort-select"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="dropdown-icon" />
              </div>

              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <FiGrid />
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>

          {/* Products */}
          {loading ? (
            <div className={`products-grid ${viewMode}`}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '400px' }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🦸</div>
              <h3 className="empty-state-title">No products found</h3>
              <p className="empty-state-text">
                Try adjusting your filters or search terms
              </p>
              <button onClick={clearFilters} className="btn btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className={`products-grid ${viewMode}`}>
                {products.map((product, index) => (
                  <ProductCard key={product._id} product={product} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => updateFilter('page', String(currentPage - 1))}
                  >
                    Previous
                  </button>
                  
                  <div className="pagination-pages">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        className={`pagination-page ${currentPage === i + 1 ? 'active' : ''}`}
                        onClick={() => updateFilter('page', String(i + 1))}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => updateFilter('page', String(currentPage + 1))}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;

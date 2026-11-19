import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import ProductList from "./components/ProductList";
import AddProduct from "./components/AddProduct";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

type FilterStatus = "all" | "inStock" | "outStock";

const PRODUCT_URL = "/products.json";

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(PRODUCT_URL);
  if (!response.ok) {
    throw new Error("The product request failed.");
  }

  const products = (await response.json()) as Product[];

  return products;
}

function App() {
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>("all");
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  const [hasProductsError, setHasProductsError] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchText(event.target.value);
  }

  function handleShowAll() {
    setCurrentFilter("all");
  }

  function handleShowInStock() {
    setCurrentFilter("inStock");
  }

  function handleShowOutStock() {
    setCurrentFilter("outStock");
  }

  function handleToggleProduct(id: number): void {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        return { ...product, inStock: !product.inStock };
      }
      return product;
    });
    setProducts(updatedProducts);
  }
  function handleDeleteProduct(id: number): void {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
  }
  function handleSaveEdit(
    id: number,
    newName: string,
    newPrice: number,
  ): void {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        return { ...product, name: newName, price: newPrice };
      }

      return product;
    });

    setProducts(updatedProducts);
  }

  function handleAddProduct(
    name: string,
    category: string,
    price: number,
    inStock: boolean,
  ): void {
    const nextId =
      products.reduce(function (highestId, product) {
        if (product.id > highestId) {
          return product.id;
        }
        return highestId;
      }, 0) + 1;

    const draftProduct: Product = {
      id: nextId,
      name: name.trim(),
      category: category.trim(),
      price: price,
      inStock: inStock,
    };

    const newProducts = [...products, draftProduct];
    setProducts(newProducts);
  }

  const totalProducts = products.length;
  const instockCount = products.reduce(function (count, product) {
    if (product.inStock) {
      return count + 1;
    }
    return count;
  }, 0);
  const outStockCount = totalProducts - instockCount;

  const search = searchText.toLowerCase();

  const visibleProducts = products.filter((product) => {
    let matchesFilter = false;

    if (currentFilter === "all") {
      matchesFilter = true;
    } else if (currentFilter === "inStock" && product.inStock) {
      matchesFilter = true;
    } else if (currentFilter === "outStock" && !product.inStock) {
      matchesFilter = true;
    }

    const name = product.name.toLowerCase();
    const matchesSearch = name.includes(search);

    return matchesFilter && matchesSearch;
  });

  async function loadProductsData() {
    setIsLoadingProducts(true);
    setHasProductsError(false);
    try {
      const _products = await fetchProducts();
      setProducts(_products);
      setIsLoadingProducts(false);
    } catch {
      setIsLoadingProducts(false);
      setHasProductsError(true);
    }
  }
  useEffect(() => {
    loadProductsData();
  }, []);
  return (
    <div>
      <Header />

      <main className="container">
        <section className="stats">
          <StatCard label="All Products" value={totalProducts} />
          <StatCard label="In Stock" value={instockCount} />
          <StatCard label="Out of Stock" value={outStockCount} />
        </section>

        {!isLoadingProducts && !hasProductsError && (
          <AddProduct onAddProduct={handleAddProduct} />
        )}

        {!isLoadingProducts && !hasProductsError && (
          <div className="product-controls">
            <section className="search">
              <input
                type="text"
                className="search-input"
                placeholder="Search product..."
                value={searchText}
                onChange={handleSearchChange}
              />
            </section>

            <section className="filters">
              <button
                className={
                  "filter-button" + (currentFilter === "all" ? " active" : "")
                }
                onClick={handleShowAll}
              >
                All
              </button>
              <button
                className={
                  "filter-button" +
                  (currentFilter === "inStock" ? " active" : "")
                }
                onClick={handleShowInStock}
              >
                In Stock
              </button>
              <button
                className={
                  "filter-button" +
                  (currentFilter === "outStock" ? " active" : "")
                }
                onClick={handleShowOutStock}
              >
                Out of Stock
              </button>
            </section>
          </div>
        )}

        {isLoadingProducts && <p className="message">Loading products...</p>}
        {!isLoadingProducts && hasProductsError && (
          <div className="message error">
            <p>
              We could not load the products. Please check your internet
              connection and try again.
            </p>
            <button className="retry-button" onClick={loadProductsData}>
              Retry
            </button>
          </div>
        )}
        {!isLoadingProducts &&
          !hasProductsError &&
          visibleProducts.length > 0 && (
            <ul className="product-list">
              {visibleProducts.map((product) => (
                <ProductList
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  inStock={product.inStock}
                  category={product.category}
                  onToggle={handleToggleProduct}
                  onDelete={handleDeleteProduct}
                  onEdit={handleSaveEdit}
                />
              ))}
            </ul>
          )}
        {!isLoadingProducts && !hasProductsError && visibleProducts.length === 0 && (
          <p className="empty-state">
            {products.length === 0
              ? "No products to show."
              : "No products match your search or filter."}
          </p>
        )}
      </main>
    </div>
  );
}

export default App;

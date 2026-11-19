import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

interface addProductProps {
  onAddProduct: (
    name: string,
    category: string,
    price: number,
    inStock: boolean,
  ) => void;
}
const MAX_TITLE_LENGTH = 25;

export default function AddProduct(props: addProductProps) {
  const [draftName, setDraftName] = useState("");
  const [draftPrice, setDraftPrice] = useState("");
  const [draftCategory, setDraftCategory] = useState("");
  const [draftInStock, setDraftInStock] = useState(true);
  const [formError, setFormError] = useState("");

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setDraftName(event.target.value);
  }

  function handlePriceChange(event: ChangeEvent<HTMLInputElement>) {
    setDraftPrice(event.target.value);
  }

  function handleCategoryChange(event: ChangeEvent<HTMLInputElement>) {
    setDraftCategory(event.target.value);
  }

  function handleInStockChange(event: ChangeEvent<HTMLSelectElement>) {
    setDraftInStock(event.target.value === "true");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmedTitle = draftName.trim();

    if (trimmedTitle === "") {
      setFormError("Product name is required.");
      return;
    }

    if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      setFormError(
        `Product name must be ${MAX_TITLE_LENGTH} characters or fewer.`,
      );
      return;
    }

    const trimmedCategory = draftCategory.trim();
    if (trimmedCategory === "") {
      setFormError("Category is required.");
      return;
    }

    const price = Number(draftPrice);
    if (draftPrice.trim() === "" || !(price > 0)) {
      setFormError("Price must be a number greater than 0.");
      return;
    }

    props.onAddProduct(
      trimmedTitle,
      trimmedCategory,
      price,
      draftInStock,
    );

    setDraftName("");
    setFormError("");
    setDraftPrice("");
    setDraftCategory("");
    setDraftInStock(true);
  }

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <div className="add-product-field">
        <label htmlFor="product-name">Name</label>
        <input
          id="product-name"
          type="text"
          className="add-product-input"
          placeholder="Product name..."
          value={draftName}
          onChange={handleNameChange}
        />
      </div>

      <div className="add-product-field">
        <label htmlFor="product-category">Category</label>
        <input
          id="product-category"
          type="text"
          className="add-product-input"
          placeholder="Category..."
          value={draftCategory}
          onChange={handleCategoryChange}
        />
      </div>

      <div className="add-product-field">
        <label htmlFor="product-price">Price</label>
        <input
          id="product-price"
          type="text"
          inputMode="decimal"
          className="add-product-input"
          placeholder="Price..."
          value={draftPrice}
          onChange={handlePriceChange}
        />
      </div>

      <div className="add-product-field">
        <label htmlFor="product-status">Status</label>
        <select
          id="product-status"
          className="add-product-select"
          value={draftInStock ? "true" : "false"}
          onChange={handleInStockChange}
        >
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>
      </div>

      <button className="add-product-button" type="submit">
        Add Product
      </button>
      {formError !== "" && <p className="form-error">{formError}</p>}
    </form>
  );
}

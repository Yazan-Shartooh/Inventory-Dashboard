import { useState } from "react";
import type { ChangeEvent } from "react";

interface productListProps {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, name: string, price: number) => void;
}

const MAX_NAME_LENGTH = 25;
export default function ProductList(props: productListProps) {
  const [editName, setEditName] = useState(props.name);
  const [editPrice, setEditPrice] = useState(String(props.price));
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState("");

  function handleEditClick() {
    setEditName(props.name);
    setEditPrice(String(props.price));
    setEditError("");
    setIsEditing(true);
  }
  function handleChangeName(event: ChangeEvent<HTMLInputElement>) {
    setEditName(event.target.value);
  }
  function handleChangePrice(event: ChangeEvent<HTMLInputElement>) {
    setEditPrice(event.target.value);
  }
  function handleCancelClick() {
    setEditName(props.name);
    setEditPrice(String(props.price));
    setIsEditing(false);
    setEditError("");
  }
  function handleSaveClick() {
    const newName = editName.trim();

    if (newName === "") {
      setEditError("Title can't be empty.");
      return;
    }

    if (newName.length > MAX_NAME_LENGTH) {
      setEditError(`Title must be ${MAX_NAME_LENGTH} characters or fewer.`);
      return;
    }

    const newPrice = Number(editPrice);
    if (editPrice.trim() === "" || !Number.isFinite(newPrice) || newPrice <= 0) {
      setEditError("Price must be a number greater than 0.");
      return;
    }

    props.onEdit(props.id, newName, newPrice);

    setEditError("");
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li
        className={`product-item product-editing ${props.inStock ? "in-stock" : "out-of-stock"}`}
      >
        <input
          type="text"
          className="edit-product-input"
          aria-label="Product name"
          value={editName}
          onChange={handleChangeName}
        />
        <input
          type="text"
          inputMode="decimal"
          className="edit-product-input"
          aria-label="Product price"
          value={editPrice}
          onChange={handleChangePrice}
        />

        <div className="product-edit-actions">
          <button
            className="product-action-button product-save-button"
            onClick={handleSaveClick}
          >
            Save
          </button>
          <button
            className="product-action-button"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
          {editError !== "" && <p className="form-error">{editError}</p>}
        </div>
      </li>
    );
  }

  return (
    <li
      className={`product-item ${props.inStock ? "in-stock" : "out-of-stock"}`}
    >
      <div className="product-text">
        <span className="product-name">{props.name}</span>
        <span
          className={`product-status-badge ${props.inStock ? "in-stock" : "out-of-stock"}`}
        >
          {props.inStock ? "In Stock" : "Out of Stock"}
        </span>
        <span className="product-category">{props.category}</span>
        <span className="product-price">${props.price.toFixed(2)}</span>
      </div>
      <div className="product-list-btns">
        <button
          className="product-action-button product-status-toggle"
          onClick={() => props.onToggle(props.id)}
        >
          {props.inStock ? "Mark out of stock" : "Mark in stock"}
        </button>
        <button
          className="product-action-button edit-product-button"
          onClick={handleEditClick}
        >
          Edit
        </button>
        <button
          className="product-action-button delete-product-button"
          onClick={() => props.onDelete(props.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

# Team Reflection

## Which information did our app store as state, and why?

The app stores the product list in `App` because products are loaded and then
changed when the user adds, edits, toggles, or removes a product. `App` also
stores the current stock filter, search text, loading state, and product-load
error state because these values change through user input or while fetching.

`AddProduct` stores its controlled name, category, price, and stock-status
drafts, plus the form error message. `ProductList` stores the name and price
being edited, whether that product is in edit mode, and any edit error.

## Which values did you calculate from other data instead of storing separately?

`App` derives the total product count from `products.length`, the in-stock count
with `reduce`, and the out-of-stock count by subtracting the in-stock count from
the total. It also derives the lowercase search text and `visibleProducts` from
the product list, search text, and selected filter.

## What components did our team create, and what was each one responsible for?

- `Header` displays the dashboard title and introductory text.
- `StatCard` displays one summary label and value.
- `AddProduct` collects and validates a new product, then calls its parent
  callback.
- `ProductList` displays an individual product and provides its edit, stock
  toggle, and delete controls.
- `App` fetches and owns the product list, derives the summary and filtered
  products, and coordinates the child components.

## Where did an action in a child component need to affect something in a parent component?

`ProductList` calls `onToggle`, `onDelete`, and `onEdit` so `App` can update the
product list. `AddProduct` calls `onAddProduct` so `App` can add a product.
Those callbacks let the parent update its collection state in response to
actions initiated in child components.

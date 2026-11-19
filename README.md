# Inventory Dashboard

A responsive inventory dashboard built with React, TypeScript, and Vite.

## Features

- Fetches and displays products with name, category, price, and stock status.
- Shows total, in-stock, and out-of-stock product counts.
- Adds products with a name, category, price, and stock status.
- Edits product names and prices, toggles stock status, and removes products.
- Searches by product name and filters by stock status.
- Shows loading and error states, with a Retry action if fetching fails.

## Getting started

Install dependencies and start the development server:

```sh
npm install
npm run dev
```

## Available scripts

```sh
npm run dev      # Start the Vite development server
npm run build    # Type-check and create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build
```

## Product data

The initial inventory is stored in [`public/products.json`](./public/products.json)
and fetched from `/products.json`. Product changes are kept in React state only;
reloading the page restores the original data from this file.

## Test the error and Retry states

With the development server running, temporarily rename
`public/products.json` (for example, to `products.json.bak`) and reload the
dashboard. The app should show an error message and a Retry button. Rename the
file back to `products.json`, then click Retry to load the products again.

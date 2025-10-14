# vue-tabled

A modern, feature-rich Vue.js table component with built-in sorting, filtering, pagination, and expandable row details. (**Compatible with Vue.js 3**)

[![npm version](https://badge.fury.io/js/vue-tabled.svg)](https://www.npmjs.com/package/vue-tabled)

## Features

- ✅ **Sortable columns** - Click on column headers to sort data
- ✅ **Built-in filtering** - Filter table data with a simple prop
- ✅ **Pagination support** - Works seamlessly with pagination components
- ✅ **Expandable row details** - Show/hide additional row information
- ✅ **Customizable slots** - Full control over column and row rendering
- ✅ **Responsive design** - Mobile-friendly with horizontal scrolling
- ✅ **Bootstrap-like styling** - Bordered, striped, and hover effects
- ✅ **TypeScript support** - Full type definitions included
- ✅ **No results message** - Customizable empty state

#### [Live Demo](https://codesandbox.io/p/sandbox/vue-tabled-vue-pagination-sand-cqfjyx?file=%2Fsrc%2FApp.vue "Sandbox")

## Installation

### NPM

```bash
npm install vue-tabled
```

### Global Registration

```js
import { createApp } from "vue";
import App from "./App.vue";

import { VueTabled } from "vue-tabled";
import "vue-tabled/dist/style.css";

createApp(App).component("VueTabled", VueTabled).mount("#app");
```

### Local Import

```js
<script setup>
  import {VueTabled} from 'vue-tabled'; import 'vue-tabled/dist/style.css';
</script>
```

## Basic Usage

```vue
<template>
  <VueTabled bordered hover :items="items" :fields="fields" />
</template>

<script setup>
import { ref } from "vue";

const items = ref([
  {
    name: "John Doe",
    age: 25,
    email: "john@example.com",
  },
  {
    name: "Alex Turner",
    age: 30,
    email: "alex@example.com",
  },
]);

const fields = ref([
  {
    key: "name",
    label: "Full Name",
    sortable: true,
    class: "text-left",
  },
  {
    key: "age",
    label: "Age",
    sortable: true,
    class: "text-center",
  },
  {
    key: "email",
    label: "Email Address",
    class: "text-left",
  },
]);
</script>
```

## Advanced Features

### Filtering and Pagination

```vue
<template>
  <!-- Search input -->
  <input
    type="text"
    v-model="filter"
    placeholder="Search table..."
    class="form-control mb-3"
  />

  <!-- Table with all features enabled -->
  <VueTabled
    bordered
    hover
    striped
    :items="items"
    :fields="fields"
    :perPage="perPage"
    :currentPage="currentPage"
    :filter="filter"
    :noResults="noResultsMessage"
    @onFiltered="onFiltered"
  >
    <!-- Custom column formatting -->
    <template #name="{ value, item, index }">
      <strong>{{ value.toUpperCase() }}</strong>
    </template>

    <!-- Action buttons with row details toggle -->
    <template #actions="{ item, toggleDetails }">
      <button @click="toggleDetails()" class="btn btn-sm btn-primary">
        {{ item._showDetails ? "Hide" : "Show" }} Details
      </button>
    </template>

    <!-- Expandable row details -->
    <template #row-details="{ item }">
      <div class="row-details-content">
        <h6>Additional Information</h6>
        <p><strong>Full Name:</strong> {{ item.name }}</p>
        <p><strong>Age:</strong> {{ item.age }} years old</p>
        <p><strong>Email:</strong> {{ item.email }}</p>
        <p><strong>Status:</strong> {{ item.status || "Active" }}</p>
      </div>
    </template>
  </VueTabled>

  <!-- Pagination component -->
  <VueBasicPagination
    :total-rows="totalRows"
    :per-page="perPage"
    v-model="currentPage"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
// import { VueBasicPagination } from 'vue-basic-pagination';

const perPage = ref(5);
const currentPage = ref(1);
const filter = ref("");
const totalRows = ref(0);
const noResultsMessage = ref("No matching records found.");

const items = ref([
  {
    name: "John Doe",
    age: 25,
    email: "john@example.com",
    status: "Active",
    _rowClass: "table-success", // Custom row styling
  },
  {
    name: "Jane Smith",
    age: 32,
    email: "jane@example.com",
    status: "Inactive",
  },
  {
    name: "Alex Turner",
    age: 28,
    email: "alex@example.com",
    status: "Pending",
    _rowClass: "table-warning",
  },
]);

const fields = ref([
  {
    key: "name",
    label: "Full Name",
    sortable: true,
    class: "text-left",
    thClass: "bg-primary text-white",
    tdClass: "fw-bold",
  },
  {
    key: "age",
    label: "Age",
    sortable: true,
    class: "text-center",
  },
  {
    key: "email",
    label: "Email",
    class: "text-left",
  },
  {
    key: "actions",
    label: "Actions",
    class: "text-center",
  },
]);

onMounted(() => {
  totalRows.value = items.value.length;
});

const onFiltered = (filteredItems) => {
  // Update pagination when filtering
  totalRows.value = filteredItems.length;
  currentPage.value = 1;
};
</script>
```

### Slot Properties

Each column slot receives the following properties:

- `value` - The cell value
- `item` - The entire row object
- `key` - The field key
- `index` - The row index
- `toggleDetails` - Function to toggle row details

The `row-details` slot receives:

- `item` - The entire row object

## Field Configuration

Each field in the `fields` array supports the following properties:

```typescript
interface TableField {
  key: string; // Required: Property key from items
  label: string; // Required: Column header text
  sortable?: boolean; // Optional: Enable sorting (default: false)
  class?: string; // Optional: CSS class for both th and td
  thClass?: string; // Optional: CSS class for header cell only
  tdClass?: string; // Optional: CSS class for data cells only
}
```

## Item Properties

Items can include special properties for enhanced functionality:

```typescript
interface TableItem {
  [key: string]: any; // Your data properties
  _showDetails?: boolean; // Controls row details visibility
  _rowClass?: string; // CSS class for the entire row
  _originalIndex?: number; // Internal: Original item index
  _uniqueId?: string; // Internal: Unique identifier
}
```

## Integration with Pagination

VueTabled works seamlessly with [vue-basic-pagination](https://github.com/ovictorpereira/vue-basic-pagination):

```bash
npm install vue-basic-pagination
```

## API Reference

### Props

| Prop          | Type      | Default | Description                                    |
| ------------- | --------- | ------- | ---------------------------------------------- |
| `items`       | `Array`   | `[]`    | Array of objects to display in the table       |
| `fields`      | `Array`   | `[]`    | Array of field configurations defining columns |
| `filter`      | `String`  | `""`    | Search string to filter table data             |
| `bordered`    | `Boolean` | `false` | Add borders to table cells                     |
| `striped`     | `Boolean` | `false` | Add zebra striping to table rows               |
| `hover`       | `Boolean` | `false` | Add hover effect to table rows                 |
| `perPage`     | `Number`  | `0`     | Number of items per page (0 = no pagination)   |
| `currentPage` | `Number`  | `0`     | Current active page                            |
| `noResults`   | `String`  | `""`    | Message to show when no data matches filter    |

### Events

| Event         | Payload | Description                                         |
| ------------- | ------- | --------------------------------------------------- |
| `@onFiltered` | `Array` | Emitted when filter changes, returns filtered items |

### Slots

| Slot Name     | Props Available                                  | Description                    |
| ------------- | ------------------------------------------------ | ------------------------------ |
| `[field-key]` | `value`, `item`, `key`, `index`, `toggleDetails` | Custom column content          |
| `row-details` | `item`                                           | Expandable row details content |

## Styling

The component includes built-in CSS classes. You can override them or add custom styles:

```css
/* Custom table styling */
.tabled {
  font-family: "Arial", sans-serif;
}

.tabled th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.tabled-details-card {
  background-color: #f1f3f4;
  border-left: 4px solid #007bff;
}

/* Custom row classes */
.table-success {
  background-color: #d4edda !important;
}

.table-warning {
  background-color: #fff3cd !important;
}
```

## TypeScript Support

The component is fully typed. Import the types for better development experience:

```typescript
import type { TableField, TableItem } from "vue-tabled";

const fields: TableField[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
];

const items: TableItem[] = [
  {
    name: "John Doe",
    _rowClass: "custom-row",
  },
];
```

## Browser Support

- Vue.js 3.0+
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Internet Explorer 11+ (with polyfills)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### v3.0.1

- Full TypeScript rewrite
- Improved sorting algorithm with null/undefined handling
- Enhanced row details functionality with unique ID tracking
- Better filtering performance
- Responsive design improvements
- Added `noResults` prop for empty state customization

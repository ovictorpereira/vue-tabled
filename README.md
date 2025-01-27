# vue-tabled

A Vue.js table component. (**Compatible with Vue.js 3**)

#### [Sandbox](https://codesandbox.io/p/sandbox/vue-tabled-vue-pagination-sand-cqfjyx?file=%2Fsrc%2FApp.vue "Sandbox")

## Installation

NPM

```bash
$ npm install vue-tabled
```

Register the component globally...

```js
import { createApp } from "vue";
import App from "./App.vue";

import { VueTabled } from "vue-tabled";
import "vue-tabled/dist/style.css";
// don't forget to load the css file

createApp(App).component("VueTabled", VueTabled).mount("#app");
```

... or import it locally

```js
<script setup>
  import {VueTabled} from 'vue-tabled'; import 'vue-tabled/dist/style.css'
</script>
```

## Usage

```html
<VueTabled bordered hover :items="items" :fields="fields" />
```

```js
<script setup>
import { ref } from 'vue';

const items = ref([
    {
        name: 'John Doe',
        age: 10
    },
     {
        name: 'Alex Turner',
        age: 12
    },
])

const fields = ref([
    {
        key: 'name',
        label: 'Username',
        sortable: true,
        class: 'text-center'
    },
    {
        key: 'age',
        label: 'Age',
        class: 'text-center'
    },
])
</script>
```

## Complete Example

```html
<input type="text" v-model="filter" />

<VueTabled
  bordered
  hover
  striped
  :items="items"
  :fields="fields"
  :perPage="perPage"
  :currentPage="currentPage"
  :filter="filter"
  @onFiltered="onFiltered"
>
  <!-- Here I format the "name" column -->
  <template #name="row"> {{ row.value.toUpperCase() }} </template>

  <!-- Function row.toggleDetails(row.index) can be called to toggle the visibility of the rows row-details scoped slot -->
  <template #actions="row">
    <button @click="row.toggleDetails(row.index)">
      {{ row.item._showDetails ? "Hide" : "Show" }} Details
    </button>
  </template>

  <!-- row-details scoped slot -->
  <template #row-details="row">
    <ul>
      <li v-for="(value, key) in row.item" :key="key">
        {{ key }}: {{ value }}
      </li>
    </ul>
  </template>
</VueTabled>

<VueBasicPagination
  :total-rows="totalRows"
  :per-page="perPage"
  v-model="currentPage"
/>
```

```js
<script setup>
import { ref, onMounted } from 'vue';

const perPage = ref(2);
const currentPage = ref(1);
const filter = ref('');
const totalRows = ref(1);

onMounted(() =>{
  totalRows.value = items.value.length
})

const onFiltered = (filteredItems) => {
    // update pagination due filtering
    totalRows.value = filteredItems.length
    currentPage.value = 1
}

const items = ref([
    {
        name: 'John Doe',
        age: 10
    },
     {
        name: 'Alex Turner',
        age: 12
    },
])

const fields = ref([
	{
		key: 'name',
		label: 'Username',
		sortable: true,
		class: 'text-center'
	},
	{
		key: 'age',
		label: 'Age',
		class: 'text-center'
	},
	{
		key: 'actions',
		label: 'Actions'
	}
])
</script>
```

VueTabled works fine with the pagination plugin [vue-basic-pagination](https://github.com/ovictorpereira/vue-basic-pagination)

## Available props

| Prop        | Type    |
| ----------- | ------- |
| items       | Array   |
| fields      | Array   |
| filter      | String  |
| bordered    | Boolean |
| striped     | Boolean |
| hover       | Boolean |
| perPage     | Number  |
| currentPage | Number  |
| noResults   | String  |

<template>
  <div class="tabled-responsive">
    <table
      class="tabled"
      :class="[
        props.bordered ? 'tabled-bordered' : '',
        props.striped ? 'tabled-striped' : '',
        props.hover ? 'tabled-hover' : '',
      ]"
    >
      <thead>
        <tr>
          <th
            scope="col"
            v-for="(field, index) in props.fields"
            :key="index"
            :class="field.class"
            @click="sortColumn(field)"
          >
            <span :class="field.sortable ? 'sort-by' : ''">{{
              field.label
            }}</span>
          </th>
        </tr>
      </thead>

      <tbody>
        <template v-for="(item, index) in paginationFilter" :key="index">
          <tr :class="item._showDetails ? 'tabledRowHasDetails' : ''">
            <td
              v-for="(field, ind) in props.fields"
              :key="ind"
              :class="field.class"
            >
              <span v-if="$slots[field.key]">
                <slot
                  :name="field.key"
                  :item="item"
                  :value="item[field.key]"
                  :key="field.key"
                  :index="index"
                  :toggleDetails="toggleDetails"
                ></slot>
              </span>

              <span v-else>{{ item[field.key] }}</span>
            </td>
          </tr>

          <tr v-if="item._showDetails" class="tabled-details">
            <td :colspan="fields.length">
              <div class="tabled-details-card">
                <slot name="row-details" :item="item"> </slot>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <div
      v-if="props.noResults && paginationFilter.length == 0"
      class="tabled-no-results"
    >
      {{ props.noResults }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";

interface Props {
  items: any;
  fields: any;
  filter?: string;
  bordered?: boolean;
  striped?: boolean;
  hover?: boolean;
  perPage?: number;
  currentPage?: number;
  noResults?: string;
}

const props = withDefaults(defineProps<Props>(), {
  items: [],
  fields: [],
  filter: "",
  bordered: false,
  striped: false,
  hover: false,
  perPage: 0,
  currentPage: 0,
  noResults: "",
});

onMounted(() => {
  mountNewItems();
});

watch(
  () => props.items,
  (v) => {
    mountNewItems();
  }
);

const newItems = ref<Array<any>>([]);

const mountNewItems = () => {
  newItems.value = props.items.map((i: any) => ({ ...i, _showDetails: false }));
};

const emit = defineEmits(["onFiltered"]);

const sortField = ref("");
const sortReverse = ref(false);

const filteredTable = computed(() => {
  let items = [...newItems.value];
  let fields = [...props.fields];

  if (!props.filter) {
    emit("onFiltered", newItems.value);
    return newItems.value;
  }

  let result = items.filter((i) => {
    let bool = false;

    fields.forEach((e) => {
      let key = e.key;
      let data = i[key] ? i[key].toString().toUpperCase().trim() : "";

      if (data.includes(props.filter.toUpperCase().trim())) bool = true;
    });

    return bool;
  });

  emit("onFiltered", result);
  return result;
});

const sortColumn = (field: any) => {
  if (!field.sortable) return;
  else {
    if (sortField.value == field.key) {
      sortReverse.value = !sortReverse.value;
    } else {
      sortReverse.value = false;
      sortField.value = field.key;
    }
  }
};

const sortedTable = computed(() => {
  let key = sortField.value;
  let reverse = sortReverse.value;
  if (!key) return [...filteredTable.value];

  let result = [...filteredTable.value].sort(
    (a, b) => ((a[key] > b[key]) as any) - ((a[key] < b[key]) as any)
  );
  if (reverse) result = result.reverse();

  return result;
});

const paginationFilter = computed(() => {
  let items = [...sortedTable.value];
  if (props.perPage === 0) return items;

  return items.slice(
    (props.currentPage - 1) * props.perPage,
    props.currentPage * props.perPage
  );
});

const toggleDetails = (index: number) => {
  newItems.value[index]._showDetails = !newItems.value[index]._showDetails;
};
</script>

<style>
.tabled-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.tabled {
  width: 100%;
  margin-bottom: 1rem;
  vertical-align: top;
  border-color: #dee2e6;
  border-collapse: collapse;
}

.tabled thead {
  vertical-align: bottom;
  background-color: #f3f2f2;
}

.tabled tr {
  border-top: 1.5px solid #dee2e6;
  border-bottom: 1.5px solid #dee2e6;
}

.tabled th,
.tabled td {
  padding: 0.5rem 0.5rem;
  vertical-align: middle;
  text-align: start;
}

.tabled-bordered th,
.tabled-bordered td {
  border-left: 1.5px solid #dee2e6;
  border-right: 1.5px solid #dee2e6;
}

.tabled-striped tr:nth-child(even) {
  background-color: #0000000d;
}

.tabled-hover tbody tr:hover {
  background-color: #00000013;
}

.tabled th .sort-by {
  position: relative;
  display: block;
  width: 100%;
  cursor: pointer;
}

.tabled .sort-by:before,
.tabled .sort-by:after {
  border: 4px solid transparent;
  content: "";
  display: block;
  height: 0;
  right: 5px;
  top: 50%;
  position: absolute;
  width: 0;
}

.tabled .sort-by:before {
  border-bottom-color: #666;
  margin-top: -9px;
}

.tabled .sort-by:after {
  border-top-color: #666;
  margin-top: 1px;
}

.tabledRowHasDetails {
  border-bottom: 0 !important;
}

.tabled-details {
  border: 0 !important;
}

.tabled-details-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
  flex: 1 1 auto;
  padding: 1rem;
}
</style>

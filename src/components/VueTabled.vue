<template>
  <div class="tabled-container">
    <div
      v-if="props.topScroll"
      ref="topScrollRef"
      class="tabled-top-scroll"
      @scroll="syncScrollTop"
      v-show="showTopScroll"
    >
      <div
        class="tabled-scroll-content"
        :style="{ width: tableWidth + 'px' }"
      ></div>
    </div>

    <div
      ref="tableScrollRef"
      class="tabled-responsive"
      @scroll="syncScrollBottom"
    >
      <table
        ref="tableRef"
        class="tabled"
        :class="[
          { 'tabled-bordered': props.bordered },
          { 'tabled-striped': props.striped },
          { 'tabled-hover': props.hover },
        ]"
      >
        <thead>
          <tr>
            <th
              scope="col"
              v-for="(field, index) in props.fields"
              :key="index"
              :class="[field.class, field.thClass]"
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
            <tr
              :class="[
                { tabledRowHasDetails: item._showDetails },
                item._rowClass,
              ]"
            >
              <td
                v-for="(field, ind) in props.fields"
                :key="ind"
                :class="[field.class, field.tdClass]"
              >
                <span v-if="$slots[field.key]">
                  <slot
                    :name="field.key"
                    :item="item"
                    :value="item[field.key]"
                    :key="field.key"
                    :index="index"
                    :toggleDetails="() => toggleDetails(item)"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";

interface TableField {
  key: string;
  label: string;
  sortable?: boolean;
  class?: string;
  thClass?: string;
  tdClass?: string;
}

interface TableItem {
  [key: string]: any;
  _showDetails?: boolean;
  _rowClass?: string;
  _originalIndex?: number;
  _uniqueId?: string;
}

interface Props {
  items: TableItem[];
  fields: TableField[];
  filter?: string;
  bordered?: boolean;
  striped?: boolean;
  hover?: boolean;
  perPage?: number;
  currentPage?: number;
  noResults?: string;
  topScroll?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  fields: () => [],
  filter: "",
  bordered: false,
  striped: false,
  hover: false,
  perPage: 0,
  currentPage: 0,
  noResults: "",
  topScroll: false,
});

const topScrollRef = ref<HTMLDivElement>();
const tableScrollRef = ref<HTMLDivElement>();
const tableRef = ref<HTMLTableElement>();

// Variables to control the top scroll
const showTopScroll = ref(false);
const tableWidth = ref(0);
const isScrollingSyncronized = ref(false);

onMounted(() => {
  mountNewItems();
  if (props.topScroll) {
    nextTick(() => {
      updateScrollState();
      window.addEventListener("resize", updateScrollState);
    });
  }
});

onUnmounted(() => {
  if (props.topScroll) {
    window.removeEventListener("resize", updateScrollState);
  }
});

watch(
  () => props.items,
  () => {
    mountNewItems();
    if (props.topScroll) {
      nextTick(() => {
        updateScrollState();
      });
    }
  },
  { deep: true }
);

watch(
  () => props.topScroll,
  (newValue) => {
    if (newValue) {
      nextTick(() => {
        updateScrollState();
        window.addEventListener("resize", updateScrollState);
      });
    } else {
      window.removeEventListener("resize", updateScrollState);
    }
  }
);

const newItems = ref<TableItem[]>([]);

const mountNewItems = () => {
  newItems.value = props.items.map((item: TableItem, index: number) => ({
    ...item,
    _showDetails: false,
    _originalIndex: index,
    _uniqueId: `item-${index}-${Date.now()}-${Math.random()}`,
  }));
};

// Function to update the state of the top scroll
const updateScrollState = () => {
  if (!tableRef.value || !tableScrollRef.value) return;

  const tableElement = tableRef.value;
  const containerElement = tableScrollRef.value;

  tableWidth.value = tableElement.scrollWidth;
  const containerWidth = containerElement.clientWidth;

  showTopScroll.value = tableWidth.value > containerWidth;
};

const syncScrollTop = (event: Event) => {
  if (isScrollingSyncronized.value) return;

  const target = event.target as HTMLElement;
  if (tableScrollRef.value) {
    isScrollingSyncronized.value = true;
    tableScrollRef.value.scrollLeft = target.scrollLeft;
    setTimeout(() => {
      isScrollingSyncronized.value = false;
    }, 10);
  }
};

const syncScrollBottom = (event: Event) => {
  if (isScrollingSyncronized.value) return;

  const target = event.target as HTMLElement;
  if (topScrollRef.value) {
    isScrollingSyncronized.value = true;
    topScrollRef.value.scrollLeft = target.scrollLeft;
    setTimeout(() => {
      isScrollingSyncronized.value = false;
    }, 10);
  }
};

const emit = defineEmits<{
  onFiltered: [items: TableItem[]];
}>();

const sortField = ref<string>("");
const sortReverse = ref<boolean>(false);

const filteredTable = computed(() => {
  let items = [...newItems.value];
  let fields = [...props.fields];

  if (!props.filter) {
    emit("onFiltered", newItems.value);
    return newItems.value;
  }

  const filterText = props.filter.toUpperCase().trim();
  const result = items.filter((item) => {
    return fields.some((field) => {
      const value = item[field.key];
      const data = value ? value.toString().toUpperCase().trim() : "";
      return data.includes(filterText);
    });
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
  const key = sortField.value;
  const reverse = sortReverse.value;

  if (!key) return [...filteredTable.value];

  const result = [...filteredTable.value].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    // Handle null/undefined values
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    // Convert to string for comparison if not numbers
    const aStr = typeof aVal === "number" ? aVal : String(aVal).toLowerCase();
    const bStr = typeof bVal === "number" ? bVal : String(bVal).toLowerCase();

    return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
  });

  return reverse ? result.reverse() : result;
});

const paginationFilter = computed(() => {
  let items = [...sortedTable.value];
  if (props.perPage === 0) return items;

  return items.slice(
    (props.currentPage - 1) * props.perPage,
    props.currentPage * props.perPage
  );
});

// Watch para atualizar o scroll quando a paginação mudar
watch(
  () => paginationFilter.value,
  () => {
    if (props.topScroll) {
      nextTick(() => {
        updateScrollState();
      });
    }
  }
);

const toggleDetails = (item: TableItem) => {
  const originalIndex = newItems.value.findIndex(
    (originalItem: TableItem) => originalItem._uniqueId === item._uniqueId
  );

  if (originalIndex !== -1) {
    const oldValue = newItems.value[originalIndex]._showDetails;
    newItems.value[originalIndex]._showDetails = !oldValue;
    return;
  } else {
    console.log("❌ _uniqueId not found");
  }
};
</script>

<style>
.tabled-container {
  position: relative;
}

.tabled-top-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  height: 20px;
  margin-bottom: 5px;
  -webkit-overflow-scrolling: touch;
}

.tabled-scroll-content {
  height: 1px;
  background: transparent;
}

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
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
  padding-right: 20px;
}

.tabled .sort-by:before,
.tabled .sort-by:after {
  border: 4px solid transparent;
  content: "";
  display: block;
  height: 0;
  position: absolute;
  right: 5px;
  width: 0;
  flex-shrink: 0;
}

.tabled .sort-by:before {
  border-bottom-color: #666;
  top: calc(50% - 9px);
}

.tabled .sort-by:after {
  border-top-color: #666;
  top: calc(50% + 1px);
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

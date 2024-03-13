<template>
  <div class="tabled-responsive">
    <table class="tabled" :class="[props.bordered ? 'tabled-bordered' : '', props.striped ? 'tabled-striped' : '', props.hover ? 'tabled-hover' : '']">
      <thead>
        <tr>
          <th scope="col" v-for="(field, index) in props.fields" :key="index" :class="field.class" @click="sortColumn(field)">
            <span :class="field.sortable ? 'sort-by' : ''">{{ field.label }}</span>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in paginationFilter" :key="index">
          <td v-for="(field, ind) in props.fields" :key="ind" :class="field.class">

            <span v-if="$slots[field.key]">
              <slot :name="field.key" :row="item" :value="item[field.key]" :key="field.key" :index="index"></slot>
            </span>

            <span v-else>{{ item[field.key] }}</span>            
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: []
  },
  fields: {
    type: Array,
    default: []
  },
  filter: {
    type: String,
    default: ''
  },
  bordered: {
    type: Boolean,
    default: false
  },
  bordered: {
    type: Boolean,
    default: false
  },
  striped: {
    type: Boolean,
    default: false
  },
  hover: {
    type: Boolean,
    default: false
  },
  perPage: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 1
  },
})

const emit = defineEmits(['onFiltered'])

const sortField = ref('')
const sortReverse = ref(false)

const filteredTable = computed(() => {
  let items = [...props.items]
  let fields = [...props.fields]

  if (!props.filter) {
    emit("onFiltered", props.items);
    return props.items
  }

  let result = items.filter(i => {
    let bool = false

    fields.forEach(e => {
      let key = e.key
      let data = i[key] ? i[key].toString().toUpperCase().trim() : ''

      if (data.includes(props.filter.toUpperCase().trim())) bool = true
    });

    return bool
  })

  emit("onFiltered", result);
  return result
})

const sortColumn = (field) => {
  if (!field.sortable) return
  else {
    if (sortField.value == field.key) {
      sortReverse.value = !sortReverse.value
      console.log('aqui');
      console.log(sortReverse.value);
    }
    else {
      sortReverse.value = false
      sortField.value = field.key
    }
  }
}

const sortedTable = computed(() => {
  let key = sortField.value
  let reverse = sortReverse.value
  if (!key) return [...filteredTable.value]

  let result = [...filteredTable.value].sort((a, b) => (a[key] > b[key]) - (a[key] < b[key]))
  if (reverse) result = result.reverse()
  // let result = items.sort((a, b) => (a[key] < b[key]) - (a[key] > b[key]))

  return result
})

const paginationFilter = computed(() => {
  let items = [...sortedTable.value]
  if (props.perPage === 0) return items

  return items.slice((props.currentPage - 1) * props.perPage, props.currentPage * props.perPage);
})


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
</style>
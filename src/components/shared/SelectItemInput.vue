<template>
  <!-- Select input start -->
  <div
    class="d-flex justify-content-start justify-content-md-end align-items-center gap-3 flex-wrap mb-3"
  >
    <div class="flex-grow-1 flex-md-grow-0">
      <!-- For desktop screens -->
      <Select
        style="width: 12rem"
        class="d-none d-md-flex"
        :placeholder="placeholderText"
        checkmark
        v-model="selectedItem"
        :options="options"
        @change="onItemChange"
      />

      <!-- For mobile screens -->
      <Select
        class="w-100 d-md-none"
        placeholder="Sort by"
        checkmark
        v-model="selectedItem"
        :options="options"
        @change="onItemChange"
      />
    </div>
  </div>
  <!-- Select input end -->
</template>

<script setup lang="ts">
import Select from "primevue/select";
import { ref, type PropType, type Ref } from "vue";

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  callbackOnChange: {
    type: Function,
    required: true,
  },
  placeholderText: {
    type: String,
    required: true,
  },
});
const selectedItem = ref();


//Method to run if an option is selected
const onItemChange = () => props.callbackOnChange();
</script>

<template>
  <section>
    <div>
      <AddParagraphForm
        v-for="(validatedParagraph, index) in validatedParagraphs"
        :index="index"
        :key="validatedParagraph.item.id"
        @update="(val: ValidatedItem<Paragraph>) => updateParagraphById(val)"
        @delete="() => deleteParagraphById(validatedParagraph.item.id)"
        :paragraph="validatedParagraph.item"
      />
    </div>
    <div class="d-flex justify-content-center align-items-center">
      <Button
        @click="addNewParagraph"
        icon="pi pi-plus"
        severity="contrast"
        :label="buttonLabel"
        size="small"
      />
    </div>
  </section>
  {{ validatedParagraphs }}
</template>

<script setup lang="ts">
import { Paragraph } from "@/models/paragraph";
import { computed, onMounted, type PropType, type Ref } from "vue";
import AddParagraphForm from "./AddParagraphForm.vue";
import Button from "primevue/button";
import type { ValidatedItem } from "@/interfaces/shared/validatedItem";
import type { ParagraphType } from "@/enums/paragraphType";
import { watch } from "vue";
import { ref } from "vue";
import { useParagraphStore } from "@/stores/paragraph";

const emit = defineEmits(["paragraphs", "hasInvalidParagraphs"]);

const store = useParagraphStore();
const props = defineProps({
  paragraphType: {
    type: String as PropType<ParagraphType>,
    required: true,
  },
  buttonLabel: {
    type: String,
    required: false,
    default: () => "New paragraph",
  },
  initialParagraphs: {
    type: Array as PropType<Paragraph[]>,
    default: () => [],
  },
});

onMounted(() => {});

const validatedParagraphs: Ref<ValidatedItem<Paragraph>[]> = ref([]);
// Flag to suppress emitting during the initial paragraph load
const hasInitializedParagraphs = ref(false);
const initializeParagraphs = (paragraphs: Paragraph[]) => {
  validatedParagraphs.value = store.validateGivenParagraphs(paragraphs);
  hasInitializedParagraphs.value = true;
};
defineExpose({ initializeParagraphs });

// Extracts and returns the original Paragraph objects from the validatedParagraphs array
const paragraphs: Ref<Paragraph[]> = computed(() => {
  return validatedParagraphs.value.reduce((accumulator, currentValue) => {
    accumulator.push(currentValue.item);
    return accumulator;
  }, [] as Paragraph[]);
});

// Determine if any paragraph in the list has failed validation
const hasInvalidParagraphs: Ref<boolean> = computed(() => {
  //look for any paragraphs whose validation is invalid
  const anyInvalid = validatedParagraphs.value.filter(
    (validatedParagraphs) => !validatedParagraphs.isValid,
  );
  return anyInvalid.length > 0;
});

//Add a new paragraph to the list of paragraphs when the Add button is clicked
const addNewParagraph = () => {
  const newParagraph = new Paragraph();
  //set the paragraph type e.g project background, project challenge etc
  newParagraph.paragraphType = props.paragraphType;
  //by default, the a new paragraph form is invalid since its fields (the required ones) will be  empty
  const isValid = false;
  validatedParagraphs.value.push({ item: newParagraph, isValid });
};

// Update the paragraph with the specified ID
const updateParagraphById = (updatedParagraph: ValidatedItem<Paragraph>) => {
  validatedParagraphs.value = validatedParagraphs.value.map((validatedParagraph) =>
    validatedParagraph.item.id === updatedParagraph.item.id ? updatedParagraph : validatedParagraph,
  );
};
//delete a paragraph with the specified ID
const deleteParagraphById = (targetId: string | number) => {
  validatedParagraphs.value = validatedParagraphs.value.filter(
    (validatedParagraph) => validatedParagraph.item.id != targetId,
  );
};

// Watch for changes in the validatedParagraphs array.
// Whenever any paragraph's content or validation state updates,
// extract the paragraph data and emit both the updated list
// and the combined validation status to keep the parent component in sync.
watch(
  validatedParagraphs,
  () => {
    if (hasInitializedParagraphs.value) {
      // Emit the updated list of paragraphs to the parent component
      emit("paragraphs", paragraphs.value);

      // Emit the current overall validation status indicating if any paragraph is invalid
      emit("hasInvalidParagraphs", hasInvalidParagraphs.value);
    }
  },
  { deep: true },
);
</script>

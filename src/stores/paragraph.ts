import { ref} from "vue";
import { defineStore } from "pinia";
import type { ValidatedItem } from "@/interfaces/shared/validatedItem";
import type { Paragraph } from "@/models/paragraph";


export const useParagraphStore = defineStore("paragraph", () => {

const validatedParagraphsForAddProject = ref<ValidatedItem<Paragraph>[]>([]);
const validatedParagraphsForEditProject = ref<ValidatedItem<Paragraph>[]>([]);


return {validatedParagraphsForAddProject,validatedParagraphsForEditProject}

})

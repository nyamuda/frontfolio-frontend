import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import type { Project } from "@/models/project";

export const useProjectStore = defineStore("project", () => {
  const projects: Ref<Project[]> = ref([]);

  return { projects };
});

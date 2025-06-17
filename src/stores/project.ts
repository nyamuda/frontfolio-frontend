import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import type { Project } from "@/models/project";
import { apiUrl } from "@/helpers/urlHelper";
import axios from "axios";
import { unexpectedErrorMessage } from "@/helpers/errorMessageHelper";

export const useProjectStore = defineStore("project", () => {
  const projects: Ref<Project[]> = ref([]);
  const newProject: Ref<Project | null> = ref(null);

  //submit a new portfolio project
  const addNewProject = () => {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/projects`;
      //add an access token to the request to access the protected route
      setAuthToken();
      //make the request
      axios
        .post(url, newProject.value)
        .then(() => resolve({}))
        .catch((error) => {
          const message = error.response?.data?.message || unexpectedErrorMessage();
          reject(message);
        });
    });
  };

  //Set authorization header for all request to access protected routes from the API
  const setAuthToken = () => {
    //check if there is a token in local storage
    const localToken = localStorage.getItem("jwt_token");

    //the current token
    const token = localToken ? localToken : null;

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  return { projects, newProject, addNewProject };
});

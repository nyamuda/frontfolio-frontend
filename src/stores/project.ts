import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import { Project } from "@/models/project";
import { apiUrl } from "@/helpers/urlHelper";
import axios from "axios";

export const useProjectStore = defineStore("project", () => {
  const projects: Ref<Project[]> = ref([]);

  //submit a new portfolio project
  const addNewProject = (project: Project) => {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/projects`;
      //add an access token to the request to access the protected route
      setAuthToken();
      //make the request
      axios
        .post(url, project)
        .then(() => resolve({}))
        .catch((error) => {
          console.log(error);
          const message =
            error.response?.data?.message ||
            "An unexpected error occurred while saving your project.";
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

  return { projects, addNewProject };
});

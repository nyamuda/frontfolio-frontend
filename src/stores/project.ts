import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import { Project } from "@/models/project";
import { apiUrl } from "@/helpers/urlHelper";
import axios from "axios";

export const useProjectStore = defineStore("project", () => {
  const projects: Ref<Project[]> = ref([]);
  //const project: Ref<Project> = ref(new Project());

  //get a project by ID
  const getProjectById = (id: number): Promise<Project> => {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/projects/${id}`;
      //add an access token to the request to access the protected route
      setAuthToken();
      //make the request
      axios
        .get<Project>(url)
        .then((response) => resolve(response.data))
        .catch((error) => {
          const message =
            error.response?.data?.message ||
            "An unexpected error occurred while fetching your project.";
          reject(message);
        });
    });
  };

  //submit a new portfolio project
  const addNewProject = (project: Project): Promise<{ id: number | null }> => {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/projects`;
      //add an access token to the request to access the protected route
      setAuthToken();
      //make the request
      axios
        .post(url, project)
        .then((response) => {
          //return the ID of the newly created project
          resolve({ id: response?.data?.id });
        })
        .catch((error) => {
          const message =
            error.response?.data?.message ||
            "An unexpected error occurred while saving your project.";
          reject(message);
        });
    });
  };

  //edit a portfolio project
  const editProject = (id: number, updatedProject: Project) => {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/projects/${id}`;
      //add an access token to the request to access the protected route
      setAuthToken();
      //make the request
      axios
        .put(url, updatedProject)
        .then(() => resolve({}))
        .catch((ex) => {
          console.log(ex);
          const message = "An unexpected error occurred while saving your changes.";
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

  return { projects, addNewProject, editProject, getProjectById };
});

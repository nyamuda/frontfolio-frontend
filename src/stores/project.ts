import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import { Project } from "@/models/project";
import { apiUrl } from "@/helpers/urlHelper";
import axios from "axios";
import type { PageInfo } from "@/interfaces/shared/pageInfo";
import { DateHelper } from "@/helpers/dateHelper";
import { ParagraphHelper } from "@/helpers/paragraphHelper";

export const useProjectStore = defineStore("project", () => {
  const projects: Ref<Project[]> = ref([]);
  const pageInfo: Ref<PageInfo<Project>> = ref({ page: 1, pageSize: 5, hasMore: false, items: [] });

  //get a project by ID
  const getProjectById = (id: number): Promise<Project> => {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/projects/${id}`;
      //add an access token to the request to access the protected route
      setAuthToken();
      //make the request
      axios
        .get<Project>(url)
        .then((response) => {
          console.log(response);
          //format the start & end dates from UTC to local time for better readability
          const project: Project = response.data;
          project.startDate = DateHelper.convertTimeFromUTCToLocal(project.startDate);
          project.endDate = DateHelper.convertTimeFromUTCToLocal(project.endDate);
          resolve(project);
        })
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

      //Prepare a list of background paragraphs for submission to the backend
      //by changing the temporal string IDs of new paragraphs to 0
      updatedProject.background = ParagraphHelper.prepareParagraphsForSubmission(
        updatedProject.background,
      );
      //make the request
      axios
        .put(url, updatedProject)
        .then(() => resolve({}))
        .catch((error) => {
          console.log(error);
          const message = "An unexpected error occurred while saving your changes.";
          reject(message);
        });
    });
  };

  //get projects
  const getProjects = (): Promise<PageInfo<Project>> => {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/projects`;
      //add an access token to the request to access the protected route
      setAuthToken();
      //make the request
      axios
        .get<PageInfo<Project>>(url, {
          params: { page: 1, pageSize: 5 },
        })
        .then((response) => {
          pageInfo.value = response.data;
          resolve(response.data);
        })
        .catch(() => {
          const message = "An unexpected error occurred while fetching your projects.";
          reject(message);
        });
    });
  };

  //load more projects
  const loadMoreProjects = (): Promise<PageInfo<Project>> => {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/projects`;
      //add an access token to the request to access the protected route
      setAuthToken();
      //query params
      const { page, pageSize } = pageInfo.value;
      //make the request
      axios
        .get<PageInfo<Project>>(url, {
          params: { page, pageSize },
        })
        .then((response) => {
          //add the additional projects the the projects that are already there
          pageInfo.value.items = pageInfo.value.items.concat(response.data.items);
          //store the new pagination info
          pageInfo.value.page = response.data.page;
          pageInfo.value.pageSize = response.data.pageSize;
          pageInfo.value.hasMore = response.data.hasMore;
          resolve(response.data);
        })
        .catch(() => {
          const message = "An unexpected error occurred while loading more projects.";
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

  return {
    projects,
    addNewProject,
    editProject,
    getProjectById,
    getProjects,
    loadMoreProjects,
    pageInfo,
  };
});

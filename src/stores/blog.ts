import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import { Blog } from "@/models/blog";
import { apiUrl } from "@/helpers/urlHelper";
import axios from "axios";
import type { PageInfo } from "@/interfaces/shared/pageInfo";
import { DateHelper } from "@/helpers/dateHelper";
import { BlogSortOption } from "@/enums/blogSortOption";
import { BlogStatusFilter } from "@/enums/blogStatusFilter";

export const useBlogStore = defineStore("blog", () => {
  const blogs: Ref<Blog[]> = ref([]);
  const pageInfo: Ref<PageInfo<Blog>> = ref({ page: 1, pageSize: 5, hasMore: false, items: [] });
  const sortBy: Ref<BlogSortOption> = ref(BlogSortOption.SortOrder);
  //used for filtering the blogs
  const statusFilter: Ref<BlogStatusFilter> = ref(BlogStatusFilter.All);

  //get a blog by ID
  const getBlogById = (id: number): Promise<Blog> => {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/blogs/${id}`;
      //add an access token to the request to access the protected route
      setAuthToken();
      //make the request
      axios
        .get<Blog>(url)
        .then((response) => {
          //format any dates from UTC to local time for better readability
          const blog: Blog = Object.assign(new Blog(), response.data);
          blog.createdAt = DateHelper.convertTimeFromUTCToLocal(blog.createdAt);
          blog.updatedAt = DateHelper.convertTimeFromUTCToLocal(blog.updatedAt);
          blog.publishedAt = DateHelper.convertTimeFromUTCToLocal(blog.publishedAt);
          resolve(blog);
        })
        .catch(() => {
          const message = "We couldn’t fetch the blog details. Please try again shortly.";
          reject(message);
        });
    });
  };

  //submit a new portfolio blog
  const addNewBlog = (blog: Blog): Promise<{ id: number | null }> => {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/blogs`;
      //add an access token to the request to access the protected route
      setAuthToken();
      //make the request
      axios
        .post(url, blog)
        .then((response) => {
          //return the ID of the newly created blog
          resolve({ id: response?.data?.id });
        })
        .catch((error) => {
          const message =
            error.response?.data?.message || "An unexpected error occurred while saving your blog.";
          reject(message);
        });
    });
  };

  //edit a portfolio blog
  const editBlog = (id: number, updatedBlog: Blog) => {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/blogs/${id}`;
      //add an access token to the request to access the protected route
      setAuthToken();
      //make the request
      axios
        .put(url, updatedBlog)
        .then(() => resolve({}))
        .catch((ex) => {
          console.log(ex);
          const message = "An unexpected error occurred while saving your changes.";
          reject(message);
        });
    });
  };

  //get blogs
  const getBlogs = (): Promise<PageInfo<Blog>> => {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/blogs`;
      //add an access token to the request to access the protected route
      setAuthToken();
      //make the request
      axios
        .get<PageInfo<Blog>>(url, {
          params: { page: 1, pageSize: 5, status: statusFilter.value, sortBy: sortBy.value },
        })
        .then((response) => {
          pageInfo.value = response.data;
          resolve(response.data);
        })
        .catch((ex) => {
          console.log(ex);
          const message = "An unexpected error occurred while fetching your blogs.";
          reject(message);
        });
    });
  };

  //load more blogs
  const loadMoreBlogs = (): Promise<PageInfo<Blog>> => {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/blogs`;
      //add an access token to the request to access the protected route
      setAuthToken();
      //query params
      const { page, pageSize } = pageInfo.value;
      //make the request
      axios
        .get<PageInfo<Blog>>(url, {
          params: { page, pageSize, status: statusFilter.value, sortBy: sortBy.value },
        })
        .then((response) => {
          //add the additional blogs the the blogs that are already there
          pageInfo.value.items = pageInfo.value.items.concat(response.data.items);
          //store the new pagination info
          pageInfo.value.page = response.data.page;
          pageInfo.value.pageSize = response.data.pageSize;
          pageInfo.value.hasMore = response.data.hasMore;
          resolve(response.data);
        })
        .catch(() => {
          const message = "An error occurred while loading more blogs.";
          reject(message);
        });
    });
  };

  const deleteBlog = (id: number) => {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/blogs/${id}`;
      //add an access token to the request to access the protected route
      setAuthToken();
      axios
        .delete(url)
        .then(() => resolve({}))
        .catch((ex) => {
          const message = ex.response?.data?.message || "Failed to delete blog. Please try again.";
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
    blogs,
    addNewBlog,
    editBlog,
    getBlogById,
    getBlogs,
    loadMoreBlogs,
    pageInfo,
    deleteBlog,
    sortBy,
    statusFilter,
  };
});

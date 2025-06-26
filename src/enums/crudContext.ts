// Represents the current CRUD operation context for a given entity.
// Useful for determining UI behavior and logic flow based on whether the user is
// creating, viewing, updating, or deleting an item (e.g., Project, Blog, etc.).
export enum CrudContContext {
  Create = "Create",
  Read = "Read",
  Update = "Update",
  Delete = "Delete",
}

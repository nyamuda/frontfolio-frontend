export interface PageInfo<T> {
  page: number;
  pageSize: number;
  hasMore: boolean;
  Items: T[];
}

export enum RedisKeys {
  products = "products",
  deals = "deals",
  email = "email",
}

export type TPagination = {
  limit: number;
  currentPage: number;
  total: number;
  totalPage?: number;
  hasMore?: boolean;
};

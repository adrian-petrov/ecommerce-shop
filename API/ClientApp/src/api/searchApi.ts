import { baseInstance } from './index';

export default {
  autocomplete: async (query: string) => {
    const response = await baseInstance.post(
      'search/autocomplete',
      {},
      {
        params: {
          query: query,
        },
      },
    );
    return response.data;
  },
  search: async (query: string, pageIndex = 1, pageSize = 6) => {
    const response = await baseInstance.post(
      'search',
      {},
      {
        params: {
          query: query,
          pageIndex: pageIndex,
          pageSize: pageSize,
        },
      },
    );
    return response.data;
  },
};

const collection = { data: [], loading: false, error: null, add: async () => ({ id: 'fixture' }), update: async () => true, remove: async () => true };
export const useCollection = () => collection;

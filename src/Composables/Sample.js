import { ref } from 'vue';

export function useSorting(initialParams, setParams) {
    const params = ref(initialParams);

    const sort = (column) => {
        setParams({
            ...params.value,
            col: column,
            sort: params.value.sort ? (params.value.sort === 'asc' ? 'desc' : 'asc') : 'asc',
        });
    };

    return { params, sort };
}

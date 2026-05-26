import { useSearchParams } from "react-router-dom";

type FilterPatch = {
  genre?: string;
  page?: number;
  search?: string;
};

export function useLocalFilters() {
  const [params, setParams] = useSearchParams();

  const search = params.get("search") || "";
  const genre = params.get("genre") || "";
  const page = Number.parseInt(params.get("page") || "1", 10);

  const updateParams = (patch: FilterPatch) => {
    const nextSearch = patch.search ?? search;
    const nextGenre = patch.genre ?? genre;
    const nextPage = patch.page ?? page;
    const nextParams = new URLSearchParams();

    if (nextSearch) {
      nextParams.set("search", nextSearch);
    }

    if (nextGenre) {
      nextParams.set("genre", nextGenre);
    }

    if (nextPage > 1) {
      nextParams.set("page", String(nextPage));
    }

    setParams(nextParams);
  };

  return {
    genre,
    page: Number.isNaN(page) ? 1 : page,
    reset: () => setParams({}),
    search,
    setGenre: (value: string) => updateParams({ genre: value, page: 1 }),
    setPage: (value: number) => updateParams({ page: value }),
    setSearch: (value: string) => updateParams({ page: 1, search: value }),
  };
}

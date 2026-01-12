export const createNewsState = () => ({
  all: [],
  filtered: [],
  visibleCount: 50,
  searchTerm: "",

  sort: {
    by: "date",     // "date" | "alpha"
    dir: "desc"     // "asc" | "desc"
  }
});

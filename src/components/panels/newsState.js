export const createNewsState = () => ({
  all: [],          // alle geladenen News
  filtered: [],     // Suchergebnis
  visibleCount: 50, // aktuell sichtbare Einträge
  searchTerm: ""
});

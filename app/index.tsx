import { Card } from "@/components/Card";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import { SearchBar } from "@/components/SearchBar";
import { SortButton } from "@/components/SortButton";
import { FilterButton, PokemonFilters } from "@/components/FilterButton";
import { ThemedText } from "@/components/ThemedText";
import { getPokemonId } from "@/functions/pokemon";
import { useFetchQuery, useInfiniteFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useState, useCallback, useEffect } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native";

// Définir les plages de chaque génération
const generationRanges = {
  0: { min: 1, max: 10000 }, // Tous les Pokémon
  1: { min: 1, max: 151 },
  2: { min: 152, max: 251 },
  3: { min: 252, max: 386 },
  4: { min: 387, max: 493 },
  5: { min: 494, max: 649 },
  6: { min: 650, max: 721 },
  7: { min: 722, max: 809 },
  8: { min: 810, max: 905 },
  9: { min: 906, max: 1008 }
};

export default function Index() {
  const colors = useThemeColors();
  const { data, isFetching, fetchNextPage } = useInfiniteFetchQuery('/pokemon?limit=21');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<"id_asc" | "id_desc" | "name_asc" | "name_desc">("id_asc");
  const [filters, setFilters] = useState<PokemonFilters>({ types: [], generation: 0 });

  const pokemons = data?.pages.flatMap(page => page.results.map(r => ({
    name: r.name,
    id: getPokemonId(r.url),
  }))) ?? [];

  // Fonction pour appliquer les filtres et le tri
  const getFilteredAndSortedPokemons = useCallback(() => {
    // Filtrer par recherche
    let filtered = [...pokemons];

    if (search) {
      filtered = filtered.filter(
        (p) => p.name.includes(search.toLowerCase()) || p.id.toString() === search
      );
    }

    // Filtrer par génération
    if (filters.generation > 0) {
      const range = generationRanges[filters.generation];
      filtered = filtered.filter(p => p.id >= range.min && p.id <= range.max);
    }

    // Filtrer par types
    // Note: Cette partie est commentée car nous n'avons pas les données de types
    // dans la liste des Pokémon. Pour une implémentation complète,
    // il faudrait adapter cette partie.
    /*
    if (filters.types.length > 0) {
      filtered = filtered.filter(p => {
        // Pour chaque Pokémon, vérifier s'il a tous les types sélectionnés
        return filters.types.every(type =>
          p.types.some(t => t.type.name === type)
        );
      });
    }
    */

    // Appliquer le tri
    return filtered.sort((a, b) => {
      switch(sortKey) {
        case "id_asc":
          return a.id - b.id;
        case "id_desc":
          return b.id - a.id;
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [pokemons, search, sortKey, filters]);

  const filteredPokemons = getFilteredAndSortedPokemons();

  return (
    <RootView>
      <Row style={styles.header} gap={16}>
        <Image source={require('@/assets/images/pokeball.png')} />
        <ThemedText variant="headline" color={colors.grayWhite}>Pokédex</ThemedText>
      </Row>
      <Row gap={16} style={styles.form}>
        <SearchBar value={search} onChange={setSearch} />
        <SortButton value={sortKey} onChange={setSortKey} />
        <FilterButton filters={filters} onChange={setFilters} />
      </Row>
      <Card style={styles.body}>
        <FlatList
          data={filteredPokemons}
          numColumns={3}
          contentContainerStyle={[styles.gridGap, styles.list]}
          columnWrapperStyle={styles.gridGap}
          ListFooterComponent={
            isFetching ? <ActivityIndicator color={colors.tint} /> : null
          }
          onEndReached={search ? undefined : () => fetchNextPage()}
          renderItem={({item}) => <PokemonCard
            id={item.id}
            name={item.name}
            style={{flex: 1/3}}
          />}
          keyExtractor={(item) => item.id.toString()}
        />
      </Card>
    </RootView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  body: {
    flex: 1,
    marginTop: 16,
  },
  gridGap: {
    gap: 8
  },
  list: {
    padding: 12,
  },
  form: {
    paddingHorizontal: 12,
  }
});
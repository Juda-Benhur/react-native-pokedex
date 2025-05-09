import { Card } from "@/components/Card";
import { PokemonSpec } from "@/components/pokemon/PokemonSpec";
import { PokemonStat } from "@/components/pokemon/PokemonStat";
import { PokemonType } from "@/components/pokemon/PokemonType";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { formatSize, formatWeight, getPokemonArtwork } from "@/functions/pokemon";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

export default function Pokemon() {
    const colors = useThemeColors();
    const params = useLocalSearchParams() as { id: string };
    const { data: pokemon } = useFetchQuery("/pokemon/[id]", { id: params.id });
    const { data: species } = useFetchQuery("/pokemon-species/[id]/", { id: params.id });
    const mainType = pokemon?.types?.[0].type.name;
    const colorType = mainType ? Colors.type[mainType] : colors.tint;
    const types = pokemon?.types ?? [];
    const bio = species?.flavor_text_entries
        ?.find(({ language }) => language.name == "en")
        ?.flavor_text.replaceAll("\n", " ");

    // État pour la version shiny
    const [isShiny, setIsShiny] = useState(false);

    // Fonction de navigation vers le Pokémon précédent
    const goToPreviousPokemon = () => {
        const currentId = parseInt(params.id);
        if (currentId > 1) {
            const previousId = (currentId - 1).toString();
            router.replace(`/pokemon/${previousId}`);
        }
    };

    // Fonction de navigation vers le Pokémon suivant
    const goToNextPokemon = () => {
        const currentId = parseInt(params.id);
        // Utilisez une valeur maximale appropriée pour votre Pokédex
        const maxPokemonId = 1008;
        if (currentId < maxPokemonId) {
            const nextId = (currentId + 1).toString();
            router.replace(`/pokemon/${nextId}`);
        }
    };

    // URL de l'image selon que c'est shiny ou non
    const getArtworkUrl = () => {
        const baseId = params.id;
        if (isShiny) {
            // Pour les versions shiny, utilisez l'endpoint approprié
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${baseId}.png`;
        } else {
            return getPokemonArtwork(baseId);
        }
    };

    return (
        <RootView style={{ backgroundColor: colorType }}>
            <View>
                <Image
                    style={styles.pokeball}
                    source={require("@/assets/images/pokeball_big.png")}
                    width={208}
                    height={208}
                />
                <Row style={styles.header}>
                    <Row gap={8}>
                        <Pressable onPress={router.back}>
                            <Image
                                source={require("@/assets/images/back.png")}
                                width={32}
                                height={32}
                            />
                        </Pressable>

                        {/* Titre */}
                        <ThemedText
                            color={colors.grayWhite}
                            variant="headline"
                            style={{ textTransform: "capitalize" }}
                        >
                            { pokemon?.name }
                        </ThemedText>
                    </Row>
                    {/* Numéro */}
                    <ThemedText color={colors.grayWhite} variant="subtitle2">
                        #{ params.id.padStart(3, "0") }
                    </ThemedText>
                </Row>
                <View style={styles.body}>
                    <Image
                        style={styles.artwork}
                        source={{
                            uri: getArtworkUrl()
                        }}
                        width={200}
                        height={200}
                    />
                    <Card style={styles.card}>
                        {/* Bouton pour basculer l'affichage shiny */}
                        <Pressable
                            style={[
                                styles.shinyButton,
                                { backgroundColor: isShiny ? '#FFD700' : colorType }
                            ]}
                            onPress={() => setIsShiny(!isShiny)}
                        >
                            <Text style={styles.shinyButtonText}>
                                {isShiny ? 'Normal Version' : 'Shiny Version'}
                            </Text>
                        </Pressable>

                        <Row gap={16}>
                            {types.map((type) => (
                                <PokemonType name={type.type.name} key={type.type.name} />
                            ))}
                        </Row>
                        {/* About */}
                        <ThemedText variant="subtitle1" color={ colorType }>
                            About
                        </ThemedText>
                        <Row>
                            <PokemonSpec
                                style={{
                                    borderStyle: "solid",
                                    borderRightWidth: 1,
                                    borderColor: colors.grayLight,
                                }}
                                title={formatWeight(pokemon?.weight)}
                                description="Weight"
                                image={require("@/assets/images/weight.png")}
                            />
                            <PokemonSpec
                                style={{
                                    borderStyle: "solid",
                                    borderRightWidth: 1,
                                    borderColor: colors.grayLight,
                                }}
                                title={formatSize(pokemon?.height)}
                                description="Height"
                                image={require("@/assets/images/size.png")}
                            />
                            <PokemonSpec
                                title={pokemon?.moves
                                    .slice(0, 2)
                                    .map((m) => m.move.name)
                                    .join("\n")}
                                description="Moves"
                            />
                        </Row>
                        <ThemedText>{bio}</ThemedText>

                        {/* Base stats */}
                        <ThemedText variant="subtitle1" color={ colorType }>
                            Base stats
                        </ThemedText>

                        <View style={{ alignSelf: "stretch" }}>
                            {pokemon?.stats.map((stat) => (
                                <PokemonStat
                                    key={stat.stat.name}
                                    name={stat.stat.name}
                                    value={stat.base_stat}
                                    color={colorType}
                                />
                            ))}
                        </View>

                        {/* Navigation entre Pokémons */}
                        <Row style={styles.navigationButtons}>
                            <Pressable
                                style={[
                                    styles.navButton,
                                    { backgroundColor: colorType },
                                    parseInt(params.id) <= 1 && styles.disabledButton
                                ]}
                                onPress={goToPreviousPokemon}
                                disabled={parseInt(params.id) <= 1}
                            >
                                <Text style={styles.navButtonText}>Previous</Text>
                            </Pressable>

                            <Pressable
                                style={[
                                    styles.navButton,
                                    { backgroundColor: colorType },
                                    parseInt(params.id) >= 1008 && styles.disabledButton
                                ]}
                                onPress={goToNextPokemon}
                                disabled={parseInt(params.id) >= 1008}
                            >
                                <Text style={styles.navButtonText}>Next</Text>
                            </Pressable>
                        </Row>
                    </Card>
                </View>
            </View>
        </RootView>
    );
}

const styles = StyleSheet.create({
    header: {
        margin: 20,
        justifyContent: "space-between",
    },
    pokeball: {
        opacity: 0.1,
        position: "absolute",
        right: 8,
        top: 8,
        zIndex: -1,
    },
    artwork: {
        position: "absolute",
        top: -140,
        alignSelf: "center",
        zIndex: 2,
    },
    body: {
        marginTop: 144,
    },
    card: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        gap: 16,
        alignItems: "center",
    },
    // Styles pour le bouton shiny
    shinyButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: 8,
    },
    shinyButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    // Styles pour les boutons de navigation
    navigationButtons: {
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    navButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    navButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.5,
    }
});
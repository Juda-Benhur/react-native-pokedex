import { useThemeColors } from "@/hooks/useThemeColors";
import { useRef, useState } from "react";
import { Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { Card } from "./Card";
import { Row } from "./Row";
import { Radio } from "./Radio";
import { Checkbox } from "./Checkbox";
import { Shadows } from "@/constants/Shadows";

// Types pour les filtres
export type PokemonFilters = {
    types: string[];
    generation: number;
};

type Props = {
    filters: PokemonFilters;
    onChange: (filters: PokemonFilters) => void;
};

// Liste des types de Pokémon
const pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting',
    'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost',
    'dragon', 'dark', 'steel', 'fairy'
];

// Définition des générations
const generations = [
    { label: "All Generations", value: 0 },
    { label: "Generation 1", value: 1 },
    { label: "Generation 2", value: 2 },
    { label: "Generation 3", value: 3 },
    { label: "Generation 4", value: 4 },
    { label: "Generation 5", value: 5 },
    { label: "Generation 6", value: 6 },
    { label: "Generation 7", value: 7 },
    { label: "Generation 8", value: 8 },
    { label: "Generation 9", value: 9 },
];

export function FilterButton({ filters, onChange }: Props) {
    const buttonRef = useRef<View>(null);
    const colors = useThemeColors();
    const [isModalVisible, setModalVisible] = useState(false);
    const [localFilters, setLocalFilters] = useState<PokemonFilters>({ types: [], generation: 0 });

    const onButtonPress = () => {
        // Copie profonde au lieu d'une référence
        setLocalFilters({
            types: [...filters.types],
            generation: filters.generation
        });
        setModalVisible(true);
    }

    const onClose = () => {
        setModalVisible(false);
    }

    const onApply = () => {
        // Assurez-vous de passer une nouvelle instance d'objet pour déclencher un rendu
        onChange({
            types: [...localFilters.types],
            generation: localFilters.generation
        });
        setModalVisible(false);
    }

    const onReset = () => {
        setLocalFilters({ types: [], generation: 0 });
    }

    const toggleType = (type: string) => {
        setLocalFilters(prev => {
            const newTypes = [...prev.types];
            const index = newTypes.indexOf(type);
            if (index >= 0) {
                newTypes.splice(index, 1);
            } else {
                newTypes.push(type);
            }
            return { ...prev, types: newTypes };
        });
    }

    const setGeneration = (gen: number) => {
        setLocalFilters(prev => ({ ...prev, generation: gen }));
    }

    // Vérifions si le filtre est actif pour l'indiquer visuellement
    const isFilterActive = filters.types.length > 0 || filters.generation > 0;

    return (
        <>
            <Pressable onPress={onButtonPress}>
                <View
                    ref={buttonRef}
                    style={[
                        styles.button,
                        {
                            backgroundColor: colors.grayWhite,
                            borderWidth: isFilterActive ? 2 : 0,
                            borderColor: isFilterActive ? colors.tint : 'transparent'
                        }
                    ]}
                >
                    <Text style={styles.filterIcon}>🔍</Text>
                </View>
            </Pressable>
            <Modal
                animationType="fade"
                transparent
                visible={isModalVisible}
                onRequestClose={onClose}
            >
                <View style={styles.backdrop}>
                    <View style={styles.modalCenteredContainer}>
                        <View style={[styles.popup, { backgroundColor: colors.tint }]}>
                            <ThemedText
                                style={styles.title}
                                variant="subtitle2"
                                color={colors.grayWhite}
                            >
                                Filter Pokémon
                            </ThemedText>
                            <Card style={styles.card}>
                                <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
                                    <ThemedText style={styles.sectionTitle} variant="subtitle2">Types</ThemedText>
                                    <View style={styles.typesGrid}>
                                        {pokemonTypes.map((type) => (
                                            <View key={type} style={styles.typeCheckbox}>
                                                <Checkbox
                                                    label={type.charAt(0).toUpperCase() + type.slice(1)}
                                                    checked={localFilters.types.includes(type)}
                                                    onPress={() => toggleType(type)}
                                                />
                                            </View>
                                        ))}
                                    </View>

                                    <ThemedText style={styles.sectionTitle} variant="subtitle2">Generation</ThemedText>
                                    {generations.map((gen) => (
                                        <Pressable key={gen.value} onPress={() => setGeneration(gen.value)}>
                                            <Row gap={8} style={styles.generationRow}>
                                                <Radio checked={gen.value === localFilters.generation} />
                                                <ThemedText>{gen.label}</ThemedText>
                                            </Row>
                                        </Pressable>
                                    ))}
                                </ScrollView>

                                <View style={styles.buttonRow}>
                                    <Pressable onPress={onReset} style={styles.resetButton}>
                                        <ThemedText>Reset</ThemedText>
                                    </Pressable>
                                    <Pressable
                                        onPress={onApply}
                                        style={[styles.applyButton, { backgroundColor: colors.tint }]}
                                    >
                                        <Text style={styles.applyButtonText}>Apply</Text>
                                    </Pressable>
                                </View>
                            </Card>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 32,
        height: 32,
        borderRadius: 32,
        flex: 0,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
    },
    filterIcon: {
        fontSize: 16,
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalCenteredContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        width: '100%',
    },
    popup: {
        width: '90%',
        maxWidth: 330,
        padding: 4,
        paddingTop: 16,
        gap: 16,
        borderRadius: 12,
        ...Shadows.dp2,
    },
    title: {
        paddingLeft: 20,
    },
    card: {
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    scrollView: {
        maxHeight: 380,
    },
    sectionTitle: {
        marginTop: 8,
        marginBottom: 12,
    },
    typesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    typeCheckbox: {
        width: '50%',
        marginBottom: 8,
    },
    generationRow: {
        paddingVertical: 5,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    resetButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    applyButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    applyButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
import { useThemeColors } from "@/hooks/useThemeColors";
import { useRef, useState } from "react";
import { Dimensions, Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { Card } from "./Card";
import { Row } from "./Row";
import { Radio } from "./Radio";
import { Shadows } from "@/constants/Shadows";

type Props = {
    value: "id_asc" | "id_desc" | "name_asc" | "name_desc",
    onChange: (v: "id_asc" | "id_desc" | "name_asc" | "name_desc") => void
}

const options = [
    {label: "Number (Ascending)", value: "id_asc" },
    {label: "Number (Descending)", value: "id_desc" },
    {label: "Name (A → Z)", value: "name_asc" },
    {label: "Name (Z → A)", value: "name_desc" }
] as const;

export function SortButton({ value, onChange }: Props) {
    const buttonRef = useRef<View>(null);
    const colors = useThemeColors();
    const [isModalVisible, setModalVisible] = useState(false);
    const [position, setPosition] = useState<null | {
        top: number;
        right: number;
    }>(null);
    const onButtonPress = () => {
        buttonRef.current?.measureInWindow((x, y, width, height) => {
            setPosition({
                top: y + height,
                right: Dimensions.get("window").width - x - width,
            });
            setModalVisible(true);
        });
    }
    const onClose = () => {
        setModalVisible(false);
    }
    return (
        <>
            <Pressable onPress={onButtonPress}>
                <View
                    ref={buttonRef}
                    style={[styles.button, { backgroundColor: colors.grayWhite }]}
                >
                    <Image
                        source={
                            value.includes("id")
                                ? require("@/assets/images/number.png")
                                : require("@/assets/images/alpha.png")
                        }
                    />
                </View>
            </Pressable>
             <Modal
                animationType="fade"
                transparent
                visible={isModalVisible}
                onRequestClose={onClose}
            >
                <Pressable style={styles.backdrop} onPress={onClose} />
                <View style={[styles.popup, { backgroundColor: colors.tint, ...position }]}>
                    <ThemedText
                        style={styles.title}
                        variant="subtitle2"
                        color={colors.grayWhite}
                    >
                        Sort by:
                    </ThemedText>
                    <Card style={styles.card}>
                        {options.map((o) => (
                            <Pressable
                                key={o.value}
                                onPress={() => {
                                    onChange(o.value);
                                    setModalVisible(false);
                                }}
                            >
                                <Row gap={8}>
                                    <Radio checked={o.value == value} />
                                    <ThemedText>{o.label}</ThemedText>
                                </Row>
                            </Pressable>
                        ))}
                    </Card>
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
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    popup: {
        position: "absolute",
        width: 170,
        padding: 4,
        paddingTop: 16,
        gap: 16,
        borderRadius: 12,
        ...Shadows.dp2
    },
    title: {
        paddingLeft: 20,
    },
    card: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 16,
    }
});
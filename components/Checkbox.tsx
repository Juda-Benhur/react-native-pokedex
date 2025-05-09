import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';

type Props = {
    label: string;
    checked: boolean;
    onPress: () => void;
};

export function Checkbox({ label, checked, onPress }: Props) {
    const colors = useThemeColors();

    return (
        <Pressable onPress={onPress} style={styles.container}>
            <View
                style={[
                    styles.checkbox,
                    {
                        borderColor: colors.text,
                        backgroundColor: checked ? colors.tint : 'transparent'
                    }
                ]}
            >
                {checked && (
                    <View style={styles.innerCheck} />
                )}
            </View>
            <ThemedText>{label}</ThemedText>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCheck: {
        width: 10,
        height: 10,
        borderRadius: 2,
        backgroundColor: 'white',
    },
});
import { Appearance, ColorSchemeName } from "react-native";
import { useState, useEffect, useRef } from "react";

export default function useColorScheme(
    delay = 500
): NonNullable<ColorSchemeName> {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme())

    let timeout = useRef<NodeJS.Timeout | null>(null).current;

    useEffect(() => {
        Appearance.addChangeListener(onColorSchemeChange);

        return () => {
            resetCurrentTimeout();
            Appearance.addChangeListener(onColorSchemeChange).remove()
        }
    })

    function onColorSchemeChange(preferences: Appearance.AppearancePreferences) {
        resetCurrentTimeout();

        timeout = setTimeout(() => {
            setColorScheme(preferences.colorScheme);
        }, delay)
    }

    function resetCurrentTimeout() {
        if (timeout) {
            clearTimeout(timeout);
        }
    }

    return colorScheme as NonNullable<ColorSchemeName>;
}
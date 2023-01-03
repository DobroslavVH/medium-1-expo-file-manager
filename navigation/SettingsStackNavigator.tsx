import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import Settings from "../screens/Settings/Settings";
import SetPassCodeScreen from "../screens/Settings/SetPassCodeScreen";

const SettinsStack = createStackNavigator();

const SettinsStackNavigator: React.FC = () => {
    return (
        <SettinsStack.Navigator
            initialRouteName="SettingsMain"
            screenOptions={{
                headerShown: false
            }}
        >
            <SettinsStack.Screen
                name="SettinsMain"
                component={Settings}
            />
            <SettinsStack.Screen
                name="SetPassCodeScreen"
                component={SetPassCodeScreen}
            />
        </SettinsStack.Navigator>
    );
};

export default SettinsStackNavigator;
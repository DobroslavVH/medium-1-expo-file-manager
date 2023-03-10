import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import ImageGalleryView from "../screens/ImageGalleryView";
import MiscFileView from "../screens/MiscFileView";
import Browser from "../screens/Browser/Browser";

type HomeStackParamList = {
    ImageGalleryView: {
        folderName: string,
        prevDir: string
    };
    MiscFileView: {
        folderName: string,
        prevDir: string
    };
    Browser: {
        folderName: string,
        prevDir: string,
    };
}

const HomeStack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator: React.FC = () => {
    return (
        <HomeStack.Navigator
            initialRouteName="Browser"
            screenOptions={{
                headerShown: false
            }}
        >
            <HomeStack.Screen
                name="Browser"
                options={({ route }) => ({
                    title: route?.params?.folderName || 'File Manager'
                })}
                component={Browser}
            />
            <HomeStack.Screen
                name="ImageGalleryView"
                options={({ route }) => ({
                    title: route?.param?.prevDir.split('/').pop() || 'Gallery',
                    presentation: 'transperantModal'
                })}
                component={ImageGalleryView}
            />
            <HomeStack.Screen
                name="MiscFileView"
                options={({ route }) => ({
                    title: route?.param?.prevDir.split('/').pop() || 'File View',
                    presentation: 'transperantModal'
                })}
                component={MiscFileView}
            />
        </HomeStack.Navigator>
    );
};

export default HomeStackNavigator;

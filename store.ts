import { configureStore } from "@reduxjs/toolkit";
import imagesSlice from './features/files/imagesSlice';
import themeSlice from "./features/files/themeSlice";
import snackbarSlice from "./features/files/snackbarSlice";

export const store = configureStore({
    reducer: {
        images: imagesSlice,
        snackbar: snackbarSlice,
        theme: themeSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
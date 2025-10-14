import {create} from 'zustand';

interface User {
    name: string;
    email: string;
}

interface AppState {
    user: User;
    theme: 'light' | 'dark';
    isLoading: boolean;
}

interface AppActions {
    toggleTheme: () => void;
    setUser: (user: User) => void;
}

const useAppStore = create<AppState & AppActions>((set) => ({
    user: {name: '게스트', email: 'guest@example.com'},
    theme: 'light',
    isLoading: false,

    toggleTheme: () =>
        set((state) => ({
            theme: state.theme === 'light' ? 'dark' : 'light',
        })),

    setUser: (newUser) =>
        set({user: newUser}),
}));

export default useAppStore;
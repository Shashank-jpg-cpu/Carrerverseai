import { createContext, useContext, useEffect, useState } from "react";

import authService from "../services/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const currentUser = authService.getCurrentUser();

        if (currentUser) {

            setUser(currentUser);

        }

        setLoading(false);

    }, []);

    const login = async (credentials) => {

        const data = await authService.login(credentials);

        setUser(data.user);

        return data;

    };

    const register = async (formData) => {

        return await authService.register(formData);

    };

    const logout = () => {

        authService.logout();

        setUser(null);

    };

    return (

        <AuthContext.Provider

            value={{

                user,

                loading,

                login,

                register,

                logout

            }}

        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(AuthContext);

}
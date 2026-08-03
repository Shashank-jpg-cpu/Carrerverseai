import api from "./api";

const authService = {

    register: async (userData) => {

        try {

            const response = await api.post(

                "/auth/register",

                userData

            );

            return response.data;

        }

        catch (error) {

            throw error.response?.data || error;

        }

    },

    login: async (credentials) => {

        try {

            const response = await api.post(

                "/auth/login",

                credentials

            );

            if (response.data.token) {

                localStorage.setItem(

                    "token",

                    response.data.token

                );

            }

            if (response.data.user) {

                localStorage.setItem(

                    "user",

                    JSON.stringify(response.data.user)

                );

            }

            return response.data;

        }

        catch (error) {

            throw error.response?.data || error;

        }

    },

    logout: () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        sessionStorage.clear();

        window.location.replace("/");

    },

    getCurrentUser: () => {

        const user = localStorage.getItem("user");

        if (!user) {

            return null;

        }

        return JSON.parse(user);

    },

    getToken: () => {

        return localStorage.getItem("token");

    },

    isLoggedIn: () => {

        return !!localStorage.getItem("user");

    }

};

export default authService;
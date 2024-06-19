import { create } from "zustand"

interface IUseAuthStoreProps {

    jwt: string,
    bearerJwt: string,

    setJwt: (value: string) => void
};

export const useAuthStore = create<IUseAuthStoreProps>(set => ({
        jwt: '',

        bearerJwt: '',
    
        setJwt: (value: string) => set({ jwt: value, bearerJwt: 'Bearer ' + value })
}));
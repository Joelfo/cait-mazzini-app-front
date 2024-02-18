import { create } from "zustand"

interface IUseAuthStoreProps {

    jwtToken: string,
    bearerJwt: string,

    setJwtToken: (value: string) => void
};

export const useAuthStore = create<IUseAuthStoreProps>(set => ({
        jwtToken: '',

        bearerJwt: '',
    
        setJwtToken: (value: string) => set({ jwtToken: value, bearerJwt: 'Bearer ' + value })
}));
import { useAuthStore } from "Stores/useAuthStore";
import { useCallback } from "react"
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {

    const removeCookie = useCookies(['caitMazziniAppApiJwt'])[2];

    const setJwt = useAuthStore(state => state.setJwt);

    const navigate = useNavigate();

    const logout = useCallback(() => {
        setJwt('');
        removeCookie('caitMazziniAppApiJwt', {path:'/'})
        navigate('/login');
    }, [removeCookie, setJwt]);

    return logout;
}
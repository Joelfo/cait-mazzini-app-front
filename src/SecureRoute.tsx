import { useAuthApi } from "Api/useAuthApi";
import { useAuthStore } from "Stores/useAuthStore"
import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { Outlet, useNavigate } from "react-router";

export const SecureRoute = () => {

    const { jwt, setJwt } = useAuthStore(state => ({
        jwt: state.jwtToken,
        setJwt: state.setJwtToken
      }));

 


    const [ cookies, setCookie ] = useCookies(['caitMazziniAppApiJwt']); 
    const jwtFromCookies = cookies.caitMazziniAppApiJwt;

    const jwtToCheck = useMemo(() => {
      if (jwt !== '') {
        return jwt;
      } else {
        return jwtFromCookies ?? '';
      }
    }, [jwt, jwtFromCookies]);

    const { error, isSuccess } = useAuthApi().useCheckToken(jwtToCheck);


    const navigate = useNavigate();
    
    const [ authenticated, setAuthenticated ] = useState(false);

    useEffect(() => {
      if (isSuccess) {
        setAuthenticated(true);
        setJwt(jwtToCheck)
        setCookie("caitMazziniAppApiJwt", jwtToCheck);
      }
    }, [isSuccess]);


    useEffect(() => {
      if (error instanceof AxiosError) {
        if (error.request.status === 401) {
          navigate('/login');
        }
      }
    }, [error]);

    // use effect
    useEffect(() => {

      
    }, []);

    return (<>
      {
        authenticated ?
        <Outlet/>
        :
        <Spinner/>
      }
    </>)
}
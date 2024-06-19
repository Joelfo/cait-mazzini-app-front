import { useAuthApi } from "Api/useAuthApi";
import Navbar from "Components/Navbar";
import { MazziniNavbar } from "Components/Navbar/MazziniNavbar";
import { ConnectionErrorAlert } from "Components/Utils/Alert/ConnectionErrorAlert";
import { UserContext } from "Contexts/UserContext";
import { useAuthStore } from "Stores/useAuthStore"
import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { Outlet, useNavigate } from "react-router";

export const SecureRoute = () => {

    const { jwt, setJwt } = useAuthStore(state => ({
        jwt: state.jwt,
        setJwt: state.setJwt
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

    const { error, data: user } = useAuthApi().useGetUser(jwtToCheck);

    const [ showConnectionError, setShowConnectionError ] = useState(false);

    const navigate = useNavigate();
    
    const [ authenticated, setAuthenticated ] = useState(false);

    useEffect(() => {
      if (!!user) {
        setAuthenticated(true);
        setJwt(jwtToCheck)
        setCookie("caitMazziniAppApiJwt", jwtToCheck);
      }
    }, [user]);


    useEffect(() => {
      if (error instanceof AxiosError) {
        if (error.request.status === 401) {
          navigate('/login');
        } else {
          setShowConnectionError(true);
        }
      }
    }, [error]);

    // use effect
    useEffect(() => {

      
    }, []);

    return (<>
      {
        authenticated ?
        <UserContext.Provider value={user!}>
          <div className="navbar-container">
            <MazziniNavbar/>
          </div>
          <Outlet/>
        </UserContext.Provider>
        :
        <> 
          <Container style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{position: 'absolute', top: 'calc(100vh / 2 - 31px)'}}>
              <Spinner style={{height: '150px', width: '150px'}}/>
            </div>
          </Container>
          <ConnectionErrorAlert show={showConnectionError}/>
        </>
      }
    </>)
}
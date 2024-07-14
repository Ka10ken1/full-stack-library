import { Redirect } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { SpinnerLoading } from "../layouts/utils/SpinnerLoading";
import OktaSigninWidget from "./OktaSigninWidget";


const LoginWidget = ({config}) => {
    const {oktaAuth, authState } = useOktaAuth();

    const onSuccess = (tokens) => {
        oktaAuth.handleLoginRedirect(tokens);
    }

    const onError = (err) => {
        console.log('Sign in error: ' + err);
    }

    if(!authState){
        return <SpinnerLoading/>;
    }


    return authState.isAuthenticated ? 
        <Redirect to={{pathname: '/'}} />
        : 
        <OktaSigninWidget config={config} onSuccess={onSuccess} onError={onError} />
}


export default LoginWidget;

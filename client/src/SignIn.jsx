import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useAuth } from './contexts/AuthContext';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';


const SignIn = () => {
    const {currentUser,login}= useAuth();
    const history=useHistory();

    useEffect(()=>{
        console.log(currentUser);
    },[currentUser])

async function handleLogin(){
        await login();
        console.log("sign In");
        history.push("/Dashboard")
    }

    return ( 
        <Grid container spacing={0}>
           <Grid item xs={12} sm={6} lg={6}>
                <h1>
                    Microsoft Teams 
                </h1>
                <p>
                    Meet, chat, call, and collaborate in just one place. 
                </p>
                <Button variant="contained" onClick={()=>{
                    handleLogin()
                }}>Default</Button>
           </Grid>
           <Grid item xs={12} sm={6} lg={6}>
                <img src="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RWDeEK?ver=e1e6&q=90&m=2&h=768&w=1024&b=%23FFFFFFFF&aim=true" alt="TeamsImage" />
           </Grid>
        </Grid>
     );
}
 
export default SignIn;
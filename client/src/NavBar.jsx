import { fade, makeStyles } from '@material-ui/core/styles';
import { AppBar } from '@material-ui/core';
import { Toolbar } from '@material-ui/core';
import { InputBase } from '@material-ui/core';
// import SearchIcon from '@material-ui/icons/Search';
// import { Button } from '@material-ui/core';
import { IconButton } from '@material-ui/core';


const useStyles = makeStyles(() => ({
searchBar:{
    backgroundColor:"red",
}
}));


const NavBar = () => {
    const classes = useStyles();
    return ( 
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start"  color="inherit" aria-label="menu">
                 </IconButton>
                 <div >
                    {/* <div >
                    <SearchIcon />
                     </div> */}
                    <InputBase
                    placeholder="Search…"
                    fullWidth
                    classes={{
                        searchBar: classes.searchBar
                      }}
                    />
                </div>
                
            </Toolbar>
        </AppBar>
     );
}
 
export default NavBar;
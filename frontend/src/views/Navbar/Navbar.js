import React, { useState } from 'react'
import { Button,Navbar,Nav,NavDropdown ,Form,FormControl} from 'react-bootstrap';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import 'bootstrap/dist/css/bootstrap.min.css';
import Badge from '@material-ui/core/Badge';
import './Navbar.css';
import { Avatar } from "@material-ui/core";
import { IoIosArrowDown, IoMdNotificationsOutline,IoMdNotifications } from "react-icons/io";
import Notifications from '../Components/Notifications/Notifications';

const Navbars = (props) => {
  const [dropDownToggle, setDropDownToggle] = useState(true);

    const useStyles = makeStyles((theme) => ({
      navbar: {
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      },
      navBarShift: {
        width: 'calc(100% - 300px)',
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 300,
      },
      
      opened: {
        color: '#e0004d',
        padding: '3px',
        fontSize: '31px',
        borderRadius: '50%',
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
      closed:{
        fontSize:24,
        color: "#a0a0a0", 
       
      }

      
      
    }));
    const classes = useStyles();
    const theme = useTheme();
return(

<div> 
<Navbar variant="light" expand="lg"   className={clsx(classes.navbar, {
          [classes.navBarShift]: props.open,
        })}>
<Navbar.Toggle aria-controls="basic-navbar-nav" />
<Navbar.Collapse id="basic-navbar-nav">
  <Nav className="mr-auto"></Nav>
  {props.open ? <div className='Notifications' onClick={props.handleDrawerClose}>
  <Badge color="secondary" badgeContent={2}>
    <IoMdNotifications  className={classes.opened}  ></IoMdNotifications>
  </Badge>
  </div>: <div className='Notifications' onClick={props.handleDrawerOpen}>
  <Badge color="secondary" badgeContent={2}>
    <IoMdNotificationsOutline  className={classes.closed}  ></IoMdNotificationsOutline>
  </Badge>
  </div>}
  
  <div 
    onMouseEnter={() => setDropDownToggle(!dropDownToggle)} onMouseLeave={() => setDropDownToggle(!dropDownToggle)} 
    style={{flexDirection: "row", display: 'flex', marginRight: 20, marginTop:5,
      alignItems: "center",cursor: 'pointer'}}> 
  <Avatar src={props.data.image} style={styles.avatar} />
  <div
    style={{
      paddingLeft: 5,
      paddingRight:5,
      fontSize: 16,
      fontWeight: "bold",
      color: "#e0004d",
      wordWrap: "break-word",
    }}
  >
    {props.data.name}
  </div>
  <IoIosArrowDown style={{color: "#e0004d"}}></IoIosArrowDown>
  <div hidden={dropDownToggle} style={{width: 200, padding: 10, backgroundColor: "#fafafa", borderRadius: 10, borderWidth: 0.2, borderStyle:"solid", borderColor: "#f0f0f0",
      position: "absolute", top: 50, right: 20, boxShadow: "0px 2px 2px #000000a1"}}>
    <div style={{opacity: 0.9, padding: 5}}>Settings</div>
    <div style={{opacity: 0.9, padding: 5}}>Log Out</div>
  </div>
  </div>
</Navbar.Collapse>
</Navbar>

<Notifications open={props.open} onClick={props.handleDrawerClose}/>
</div>
)}

export default Navbars

Navbars.defaultProps = {
  data: {
    image: "",
    name: "Doctor Name",
  },
  collapseSidebar: false
};

const styles = {
  avatar: {
    height: 30,
    width: 30,
    padding: 0,
    margin:4,
    borderWidth: 0.1,
    borderColor: "#e0004d",
    borderStyle: "solid",
    transition: "width 0.3s, height 0.3s",
  },
};


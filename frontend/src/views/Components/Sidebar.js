import React from "react";
import { Nav } from "react-bootstrap";
import Image from 'react-bootstrap/Image'
import { useLocation, withRouter } from "react-router";
import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import {
  BsFillGridFill,
  BsShuffle,
  BsFillPersonLinesFill,
  BsBoxArrowUp,
  BsList
} from "react-icons/bs";
import history from "../../services/history";
// import '../Styles/dash.css'
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { useState } from "react";

const Sidebar = (props) => {
  const userId = '1';
  // const userId = useLocation().state.userId;
  const data = props.data;
  // let sampleVal = Boolean(window.localStorage.getItem('sidebar'));
  const [sideBarBtn, setSidebarBtn] = useLocalStorage('sidebar', false);

// Hook
function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = value => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

  return (
    <ProSidebar
      className={`d-none d-md-block bg-light pro-sidebar sidebar ${sideBarBtn? 'collapsed': 'sidebar'}`}
      style={{ backgroundColor: "lightslategray" }}
    >
      <SidebarHeader style={{backgroundColor: "#e0004d"}} 
              onClick={() => { 
                localStorage.setItem('sidebar', !sideBarBtn);  
                setSidebarBtn(!sideBarBtn);
                }}
              // onMouseEnter={() => { 
              //   if(sideBarBtn === true){
              //   localStorage.setItem('sidebar', !sideBarBtn);  
              //   setSidebarBtn(!sideBarBtn);
              //   }
              // }}
              // onMouseLeave = {() => { 
              //   localStorage.setItem('sidebar', !sideBarBtn);  
              //   setSidebarBtn(!sideBarBtn);
              //   }}
                >
        <Menu iconShape="square">
          <MenuItem title="Profile">
              <BsList style={sideBarBtn? {...styles.sidebarIcon,...styles.sidebarIconSmall} : styles.sidebarIcon}></BsList>
              <div
                  
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Image src={require('../Images/mark.png')} style={{width:30, height:30, marginLeft:4, marginRight: 4}} />
                  <div hidden={sideBarBtn} style={{color: "white", fontSize: 20, opacity: 0.9}}>aibers</div>
                </div>
          </MenuItem>
        </Menu>
      </SidebarHeader>
      {/* <SidebarHeader>
        <Menu iconShape="square">
          <MenuItem title="Profile">
            <Link
              to={{
                pathname: "/Profile",
                state: { userId: userId },
              }}
            >
              <div
                style={{
                  flexDirection: "row",
                  display: "flex",
                  flex: 1,
                  alignItems: "center",
                  paddingTop: 0,
                }}
              >
                <div>
                  <Avatar src={data.image} style={sideBarBtn? {...styles.avatar,...styles.avatarSmall} : styles.avatar} />
                </div>
                <div
                  hidden={sideBarBtn}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    flex: 1,
                    flexDirection: "column",

                  }}
                >
                  <div
                    style={{
                      paddingLeft: 10,
                      fontSize: 20,
                      color: "#e0004d",
                      wordWrap: "break-word",
                    }}
                  >
                    {data.name}
                  </div>
                  <div style={{ paddingLeft: 10, fontSize: 14 }}>
                    {data.specialization}
                  </div>
                </div>
              </div>
            </Link>
          </MenuItem>
        </Menu>
      </SidebarHeader> */}
      <SidebarContent>
        <Menu iconShape="square">
          <MenuItem title="Appointments">
            <Link
              to={{
                pathname: "/Appointments",
                state: { userId: userId },
              }}
            >
              <BsShuffle style={sideBarBtn? {...styles.icons,...styles.iconsSmall} : styles.icons}></BsShuffle>{sideBarBtn?"": "Appointments"}
            </Link>
          </MenuItem>
          <MenuItem title="Patients">
            <Link
              to={{
                pathname: "/Patients",
                state: { userId: userId },
              }}
            >
              <BsFillPersonLinesFill
                style={sideBarBtn? {...styles.icons,...styles.iconsSmall} : styles.icons}
              ></BsFillPersonLinesFill>
              {sideBarBtn?"": "Patients"}
            </Link>
          </MenuItem>

          <MenuItem title="Profile">
            <Link
              to={{
                pathname: "/Profile",
                state: { userId: userId },
              }}
            >
              <BsFillGridFill style={sideBarBtn? {...styles.icons,...styles.iconsSmall} : styles.icons}></BsFillGridFill>{sideBarBtn?"": "Dashboard"}
            </Link>
          </MenuItem>
        </Menu>
      </SidebarContent>
      <SidebarFooter>
        <div>
          <Menu iconShape="square">
            <MenuItem title="Profile">
              <Link
                to={{
                  pathname: "/Profile",
                  state: { userId: userId },
                }}
              >
                <BsBoxArrowUp style={sideBarBtn? {...styles.icons,...styles.iconsSmall} : styles.icons} ></BsBoxArrowUp>{sideBarBtn?"": "Log Out"}
              </Link>
            </MenuItem>
          </Menu>
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default Sidebar;

Sidebar.defaultProps = {
  data: {
    image: "",
    name: "Doctor Name",
  },
  collapseSidebar: false
};

const styles = {
  avatar: {
    height: "50px",
    width: "50px",
    padding: 0,
    margin:4,
    borderWidth: 0.3,
    borderColor: "#e0004d",
    borderStyle: "solid",
    transition: "width 0.3s, height 0.3s",
  },
  avatarSmall: {
    height: "30px",
    width: "30px",
  },
  icons: { height: "22px", width: "22px", margin: 8, marginRight:15, marginLeft:15,transition: "width 0.3s, height 0.3s",  },
  iconsSmall: { height: "18px", width: "18px", marginLeft: 8},
  sidebarIcon: {width: 30, height: 30, position: "absolute", left:15, color: "#f0f0f0",transition: "left 0.3s" },
  sidebarIconSmall: {left: -15}
};

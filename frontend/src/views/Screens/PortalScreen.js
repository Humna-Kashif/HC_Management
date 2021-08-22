import React from "react"
import { Col, Container, Row } from "react-bootstrap";
import { BrowserRouter, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Sidebar from "../Components/Sidebar";
import Navbars from "../Navbar/Navbar";
import DoctorProfileTab from "./DoctorProfileTab";
import '../Styles/dash.css'
import history from "../../services/history";
import DoctorAppointmentsTab from "./DoctorAppointmentsTab";
import DoctorPatientsTab from './DoctorPatientsTab'
import { useEffect } from "react";
import { useState } from "react";
import { GetDoctorAllInfoAPI } from '../DB/API'

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
    
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },

  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 300,
  },
 

}));


const PortalScreen = (props) => {
    // const userId = useLocation().state.userId;
    const userId = '1';
    const selected = props.selected;
    let match = useRouteMatch();

    const [data,setData] = useState([]);

    const [oneTime,setOneTime]=useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            oneTime && 
            GetDoctorAllInfoAPI(userId).then(result => {
                console.log("new api",result[0]);
                setData(result[0]);
            });
            setOneTime(false);
          }, 200);
        return () => clearTimeout(timer);
    })


  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };
    
   
    const classes = useStyles();
    const theme = useTheme();
    return (
        <div style={{display: "flex", flex: 1, flexDirection: "column", backgroundColor: "#00000008", position: "relative"}}>
            <div style={{ display: "flex", flex:1, flexDirection: "row", position: "relative"}}>
                <Sidebar data={data}/>
                <div style={{display: "flex", flexDirection: "column", flex:1}}>
                    <div style={{ width: "100%", position: "relative", top: 0, right: 0, zIndex:100}}>
                        <Navbars data={data} open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose}/>
                    </div>
                <Container fluid>

                {/* <Row style={{margin: 0}}>
                    <Col lg={3} style={{margin: 0, padding:0, backgroundColor: "lightsteelblue", height: 300, width: 300, position: "fixed", zIndex: 10, top: 100, right: 100}}>
                        <div style={{ bottom:0}}> {match.path}</div>
                    </Col>
                </Row> */}
             <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
                {/* <Row style={{margin: 0}}> */}
                    {/* ------------ Sidebar -------------- */}
                    {/* <Col lg={4}  md={1} className="d-none d-md-block" style={{backgroundColor: "lightsteelblue"}} >      
                    </Col> */}
                    {/* ------------ Section ------------ */}
                    {/* <Col  lg={12} md={12} sm={12} xs={12} id="page-content-wrapper" style={{padding: 0, margin: 0}}> */}
                        <div style={{marginTop: 10}}>
                            <BrowserRouter>
                            <Switch>
                                {console.log("Selected path:", match.path, "matching", selected)}
                                <Route path={"/Profile"} exact={true} component={DoctorProfileTab} />
                                <Route path={"/Appointments"} exact={true} component={DoctorAppointmentsTab} />
                                 
                                <Route path={"/Patients"} exact={true} component={DoctorPatientsTab}/>
                            </Switch>
                            </BrowserRouter>
                        </div>
                    {/* </Col> */}
                {/* </Row> */}
                </main>
                </Container>
                </div>
            </div>
        </div>
    )
}

export default PortalScreen

PortalScreen.defaultProps = {

}
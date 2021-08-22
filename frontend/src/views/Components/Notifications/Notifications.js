import React from 'react'
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Col, Row } from "react-bootstrap";
import Avatar from '@material-ui/core/Avatar';
import CardActions from '@material-ui/core/CardActions';
import NotificationsIcon from '@material-ui/icons/Notifications';
import './Notifications.css';
import { Fragment } from 'react';


const notificationList=[];


for (let i = 0; i < 10; i++) {
  notificationList.push({
    notification_id: `${i}`,
    patient_image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    patient_info: 'Kaleem Nisar',
    description:'commented on the appointment of',
    appointment_date:'11 January',
    moment_notification:'1 hour ago'
  });
}


const useStyles = makeStyles((theme) => ({
 
    drawer: {
      width: 300,
      flexShrink: 0,
    },
    drawerPaper: {
      width: 300,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      background: '#e3464d',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-start',
    },
  }));

  
const Notifications=({open,onClick})=>{

const classes = useStyles();
const theme = useTheme();

const List = notificationList.map((data)=>
(!data.length > 0 )?
<Fragment>
  <Card className='Cards'>
        <CardContent>
          <Row > 
            <Col lg={2}>
            <Avatar alt="patient-image" src={data.patient_image} />
            </Col>
            <Col lg={10}>
              <span className='cardTitle'>
              <label> {data.patient_info}  </label>  {data.description}  <label> {data.appointment_date} </label>
              </span>
        
        
            </Col>
          </Row>    
        </CardContent>
        <CardActions>
        <label className='Moment'> {data.moment_notification}</label>
        </CardActions>
        
      </Card>
    <br/>

  </Fragment> :
  <Fragment>
    <label className='EmptyMoment'> Notifications
<br/>
<NotificationsIcon/>
 </label>
  </Fragment>

)

return(
<Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
        
           <h6 className='HeadTitle'> Notifications</h6>
         
           <IconButton onClick={onClick} className='HeadBtn'>
            <ClearIcon/>
          </IconButton>
        
       
        </div>
        <Divider />
       <div className='Notification-Container'>
       <div className='scrollbox'> 
       {List}
       </div>
       </div>
      </Drawer>
)
}


export default Notifications
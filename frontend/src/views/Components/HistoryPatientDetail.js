import React, { useEffect, useState } from "react"
import { Avatar, Icon,Divider ,InputBase,IconButton,Grid, Button } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';

import Paper from '@material-ui/core/Paper';
import Lorem from "../Config/Lorem";
import CommentItem from "./CommentItem";
import PrescriptionListItem from "./PrescriptionListItem";
import TestListItem from "./TestListItem";
import { Col, Row } from "react-bootstrap";
import {getComments,addComment} from "../DB/API"
import moment from 'moment';
import { useLocation } from "react-router-dom";
import '../Styles/Comments.css'; 
import '../Styles/PatientHistory.css';
import { Fragment } from "react";
import NoData from '../Styles/Assets/box.png';



const Colors = {
    primaryColor: "#e0004d",
    baseColorDarker2: "#e0e0e0"
}

// const commentList = [];
//   for (let i = 0; i < 10; i++) {
//     commentList.push({
//       comment_id:[i],
//       doctor_info_image:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxMjA3fDB8MXxzZWFyY2h8MXx8cGVyc29ufHwwfHx8&ixlib=rb-1.2.1&q=80&w=1080",
//       doctor_info_name:'Michel Michel',
//       date_time_of_comment:'15-January-2021 |  09:00 PM ',
//       comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean luctus ut est sed faucibus. Duis bibendum ac ex vehicula laoreet. Suspendisse congue vulputate lobortis. Pellentesque at interdu"
       
//     });
//   }


const HistoryPatientDetail = (props) => {

    // const data = props.Data;
    

    const data = props.itemData;
    console.log("Data in history detail is ",data);
    const appointmentID = props.appointment_id;
    
    const [isCommentVisible,setCommentVisible]= useState(false);
    const [inputFocused,setInputFocused] = useState(false);
    const [commentValue,setCommentValue] = useState("");
    const [commentList,setCommentList] = useState([]);
    const doc_ID = useLocation().state.userId;
   

    const onCommentPressed = () => {
    console.log("comment pressed: ", isCommentVisible);
    setCommentVisible(!isCommentVisible);
    };

    //Get Comments
    useEffect (() =>{
      getComments(0,0,0,data.appointment_id).then(result => {
        console.log("Commnets are ",result); 
        if(result[0])
         setCommentList(result[0].comments);
      });
    },[]);

    const displayComments = () => {
      getComments(0,0,0,data.appointment_id).then(result => {
      console.log("Commnets are ",result[0].comments); 
      setCommentList(result[0].comments);
    });
  }

    //addComment
    const handleAddComment = (value) =>{
      console.log("the values are ", doc_ID,"   ",data.appointment_id,"   ",value)
        addComment(0,doc_ID,0,data.appointment_id,"POST",value).then(result => {
        console.log(result); 
        displayComments();
      });
    }

    const   isFocused = () => {
    setInputFocused(true);
    };

    const   isBlured = () => {
    setInputFocused(false);
    };

    const handleInputPress = () => {
    console.log("Input pressed", commentValue);
    const newComment = {username: "Dr. John", commentText: commentValue, commentTime: "1 min ago"};
    appointmentID.comments.push(newComment);
    setCommentValue("");
    };

    const renderCommentsList = commentList.map((data)=>
        <Fragment> 
        <Grid item  container wrap="nowrap" spacing={2} id={data.comment_id}>
          { !!(data.doctor_info) ?
            <Grid item>
              <Avatar alt="Remy Sharp" src={data.doctor_info.image} className='ComMainAv'  />
            </Grid> :
            <Grid item>
            <Avatar alt="Remy Sharp" src={data.patient_info.image} className='ComMainAv'  />
          </Grid>
          }
          <Grid justifyContent="left" item xs zeroMinWidth>
            { !!(data.doctor_info) ? <h4 className='Com-Name' >{data.doctor_info.name}</h4> : <h4 className='Com-Name' >{data.patient_info.name}</h4>}
            <div className='Com-moments' >{moment().endOf(data.date_time_of_comment).fromNow()} </div>
                <p className='ComText'  >
                  {data.comment}
            </p>
      
            </Grid>
        </Grid>
          <Divider variant="fullWidth" className='Comments-Divider' />
          <br/>
        </Fragment>
        )
    

    const renderSymptoms = () =>{
      return(
      <div style={{display:"flex", flexDirection:"row"}}>
          {!!(data.appointment_data.symtoms) ? (data.appointment_data.symtoms.map((role, i)=> (
              <div key={i} style={{marginLeft:"10px"}}>
                  <div>{role.symtoms}</div>
              </div>)
                  )):(<h6 className='text-center'>No Symptoms Mentioned</h6>)}
      </div>
      )
    }

    const renderDiagnosis = () =>{
      return(
          <div style={{display:"flex", flexDirection:"row"}}>
          {!!(data.appointment_data.diagnosis) ? (data.appointment_data.diagnosis.map((role, i)=> (
              <div key={i} style={{marginLeft:"10px"}}>
                  {role.diagnosis}
              </div>)
                  )):(<h6 className='text-center'>No Diagnosis Mentioned</h6>)
          }
          </div>
      )
    }

    const renderTests = () =>{
      return(
          <Fragment >
          {!!(data.appointment_data.tests) ? (data.appointment_data.tests.map((role, i)=> (
              <h6 className='TestTitle' key={i}>
                  {role.tests}
              </h6>)
                  ))
                :(<h6 className='TestTitle'>No tests mentioned</h6>)
          }
          </Fragment>
      )
    }

    const renderPrescription = () =>{
      return(
          <div>
            
          {!!(data.appointment_data.prescription) ? (data.appointment_data.prescription.map((role, i)=> (
   <Fragment> 
              <Row className='mtt-10'>
              <Col lg={4}> <label className='prescLabel'>Medicine </label>   </Col>
              <Col lg={4}> <label className='prescLabel'>Dosage </label> </Col>
              <Col lg={4}> <label className='prescLabel'>Estd. Price </label> </Col>  
              </Row>
              <div key={i} >
                  <Row classNam='m-0'>
                  <Col lg={4}>
                    {!!(role.name) ? (role.name):(<p>Name not mentioned</p>)}
                  </Col>
                  <Col lg={4}>
                    {!!(role.frequency) ? (role.frequency):(<p>Dosage not mentioned</p>)}
                  </Col>
                  <Col lg={4}>
                    {!!(role.price) ? (role.price):(<p>Price not mentioned</p>)}
                  </Col>
                  <Col lg={7}></Col>
                  <Col lg={4}>  <label className='Totaltxt'> Estd. Net Price (PKR) <b className='TotalNum'> {role.price} </b> </label>  </Col>
                </Row> 
                  
                
              </div>
              </Fragment>)
                  )): <h6 className='text-center'> No Prescription Mentioned</h6>
          }
          </div>
      )
    }
    
    // const renderTestItems = () => {
    // // console.log("Data in detail item: ",data);
    // // return (<Text>hello</Text>)
    // return   (
    // // <Text key={i}>hello{i}</Text>
    // <TestListItem itemData={item}/> 
    // )
    // }

    // const   renderPresciptionItems = () => {
    // // console.log('Temp: ',this.state.temp); 
    // return (
    // <PrescriptionListItem itemData={item} /> 
    // )
    // }

    // Comments Section

   
 
    const renderComments=()=>{
      return(
        <Fragment>
         {/* Head */}
           <div className='Comments-Head' style={{borderBottomColor: Colors.baseColorDarker2, marginTop:'6px'}}>
            
             <h6 style={{ color: Colors.primaryColor }} onClick={onCommentPressed}>Comments  
             <span><label className='CommentsLabel'>0 </label>  </span>
             </h6>
             
           
           </div>
         
           {/* Input Comment */}
           <Row>
             <Col lg={1} >
             <Avatar src={data.patientinfo.image} style={styles.avatar}/>  
             </Col>
             <Col lg={11} style={{marginTop:3}} >
              <Paper className='Comment-Box'> 
              <InputBase
                className='Comments-BoxIn'
                placeholder="Enter your comment"
                inputProps={{ 'aria-label': 'enter your comment' }}
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
              />
              <Divider style={{ height: 28,margin: 4}} orientation="vertical" />
              <IconButton style={{ color: Colors.primaryColor, padding: 10 }} aria-label="directions" onClick={()=>{handleAddComment(commentValue)}}>
                <SendIcon />
              </IconButton>
              </Paper>
             </Col>
           </Row>
        
           {/* Main Comment  */}
           {!!(data.comment) ? 
           '' : <Paper className='Comments-Container'>
           <div className='scrollbox'> 

          
            {renderCommentsList}
                 
           
       
            </div>
           </Paper>
    }
          
        </Fragment>
      )
    }

   
    return (
        <div className='PreviousHistory'>
        {/* <div style={{flexDirection: "row", alignItems: "center", paddingLeft: 5}}>
          <div style={styles.timelineDot}></div>
          <div style={{paddingLeft: 10}}>Appointment : {appointmentID.title}</div>
        </div> */}
    
        {/* <div style={{width:1,height: "100%", backgroundColor:Colors.primaryColor, marginLeft: 2, opacity:0.4}}></div> */}
         
          
           <h6 className='TitleText'>Doctor</h6>
           
            {/* <div
              style={{
                display: "flex",
                textAlign:"left",
                flexDirection: "row",
                paddingTop: 8,
                paddingBottom: 8,
                borderBottomWidth: 1,
                borderBottomColor: Colors.baseColorDarker2,
              }}
            > */}
              <div className='DoctorInfo'> 
                <Avatar src={data.patientinfo.image} />   
                <h6 className='Name'>{data.doctorinfo.name}</h6>
                <h6 className='Tags'>{data.doctorinfo.specialization}</h6>
                <div className='SubTags'>{data.doctorinfo.appointment_location.appointment_location_of_doctor}</div>
                </div>
            {/* </div> */}
            <Divider/>
            {/* <div
              style={{
                flexDirection: "row",
                display: "flex",
                textAlign: "left",
                paddingTop: 8,
                paddingBottom: 8,
                borderBottomWidth: 1,
                borderBottomColor: Colors.baseColorDarker2,
              }}
            > */}
            

             
                <div className='TitleText'>Visit's Summary</div>
                <div className='HistorySection'>
                  <div>{data.doctors_note}</div>
              
                    <div className='TitleText'>Symptoms</div>
                    <div>{renderSymptoms()}</div>
                 
            
                    <div className='TitleText'>Diagnosis</div>
                    <div>{renderDiagnosis()}</div>
               
                </div>
           
            {/* </div> */}

            <Divider/>
            {/* Test Section */}
            {/* <div
              style={{
                flexDirection: "row",
                display: "flex",
                textAlign: "left",
                paddingTop: 8,
                paddingBottom: 8,
                borderBottomWidth: 1,
                borderBottomColor: Colors.baseColorDarker2,
              }}
            > */}
            
                <div className='TitleText'>Tests</div>
              
                 {data.appointment_data.tests? 
                <Fragment>
                <Row className='m-0'>
                <Col lg={7}>  {renderTests()} </Col>
                <Col lg={3}> <label className='PriceTag'> Estd. Price (PKR)</label></Col>
                <Col lg={2}> <Button type='default' className='ViewDetails'> View </Button></Col>
              </Row>
               
                </Fragment>
                 
                    :   <h6 className='text-center'> No Tests Advised </h6>} 
                 
              
                
            
            {/* </div> */}
            {/* Test Section Ends */} 
            <Divider/>
            {/* <div
              style={{
                flexDirection: "row",
                display: "flex",
                paddingTop: 8,
                paddingBottom: 8,
                borderBottomWidth: 1,
                borderBottomColor: Colors.baseColorDarker2,
              }}
            > */}
              <div className='TitleText'>Presciptions</div>
             
              <div>{renderPrescription()}</div>      
            {/* </div> */}
            <Divider/>
            <div>{renderComments()}</div>
         
      

    </div>
    )
}

export default HistoryPatientDetail

HistoryPatientDetail.defaultProps = {
    imageURL: "",
    appointmentID: {
        title: "",
        comments: []
    }
}

const styles = {
    textRight: {
        textAlign: "right",
      },
      section: { paddingTop: 5, paddingBottom: 5 },
      sectionHeading: { color: Colors.primaryColor, fontWeight: "bold", paddingLeft: 10,paddingTop: 10 },
      priscriptionsStyle: { fontWeight: "bold", paddingLeft: 10,paddingTop: 10 },
      timelineDot: {width:6, height:6, borderRadius:3, backgroundColor:Colors.primaryColor},
      avatar: { height:"50px", width:"50px", borderWidth: 0.3, borderColor: "#e0004d", borderStyle: "solid"},
}
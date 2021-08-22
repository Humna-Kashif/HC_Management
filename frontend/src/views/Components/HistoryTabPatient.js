import React, { useEffect, useState } from "react"
import Moment from 'moment';
import HistoryPatientItem from "./HistoryPatientItem";
import { Col, Container, Row } from "react-bootstrap";
import HistoryPatientDetail from "./HistoryPatientDetail";
import {getPatientCompletedAppoinmtmentHistoryAPI,getPatientCompletedAppoinmtmentProfileAPI} from "../DB/API"

const HistoryTabPatient = (props) => {
    const data = props.Data;
    const appointment_id = props.id;
    console.log("Data from back side is ",data);
    const doc_ID = props.id;
    const [completedAppointments , setCompletedAppointments] = useState([]);
    const [clickedItem,setClickedItem] = useState();
    const [selectedHistory, setSelectedHistory] = useState(0);



    const getPatientCompletedAppoinmtmentHistory = () =>{
        getPatientCompletedAppoinmtmentHistoryAPI(doc_ID,0,data.patient_id,"GET").then(result => {
            console.log("completed Appointments history tab",result);
            setCompletedAppointments(result);
            if (result.length !== 0) {
            handleCompletedAppointmentProfileItem(result[0])
        }
        });
    }

    useEffect(() => {
        getPatientCompletedAppoinmtmentHistory();
    },[]);

    const handleCompletedAppointmentProfileItem = (item) =>{
        console.log("appointmentclicked",item.appointment_id)
        setSelectedHistory(item.appointment_id);
        getPatientCompletedAppoinmtmentProfileAPI(doc_ID,0,data.patient_id,item.appointment_id)
        .then(result => {
            console.log("patient info api",result);
            setClickedItem(result[0]);
        });
        
    }


    const renderHistoryList = () => {
        return(
            completedAppointments.map((item,i)=>( <HistoryPatientItem id={doc_ID} key={i} itemData={item} selected={item.appointment_id===selectedHistory} onClick={()=>handleCompletedAppointmentProfileItem(item)}/>))
        )
    }

    return (
      <Container fluid style={{paddingTop: 10}}> 
      
          <Row>
            <Col lg={5} >
                <div className='HistoryList'>
                    <div class='scrollbox '> 
                    {/* You need to display a list here */}
                    {renderHistoryList()}
                    {renderHistoryList()}
                </div>
                </div>
                   
            </Col>
            <Col lg={7}>
                {!!clickedItem &&
                    <div>
                        <HistoryPatientDetail itemData={clickedItem}/>
                    </div>
                }
                
            </Col>
          </Row>
      </Container>
    )
}

export default HistoryTabPatient

HistoryTabPatient.defaultProps = {
    }

const styles = {
}


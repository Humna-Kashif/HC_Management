import React, { useEffect, useState} from 'react'
import { Button, Col, Row , Card} from "react-bootstrap"
import PatientHeader from '../Components/PatientHeader'
import PatientBody from '../Components/PatientBody'
import moment from 'moment'

const PatientProfile = (props) =>{ 
    const data = props.itemData;
    const pat_info = data.patientinfo;
    const appointment_Time = data.date_time;
    const mytime = moment(appointment_Time);
    const Appointment_Time = mytime.format('hh:mm A');
    const notes = data.doctors_note;
    const medical_History = data.appointment_data;
    const hospital_History = data.doctorinfo.appointment_location;
    // const hospital_History = '';
//    const [data,setData] = useState(props.itemData);
    console.log("Patient Profile is ",data);
   
    return (
        <div style={styles.label}>
           <PatientHeader timing={Appointment_Time} info={pat_info} />
           <PatientBody info={pat_info} doc_note={notes} history={medical_History} hos_loc={hospital_History} />
        </div>
    )
}
export default PatientProfile

PatientProfile.defaultProps = {
    itemData: {
        doctorinfo: {
            appointment_location: ""
        }
    }
}

const styles = {
    label: {fontSize: 14, textAlign: "Left", margin:"20px",backgroundColor:"whtiesmoke",padding:20,borderRadius: "0.5em",border:"solid",borderColor:"gray",borderWidth:1}
}
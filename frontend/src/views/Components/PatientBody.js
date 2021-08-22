import React, { useEffect, useState} from 'react'
import { Button, Col, Row , Card, Container} from "react-bootstrap"
import moment from 'moment'
const PatientBody = (props) =>{
    const pat_info = props.info;
    const doc_notes = props.doc_note;
    const medical_History = props.history;
    const hospital_History = props.hos_loc;
    var years = moment().diff(pat_info.dob, 'years');

    function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
    }

    const renderSymptoms = () =>{
        return(
        <div style={{display:"flex",flexDirection:"column"}}>
            <b>Symptoms:</b>{!!medical_History.symtoms ? (medical_History.symtoms.map((role, i)=> (
                <div key={i}>
                    {role.symtoms} 
                </div>)
                    )):(
                    
                        <p> No symptoms mention</p> 
                    
                    )}
        </div>
        )
    }

    const renderTests = () =>{
        return(
            <div style={{display:"flex", flexDirection:"column"}}>
            <b>Tests:</b> {!!medical_History.tests ? (medical_History.tests.map((role, i)=> (
                <div key={i} style={{marginLeft:"10px"}}>
                    {role.test_name}
                </div>)
                    )):(<p> No test mention</p>)
            }
            </div>
        )
    }
    return(
        <Container>
            <Row>
                <Col>
                    <h6 style={styles.label}>
                        Details and History
                    </h6>
                    <h6 style={styles.heading}>
                        Patient History
                    </h6>
                    <p style={styles.paragraph}>
                        {doc_notes} 
                    </p>
                    <h6 style={styles.heading}>
                        Personal Info
                    </h6>
                    <p style={styles.paragraph}>
                    {years} Years old {titleCase(pat_info.gender)}
                    </p>
                    <h6 style={styles.heading}>
                        Past Medical History
                    </h6>
                    <p style={styles.paragraph}>
                        {renderSymptoms()}
                    </p>
                    <p style={styles.paragraph}>
                        {renderTests()}
                    </p>
                    <h6 style={styles.heading}>
                        Past Hospitalization
                    </h6>
                    <p style={styles.paragraph}>
                        {hospital_History.appointment_location_of_doctor}
                    </p>
                </Col>
            </Row>
        </Container>
    )
}
export default PatientBody

PatientBody.defaultProps = {
    hospital_History: {
        appointment_location_of_doctor: ""
    }
}

const styles = {
    label: {fontSize:16,textAlign: "Left", margin:"20px",color:"#e0004d"},
    heading: {fontSize:14, fontWeight: "bold", textAlign: "Left", margin:"20px",color:"#e0004d"},
    paragraph: { textAlign: "Left", marginLeft:"20px", marginTop:"5px", color:"black"},
    name_title: {color: "#e0004d", fontWeight: "bold", fontSize: 22, textAlign: "left",marginTop:"25px"},
    appointment_time: { fontSize: 16, textAlign:"left"},
    reschedule_btn:{
        background:"#91DB92",
        color: "#096A0B ",
        height: "25px",
        borderRadius: "0.5em",
        border:"#91DB92",
        margin:"10px",
        width: "100px"
    },
    checkIn_btn:{
        background:"#8EDAD8 ",
        color: "#29A9A7",
        height: "25px",
        borderRadius: "0.5em",
        border:"#8EDAD8",
        margin:"10px",
        width: "100px"
    }
}
import React, { useEffect, useState} from 'react'
import { Button, Col, Row , Card, Container} from "react-bootstrap"
import { Avatar } from '@material-ui/core';
import { getImage } from '../DB/API'

const PatientHeader = (props) =>{
    const pat_time = props.timing;
    const pat_info = props.info;
    function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
    }
    const [image, setImage] = useState(null);
    useEffect(() => {
        getImage('patients',pat_info.patient_id)
        .then((json) => {setImage("data:image;charset=utf-8;base64,"+json.encodedData); console.log("my json is ", json);})
        .catch((error) => console.error(error))
        .finally(() => {
        });
    }, []);
    return(
        <Container>
            <Row>
                <Col   md="auto">
                <Avatar src={image}
                    style={styles.avatar}/>
                </Col>
                <Col>
                    <div style={styles.name_title}>
                        {titleCase(pat_info.name)}
                    </div>
                    <div style={styles.appointment_time}>
                        Appointment Time: {pat_time}
                    </div>
                </Col>
                <Col xs lg="3">
                    <div style={{display: "flex",flex:1, flexDirection:"column"}}>
                        <button style={styles.reschedule_btn}>Reschedule</button>
                        {/* <button style={styles.checkIn_btn}>Check In</button> */}
                    </div>
                </Col>
            </Row>
        </Container>
    )
}
export default PatientHeader

const styles = {
    label: {fontSize: 14, color: "grey", textAlign: "Left", margin:"20px"},
    input: {fontSize:14, padding: 8,borderRadius: "5px"},
    avatar: { height:"100px", width:"100px", display:"flex"},
    add_photo: { color:"black",cursor:"pointer" ,display:"flex"},
    name_title: {color: "#e0004d", fontWeight: "bold", fontSize: 22, textAlign: "left",marginTop:"22px"},
    appointment_time: { fontSize: 12, textAlign:"left"},
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

PatientHeader.defaultProps = {
    data: {
        name:"Ghulam Farid",
        time:"3:00  12:00",
        image:""
    }
}
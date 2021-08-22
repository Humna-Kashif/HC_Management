import React from 'react'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import { Button, Col, Container, Row } from "react-bootstrap"

const PatientsProgress=(props)=>{
    return(
            <Card className={`ProgressCard ${props.classStatus}`} variant="outlined" id={props.appointment_id}>
                <CardContent>
                <label className='patientStatus'> {props.status} </label>
                    <Row id={props.patient_id}>
                            <Col lg={2}>
                                <Avatar alt="patient-image" src={props.patient_image} />
                            </Col>
                            <Col lg={10}>
                                <div className='mll-15'>
                                <h4 className='NameLabel'> {props.patient_name} </h4>
                                <h6 className='AgeLabel'> Age: {props.dob}</h6>
                                <h6 className='GenderLabel'> Gender: {props.gender}</h6>
                                </div>
                            </Col>
                    </Row>    
                </CardContent>
                <CardActions>
                    <h6> Appointment Time: <label>{props.date_time}</label></h6>
                </CardActions>
            </Card>
    )
}
export default PatientsProgress
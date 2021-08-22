import React, { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import Calender from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import {appointmentsByDateAPI,patientInfoAPI,appointmentDetailAPI,locationsAPI,getAppointmentsQueue,getAppointmentsStats} from "../DB/API"
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment'
import AppointmentsList from '../Components/AppointmentsList'
import PatientProfile from '../Components/PatientProfile'
import StatusChart from './StatusChart';
import LinearProgress from '@material-ui/core/LinearProgress';
import '../Styles/Calender.css'
import '../Styles/AppointmentItem.css';
import '../Styles/margins.css';
import PatientsProgress from "./Statistics/PatientsProgress";
import { Divider } from "@material-ui/core";
import AppointmentType from "./Statistics/AppointmentType";
import AppointmentStatus from "./Statistics/AppointmentStatus";



const mark = [
    '04-01-2021',
    '05-01-2021',
    '25-01-2021'
]

const CalenderSection = (props) =>{
    const doc_ID = props.id;
    const [clickedItem,setClickedItem] = useState();
    const [data, setData] = useState(props.data);
    const [date, setDate] = useState(new Date());
    const [pat_ID, setPat_ID] = useState(0);
    const [loc_ID, setLoc_ID] = useState(0);
    const [locationData,setLocationData] = useState([]);
    const [selectValue,setSelectedValue] = useState(0);
    const [currentPatient,setCurrentPatient] = useState(props.currentPatient);
    const [nextPatient,setNextPatient] = useState(props.nextPatient);


    const onChange = date =>{
        setDate(date);
        getAppointments(date,selectValue);
        displayPatientQue();
    }
    const displayPatientQue =()=>{
        getAppointmentsStats(doc_ID).then(result => {
            console.log("appointment patient stats is ",result[0].current_patient);
            if(result[0])
            {
                if(result[0].next_patient)
                setNextPatient(result[0].next_patient);
            }
            if(result[0])
            {
                if(result[0].current_patient)
                setCurrentPatient(result[0].current_patient)
            }
        });
    }
    
    const mydate = moment(date);
    const newdate = mydate.format('YYYY-MM-DD');
    console.log("new date is",newdate,"Appointment id ",pat_ID,"location id ",loc_ID);

    //Get All appointments by date
    const getAppointments = (dateValue,selectedValue) => {
        const mydate = moment(dateValue);
        const newdate = mydate.format('YYYY-MM-DD');
        console.log("new date is",newdate,"Appointment id ",pat_ID,"location id ",loc_ID);
        appointmentsByDateAPI(doc_ID,selectedValue,pat_ID,newdate)
        .then(result => {
            console.log("Appointment api",result);
            setData(result);
        });
    }

    const refreshCallBack=()=>{
        // console.log("Call back");
        appointmentsByDateAPI(doc_ID,loc_ID,pat_ID,newdate)
        .then(result => {
            console.log("Appointment api",result);
            setData(result);
        });
    }

    //Patient info
    const getPatientInfo = () => {
        patientInfoAPI(1)
        .then(result => {
            console.log("patient info api",result);
        });
    }

    //Appointment details
    const getAppointmentDetail = () => {
        appointmentDetailAPI(1)
        .then(result => {
            console.log("Appointment history api",result);
        });
    }

    const handleAppointmentItem = (item) =>{
        console.log("appointmentclicked",item.patient.patient_id)
        appointmentDetailAPI(item.patient.patient_id)
        .then(result => {
            console.log("patient info api",result);
            setClickedItem(result[0]);
        });
        
    }

    const callBack = (status, appointment_id) => {
        console.log("Call back from list item: ", status, "Appointment ID: ", appointment_id);
        if(status === "inprogress" || status === "upcoming"){
            props.callback(status,appointment_id);
        }
        getAppointments(date,selectValue);
    }

    const renderItem = () => {
        return (
        <div>
            {data.map((item,i)=>( <AppointmentsList key={i} className={"appointment-item"} 
            pat_ID={pat_ID} loc_ID={loc_ID} id={doc_ID} itemData={item} 
            onClick={()=>handleAppointmentItem(item)} callback={callBack}  />))}
        </div>
        )
    }

    useEffect(() => {
        locationsAPI(doc_ID).then(result => {
            console.log("location api in calender results",result);
            setLocationData(result);
        });
        getAppointmentsQueue(doc_ID).then(result => {
                console.log("appointment Queue is ",result);
            });

        getAppointmentsStats(doc_ID).then(result => {
            console.log("appointment patient stats is ",result[0].current_patient);
            if(result[0])
            {
                if(result[0].next_patient)
                setNextPatient(result[0].next_patient);
            }
            if(result[0])
            {
                if(result[0].current_patient)
                setCurrentPatient(result[0].current_patient)
            }
        });
            // setSelectedValue(data.appointment_location.appointment_location_of_doctor);
            // collectDisabledDays(data.appointment_location.days);
        // }).then(() => getAppointments(date,selectValue)
        // );
    },[]);


    const handleChange1 = (e) =>{
        setSelectedValue(e.target.value);
        getAppointments(date,e.target.value);
      }

    const renderItems = () => {
        console.log("locationData is ", locationData);
        return (
        locationData.map((item,i)=>(   
            <option value={item.doctors_hospital_location_id} days={item.days}>{item.location}</option>
        ))
        )
    }   

    return(
        <Container fluid>
            <Row>
                <Col lg={5}>
                    <div>
                        <Container style={{margin:15}}>
                            <Row style={{display:"flex", flexDirection:"row"}}>
                                <div style={{marginRight:10}}> <label className='TitleLabel mtt-2'>Select Location : </label> </div>   
                                <div className='locationSelection'> 
                                <select value={selectValue} 
                                onChange={handleChange1}>
                                    <option value={0} >{"All"}</option>
                                    {renderItems()}
                                    </select>
                            </div>
                            </Row>
                        </Container>
                    </div>
                    <div style={styles.label}>
                        <label className='TitleLabel mtt-2'>Date</label>
                        <Calender
                            onChange={onChange} 
                            value={date}
                            tileClassName={({ date, view }) => {
                             if(mark.find(x=>x===moment(date).format("DD-MM-YYYY"))){
                            return  'EventHighlight'
                             }
                                }}
                            />
                    </div>
                    <div style={styles.label}>
                        <label className='TitleLabel mtt-2'>Timeline Que</label>
                    </div>
                    <Divider/>
                    <div className='QueList'>
                        {renderItem()}
                    </div>
                </Col>
                <Col lg={7}>

                    {!!clickedItem &&
                        <div>
                            <PatientProfile pat_ID={pat_ID} loc_ID={loc_ID} id={doc_ID} itemData={clickedItem} />
                        </div>
                    }
                    <div>
               <div>
             <br/>
                   <h6 className='AppointmentDate'> <b> Today:</b>  <label> 20-January-2020 </label></h6>
               </div>
               <br/>
               <br/>
                    <div className='StatsDiv'>
                      <Row>
                          <Col lg={5}>
                          <StatusChart/>
                          </Col>

                          <Col lg={7}>
                            <Row>
                                <Col lg={2}></Col>
                                <Col lg={8} className='AppointmentTypes'>   
                                    <AppointmentType/>
                                </Col>
                                <Col lg={2}></Col>
                            </Row>
                            <Row>
                                <Col lg={3}></Col>
                                <Col lg={6} className='AppointmentStatus'>
                                <AppointmentStatus />
                                </Col>
                                <Col lg={3}></Col>
                            </Row>
                          </Col>
                      </Row>
                    </div>
                    <div className='ProgressDiv'>
                        <div>
                            <label className='StatsTitle'>Today's Progress</label>
                                <Row className='m-0'>
                                    <Col lg={6} >
                                        {console.log("next data is ", nextPatient)}
                                        <PatientsProgress
                                            classStatus={'CurrentCard'}
                                            appointment_id={currentPatient.appointment_id}
                                            patient_id={currentPatient.patient_id}
                                            status={'Current Patient'}  
                                            patient_image={currentPatient.patient_info.image}
                                            patient_name={currentPatient.patient_info.name}
                                            dob={currentPatient.patient_info.dob}
                                            gender={currentPatient.patient_info.gender}
                                            date_time={currentPatient.date_time}
                                            />
                                    </Col>

                                    <Col lg={6}>
                                        <PatientsProgress 
                                            classStatus={'NextCard'}
                                            appointment_id={nextPatient.appointment_id}
                                            patient_id={nextPatient.patient_id}
                                            status={'Next Patient'}
                                            patient_image={nextPatient.patient_info.image}
                                            patient_name={nextPatient.patient_info.name}
                                            dob={nextPatient.patient_info.dob}
                                            gender={nextPatient.patient_info.gender}
                                            date_time={nextPatient.date_time}
                                            />
                                    </Col>
                                </Row>

                                <div className='ProgressBar'>
                                    <LinearProgress variant="determinate" value={100} />
                                    <h6> Total Appointments: <label> 20 </label></h6>
                                </div>
                        </div>
                    </div>
                   
                </div>
                </Col>
            </Row>
        </Container>
    )
}
export default CalenderSection

const styles = {
    label: {fontSize: 14, color: "grey", textAlign: "Left", marginLeft:"20px", marginTop:"20px"},

}
CalenderSection.defaultProps = {
    data: [
    ],
    currentPatient: {
        appointment_id: 213,
        doctor_id: 2,
        date_time: "2021-01-24T12:45:00+00:00",
        patient_id: 8,
        patient_info: {
        patient_id: 8,
        name: "khan afser",
        dob: "1970-05-06",
        gender: "male",
        image: "patient-8.jpg"
        },
      },
      nextPatient: {
        appointment_id: 213,
        doctor_id: 2,
        date_time: "2021-01-24T12:45:00+00:00",
        patient_id: 8,
        patient_info: {
        patient_id: 8,
        name: "khan afser",
        dob: "1970-05-06",
        gender: "male",
        image: "patient-8.jpg"
        },
      }
}
import React, { useState } from "react"
import moment from 'moment'
import {addVitalAPI} from '../DB/API'
import { Button, Col, Row , Card, Container, Modal} from "react-bootstrap"

const VitalTile = (props) => {
    const data = props.itemData;
    const pat_Data = props.info;
    console.log("Patient info ",pat_Data);
    const [showRescheduleModal, setRescheduleModal] = useState(false);
    const [vitalValue,setVitalValue] = useState("");



    const addVitals = (patient_id) =>{
        addVitalAPI(patient_id,data.vital_id,"POST",vitalValue).then(result => {
            console.log("Success", result);
        });
    }

    const handleModalClose = () => {
        setRescheduleModal(false);
    }
    const handleAddVital = (patient_id) => {
        return (
        <Modal
                show={showRescheduleModal} 
                onHide={handleModalClose}  
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                <Modal.Title style={{color: "#e0004d"}}>Vital {data.vital_info.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col style={styles.about_row}>
                            <label style={styles.label}>Add {data.vital_info.name}:</label>
                            <div style={styles.display_value}>
                            <input style={styles.input}
                                placeholder={`Enter ${data.vital_info.name} value ...`}
                                type="text"
                                value={vitalValue}
                                noValidate
                                onChange={e => {setVitalValue(e.target.value)}}
                                />
                        </div>
                            <Button style={{marginLeft:10}} onClick={()=>{addVitals(patient_id); props.onCallBAck(); handleModalClose();}}>ADD</Button>
                        </Col>
                    </Row>
                    </Modal.Body>
            </Modal>
            
        )
    }


    return (
    <div style={props.selected ? styles.vital_container_selected:styles.vital_container}
        onClick={() =>props.onTileSelect(data.vital_id)}>
        <div style={{textAlign: "left", padding: 10}}>
            <div style={{fontWeight: "bold", opacity: 0.6, paddingTop: 5}}>{data.vital_info.name}</div>
            <div style={{color: "#e0004d", paddingTop: 10, fontSize: 14, fontWeight: "bold"}}>Current Value</div>
            <div style={{display: "flex", flexDirection: "row", alignItems: "baseline", opacity: 0.8}}>
                <div style={{fontSize:36}}>{!!data.vital_current ? data.vital_current.current_value : "00"}</div>
                <div style={{paddingLeft: 5, fontWeight: "bold"}}>{data.vital_info.unit}</div>
            </div>
            <div style={{opacity: 0.6, fontSize: 12, fontWeight: "bold", paddingTop: 10}}>{!!data.vital_current ? moment(data.vital_current.date_time).format('ll'):""}</div>
              
        </div>
        <div style={{fontWeight: "bolder", fontSize: 30, color: "#e0004d", textAlign: "right",bottom:0,right:5, position:"absolute"}}>
            <span style={{fontWeight: "bolder", fontSize: 30, color: "#e0004d", textAlign: "right",cursor:"pointer"}} 
                onClick={(e) => {setRescheduleModal(true); e.stopPropagation();}}>+</span> 
        </div> 
        {handleAddVital(pat_Data.patient_id)}
    </div>
    )
}
//03:00PM, 4 aug, 2020
export default VitalTile

VitalTile.defaultProps = {
    vitalData: {
        title: "Title"
    }
}

const styles = {
    label: {fontSize: 14, color: "#e0004d", textAlign: "Left", marginRight:10},
    display_value: {textAlign: "left",display:"flex",flex:1},
    about_row: {alignItems: "center", padding: 8, minHeight: 40, margin: 0,display:"flex", flex:1, flexDirection:"row"},
    text_area: {
        fontSize: 14,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: "5px",
        outline: "none",
        border: "1px solid #cfcfcf",
        boxShadow: "0px 5px 25px whitesmoke",
        backgroundColor: "whitesmoke",
        width: "100%"
    },
    input: {fontSize:14, padding: 8,borderRadius: "5px"},
    vital_container: {backgroundColor:"white",width: 200, height: 200, margin: 15, borderRadius: 10, borderWidth: 1, borderStyle: "solid", borderColor: "#e0e0e0",position:"relative"},
    vital_container_selected: {backgroundColor:"#f0f0f0",width: 200, height: 200, margin: 15, borderRadius: 10, borderWidth: 1.5, borderStyle: "solid", borderColor: "#e0e0e0",position:"relative"},
       
}
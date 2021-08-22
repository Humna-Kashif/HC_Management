import React, { useEffect, useState } from "react"
import { Col, Container, Row,Button } from "react-bootstrap";
import VitalTile from "./VitalTile";
import VitalsList from './VitalsList'
import VitalsChart from './VitalsChart'
import {getVitalsAPI,addVitalAPI} from '../DB/API'

//{!!data.vital_current && data.vital_current.current_value}

const VitalTabPatient = (props) => {
    const data = props.vitals;
    const pat_Data=props.info;
    console.log("patient info data...... ",data);
    const [vitalValue,setVitalValue] = useState([]);
    const [normalValue,setNormalValue] = useState("");
    const [vitalData,setVitalData] = useState([]);
    const [selectedVital, setSelectedVital] = useState(0);

    const handleCallBack = () => {
        props.backCall();
        return(
            data.map((item)=>(   
                //<VitalTile itemData={item} onTileSelect={handleVitalTile}></VitalTile>
                <VitalTile itemData={item}></VitalTile>
            ))
        )
    }


    const getAllVitalsValues = (vital_id) =>{
        //console.log("patient id ",patient_id," vital id ",vital_id);
        setSelectedVital(vital_id);
        getVitalsAPI(pat_Data.patient_id,vital_id,"GET").then(result => {
            console.log("Vitals Values results",result);
            if(result.length !== 0){
                setVitalData(result);
                setVitalValue(result[0].vital_data);
                setNormalValue(result[0].vital_info.normal_range);
            }
            // setVitalChart(renderVitalChart());
        });
    }

    // useEffect(() => {
    //     console.log("vitalsssss ",props.vitals)
    //     // {!!props.vitals && getAllVitalsValues(props.vitals[0].vital_current.patient_id,props.vitals[0].vital_current.vital_id)}
    // },props.vitals)

    const renderVitalList = () =>{
        console.log("vitalsssss ",props.vitals)
        return(
            data.map((item)=>(   
                //<VitalTile itemData={item} onTileSelect={handleVitalTile}></VitalTile>
                <VitalTile itemData={item} info={pat_Data}  onCallBAck={handleCallBack} onTileSelect={getAllVitalsValues} selected={item.vital_id===selectedVital}></VitalTile>
            ))
        )
    }

    // const renderVitalChart = () =>{
    //     return(
    //         <VitalsChart data={vitalData} onTileSelect={getAllVitalsValues} />  
    //             //<VitalTile itemData={item} onTileSelect={handleVitalTile}></VitalTile>
    //             // <VitalTile itemData={item} info={pat_Data}  onCallBAck={handleCallBack} ></VitalTile>
    //     )
    // }

    const renderVitals = () =>{
        return(
            <div>
            <Row style={{margin: 10,display:"flex",flexDirection:"row",alignItems:"center"}}>
                <Col style={styles.label}><b>Current Values</b></Col>
                <Col style={styles.label}><b>Date</b></Col>
                <Col style={styles.label}><b>Normal Range</b></Col>
            </Row>
               {vitalValue.map((item)=>(   
                    //<VitalTile itemData={item} onTileSelect={handleVitalTile}></VitalTile>
                    <VitalsList itemData={item} range={normalValue} ></VitalsList>
                ))}
                
            </div>
        )
    }

  //  Chart Code

    // const renderVitalsChart = () =>{
    //     return(
    //         vitalValue.map((item)=>(   
    //             //<VitalTile itemData={item} onTileSelect={handleVitalTile}></VitalTile>
    //             <VitalsChart itemData={item} range={normalValue} ></VitalsChart>
    //         ))  
    //     )
    // }

    // const renderEditingItem = () => {
    //     return (
    //         <div>
    //             <Col style={styles.about_row}>
    //                 <label style={styles.label}>Add Vitals:</label>
    //                 <div style={styles.display_value}>
    //                     <input style={styles.input}
    //                         placeholder="Enter vital value ..."
    //                         type="text"
    //                         value={vitalValue}
    //                         noValidate
    //                         onChange={e => {setVitalValue(e.target.value)}}
    //                         />
    //                 </div>
    //                 <Button style={{marginLeft:10}}>ADD</Button>
    //             </Col>
    //         </div>
    //     )
    // }

    

     

    return (
      <Container fluid style={{paddingTop: 10}}> 
          {/* list */}
          <Row>
            <Col lg={6}>
                {/* You need to display a list here */}
                <Row>
                    <Col style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                        {renderVitalList()}
                    </Col>
                </Row>
            </Col>
            <Col lg={6}>
                {renderVitals()}
                <VitalsChart data={vitalData} key={vitalValue.length}/>
            </Col>
          </Row>
      </Container>
    )
}

export default VitalTabPatient

VitalTabPatient.defaultProps = {
    vitals:[
        {
            vital_current:{        
                patient_id: 0,
                vital_id: 1
            }
        }
    ]
}

const styles = {
    label: {fontSize: 18, color: "#e0004d", margin:10,textAlign:"center"},
    display_value: {textAlign: "left"},
    about_row: {alignItems: "center", padding: 3, minHeight: 40, margin: 0,display:"flex"},
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
    input: {fontSize:14, padding: 8,borderRadius: "5px"}
}


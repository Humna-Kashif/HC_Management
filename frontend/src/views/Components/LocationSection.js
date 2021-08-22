import React, { useEffect, useState} from 'react'
import { Button, Col, Row, ButtonGroup } from "react-bootstrap"
import { FaEdit } from "react-icons/fa";
import LocationItem from "./LocationItem";
import TimePicker from 'react-time-picker';
import AsyncSelect from 'react-select/async';
import {locationsAPI,addLocationAPI} from "../DB/API"

const LocationSection = (props) => {
    const doc_Id = props.id;
    const [data, setData] = useState([]);
    const [editing, setEditing] = useState(false);
    const [locationValue, setLocationValue] = useState ('');
    const [selectedValue, setSelectedValue] = useState(-1);
    const [searchLocList, setSearchLocList]=useState([]);
    const [startTimePick, setstartTimePick] = useState("00:00");
    const [endTimePick, setendTimePick] = useState("1:00");
    const [inputValue, setValue] = useState('null');
    const [feeValue,setFeeValue] = useState('00');

    const handleLocationEdit = () => {
        setEditing(true);
    }

    const handleSaveBtn = () => {
        setEditing(false);
    }

    const handleCancelBtn = () => {
        setEditing(false);
    }

    const renderItem = () => {
        return (
        data.map((item,i)=>( <LocationItem  callback={refresh} id={doc_Id} key={i} itemData={item} isEnableEdit={editing}/>))
        )
    }

    const refresh=()=>{
        locationsAPI(doc_Id).then(result => {
            setData([]);
            setData(result);
        });
    }

    const [oneTime,setOneTime]=useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            oneTime && 
            locationsAPI(doc_Id).then(result => {
                //console.log("new location api",result);
                setData(result);
            });
            setOneTime(false);
          }, 200);
        return () => clearTimeout(timer);
    });

    const [daysArray, setDaysArray] = useState( [
        {day: "mon", selected: false},
        {day: "tue", selected: false},
        {day: "wed", selected: false},
        {day: "thu", selected: false},
        {day: "fri", selected: false},
        {day: "sat", selected: false},
        {day: "sun", selected: false}
    ]);

    const [daysData, setDaysData] = useState("");

    const dayBtnClicked = (item,i) => {
        let temp = daysArray;
        temp[i].selected = !item.selected;
        console.log("Temp: " , temp, "days: ", daysArray);
        setDaysArray(temp);
        formatDaysString();
    }

    const selectAllDays = () => {
        let tempArray = [];
        daysArray.map((item)=>{
            let tempItem = item;
            tempItem.selected = true;
            return tempArray.push(tempItem);
        });
        setDaysArray(tempArray);
        formatDaysString();
    }

    const formatDaysString = () =>{
        let stringTemp = [];
        daysArray.map((item) => {
            if(item.selected)
                stringTemp.push(item)
                return true;
        });
        setDaysData(stringTemp.map((item)=>(
            item.selected && item.day
            )).join("-"));
    }

    const renderDaysBtns = () => {
        return( 
        <ButtonGroup toggle={true} style={{display: "flex", flex: 1}}>
            {console.log("rendered with : ", daysArray )}
            {daysArray.map((item,i)=>(
            <Button key={i}
                variant={item.selected ? "primary" : "outline-primary"} 
                onClick={() => dayBtnClicked(item,i)}>
                    {item.day.toUpperCase()}
                </Button>
            ))  
            }
            <Button
                variant="outline-primary"
                onClick={() => selectAllDays()}
            >
                All
            </Button>
        </ButtonGroup> )
    }

    const formattedSearchList = () => {
        let formattedList = [];
        !!(searchLocList) && (
            searchLocList.map((item)=>{
                console.log("Loop");
                return formattedList.push({
                    value: item.hospital_id, label: item.location
                });
            })
        );
        console.log("Formatted list: ", formattedList);
        return formattedList;
    }

    const loadOptions = (inputValue, callback) => {
        setTimeout(() => {
          callback(formattedSearchList());
        }, 1000);
      };

    const handleInputChange = value => {
        console.log("selected values is ",value)
        const inValue = value;
        if(inValue !== ''){
            fetch("https://app.aibers.health/doctors/"+doc_Id+"/profile/location?character="+inValue)
            .then((response) => response.json())
            .then((data) => {
                    console.log('This is search location data:', data);
                    setSearchLocList(data);
                }) 
            .catch((error) => console.error(error))
            .finally(() =>loadOptions); 
        }
      setValue(inValue);
    };
    const handleChange = value => {     
      setSelectedValue(value);
    }

    // const [startISO,setStartISO] = useState();
    // const [EndISO,setEndISO] = useState();

    // const settingTimeISO = () => {
    //     let datetest = new Date();
    //     let timmee = datetest.getTime();
    //     let dateFromUI = "12-10-2020";
    //     let myTimeStart = startTimePick;
    //     let myTimeEnd = endTimePick;
    //     let dateParts = dateFromUI.split("-");
    //     let timeParts = myTimeStart.split(":");
    //     let timePartsEnd = myTimeEnd.split(":");

    //     let dateStart = new Date(dateParts[2], dateParts[0]-1, dateParts[1], timeParts[0], timeParts[1]);
    //     let dateEnd = new Date(dateParts[2], dateParts[0]-1, dateParts[1], timePartsEnd[0], timePartsEnd[1]);

    //     let dateISOStart = dateStart.toISOString();
    //     let dateISOEnd = dateEnd.toISOString();
    //     console.log("Time checking: ", timmee.toString(),"StartValue", startTimePick, "StartISO: ", dateISOStart,"EndISO: ", dateISOEnd);
        
    //     setStartISO(dateISOStart);
    //     setEndISO(dateISOEnd);
    //     console.log("ISO: ", startISO, EndISO);
    // }

    // Adding Location 

    const setTempLocation = () => {
        console.log("submit: ", daysData,startTimePick,endTimePick, feeValue, "value: ", selectedValue);
        if(selectedValue != -1){
        addLocationAPI(doc_Id,"POSt",selectedValue.label,daysData,feeValue,startTimePick,endTimePick).then(result => {
            console.log("Success",result);
            refresh();
        });
        setFeeValue('00');
        setstartTimePick('00:00');
        setendTimePick('1:00');
        }
        else
        alert("Please select Location firts");
    }
    // const handleAddLocation = () =>{
    //     }

    return (
        <div style={{paddingBottom:20}}>
            <Row style={{margin: 0}}>
                <Col lg={{offset: 1, span:7}} xs={4}>
                    <h4>Location</h4>
                </Col>
                {
                    editing ? (
                <Col lg={3} xs={8} style={{alignItems:"center", display: "flex", justifyContent: "flex-end"}}>
                    <Button size="sm" variant="primary" onClick={handleSaveBtn} style={{marginRight:5, width: 80}}>
                        Done
                    </Button>
                </Col>
                    ) : (
                <Col lg={3} xs={8} style={{alignItems:"center", display: "flex", justifyContent: "flex-end"}} onClick={handleLocationEdit}>
                    <span style={{color: "#e0004d", paddingRight: 10}}>Edit</span>
                    <FaEdit style={{ cursor:"pointer", color: "#e0004d"}}></FaEdit>
                </Col>
                    )
                }
            </Row>
            {editing && (
                <Row style={{margin: 0 , marginTop: 20, marginBottom: 20}}>
                <Col lg={{span: 10, offset: 1}}>
                <div style={{display:"flex", flex:"1", flexDirection:"column"}}>
                    <Row>
                        <Col>
                            <div className="modal_label">Add Location</div>
                                <div>
                                    <AsyncSelect
                                        placeholder={data.location}
                                        // cacheOptions
                                        defaultOptions
                                        value={selectedValue}
                                        loadOptions={loadOptions}
                                        onInputChange={handleInputChange}
                                        onChange={handleChange}
                                    />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <label>Fee :</label>
                            <div style={{display:"flex", flexDirection:"row",width:"100px"}}> 
                                    <input
                                    style={styles.input}
                                    placeholder="Fee"
                                    type="text"
                                    value={feeValue}
                                    noValidate
                                    onChange={e => setFeeValue(e.target.value)}
                                    /> 
                            </div>
                        </Col>
                    </Row>
                    <Row style={{marginTop:"10px"}}>
                        <Col>
                            <label>Start time :</label>
                            <TimePicker
                            onChange={(value) => {
                                setstartTimePick(value);
                            }}
                            value={startTimePick}
                            clockIcon={null}
                            clearIcon={null}
                            />
                        </Col>
                        <Col>
                            <label>End time :</label><TimePicker
                            onChange={(value) => setendTimePick(value)}
                            value={endTimePick}
                            clockIcon={null}
                            clearIcon={null}
                            />
                        </Col>
                        </Row>
                        <Row>
                            <Col style={{display:"flex", flex:"1", flexDirection:"column"}}>
                                <label>Select Days :</label>
                                {renderDaysBtns()}
                                {daysData}
                            </Col>
                        </Row>
                        <div style={{justifyContent: "flex-end", display: "flex"}}>
                        <Button variant="primary" onClick={() => {
                           // settingTimeISO();
                            setTempLocation(true);
                            }}>
                            Add Location
                        </Button>
                        </div>
                    </div>
                </Col>
            </Row>
            )}
            {renderItem()}
        </div>
    )
}

export default LocationSection;

LocationSection.defaultProps = {
        locationData : [{
        doctor_Location_id: "1",
        location: "cmh",
        days: "mon-fri",
        fees: "500",
        start_time: "13:00",
        end_time: "19:00",

    }
    ]
}

const styles = {
    input: {fontSize:14, padding: 8,borderRadius: "5px"}
}
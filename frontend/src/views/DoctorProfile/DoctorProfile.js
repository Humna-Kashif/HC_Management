import React, { useEffect, useState} from 'react'
import { Button, Container, Modal, Row, ButtonGroup  } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { FaEdit } from "react-icons/fa";
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from "react-router-dom";
// import Logo from './farid.jpg';
import Avatar from '@material-ui/core/Avatar';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
// import AddCircleIcon from '@material-ui/icons/AddCircle';
// import Location from './Location'
import './DoctorProfile.css'
import TimePicker from 'react-time-picker';
import AsyncSelect from 'react-select/async';

const baseURL = process.env.NODE_ENV === "production" ? "/api/getDoctorAllInfoById" : "https://app.aibers.health/api/getDoctorAllInfoById";

const DoctorProfile=(props)=>{
     // Constans dacleration
    const [searchLocList, setSearchLocList]=useState([]);
    const [deleteOptionPos, setDeleteOptionPos]=useState(-1);
    const [showDeleteOptn,setDeleteOptn]= useState(false);
    const [editOptionPos, setEditOptionPos]=useState(-1);
    // const [editOptionPoss, setEditOptionPoss]=useState(-2);
    const [showEditOptn,setEditOptn]= useState(false);
    const [showEditNameOptn,setEditNameOptn]= useState(false);
    const [showEditSpecOptn,setEditSpecOptn]= useState(false);
    const [showEditOptns,setEditOptns]= useState(false);
    const [inputValue, setValue] = useState('null');
    const [selectedValue, setSelectedValue] = useState(-1);
    // const [dayValue, setdayValue] = useState ('mon-wed');
    const [facilityValue, setFacilityValue] = useState ('');
    const [qualificationValue, setqualificationValue] = useState ('');
    const [aboutValue, setaboutValue] = useState ('');
    const [nameValue, setnameValue] = useState ('');
    const [specializationValue, setspecializationValue] = useState ('');
    const [startTimePick, setstartTimePick] = useState("00:00");
    const [endTimePick, setendTimePick] = useState("1:00");
    const [inputEditingName, setInputName]=useState('');
    const [inputEditingSpecialization, setInputSpecialization]=useState('');
    const [showLocModal, setShowLocModal] = useState(false);
    const handleLocModalClose = () => setShowLocModal(false);
    const handleLocModalShow = () => setShowLocModal(true);
    const [showFacModal, setShowFacModal] = useState(false);
    const handleFacModalClose = () => setShowFacModal(false);
    const handleFacModalShow = () => setShowFacModal(true);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const handleAboutModalClose = () => setShowAboutModal(false);
    const handleAboutModalShow = () => setShowAboutModal(true);
    const [showBioModal, setShowBioModal] = useState(false);
    const handleBioModalClose = () => setShowBioModal(false);
    const handleBioModalShow = () => setShowBioModal(true);
    const [showQuaModal, setShowQuaModal] = useState(false);
    const handleQuaModalShow = () => setShowQuaModal(true);
    const handleQuaModalClose = () => {
        setShowQuaModal(false);
        setDeleteOptn(false);
        setDeleteOptionPos(-1);
        setEditOptn(false);
        setEditOptionPos(-1);
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
        const inValue = value;
        console.log(inputValue);
        if(inValue !== ''){
            fetch("https://app.aibers.health/api/searchLocation/"+inValue)
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
    const location = useLocation();
    const [lists, setNames] = useState({
        name: "Zarnain",
        dob: "13/12/1998",
        gender: "Female",
        specilization: "Dentist",
        about:"",
        image: "uploads/doctorProfilePicture/doc1.jpeg",
        location: [
        {
        start_time: "",
        end_time: "",
        days: "",
        location: ""
        }],
        facilities: [],
        qualification: []
        }  
        );

    const [oneTime,setOneTime]=useState(true);

    const getNamesOfDoctor = async () => {
        try {
            const response = await fetch(baseURL+"/"+location.state.userId);
            const jsonData = await response.json();
            console.log("Original JSON: ",jsonData)
            setNames(jsonData[0]);
        } catch (err) {
            console.error(err.message);
        }
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            oneTime && getNamesOfDoctor();
            setOneTime(false);
            settingTimeISO();
          }, 1000);
        return () => clearTimeout(timer);
    })


    //   const renderlocItem=()=>{ 
    //    return !!(lists.location) ?
    //    (lists.location.map((item, i) => (
    //     <Location key={i} locData={item}/>
    //     ))) : (<p>Add your working location for your profile</p>)
    //   };

   

      const renderlocItem=(editing)=>{ 
        return !!(lists.location) ?
        ( lists.location.map((item, i) => (
            (item.hospital_location_status) &&
            <div key={i} style={{display:"flex", flexDirection:"row"}}>
            {!editing ? (<div style={{display:"flex", flex:"1"}}>
                    <dl>
                        <dd>Location: {item.location}</dd>
                        <dd>Timings: {item.start_time} to {item.end_time} ({item.days})</dd>
                    </dl>
                </div>) :
                (<div style={{display:"flex", flex:"1", flexDirection:"column"}}>
                       { (editOptionPos === item.doctors_hospital_location_id) ?
                        (<div style={{display:"flex", flex:"1", flexDirection:"column"}}>
                            <Row>
                                <Col>
                                    <div className="modal_label">Edit Location</div>
                                        <div>
                                            <AsyncSelect
                                                placeholder={item.location}
                                                // cacheOptions
                                                // defaultOptions
                                                value={selectedValue}
                                                loadOptions={loadOptions}
                                                onInputChange={handleInputChange}
                                                onChange={handleChange}
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
                                    value={item.start_time}
                                    clockIcon={null}
                                    clearIcon={null}
                                    />
                                </Col>
                                <Col>
                                    <label>End time :</label><TimePicker
                                    onChange={(value) => setendTimePick(value)}
                                    value={item.end_time}
                                    clockIcon={null}
                                    clearIcon={null}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{display:"flex", flex:"1", flexDirection:"column"}}>
                                    <label>Select Days :</label>
                                    <div><label>Previous Select Days :</label>
                                    {item.days}</div>
                                    {renderDaysBtns()}
                                    {daysData}
                                </Col>
                            </Row>
                        </div>):
                        (<div style={{display:"flex", flex:"1"}}>
                        <dl>
                            <dd>Location: {item.location}</dd>
                            <dd>Timings: {item.start_time} to {item.end_time} ({item.days})</dd>
                        </dl>
                        </div>)
                        }
                    </div>)}
                {editing && (
                    <div style={{display:"flex", flexDirection:"row"}}>
                        {
                        !showDeleteOptn && !showEditOptn &&
                        !(deleteOptionPos === item.doctors_hospital_location_id) && 
                        (<div style={{display:"flex", flexDirection:"row"}}>
                            <div style={{color:"#e0004d"}} onClick={()=>{
                            setEditOptionPos(item.doctors_hospital_location_id);
                            setEditOptn(true);
                            // setInputLocation(item.location);
                            }}>
                            <FaEdit></FaEdit>
                            </div>
                            <div style={{color:"#e0004d"}} onClick={()=>{
                                setDeleteOptionPos(item.doctors_hospital_location_id);
                                setDeleteOptn(true);
                                }}>                    
                                <DeleteIcon></DeleteIcon>
                            </div> 
                        </div>
                        )}

                        {/* Handle editing butttons */}

                        {
                        showEditOptn && !showDeleteOptn &&
                        (editOptionPos === item.doctors_hospital_location_id) &&
                        (<div style={{display:"flex", flexDirection:"row"}}>
                            <div style={{color:"#e0004d"}} onClick={()=>{setEditOptn(false);
                                setEditOptionPos(-1);}}>                    
                                <CloseIcon></CloseIcon>
                            </div> 
                            <div style={{color:"#e0004d"}} onClick={()=>{
                            editLocation(item.doctors_hospital_location_id);
                            setEditOptn(false);
                            setEditOptionPos(-1);
                            }}>                    
                                <DoneIcon></DoneIcon>
                            </div> 
                        </div>)}
    
                        {/* handle delete buttons */}
    
                        {
                        showDeleteOptn && !showEditOptn &&
                        (deleteOptionPos === item.doctors_hospital_location_id) &&
                        (<div style={{display:"flex", flexDirection:"row"}}>
                            <div style={{color:"#e0004d"}} onClick={()=>{setDeleteOptn(false);
                                setDeleteOptionPos(-1);}}>                    
                                <CloseIcon></CloseIcon>
                            </div> 
                            <div style={{color:"#e0004d"}} onClick={()=>{deleteLocation(item.doctors_hospital_location_id);
                            setDeleteOptn(false);
                            setDeleteOptionPos(-1);
                            }}>                    
                                <DoneIcon></DoneIcon>
                            </div> 
                        </div>)}
                    </div>
                )}
        </div>
         ))) : (<p>Add your working location for your profile</p>)
       };
       
    const deleteLocation = (id) =>{
    console.log("delete id", id);
    fetch('https://app.aibers.health/api/disableLocationStatusByDoctorsHospitalLocationId/'+id, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .finally(
        setTimeout(() => {
        getNamesOfDoctor();
        }, 2000)
        );
    }
    const setTempLocation = () => {
    console.log("submit: ", daysData,startTimePick,endTimePick, "id: ", selectedValue.label);
    if( daysData !== "" && selectedValue !== -1)
    fetch('https://app.aibers.health/api/setHospitalLocation/'+location.state.userId, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            location: selectedValue.label,
           days: daysData,
           start_time: startTimePick,
           end_time: endTimePick
        })
        }).finally(
                setTimeout(() => {
                console.log("API Working");
                getNamesOfDoctor();
                }, 
            2000)  
        );
   }

   const editLocation = (id) => {
    console.log("id is : ", id);
    
    fetch('https://app.aibers.health/api/updateHospitalLocation/'+id, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            location: selectedValue.label,
           days: daysData,
           start_time: startTimePick,
           end_time: endTimePick
        })
        }).finally(
                setTimeout(() => {
                console.log("API Working");
                getNamesOfDoctor();
                }, 
            2000)  
        );
   }


    // Handle Qualification Portion

    const renderQualificationItem=(editing)=>{ 
    return !!(lists.qualification) ? 
    (lists.qualification.map((item, i) => (
        <div key={i} style={{display:"flex", flexDirection:"row"}}>
           {!editing ? (<div style={{display:"flex", flex:"1"}}>
                {item.qualification}
            </div>) :
            (
            <div style={{display:"flex", flex:"1"}}>
               { (editOptionPos === item.doctor_qualification_id) ?
                (<div style={{display:"flex", flex:"1"}}>
                <input
                    placeholder="Edit Qualification ..."
                    type="text"
                    value={inputEditingQualification}
                    noValidate
                    onChange={e => setInputQuailfication(e.target.value)}
                    /> 
                </div>):
                (<div style={{display:"flex", flex:"1"}}>
                {item.qualification}
                </div>)
                }
            </div>
            )
            }
            {editing && (
                <div style={{display:"flex", flexDirection:"row"}}>
                    {
                    !showDeleteOptn && !showEditOptn &&
                    !(deleteOptionPos === item.doctor_qualification_id) && 
                    (<div style={{display:"flex", flexDirection:"row"}}>
                        <div style={{color:"#e0004d"}} onClick={()=>{
                            setEditOptionPos(item.doctor_qualification_id);
                            setEditOptn(true);
                            setInputQuailfication(item.qualification);
                            }}>
                            <FaEdit></FaEdit>
                        </div>
                        <div style={{color:"#e0004d"}} onClick={()=>{
                            setDeleteOptionPos(item.doctor_qualification_id);
                            setDeleteOptn(true);
                            }}>                    
                            <DeleteIcon></DeleteIcon>
                        </div> 
                    </div>
                    )}
                    
                    {/* Handle editing butttons */}

                    {
                    showEditOptn && !showDeleteOptn &&
                    (editOptionPos === item.doctor_qualification_id) &&
                    (<div style={{display:"flex", flexDirection:"row"}}>
                        <div style={{color:"#e0004d"}} onClick={()=>{setEditOptn(false);
                            setEditOptionPos(-1);}}>                    
                            <CloseIcon></CloseIcon>
                        </div> 
                        <div style={{color:"#e0004d"}} onClick={()=>{editQualification(item.doctor_qualification_id);
                        setEditOptn(false);
                        setEditOptionPos(-1);
                        }}>                    
                            <DoneIcon></DoneIcon>
                        </div> 
                    </div>)}

                    {/* handle delete buttons */}

                    {
                    showDeleteOptn && !showEditOptn &&
                    (deleteOptionPos === item.doctor_qualification_id) &&
                    (<div style={{display:"flex", flexDirection:"row"}}>
                        <div style={{color:"#e0004d"}} onClick={()=>{setDeleteOptn(false);
                            setDeleteOptionPos(-1);}}>                    
                            <CloseIcon></CloseIcon>
                        </div> 
                        <div style={{color:"#e0004d"}} onClick={()=>{deleteQualification(item.doctor_qualification_id);
                        setDeleteOptn(false);
                        setDeleteOptionPos(-1);
                        }}>                    
                            <DoneIcon></DoneIcon>
                        </div> 
                    </div>)}
            </div>
            )}
    </div> 
        ))) : (<p>Add Your Qualification for your profile</p>)
    };
    const handleAddQualification = () =>{
    fetch('https://app.aibers.health/api/setDoctorQualificationById/'+location.state.userId, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            qualification: qualificationValue
        })
        }).finally(
            setqualificationValue(""),
            setTimeout(() => {
            getNamesOfDoctor();
            }, 1000)
            );
    }
    
    const [inputEditingQualification, setInputQuailfication]=useState('');
    const editQualification=(id)=>
    { 
        if(inputEditingQualification!=="")
        {
            fetch('https://app.aibers.health/api/updateQualificationByDoctorQualificationId/'+id, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({

                qualification: inputEditingQualification
            })
            }).finally(
                setqualificationValue(""),
                setTimeout(() => {
                getNamesOfDoctor();
                }, 1000)
            );
        }
    }
    const deleteQualification = (id) =>{
        console.log("delete id", id);
        fetch('https://app.aibers.health/api/deleteQualificationByDoctorQualificationId/'+id, {
        method: 'DELETE'
        })
        .finally(
            setTimeout(() => {
            getNamesOfDoctor();
            }, 1000)
            );
    }

    // Handle Facility Portion

    

    const renderFacilitiesItem=(editing)=>{ 
    return !!(lists.facilities) ? 
    (lists.facilities.map((item, i) => (
        <div key={i} style={{display:"flex", flexDirection:"row"}}>
           {!editing ? (<div style={{display:"flex", flex:"1"}}>
                {item.facility}
            </div>) :
            (
            <div style={{display:"flex", flex:"1"}}>
               { (editOptionPos === item.doctor_facility_id) ?
                (<div style={{display:"flex", flex:"1"}}>
                <input
                    placeholder="Edit Facility ..."
                    type="text"
                    value={inputEditingFacility}
                    noValidate
                    onChange={e => setInputFacility(e.target.value)}
                    /> 
                </div>):
                (<div style={{display:"flex", flex:"1"}}>
                {item.facility}
                </div>)
                }
            </div>)}
            {editing && (
                <div style={{display:"flex", flexDirection:"row"}}>
                    {
                    !showDeleteOptn && !showEditOptn &&
                    !(deleteOptionPos === item.doctor_facility_id) && 
                    (<div style={{display:"flex", flexDirection:"row"}}>
                        <div style={{color:"#e0004d"}} onClick={()=>{
                            setEditOptionPos(item.doctor_facility_id);
                            setEditOptn(true);
                            setInputFacility(item.facility);
                            }}>
                            <FaEdit></FaEdit>
                        </div>
                        <div style={{color:"#e0004d"}} onClick={()=>{
                            setDeleteOptionPos(item.doctor_facility_id);
                            setDeleteOptn(true);
                            }}>                    
                            <DeleteIcon></DeleteIcon>
                        </div> 
                    </div>
                    )}
                    
                    {/* Handle editing butttons */}

                    {
                    showEditOptn && !showDeleteOptn &&
                    (editOptionPos === item.doctor_facility_id) &&
                    (<div style={{display:"flex", flexDirection:"row"}}>
                        <div style={{color:"#e0004d"}} onClick={()=>{setEditOptn(false);
                            setEditOptionPos(-1);}}>                    
                            <CloseIcon></CloseIcon>
                        </div> 
                        <div style={{color:"#e0004d"}} onClick={()=>{editFacility(item.doctor_facility_id);
                        setEditOptn(false);
                        setEditOptionPos(-1);
                        }}>                    
                            <DoneIcon></DoneIcon>
                        </div> 
                    </div>)}

                    {/* handle delete buttons */}

                    {
                    showDeleteOptn && !showEditOptn &&
                    (deleteOptionPos === item.doctor_facility_id) &&
                    (<div style={{display:"flex", flexDirection:"row"}}>
                        <div style={{color:"#e0004d"}} onClick={()=>{setDeleteOptn(false);
                            setDeleteOptionPos(-1);}}>                    
                            <CloseIcon></CloseIcon>
                        </div> 
                        <div style={{color:"#e0004d"}} onClick={()=>{deleteFacility(item.doctor_facility_id);
                        setDeleteOptn(false);
                        setDeleteOptionPos(-1);
                        }}>                    
                            <DoneIcon></DoneIcon>
                        </div> 
                    </div>)}
            </div>
            )}
    </div> 
        ))) : (<p>Add facility you provide for your profile</p>)
    };
    const handleAddFacility = () =>{
        fetch('https://app.aibers.health/api/setDoctorFacilitiesById/'+location.state.userId, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                facility: facilityValue
            })
            }).finally(
                setFacilityValue(""),
                setTimeout(() => {
                getNamesOfDoctor();
                }, 1000)
            );
        }
    const [inputEditingFacility, setInputFacility]=useState('');
    const editFacility=(id)=>
    { 
        if(inputEditingFacility!=="")
        {
            fetch('https://app.aibers.health/api/updateFacilityByDoctorFacilityId/'+id, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({

                facility: inputEditingFacility
            })
            }).finally(
                setqualificationValue(""),
                setTimeout(() => {
                getNamesOfDoctor();
                }, 1000)
            );
        }
    }
    const deleteFacility = (id) =>{
    console.log("delete id", id);
    fetch('https://app.aibers.health/api/deleteFacilityByDoctorFacilityId/'+id, {
    method: 'DELETE'
    })
    .finally(
        setTimeout(() => {
        getNamesOfDoctor();
        }, 1000)
        );
    }

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

    const [startISO,setStartISO] = useState();
    const [EndISO,setEndISO] = useState();

    const settingTimeISO = () => {
        let datetest = new Date();
        let timmee = datetest.getTime();
        let dateFromUI = "12-10-2020";
        let myTimeStart = startTimePick;
        let myTimeEnd = endTimePick;
        let dateParts = dateFromUI.split("-");
        let timeParts = myTimeStart.split(":");
        let timePartsEnd = myTimeEnd.split(":");

        let dateStart = new Date(dateParts[2], dateParts[0]-1, dateParts[1], timeParts[0], timeParts[1]);
        let dateEnd = new Date(dateParts[2], dateParts[0]-1, dateParts[1], timePartsEnd[0], timePartsEnd[1]);

        let dateISOStart = dateStart.toISOString();
        let dateISOEnd = dateEnd.toISOString();
        console.log("Time checking: ", timmee.toString(),"StartValue", startTimePick, "StartISO: ", dateISOStart,"EndISO: ", dateISOEnd);
        
        setStartISO(dateISOStart);
        setEndISO(dateISOEnd);
        console.log("ISO: ", startISO, EndISO);
    }


    // Handle About Portion
    const [inputEditingAbout, setInputAbout]=useState('');
    const editAbout=(id)=>
    { 
        if(inputEditingAbout!=="")
        {
            fetch('https://app.aibers.health/api/updateAbout/'+id, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                about: inputEditingAbout
            })
            }).finally(
                setaboutValue(""),
                setTimeout(() => {
                getNamesOfDoctor();
                }, 2000)
            );
        }
    }

    const renderAbout=(editing)=>{ 
        return !!(lists.about) ? 
            <div style={{display:"flex", flexDirection:"row"}}>
               {!editing ? (<div style={{display:"flex", flex:"1"}}>
                    {lists.about}
                </div>) :
                (
                <div style={{display:"flex", flex:"1"}}>
                   { (editOptionPos === location.state.userId) ?
                    (<div style={{display:"flex", flex:"1"}}>
                    <input
                        placeholder="Edit About Yourself ..."
                        type="text"
                        value={inputEditingAbout}
                        noValidate
                        onChange={e => setInputAbout(e.target.value)}
                        /> 
                    </div>):
                    (<div style={{display:"flex", flex:"1"}}>
                    {lists.about}
                    </div>)
                    }
                </div>)}
                {editing && (
                    <div style={{display:"flex", flexDirection:"row"}}>
                        {
                        !showEditOptn &&
                        (<div style={{display:"flex", flexDirection:"row"}}>
                            <div style={{color:"#e0004d"}} onClick={()=>{
                                setEditOptionPos(location.state.userId);
                                setEditOptn(true);
                                setInputAbout(lists.about);
                                }}>
                                <FaEdit></FaEdit>
                            </div>
                        </div>
                        )}
                        
                        {/* Handle editing butttons */}
    
                        {
                        showEditOptn && 
                        (<div style={{display:"flex", flexDirection:"row"}}>
                            <div style={{color:"#e0004d"}} onClick={()=>{setEditOptn(false);
                                setEditOptionPos(-1);}}>                    
                                <CloseIcon></CloseIcon>
                            </div> 
                            <div style={{color:"#e0004d"}} onClick={()=>{editAbout(location.state.userId);
                            setEditOptn(false);
                            setEditOptionPos(-1);
                            }}>                    
                                <DoneIcon></DoneIcon>
                            </div> 
                        </div>)}
                </div>
                )}
        </div> 
             : (<p>Write about yourself</p>)
        };

    

        // Handle Bio Portion

        
        const editName=(id)=>
        { 
            console.log("Edit bio",inputEditingSpecialization," and " , inputEditingName );
            // if(inputEditingSpecialization!=="")
            // {
                fetch('https://app.aibers.health/api/updateSpecilizationAndName/'+id, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    specilization:lists.specilization,
                    name: inputEditingName
                })
                }).finally(
                    setnameValue(""),
                    setTimeout(() => {
                    getNamesOfDoctor();
                    }, 2000)
                );
            // }
        }

        const editSpecialization=(id)=>
        { 
            console.log("Edit bio",inputEditingSpecialization," and " , inputEditingName );
            // if(inputEditingSpecialization!=="")
            // {
                fetch('https://app.aibers.health/api/updateSpecilizationAndName/'+id, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    specilization:inputEditingSpecialization,
                    name: lists.name
                })
                }).finally(
                    setspecializationValue(""),
                    setTimeout(() => {
                    getNamesOfDoctor();
                    }, 2000)
                );
            // }
        }

        const renderName=(editing)=>{
            return !!(lists.name) ? 
                <div style={{display:"flex", flexDirection:"row"}}>
                   {!editing ? (<div style={{display:"flex", flex:"1"}}>
                        {lists.name}
                    </div>) :
                    (
                    <div style={{display:"flex", flex:"1"}}>
                       { (showEditNameOptn) ?
                        (<div style={{display:"flex", flex:"1"}}>
                        <input
                            placeholder="Edit Your Name ..."
                            type="text"
                            value={inputEditingName}
                            noValidate
                            onChange={e => setInputName(e.target.value)}
                            /> 
                        </div>):
                        (<div style={{display:"flex", flex:"1"}}>
                        {lists.name}
                        </div>)
                        }
                    </div>)}
                    {editing && (
                        <div style={{display:"flex", flexDirection:"row"}}>
                            {
                            !showEditNameOptn &&
                            (<div style={{display:"flex", flexDirection:"row"}}>
                                <div style={{color:"#e0004d"}} onClick={()=>{
                                    setEditNameOptn(true);
                                    setInputName(lists.name);
                                    }}>
                                    <FaEdit></FaEdit>
                                </div>
                            </div>
                            )}
                            
                            {/* Handle editing butttons */}
        
                            {
                            showEditNameOptn && 
                            (<div style={{display:"flex", flexDirection:"row"}}>
                                <div style={{color:"#e0004d"}} onClick={()=>{setEditNameOptn(false)}}>                    
                                    <CloseIcon></CloseIcon>
                                </div> 
                                <div style={{color:"#e0004d"}} onClick={()=>{editName(location.state.userId);
                                setEditNameOptn(false);
                                }}>                    
                                    <DoneIcon></DoneIcon>
                                </div> 
                            </div>)}
                    </div>
                    )}
            </div> 
                 : (<p>Add Your Name...</p>)
            };

        const renderSpecialization=(editing)=>{ 
            return !!(lists.specilization) ? 
            <div style={{display:"flex", flexDirection:"row"}}>
            {!editing ? (<div style={{display:"flex", flex:"1"}}>
                 {lists.specilization}
             </div>) :
             (
             <div style={{display:"flex", flex:"1"}}>
                { (showEditSpecOptn) ?
                 (<div style={{display:"flex", flex:"1"}}>
                 <input
                     placeholder="Edit Your Name ..."
                     type="text"
                     value={inputEditingSpecialization}
                     noValidate
                     onChange={e => setInputSpecialization(e.target.value)}
                     /> 
                 </div>):
                 (<div style={{display:"flex", flex:"1"}}>
                 {lists.specilization}
                 </div>)
                 }
             </div>)}
             {editing && (
                 <div style={{display:"flex", flexDirection:"row"}}>
                     {
                     !showEditSpecOptn &&
                     (<div style={{display:"flex", flexDirection:"row"}}>
                         <div style={{color:"#e0004d"}} onClick={()=>{
                             setEditSpecOptn(true);
                             setInputSpecialization(lists.specilization);
                             }}>
                             <FaEdit></FaEdit>
                         </div>
                     </div>
                     )}
                     
                     {/* Handle editing butttons */}
 
                     {
                     showEditSpecOptn && 
                     (<div style={{display:"flex", flexDirection:"row"}}>
                         <div style={{color:"#e0004d"}} onClick={()=>{setEditSpecOptn(false)}}>                    
                             <CloseIcon></CloseIcon>
                         </div> 
                         <div style={{color:"#e0004d"}} onClick={()=>{editSpecialization(location.state.userId);
                         setEditSpecOptn(false);
                         }}>                    
                             <DoneIcon></DoneIcon>
                         </div> 
                     </div>)}
             </div>
             )}
     </div> 
                    : (<p>Add Your Specialization...</p>)
            };    

   


    return(
        <Container> 
            {/* {settingTimeISO()} */}
            <Row className="profile_head">
                <div style={{ display: "flex" ,flex: 1,flexDirection: "column"}}>
                    <div className="profile_head__redsection">
                        <p className="doctor_name">{lists.name}</p>
                        <Avatar src={lists.image} 
                        style={{ height:"100px", width:"100px", display:"flex",position:"relative",right:"130px",top:"50px"}}/>
                        <AddAPhotoIcon 
                        style={{ color:"black",cursor:"pointer" ,display:"flex",position:"relative",right:"150px",top:"110px"}}></AddAPhotoIcon>
                        <FaEdit onClick={handleBioModalShow} style={{ cursor:"pointer", position:"relative",left:"100px",color:"white",top:"90px"}}></FaEdit>
                    </div>
                    <div className="profile_head__whitesection">
                        <p className="doctor_specilization">{lists.specilization}</p>
                    </div>
                </div>
            </Row>
            <hr/>
            <Row>
                <Col>
                    <h4>About</h4>
                    <p>{lists.about}</p>
                </Col>
                <Col className="EditIcon">
                <FaEdit onClick={handleAboutModalShow} style={{ cursor:"pointer"}}></FaEdit>
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col>
                    <h4>Qualification</h4>
                    <div>{renderQualificationItem()}</div>
                </Col>
                <Col className="EditIcon">
                <FaEdit onClick={handleQuaModalShow} style={{ cursor:"pointer"}}></FaEdit>
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col>
                    <h4>Practice Locations</h4>
                    {renderlocItem()}
                </Col>
                <Col className="EditIcon"> 
                    <FaEdit onClick={handleLocModalShow} style={{ cursor:"pointer"}}></FaEdit>   
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col>
                    <h4>Facilities</h4>
                    <div>{renderFacilitiesItem()}</div>
                </Col>
                <Col className="EditIcon">
                    <FaEdit onClick={handleFacModalShow} style={{ cursor:"pointer"}}></FaEdit>
                </Col>
            </Row>

            {/* Modal Locations */}
            
            <Modal 
                show={showLocModal} 
                onHide={handleLocModalClose}  
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                <Modal.Title style={{color: "#e0004d"}}>Practice Locations</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <div className="modal_label">Add New Location</div>
                                <div>
                                    <AsyncSelect
                                        placeholder="Search your location..."
                                        // cacheOptions
                                        // defaultOptions
                                        value={selectedValue}
                                        loadOptions={loadOptions}
                                        onInputChange={handleInputChange}
                                        onChange={handleChange}
                                    />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{marginTop:"10px"}}>
                        <Col>
                            <label>Start time :</label>
                            <TimePicker
                            onChange={(value) => {
                                console.log("Start time: ", value)
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
                        <Col>
                            <label>Select Days :</label>
                            {renderDaysBtns()}
                            {daysData}
                        </Col>
                    </Row>
                    <div style={{justifyContent: "flex-end", display: "flex"}}>
                    <Button variant="primary" onClick={() => {
                        settingTimeISO();
                        setTempLocation(true);
                        }}>
                        Add Location
                    </Button>

                    </div>
                    <div className="modal_label">My Locations</div>
                    {renderlocItem(true)}
                    </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleLocModalClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Qualification */}

            <Modal 
                show={showQuaModal} 
                onHide={handleQuaModalClose}  
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                <Modal.Title style={{color: "#e0004d"}}>Qualification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <div style={{display:"flex", flexDirection:"row"}}> 
                                <input
                                placeholder="Add Your Qualification ..."
                                type="text"
                                value={qualificationValue}
                                noValidate
                                onChange={e => setqualificationValue(e.target.value)}
                                /> 
                                <Button variant="primary" onClick={handleAddQualification} style={{marginLeft:"10px"}}>
                                    Add
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <div className="modal_label">Qualification</div>
                    {renderQualificationItem(true)}
                    </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleQuaModalClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Facility */}

            <Modal 
                show={showFacModal} 
                onHide={handleFacModalClose}  
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                <Modal.Title style={{color: "#e0004d"}}>Facilities</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <div style={{display:"flex", flexDirection:"row"}}> 
                                <input
                                placeholder="Add Facility ..."
                                type="text"
                                value={facilityValue}
                                noValidate
                                onChange={e => setFacilityValue(e.target.value)}
                                /> 
                                <Button variant="primary" onClick={handleAddFacility} style={{marginLeft:"10px"}}>
                                    Add
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <div className="modal_label">Facilities</div>
                    {renderFacilitiesItem(true)}
                    </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleFacModalClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal About */}

            <Modal 
                show={showAboutModal} 
                onHide={handleAboutModalClose}  
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                <Modal.Title style={{color: "#e0004d"}}>About</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal_label">Edit About Info</div>
                    {renderAbout(true)}
                    </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleAboutModalClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Bio */}

            <Modal 
                show={showBioModal} 
                onHide={handleBioModalClose}  
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                <Modal.Title style={{color: "#e0004d"}}>About</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal_label">Edit Name</div>
                    {renderName(true)}
                    <div className="modal_label">Edit Specialization</div>
                    {renderSpecialization(true)}
                    </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleBioModalClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
            
        </Container>
    )
}
export default DoctorProfile
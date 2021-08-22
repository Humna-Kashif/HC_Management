import React, { useEffect, useState} from 'react'
import { Avatar } from "@material-ui/core";
import { getImage } from "../DB/API";

const PatientTabItem = (props) => {
    
    function titleCase(str) {
        return str.toLowerCase().split(' ').map(function(word) {
            return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
    }
    const [image, setImage] = useState(null);
    useEffect(() => {
        console.log("my patient id is ",props.info.patient_id)
        getImage('patients',props.info.patient_id)
        .then((json) => {setImage("data:image;charset=utf-8;base64,"+json.encodedData); console.log("my json is ", json);})
        .catch((error) => console.error(error))
        .finally(() => {
        });
    }, []);

    return (
        <div style={props.selected? styles.header_container_selected : styles.header_container} onClick={() => {props.handleItem(props.info);props.handleAccess(props.access)}}>
            <Avatar src={image} style={styles.avatar}/>   
            <div style={styles.title_container}>
                <div style={styles.title__name}>{titleCase(props.info.name)}</div>
                <div style={styles.title__label}>{props.status}</div>
            </div>
        </div>
    )
}

export default PatientTabItem;

PatientTabItem.defaultProps = {
    imageURL: "",
    patientName : "Nameee",
    appointmentLabel : "this is awesome",
    info: {
        image: "",
        name: "Sample Patient"
    }
};

const styles = {
    header_container: {display: "flex", flexDirection: "row", padding: 16, alignItems:"center", backgroundColor: "white"},
    header_container_selected: {display: "flex", flexDirection: "row", padding: 16, alignItems:"center"
    , backgroundColor: "#f6f6f6", borderColor: "#e0e0e0", borderStyle: "solid", borderWidth: 0.3},
    avatar: { height:"40px", width:"40px", borderWidth: 0.3, borderColor: "#e0004d", borderStyle: "solid"},
    title_container: {display: "flex", flexDirection: "column", textAlign: "left", marginLeft: 10},
    title__name: {color: "#e0004d", fontSize: 18, fontWeight: "bold"},
    title__label: {color: "#00000081", fontSize:16}
};
// import React, { useEffect, useState} from 'react'
// import { Button, Col, Row , Card, Container} from "react-bootstrap"
// import { Avatar } from '@material-ui/core';
// import {locationsAPI} from '../DB/API'

// const Dropdown = (props) =>{
//     const doc_ID = props.id;
//     const previous_loc = props.privious_loc;
//     const [locationData,setLocationData] = useState([]);
//     const [selectValue,setSelectedValue] = useState(previous_loc);
//     const [disabledDays,setDisabledDays] = useState([]);


//     const collectDisabledDays=(docData)=>{
//       let a=[];
      
//       let d1=docData;
    
//       console.log('d1,',d1)
    
//       let d2=d1.split('-');
//       let days2=['sun','mon','tue','wed','thu','fri','sat'];
//       let days=['sun','mon','tue','wed','thu','fri','sat']
    
//       for(var k=0; k<7; k++)
//       {
//         days=days.filter(item => item !== d2[k])
//       }
//       console.log("doc data is ", days)
    
      
//         for(var j=0; j<days.length; j++)
//         {
//             for(var i=0; i<days2.length;i++)
//             {
//                 if ((days[j].toLowerCase()==days2[i].toLocaleLowerCase()))
//                 {
//                     console.log("i is ", i);

//                     a.push(i);
//                 }
//             }
//       }
//       setDisabledDays(a);
//     }

    

    

//     return(
        
//     )
// }
// export default Dropdown

// // PatientHeader.defaultProps = {
// //     data: {
// //         name:"Ghulam Farid",
// //         time:"3:00  12:00",
// //         image:""
// //     }
// // }
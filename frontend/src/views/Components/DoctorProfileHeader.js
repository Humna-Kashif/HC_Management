import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Modal,
  Row,
  ButtonGroup,
  Col,
} from "react-bootstrap";
import axios from 'axios';
import $ from 'jquery';
import { Avatar, Card } from "@material-ui/core";
import { getImage } from '../DB/API'
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { FaEdit } from "react-icons/fa";
import "../Styles/DoctorProfileHeader.scss";
import { useLocation } from "react-router-dom";
import "../DoctorProfile/DoctorProfile.css";

const DoctorProfileHeader = (props) => {
const data = props.data;
const doc_ID = useLocation();
const [show, setShow] = useState(false);
const handleClose = () => {setShow(false);
  singleFileUploadHandler();
}
const handleShow = () => setShow(true);
const [selectedFiles,setSelectedFiles] = useState(null);
const handleEdit = () => {
  console.log("Header Edit Clicked");
};

const singleFileChangedHandler = ( event ) => {
  setSelectedFiles(event.target.files[0])
};
// ShowAlert Function
const ocShowAlert = ( message, background = '#3089cf' ) => {
  let alertContainer = document.querySelector( '#oc-alert-container' ),
    alertEl = document.createElement( 'div' ),
    textNode = document.createTextNode( message );
  alertEl.setAttribute( 'class', 'oc-alert-pop-up' );
  $( alertEl ).css( 'background', background );
  alertEl.appendChild( textNode );
  alertContainer.appendChild( alertEl );
  setTimeout( function () {
    $( alertEl ).fadeOut( 'slow' );
		$( alertEl ).remove();
  }, 3000 );
};

const singleFileUploadHandler = ( event ) => {
  const data = new FormData();
// If file selected
  if ( selectedFiles ) {
    data.append( 'image', selectedFiles, selectedFiles.name );
    axios.put( 'https://app.aibers.health/doctors/'+doc_ID.state.userId+'/image', data, {
      headers: {
        'accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      }
    })
      .then( ( response ) => {
        showImage();
        if ( 200 === response.status ) {
          // If file size is larger than expected.
          if( response.data.error ) {
            if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
              this.ocShowAlert( 'Max size: 2MB', 'red' );
            } else {
              console.log( response.data );
// If not the given file type
              this.ocShowAlert( response.data.error, 'red' );
            }
          } else {
            // Success
            let fileName = response.data;
            console.log( 'filedata', fileName );
            this.ocShowAlert( 'File Uploaded', '#3089cf' );
          }
        }
      }).catch( ( error ) => {
      // If another error
      console.log("error ", error)
      // ocShowAlert( error, 'red' );
    });
  } else {
    // if file not selected throw error
    console.log("error of upload file")
    // ocShowAlert( 'Please upload file', 'red' );
  }
};


const renderSetImage = () =>{
  console.log("clicked")
  return(
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Upload Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <div className="card-body">
						<p className="card-text">Please upload an image for your profile</p>
						<input type="file" onChange={singleFileChangedHandler} />
					</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const [image, setImage] = useState(null);
const showImage = () =>{
  console.log("rendering get image")
    getImage('doctors',doc_ID.state.userId)
        .then((json) => {setImage("data:image;charset=utf-8;base64,"+json.encodedData);})
        .catch((error) => console.error(error))
        .finally(() => {
        });
  }
    useEffect(() => {
        showImage()
    }, []);

  return (
    <div>
      <div className={"profile-header"}>
        <div className={"profile-header__redsection"}>
          <div className={"icons"}>
            <Col lg={2} xs={4}>
              <Avatar
                src={image}
                style={{
                  height: "100px",
                  width: "100px",
                  position: "absolute",
                }}
                className={"icons__avatar"}
              />
              <AddAPhotoIcon className={"icons__add-photo"} onClick={()=>{handleShow()}}></AddAPhotoIcon>
            </Col>
            <Col>
              <div className={"name-title"}>
                {data.name}
                {/* <FaEdit onClick={handleEdit} style={{ cursor:"pointer", position:"relative",color:"white"}}></FaEdit> */}
              </div>
            </Col>
          </div>
        </div>
        <div className={"profile-header__whitesection"}>
          <Col lg={{ span: 4, offset: 2 }} xs={{ span: 6, offset: 4 }}>
            <div
              // style={styles.specialization_title}
              className={"specialization-title"}
            >
              {data.specialization}
              {renderSetImage()}
            </div>
          </Col>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileHeader;

DoctorProfileHeader.defaultProps = {
  headerData: {
    name: "Name",
    specialization: "Specialization",
    image: "Default",
  },
};

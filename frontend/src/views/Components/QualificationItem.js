import React, { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { editQualificationAPI, deleteQualificationAPI } from "../DB/API";
import "../Styles/EditItem.scss";
import DeleteIcon from "@material-ui/icons/Delete";

const QualificationItem = (props) => {
  const itemData = props.itemData;
  // console.log("Qualification rececived data", props.itemData);
  const Enabled = props.isEnableEdit;
  const doc_Id = props.id;
  const [data, setData] = useState(itemData);
  const [enableEdit, setEnableEdit] = useState(true);
  const [editCtrl, setEditCtrl] = useState(false);
  const [deleteCtrl, setDeleteCtrl] = useState(false);

  const handleEditBtn = () => {
    setEnableEdit(false);
    setEditCtrl(true);
  };
  const handleDeleteBtn = () => {
    setEnableEdit(false);
    setDeleteCtrl(true);
  };

  // const editQualification=(id)=>{
  //     console.log("id is: ",id);
  //     editQualificationAPI(doc_Id,'PUT',data.qualification,doctor_qualification_id).then(result => {
  //         console.log("new qualification api",result);
  //         setData(result);
  //     });
  // }

  // const deleteQualification=(id)=>{
  //     console.log("id is: ",id);
  //     deleteQualificationAPI(doc_Id,'DELETE',doctor_qualification_id).then(result => {
  //         console.log("new qualification api",result);
  //         setData(result);
  //     });
  // }
  const handleConfirmEdit = (id) => {
    console.log("id is: ", id);
    editQualificationAPI(doc_Id, "PUT", data.qualification, id).then(
      (result) => {
        console.log("new qualification api", result);
        //setData(result);
        props.callback();
      }
    );
    setEnableEdit(true);
    setEditCtrl(false);
  };
  const handleCancelEdit = () => {
    setData(itemData);
    setEnableEdit(true);
    setEditCtrl(false);
  };
  const handleConfirmDel = (id) => {
    deleteQualificationAPI(doc_Id, "DELETE", id).then((result) => {
      console.log("new qualification api", result);
      // setData(result);
      props.callback();
      setEnableEdit(true);
      setDeleteCtrl(false);
    });
  };
  const handleCancelDel = () => {
    setEnableEdit(true);
    setDeleteCtrl(false);
  };

  if (!Enabled && (editCtrl || deleteCtrl)) {
    handleCancelEdit();
    handleCancelDel();
  }

  return (
    <Row className={"edit-row"}>
      {console.log(
        "item rendered",
        itemData.qualification,
        "editing",
        props.isEnableEdit,
        "value",
        enableEdit,
        Enabled
      )}
      <Col lg={1}></Col>
      <Col className={"field"}>
        {editCtrl ? (
          <input
            className={"field__input"}
            placeholder="Add Your Qualification ..."
            type="text"
            value={data.qualification}
            noValidate
            onChange={(e) =>
              setData({ ...data, qualification: e.target.value })
            }
          />
        ) : (
          data.qualification
        )}
      </Col>
      {Enabled && enableEdit && (
        <Col lg={3} xs={8} className={"button"}>
          <Button
            size="sm"
            variant="primary"
            onClick={handleEditBtn}
            className={"button__left"}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline-primary"
            onClick={handleDeleteBtn}
            className={"button__right"}
          >
            Delete
          </Button>
        </Col>
      )}
      {editCtrl && (
        <Col lg={3} xs={8} className={"button"}>
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleConfirmEdit(data.doctor_qualification_id)}
            className={"button__left"}
          >
            Confirm
          </Button>
          <Button
            size="sm"
            variant="outline-primary"
            onClick={handleCancelEdit}
            className={"button__right"}
          >
            Cancel
          </Button>
        </Col>
      )}
      {deleteCtrl && (
        <Col lg={3} xs={8} className={"button"}>
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleConfirmDel(data.doctor_qualification_id)}
            className={"button__left"}
          >
            Delete
          </Button>
          <Button
            size="sm"
            variant="outline-primary"
            onClick={handleCancelDel}
            className={"button__right"}
          >
            Cancel
          </Button>
        </Col>
      )}

      <Col lg={1}></Col>
    </Row>
  );
};

export default QualificationItem;

QualificationItem.defaultProps = {
  itemDate: {
    doctor_qualification_id: "1",
    qualification: "sample",
  },
};

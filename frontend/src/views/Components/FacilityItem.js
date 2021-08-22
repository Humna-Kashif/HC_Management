import React, { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { editFacilityAPI, deleteFacilityAPI } from "../DB/API";
import "../Styles/EditItem.scss";

import DeleteIcon from "@material-ui/icons/Delete";

const FacilityItem = (props) => {
  const itemData = props.itemData;
  const doc_Id = props.id;
  // console.log("Qualification rececived data", props.itemData);
  const Enabled = props.isEnableEdit;
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

  // }

  // const deleteQualification=(id)=>{
  //     console.log("id is: ",id);

  // }

  const handleConfirmEdit = (id) => {
    editFacilityAPI(doc_Id, "PUT", data.facility, id).then((result) => {
      console.log("new facility api", result);
      // setData(result);
      props.callback();
    });
    setEnableEdit(true);
    setEditCtrl(false);
  };
  const handleCancelEdit = () => {
    setData(itemData);
    setEnableEdit(true);
    setEditCtrl(false);
  };
  const handleConfirmDel = (id) => {
    deleteFacilityAPI(doc_Id, "DELETE", id).then((result) => {
      console.log("new qfacility api", result);
      // setData(result);
      props.callback();
    });
    setEnableEdit(true);
    setDeleteCtrl(false);
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
        itemData.facility,
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
            placeholder="Add Your facility ..."
            type="text"
            value={data.facility}
            noValidate
            onChange={(e) => setData({ ...data, facility: e.target.value })}
          />
        ) : (
          data.facility
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
            onClick={() => handleConfirmEdit(data.doctor_facility_id)}
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
            onClick={() => handleConfirmDel(data.doctor_facility_id)}
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

export default FacilityItem;

FacilityItem.defaultProps = {
  itemDate: {
    doctor_facility_id: "1",
    facility: "sample",
  },
};

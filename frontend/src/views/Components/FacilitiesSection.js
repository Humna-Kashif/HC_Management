import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import FacilityItem from "./FacilityItem";
import { facilitiesAPI, addFacilityAPI, editFacilityAPI } from "../DB/API";
import "../Styles/DoctorValuesSection.scss";

const FacilitiesSection = (props) => {
  const [data, setData] = useState(props.FacilitiesData);
  const doc_Id = props.id;
  const [editing, setEditing] = useState(false);
  const [FacilityValue, setFacilityValue] = useState("");

  const handleFacilityEdit = () => {
    setEditing(true);
  };

  const handleSaveBtn = () => {
    setEditing(false);
  };

  const handleCancelBtn = () => {
    setEditing(false);
  };

  const renderItem = () => {
    return data.map((item) => (
      <FacilityItem
        callback={refresh}
        id={doc_Id}
        itemData={item}
        isEnableEdit={editing}
      />
    ));
  };

  const [oneTime, setOneTime] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      oneTime &&
        facilitiesAPI(doc_Id).then((result) => {
          console.log("new facilities api", result);
          setData(result);
        });
      setOneTime(false);
    }, 200);
    return () => clearTimeout(timer);
  });

  const refresh = () => {
    facilitiesAPI(doc_Id).then((result) => {
      setData([]);
      setData(result);
    });
  };

  const handleAddFacility = () => {
    if (FacilityValue !== "") {
      addFacilityAPI(doc_Id, "POST", FacilityValue).then((result) => {
        console.log("Success", result);
        refresh();
      });
      setFacilityValue("");
    }
  };

  return (
    <div className={"separation"}>
      <Row className={"margin"}>
        <Col lg={{ offset: 1, span: 7 }} xs={4}>
          <h4>Facilities</h4>
        </Col>
        {editing ? (
          <Col lg={3} xs={8} className={"edit-button"}>
            <Button
              size="sm"
              variant="primary"
              onClick={handleSaveBtn}
              className={"done"}
            >
              Done
            </Button>
          </Col>
        ) : (
          <Col
            lg={3}
            xs={8}
            className={"edit-button"}
            onClick={handleFacilityEdit}
          >
            <span className={"edit-label"}>Edit</span>
            <FaEdit className={"edit-symbol"}></FaEdit>
          </Col>
        )}
      </Row>
      {editing && (
        <Row className={"value"}>
          <Col lg={{ span: 10, offset: 1 }}>
            <div className={"value__container"}>
              <input
                className={"value__input"}
                placeholder="Add Your Facility ..."
                type="text"
                value={FacilityValue}
                noValidate
                onChange={(e) => setFacilityValue(e.target.value)}
              />
              <Button
                size="sm"
                variant="primary"
                onClick={handleAddFacility}
                className={"add"}
              >
                Add
              </Button>
            </div>
          </Col>
        </Row>
      )}
      {renderItem()}
    </div>
  );
};

export default FacilitiesSection;

FacilitiesSection.defaultProps = {
  FacilitiesData: [],
};

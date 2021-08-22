import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import QualificationItem from "./QualificationItem";
import { qualificationsAPI, addQualificationAPI } from "../DB/API";
import "../Styles/DoctorValuesSection.scss";

const QualificationSection = (props) => {
  const [data, setData] = useState(props.qualificationData);
  const doc_Id = props.id;
  const [editing, setEditing] = useState(false);
  const [qualificationValue, setQualificationValue] = useState("");

  const PrimaryButton = ({ label, className, onClick }) => {
    return (
      <Button
        size="sm"
        variant="primary"
        onClick={onClick}
        className={className}
      >
        {label}
      </Button>
    );
  };

  const EditButton = () => {
    return (
      <>
        <span className={"edit-label"}>Edit</span>
        <FaEdit className={"edit-symbol"}></FaEdit>
      </>
    );
  };

  const ChangeButton = ({ onClick, button }) => {
    return (
      <Col lg={3} xs={8} className={"edit-button"} onClick={onClick}>
        {button}
      </Col>
    );
  };

  const handleQualificationEdit = () => {
    setEditing(true);
  };

  const handleSaveBtn = () => {
    setEditing(false);
  };

  const handleCancelBtn = () => {
    setEditing(false);
  };

  const renderItem = () => {
    return data.map((item, i) => (
      <QualificationItem
        callback={refresh}
        key={i}
        itemData={item}
        id={doc_Id}
        isEnableEdit={editing}
      />
    ));
  };

  const refresh = () => {
    qualificationsAPI(doc_Id).then((result) => {
      console.log("new qualification api", result, "prev data", data);
      setData([]);
      console.log("new qualification api", result);
      setData(result);
    });
  };

  const [oneTime, setOneTime] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      oneTime &&
        qualificationsAPI(doc_Id).then((result) => {
          console.log("new qualification api", result);
          setData(result);
        });
      setOneTime(false);
    }, 200);
    return () => clearTimeout(timer);
  });

  const handleAddQualification = () => {
    if (qualificationValue !== "") {
      addQualificationAPI(doc_Id, "POST", qualificationValue).then((result) => {
        console.log("Success", result);
        refresh();
      });
      setQualificationValue("");
    }
  };

  return (
    <div className={"separation"}>
      <Row className={"margin"}>
        <Col lg={{ offset: 1, span: 7 }} xs={4}>
          <h4>Qualification</h4>
        </Col>
        {editing ? (
          <ChangeButton
            button={
              <PrimaryButton
                label={"Done"}
                onClick={handleSaveBtn}
                className={"done"}
              />
            }
          />
        ) : (
          <ChangeButton
            button={<EditButton />}
            onClick={handleQualificationEdit}
          />
        )}
      </Row>

      {editing && (
        <Row className={"value"}>
          <Col lg={{ span: 10, offset: 1 }}>
            <div className={"value__container"}>
              <input
                className={"value__input"}
                placeholder="Add Your Qualification ..."
                type="text"
                value={qualificationValue}
                noValidate
                onChange={(e) => setQualificationValue(e.target.value)}
              />
              <PrimaryButton
                label={"Add"}
                onClick={handleAddQualification}
                className={"add"}
              />
            </div>
          </Col>
        </Row>
      )}
      {renderItem()}
    </div>
  );
};

export default QualificationSection;

QualificationSection.defaultProps = {
  qualificationData: [],
};

import React, { useEffect } from "react";
import Moment from "moment";

const Colors = {
  primaryColor: "#e0004d",
};

const HistoryPatientItem = (props) => {
  const completedAppointment = props.itemData;
  console.log("Appointment ", completedAppointment);

  return (
    <div
      style={
        props.selected
          ? styles.history_container_selected
          : styles.history_container
      }
      onClick={() => {
        props.onClick();
      }}
    >
      <div
        style={{
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <div
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            display: "flex",
          }}
        >
          <div style={{ flex: 1, width: "50%", textAlign: "left" }}>
            <div
              style={{
                fontSize: 16,
                color: Colors.primaryColor,
              }}
            >
              on{" "}
              {Moment(completedAppointment.date_time_of_appointment).format(
                "Do MMM, YYYY"
              )}
            </div>
            <div style={{ fontSize: 24, opacity: 0.8 }}>
              {Moment(completedAppointment.date_time_of_appointment).format(
                "LT"
              )}
            </div>
          </div>
          <div style={{ width: "50%", textAlign: "right" }}>
            {/* <Image
              source={require("../assets/img/picholder.jpg")}
              containerStyle={{
                width: 50,
                height: 50,
                borderRadius: 25,
                borderWidth: 0.6,
                borderColor: Colors.primaryColor,
              }}
            /> */}
            <div style={{ fontSize: 15, color: Colors.primaryColor }}>
              at {completedAppointment.doctorinfo.name}
            </div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>
              {completedAppointment.doctorinfo.specialization}
            </div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>
              {
                completedAppointment.doctorinfo.appointment_location
                  .appointment_location_of_doctor
              }
            </div>
          </div>
        </div>
        <div>
          <div style={styles.section}>
            <div style={styles.section}>
              <div style={styles.sectionHeading}>Summary</div>
              <div style={{ opacity: 0.8 }}>
                {completedAppointment.doctors_note}
              </div>
            </div>
            <div style={styles.section}>
              {/* <div style={styles.sectionHeading}>Prescription</div> */}
              {/* <div style={{ opacity: 0.8 }}>{Lorem.Lorem10}</div> */}

              {/* <SectionList
                sections={[
                  { title: "Prescription", data: completedAppointment.appointment_data.prescription },
                  { title: "Test", data: completedAppointment.appointment_data.tests },
                ]}
                keyExtractor={({ appointment_id }, index) => index}
                renderSectionHeader={({ section }) =>
                  section.data.length != 0 && (
                    <div style={styles.sectionHeading}>{section.title}</div>
                  )
                }
                //renderItem={this.renderItem}
                renderItem={renderItem}
              /> */}
            </div>
            <div style={styles.section}>
              {/* <div style={styles.sectionHeading}>Test</div> */}
              {/* <div style={{ opacity: 0.8 }}>{Lorem.Lorem5}</div> */}
            </div>
          </div>
          <div
            style={{
              alignItems: "flex-end",
              paddingBottom: 4,
              textAlign: "right",
            }}
          >
            <div style={{ color: Colors.primaryColor, fontSize: 12 }}>
              Follow up of{" "}
              {Moment(
                completedAppointment.date_time_of_parent_appointment
              ).format("Do MMM, h:mm a, ") +
                completedAppointment.doctorinfo.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPatientItem;

HistoryPatientItem.defaultProps = {
  AppointmentData: {
    appointment_id: 1,
    date_time_of_appointment: "2019-10-26T11:30:00+00:00",
    parent_appointment_id: 1,
    date_time_of_parent_appointment: "2019-10-26T11:30:00+00:00",
    doctors_note:
      "Patient showed signs of recovery from surgery and medicine dosage is now reduced and fully recoverd",
    appointment_status: "completed",
    appointment_data: {
      prescription: [
        {
          medicine_name: "Amoxil",
        },
        {
          medicine_name: "Crestor",
        },
      ],
      tests: null,
    },
    doctorinfo: {
      doctor_id: 2,
      name: "Dr. Kashan Aslam Shah",
      specialization: "Cardiologist",
      image:
        "https://s3.ap-south-1.amazonaws.com/upload.aibers.health/doctor-2-1606387113573.png",
      appointment_location: {
        hospital_id: 2,
        doctor_id: 2,
        start_time: "09:00",
        end_time: "16:00",
        days: "mon-fri",
        appointment_location_of_doctor: "CMH, Islamabad",
      },
    },
    patientinfo: {
      patient_id: 1,
      name: "zarnain",
    },
  },
};

const styles = {
  textRight: {
    textAlign: "right",
  },
  section: { paddingTop: 5, paddingBottom: 5, textAlign: "left" },
  sectionHeading: { color: Colors.primaryColor, fontWeight: "bold" },
  history_container: {
    backgroundColor: "white",
    padding: 10,
    borderWidth: 0.6,
    borderStyle: "solid",
    borderColor: "#e0e0e0",
    borderRadius: 10,
    margin: 15,
  },
  history_container_selected: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderWidth: 1.6,
    borderStyle: "solid",
    borderColor: "#e0e0e0",
    borderRadius: 10,
    margin: 15,
  },
};

#!/bin/bash


# npm install express pg ejs


psql -U postgres -h 127.0.0.1 << EOF   

DROP DATABASE aibers_health;

CREATE DATABASE aibers_health WITH OWNER = postgres TABLESPACE = pg_default CONNECTION LIMIT = -1;  

\c aibers_health


CREATE TABLE doctor (doctor_id SERIAL PRIMARY KEY NOT NULL, name varchar(25) NOT NULL, gender varchar(6) NOT NULL, dob timestamptz NOT NULL,specialization varchar(50) NOT NULL, image varchar(200), contact_no varchar(11) not null, about text, appointment_type varchar(15));

CREATE TABLE doctor_facilities (doctor_facility_id SERIAL PRIMARY KEY NOT NULL, doctor_id INT NOT NULL, FOREIGN KEY(doctor_id) REFERENCES doctor(doctor_id), facility varchar(200));


CREATE TABLE doctor_qualification (doctor_qualification_id SERIAL PRIMARY KEY NOT NULL, doctor_id INT NOT NULL, FOREIGN KEY(doctor_id) REFERENCES doctor(doctor_id), qualification varchar(200));

CREATE TABLE hospital_location (
    hospital_id SERIAL PRIMARY KEY NOT NULL, 
    location varchar(100) not null,
    latitude double precision not null,
    longitude double precision not null
    );
alter table hospital_location add constraint hospital_location_unique_identification unique(location, latitude, longitude);

CREATE TABLE doctors_hospital_location (doctors_hospital_location_id SERIAL PRIMARY KEY NOT NULL, hospital_id INT NOT NULL,FOREIGN KEY(hospital_id) REFERENCES hospital_location(hospital_id), doctor_id INT NOT NULL,FOREIGN KEY(doctor_id) REFERENCES doctor(doctor_id), start_time time with time zone NOT NULL,end_time time with time zone NOT NULL,days varchar(50) NOT NULL, hospital_location_status boolean default true, fees integer);


CREATE TABLE patient (patient_id SERIAL PRIMARY KEY NOT NULL, name varchar(25) NOT NULL, gender varchar(6) NOT NULL, dob date NOT NULL,blood_group varchar(3) NOT NULL,location varchar(20) NOT NULL,family_id INT not null, image varchar(200), contact_no varchar(11) not null);



CREATE TABLE family_member (
    family_member_id SERIAL PRIMARY KEY NOT NULL, 
    family_id int not null, 
    name varchar(50) NOT NULL, 
    relation varchar(20) NOT NULL, 
    patient_id INT NOT NULL, 
    FOREIGN KEY(patient_id) REFERENCES patient(patient_id)
    );


CREATE TABLE access (patient_id INT NOT NULL,FOREIGN KEY(patient_id) REFERENCES patient(patient_id), doctor_id INT NOT NULL, PRIMARY KEY(patient_id, doctor_id), is_access boolean default true);


CREATE TABLE favourite_doctor (patient_id INT NOT NULL,FOREIGN KEY(patient_id) REFERENCES patient(patient_id), doctor_id INT NOT NULL, FOREIGN KEY(doctor_id) REFERENCES doctor(doctor_id), doctors_hospital_location_id INT NOT NULL, FOREIGN KEY(doctors_hospital_location_id) REFERENCES doctors_hospital_location(doctors_hospital_location_id), PRIMARY KEY(patient_id, doctor_id, doctors_hospital_location_id));


CREATE TABLE appointments (appointment_id SERIAL PRIMARY KEY NOT NULL, parent_appointment_id INT NOT NULL default 0,patient_id INT NOT NULL,doctor_id INT NOT NULL, FOREIGN KEY(patient_id) REFERENCES patient(patient_id),FOREIGN KEY(doctor_id) REFERENCES doctor(doctor_id),date_time timestamptz NOT NULL, doctors_note text, appointment_status varchar(20) not null default 'upcoming', doctors_hospital_location INT NOT NULL default 0, appointment_type varchar(15));


CREATE TABLE symtoms (symtoms_id SERIAL PRIMARY KEY NOT NULL,name varchar(258) NOT NULL, symtom_type varchar(128),verified boolean default true);


CREATE TABLE diagnosis (diagnosis_id SERIAL PRIMARY KEY NOT NULL,name varchar(358) NOT NULL, diagnosis_type varchar(128),verified boolean default true);


CREATE TABLE medicines (medicine_id SERIAL PRIMARY KEY NOT NULL,name varchar(128), medicine_type varchar(128), price INT, amountINgrams varchar(128),verified boolean default true);


CREATE TABLE medical_test (test_id SERIAL PRIMARY KEY NOT NULL,name varchar(128), test_type varchar(128), price_in_PKR INT,verified boolean default true);


CREATE TABLE prescription (appointment_id INT NOT NULL,FOREIGN KEY(appointment_id) REFERENCES appointments(appointment_id),medicine_id INT NOT NULL,FOREIGN KEY(medicine_id) REFERENCES medicines(medicine_id),Days INT NOT NULL, quantity INT NOT NULL, frequency varchar(128));


CREATE TABLE appointment_symtoms (appointment_id INT NOT NULL,FOREIGN KEY(appointment_id) REFERENCES appointments(appointment_id),symtoms_id INT NOT NULL,FOREIGN KEY(symtoms_id) REFERENCES symtoms(symtoms_id),PRIMARY KEY (appointment_id, symtoms_id));


CREATE TABLE appointment_medical_test (appointment_id INT NOT NULL,FOREIGN KEY(appointment_id) REFERENCES appointments(appointment_id),test_id INT NOT NULL,FOREIGN KEY(test_id) REFERENCES medical_test(test_id),test_result varchar(200),PRIMARY KEY (appointment_id, test_id));


CREATE TABLE appointment_diagnosis (appointment_id INT NOT NULL,FOREIGN KEY(appointment_id) REFERENCES appointments(appointment_id),diagnosis_id INT NOT NULL,FOREIGN KEY(diagnosis_id) REFERENCES diagnosis(diagnosis_id),PRIMARY KEY (appointment_id, diagnosis_id));


CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY NOT NULL,
    appointment_id INT NOT NULL REFERENCES appointments,
    patient_id INT NOT NULL DEFAULT 0,
    doctor_id INT NOT NULL DEFAULT 0,
    date_time_of_comment TIMESTAMPTZ NOT NULL,
    comment TEXT NOT NULL
);

CREATE TABLE vitals (           
    vital_id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    unit VARCHAR(20),
    normal_range VARCHAR(20)
);
 
CREATE TABLE patient_vitals (
    vital_id INT NOT NULL REFERENCES vitals,
    patient_id INT NOT NULL REFERENCES patient,
    doctor_id INT NOT NULL DEFAULT 0,
    current_value VARCHAR(20) NOT NULL,
    date_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

alter table patient_vitals add constraint patient_vitals_unique_identifier unique (vital_id, patient_id);


CREATE TABLE doctor_staff(
    staff_id SERIAL NOT NULL PRIMARY KEY,
    doctor_id INT NOT NULL REFERENCES doctor,
    doctors_hospital_location_ids INTEGER[] NOT NULL,
    name VARCHAR(40) NOT NULL,
    dob TIMESTAMPTZ NOT NULL,
    role VARCHAR(30) NOT NULL,
    contact_no VARCHAR(11) NOT NULL,
    image varchar(50),
    verified BOOLEAN DEFAULT FALSE
);

alter table doctor_staff add constraint doctor_staff_unique_constraint unique(doctor_id, name, contact_no);



EOF

#!/bin/bash


# npm install express pg ejs


psql -U postgres -h 127.0.0.1 << EOF   

\c aibers_health


INSERT INTO doctor VALUES (2, 'dr. kashan aslam shah', 'male', '1988-11-14', 'cardiologist', 'https://s3.ap-south-1.amazonaws.com/upload.aibers.health/doctor-2-1606387113573.png', '12345678990', 'Hello, i think doctor is not a profession its a duty of welfare'),(1, 'dr. moiz ahmed khan ali', 'male', '1990-03-12', 'cardiologist, ginacarlogist ', 'https://s3.ap-south-1.amazonaws.com/upload.aibers.health/doctor-1-1606715475443.jpg', '12345678900', 'I am a good doctor and also done phd and like hiking'),(3, 'dr. omer aziz mirza', 'male', '1977-07-06', 'cardiologist', 'https://s3.ap-south-1.amazonaws.com/upload.aibers.health/doctor-3-1606715303459.jpg', '12345678999', 'Hello, i think doctor is not a profession its a duty of welfare'),(4, 'dr. zawar ali', 'male', '1985-09-16', 'allergy specialist', 'https://s3.ap-south-1.amazonaws.com/upload.aibers.health/doctor-4-1606715517377.jpeg', '12345678000', 'Hello, i think doctor is not a profession its a duty of welfare'),(5, 'dr. athar niaz rana', 'male', '1972-02-26', 'allergy specialist', 'https://s3.ap-south-1.amazonaws.com/upload.aibers.health/doctor-5-1606715581390.jpg', '12345678009', 'Hello, i think doctor is not a profession its a duty of welfare');

update doctor set appointment_type = 'inPerson';
update doctor set appointment_type = 'teleHealth' where doctor_id = 2;
update doctor set appointment_type = 'both' where doctor_id = 1;
update doctor set appointment_type = 'both' where doctor_id = 5;


INSERT INTO doctor_facilities VALUES(1, 2, 'typhoid test'),(2, 1,  'blood gas analysis'),(3, 1, 'lung biopsy'),(4, 2, 'spirometry'), (5, 2, 'covid test'), (6, 1, 'covid test');


INSERT INTO doctor_qualification(doctor_id, qualification) VALUES(1, 'M.B.B.S, FRCP uk'),(1, 'Certificate of Specialist Doctor'),(1, 'Fellowship in intersive care Medicine and Heart & Lung Transplant '),(2, 'Pulmonologist '),(2, 'Critical care Physician ');


INSERT INTO hospital_location VALUES (1,'Advanced Medical Centre G8 Markaz Islamabad', 33.6983423136477 ,73.0489662569921),(2,'Islamabad International Hospital & Research Center' ,33.7253483637743, 72.970366787665),(3,'OPD, The Children Hospital, PIMS, Islamabad' ,33.7264905342376 ,73.0555108207652),(4,'Islamabad Medical and Surgical Hospital',33.7390534041325 ,73.0802300574316),(5,'Max Health Hospital',33.71278348769,73.0486443661356),(6,'KRL Hospital',33.6956466021933,73.0349114568766),(7,'Chinar International Hospital',33.5834193452075,73.1482079743438),(8,'Zobia Hospital',33.7002167726085,73.0266717113211),(9,'MedCity International Hospital & Plastic Surgery',33.7356273493061,73.0404046205802),(10,'Kulsum International Hospital',33.7379114010594,73.0706170209502);


INSERT INTO doctors_hospital_location VALUES(1, 2, 2, '09:00', '16:00', 'mon-fri', true, 2500), (2, 4, 2, '07:00', '15:00', 'mon-tue-wed-thu-fri', true, 2000),(3, 1, 2, '11:30', '17:00', 'mon-tue-wed-thu-fri', true, 1500),(4, 3, 1, '08:30', '17:00', 'mon-tue-wed-thu-fri', true, 1000),(5, 5, 1, '08:30', '17:30', 'sat-sun', true, 2000),(6, 4, 3, '10:30', '17:00', 'wed-thu-fri-sat', true, 1500),(7, 5, 3, '06:00', '09:00', 'tue-wed-thu-fri-sat', true, 3000),(8, 2, 3, '06:00', '09:00', 'wed-thu-fri-sat', true, 2000),(9, 6, 2, '11:00', '17:00', 'mon-wed-fri', true, 1000);


INSERT INTO patient VALUES (1,'sara khan','female','12/09/1978','AB+','Peshawar',1, NULL, '12345678990'),(2,'ali iqbal','male','09/11/1988','A+','Lahore',1, NULL, '12345678900'),(3,'ahmad','male','02/07/1991','O-','Karachi',1, NULL, '12345678999');

insert into favourite_doctor values(1,2,3),(1,2,2),(3,1,4),(1,1,5),(2,2,3),(2,3,8),(2,3,9);


INSERT INTO appointments VALUES (1,1,1,2,'NOW','First Appointment of patient 1 with doctor 2', 'upcoming', 6),(2,2,2,1,'NOW','First Appointment of patient 2 with doctor 1', 'canceled', 3),(3,1,1,2,'NOW','Second Appointment of patient 1 with doctor 2', 'completed', 4),(4,4,3,3,'NOW','First Appointment of patient 3 with doctor 3', 'upcoming', 1),(5,1,1,2,'NOW','Third Appointment of patient 1 with doctor 2', 'completed', 1),(6,4,3,3,'NOW','Second Appointment of patient 3 with doctor 3', 'completed', 1);


\copy symtoms from '/home/zarnain/Documents/GitHub/aibers_web/api/db/symptoms.csv' delimiter ',' csv header;


\copy diagnosis from '/home/zarnain/Documents/GitHub/aibers_web/api/db/diagnosis.csv' delimiter ',' csv header;


\copy medicines from '/home/zarnain/Documents/GitHub/aibers_web/api/db/medicines.csv' delimiter ',' csv header;


\copy medical_test from '/home/zarnain/Documents/GitHub/aibers_web/api/db/medical_tests.csv' delimiter ',' csv header;


INSERT INTO prescription VALUES (1,3,15,30, '//day-night'),(3,2,10,20,'//day-night'),(2,4,5,10,'//day-night'),(2,3,15,30, '//day-night'),(3,4,7,15, '//day-night');


INSERT INTO appointment_symtoms VALUES (1,3),(3,8),(2,2),(2,4),(3,7);

INSERT INTO appointment_medical_test VALUES (1,3),(3,8),(2,2),(2,4),(3,7);

INSERT INTO appointment_diagnosis VALUES (1,3),(3,8),(2,2),(2,4),(3,7);

insert into vitals(name, unit, normal_range) values
('height', 'cm', ''),
('weight', 'kg', ''),
('blood pressure', 'mmHg', '120/80'),
('heart beats', 'bpm', '60 - 100'),
('body temperature', 'F', '98.6'),
('bmi', 'kg/m(square)', '18.5 - 24.9');

insert into patient_vitals (vital_id, patient_id, current_value) values
(1, 1, '168'),
(2, 1, '61'),
(3, 1,'122/79'),
(4, 1,'85'),
(5, 1, '99.7'),
(6, 1, '22.6');

EOF


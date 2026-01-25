USE tanzeem_membership;
CREATE TABLE IF NOT EXISTS country_mast (
  country_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  country_name VARCHAR(50),
  active_status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_by VARCHAR(20) NOT NULL,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by_ip VARCHAR(15),
  updated_by VARCHAR(20),
  updated_date DATETIME ,
  updated_by_ip VARCHAR(15),
  deleted_by VARCHAR(20),
  deleted_date DATETIME,
  deleted_by_ip VARCHAR(15)
);

CREATE TABLE city_mast (
  city_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  city_name VARCHAR(50),
  country_id INT,
  active_status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_by VARCHAR(20) NOT NULL,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by_ip VARCHAR(15),
  updated_by VARCHAR(20),
  updated_date DATETIME ,
  updated_by_ip VARCHAR(15),
  deleted_by VARCHAR(20),
  deleted_date DATETIME,
  deleted_by_ip VARCHAR(15)
);

ALTER TABLE city_mast
ADD CONSTRAINT fk_city_country 
FOREIGN KEY (country_id) REFERENCES country_mast(country_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

CREATE TABLE qualification_mast (
  qualifaction_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  qualifaction_name VARCHAR(50),
  active_status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_by VARCHAR(20) NOT NULL,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by_ip VARCHAR(15),
  updated_by VARCHAR(20),
  updated_date DATETIME ,
  updated_by_ip VARCHAR(15),
  deleted_by VARCHAR(20),
  deleted_date DATETIME,
  deleted_by_ip VARCHAR(15)
  );

CREATE TABLE PROFESSION_MAST(
  PROFESSSION_ID INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  PROFESSION_NAME VARCHAR(50),
  active_status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_by VARCHAR(20) NOT NULL,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by_ip VARCHAR(15),
  updated_by VARCHAR(20),
  updated_date DATETIME ,
  updated_by_ip VARCHAR(15),
  deleted_by VARCHAR(20),
  deleted_date DATETIME,
  deleted_by_ip VARCHAR(15)
);

CREATE TABLE MEMBERSHIP_INFO(
membership_no varchar(20) PRIMARY KEY,                   
name varchar(100) ,
gender varchar(10) ,
husband_father_name varchar(100) ,
grand_father_father_in_law_name varchar(100) ,
cnic varchar(20) ,
native_city varchar(100) ,
dob date NOT NULL,
cast varchar(50) ,
source_of_income varchar(50),
category varchar(50) ,
blood_group varchar(5) ,
contact_no int ,
whatsapp_no int ,
email_address varchar(100) ,
home_address varchar(000) ,
country_id int,
city_id int,
PROFESSSION_ID INT,
qualifaction_id INT,
membership_info
FOREIGN KEY (country_id) REFERENCES country_mast (country_id),
FOREIGN KEY (city_id) REFERENCES city_mast (city_id),
FOREIGN KEY (PROFESSSION_ID) REFERENCES PROFESSION_MAST (PROFESSSION_ID),
FOREIGN KEY (qualifaction_id) REFERENCES qualification_mast (qualifaction_id)
);

CREATE TABLE dependent_detail(
  dependent_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  membership_no varchar(20),
  name VARCHAR(100) NOT NULL,   
  age INT,                      
  relation VARCHAR(50) NOT NULL, 
  created_by VARCHAR(20) NOT NULL,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by_ip VARCHAR(15),
  updated_by VARCHAR(20),
  updated_date DATETIME,
  updated_by_ip VARCHAR(15),
  deleted_by VARCHAR(20),
  deleted_date DATETIME,
  deleted_by_ip VARCHAR(15),
  FOREIGN KEY (membership_no) REFERENCES MEMBERSHIP_INFO(membership_no)     
);

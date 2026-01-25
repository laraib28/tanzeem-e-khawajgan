USE tanzeem_membership;

CREATE TABLE IF NOT EXISTS country_mast (
  country_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  country_name VARCHAR(50),
  active_status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_by VARCHAR(20) NOT NULL,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by_ip VARCHAR(15),
  updated_by VARCHAR(20),
  updated_date DATETIME,
  updated_by_ip VARCHAR(15),
  deleted_by VARCHAR(20),
  deleted_date DATETIME,
  deleted_by_ip VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS city_mast (
  city_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  city_name VARCHAR(50),
  country_id INT,
  active_status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_by VARCHAR(20) NOT NULL,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by_ip VARCHAR(15),
  updated_by VARCHAR(20),
  updated_date DATETIME,
  updated_by_ip VARCHAR(15),
  deleted_by VARCHAR(20),
  deleted_date DATETIME,
  deleted_by_ip VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS qualification_mast (
  qualifaction_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  qualifaction_name VARCHAR(50),
  active_status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_by VARCHAR(20) NOT NULL,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by_ip VARCHAR(15),
  updated_by VARCHAR(20),
  updated_date DATETIME,
  updated_by_ip VARCHAR(15),
  deleted_by VARCHAR(20),
  deleted_date DATETIME,
  deleted_by_ip VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS PROFESSION_MAST (
  PROFESSSION_ID INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  PROFESSION_NAME VARCHAR(50),
  active_status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_by VARCHAR(20) NOT NULL,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by_ip VARCHAR(15),
  updated_by VARCHAR(20),
  updated_date DATETIME,
  updated_by_ip VARCHAR(15),
  deleted_by VARCHAR(20),
  deleted_date DATETIME,
  deleted_by_ip VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS MEMBERSHIP_INFO (
  membership_no VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100),
  gender VARCHAR(10),
  husband_father_name VARCHAR(100),
  grand_father_father_in_law_name VARCHAR(100),
  cnic VARCHAR(20),
  native_city VARCHAR(100),
  dob DATE NOT NULL,
  cast VARCHAR(50),
  source_of_income VARCHAR(50),
  category VARCHAR(50),
  blood_group VARCHAR(5),
  contact_no INT,
  whatsapp_no INT,
  email_address VARCHAR(100),
  home_address VARCHAR(500),
  country_id INT,
  city_id INT,
  PROFESSSION_ID INT,
  qualifaction_id INT,
  FOREIGN KEY (country_id) REFERENCES country_mast(country_id),
  FOREIGN KEY (city_id) REFERENCES city_mast(city_id),
  FOREIGN KEY (PROFESSSION_ID) REFERENCES PROFESSION_MAST(PROFESSSION_ID),
  FOREIGN KEY (qualifaction_id) REFERENCES qualification_mast(qualifaction_id)
);

CREATE TABLE IF NOT EXISTS dependent_detail (
  dependent_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  membership_no VARCHAR(20),
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

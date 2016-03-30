<?php

/**
* Prepared By: Arun Kumar M, Zydesoft
*/

function checkPass($db, $username, $password) {
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$app->log->debug('checkPass: authenticating ' . $username);

	$res = false;
	$sql_query = "select * FROM ".$env['dbloginCollection'];
	try {
		$dbCon = getConnection();
		$stmt   = $dbCon->query($sql_query);
		$users  = $stmt->fetchAll(PDO::FETCH_OBJ);
		$dbCon = null;
		$uname = $users[0]->username;
		$pwd = $users[0]->password;
		$zyde_id = $users[0]->zyde_id;
		$zyde_role = $users[0]->zyde_role;
		if($username == $uname && $password == $pwd) {
			$res = true;
		}else {
			$res = false;
		}
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}   
	if($res) { 
		return true; 
	}
	return false;
}

function cleanMemberSession($db, $username){
	$app = \Slim\Slim::getInstance();
	$app->log->debug('cleanMemberSession: setting up new session for ' . $username);

	$_SESSION["user"]= $username;
	$app->setCookie('session', session_id(), '1 hour');
	$app->setCookie('username', $username, '1 hour');
}


function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }

    while(!isLoginAvailable($randomString)){
        $randomString = generateRandomString();
    }

    return $randomString;
}

function _api_viewEmployeeBuckets(){
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$params = $app->request->get();
	$where = $params['alpha'];
	$cmd = $params['cmd'];

	$usersTemp = array();

	if($where != 'All'){
		if($cmd == 'export') {
			$sql_query = "select * FROM ".$env['dbaddemployeeCollection']." where id ='".$where."'";
		}else {
			$sql_query = "select * FROM ".$env['dbaddemployeeCollection']." where firstname Like '".$where."%'";
		}
	}else{
		$sql_query = "select * FROM ".$env['dbaddemployeeCollection']."";
	}

	try {
		$dbCon = getConnection();
		$stmt   = $dbCon->query($sql_query);
		$users  = $stmt->fetchAll(PDO::FETCH_OBJ);
	}catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
	foreach ($users as $key => $value) {		
		if($users[$key]->trash != 1){
			$usersTemp[] = $value;
		}
	}
	
	header("Content-Type: application/json; charset=UTF-8");
	echo json_encode($usersTemp); // Send data to ajax call in jquery.
}

function getTableColumnName($table_name){
	$query = "SELECT Column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name ='".$table_name."'";

	try {
		$dbCon = getConnection();
		$stmt   = $dbCon->query($query);
		$data  = $stmt->fetchAll(PDO::FETCH_OBJ);
		return $data;
	}catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function _api_viewEmployeeProfile(){
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$params = $app->request->get();
	$id = $params['profile']['_id'];
	
	$sql_query = "select * FROM ".$env['dbaddemployeeCollection']." where id =" .$id;
	try {
		$dbCon = getConnection();
		$stmt   = $dbCon->query($sql_query);
		$profile  = $stmt->fetchAll(PDO::FETCH_OBJ);
	}catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}

	header("Content-Type: application/json; charset=UTF-8");
	echo json_encode($profile); // Send data to ajax call in jquery.
}

function _api_editEmployeeProfile(){
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$params = $app->request->get();
	$id = $params['emp_id'];
	$sql_query = "UPDATE ".$env['dbaddemployeeCollection']
					." SET `firstname`='".$params['firstname']
						."', `lastname`='".$params['lastname']
						."', `name_as_per_record`='".$params['name_as_per_record']
						."', `employee_number`='".$params['employee_number']
						."', `siri_card_no`='".$params['siri_card_no']
						."', `zyde_biometric_number`='".$params['zyde_biometric_number']
						."', `client_email_id`='".$params['client_email_id']
						."', `personal_mail_id`='".$params['personal_mail_id']
						."', `designation`='".$params['designation']
						."', `joining_date`='".$params['joining_date']
						."', `date_of_birth`='".$params['date_of_birth']
						."', `pan_card`='".$params['pan_card']
						."', `blood_group`='".$params['blood_group']
						."', `employee_status`='".$params['employee_status']
						."', `permanant_address`='".$params['permanant_address']
						."', `present_address`='".$params['present_address']
						."', `bank_name`='".$params['bank_name']
						."', `branch_name`='".$params['branch_name']
						."', `branch_address`='".$params['branch_address']
						."', `bank_acc_no`='".$params['bank_acc_no']
						."', `benificiary_name`='".$params['benificiary_name']
						."', `ifsc_code`='".$params['ifsc_code']
						."', `phone_number_1`='".$params['phone_number_1']
						."', `phone_number_2`='".$params['phone_number_2']
						."', `emergency_contact_person_name_1`='".$params['emergency_contact_person_name_1']
						."', `emergency_contact_person_phone_1`='".$params['emergency_contact_person_phone_1']
						."', `emergency_contact_person_name_2`='".$params['emergency_contact_person_name_2']
						."', `emergency_contact_person_phone_2`='".$params['emergency_contact_person_phone_2']
						."'  WHERE id=".$id;
	try {
		$dbCon = getConnection();
		$stmt   = $dbCon->query($sql_query);
		echo "Successfully updated";
	}catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	} 
}

function _api_deleteEmployeeProfile(){
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$params = $app->request->get();
	$id = $params['emp_id'];

	$sql_query = "UPDATE ".$env['dbaddemployeeCollection']
					." SET `trash`='1' WHERE id=".$id;
	try {
		$dbCon = getConnection();
		$stmt   = $dbCon->query($sql_query);
	}catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function _api_insertAddEmployeeBuckets(){
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$params = $app->request->post();
	$query = "INSERT INTO ".$env['dbaddemployeeCollection']."(firstname, lastname, name_as_per_record, gender, employee_number, siri_card_no, zyde_biometric_number, client_email_id, personal_mail_id, designation, joining_date, date_of_birth, pan_card, blood_group, employee_status, permanant_address, present_address, bank_name, branch_name, branch_address, bank_acc_no, benificiary_name, ifsc_code, phone_number_1, phone_number_2, emergency_contact_person_name_1, emergency_contact_person_phone_1, emergency_contact_person_name_2, emergency_contact_person_phone_2, photo)"
			." VALUES ('".$params['fname']
						."','". $params['lname']
						."','". $params['name_as_per_record']
						."','". $params['gender']
						."','". $params['employee_number']
						."','". $params['siri_card']
						."','". $params['zyde_biometric_no']
						."','". $params['client_email_id']
						."','". $params['personal_email_id']
						."','". $params['designation']
						."','". $params['joining_date']
						."','". $params['date_of_birth']
						."','". $params['pan_card']
						."','". $params['blood_group']
						."','". $params['employee_status']
						."','". $params['permanent_address']
						."','". $params['present_address']
						."','". $params['bank_name']
						."','". $params['branch_name']
						."','". $params['branch_address']
						."','". $params['bank_acc_number']
						."','". $params['benificiary_name']
						."','". $params['ifsc_code']
						."','". $params['phone_no_1']
						."','". $params['phone_no_2']
						."','". $params['emergency_con_name_1']
						."','". $params['emergency_con_phone_1']
						."','". $params['emergency_con_name_2']
						."','". $params['emergency_con_phone_2']
						."','". $params['photo']
					."')";
	try {
		$dbCon = getConnection();
		$stmt   = $dbCon->query($query);
		
		$dbCon = null;
		
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

?>
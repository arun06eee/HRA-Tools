<?php

/**
* Prepared By: Arun Kumar M, Zydesoft
*/
	// Import PHPMailer classes into the global namespace
	// These must be at the top of your script, not inside a function
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	require 'vendor/PHPMailer/PHPMailer/src/Exception.php';
	require 'vendor/PHPMailer/PHPMailer/src/PHPMailer.php';
	require 'vendor/PHPMailer/PHPMailer/src/SMTP.php';
	require 'vendor/autoload.php';

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

function _showreports(){
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$params = $app->request->get();
	$id = $params['employee'];

	for($i=0; $i<count($id);$i++){
		if($params['from_date'] != '' && $params['to_date'] != ''){
			$sql_query = "SELECT * FROM zyde_leave_form INNER JOIN zyde_employee_bucket ON zyde_employee_bucket.employee_number = zyde_leave_form.employee_number WHERE zyde_leave_form.from_date >= "."'".$params['from_date']."'"." AND zyde_leave_form.from_date <= "."'".$params['to_date']."'"." AND zyde_leave_form.employee_number = ".$id[$i];
			/*$sql_query = "SELECT * FROM ".$env['leaveform']." WHERE from_date >= "."'".$params['from_date']."'"." AND from_date <= "."'".$params['to_date']."'"." AND employee_number = ".$id[$i];*/
		}else{
			//$sql_query = "SELECT * FROM ".$env['leaveform']." WHERE employee_number =" .$id[$i];
			$sql_query = "SELECT * FROM zyde_leave_form INNER JOIN zyde_employee_bucket ON zyde_employee_bucket.employee_number = zyde_leave_form.employee_number WHERE zyde_leave_form.employee_number = ".$id[$i];
		}
		try {
			$dbCon = getConnection();
			$stmt   = $dbCon->query($sql_query);
			$profile  = $stmt->fetchAll(PDO::FETCH_OBJ);
		}catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}';
		}
		$result[] = $profile;
	}
	foreach($result as $key => $obj){
		foreach($result[$key] as $val){
			$tag_name = unserialize($val->tag_name);
			$res['result'][] = array(
					'employee_number' => $val->employee_number,
					'employee_name'	  => $val->name_as_per_record,
					'date_applied'	  => $val->date_applied,
					'from_date'		  => $val->from_date,
					'to_date'		  => $val->to_date,
					'reason'		  => $val->reason,
					'tag_name'		  => $tag_name
				);
		}
	}
	header("Content-Type: application/json; charset=UTF-8");
	echo json_encode($res); // Send data to ajax call in jquery.
}

function _resetPassword(){
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$params = $app->request->get();
	$query = "UPDATE ".$env['dbloginCollection']." SET `password` = '" .$params['password']."' where password ='" .$params['old_password']."'";
	try {
		$dbCon = getConnection();
		$stmt   = $dbCon->query($query);
		$dbCon = null;
		$count = $stmt->rowCount();
		if($count > 0){
			$result['success'] = "Password Changed Successfully!!!";
		}else{
			$result['fail']	= "Old Password not exist!!";
		}
		echo json_encode($result);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}		
}

function _forgot_password(){
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$params = $app->request->get();
	$sql_query = "SELECT * FROM ".$env['dbloginCollection']." WHERE username =" ."'".$params['user_name']."'";

		$dbCon = getConnection();
		$stmt   = $dbCon->query($sql_query);
		$user  = $stmt->fetchAll(PDO::FETCH_OBJ);
		$count = $stmt->rowCount();
	if($count > 0) {
		$mail = new PHPMailer(true);

		try {
			//Server settings
			$mail->SMTPDebug = 2;
			$mail->isSMTP();
			$mail->Host = 'smtp.zoho.com';
			$mail->SMTPAuth = true;
			$mail->Username = 'dhineshkumar.r@zydesoft.com';
			$mail->Password = 'Pass123$';
			$mail->SMTPSecure = 'tls';
			$mail->Port = 587;

			//Recipients
			$mail->setFrom('dhineshkumar.r@zydesoft.com', 'ZydeSoft');
			$mail->addAddress($params['E_mail']);

			//Content
			$mail->isHTML(true);
			$mail->Subject = 'Password';
			$mail->Body    = 'Here is your password '.$user[0]->password;

			$mail->send();
			echo '{"success" : "Password has been sent"}';
		} catch (Exception $e) {
			echo '{"error: "."'.$mail->ErrorInfo.'"}';
		}
	}else {
		echo '{"error":"Username Does Not exist!!"}';
	}
}

function _api_viewDefaultLeave(){
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$params = $app->request->get();

	$sql_query = "select * FROM ".$env['defaultleave'];
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
function _api_rolesRecords(){
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$params = $app->request->get();
	$query = 'SELECT `username`,`employee_number`,`zyde_role`,`employee_status` FROM '.$env['dbloginCollection'];
	try {
		$dbCon = getConnection();
		$stmt   = $dbCon->query($query);
		$role  = $stmt->fetchAll(PDO::FETCH_OBJ);
	}catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
	header("Content-Type: application/json; charset=UTF-8");
	echo json_encode($role);
}
function _api_assignrole(){
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$params = $app->request->get();
	$result = array();
	$sql_query = "select * FROM ".$env['dbaddemployeeCollection']." where client_email_id ='" .$params['username']."'";

	try {
		$dbCon = getConnection();
		$stmt   = $dbCon->query($sql_query);
		$profile  = $stmt->fetchAll(PDO::FETCH_OBJ);
	}catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
	if(count($profile) > 0){
		$login_sql_query = "select * FROM ".$env['dbloginCollection']." where username ='" .$params['username']."'";

		try {
			$dbCon = getConnection();
			$stmt   = $dbCon->query($login_sql_query);
			$login_profile  = $stmt->fetchAll(PDO::FETCH_OBJ);
		}catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}';
		}
		if(count($login_profile) <= 0){
			$query = "INSERT INTO ".$env['dbloginCollection']."(username, password, zyde_id, zyde_role, employee_number, employee_status)"
							." VALUES ('".$params['username']
										."','". $params['setpassword']
										."','". $profile[0]->id
										."','". $params['employee_role']
										."','". $profile[0]->employee_number
										."','". $profile[0]->employee_status
									."')";
			try {
				$dbCon = getConnection();
				$stmt   = $dbCon->query($query);

				$dbCon = null;

			} catch(PDOException $e) {
				echo '{"error":{"text":'. $e->getMessage() .'}}';
			}
			$result['result'] = "Login Created Successfully";
		}else{
			if($params['update'] == 'true'){
				$update_query = "UPDATE ".$env['dbloginCollection']." SET `password` = '" .$params['setpassword']."', `zyde_role` = '".$params['employee_role']."' where employee_number ='" .$profile[0]->employee_number."'";
				try {
					$dbCon = getConnection();
					$stmt   = $dbCon->query($update_query);

					$dbCon = null;

				} catch(PDOException $e) {
					echo '{"error":{"text":'. $e->getMessage() .'}}';
				}
				$result['result'] = "Login details are updated for this ".$params['username']." user";
			}else{
				$result['result'] = "Login has already created for this user";
			}
		}
	}else{
		$result['wrong'] = "Sorry This record is not in our List Please select from autocomplete";
	}

	echo json_encode($result);
}
function _api_addtags(){
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$params = $app->request->post();
	$query = "INSERT INTO ".$env['tags']."(tag_name, tag_desc, tag_color, text_color)".
	" VALUES ('".$params['tag_name']
				."','".	$params['tag_desc']
				."','".	$params['tag_color']
				."','". $params['color']
				."')";
	try {
		$dbCon = getConnection();
		$stmt   = $dbCon->query($query);

		$dbCon = null;
		echo true;

	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}
function _api_showtags() {
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$params = $app->request->get();

	$sql_query = "select * FROM ".$env['tags'];
	try {
		$dbCon = getConnection();
		$stmt   = $dbCon->query($sql_query);
		$showtags  = $stmt->fetchAll(PDO::FETCH_OBJ);
	}catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}

	header("Content-Type: application/json; charset=UTF-8");
	echo json_encode($showtags);
}
function _api_deletetags(){
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$params = $app->request->get();
	$query = "DELETE FROM ".$env['tags']
				." WHERE `tag_name` ="
				."'"
				.$params['delete_data']
				."'";
	try {
		$dbCon = getConnection();
		$stmt   = $dbCon->query($query);

		$dbCon = null;
		echo true;

	} catch(PDOException $e) {
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
function _api_leavemodule(){
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$params = $app->request->get();
	$date = date('Y-m-d');
	$tag_name = serialize($params['tag_name']);
	$result = array();
	$query = "INSERT INTO ".$env['leaveform']."(employee_number, date_applied, from_date, to_date, reason, tag_name)"
			." VALUES (		'".	$params['employee_status']
						."','". $date
						."','". $params['from_date']
						."','". $params['to_date']
						."','". $params['reason']
						."','". $tag_name
					."')";
	try {
		$dbCon = getConnection();
		$stmt   = $dbCon->query($query);

		$dbCon = null;
		$result['success'] = "Applied Leave Successfully!!!";
		echo json_encode($result);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}


function _api_compoffmodule(){
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$params = $app->request->get();
	$result = array();
	for ($i=0; $i < count($params['employee_status']); $i++) {
		$employee_status_splited = explode(",", $params['employee_status'][$i]);
		$employee_number = trim($employee_status_splited[1]);
		$query = "INSERT INTO ".$env['compoffform']."(employee_number, compoff_start_date, compoff_end_date, hours, reason_for_compoff, used, bill_client, comments)"
				." VALUES ('".$employee_number
							."','". $params['start_date']
							."','". $params['end_date']
							."','". $params['hours']
							."','". $params['reason']
							."','". $params['compoff_used']
							."','". $params['bill_clients']
							."','". $params['comments']
						."')";
		try {
			$dbCon = getConnection();
			$stmt   = $dbCon->query($query);

			$dbCon = null;
			$result['success'] = "Compoff Applied Leave Successfully!!!";
			echo json_encode($result);
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}';
		}
	}
}

function _api_defaultleave(){
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$params = $app->request->get();
	$result = array();
	$query = "INSERT INTO ".$env['defaultleave']."(leave_year, total_leave)"
				." VALUES (		'".	$params['set_year']
							."','". $params['set_total_leave']
						."')";
	try {
		$dbCon = getConnection();
		$stmt   = $dbCon->query($query);

		$dbCon = null;
		$result['success'] = "Total Leaves are updated Successfully!!!";
		echo json_encode($result);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}


?>

<?php

/**
* Prepared By: Arun Kumar M, Zydesoft
*/

require('functions.php');

function _api_login() {
    $app = \Slim\Slim::getInstance();
    $env = $app->environment();

    // Connect to Mysql
	$db = "";

    // Get the params
    $params = $app->request->post();

    // Store the params -> value in debug log
    foreach ($params as $param => $value) {
        $app->log->debug('Param: ' . $param . " = " . $value);
    }

    if (!isset($params['username']) || !isset($params['password'])) {
        $app->view()->appendData( array( 'failmess' => 'Wrong email or password') );
        $app->View()->appendData( array( 'signin' => true) );
        $app->render('login.html');
        $app->log->debug('username or password param is missing');
        return;
    }

    // If the remember me checkbox is checked store in cockie
    if (isset($params['remember'])) {
        if ($params['remember'] == 'yes') {
            $app->setCookie('username', $params['username'], '4 weeks');
            $app->log->debug("Storing username in browser for smooth logins");
        }
    }

    // Verify the session
    $res = checkPass($db, $params['username'], $params['password']);
    if ($res) {
        #set the session for the user here
        cleanMemberSession($db, $params['username']);
        $app->log->info('User ' . $params['username'] . ' logged in');
        $app->redirect($env['baseurl'] . '/addemployee');
    } else {
        $app->log->debug('username or password failed to validate');
        $app->view()->appendData( array( 'failmess' => 'Wrong email or password') );
        $app->view()->appendData( array( 'signin' => true) );
        $app->render('login.html');
    }
}


function _api_logout() {
    $app = \Slim\Slim::getInstance();
    $env = $app->environment();

    // Connect to Mysql

    $username = $app->getCookie('username');
    if ($username) {
        $app->deleteCookie('username');
    }
    if(isset($_SESSION["user"])){
        unset($_SESSION["user"]);
    }
    if (isset($_SESSION['access_token'])){
        unset($_SESSION["access_token"]);
    }
    if (isset($_SESSION['username'])){
        unset($_SESSION["username"]);
    }
    $app->deleteCookie('session');
    session_unset();

    $app->log->info('Logged out user: ' . $username);
    $app->redirect($env['baseurl'] . '/login');
}


function _api_base() {
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$app->view()->appendData( array( 'navbar' => true) );
	$app->render('base.html');
}

function getConnection() {
    $conn = null;
	try {
        $db_username = "root";
        $db_password = "root";
        $db_name = "zydehra";
        $conn = new PDO("mysql:host=localhost;dbname=".$db_name, $db_username, $db_password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    } catch(PDOException $e) {
        echo 'ERROR: ' . $e->getMessage();
    }
    return $conn;
}

?>

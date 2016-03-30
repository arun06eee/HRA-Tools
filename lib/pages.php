<?php
/**
* Prepared By: Arun Kumar M, Zydesoft
*/

include_once("./lib/functions.php");

function _pages_login() {
	// Get the basics
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();

	// If remember me has been opted
	$username = $app->getCookie('username');

	if (isset($username)) {
		$app->view()->appendData( array( 'username' => $username) );
	}

	// Setup the page for rendering
	$app->view()->appendData( array( 'title' => 'Login') );
	$app->view()->appendData( array( 'signin' => true) );

	// Render index view
	$app->render('login.html');
}

function _pages_addemployee(){
    // Get the basics
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	// Setup the page for rendering
	$app->view()->appendData( array( 'title' => 'AddEmployee') );
	$app->view()->appendData( array( 'addemployee' => true) );
	
	//$app->view()->appendData( array( 'emp_lastname' => "") );

	// Render index view
	$app->render('addemployee.html');
}

function _pages_viewemployee(){
    // Get the basics
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();

	// Setup the page for rendering
	$app->view()->appendData( array( 'title' => 'ViewEmployee') );
	$app->view()->appendData( array( 'viewemployee' => true) );
	// Render index view
	$app->render('viewemployee.html');
}

function _pages_userrole(){
    // Get the basics
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();

	// Setup the page for rendering
	$app->view()->appendData( array( 'title' => 'User Role') );
	$app->view()->appendData( array( 'userrole' => true) );
	// Render index view
	$app->render('userrole.html');
}

?>

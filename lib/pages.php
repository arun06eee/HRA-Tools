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

function _pages_roleemployee(){
    // Get the basics
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();

	// Setup the page for rendering
	$app->view()->appendData( array( 'title' => 'Role') );
	$app->view()->appendData( array( 'role' => true) );
	// Render index view
	$app->render('role.html');
}


function _pages_userrole(){
    // Get the basics
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();

	// Setup the page for rendering
	$app->view()->appendData( array( 'title' => 'Role') );
	$app->view()->appendData( array( 'role' => true) );
	// Render index view
	$app->render('role.html');
}

function _pages_leaveform(){
    // Get the basics
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();

	// Setup the page for rendering
	$app->view()->appendData( array( 'title' => 'Add Leave') );
	$app->view()->appendData( array( 'leaveform' => true) );
	// Render index view
	$app->render('leaveform.html');
}

function _pages_leavemodule(){
    // Get the basics
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();

	// Setup the page for rendering
	$app->view()->appendData( array( 'title' => 'Apply leave') );
	$app->view()->appendData( array( 'leaveform' => true) );
	// Render index view
	$app->render('leaveform.html');
}

function _pages_compoffmodule(){
    // Get the basics
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();

	// Setup the page for rendering
	$app->view()->appendData( array( 'title' => 'Add Compoff') );
	$app->view()->appendData( array( 'compoffform' => true) );
	// Render index view
	$app->render('compoffform.html');
}

?>

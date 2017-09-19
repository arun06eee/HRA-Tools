<?php
require './vendor/autoload.php';

error_reporting(E_ALL);

// Prepare app
$app = new \Slim\Slim(array(
    'cookies.encrypt' => true,
    'cookies.secret_key' => 'POwIlQkf',
    'templates.path' => './templates',
));

// Something is using the session so let's start the SessionCookie
$app->add(new \Slim\Middleware\SessionCookie(array(
    'expires' => '60 minutes',
    'path' => '/',
    'domain' => null,
    'secure' => false,
    'httponly' => false,
    'name' => 'slim_session',
    'secret' => 'CHANGE_ME',
    'cipher' => MCRYPT_RIJNDAEL_256,
    'cipher_mode' => MCRYPT_MODE_CBC
)));

// Setup the CSRF Token middleware
$app->add(new \Slim\Extras\Middleware\CsrfGuard());

// Prepare view
$app->view(new \Slim\Views\Twig());
$app->view->parserOptions = array(
    'charset' => 'utf-8',
    'cache' => realpath('../templates/cache'),
    'auto_reload' => true,
    'strict_variables' => false,
    'autoescape' => true
);

// Add the debug extension to Twig
$app->view->parserExtensions = array( new Twig_Extension_Debug());
$app->view->parserOptions = array('debug' => true);
$app->view->parserExtensions = array(new \Slim\Views\TwigExtension());

// Define some globals
$env = $app->environment();
$env['baseurl'] = 'http://localhost/HRA/HRA-Tools';
$env['mysqlserver'] = 'mysql://127.0.0.1:3306';
$env['dbname'] = "zydehra";
$env['dbloginCollection'] = "zyde_user_login";
$env['dbaddemployeeCollection'] = "zyde_employee_bucket";
$env['leaveform'] = "zyde_leave_form";
$env['compoffform'] = "zyde_compoff_form";
$env['defaultleave'] = "zyde_default_leave";
$env['tags'] = "zyde_tags";

// Load the includes
require('./lib/api.php');
require('./lib/pages.php');

function authorize($role = 'read') {
    return function () use ($role) {
        // make the globals available
        $app = \Slim\Slim::getInstance();
        $env = $app->environment();

        // See if there's a cookie for us
        $username = $app->getCookie('username');

        // Check if user is logged in
        if(!empty($username)) {
            $app->view()->appendData( array( 'username' => $username ) );
			error_log('redirect Code ok...so logging in');
        } else {
			error_log('not loggedin so returning to login');
			$app->redirect($env['baseurl'] . '/login');
        }
    };
}

// Setup the before routing hook
$app->hook('slim.before.router', function () use ($app) {
    // Setup the basic parameters
    $env = $app->environment();
    $app->view()->appendData( array( 'baseurl' => $env['baseurl'] ) );
});

// Define routes
$app->get( '/login',								'_pages_login');
$app->post('/login',								'_api_login');
$app->get( '/logout',								'_api_logout');
$app->get('/',						authorize(),    '_api_base');
$app->get( '/addemployee',          authorize(),    '_pages_addemployee');

//$app->get( '/role',                 authorize(),    '_pages_roleemployee');
//$app->get( '/rolerecords',          authorize(),    '_api_rolesRecords');
//$app->get( '/role',                 authorize(),    '_api_viewEmployeeBuckets');
//$app->get( '/assignrole',  		    authorize(),    '_api_assignrole');

$app->post( '/addemployee',  		authorize(),    '_api_insertAddEmployeeBuckets');
$app->get( '/viewemployee',  		authorize(),    '_pages_viewemployee');
$app->get( '/viewemployeebuckets',  authorize(),    '_api_viewEmployeeBuckets');
$app->get( '/viewemployeeprofile',  authorize(),    '_api_viewEmployeeProfile');
$app->get( '/updateemployee',       authorize(),	'_api_editEmployeeProfile');
$app->get( '/deleteemployee',  		authorize(),    '_api_deleteEmployeeProfile');
//$app->get( '/userrole',  		    authorize(),    '_pages_userrole');
$app->get( '/leaveform',            authorize(),    '_pages_leaveform');
$app->get( '/storeleaveform',       authorize(),    '_api_leavemodule');
$app->get( '/compoffform',          authorize(),    '_pages_compoffmodule');
$app->get( '/storecomoffform',  	authorize(),    '_api_compoffmodule');
$app->get( '/leavemaintanance',     authorize(),    '_pages_leavemaintanance');
$app->get( '/defaultleave',         authorize(),    '_api_defaultleave');
$app->get( '/viewldefaultleave',    authorize(),    '_api_viewDefaultLeave');
$app->get( '/tags',                 authorize(),    '_tags');
$app->post( '/addtags',             authorize(),    '_api_addtags');
$app->get( '/showtags',             authorize(),    '_api_showtags');
$app->get( '/deletetags',           authorize(),    '_api_deletetags');
$app->get( '/reports',              authorize(),    '_reports');
$app->get( '/showreports',          authorize(),    '_showreports');
$app->get( '/changePassword',       authorize(),    '_change_password');
$app->get( '/passwordreset',        authorize(),    '_resetPassword');

$app->notFound(function () use ($app) {
	// make the globals available
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();

	// See if there's a cookie for us
	$username = $app->getCookie('username');

	// Check if user is logged in
	if( !empty($username) && isset($_SESSION['user']) ) {
		$app->render('404.html');
	} else {
		$app->redirect($env['baseurl'] . '/login');
	}
});

// Run app
$app->run();
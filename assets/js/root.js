(function(){
	$("#username").focus();
	if (window.location.pathname=="/drm"||window.location.pathname=="/drm/") {
		window.location.href="/drm/actions/index";
   	}
    function checkLoginChars() {
		var login = document.forms['loginform'].j_username.value;

		if (login.indexOf("\\")>-1) {
			alert("Your user name contains invalid characters. Please try again.");
			return false;
		}
		document.forms['loginform'].j_username.value=login.trim();
	}
})();
$(function(){
	var forgotPassword = {
		emp_base64String: null,
		init : function () {
			var that = this;
			$(".forgot-password-btn").click(function(){
				var E_mail = $("#E_mail").val();
				if(E_mail == ""){
					forgotPassword.fnerrorMessage('show', 'forgotPassword', 'glyphicon-warning-sign', 'Enter Email Address!!', 'bg-danger');
				}else if(!forgotPassword.isValidEmailAddress(E_mail)){
					forgotPassword.fnerrorMessage('show', 'forgotPassword', 'glyphicon-warning-sign', 'Enter valid Email Address!!', 'bg-danger');
				}else{
					var url = $("#baseurl").val() + "/forgotpass",
					data = {
						"E_mail": E_mail
					};
					$("#spinner").removeClass('hidden');
					$(".hidecontent").addClass('hidden');
					that.request(url, data, 'GET', function(json){
						if(json.success){
							$("#passWindow").modal('show');
							$("#forgotPassword input").val('');
							$("#spinner").addClass('hidden');
							$(".hidecontent").removeClass('hidden');
						}else{
							$("#spinner").addClass('hidden');
							$(".hidecontent").removeClass('hidden');
							forgotPassword.fnerrorMessage('show', 'forgotPassword', 'glyphicon-warning-sign', json.error, 'bg-danger');
						}
					});
				}
				setTimeout(function(){
				    forgotPassword.fnerrorMessage('hide', 'forgotPassword', 'glyphicon-warning-sign', null, 'bg-danger');
				}, 3000);
                
                return false;
			});
		},
		isValidEmailAddress: function(emailAddress) {
			var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
			return pattern.test(emailAddress);
		},
		fnerrorMessage: function(type, id, classes, msg, status) {
			if(type == 'show') {
				$("#"+id+" .errorstyle").removeClass("hidden");
				$("#"+id+" .errorstyle").addClass(status);
				$("#"+id+" .errorstyle>i").addClass(classes);
				$("#"+id+" .errormsg").empty().append(msg);	
			}else {
				$("#"+id+" .errorstyle").addClass("hidden");
				$("#"+id+" .errorstyle>i").removeClass("glyphicon-warning-sign glyphicon-ban-circle glyphicon-ok");
				$("#"+id+" .errormsg").empty();
				$("#"+id+" .errorstyle").removeClass('bg-danger bg-success');
			}
		},
		request :  function (url, data,type, callback){
			$.ajax({
				url: url,
				type: type,
				data: data,
				contentType: 'application/json',
				dataType: 'json',
				success: function(result) {
					callback(result);
				}
			});
		}
	};
	forgotPassword.init();
});
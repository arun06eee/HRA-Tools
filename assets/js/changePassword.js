$(function(){
	var changePassword = {
		emp_base64String: null,
		init : function () {
			var that = this;
			var url = $("#baseurl").val() + "/passwordData";
			/*data = {
					alpha: "All",
					csrf_token: $("#csrf_token").val(),
					cmd : 'view'
				};
			that.request(url, data, 'GET', function(json){
				console.log(json);
			});*/
			$(".change-password-btn").click(function(){
				var old_pass = $("#old_pass").val(),
					new_pass = $("#new_pass").val(),
					confirm_pass = $("#confirm_pass").val();
				if(old_pass == "" || new_pass == "" || confirm_pass == ""){
					changePassword.fnerrorMessage('show', 'changePassword', 'glyphicon-warning-sign', 'Fill all the fields!!', 'bg-danger');
				}else if(new_pass != confirm_pass){
					changePassword.fnerrorMessage('show', 'changePassword', 'glyphicon-warning-sign', 'New Password and Confirm Password should be same!!', 'bg-danger');
				}else{
					var url = $("#baseurl").val() + "/passwordreset",
					data = {
						"old_password": old_pass,
						"password": new_pass
					}
					that.request(url, data, 'GET', function(json){
						if(json.success){
							changePassword.fnerrorMessage('show', 'changePassword', 'glyphicon-ok', json.success, 'bg-success');
							$("#changePassword input").val('');
						}else{
							changePassword.fnerrorMessage('show', 'changePassword', 'glyphicon-warning-sign', json.fail, 'bg-danger');
						}
					});
				}
				setTimeout(function(){
				    changePassword.fnerrorMessage('hide', 'changePassword', 'glyphicon-warning-sign', null, 'bg-danger');
				}, 3000);
			});
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
	changePassword.init();
});
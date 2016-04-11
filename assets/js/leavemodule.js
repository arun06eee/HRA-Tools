$(function(){
	var leaveM = {
		emp_base64String: null,
		init : function () {
			var that = this;
			var controller = $("#baseurl").val() + "/viewemployeebuckets",
				data = {
					alpha: "All",
					csrf_token: $("#csrf_token").val(),
					cmd : 'view'
				};
			that.request(controller, data, 'get', function(json){
				var options = '';
				for (var mainKey in json){
					var abc = json[mainKey].firstname + ', ' + json[mainKey].employee_number;
					options += '<option value="' + abc +'">' + abc + '</option>';
				}
				$("select#emp_name").html(options);
			});
			that.fnSaveLeaveModule();
		},
		fnSaveLeaveModule: function(){
			var that = this;
			$(".save-leavemodule-btn").click(function(event){
				var selected_employees = [];
				$('#emp_name :selected').each(function(i, selected){ 
				  selected_employees[i] = $(selected).text();
				});
				var controller = $("#baseurl").val() + "/storeleaveform",
				data = {
					"csrf_token": $("#csrf_token").val(),
					"employee_status":selected_employees,
					"date_applied": $("#id_date_applied").val(),
					"from_date": $("#id_from_date").val(),
					"to_date": $("#id_to_date").val(),
					"leave_type": $("#emp_leave_type").val(),
					"reason": $("#lve_reason").val(),
					"applied_adp": $("#applied_ADP").val(),
					"leave_mode": $("#leave_mode").val(),
					"comments": $("#lve_comments").val(),
				};
				$("#emp_name option:selected").removeAttr("selected");
				$(".leave-dates").val('');
				$(".leave_details").val('');
				that.request(controller, data, 'GET', function(json){
					that.fnerrorMessage('show', 'leaveform-details', 'glyphicon-ok', json.success, 'bg-success');
					setTimeout(function(){
				    	that.fnerrorMessage('hide', 'leaveform-details', 'glyphicon-ok', null, 'bg-success');
				    }, 3000);
				});
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
				},
				error: function() {
					leaveM.fnerrorMessage('show', 'leaveform-details', 'glyphicon-warning-sign', 'Error occured.Try again', 'bg-danger');
					console.log('error occured');
					setTimeout(function(){
				    	leaveM.fnerrorMessage('hide', 'leaveform-details', 'glyphicon-warning-sign', null, 'bg-danger');
				    }, 3000);
				}
			});
		}
	};
	leaveM.init();
});
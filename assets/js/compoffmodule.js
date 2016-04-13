$(function(){
	var compoffM = {
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
				$("select#com_emp_name").html(options);
			});
			that.fnSaveCompoffModule();
		},
		fnSaveCompoffModule: function(){
			var that = this;
			$(".save-compoffmodule-btn").click(function(event){
				var selected_employees = [];
				$('#com_emp_name :selected').each(function(i, selected){ 
				  selected_employees[i] = $(selected).text(); 
				});
				var controller = $("#baseurl").val() + "/storecomoffform",
				data = {
					"csrf_token": $("#csrf_token").val(),
					"employee_status":selected_employees,
					"start_date": $("#id_start_date").val(),
					"end_date": $("#id_end_date").val(),
					"hours": $("#emp_work_hours").val(),
					"reason": $("#id_compoff_reason").val(),
					"compoff_used": $("#id_compoff_used").val(),
					"bill_clients": $("#id_bill_clients").val(),
					"comments": $("#id_compoff_comments").val(),
				};
				$("#com_emp_name option:selected").removeAttr("selected");
				$(".com_dates").val('');
				$(".compoff_details").val('');
				that.request(controller, data, 'GET', function(json){
					that.fnerrorMessage('show', 'compoffform-details', 'glyphicon-ok', json.success, 'bg-success');
					setTimeout(function(){
				    	that.fnerrorMessage('hide', 'compoffform-details', 'glyphicon-ok', null, 'bg-success');
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
		request :  function (url, data, type, callback){
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
					compoffM.fnerrorMessage('show', 'compoffform-details', 'glyphicon-warning-sign', 'Error occured.Try again', 'bg-danger');
					setTimeout(function(){
				    	compoffM.fnerrorMessage('hide', 'compoffform-details', 'glyphicon-warning-sign', null, 'bg-danger');
				    }, 3000);
				}
			});
		}
	};
	compoffM.init();
});
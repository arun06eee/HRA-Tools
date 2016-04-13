$(function(){
	var maintanance = {
		emp_base64String: null,
		init : function () {
			var that = this;
			$("#id_set_total_leave").on('keypress', function (evt) {
                if((evt.which != 46) &&
                    (evt.which != 43) &&
                    (evt.which != 45) &&
                    ((evt.which < 48 || evt.which > 57) &&
                    (evt.which != 0 && evt.which != 8))) {
                        evt.preventDefault();
                }
			});
			that.fnSaveLeaveMaintanance();
		},
		fnSaveLeaveMaintanance: function(){
			var that = this;
			$(".save-totalLeave-btn").click(function(event){
				var controller = $("#baseurl").val() + "/defaultleave",
				data = {
					"csrf_token": $("#csrf_token").val(),
					"set_default_leave":$("#id_set_total_leave").val()
				};
				$(".id_set_total_leave").val('');
				that.request(controller, data, 'GET', function(json){
					that.fnerrorMessage('show', 'leavemaintanance-details', 'glyphicon-ok', json.success, 'bg-success');
					setTimeout(function(){
				    	that.fnerrorMessage('hide', 'leavemaintanance-details', 'glyphicon-ok', null, 'bg-success');
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
					maintanance.fnerrorMessage('show', 'leaveform-details', 'glyphicon-warning-sign', 'Error occured.Try again', 'bg-danger');
					console.log('error occured');
					setTimeout(function(){
				    	maintanance.fnerrorMessage('hide', 'leaveform-details', 'glyphicon-warning-sign', null, 'bg-danger');
				    }, 3000);
				}
			});
		}
	};
	maintanance.init();
});
$(function(){
	var role = {
		emp_base64String: null,
		init : function () {
			var that = this,
			obj = {'csrf_token': $("#csrf_token").val()},
			usrname = [];
			that.request($("#baseurl").val()+"/rolerecords", obj, 'get', function(json){
				this.json = $.parseJSON(json);
				$('#user-roles').DataTable( {
			        "data": this.json,
			        "columns": [
			            { "data": "username" },
			            { "data": "zyde_role" }
			        ]
			    } );
			});
			var controller = $("#baseurl").val() + "/viewemployeebuckets",
			data = {
				alpha: "All",
				csrf_token: $("#csrf_token").val(),
				cmd : 'view'
			};
			that.request(controller, data, 'get', function(json){
				this.json = $.parseJSON(json);
				for(var viewjsn in this.json){
					usrname.push(this.json[viewjsn].client_email_id);
				}
				role.fnAutocomplete(usrname);
			});

			var role_record = {};
			$(".save-role-btn").click(function(e){
				$('.role-play').each(function(i, val) {
					if($.trim($(this).val()) != "") {		
						if($(this).attr("zyde-service") != undefined){
							role_record[$(this).attr("zyde-service")] = $(this).val();
						}
					}
				});
				role_record['csrf_token'] = $("#csrf_token").val();
				that.request($("#baseurl").val() + "/assignrole", role_record, 'get', function(json){

				});
			});
		},
		fnAutocomplete: function(usrname){
			$( "#username_id" ).autocomplete({
		    	source: usrname
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
				success: function(result) {
					callback(result);
				},
				error: function() {
					role.fnerrorMessage('show', 'role-details', 'glyphicon-warning-sign', 'Error occured.Try again', 'bg-danger');
					console.log('error occured');
				}
			});
		}
	};
	role.init();
});
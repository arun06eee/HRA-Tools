$(function(){
	var role = {
		emp_base64String: null,
		isAssigneOneTime: false, 
		dt:null,
		init : function () {
			var that = this,
			obj = {'csrf_token': $("#csrf_token").val()},
			isActive = ['Active', 'Inactive'],
			usrname = [];
			that.request($("#baseurl").val()+"/rolerecords", obj, 'get', function(json){
				this.json = $.parseJSON(json);
				for(var act in this.json){
					this.json[act].employee_status = isActive[this.json[act].employee_status];
				}
				role.dt = $('#user-roles').dataTable( {
			        "data": this.json,
			        "columnDefs": [ {
			            "targets": -1,
			            "defaultContent": "<button>Click!</button>"
			        } ],
			        "columns": [
			            { "data": "username" },
			            { "data": "employee_number" },
			            { "data": "zyde_role" },
			            { "data": "employee_status" },
			            {
				            "mData": null,
				            "bSortable": false,
				           	"mRender": function (o) { return '<a class="btn btn-info btn-sm btn-edit" href=#/>' + 'Edit' + '</a>'; }
				        }
			        ]
			    });
				$('#user-roles a.btn-edit').on( 'click', function () {
					that.isAssigneOneTime = true;
					var a = $(this).parent().parent(); 
					a.each(function() { 
						var getEmpNo = $(this).find('td:nth-child(2)').html(); 
						var getUserName = $(this).find('td:nth-child(1)').html(); 
						var getEmpRole = $(this).find('td:nth-child(3)').html();
						$("#username_id").val(getUserName);
						$("#id_emp_role").val(getEmpRole);
					});
				});
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
				that.fnAutocomplete(usrname);
			});

			var role_record = {},_this;
			$(".save-role-btn").click(function(e){
				var errorArr = [];
				$(".errorstyle").addClass("hidden");
				$('.role-play').each(function(i, val) {
					_this = this;
					var elemLength = $('.role-play').length,
						$i = i + 1;
					if($.trim($(this).val()) != "") {
						if($(this).attr("zyde-service") != undefined){
							role_record[$(this).attr("zyde-service")] = $(this).val();
							if(elemLength === $i){
								role_record['csrf_token'] = $("#csrf_token").val();
								role_record['update'] = that.isAssigneOneTime;
								that.request($("#baseurl").val() + "/assignrole", role_record, 'get', function(json){
									that.isAssigneOneTime = false;
									$('.role-play').val('');
									json = $.parseJSON(json);
									if(json.result){
										that.fnerrorMessage('show', 'role-details', 'glyphicon-ban-circle', json.result, 'bg-danger');
										var obj = {'csrf_token': $("#csrf_token").val()};
										that.request($("#baseurl").val()+"/rolerecords", obj, 'get', function(json){
											json = $.parseJSON(json);
											for(var act in json){
												json[act].employee_status = isActive[json[act].employee_status];
											}
											/*role.dt.clear();
										    role.dt.rows.add(json);
										    $role.dt.draw();*/
									    	
										    setTimeout(function(){
										    	that.fnerrorMessage('hide', 'role-details', 'glyphicon-ban-circle', null, 'bg-danger');
										    }, 3000);
										});
									}else{
										that.fnerrorMessage('show', 'role-details', 'glyphicon-warning-sign', json.wrong, 'bg-danger');
										setTimeout(function(){
									    	that.fnerrorMessage('hide', 'role-details', 'glyphicon-warning-sign', null, 'bg-danger');
									    }, 3000);
									}
									return false;
								});
							}
						}
						$(this).parent().find('.invalid').first().remove();
					}else{
						$(this).parent().find('.invalid').first().remove();
						$(this).parent().append('<span class="invalid"><i class="glyphicon glyphicon-ban-circle"></i>  ' + $(this).parent().find('label').html()  +" is required</span>")
						errorArr.push( $(this).parent().find('label').html()  +" is required")
					}
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
					setTimeout(function(){
				    	role.fnerrorMessage('hide', 'role-details', 'glyphicon-warning-sign', null, 'bg-danger');
				    }, 3000);
				}
			});
		}
	};
	role.init();
});
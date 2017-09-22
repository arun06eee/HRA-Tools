$(function(){
	var editflag = false;
	var old_year = "";
	var maintanance = {
		emp_base64String: null,
		init : function () {
			var that = this;
			editflag = false;
			$(".num_field").on('keypress', function (evt) {
                if((evt.which != 46) &&
                    (evt.which != 43) &&
                    (evt.which != 45) &&
                    ((evt.which < 48 || evt.which > 57) &&
                    (evt.which != 0 && evt.which != 8))) {
                        evt.preventDefault();
                }
			});
			maintanance.fnviewleave();
			maintanance.fnSaveLeaveMaintanance();
		},
		fnviewleave: function(val){
			var that = this;
			var controller = $("#baseurl").val() + "/viewldefaultleave";
			var data = '';
			if(val == 'true'){
				$("#leave_table tbody tr").empty();
			}
			that.request(controller, data, 'GET', function(json){
				if(json.length == 0){
					var td = "<tr><td colspan='4' style='text-align: center;'>No Data Available.!!</td></tr>"
					$("#addtr").append(td);
				}else{
					for(var i=0;i<json.length;i++){
						var td = "<tr>"
									+"<td>"+(i+1)+"</td>"
									+"<td value="+json[i].leave_year+">"+json[i].leave_year+"</td>"
								 	+"<td>"+json[i].total_leave+"</td>"
								 	+"<td><button type='button' class='btn btn-info btn-lg deletebtn' data-toggle='modal' data-target='#deleteleave'><i class='fa fa-trash-o' aria-hidden='true'></i></button>"
								 	+"<button type='button' class='btn btn-info btn-lg editbtn'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></button></td>"
								 	+"</tr>";
						$("#addtr").append(td);
					}
					maintanance.fnconfirmDelete();
					maintanance.fneditLeave();
				}
			});
		},
		fnSaveLeaveMaintanance: function(){
			var that = this;
			$(".save-totalLeave-btn").click(function(event){
				var set_total_leave = $("#id_set_total_leave").val();
				var set_year = $("#set_year").val();
				if(set_total_leave == '' || set_year == ''){
					maintanance.fnerrorMessage('show', 'leavemaintanance-details', 'glyphicon-warning-sign', 'Fill all the fields!!', 'bg-danger');
				}else{
					var controller = $("#baseurl").val() + "/defaultleave";
					if(editflag == true){
						console.log(old_year);
						data = {
							"csrf_token"		: $("#csrf_token").val(),
							"set_total_leave"	: set_total_leave,
							"set_year"			: set_year,
							"old_year"			: old_year
						};
					}else{
						data = {
							"csrf_token"		: $("#csrf_token").val(),
							"set_total_leave"	: set_total_leave,
							"set_year"			: set_year,
							"old_year"			: ""
						};
					}
						$("#id_set_total_leave").val('');
						$("#set_year").val('');
						that.request(controller, data, 'GET', function(json){
							if(editflag == true){
								editflag = false;
							}
							that.fnviewleave('true');
							that.fnerrorMessage('show', 'leavemaintanance-details', 'glyphicon-ok', json.success, 'bg-success');
							setTimeout(function(){
						    	that.fnerrorMessage('hide', 'leavemaintanance-details', 'glyphicon-ok', null, 'bg-success');
						    }, 3000);
						});
				}
				return false;
			});
		},
		fnconfirmDelete: function(){
			var selecttr = "", deletetr = "", currenttr = "";
			$('.fa-trash-o').click(function() {
				currenttr = $(this).closest('tr');
				selecttr = $(this).closest('tr').find('td');
				deletetr = selecttr[1].innerHTML;
			});

			$("#confirmDelete").click(function(){
				var data = {"delete_tr" : deletetr}, url = $("#baseurl").val() + "/deletetabletr";
				maintanance.request(url, data, 'GET', function(json){
					if(json){
						$("#deleteleave").modal('hide');
						currenttr.closest('tr').remove();
						maintanance.fnerrorMessage('show', 'leavemaintanance-details', 'glyphicon-ok', 'deleted successsfully!!', 'bg-success');
					}
				});
			});
		},
		fneditLeave: function() {
			$('.editbtn').click(function() {
				var selecttr = "", year = "", leave = "";  
				selecttr = $(this).closest('tr').find('td');
				console.log(selecttr);
				leave = selecttr[2].innerHTML;
				year = selecttr[1].innerHTML;
				$("#id_set_total_leave").val(leave);
				$("#set_year").val(year);
				old_year = year;
				editflag = true;
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
					maintanance.fnerrorMessage('show', 'leavemaintanance-details', 'glyphicon-warning-sign', 'Error occured.Try again', 'bg-danger');
					console.log('error occured');
					setTimeout(function(){
				    	maintanance.fnerrorMessage('hide', 'leavemaintanance-details', 'glyphicon-warning-sign', null, 'bg-danger');
				    }, 3000);
				}
			});
		}
	};
	maintanance.init();
});
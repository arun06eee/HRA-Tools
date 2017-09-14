$(function(){
	var tag_name = "";
	var leaveM = {
		emp_base64String: null,
		init : function () {
			var that = this;
            $("#tagsList").empty();
			var controller = $("#baseurl").val() + "/viewemployeebuckets",
				data = {
					alpha: "All",
					csrf_token: $("#csrf_token").val(),
					cmd : 'view'
				};

			that.request(controller, data, 'get', function(json){
				var options = '';
				for (var mainKey in json){
					var abc = json[mainKey].firstname + '(' + json[mainKey].employee_number+')';
					options += '<option value="' + abc +'">' + abc + '</option>';
				}
				$("select#emp_name").html(options);

                $('#emp_name').SumoSelect({placeholder: 'Employee Status'});
			});
            
            var tagsController = $("#baseurl").val() + "/showtags",
                tagsData = {};
            
            that.request(tagsController, tagsData, 'get', function(json){
                if(json){
                    for(var i=0;i<json.length;i++){
                        var showtag = '<div class="btn tagevent" style="background-color:'+ json[i].tag_color+';color:'+json[i].text_color+'">'
                                +json[i].tag_name+ '</div>';
                        $("#tagsList").append(showtag);
                    }
                }
                
                that.fnTagsListAction();
            });

			that.fnSaveLeaveModule();
		},
        fnTagsListAction: function(){
            $(".tagevent").click(function(){
                tag_name = $(this).html();
                $(".tagevent").removeClass("activeTags");
                if($(this).hasClass("activeTags")){
                    $(this).removeClass("activeTags");
                }else {
                    $(this).addClass("activeTags");
                }
            });
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
					"reason": $("#lve_reason").val(),
					"tag_name": tag_name
				};
				if(data.employee_status == ""){
					leaveM.fnerrorMessage('show', 'leaveform-details', 'glyphicon-warning-sign', 'Select Employees!!', 'bg-danger');
				}else if(data.from_date == "" || data.to_date == ""){
					leaveM.fnerrorMessage('show', 'leaveform-details', 'glyphicon-warning-sign', 'Select Date!!', 'bg-danger');
				}else if(data.reason == ""){
					leaveM.fnerrorMessage('show', 'leaveform-details', 'glyphicon-warning-sign', 'Reason should not empty!!', 'bg-danger');
				}else if(data.tag_name == ""){
					leaveM.fnerrorMessage('show', 'leaveform-details', 'glyphicon-warning-sign', 'Select Tag!!', 'bg-danger');
				}else{
					$("#emp_name option:selected").removeAttr("selected");
					$(".leave-dates").val('');
					$(".leave_details").val('');
					that.request(controller, data, 'GET', function(json){
						that.fnerrorMessage('show', 'leaveform-details', 'glyphicon-ok', json.success, 'bg-success');
						setTimeout(function(){
					    	that.fnerrorMessage('hide', 'leaveform-details', 'glyphicon-ok', null, 'bg-success');
					    }, 3000);
					});
				}
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
				/*error: function() {
					leaveM.fnerrorMessage('show', 'leaveform-details', 'glyphicon-warning-sign', 'Error occured.Try again', 'bg-danger');
					console.log('error occured');
					setTimeout(function(){
				    	leaveM.fnerrorMessage('hide', 'leaveform-details', 'glyphicon-warning-sign', null, 'bg-danger');
				    }, 3000);
				}*/
			});
		}
	};
	leaveM.init();
});
$(function(){
	var avail_leave = "";
	var leaveM = {
		emp_base64String: null,
        employeeList : [],
		init : function () {
			var that = this;
            
            /* Employee List */
            $("#tagsList").empty();
			var controller = $("#baseurl").val() + "/viewemployeebuckets",
				data = {
					alpha: "All",
					csrf_token: $("#csrf_token").val(),
					cmd : 'view'
				};

			that.request(controller, data, 'get', function(json){
				var options = '';
                leaveM.employeeList = json;
				for (var mainKey in json){
					var abc = json[mainKey].firstname + '(' + json[mainKey].employee_number+')';
					options += '<option value="' + abc +'">' + abc + '</option>';
				}
				$("select#emp_name").append(options);
                that.fnTagsListAction();
			});

            var tagsController = $("#baseurl").val() + "/showtags",
                tagsData = {};
            that.request(tagsController, tagsData, 'get', function(json){
            	var defaultTags = '<div id="compoff" class="btn tagevent" style="background-color:#00C664; color:#ffffff">Compoff</div>'
                        				+'<div id="LOP" class="btn tagevent" style="background-color:#FF003B; color:#ffffff">LOP</div>';
                $("#tagsList").append(defaultTags);
                if(json){
                    for(var i=0;i<json.length;i++){
                        var showtag = '<div class="btn tagevent" style="background-color:'+ json[i].tag_color+';color:'+json[i].text_color+'">'+json[i].tag_name+ '</div>';
                        $("#tagsList").append(showtag);
                    }
                }
                that.fnTagsListAction();
            });

			that.fnSaveLeaveModule();
		},
        fnTagsListAction: function(){
            $(".tagevent").click(function(){
                if($(this).hasClass("activeTags")){
                    $(this).removeClass("activeTags");
                }else {
                    $(this).addClass("activeTags");
                }
            });
            $("select#emp_name").unbind("change").change(function(){
                var emp_num = $(this).val().match(/\((.*)\)/);
                $("#avail_leave").val("");
                if(emp_num != null) {
                    avail_leave = "";
                    for (var mainKey in leaveM.employeeList){
                        if(leaveM.employeeList[mainKey].employee_number == emp_num[1]){
                            $("#avail_leave").val(leaveM.employeeList[mainKey].available_leave);
                            avail_leave = leaveM.employeeList[mainKey].available_leave;
                        }
                    }
                }
            });
        },
		showDays: function(firstDate,secondDate){
			// function to calculate count between dats

			var startDay = new Date(firstDate);
			var endDay = new Date(secondDate);
			var millisecondsPerDay = 1000 * 60 * 60 * 24;

			var millisBetween = endDay.getTime() - startDay.getTime() ;
			var days = millisBetween / millisecondsPerDay;
			return(Math.round(days));
		},
		fnSaveLeaveModule: function(){
			var that = this;
			$(".save-leavemodule-btn").click(function(event){
				var	bool = true,
					fromDate = $("#id_from_date").val(),
					toDate = $("#id_to_date").val(),
					duration = leaveM.showDays(fromDate,toDate)+1;

				if($("#emp_name").val() == ""){
					leaveM.fnerrorMessage('show', 'leaveform-details', 'glyphicon-warning-sign', 'Select Employees!!', 'bg-danger');
					bool = false;
				}else if($("#id_from_date").val() == "" || $("#id_to_date").val() == ""){
					leaveM.fnerrorMessage('show', 'leaveform-details', 'glyphicon-warning-sign', 'Select Date!!', 'bg-danger');
					bool = false;
				}else if($("#lve_reason").val() == ""){
					leaveM.fnerrorMessage('show', 'leaveform-details', 'glyphicon-warning-sign', 'Reason should not empty!!', 'bg-danger');
					bool = false;
				}else if(duration <= 0 || isNaN(duration)){
					console.log(duration);
					leaveM.fnerrorMessage('show', 'leaveform-details', 'glyphicon-warning-sign', 'Enter Valid Dates!!', 'bg-danger');
					bool = false;
				}else{
					//lets start LOP avlidation here!!
					if(parseInt(avail_leave) < duration){
						$("#LOP").addClass('activeTags');
					}
				}

				var tag_name = [];
				$('.activeTags').each(function(i, selected){ 
				  tag_name[i] = $(selected).text();
				});
				var emp_num = $("#emp_name").val().match(/\((.*)\)/);
				var controller = $("#baseurl").val() + "/storeleaveform",
					data = {
						"csrf_token": $("#csrf_token").val(),
						"employee_status":emp_num[1],
						"from_date": $("#id_from_date").val(),
						"to_date": $("#id_to_date").val(),
						"reason": $("#lve_reason").val(),
						"tag_name": tag_name,
						"avail_leave": avail_leave
					};

				if(bool == true){
					$("#emp_name option:selected").removeAttr("selected");
					$(".leave-dates").val('');
					$(".leave_details").val('');
					$("#LOP").removeClass('activeTags');
					leaveM.request(controller, data, 'GET', function(json){
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
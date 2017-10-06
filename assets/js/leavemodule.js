$(function(){
	var avail_leave = "";
	var addflag = true;
	var reportflag = false;
	var leaveM = {
		emp_base64String: null,
        employeeList : [],
		init : function () {
			var that = this;
            
            /* Employee List */
            $("#tagsList").empty();
            $("#emp_name").empty();
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
				$("select#emp_name").append('<option value="">--Select Employee--</option>');
				$("select#emp_name").append(options);
				$("select#employee").append(options);
				$('#emp_name').SumoSelect({placeholder: 'Select Employee'});
				$('#employee').SumoSelect({placeholder: 'Select Employee'});

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
                            if(leaveM.employeeList[mainKey].available_leave == 0){
                            	$(".tagevent").addClass("hidden");
                            	$("#LOP").removeClass("hidden");
                            }else{
                            	$(".tagevent").removeClass("hidden");
                            }
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

            $('#radioBtn a').on('click', function(){
                var sel = $(this).data('title');
                var tog = $(this).data('toggle');

                $('a[data-toggle="'+tog+'"]').not('[data-title="'+sel+'"]').removeClass('active').addClass('notActive');
                $('a[data-toggle="'+tog+'"][data-title="'+sel+'"]').removeClass('notActive').addClass('active');
                
                if(sel == 'add') {
                    addflag = true;
                    reportflag = false;
                    $(".reportsList").addClass("hidden");
                    $(".addList").removeClass("hidden");
                    //$("#leaveform-details textarea, #leaveform-details input, #leaveform-details select").val('');
                }else {
                	addflag = false;
                	reportflag = true;
                    $(".addList").addClass("hidden");
                    $(".reportsList").removeClass("hidden");
					//$("#leaveform-details textarea, #leaveform-details input, #leaveform-details select").val('');
                }
            });

			$(".save-leavemodule-btn").click(function(event){
				var	bool = true, tag_name = [],
					fromDate = $(".id_from_date").val(),
					toDate = $(".id_to_date").val(),
					duration = leaveM.showDays(fromDate,toDate)+1;

				if(addflag){
					if($("#emp_name").val() == ""){
						leaveM.fnerrorMessage('show', 'leaveform-details', 'glyphicon-warning-sign', 'Select Employees!!', 'bg-danger');
						bool = false;
					}else if(fromDate == "" || toDate == ""){
						leaveM.fnerrorMessage('show', 'leaveform-details', 'glyphicon-warning-sign', 'Select Date!!', 'bg-danger');
						bool = false;
					}else if($("#lve_reason").val() == ""){
						leaveM.fnerrorMessage('show', 'leaveform-details', 'glyphicon-warning-sign', 'Reason should not empty!!', 'bg-danger');
						bool = false;
					}else if(duration <= 0 || isNaN(duration)){
						leaveM.fnerrorMessage('show', 'leaveform-details', 'glyphicon-warning-sign', 'Enter Valid Dates!!', 'bg-danger');
						bool = false;
					}else{
						//lets start LOP avlidation here!!
						if(parseInt(avail_leave) < duration){
							$("#LOP").addClass('activeTags');
							avail_leave = 0;
						}else{
							avail_leave = avail_leave - duration;
						}
						$('.activeTags').each(function(i, selected){ 
							tag_name[i] = $(selected).text();
						});

						var emp_num = $("#emp_name").val().match(/\((.*)\)/);
						var controller = $("#baseurl").val() + "/storeleaveform",
						data = {
							"csrf_token": $("#csrf_token").val(),
							"employee_status":emp_num[1],
							"from_date": fromDate,
							"to_date": toDate,
							"reason": $("#lve_reason").val(),
							"tag_name": tag_name,
							"avail_leave": avail_leave
						};
						bool = true;
					}

					if(bool == true){
						$("#emp_name option:selected").removeAttr("selected");
						$(".leave-dates").val('');
						$(".leave_details").val('');
						$("#avail_leave").val('');
						$(".activeTags").removeClass('activeTags');
						leaveM.request(controller, data, 'GET', function(json){
							that.fnerrorMessage('show', 'leaveform-details', 'glyphicon-ok', json.success, 'bg-success');
							that.init();
							setTimeout(function(){
								that.fnerrorMessage('hide', 'leaveform-details', 'glyphicon-ok', null, 'bg-success');
							}, 3000);
						});
					}
					leaveM.init();
					//return false;
				}

				if(reportflag){
					var emp_num = $("#employee").val(), emp_no = [];
					for(var No in emp_num){	emp_no.push(emp_num[No].match(/\((.*)\)/)[1]);}
					$('.activeTags').each(function(i, selected){ 
						tag_name[i] = $(selected).text();
					});
	            	var data = {
	            		csrf_token: $("#baseurl").val(),
	            		employee: emp_no,
	            		from_date: fromDate,
	            		to_date: toDate,
	            		tags: tag_name
	            	}

	            	if(data.employee != ""){
	            		$("#leaveform").removeClass("col-md-offset-4");
	            		$("#report_table_tab").removeClass("hidden");
	            		$("#report_spinner").removeClass("hidden");
	            		var showReportController = $("#baseurl").val() + "/showreports";
	            		that.request(showReportController, data, 'GET', function(json){
	            			if(json.error){
	            				//that.fnerrorMessage('show', 'leaveform-details', 'glyphicon-ok', json.error, 'bg-success');
	            				$("#addtr").empty();
	            				$("#addtr").append('<tr><td class="text-center" colspan="6">No records found...</td></tr>');
	            			}else
							if(json.length != 0){
								$("#addtr").empty();
								json = json.result;
								var difference = [];
								for(var i=0;i<json.length;i++){
									$("#NoReportData").empty();
									difference = [];
									for(var k=0;k<json[i].tag_name.length;k++){
										for(var j=0;j<tag_name.length;j++){
											if(tag_name[j] == json[i].tag_name[k]){
												difference.push(json[i].tag_name[k]);
											}
										}
									}
									if(difference.length > 0){
										var td = "<tr>";
										if(json[i]['employee_name']){
											td += "<td>"+json[i]['employee_name']+"</td>";
										}
										if(json[i]['date_applied']){
											td += "<td>"+json[i]['date_applied']+"</td>";
										}
										if(json[i]['from_date']){
											td += "<td>"+json[i]['from_date']+"</td>";
										}
										if(json[i]['to_date']){
											td += "<td>"+json[i]['to_date']+"</td>";
										}
										if(json[i].tag_name){
											td += "<td>"+difference+"</td>";
										}
										if(json[i]['reason']){
											td += "<td>"+json[i]['reason']+"</td>";
										}else{
											td += "<td class='text-center'> - </td>";
										}
										td += "</tr>";
										$("#addtr").append(td);
									}
								}
							}
							$("#report_spinner").addClass("hidden");
							$("#leave_table").removeClass("hidden");
						});
	            	}
	            	return false;
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
			});
		}
	};
	leaveM.init();
});
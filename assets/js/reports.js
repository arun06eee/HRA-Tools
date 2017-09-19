$(function(){
	var reports = {
		emp_base64String: null,
		init : function () {
			var that = this;
            $("#tags").empty();
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
				$("select#employee").append(options);
				$('#employee').SumoSelect({placeholder: 'Select Employee'});
			});
            
            var tagsController = $("#baseurl").val() + "/showtags", Data = {};
            that.request(tagsController, Data, 'get', function(json){
            	var defaultTags = '<div class="btn tagevent" style="background-color:#00C664; color:#ffffff">Compoff</div>'
                        				+'<div class="btn tagevent" style="background-color:#FF003B; color:#ffffff">LOP</div>';
                $("#tags").append(defaultTags);
                if(json){
                    for(var i=0;i<json.length;i++){
                        var showtag = '<div class="btn tagevent" style="background-color:'+ json[i].tag_color+';color:'+json[i].text_color+'">'+json[i].tag_name+ '</div>';
                        $("#tags").append(showtag);
                    }
                }
                that.fnTagsAction();
            });

            $(".show-report-btn").click(function(){
            	var tags = [];
				$('.activeTags').each(function(i, selected){ 
				  tags[i] = $(selected).text();
				});
				var emp_num = $("#employee").val(), emp_no = [];
				for(var No in emp_num){	emp_no.push(emp_num[No].match(/\((.*)\)/)[1]);}

            	var data = {
            		employee: emp_no,
            		from_date: $("#from_date").val(),
            		to_date: $("#to_date").val(),
            		tags: tags
            	}
 
            	if(data.employee != ""){
            		var showReportController = $("#baseurl").val() + "/showreports";
            		that.request(showReportController, data, 'GET', function(json){
						if(json.length != 0){
							$("#addreportRow").empty();
							json = json.result;
							for(var i=0;i<json.length;i++){
								$("#NoReportData").empty();
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
								if(json[i]['tag_name']){
									td += "<td>"+json[i]['tag_name']+"</td>";
								}else{
									td += "<td class='text-center'> - </td>";
								}
								if(json[i]['reason']){
									td += "<td>"+json[i]['reason']+"</td>";
								}else{
									td += "<td class='text-center'> - </td>";
								}
								td += "</tr>";
								$("#addreportRow").append(td);
								$("body").animate({ scrollTop: $(document).height() }, 1000);
							}
						}
					});
            	}
            });
		},
        fnTagsAction: function(){
            $(".tagevent").click(function(){
                if($(this).hasClass("activeTags")){
                    $(this).removeClass("activeTags");
                }else {
                    $(this).addClass("activeTags");
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
				}
			});
		}
	};
	reports.init();
});
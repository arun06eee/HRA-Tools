$(function() {
	var ViewEmployee;
	var employeeData;
	var emp_base64String;

	ViewEmployee = (function() {
		function ViewEmployee() {
			var _value = "All";
			this.select_employee_Alphabet_order(null, _value);
		
			$(".modal").on('hide.bs.modal', function() {
				$('.invalid').remove();
			});
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		}

		ViewEmployee.prototype.initialization = function() {
			return (function(instance) {
				var test = $('<button/>', {
					text: 'All', //set text 1 to 10
					id: 'btn_all',
					class: 'emp_lists_btn alpha-active',
					click: function(e) {
						$(".emp_lists_btn").removeClass('alpha-active');
						var _this = $(e.target),
							_value = _this.html();
						_this.addClass('alpha-active');
						instance.select_employee_Alphabet_order(e, _value);
					}
				});

				$(".alphaButtons").before(test);

				var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
				for (var i = 0; i < str.length; i++) {
					var nextChar = str.charAt(i);
					var test = $('<button/>', {
						text: nextChar, //set text 1 to 10
						id: 'btn_' + i,
						class: 'emp_lists_btn',
						click: function(e) {
							$(".emp_lists_btn").removeClass('alpha-active');
							var _this = $(e.target),
								_value = _this.html();
							_this.addClass('alpha-active');
							instance.select_employee_Alphabet_order(e, _value);
						}
					});
					$(".alphaButtons").before(test);					
				}

				var a = '<i class="glyphicon glyphicon-list-alt export-employee" zyde-id="All" title="Download"></i>'
						+ '<i class="glyphicon glyphicon-th-list" id="tableListView" title="List View" ></i>'
						+ '<i class="glyphicon glyphicon-th" id="tableGridView" title="Grid View"></i>';
				
				$(".alphaButtons").before(a);
				
				$("#tableListView").click(function() {			
					$("#employeeLists").hide("drop", {direction: "left"}, 1000 , function (){
						$("#employeeListView").show("drop", {direction: "up"}, 1000);
					});
				});

				$("#tableGridView").click(function() {
					$("#employeeListView").hide("drop", {direction: "left"}, 1000, function (){
						$("#employeeLists").show("drop", {direction: "up"}, 1500);
					});
				});

				return $(".save_edited_profile").click(function(e) {
					var _id = $(".save_edited_profile").attr("get-emp-id");
					if (_id != '') {
						instance.edit_employee_profile(e, _id);
					}
				});
			})(this);
		};

		ViewEmployee.prototype.select_employee_Alphabet_order = function(e, _value) {
			return (function(instance) {
				var controller = $("#baseurl").val() + "/viewemployeebuckets",
					data = {
						alpha: _value,
						csrf_token: $("#csrf_token").val(),
						cmd : 'view'
					};
				$("#view_employee_details").hide();
				instance.ajaxCall(controller, 'get', data, function(oResult) {
					instance.display_Employee_lists(oResult.result);
				});
			})(this);
		};

		ViewEmployee.prototype.JSONToCSVConvertor = function(JSONData) {
			return (function(instance) {
				var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
				arrData = arrData.result;
				var CSV = '', column = '';

				for (var i = 0; i < arrData.length; i++) {
					var row = "";

					$.each(arrData[i], function(key,val){
						if(key != 'trash' && key != 'photo' && key != 'id') {						
							if(key == 'gender') {			
								val = (val == 0) ? 'Male' : 'Female';
								row += '"' + val + '",';
							}else if(key == 'employee_status') {
								val = (val == 0) ? 'Active' : 'Inactive';
								row += '"' + val + '",';			
							} else {
								row += '"' + val + '",';
							}

							if(i == 0) {
								column += '"' + key.toUpperCase().replace(/_/g, " ") + '",';
							}
						}
						
						if(key == 'photo') {
							//console.log(key, val);
/* 
							var img = $(this);
							if(img.attr('zyde-src').split(',')[1] == undefined) {
								alert("Invalid image Format")
								return false;
							}
 */
							//var filename = img.attr('filename') || 'Employee';
							/* 
							var image_data = atob(val);
							var arraybuffer = new ArrayBuffer(image_data.length);

							var view = new Uint8Array(arraybuffer);
							for (var i=0; i<image_data.length; i++) {
								view[i] = image_data.charCodeAt(i) & 0xff;
							}

							try {
								var blob = new Blob([arraybuffer], {type: 'application/octet-stream'});
								console.log(blob);

							} catch (e) {
								var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder);
								bb.append(arraybuffer);
								var blob = bb.getBlob('application/octet-stream');
							}
							
							var url = (window.webkitURL || window.URL).createObjectURL(blob);

							row += '"' + val + '",';
							row += '"' + url + '",'; */	
						}
					});

					row.slice(0, row.length - 1);

					//add a line break after each row
					CSV += row + '\r\n';
				}

				CSV = column + '\r\n' + CSV + '\r\n';

				if (CSV == '' ||  CSV == undefined){
					alert("Invalid data");
					return;
				}

				//Generate a file name
				var fileName = "MyReport_employee";

				//Initialize file format you want csv or xls
				var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
				var link = document.createElement("a");
				link.href = uri;

				link.style = "visibility:hidden";
				link.download = fileName + ".csv";

				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			})(this);
		};

		ViewEmployee.prototype.display_Employee_lists = function(data) {
			return (function(instance) {
				var gridbody = $("#employeeLists");
				var listbody = $("#employeeListView tbody")
				gridbody.empty();
				listbody.empty();
				var tmp, tmpArr = [], tmpList, tmpArrList = [], employeeData = data;

				var tpl = '<div class="col-sm-6 col-md-3 col-lg-2 pull-left ml10" >'
							+' <div class="thumbnail %currentclass%">'
								+' <h4>'
									+ '<span class="label label-info info">'
									+ '<i class="fa fa-file-excel-o export-employee" zyde-id="%id%" title="Download"></i>'
									+ '<i class="fa fa-trash delete-employee" zyde-id="%id%" title="Trash"></i>'
									+ '<i class="fa fa-eye eye-employee" zyde-id="%id%" title="View"></i>'
									+ '<i class="fa fa-download img-download" zyde-src="%photo%" filename="%filename%" ></i>'
									+ '</span>'
								+ '</h4>'
								+ '<img src="%photo%" alt="%name%" filename="%filename%">'
								+ '<div class="col-xs-12 text-center empstyle">'
										+ '%name% <br/>'
										+ 'Employee ID : %employee_number%'
								+ '</div>'
								+ '<div class="clearfix"></div>'
							+ '</div>'
						+ '</div>';

				var tplList = '<tr class="%currentclass%">'
								+ '<td><img src="%photo%" width="30" height="30" /></td>'
								+ '<td>%name%</td>'
								+ '<td>%employee_number%</td>'
								+ '<td>'
									+ '<i class="fa fa-file-excel-o export-employee" zyde-id="%id%" title="Download"></i>'
									+ '<i class="fa fa-trash delete-employee" zyde-id="%id%" title="Trash"></i>'
									+ '<i class="fa fa-eye eye-employee" zyde-id="%id%" title="View"></i>'
									+ '<i class="fa fa-download img-download" filename="%filename%"  zyde-src="%photo%"></i>'
								+ '</td>'
							+ '</tr>';

				var base = $("#baseurl").val() + "./assets/img/avatar.jpeg";
				for (var i = 0; i < data.length; i++) {

					if($.trim(data[i].photo) == "") {
						data[i].photo = base
					}else {
						data[i].photo = "data:image/png;base64,"+data[i].photo;
					}

					tmp = tpl.replace(/%name%/g, data[i].firstname);
					tmp = tmp.replace(/%filename%/g, data[i].firstname);
					tmp = tmp.replace(/%id%/g, data[i].id);
					tmp = tmp.replace(/%employee_number%/g, data[i].employee_number);

					tmp = tmp.replace(/%photo%/g, data[i].photo);
					tmp = tmp.replace(/%currentclass%/g, data[i].employee_status == 0 ? 'activeemployee' : 'inactiveemployee');
					tmpArr.push(tmp);

					tmpList = tplList.replace(/%name%/g, data[i].firstname);
					tmpList = tmpList.replace(/%filename%/g, data[i].firstname);
					tmpList = tmpList.replace(/%id%/g, data[i].id);
					tmpList = tmpList.replace(/%employee_number%/g, data[i].employee_number);
					tmpList = tmpList.replace(/%photo%/g, data[i].photo);
					tmpList = tmpList.replace(/%currentclass%/g, data[i].employee_status == 0 ? 'activeemployee' : 'inactiveemployee');
					tmpArrList.push(tmpList)
				}

				gridbody.append(tmpArr.join(""));
				listbody.append(tmpArrList.join(""));

				$("#employeeLists .delete-employee, #employeeListView .delete-employee").unbind('click').click(function(e) {
					var id = $(this).attr('zyde-id');
					$("#confirmationDeleteEmployee").modal("show");
					$("#dlt_emp_id").attr('zyde-id', id);
				});

				$("#employeeLists .eye-employee, #employeeListView .eye-employee").unbind('click').click(function(e) {
					var id = $(this).attr('zyde-id');
					$("#view_employee_details_modal").modal("show");
					$("#save_emp_id").attr("zyde-id", id);
					var data = init.arrayMap(employeeData, id);
					$.each(data[0], function(key, val) {
						if(key == 'gender') {
							$('input:radio[name="gender"][value="'+val+'"]').prop('checked', true);
						}else if(key == "photo") {
							$(".fileUpload").css("background-image", "url('"+val+"')");
							emp_base64String = val;
						}else {
							$("[zyde-service='"+key+"']").val(val);
						}
					});
				});

				$(".export-employee").unbind('click').click(function(e) {
					e.preventDefault();
					var id = $(this).attr('zyde-id');
					var controller = $("#baseurl").val() + "/viewemployeebuckets",
					data = {
						alpha: id,
						csrf_token: $("#csrf_token").val(),
						cmd: 'export'
					};
					init.ajaxCall(controller, 'get', data, init.JSONToCSVConvertor);
				});

				$(".img-download").click(function(event) {
					event.preventDefault();
					var img = $(this);
					if(img.attr('zyde-src').split(',')[1] == undefined) {
						alert("Invalid image Format")
						return false;
					}

					var filename = img.attr('filename') || 'Employee';
					var image_data = atob(img.attr('zyde-src').split(',')[1]);
					var arraybuffer = new ArrayBuffer(image_data.length);

					var view = new Uint8Array(arraybuffer);
					for (var i=0; i<image_data.length; i++) {
						view[i] = image_data.charCodeAt(i) & 0xff;
					}

					try {
						var blob = new Blob([arraybuffer], {type: 'application/octet-stream'});
					} catch (e) {
						var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder);
						bb.append(arraybuffer);
						var blob = bb.getBlob('application/octet-stream');
					}

					var url = document.createElement('a');
					url.href = (window.webkitURL || window.URL).createObjectURL(blob);
					url.download = filename+".jpeg";
					url.click();
				})
			})(this);
		};

		ViewEmployee.prototype.arrayMap =  function(array, id) {
			var data = $.map(array, function(val, i) { 
				if(val.id == id) {					
					return val;
				}
			});

			return data;
		};
		
		ViewEmployee.prototype.ajaxCall = function(url, type, data, callback) {
			return (function(instance) {
				$.ajax({
					url: url,
					type: type,
					data: data,
					contentType: 'application/json',
					dataType: 'json',
					success: function(data) {
						callback({result: data});
					},
					error: function() {
						var result = callback({
							status: "failed",
							result: "No data Found"
						});
						return result;
					}
				});
			})(this);
		};

		
		ViewEmployee.prototype.fnvalidateEmailAddress = function(email) {
			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			var emailTest = re.test(email)
			return emailTest;
		};

		ViewEmployee.prototype.fnerrorMessage = function(type, id, classes, msg, status) {
			return (function(instance) {
				if(type == 'show') {
					$("#"+id+" .errorstyle").removeClass("hidden");
					$("#"+id+" .errorstyle").addClass(status);
					$("#"+id+" .errorstyle>i").addClass(classes);
					$("#"+id+" .errormsg").empty().append(msg);	
				}else {
					$("#"+id+" .errorstyle").addClass("hidden");
					$("#"+id+" .errorstyle>i").removeClass("glyphicon-warning-sign glyphicon-ok glyphicon-ban-circle");
					$("#"+id+" .errormsg").empty();
					$("#"+id+" .errorstyle").removeClass('bg-danger bg-success');
				}
			})(this);
		};

		return ViewEmployee;
	})();

	var init = new ViewEmployee;

	$("#employeeLists").show();
	$("#employeeListView").hide();


	$("#save_emp_id").click(function (e) {
		$(".errormsg").empty();
		$(".errorstyle").addClass("hidden");
		var emailFlag = true;
		var tmpArr = {}, errorArr = [];
		$('.group input,.group textarea, .group select').each(function(i, val) {
			if($.trim($(this).val()) != "") {		
				if($(this).attr("zyde-service") != undefined){
					if($(this).attr('type') == 'email') {
						var emailVali = init.fnvalidateEmailAddress($(this).val());
						if(!emailVali){
							errorArr.push("Please enter a valid email address");
							$(this).parent().find('.invalid').first().remove();
							$(this).parent().append('<span class="invalid"><i class="glyphicon glyphicon-ban-circle"></i>  ' + $(this).parent().find('label').html()  +" is required</span>")
						}else {
							tmpArr[$(this).attr("zyde-service")] = $(this).val();
						}
					}else {
						tmpArr[$(this).attr("zyde-service")] = $(this).val();
					}
				}
				$(this).parent().find('.invalid').first().remove();
			}else {
				$(this).parent().find('.invalid').first().remove();
				$(this).parent().append('<span class="invalid"><i class="glyphicon glyphicon-ban-circle"></i>  ' + $(this).parent().find('label').html()  +" is required</span>")
				errorArr.push( $(this).parent().find('label').html()  +" is required")
			}
		});

		tmpArr['csrf_token'] = $("#csrf_token").val();
		//tmpArr['photo'] = emp_base64String
		tmpArr['gender'] = $('input[name=gender]:checked').val();
		tmpArr['emp_id'] = $("#save_emp_id").attr("zyde-id");

		if(tmpArr['gender'] == undefined) {
			errorArr.push("Gender is required")
			$('input[name=gender]').parent().parent().after("<span class='invalid'><i class='glyphicon glyphicon-ban-circle'></i>  Gender is required </span>");
		}else {
			$('input[name=gender]').parent().parent().parent().find('.invalid').remove();
		}
/* 
		if(tmpArr['photo'] == null){
			errorArr.push("Photo is required");
			$('.fileUpload').parent().find('.invalid').remove();
			$('.fileUpload').after(" <br/> <span class='invalid'><i class='glyphicon glyphicon-ban-circle'></i> Photo is required")
		}else {
			$('.fileUpload').parent().find('.invalid').remove();
		} */


		if(errorArr.length > 0) {
			//that.fnerrorMessage('show', 'addemployee-details', 'glyphicon-ban-circle', "Please Fill All required Fields", 'bg-danger');
			return false;
		}else {
			//that.fnerrorMessage('hide', 'addemployee-details', null, null, null);

			var controller = $("#baseurl").val() + "/updateemployee?csrf_token="+tmpArr['csrf_token'],
				type = 'get';

			init.ajaxCall(controller, type, tmpArr, function(oResult) {
				init.select_employee_Alphabet_order(null, "All");
				$("#view_employee_details_modal").modal("hide");
			});
		}
		return false;
	});

	$("#addemployee_image").on('change', function(evt) {
		var files = evt.target.files;
		var file = files[0];
		if(file.size > 1500000){
			alert("Photo size is two large. please choose another photo");
			return false;
		}
		if (files && file) {
			var reader = new FileReader();
			reader.onload = function(readerEvt) {
				var binaryString = readerEvt.target.result;
				emp_base64String = btoa(binaryString);
				$(".fileUpload").css("background-image", "url('data:image/png;base64," + that.emp_base64String + "')");
			};
			reader.readAsBinaryString(file);
		}
	});
	
	
	//Delete Employee Details
	$(".delete-confirm").click(function(e) {
		var controller = $("#baseurl").val() + "/deleteemployee",
		type = 'get',
		data = { emp_id: $("#dlt_emp_id").attr("zyde-id") };

		init.ajaxCall(controller, type, data, function(oResult) {
			init.select_employee_Alphabet_order(null, "All");
			$("#confirmationDeleteEmployee").modal("hide");
			init.fnerrorMessage('show', 'viewemployee_details', 'glyphicon-ok', 'Successfully Delete', 'bg-success');
			setTimeout(function(){
				init.fnerrorMessage('hide', 'viewemployee_details', null, null, null);
			}, 5000);
		});
	});
	
	
	
	
	
	
	
	
	
	
	
	
	

	init.initialization();

});
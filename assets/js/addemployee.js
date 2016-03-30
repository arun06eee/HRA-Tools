$(function(){
	var AddEmployee = {
		emp_base64String: null,
		init : function () {
			var that = this;
			$('.group').on( 'keydown', 'textarea', function (e){
				$(this).css('height', 'auto' );
				$(this).height( this.scrollHeight - 25 );
			});

			$('.group input, .group textarea, .group select').on('change keyup', function(e) {
				$(this).parent().find('.invalid').first().remove();
				if($.trim($(this).val()) == ""){
					if (e.keyCode == 32) {
						return false;
					}
					$(this).parent().find('.invalid').first().remove();
					$(this).parent().append('<span class="invalid"><i class="glyphicon glyphicon-ban-circle"></i>  ' + $(this).parent().find('label').html()  +" is required</span>")
				}
			});

			$(".save-addemployee-btn").click(function (e) {
				$(".errormsg").empty();
				$(".errorstyle").addClass("hidden");
				var emailFlag = true;
				var tmpArr = {}, errorArr = [];
				$('.group input,.group textarea, .group select').each(function(i, val) {
					if($.trim($(this).val()) != "") {		
						if($(this).attr("zyde-service") != undefined){
							if($(this).attr('type') == 'email') {
								var emailVali = that.fnvalidateEmailAddress($(this).val());
								if(!emailVali){
									errorArr.push("Please enter a valid email address");
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
				tmpArr['photo'] = that.emp_base64String
				tmpArr['gender'] = $('input[name=gender]:checked').val()

				if(tmpArr['gender'] == undefined) {
					errorArr.push("Gender is required")
					$('input[name=gender]').parent().parent().after("<span class='invalid'><i class='glyphicon glyphicon-ban-circle'></i>  Gender is required </span>");
				}else {
					$('input[name=gender]').parent().parent().parent().find('.invalid').remove();
				}

				if(tmpArr['photo'] == null){
					errorArr.push("Photo is required")
					$('.fileUpload').after(" <br/> <span class='invalid'><i class='glyphicon glyphicon-ban-circle'></i> Photo is required")
				}else {
					$('.fileUpload').parent().find('.invalid').remove();
				}

				if(errorArr.length > 0) {
					that.fnerrorMessage('show', 'addemployee-details', 'glyphicon-ban-circle', "Please Fill All required Fields", 'bg-danger');
					return false;
				}else {
					that.fnerrorMessage('hide', 'addemployee-details', null, null, null);
					that.request(tmpArr, that.fnAddEmployeeStatus);
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
						that.emp_base64String = btoa(binaryString);
						$(".fileUpload").css("background-image", "url('data:image/png;base64," + that.emp_base64String + "')");
					};
					reader.readAsBinaryString(file);
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
		middlewareValidation: function(e, c){ // Validation function for Input boxes using class name
			var a = true;
				e.each(function(i, el) {
				var _v = $.trim($(el).val());
				if(!_v || _v == ''){
					a = false;
					c(a);
					return a;
				}
			});
			if(a == true) {
				c(a);
			}
		},
		fnvalidateEmailAddress: function(email) {
			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			var emailTest = re.test(email)
			return emailTest;
		},
		request :  function (data, callback){
			var url = $("#baseurl").val()+"/addemployee";
			$.ajax({
				url: url,
				type: 'POST',
				data: data,
				success: function(result) {
					callback(result);
				},
				error: function() {
					AddEmployee.fnerrorMessage('show', 'addemployee-details', 'glyphicon-warning-sign', 'Error occured.Try again', 'bg-danger');
					console.log('error occured');
				}
			});
		},
		fnAddEmployeeStatus : function (data) {
			$('input, textarea, select').val("");
			var base = $("#baseurl").val() + "./assets/img/avatar.jpeg";
			$(".fileUpload").css("background-image", "url('"+ base +"')" );

			AddEmployee.fnerrorMessage('show', 'addemployee-details', 'glyphicon-ok', 'Employee Added Successfully.', 'bg-success');
			setTimeout(function() {
				AddEmployee.fnerrorMessage('hide', 'addemployee-details', null, null, null);
			}, 10000);
		},
	};

	AddEmployee.init();
});
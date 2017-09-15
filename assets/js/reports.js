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
			});
            
            var tagsController = $("#baseurl").val() + "/showtags",
                Data = {};
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
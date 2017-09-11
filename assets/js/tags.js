$(function(){
  var tag_name  = "";
  var tag_desc  = "";
  var tag_color = "";
  var tags = {
    init: function(){
      var url = $("#baseurl").val()+"/showtags";
      $.ajax({
        url: url,
        type: 'GET',
        success: function(response) {
          response = JSON.parse(response);
          if(response.length == 0){
            $("#NoTags").removeClass('hidden');
          }else{
            for(var i=0;i<response.length;i++){
                var showtag =  '<div class="alert alltags alert-dismissable col-lg-2" style="background-color:'+response[i].tag_color+'">'+response[i].tag_name+
                          '<a href="#" value="'+response[i].tag_name+'" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+
                          '</div>';
                $("#showtags").append(showtag);
                $("#NoTags").addClass('hidden');
            }
          }
          tags.fnDelete();
        },
        error: function() {
          tags.fnerrorMessage('show', 'Tags', 'glyphicon-warning-sign', 'Error occured.Try again', 'bg-danger');
          console.log('error occured');
        }
      });

      $('.save-tags-btn').click(function(){
          tag_name = $("#tag_name").val();
          tag_desc = $("#tag_desc").val();
          tag_color = $("#tag_color").val();
          if(tag_name == '' && tag_desc == ''){
              tags.fnerrorMessage('show', 'Tags', 'glyphicon-warning-sign', 'Fill all the fields!','bg-danger');
          }else if(tag_name == ''){
              tags.fnerrorMessage('show', 'Tags', 'glyphicon-warning-sign', 'Fill out Tag Name!','bg-danger');
          }else if(tag_desc == ''){
              tags.fnerrorMessage('show', 'Tags', 'glyphicon-warning-sign', 'Fill out Tag Description!','bg-danger');
          }else{
            var tmpArr = {
              "csrf_token"  : $("#csrf_token").val(),
              "tag_name"    : tag_name,
              "tag_desc"    : tag_desc,
              "tag_color"   : tag_color
            };
            if(tmpArr != null){
                tags.request(tmpArr, tags.tagDataResponse);
            }
          }
      });
    },
    fnDelete: function(){
        $('.close').click(function(){
            var delete_data = {"delete_data" : $(this).attr('value')};
            var url = $("#baseurl").val()+"/deletetags";
            $.ajax({
                url: url,
                type: 'GET',
                data: delete_data,
                success: function(response) {
                  console.log(response);
                },
                error: function() {
                    tags.fnerrorMessage('show', 'Tags', 'glyphicon-warning-sign', 'Error occured.Try again', 'bg-danger');
                    console.log('error occured');
                }
            });
        });
    },
    tagDataResponse: function(data){
        if(data == true){
          var addtag =  '<div class="alert alltags alert-dismissable col-lg-2" style="background-color:'+tag_color+'">'+tag_name+
                        '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+
                        '</div>';
        }
        $("#showtags").append(addtag);
        $("#NoTags").addClass('hidden');
        $("#tag_name").val('');
        $("#tag_desc").val('');
        $('#tag_color').val('');
        tags.fnDelete();
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
    request :  function (data, callback){
			var url = $("#baseurl").val()+"/addtags";
			$.ajax({
				url: url,
				type: 'POST',
				data: data,
				success: function(result) {
					callback(result);
				},
				error: function() {
					tags.fnerrorMessage('show', 'Tags', 'glyphicon-warning-sign', 'Error occured.Try again', 'bg-danger');
					console.log('error occured');
				}
			});
		},
  };
  tags.init();
});

;
$(function () {

    // 弹出框操作
    $('.dialog_header').on('mousedown',function (event) {
        var currentX=event.pageX-$(this).offset().left;
        var currentY=event.pageY-$(this).offset().top;
        var rightX=$(this).width-currentX;
        var bottomY=$(this).height-currentY;
        var _this=this;
        $(document).on("mousemove.a",move=function (event) {
            var x=event.pageX-currentX;
            var y=event.pageY-currentY;
            var maxX=$(window).width()-$(_this).parent().width();
            var maxY=$(window).height()-$(_this).parent().height()+$(window).scrollTop();
            if(x<0){
                x=0;
            }
            if(x>maxX){
                x=maxX;
            }
            if (y<52){
                y=52;
            }
            if (y>maxY){
                y=maxY;
            }
            $(_this).parent().offset({top:y,left:x});
            event.preventDefault();

        });
    });
    $(document).on('mouseup',function () {
        $(document).off("mousemove.a");
    });


    $('.dialog_close').on('click',function () {
        $(this).parent().parent().hide();
        $('#zhezhao').hide();

    });

    $('#cover_btn').on('click',function () {
        $('#zhezhao').show();
        $('.set_cover').show();
    });

    $('#icon_btn').on('click',function () {
        $('#zhezhao').show();
        $('.set_icon').show();
    });


    // 设置图片按钮动画
    $('.cover_img').hover(function () {
        $('#cover_btn').stop(true,false).css('display','block').animate({opacity:1},300);
    },function () {
        $('#cover_btn').stop(true,false).animate({opacity:0},300,function () {
            $('#cover_btn').css('display','none');
        });
    });

    $('.cover_icon').hover(function () {
        $('#icon_btn').stop(true,false).css('display','block').animate({opacity:1},300);
    },function () {
        $('#icon_btn').stop(true,false).animate({opacity:0},300,function () {
            $('#icon_btn').css('display','none');
        });
    });


    // 弹出框标签切换
    $('.dialog_content_tab .tab1').on('click',function () {
        $(this).addClass('active').siblings().removeClass('active');
        $(this).parent().parent().find('.content_default').hide().prev().show();
    });

    $('.dialog_content_tab .tab2').on('click',function () {
        $(this).addClass('active').siblings().removeClass('active');
        $(this).parent().parent().find('.content_upload').hide().next().show();
    });


        // 上传自定义封面和头像图片
    $('.select_btn').on('click',function () {
        $('#cover_img_file').click();
        $('#target').val($(this).attr('data-target'));
    });
    var cropper_cover=null;
    var cropper_icon=null;
    $('#cover_img_file').on('change',function () {
        var img_data=new FormData($('#cover_upload_img')[0]);
        var target=$('#target').val();
        $(this).val("");
        $.ajax({
            url:'php/get_img.php',
            type:'POST',
            data:img_data,
            contentType:false,
            processData:false,
            success:function (response,status,xhr) {
                if(response){
                    if(target=='cover'){
                        if(cropper_cover!=null){
                            cropper_cover.cropper('destroy');  //销毁之前的剪裁对象，不然会出现缩放比例的BUG；
                        }
                        cropper_cover= $('#prev_cover').attr('src',response.substring(25)).cropper({
                            aspectRatio:100 / 35,
                            viewMode:1,
                            dragMode:'move'
                        });
                    }else if(target=='icon'){
                        if(cropper_icon!=null){
                            cropper_icon.cropper('destroy');
                        }
                        cropper_icon= $('#prev_icon').attr('src',response.substring(25)).cropper({
                            aspectRatio:1 / 1,
                            viewMode:1,
                            dragMode:'move'
                        });
                    }
                }
            },
            error:function (xhr,status,errorText) {
                
            }
        });
    });



    // 预设图片选择
    $('.content_default li').on('click',function () {
        $(this).addClass('selected').siblings().removeClass('selected');
    });

    //确认图片设置
    $('.dialog_submit').on('click',function () {
        var _this=this;
        var content_default=$(this).parent().prev().find('.content_default')[0];
        var info_name=$(this).attr('data-target');
        if($(content_default).is(':visible')){    //预设图片部分
            var info_value=$(content_default).find('.selected').attr('data-num');
            $.ajax({
                url:'php/reset.php',
                type:'POST',
                data:{
                    'target':'user_info',
                    'name':info_name,
                    'value':info_value
                },
                success:function (response,status,xhr) {
                    if(response==1){
                        $(_this).parent().parent().hide();
                        $('#zhezhao').hide();
                        if(info_name=='cover'){
                            $('.cover_img img').attr('src',"resource/default/cover_"+info_value+".jpg");
                        }else {
                            $('.cover_icon img').attr('src',"resource/default/icon_"+info_value+".jpg");
                        }
                    }
                }
            });
        }else{    //自定义图片部分
            var cropper=eval('cropper_'+info_name);
            if($('#prev_'+info_name).attr('src')==''){
                alert('未选择图片');
            }else {
                var cropper_data=cropper.cropper('getData',true);  //获取剪裁数据
                $.ajax({
                    url:'php/reset.php',
                    type:'POST',
                    data:{
                        'target':'user_info',
                        'name':info_name,
                        'value':0,
                        'operation':'cropper',
                        'x':cropper_data.x,
                        'y':cropper_data.y,
                        'width':cropper_data.width,
                        'height':cropper_data.height,
                    },
                    success:function (response,status,xhr) {
                        if(response==1){
                            $(_this).parent().parent().hide();
                            $('#zhezhao').hide();
                            if(info_name=='cover'){
                                $('.cover_img img').attr('src',"resource/"+user_id+"/info/cover.jpg?="+Math.random());
                            }else {
                                $('.cover_icon img').attr('src',"resource/"+user_id+"/info/icon.jpg?"+Math.random());
                            }
                            cropper.cropper('destroy');
                            $('#prev_'+info_name).attr('src','');
                        }
                    }
                });
               // alert(cropper_data.x+'/'+cropper_data.y+'/'+cropper_data.width+'/'+cropper_data.height+'/'+cropper_data.rotate+'/'+cropper_data.scaleX+'/'+cropper_data.scaleY);
            }
        }
    });


    //主体内容选项卡切换
    $('.main_tab li').on('click',function () {
        $('.main_tab li').removeClass('active');
        $(this).addClass('active');
        var target=$(this).attr('data-target');
        $('.tab_content').hide();
        $(".tab_content."+target).show();

    });



//个人信息栏
    // 个人信息修改按钮
    $('.user_detail>ul li').hover(function () {
        if($(this).find('.info_save').is(':hidden')){
            $(this).find('.info_modify').show();
        }
    },function () {
        if($(this).find('.info_save').is(':hidden')){
            $(this).find('.info_modify').hide();
        }
    });
    // 修改按钮
    $('.info_modify').on('click',function () {
        //设置当前值
        var info_value=$(this).parent().find('.info_item_value>span').html();
        if($(this).attr('data-target')=='gender'){
            if(info_value=='男'){
                $('#gender_female').removeAttr('checked');
                $('#gender_male').attr('checked','checked');
            }else {
                $('#gender_male').removeAttr('checked');
                $('#gender_female').attr('checked','checked');
            }
        }else if($(this).attr('data-target')=='birthday'){
            var info_date=new Date(info_value);
            var date_year=info_date.getFullYear();
            var date_month=info_date.getMonth()+1;
            if(date_month<10){date_month='0'+date_month}
            var date_day=info_date.getDate();
            if(date_day<10){date_day='0'+date_day}
            //alert(date_year+'-'+date_month+'-'+date_day);
            $('#year').val(date_year);
            $('#month').val(date_month);
            $('#day').val(date_day);
        }else {
            $(this).parent().find('.info_input').children().val(info_value);
        }
        //显示修改框
        $(this).hide().next().show().parent().find('.info_item_value>span').hide().next().show();
        $('.cancel_modify').show();

    });
    // 取消按钮
    $('.cancel_modify').on('click',function () {
        $('.info_input').hide();
        $('.info_item_value>span').show();
        $('.user_detail button').hide();
        $('.info_error').html('');
    });

    // 日期选项
    $('#year').on('change',function () {
        if($(this).val()!=0){
            $('#month option').css('display','block');
        }else {
            $('#month option').css('display','none').eq(0).css('display','block');
        }
        $('#month').val('0').trigger('change');
    });

    $('#month').on('change',function () {
        if($.inArray($(this).val(),['01','03','05','07','08','10','12'])>-1){
            $('#day option').css('display','block');
        }else if($.inArray($(this).val(),['04','06','09','11'])>-1){
            $('#day option').css('display','block').eq(31).css('display','none');
        }else if($(this).val()==2){
            $('#day option').css('display','block').eq(31).css('display','none');
            $('#day option').eq(30).css('display','none');
            $('#day option').eq(29).css('display','none');
            if($('#year').val()%400==0||($('#year').val()%4==0&&$('#year').val()%100!=0)){
                $('#day option').eq(29).css('display','block');
            }
        }else {
            $('#day option').css('display','none').eq(0).css('display','block');
        }
        $('#day').val('0').trigger('change');
    });
    $('#day').on('change',function () {
        if($(this).val()==0){
            //$(this).parent().parent().next().removeClass('success').addClass('error').find('span').html('日期不完整！');
        }else {
            //$(this).parent().parent().next().removeClass('error').addClass('success').find('span').html('');
        }
    });

    //提交修改
    $('.info_save').on('click',function () {
        var _this=this;
        var info_name=$(this).attr('data-target');
        var info_value='';
        switch (info_name){
            case 'name':
                info_value=$('#info_set_name input').val();
                if(info_value.length>6||info_value<2){
                    $('.info_error').html('用户名必须2-6个字符！');
                    return;
                }
                break;

            case 'gender':
                info_value=$('#info_set_gender input:checked').val();
                break;

            case 'birthday':
                info_value=''+$('#year').val()+'-'+$('#month').val()+'-'+$('#day').val();
                if($('#day').val()==0){
                    $('.info_error').html('日期未填写完整！');
                    return;
                }
                break;

            case 'contact':
                info_value=$('#info_set_contact input').val();
                break;

            case 'motto':
                info_value=$('#info_set_motto textarea').val();
                break;
        }
        $('.info_error').html('');     //通过验证后取消错误信息

        $.ajax({
            url:'php/reset.php',
            type:'POST',
            data:{
                'target':'user_info',
                'name':info_name,
                'value':info_value
            },
            success:function (response,status,xhr) {
                if(response==1){
                    $(_this).parent().find('.info_input').hide();
                    $(_this).parent().find('.info_item_value>span').html(info_value).show();
                    $(_this).hide();
                    if($.isEmptyObject($('.info_save:visible')[0])){  //若此时没有显示的保存按钮则隐藏顶部的取消按钮
                        $('.cancel_modify').hide();
                    }
                }
            }
        });



    });



    // 侧栏滚动固定定位
    $(document).on('scroll',function () {
        $(this).scrollTop()>415? $('.side').css({'position':'fixed','top':'62px'}):$('.side').css({'position':'static'});
    });


  //微博主栏
    //获取日期
    function get_date(str) {
        var date_string='';
        var oDate=new Date(str);
        var currentDate=new Date();
        var year=oDate.getFullYear();
        var month=oDate.getMonth()+1;
        var day=oDate.getDate();
        var hours=oDate.getHours();
        var minute=oDate.getMinutes();
        var second=oDate.getSeconds();
        var current_year=currentDate.getFullYear();
        var current_month=currentDate.getMonth()+1;
        var current_day=currentDate.getDate();
        var current_hours=currentDate.getHours();
        var current_minute=currentDate.getMinutes();
        var current_second=currentDate.getSeconds();

        if(year!==current_year){
            date_string=current_year-year+'年前';
        }else if (month!==current_month){
            date_string=month+'月'+day+'日 '+hours+':'+minute;
        }else if(day!==current_day){
            date_string=month+'月'+day+'日 '+hours+':'+minute;
        }else if(hours!==current_hours){
            date_string=current_hours-hours+'小时前';
        }else if(minute!==current_minute){
            date_string=current_minute-minute+'分钟前';
        }else {
            date_string='刚刚';
        }
        return date_string;
    }

    // 初始请求用户数据
    var user_name='';
    var user_icon='';
    var user_id='';
    $.ajax({
        url:'php/get_data.php',
        type:'POST',
        data:{
            'target':'user_info'
        },
        success:function (response,status,xhr) {
            var user_info=JSON.parse(response);
            user_name=user_info.name;
            user_id=user_info.id;
            if(user_info.icon==null){
                user_icon="resource/default/icon.jpg";
            }else if(user_info.icon=="0"){
                user_icon="resource/"+user_id+"/info/icon.jpg?="+Math.random();
            }else {
                user_icon="resource/default/icon_"+user_info.icon+".jpg";
            }
            var user_cover='';
            if(user_info.cover==null){
                user_cover="resource/default/cover.jpg";
            }else if(user_info.cover=="0"){
                user_cover="resource/"+user_id+"/info/cover.jpg";
            }else {
                user_cover="resource/default/cover_"+user_info.cover+".jpg";
            }
            var weibo_num=user_info.weibo_num;
            var fans_num=user_info.fans_num;
            var follow_num=user_info.follow_num;
            var user_birthday=user_info.birthday;
            var user_gender=user_info.gender;
            var user_contact=user_info.contact;
            var user_motto=user_info.motto;
            var user_email=user_info.email;
            $('#info_user_name').html(user_name);
            $('#info_user_gender').html(user_gender);
            $('#info_user_birthday').html(user_birthday);
            $('#info_user_contact').html(user_contact);
            $('#info_user_motto').html(user_motto);
            $('.nav_user .user').text(user_name);
            $('.cover_icon img').attr('src',user_icon);
            $('.cover_img img').attr('src',user_cover);
            $('.cover_user_name span').html(user_name);
            $('.cover_user_email span').html(user_email);
            $('#main_editor_user').find('img').attr('src',user_icon);
            $('#total_guanzhu').find('a').html(user_info.follow_num);
            $('#total_fensi').find('a').html(user_info.fans_num);
            $('#total_weibo').find('a').html(user_info.weibo_num);
        }
    });


    // 微博条目
    var loading=false;   //作为当前是否正在加载中标记

    function push_weibo(weibo_json,$obj) {     //将微博条目的json数据添加到页面中
        $.each(weibo_json,function (key,value) {
            var name=value.name;
            var user_id=value.user_id;
            var id=value.id;
            var icon="";
            if(value.icon==null){
                icon="resource/default/icon.jpg";
            }else if(value.icon=="0"){
                icon="resource/"+user_id+"/info/icon.jpg?="+Math.random();
            }else {
                icon="resource/default/icon_"+value.icon+".jpg";
            }
            var collection_attr='class="favorites" title="收藏"';
            var collecttion_text="收藏";
            if(value.collection==1){
                collection_attr='class="favorites active" title="取消收藏"';
                collecttion_text="已收藏";
            }
            var like_total=value.like_total;
            var like_attr='class="support" title="赞"';
            if(value.liked==1){
                like_attr='class="support active" title="取消赞"';
            }
            var date=get_date(value.date);
            var content=value.weibo;
            var comment_total=value.comment_total;
            $obj.append('<div class="content_list_item" data-id="'+id+'"><div class="item_content_area"> <div class="item_header"> <div class="item_user"> <div class="item_user_img"> <a href="user_page.php?id='+user_id+'" class="user_icon" data-id="'+user_id+'"><img src="'+icon+'" alt=""></a> </div> <div class="item_user_info"> <div> <a href="user_page.php?id='+user_id+'" class="user content_user_name user_name" data-id="'+user_id+'">'+name+'</a> </div> <div> <span class="time">'+date+'</span> </div> </div> </div> <div class="user_operation"> <svg> <use xlink:href="#operation_icon"></use> </svg> <ul> <li>删除</li> <li>编辑</li> <li>屏蔽</li> </ul> </div> </div> <div class="item_content">'+content+'</div> <div class="item_footer"> <div class="item_bar"> <ul> <li '+collection_attr+'> <svg> <use xlink:href="#favorites_icon"></use> </svg> <span>'+collecttion_text+'</span> </li> <li class="share" title="分享"> <svg> <use xlink:href="#share_icon"></use> </svg> <span>10</span> </li> <li class="comments" title="评论"> <svg> <use xlink:href="#comments_icon"></use> </svg> <span>'+comment_total+'</span> </li> <li '+like_attr+'> <svg> <use xlink:href="#support_icon"></use> </svg> <span>'+like_total+'</span> </li> </ul> </div> </div> </div> <!--评论区--> <div class="comment_area"> <div class="comment_area_container"> <!--评论编辑框--> <div class="comment_editor"> <div class="comment_user"> <a href="javascript:void(0);"> <img src="'+user_icon+'" alt=""> </a> </div> <div class="comment_editor_box"> <div class="comment_editor_area" contenteditable="true"> </div> <div class="comment_editor_bar"> <div class="comment_editor_input_more"> <span class="add_meme" title="添加表情"><svg> <use xlink:href="#meme"></use> </svg></span></div> <div class="comment_editor_submit"> <button type="submit">评论</button> </div> </div> </div> </div> <!--评论列表--> <div class="comment_list" data-num=0></div><div class="more_comment"><a href="javascript:void(0);">更多评论</a><img src="img/loading.gif"></div></div></div></div>');
        });
    }

    function get_weibo() {
        if($('#content_list_all').hasClass('done')){    //判断是否已经加载完所有条目
            return false;
        }
        $('.content_footer').show();
        loading=true;
        var weibo_num=parseInt($('#content_list_all').attr('data-num'));
        $.ajax({
            url: "php/get_data.php",
            type: "POST",
            data: {
                "target": "weibo",
                "num":weibo_num
            },
            success: function (response, status, xhr) {
                var weibo_json = JSON.parse(response);
                if($.isEmptyObject(weibo_json)){   //若获取的json为空则添加加载完全标记
                    $('#content_list_all').addClass('done');
                }
                push_weibo(weibo_json,$('#content_list_all'));
                $('#content_list_all').attr('data-num',weibo_num+10);
                $('.content_footer').hide();
                loading=false;
            }
        });
    }
    get_weibo();


    // 头部快捷按钮及内容操作按钮
    $('body').on('click','.shortcut>span,.user_operation>svg,.item_comment_operation svg',function (event) {

        if($(this).next().is(':hidden')){
            $('.shortcut>div,.user_operation ul,.item_comment_operation ul').hide();
            $(this).next().fadeIn(200).on('click',function (event) {
                event.stopPropagation();
            });

            $('html').one('click',function () {
                $('.shortcut>div,.user_operation ul,.item_comment_operation ul').hide();
            });
            event.stopPropagation();
        }
    });


    // 评论折叠
    $('body').on('click','.comments',function () {
        var comment=$(this).closest('.item_content_area').next()[0];
        if(!($(comment).find('.comment_list').hasClass('first_load'))){  //判断是否完成了初次加载
            $(comment).find('.more_comment a').trigger('click');
        }
        if($(this).hasClass('unfold')){
            $(this).removeClass('unfold');
            $(comment).stop(true,false).animate({'height':0},300,function () {
                $(comment).css('display','none');
            });
        }else {
            $(this).addClass('unfold');
            $(comment).stop(true,false).css('display','block').animate({'height':$(comment).children().height()},300,function () {
                $(comment).css('height','auto');
            });
        }
    });


    // 编辑器操作
    //添加链接
    $('#add_link').on('click',function () {
        $('.add_link_box').fadeIn(300);
    });

    $('.add_link_box .box_header span').on('click',function () {
        $('.add_link_box').fadeOut(300);
        $('#link_name').val("");
        $('#link').val("");
        $('.link_error').hide();
    });
    $('.add_link_box .box_footer button').on('click',function () {
        var link_name=$.trim($('#link_name').val());
        if(link_name==''){
            $('.link_error').show();
            return;
        }
        var link=$('#link').val();
        var $a=$("<a href='"+link+"' target='_blank'><svg class='svg_link'> <use xlink:href='#link_icon'></use> </svg>"+link_name+"</a>");
        $("#main_editor").append($a);
        $('.add_link_box').fadeOut(300);
        $('#link_name').val("");
        $('#link').val("");
        $('.link_error').hide();
    });

    // 添加图片
    $('#add_img').on('click',function () {
        $('#img_file').trigger('click');
    });

    $('#img_file').on('change',function () {
        console.info(1);
        var img_data=new FormData($('#upload_img')[0]);
        $.ajax({
            url:'php/get_img',
            type:'POST',
            data:img_data,
            contentType:false,
            processData:false,
            success:function (respnose,status,xhr) {
                if(respnose){
                    var $img=$("<img src='"+respnose.substring(25)+"'>");
                    $('#main_editor').append($img);
                    $('#img_file').val("");
                }
            }
        });
    });

    //添加表情
    $('body').on('click','.add_meme',function (event) {
        var currentX=event.pageX+'px';
        var currentY=event.pageY+'px';
        if(!($('#add_meme_box').hasClass('has_meme'))){
            $.ajax({
                url:'php/get_data.php',
                type:'POST',
                data:{
                    'target':'meme'
                },
                success:function (response,status,xhr) {
                    var meme_json=JSON.parse(response);
                    $.each(meme_json,function (key,value) {
                        if(value!='.'&&value!='..'){    //跳过目录中包含的.和..项
                            $('#add_meme_box .box_content ul').append('<li><img class="meme_img" src="resource/meme/'+value+'" alt=""></li>');
                        }
                    });
                    $('#add_meme_box').addClass('has_meme');
                }
            });
        }
        $('.meme_target').removeClass('meme_target');
        $(this).addClass('meme_target');      //给当前触发的按钮添加目标类，以锁定表情输入的编辑框
        $('#add_meme_box').css({'left':currentX,'top':currentY}).fadeIn(300);
    });

    $('#add_meme_box .box_header span').on('click',function () {
        $('#add_meme_box').fadeOut(300);
    });

    $('body').on('click','#add_meme_box li',function () {
        var editor=$('.meme_target').parent().parent().parent().find('div[contenteditable=true]')[0];
        $(editor).append($(this).html());
    });


    // 发布微博
    $('#fabu').on('click',function () {
        var weibo_content=$('#main_editor').html().replace(/^(&nbsp;|\s)+|(&nbsp;|\s)+$/g,'');   //去除前后空格；
        if(weibo_content==''){
            alert('不能为空');
            return false;
        }
        $(this).html('提交中..').attr('disabled','disabled');
        var _this=this;
        $.ajax({
            url:'php/fabu.php',
            type:'POST',
            data:{
                'content':weibo_content,
                'target':'weibo'

            },
            success:function (response,status,xhr) {
                var weibo_json=JSON.parse(response);
                $('#content_list_all').prepend('<div class="content_list_item" data-id="'+weibo_json.id+'" style="height: 0; overflow: hidden;"><div><div class="item_content_area"> <div class="item_header"> <div class="item_user"> <div class="item_user_img"> <a href="user_page.php" class="user_icon" data_id="'+weibo_json.user_id+'"><img src="'+user_icon+'" alt=""></a> </div> <div class="item_user_info"> <div> <a href="user_page.php" class="user content_user_name user_name" data-id="'+weibo_json.user_id+'">'+user_name+'</a> </div> <div> <span class="time">'+get_date(weibo_json.date)+'</span> </div> </div> </div> <div class="user_operation"> <svg> <use xlink:href="#operation_icon"></use> </svg> <ul> <li>删除</li> <li>编辑</li> <li>屏蔽</li> </ul> </div> </div> <div class="item_content">'+weibo_json.weibo+'</div> <div class="item_footer"> <div class="item_bar"> <ul> <li class="favorites" title="收藏"> <svg> <use xlink:href="#favorites_icon"></use> </svg> <span>收藏</span> </li> <li class="share" title="分享"> <svg> <use xlink:href="#share_icon"></use> </svg> <span>10</span> </li> <li class="comments" title="评论"> <svg> <use xlink:href="#comments_icon"></use> </svg> <span>0</span> </li> <li class="support" title="赞"> <svg> <use xlink:href="#support_icon"></use> </svg> <span>0</span> </li> </ul> </div> </div> </div> <!--评论区--> <div class="comment_area"> <div class="comment_area_container"> <!--评论编辑框--> <div class="comment_editor"> <div class="comment_user"> <a href=""> <img src="img/touxiang.jpg" alt=""> </a> </div> <div class="comment_editor_box"> <div class="comment_editor_area" contenteditable="true"> </div> <div class="comment_editor_bar"> <div class="comment_editor_input_more"><span class="add_meme" title="添加表情"><svg> <use xlink:href="#meme"></use> </svg></span></div> <div class="comment_editor_submit"> <button type="submit">评论</button> </div> </div> </div> </div> <!--评论列表--> <div class="comment_list" data-num=0></div><div class="more_comment"><a href="javascript:void(0);">更多评论</a><img src="img/loading.gif"></div></div></div></div></div>');
                // 增加已加载微博数
                $('#content_list_all').attr('data-num',parseInt($('#content_list_all').attr('data-num'))+1);
                //设置新增微博动画
                var current_weibo=$("#content_list_all .content_list_item[data-id="+weibo_json.id+"]")[0];
                $(current_weibo).animate({height:$(current_weibo).children().height()},300,function () {
                    $(current_weibo).css('height','auto');
                });
                $('#main_editor').html('');
                $(_this).html('发布').removeAttr('disabled');
            }
        });
    });


    // 发布评论
    $('body').on('click','.comment_editor_submit button',function () {
        var editor=$(this).closest('.comment_editor').find('.comment_editor_area')[0];
        var comment_content=$(editor).html().replace(/^(&nbsp;|\s)+|(&nbsp;|\s)+$/g,'');
        if(comment_content==''){
            alert('不能为空');
            return false;
        }
        $(this).html('提交中..').attr('disabled','disabled');
        var comment_list=$(this).closest('.comment_area').find('.comment_list')[0];
        var id=$(this).closest('.content_list_item').attr('data-id');
        var _this=this;
        $.ajax({
            url:"php/fabu.php",
            type:"POST",
            data:{
                'content':comment_content,
                'target':'comment',
                'weibo_id':id
            },
            success:function (response,status,xhr) {
                var comment_json=JSON.parse(response);
                var id=comment_json.id;
                var user_id=comment_json.user_id;
                var content=comment_json.comment;
                var date=get_date(comment_json.date);

                $(comment_list).prepend('<div class="item_comment" data-id="'+id+'" style="height: 0; overflow: hidden;"><div> <div class="item_comment_user"> <a href="user_page.php" data-id="'+user_id+'" class="user_icon"><img src="'+user_icon+'" alt=""></a> </div> <div class="item_comment_content_box"> <div class="item_comment_content"> <p><a href="user_page.php" class="user user_name" data-id="'+user_id+'">'+user_name+'</a>：'+content+'</p> </div> <div class="item_comment_content_bar"> <span class="date">'+date+'</span> <a href="javascript:void(0);" class="comment_like" title="点赞"><span>0</span>赞</a><a href="javascript:void(0);" class="comment_reply_btn"><span>0</span>条回复</a></div> <!--回复区--> <div class="reply_area"><div> <!--回复编辑框--> <div class="reply_editor"> <div class="reply_editor_area" contenteditable="true"> </div> <div class="reply_editor_bar"> <div class="reply_editor_input_more"><span class="add_meme" title="添加表情"><svg> <use xlink:href="#meme"></use> </svg></span></div> <div class="reply_editor_submit"> <button type="submit">评论</button> </div> </div> </div> <div class="reply_list" data-num="0"></div><div class="more_reply"> <a href="javascript:void (0);">更多回复</a><img src="img/loading.gif"> </div></div> </div> </div> <div class="item_comment_operation"> <svg> <use xlink:href="#operation_icon"></use> </svg> <ul> <li>隐藏评论</li> <li>删除</li> </ul> </div> </div></div>');
                //增加当前微博的评论条目总数
                var comment_num=$(_this).closest('.content_list_item').find('.comments span')[0];
                $(comment_num).html(parseInt($(comment_num).html())+1);
                //增加已加载评论条目数
                $(comment_list).attr('data-num',parseInt($(comment_list).attr('data-num'))+1);
                // 设置加载动画
                var current_comment=$(comment_list).find(".item_comment[data-id="+id+"]")[0];   //获取当前新添加的评论对象
                $(current_comment).animate({height:$(current_comment).children().height()},300,function () {
                    $(current_comment).css('height','auto');
                });
                // 重置编辑框
                $(editor).html("");
                $(_this).html('发布').removeAttr('disabled');
            }

        });
    });


    // 获取评论
    $('body').on('click','.more_comment a',function () {
        $(this).hide().next().show();
        var _this=this;
        var id=$(this).closest('.content_list_item').attr('data-id');
        var comment_list=$(this).closest('.content_list_item').find('.comment_list')[0];
        $(comment_list).addClass('first_load');//添加已完成初次加载标志
        var comment_num=parseInt($(comment_list).attr('data-num'));
        $.ajax({
            url:'php/get_data.php',
            type:'POST',
            data:{
                'target':'comment',
                'weibo_id':id,
                'num':comment_num
            },
            success:function (response,status,xhr) {
                var comment_json=JSON.parse(response);
                $.each(comment_json,function (key,value) {
                    var name=value.name;
                    var user_id=value.user_id;
                    var id=value.id;
                    var icon="";
                    if(value.icon==null){
                        icon="resource/default/icon.jpg";
                    }else if(value.icon=="0"){
                        icon="resource/"+user_id+"/info/icon.jpg?="+Math.random();   //由于更改自定义图片后地址不变，添加随机数，防止读取缓存；
                    }else {
                        icon="resource/default/icon_"+value.icon+".jpg";
                    }
                    var date=get_date(value.date);
                    var content=value.comment;
                    var comment_like_total=value.comment_like_total;
                    var comment_like_attr='class="comment_like" title="点赞"';
                    if(value.comment_liked==1){
                        comment_like_attr='class="comment_like active" title="取消赞"';
                    }
                    var comment_reply_total=value.comment_reply_total;

                    $(comment_list).append('<div class="item_comment" data-id="'+id+'"> <div class="item_comment_user"> <a href="user_page.php?id='+user_id+'" data-id="'+user_id+'" class="user_icon"><img src="'+icon+'" alt=""></a> </div> <div class="item_comment_content_box"> <div class="item_comment_content"> <p><a href="user_page.php?id='+user_id+'" class="user user_name" data-id="'+user_id+'">'+name+'</a>：'+content+'</p> </div> <div class="item_comment_content_bar"> <span class="date">'+date+'</span> <a href="javascript:void(0);" '+comment_like_attr+'><span>'+comment_like_total+'</span>赞</a><a href="javascript:void(0);" class="comment_reply_btn"><span>'+comment_reply_total+'</span>条回复</a></div> <!--回复区--> <div class="reply_area"><div> <!--回复编辑框--> <div class="reply_editor"> <div class="reply_editor_area" contenteditable="true"> </div> <div class="reply_editor_bar"> <div class="reply_editor_input_more"> <span class="add_meme" title="添加表情"><svg> <use xlink:href="#meme"></use> </svg></span> </div> <div class="reply_editor_submit"> <button type="submit">回复</button> </div> </div> </div> <div class="reply_list" data-num="0"></div><div class="more_reply"> <a href="javascript:void (0);">更多回复</a><img src="img/loading.gif"> </div></div> </div> </div> <div class="item_comment_operation"> <svg> <use xlink:href="#operation_icon"></use> </svg> <ul> <li>隐藏评论</li> <li>删除</li> </ul> </div> </div>');
                });
                comment_num=comment_num+10;
                $(comment_list).attr('data-num',comment_num);
                if(comment_num>=parseInt($(comment_list).closest('.content_list_item').find('.comments span').html())){
                    $(_this).parent().hide();
                }else {
                    $(_this).show().next().hide();
                }
            }

        });
    });


    // 评论回复按钮
    $('body').on('click','.comment_reply_btn',function () {
        var reply_area=$(this).parent().next()[0];
        if(!($(reply_area).find('.reply_list').hasClass('first_load'))){   //判断是否完成了初次加载
            $(reply_area).find('.more_reply a').trigger('click');
        }
        if($(reply_area).is(':hidden')){

            $(reply_area).stop(true,false).css('display','block').animate({'height':$(reply_area).children().height()},300,function () {
                $(reply_area).css('height','auto');
            });
        }
        else {
            $(reply_area).stop(true,false).animate({'height':0},300,function () {
                $(reply_area).css('display','none');
            });
        }
    });


    //回复回复按钮
    $('body').on('click','.reply_reply_btn',function () {
        if(!($(this).closest('.item_reply').next().hasClass('reply_reply_editor'))){
            $(this).closest('.item_reply').after('<!--回复回复编辑框--> <div class="reply_reply_editor"><div class="reply_editor"> <div class="reply_editor_area" contenteditable="true"> </div> <div class="reply_editor_bar"> <div class="reply_editor_input_more"> <span class="add_meme" title="添加表情"><svg> <use xlink:href="#meme"></use> </svg></span> </div> <div class="reply_reply_editor_submit"> <button type="submit">回复</button> </div> </div> </div></div>');
        }
        var reply_reply_editor=$(this).closest('.item_reply').next()[0];
        if($(reply_reply_editor).is(':hidden')){
            $(reply_reply_editor).stop(true,false).css('display','block').animate({'height':'94px'},300,function () {
                $(reply_reply_editor).css('height','auto');
            });
        }
        else {
            $(reply_reply_editor).stop(true,false).animate({'height':0},300,function () {
                $(reply_reply_editor).css('display','none');
            });
        }
    });


    //发布评论回复
    $('body').on('click','.reply_editor_submit button',function () {
        $(this).html('提交中..').attr('disabled','disabled');
        var _this=this;
        var id=$(this).closest('.item_comment').attr('data-id');
        var editor=$(this).closest('.reply_editor').find('.reply_editor_area')[0];
        var reply_list=$(this).closest('.reply_area').find('.reply_list')[0];
        var reply_content=$(editor).html();

        $.ajax({
            url:"php/fabu.php",
            type:"POST",
            data:{
                'target':'reply',
                'comment_id':id,
                'content':reply_content
            },
            success:function (response,status,xhr) {
                var reply_json=JSON.parse(response);
                var id=reply_json.id;
                var user_id=reply_json.user_id;
                var content=reply_json.reply;
                $(reply_list).prepend('<div class="item_reply" data-id="'+id+'" style="height: 0; overflow: hidden;"> <div><div class="item_reply_user"> <a href="user_page.php" class="user_icon" data-id="'+user_id+'"><img src="'+user_icon+'" alt=""></a> </div> <div class="item_reply_content_box"> <div class="item_reply_content"> <a href="user_page.php" class="user user_name" data-id="'+user_id+'">'+user_name+'</a>：'+content+' </div> <div class="item_reply_content_bar"> <span class="date">刚刚</span> <a href="javascript:void(0);" class="reply_like" title="点赞"><span>0</span>赞</a> <a href="javascript:void(0);" class="reply_reply_btn">回复</a> <a href="">隐藏回复</a> </div> </div> </div></div>');
                //增加当前评论的回复条目总数
                var reply_num=$(_this).closest('.item_comment').find('.comment_reply_btn span')[0];
                $(reply_num).html(parseInt($(reply_num).html())+1);
                //增加已加载回复条目数
                $(reply_list).attr('data-num',parseInt($(reply_list).attr('data-num'))+1);
                // 设置加载动画
                var current_reply=$(reply_list).find(".item_reply[data-id="+id+"]")[0];   //获取当前新添加的评论对象
                $(current_reply).animate({height:$(current_reply).children().height()},300,function () {
                    $(current_reply).css('height','auto');
                });
                // 重置编辑框
                $(editor).html("");
                $(_this).html('发布').removeAttr('disabled');
            }
        });
    });


    //发布回复回复
    $('body').on('click','.reply_reply_editor_submit button',function () {
        $(this).html('提交中..').attr('disabled','disabled');
        var _this=this;
        var id=$(this).closest('.item_comment').attr('data-id');
        var editor=$(this).closest('.reply_editor').find('.reply_editor_area')[0];
        var reply_list=$(this).closest('.reply_area').find('.reply_list')[0];
        var reply_content=$(editor).html();
        var reply_id=$(this).closest('.reply_reply_editor').prev().attr('data-id');
        //获取回复目标的用户id和name;
        var target_user_id=$(this).closest('.reply_reply_editor').prev().find('.user_name:first-child').attr('data-id');
        var target_user_name=$(this).closest('.reply_reply_editor').prev().find('.user_name').html();
        $.ajax({
            url:'php/fabu.php',
            type:'POST',
            data:{
                'target':'reply',
                'comment_id':id,
                'reply_id':reply_id,
                'content':reply_content
            },
            success:function (response,status,xhr) {
                var reply_reply_json=JSON.parse(response);
                var id=reply_reply_json.id;
                var user_id=reply_reply_json.user_id;
                var content=reply_reply_json.reply;
                $(reply_list).prepend('<div class="item_reply" data-id="'+id+'" style="height: 0; overflow: hidden;"> <div><div class="item_reply_user"> <a href="user_page.php" class="user_icon" data-id="'+user_id+'"><img src="'+user_icon+'" alt=""></a> </div> <div class="item_reply_content_box"> <div class="item_reply_content"> <a href="user_page.php" class="user user_name" data-id="'+user_id+'">'+user_name+'</a><span>回复</span><a href="user_page.php?id='+target_user_id+'" class="user user_name" data-id="'+target_user_id+'">'+target_user_name+'</a>：'+content+' </div> <div class="item_reply_content_bar"> <span class="date">刚刚</span> <a href="javascript:void(0);" class="reply_like" title="点赞"><span>0</span>赞</a> <a href="javascript:void(0);" class="reply_reply_btn">回复</a> <a href="">隐藏回复</a> </div> </div> </div></div>');
                //增加当前评论的回复条目总数
                var reply_num=$(_this).closest('.item_comment').find('.comment_reply_btn span')[0];
                $(reply_num).html(parseInt($(reply_num).html())+1);
                //增加已加载回复条目数
                $(reply_list).attr('data-num',parseInt($(reply_list).attr('data-num'))+1);
                // 设置加载动画
                var current_reply=$(reply_list).find(".item_reply[data-id="+id+"]")[0];   //获取当前新添加的评论对象
                $(current_reply).animate({height:$(current_reply).children().height()},300,function () {
                    $(current_reply).css('height','auto');
                });
                // 重置编辑框
                $(editor).html("");
                $(_this).html('回复').removeAttr('disabled');
            }
        });
    });


    //获取回复
    $('body').on('click','.more_reply a',function () {
        $(this).hide().next().show();
        var _this=this;
        var id=$(this).closest('.item_comment').attr('data-id');
        var reply_list=$(this).closest('.item_comment').find('.reply_list')[0];
        $(reply_list).addClass('first_load');
        var reply_num=parseInt($(reply_list).attr('data-num'));
        $.ajax({
            url:'php/get_data.php',
            type:'POST',
            data:{
                'target':'reply',
                'comment_id':id,
                'num':reply_num
            },
            success:function (response,status,xhr) {
                var reply_json=JSON.parse(response);
                $.each(reply_json,function (key,value) {
                    var id=value.id;
                    var name=value.name;
                    var user_id=value.user_id;
                    var icon="";
                    if(value.icon==null){
                        icon="resource/default/icon.jpg";
                    }else if(value.icon=="0"){
                        icon="resource/"+user_id+"/info/icon.jpg?="+Math.random();
                    }else {
                        icon="resource/default/icon_"+value.icon+".jpg";
                    }
                    var content=value.reply;
                    var date=get_date(value.date);
                    var target_content='';
                    if(value.reply_id!=null){
                        var target_user_id=value.target_user_id;
                        var target_name=value.target_name;
                        target_content="<span>回复</span><a href='user_page.php?id="+target_user_id+"' class='user user_name' data-id='"+target_user_id+"'>"+target_name+"</a>";
                    }
                    var reply_like_total=value.reply_like_total;
                    var reply_like_attr='class="reply_like" title="点赞"';
                    if(value.reply_liked==1){
                        reply_like_attr='class="reply_like active" title="取消赞"';
                    }
                    $(reply_list).append('<div class="item_reply" data-id="'+id+'"> <div class="item_reply_user"> <a href="user_page.php?id='+user_id+'" class="user_icon" data-id="'+user_id+'"><img src="'+icon+'" alt=""></a> </div> <div class="item_reply_content_box"> <div class="item_reply_content"> <a href="user_page.php?id='+user_id+'" class="user user_name" data-id="'+user_id+'">'+name+'</a>'+target_content+'：'+content+' </div> <div class="item_reply_content_bar"> <span class="date">'+date+'</span> <a href="javascript:void(0);" '+reply_like_attr+'><span>'+reply_like_total+'</span>赞</a> <a href="javascript:void(0);" class="reply_reply_btn">回复</a> <a href="">隐藏回复</a> </div> </div> </div>');
                });
                reply_num=reply_num+10;
                $(reply_list).attr('data-num',reply_num);
                if(reply_num>=parseInt($(_this).closest('.item_comment').find('.comment_reply_btn span').html())){
                    $(_this).parent().hide();
                }else {
                    $(_this).show().next().hide();
                }
            }
        });
    });


    //收藏微博
    $('body').on('click','.favorites',function () {
        var _this=this;
        var id=$(this).closest('.content_list_item').attr('data-id');
        if($(_this).hasClass('active')){
            $.ajax({
                url:'php/fabu.php',
                type:'POST',
                data:{
                    'target':'remove_collection',
                    'weibo_id':id
                },
                success:function (response,status,xhr) {
                    if(response==1){
                        $(_this).removeClass('active').attr('title','收藏').find('span').html('收藏');
                    }
                }
            });
        }else {
            $.ajax({
                url:'php/fabu.php',
                type:'POST',
                data:{
                    'target':'add_collection',
                    'weibo_id':id
                },
                success:function (response,status,xhr) {
                    if(response==1){
                        $(_this).find('svg').stop(true,true).animate({'height':'25px','width':'25px'},300).animate({'height':'20px','width':'20px'},150);
                        $(_this).addClass('active').attr('title','取消收藏').find('span').html('已收藏');
                    }
                }
            });
        }
    });


    // 微博点赞
    $('body').on('click','.support',function () {
        var _this=this;
        var id=$(this).closest('.content_list_item').attr('data-id');
        var like_total=parseInt($(this).find('span').html());
        if($(this).hasClass('active')){
            $.ajax({
                url:'php/fabu.php',
                type:'POST',
                data:{
                    'target':'cancel_like',
                    'weibo_id':id
                },
                success:function (response,status,xhr) {
                    if(response==1){
                        $(_this).removeClass('active').attr('title','赞').find('span').html(like_total-1);
                    }
                }
            });
        }else {
            $.ajax({
                url:'php/fabu.php',
                type:'POST',
                data:{
                    'target':'like',
                    'weibo_id':id
                },
                success:function (response,status,xhr) {
                    if(response==1){
                        $(_this).find('svg').stop(true,true).animate({'height':'25px','width':'25px'},300).animate({'height':'20px','width':'20px'},150);
                        $(_this).addClass('active').attr('title','取消赞').find('span').html(like_total+1);
                    }
                }
            });
        }
    });


    //评论点赞
    $('body').on('click','.comment_like',function () {
        var _this=this;
        var id=$(this).closest('.item_comment').attr('data-id');
        var comment_like_num=parseInt($(this).find('span').html());
        if($(this).hasClass('active')){
            $.ajax({
                url:'php/fabu.php',
                type:'POST',
                data:{
                    'target':'cancel_like',
                    'comment_id':id
                },
                success:function (response,status,xhr) {
                    if(response==1){
                        $(_this).removeClass('active').attr('title','点赞').find('span').html(comment_like_num-1);
                    }
                }
            });
        }else {
            $.ajax({
                url:'php/fabu.php',
                type:'POST',
                data:{
                    'target':'like',
                    'comment_id':id
                },
                success:function (response,status,xhr) {
                    if(response==1){
                        $(_this).addClass('active').attr('title','取消赞').find('span').html(comment_like_num+1);
                    }
                }
            });
        }
    });


    //回复点赞
    $('body').on('click','.reply_like',function () {
        var _this=this;
        var id=$(this).closest('.item_reply').attr('data-id');
        var reply_like_num=parseInt($(this).find('span').html());
        if($(this).hasClass('active')){
            $.ajax({
                url:'php/fabu.php',
                type:'POST',
                data:{
                    'target':'cancel_like',
                    'reply_id':id
                },
                success:function (response,status,xhr) {
                    if(response==1){
                        $(_this).removeClass('active').attr('title','赞').find('span').html(reply_like_num-1);
                    }
                }
            });
        }else{
            $.ajax({
                url:'php/fabu.php',
                type:'POST',
                data:{
                    'target':'like',
                    'reply_id':id
                },
                success:function (response,status,xhr) {
                    if(response==1){
                        $(_this).addClass('active').attr('title','取消赞').find('span').html(reply_like_num+1);
                    }
                }
            });
        }
    });


    //评论及回复操作栏隐藏显示
    //评论
    $('body').on('mouseover','.item_comment',function () {
        $(this).find('.item_comment_content_bar a').show();
        $(this).find('.item_comment_operation svg').show();
    });
    $('body').on('mouseout','.item_comment',function () {
        $(this).find('.item_comment_content_bar a').hide();
        $(this).find('.item_comment_operation svg').hide();
    });
    //回复
    $('body').on('mouseover','.item_reply',function () {
        $(this).find('.item_reply_content_bar a').show();
    });
    $('body').on('mouseout','.item_reply',function () {
        $(this).find('.item_reply_content_bar a').hide();
    });



    //搜索当前微博；
    $('#current_search_btn').on('click',function () {
        $('#content_list_search').html('').removeClass('done').attr('data-num','0');   //重置条目数及状态
        $('#weibo_all').hide();
        $('#weibo_search').show();
        var value=$('#current_search').val();
        $('#search_keywords').html(value);      //设置搜索关键字
        get_weibo_search(value);
    });

    //从当前搜索返回
    $('#weibo_search_info button').on('click',function () {
        $('#weibo_all').show();
        $('#weibo_search').hide();
    });

    //搜索框enter键开始搜索
    $('.enter_search').on('keydown',function (event) {
        if(event.which==13){
            event.preventDefault();
            $(this).next().trigger('click');
        }
    });


    //获取当前搜索的微博条目
    function get_weibo_search(value) {
        if($('#content_list_search').hasClass('done')){    //判断是否已经加载完所有条目
            return false;
        }
        loading=true;
        var weibo_num=parseInt($('#content_list_search').attr('data-num'));
        $.ajax({
            url: "php/get_data.php",
            type: "POST",
            data: {
                "target": "weibo",
                "operation":'search',
                'value':value,
                "num":weibo_num,
            },
            success: function (response, status, xhr) {
                var weibo_json = JSON.parse(response);
                if($.isEmptyObject(weibo_json)){   //若获取的json为空则添加加载完全标记
                    $('#content_list_search').addClass('done').append('<div class="search_bottom">没有更多结果了</div>');
                }
                push_weibo(weibo_json,$('#content_list_search'));
                $('#content_list_search').attr('data-num',weibo_num+10);
                loading=false;
            }
        });
    }


    //获取并显示用户名片
    var show_card=null;
    var hide_card=null;
    var card_this=null;
    $('body').on('mouseover','.user_icon,.user_name',function (event) {
        if(this==card_this){     //若当前移入的是前一次移入的则清除隐藏；
            clearTimeout(hide_card);
            if($('.user_card').is(':visible')){  //若是前一次移入的且还未隐藏则退出；
                return;
            }
        }
        card_this=this;
        var id=$(this).attr('data-id');
        show_card=setTimeout(function () {
            var currentX=event.pageX;
            var currentY=event.pageY;
            var scrollY=$(document).scrollTop();
            $.ajax({
                url:'php/get_data.php',
                type:'POST',
                data:{
                    'target':'user_info',
                    'id':id
                },
                success:function (response,status,xhr) {
                    var card_info=JSON.parse(response);
                    var user_id=card_info.id;
                    var user_icon='';
                    var user_cover='';
                    var user_name=card_info.name;
                    var follow_num=card_info.follow_num;
                    var fans_num=card_info.fans_num;
                    var weibo_num=card_info.weibo_num;
                    var followed=card_info.followed;
                    if(card_info.icon==null){
                        user_icon="resource/default/icon.jpg";
                    }else if(card_info.icon=="0"){
                        user_icon="resource/"+user_id+"/info/icon.jpg?="+Math.random();
                    }else {
                        user_icon="resource/default/icon_"+card_info.icon+".jpg";
                    }
                    if(card_info.cover==null){
                        user_cover="resource/default/cover.jpg";
                    }else if(card_info.cover=="0"){
                        user_cover="resource/"+user_id+"/info/cover.jpg?="+Math.random();
                    }else {
                        user_cover="resource/default/cover_"+card_info.cover+".jpg";
                    }
                    $('.card_cover>img').attr('src',user_cover);
                    $('.card_user_img img').attr('src',user_icon);
                    $('.card_user_img a').attr('href','user_page.php?id='+user_id);
                    $('.card_user_name a').html(user_name).attr('href','user_page.php?id='+user_id);
                    $('#card_follow a').html(follow_num);
                    $('#card_fans a').html(fans_num);
                    $('#card_weibo a').html(weibo_num);
                    $('#card_follow_btn').attr('data-id',user_id);
                    if(followed==1){     //关注按钮的状态
                        $('#card_follow_btn').css('display','inline-block').addClass('followed').html('已关注');
                    }else if(followed==0){
                        $('#card_follow_btn').css('display','inline-block').removeClass('followed').html('+关注');
                    }else if(followed==-1){
                        $('#card_follow_btn').css('display','none');
                    }
                    var x=currentX-100+'px';
                    var y=currentY+10+'px';
                    $('.arrow_up').css('display','block');
                    $('.arrow_down').css('display','none');
                    if(currentY-scrollY>262){
                        y=currentY-210+'px';
                        $('.arrow_up').css('display','none');
                        $('.arrow_down').css('display','block');
                    }
                    $('.user_card').css({'top':y,'left':x}).slideDown(300);
                }
            });
        },1000);
    });

    $('body').on('mouseout','.user_icon,.user_name',function (event) {
        clearTimeout(show_card);
        hide_card=setTimeout(function () {
            $('.user_card').slideUp(300);
        },500);

    });

    $('.user_card').hover(function () {
        clearTimeout(hide_card);
    },function () {
        hide_card=setTimeout(function () {
            $('.user_card').slideUp(300);
        },500);
    });



    //相册页加载
    var album_loading=false;       //相册加载中状态标记
    function get_album() {
        if($('.main_album').hasClass('done')){   //若已经加载完全则退出；
            return false;
        }
        album_loading=true;
        var num=$('.main_album').attr('data-num');
        $.ajax({
            url:'php/get_data',
            type:'POST',
            data:{
                'target':'album',
                'num':num
            },
            success:function (response,status,xhr) {
                var album_json=JSON.parse(response);
                if($.isEmptyObject(album_json)){   //若获取的json为空则添加加载完全标记
                    $('.main_album').addClass('done');
                }
                var i=0;
                var img_num=Object.keys(album_json).length;
                function push_img(i,album_json,img_num) {
                    var value=album_json[i];
                    if(value!='.'&&value!='..'&&value!='info'&&value!='tmp'&&value!=undefined){       //判断值是否为图片,是图片则添加
                        var $oImg=$('<div> <a href="resource/'+user_id+'/'+value+'" target="_blank"><img src="resource/'+user_id+'/'+value+'" alt=""></a> </div>');
                        var min_height=Math.min($('#album_col_1').height(),$('#album_col_2').height(),$('#album_col_3').height(),$('#album_col_4').height());          //获取最小高度
                        switch (min_height){
                            case $('#album_col_1').height():
                                $('#album_col_1').append($oImg);
                                break;

                            case $('#album_col_2').height():
                                $('#album_col_2').append($oImg);
                                break;

                            case $('#album_col_3').height():
                                $('#album_col_3').append($oImg);
                                break;

                            case $('#album_col_4').height():
                                $('#album_col_4').append($oImg);
                                break;
                        }
                        $oImg.find('img')[0].onload=function () {
                            $oImg.height($oImg.find('img').height());    //图片加载完成后获取图片高度，并设置外层高度；
                            i++;
                            if(i>=img_num){                          //高度设置完成后判断再次执行
                                return false;
                            }else {
                                push_img(i,album_json,img_num);
                            }
                        }
                    }else {   //不是图片则递增后再次执行
                        i++;
                        if(i>=img_num){
                            return false;
                        }else {
                            push_img(i,album_json,img_num);
                        }
                    }
                }
                push_img(i,album_json,img_num);
                $('.main_album').attr('data-num',parseInt(num)+20);
                album_loading=false;
            }
        });
    }
    $('.main_tab li[data-target="main_album"]').on('click',function () {
        if(parseInt($('.main_album').attr('data-num'))==0){      //若当前的图片数为0，则进行点击初次加载；（否则为滑动加载）
            get_album();
        }
    });


    //返回顶部及加载更多
    $('.to_top').on('click',function () {
        $('html').animate({scrollTop:'0px'},300);
        $('.to_top').stop(true,false).animate({bottom:0,opacity:0},300);
    });

    $(window).on('scroll',function () {
        if($(window).scrollTop()>1000){
            if(!($('.to_top').is(':animated'))){
                $('.to_top').stop(true,false).animate({bottom:'50px',opacity:1},300);
            }
        }else {
            if(!($('.to_top').is(':animated'))){
                $('.to_top').stop(true,false).animate({bottom:0,opacity:0},300);
            }

        }
        if ($(window).scrollTop()==($(document).height()-$(window).height())){
            if($('.main_album').is(':visible')){
                if(!album_loading){
                    get_album();      //加载更多相册
                }
            }else {
                if(!loading){
                    if($('#content_list_all').is(":visible")){    //加载微博
                        get_weibo();
                    }else {
                        get_weibo_search($('#search_keywords').html());   //加载当前搜索微博
                    }

                }
            }
        }
    });


    // 全局搜索
    $('#search_start').on('click',function () {
        var value=encodeURI($('#search').val());
        window.location.href="search_page.php?key_words="+value;
    });

});














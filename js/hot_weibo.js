;
$(function () {

    //获取日期
    function get_date(str) {     //得到显示的日期样式。参数：日期字符串；返回值：日期字符串
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
        }else if(month!==current_month){
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

    function icon_url(icon,id) {    //获取头像地址。参数：头像数据,用户id；返回值：地址字符串；
        if(icon==null){
            return "resource/default/icon.jpg";
        }else if(icon=="0"){
            return "resource/"+id+"/info/icon.jpg";
        }else {
            return "resource/default/icon_"+icon+".jpg";
        }
    }


    function cover_url(cover,id) {     ////获取封面地址。参数：封面数据,用户id；返回值：地址字符串；
        if(cover==null){
            return "resource/default/cover.jpg";
        }else if(cover=="0"){
            return "resource/"+id+"/info/cover.jpg";
        }else {
            return "resource/default/cover_"+cover+".jpg";
        }
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
            $('.nav_user .user').text(user_name);
            $('.side_user .user').text(user_name);
            user_icon=icon_url(user_info.icon,user_id);
            $('.side_user').find('img').attr('src',user_icon);
            $('#total_guanzhu').find('a').html(user_info.follow_num);
            $('#total_fensi').find('a').html(user_info.fans_num);
            $('#total_weibo').find('a').html(user_info.weibo_num);
        }
    });
    // 微博条目
    var loading=false;

    function get_weibo() {
        if($('.content_list').hasClass('done')){
            return false;
        }
        $('.content_footer').show();
        loading=true;
        var weibo_num=parseInt($('.content_list').attr('data-num'));
        $.ajax({
            url: "php/get_data.php",
            type: "POST",
            data: {
                "target": "weibo",
                'operation':'hot',
                "num":weibo_num
            },
            success: function (response, status, xhr) {
                var weibo_json = JSON.parse(response);
                if($.isEmptyObject(weibo_json)){
                    $('.content_list').addClass('done');
                }
                $.each(weibo_json,function (key,value) {
                    var name=value.name;
                    var user_id=value.user_id;
                    var id=value.id;
                    var icon=icon_url(value.icon,user_id);
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
                    $('.content_list').append('<div class="content_list_item" data-id="'+id+'"><div class="item_content_area"> <div class="item_header"> <div class="item_user"> <div class="item_user_img"> <a href="user_page.php?id='+user_id+'" class="user_icon" data-id="'+user_id+'"><img src="'+icon+'" alt=""></a> </div> <div class="item_user_info"> <div> <a href="user_page.php?id='+user_id+'" class="user content_user_name user_name" data-id="'+user_id+'">'+name+'</a> </div> <div> <span class="time">'+date+'</span> </div> </div> </div> <div class="user_operation"> <svg> <use xlink:href="#operation_icon"></use> </svg> <ul> <li>删除</li> <li>编辑</li> <li>屏蔽</li> </ul> </div> </div> <div class="item_content">'+content+'</div> <div class="item_footer"> <div class="item_bar"> <ul> <li '+collection_attr+'> <svg> <use xlink:href="#favorites_icon"></use> </svg> <span>'+collecttion_text+'</span> </li> <li class="share" title="分享"> <svg> <use xlink:href="#share_icon"></use> </svg> <span>10</span> </li> <li class="comments" title="评论"> <svg> <use xlink:href="#comments_icon"></use> </svg> <span>'+comment_total+'</span> </li> <li '+like_attr+'> <svg> <use xlink:href="#support_icon"></use> </svg> <span>'+like_total+'</span> </li> </ul> </div> </div> </div> <!--评论区--> <div class="comment_area"> <div class="comment_area_container"> <!--评论编辑框--> <div class="comment_editor"> <div class="comment_user"> <a href="javascript:void(0);"> <img src="'+user_icon+'" alt=""> </a> </div> <div class="comment_editor_box"> <div class="comment_editor_area" contenteditable="true"> </div> <div class="comment_editor_bar"> <div class="comment_editor_input_more"> <span class="add_meme" title="添加表情"><svg> <use xlink:href="#meme"></use> </svg></span></div> <div class="comment_editor_submit"> <button type="submit">评论</button> </div> </div> </div> </div> <!--评论列表--> <div class="comment_list" data-num=0></div><div class="more_comment"><a href="javascript:void(0);">更多评论</a><img src="img/loading.gif"></div></div></div></div>');
                });
                $('.content_list').attr('data-num',weibo_num+10);
                loading=false;
                $('.content_footer').hide();
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

    // 推荐主页加载
    function get_recommend() {
        $.ajax({
            url:'php/get_data.php',
            type:'POST',
            data:{
                'target':'recommend'
            },
            success:function (response,status,xhr) {
                var recommend_user_list=JSON.parse(response);
                var tab=1;
                $.each(recommend_user_list,function (key,value) {
                    var user_id=value.id;
                    var name=value.name;
                    var icon=icon_url(value.icon,user_id);
                    var cover=cover_url(value.cover,user_id);
                    var fans_num=value.fans_num;
                    var user_url="user_page.php?id="+user_id;
                    var followed=value.followed;
                    var $recommend=$('.recommend_tab[data-tab='+tab+']');
                    $recommend.find('.recommend_img img').attr('src',cover);
                    $recommend.find('.icon_link').attr({'href':user_url,'data-id':user_id}).find('img').attr('src',icon);
                    $recommend.find('.user_name').attr({'href':user_url,'data-id':user_id}).html(name);
                    $recommend.find('.fans_num').html(fans_num);
                    $recommend.find('.recommend_sub button').attr('data-id',user_id);
                    if(followed==1){
                        $recommend.find('.recommend_sub button').addClass('followed').html('已关注');
                    }
                    tab++;

                });
            }
        });
    }
    get_recommend();

    // 推荐主页轮播
    var tab=1;
    $('#recommend_tab_left').on('click',function () {
        $('.recommend>div').stop(true,true);
        $('.recommend>div[data-tab='+tab+']').fadeOut(500,function () {
            if(--tab<1){
                tab=4;
            }
            $('.recommend>div[data-tab='+tab+']').fadeIn(500);
        });
    });
    $('#recommend_tab_right').on('click',function () {
        $('.recommend>div').stop(true,true);
        $('.recommend>div[data-tab='+tab+']').fadeOut(500,function () {
            if(++tab>4){
                tab=1;
            }
            $('.recommend>div[data-tab='+tab+']').fadeIn(500);
        });
    });

    var auto_play=setInterval(function () {
        $('#recommend_tab_right').trigger('click');
    },5000);


    $('.recommend_img,#recommend_tab_right,#recommend_tab_left').on('mouseover',function () {
        //$('#recommend_tab_left,#recommend_tab_right').stop(true).slideDown(500);
        clearInterval(auto_play);
        $('#recommend_tab_left').stop(true).animate({width:'20px'},300);
        $('#recommend_tab_right').stop(true).animate({width:'20px'},300);
    });
    $('.recommend_img,#recommend_tab_right,#recommend_tab_left').on('mouseout',function () {
        //$('#recommend_tab_left,#recommend_tab_right').slideUp(500);
        auto_play=setInterval(function () {
            $('#recommend_tab_right').trigger('click');
        },5000);
        $('#recommend_tab_left').stop().animate({width:'0'},300);
        $('#recommend_tab_right').stop().animate({width:'0'},300);
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
                    var icon=icon_url(value.icon,user_id);
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
        if(!($(reply_area).find('.reply_list').hasClass('first_load'))){
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

                $(reply_list).prepend('<div class="item_reply" data-id="'+id+'" style="height: 0; overflow: hidden;"> <div><div class="item_reply_user"> <a href="user_page.php?" class="user_icon" data-id="'+user_id+'"><img src="'+user_icon+'" alt=""></a> </div> <div class="item_reply_content_box"> <div class="item_reply_content"> <a href="user_page.php" class="user user_name" data-id="'+user_id+'">'+user_name+'</a>：'+content+' </div> <div class="item_reply_content_bar"> <span class="date">刚刚</span> <a href="javascript:void(0);" class="reply_like" title="点赞"><span>0</span>赞</a> <a href="javascript:void(0);" class="reply_reply_btn">回复</a> <a href="">隐藏回复</a> </div> </div> </div></div>');
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
                    var icon=icon_url(value.icon,user_id);
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

    //返回顶部及加载更多
    $('.to_top').on('click',function () {
        $('html').animate({scrollTop:'0px'},300);
        $('.to_top').stop(true,false).animate({bottom:0,opacity:0},300);
    });

    $(window).on('scroll',function () {
        //$('#search').val($(window).scrollTop()+'/'+($(document).height()-$(window).height()));
        if($(window).scrollTop()>1000){
            if(!($('.to_top').is(':animated'))){
                $('.to_top').stop(true,false).animate({bottom:'50px',opacity:1},300);
            }
        }else {
            if(!($('.to_top').is(':animated'))){
                $('.to_top').stop(true,false).animate({bottom:0,opacity:0},300);
            }

        }
        if ($(window).scrollTop()>($(document).height()-$(window).height()-35)){
            if(!loading){
                get_weibo();
            }
        }
    });


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
                    var user_icon=icon_url(card_info.icon,user_id);
                    var user_cover=cover_url(card_info.cover,user_id);
                    var user_name=card_info.name;
                    var follow_num=card_info.follow_num;
                    var fans_num=card_info.fans_num;
                    var weibo_num=card_info.weibo_num;
                    var followed=card_info.followed;
                    $('.card_cover>img').attr('src',user_cover);
                    $('.card_user_img img').attr('src',user_icon);
                    $('.card_user_img a').attr('href','user_page.php?id='+user_id);
                    $('.card_user_name a').html(user_name).attr('href','user_page.php?id='+user_id);
                    $('#card_follow a').html(follow_num);
                    $('#card_fans a').html(fans_num);
                    $('#card_weibo a').html(weibo_num);
                    $('#card_follow_btn').attr('data-id',user_id);
                    if(followed==1){    //关注按钮的状态
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



    //添加关注
    $('body').on('click','.follow',function () {
        if($(this).hasClass('followed')){
            return false;
        }else {
            var id=$(this).attr('data-id');
            var _this=this;
            $.ajax({
                url:'php/fabu.php',
                type:'POST',
                data:{
                    'target':'fans',
                    'id':id
                },
                success:function (response,status,xhr) {
                    if(response==1){
                        //$(_this).addClass('followed').html('已关注');
                        $('.follow[data-id='+id+']').addClass('followed').html('已关注');
                    }
                }
            });
        }
    });


    // 全局搜索
    $('#search_start').on('click',function () {
        var value=encodeURI($('#search').val());
        window.location.href="search_page.php?key_words="+value;
    });

    //搜索框enter键开始搜索
    $('.enter_search').on('keydown',function (event) {
        if(event.which==13){
            event.preventDefault();
            $(this).next().trigger('click');
        }
    });


});
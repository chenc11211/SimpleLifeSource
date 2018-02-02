;
$(function () {


    // 初始请求用户数据
    var user_name = '',
        user_icon = '',
        user_id = '';
    $.ajax({
        url: 'php/get_data.php',
        type: 'POST',
        data: {
            'target': 'user_info'
        },
        success: function (response, status, xhr) {
            var user_info = JSON.parse(response);
            user_name = user_info.name;
            user_id = user_info.id;
            $('.nav_user .user').text(user_name);

            if (user_info.icon == null) {
                user_icon = "resource/default/icon.jpg";
            } else if (user_info.icon == "0") {
                user_icon = "resource/" + user_id + "/info/icon.jpg";
            } else {
                user_icon = "resource/default/icon_" + user_info.icon + ".jpg";
            }
            var follow_num=user_info.follow_num;
            var fans_num=user_info.fans_num;
            $('#follow_tab span').html(follow_num);
            $('#fans_tab span').html(fans_num);
        }
    });




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

    
    //获取关注用户条目
    var follow_loading=false;
    function get_follow() {
        var $follow_list=$('.follow_list');
        if($follow_list.hasClass('done')){
            return false;
        }
        var num=parseInt($follow_list.attr('data-num'));
        follow_loading=true;
        $.ajax({
            url:'php/get_data.php',
            type:'POST',
            data:{
                'target':'follow_list',
                'num':num,
            },
            success:function (response,status,xhr) {
                var follow_list=JSON.parse(response);
                if($.isEmptyObject(follow_list)){
                    $follow_list.addClass('done');    //若对象为空则添加加载完全标记；
                }
                $.each(follow_list,function (key,value) {
                    var id=value.id;
                    var name=value.name;
                    var account=value.email;
                    var follow_num=value.follow_num;
                    var fans_num=value.fans_num;
                    var weibo_num=value.weibo_num;
                    var followed=value.followed;
                    var icon='';
                    if(value.icon==null){
                        icon="resource/default/icon.jpg";
                    }else if(value.icon=="0"){
                        icon="resource/"+id+"/info/icon.jpg";
                    }else {
                        icon="resource/default/icon_"+value.icon+".jpg";
                    }
                    $follow_list.append('<li class="follow_list_item"> <div class="follow_item_container"> <div class="user_header"> <img class="user_icon" src="'+icon+'" alt="" data-id="'+id+'"> </div> <div class="user_detail"> <div class="user_info"> <div> <p><a class="user user_name" href="user_page.php?id='+id+'" data-id="'+id+'">'+name+'</a></p> <p class="user_account">'+account+'</p> </div> <button class="cancel_follow" data-id="'+id+'">删除</button> </div> <div class="user_total"> <ul> <li class="guanzhu_num">关注 <span>'+follow_num+'</span></li> <li class="fensi_num">粉丝 <span>'+fans_num+'</span></li> <li class="weibo_num">微博 <span>'+weibo_num+'</span></li> </ul> </div> </div> </div> </li>');
                });

                $follow_list.attr('data-num',num+20);
                follow_loading=false;
                get_position();    //确定条目定位
            }
        });
    }
    get_follow();


    //获取粉丝条目
    var fans_loading=false;
    function get_fans() {
        var $fans_list=$('.fans_list');

        fans_loading=true;
        var num=parseInt($fans_list.attr('data-num'));
        $fans_list.addClass('first_load');   //添加已进行初次加载标记；
        $.ajax({
            url:'php/get_data.php',
            type:'POST',
            data:{
                'target':'fans_list',
                'num':num,
            },
            success:function (response,status,xhr) {
                var fans_list=JSON.parse(response);
                if($.isEmptyObject(fans_list)){
                    $fans_list.addClass('done');
                }
                $.each(fans_list,function (key,value) {
                    var id=value.id,
                        name=value.name,
                        account=value.email,
                        follow_num=value.follow_num,
                        fans_num=value.fans_num,
                        weibo_num=value.weibo_num,
                        followed=value.followed,
                        icon='';
                    if(value.icon==null){
                        icon="resource/default/icon.jpg";
                    }else if(value.icon=="0"){
                        icon="resource/"+id+"/info/icon.jpg";
                    }else {
                        icon="resource/default/icon_"+value.icon+".jpg";
                    }
                    var follow_btn='<button class="follow" data-id="'+id+'">+关注</button>';
                    if(followed==1){
                        follow_btn='<button class="follow followed" data-id="'+id+'">已关注</button>';
                    }else if(followed==-1){
                        follow_btn='';
                    }

                    $fans_list.append('<li class="fans_list_item"> <div class="fans_item_container"> <div class="user_header"> <img class="user_icon" src="'+icon+'" alt="" data-id="'+id+'"> </div> <div class="user_detail"> <div class="user_info"> <div> <p class="user"><a class="user user_name" href="user_page.php?id='+id+'" data-id="'+id+'">'+name+'</a></p> <p class="user_account">'+account+'</p> </div> '+follow_btn+' </div> <div class="user_total"> <ul> <li class="guanzhu_num">关注 <span>'+follow_num+'</span></li> <li class="fensi_num">粉丝 <span>'+fans_num+'</span></li> <li class="weibo_num">微博 <span>'+weibo_num+'</span></li> </ul> </div> </div> </div> </li>');
                });
                $fans_list.attr('data-num',num+20);
                fans_loading=false;
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
            if($('.follow_list').is(':visible')){
                if(!follow_loading){
                    get_follow();
                }
            }else {
                if(!fans_loading){
                    get_fans();
                }
            }
        }
    });

    // 全局搜索
    $('.all_search').on('click',function () {
        var value=$(this).prev().val();
        window.location.href="search_page.php?key_words="+value;
    });

    //搜索框enter键开始搜索
    $('.enter_search').on('keydown',function (event) {
        if(event.which==13){
            event.preventDefault();
            $(this).next().trigger('click');
        }
    });


    // 内容标签切换
    $('#follow_tab').on('click',function () {
        $('#fans_tab').removeClass('active');
        $('.fans_list').hide();
        $(this).addClass('active');
        $('.follow_list').show();
    });
    $('#fans_tab').on('click',function () {
        if(!($(this).hasClass('first_load'))){  //如果未进行过初次加载则加载条目；
            get_fans();
        }
        $('#follow_tab').removeClass('active');
        $('.follow_list').hide();
        $(this).addClass('active');
        $('.fans_list').show();
    });


    // 取消关注按钮
    $('body').on('click','.cancel_follow',function () {

        var id=$(this).attr('data-id');
        var _this=this;
        $.ajax({
            url:'php/fabu.php',
            type:'POST',
            data:{
                'target':'cancel_follow',
                'id':id
            },
            success:function (response,status,xhr) {
                if(response==1){
                    $(_this).closest('.follow_list_item').hide();
                    $.each($('.follow_item_container'),function (key,value) {
                        var x=$(value).parent().position().left+5+'px';
                        var y=$(value).parent().position().top+5+'px';
                        $(value).animate({'left':x,'top':y},300);
                    });
                    $('#follow_tab span').html(parseInt($('#follow_tab span').html())-1);
                }
            }
        });

    });

    //确定关注列表的初始定位
    function get_position() {
        $.each($('.follow_item_container'),function (key,value) {
            var x=$(value).parent().position().left+5+'px';
            var y=$(value).parent().position().top+5+'px';
            $(value).css({left:x,top:y});
        });
    }




});

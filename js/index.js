/**
 * Created by chenc on 2017/9/23.
 */
;
$(function () {


    // 登录表单验证
    // 简单的边框颜色变化
    $('#login').on('click',function () {
        if(!($('#user_email').val()&&$('#user_password').val())){
            if(!$('#user_email').val()){
                $('#user_email').css('border-color','red');
            }else {
                $('#user_email').css('border-color','black');
            }
            if(!$('#user_password').val()){
                $('#user_password').css('border-color','red');
            }else {
                $('#user_password').css('border-color','black');
            }
            return false;
        }
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
            $(this).parent().parent().next().removeClass('success').addClass('error').find('span').html('日期不完整！');
        }else {
            $(this).parent().parent().next().removeClass('error').addClass('success').find('span').html('');
        }
    });


    // 注册表单验证及提交
    $('#register_form .validate').on("input blur change",function () {
        var $box_info=$(this).parent().next();
        if($(this).is('#set_name')){
            if($(this).val().length<2||$(this).val().length>6){
                $box_info.removeClass('success').addClass('error').find('span').html("用户名2-6个字符！");
            }
            else{
                $box_info.removeClass('error').addClass('success').find('span').html('');
            }
        }
        if($(this).is('#set_email')){
            if(/.+@.+\.[a-zA-Z]{2,4}$/.test($(this).val())){

                $.ajax({
                    url:'php/validate.php',
                    type:'GET',
                    data:{
                        'set_email':$('#set_email').val()
                    },
                    success:function (responseText,status,xhr) {
                        if(parseInt(responseText)){
                            $box_info.removeClass('success').addClass('error').find('span').html("该邮箱已被注册！");
                        }else {
                            $box_info.removeClass('error').addClass('success').find('span').html('');
                        }
                    },
                    error:function (xhr,status,errorText) {
                        $box_info.removeClass('error').addClass('success').find('span').html('');
                    }
                });
            }
            else {
                $box_info.removeClass('success').addClass('error').find('span').html("请输入正确的邮箱地址！");
            }
        }
        if($(this).is('#set_password')){
            if($(this).val().length<6){
                $box_info.removeClass('success').addClass('error').find('span').html("密码至少6位！");
            }
            else {
                $box_info.removeClass('error').addClass('success').find('span').html('');
            }
            if($('#confirm_password').parent().next().hasClass('success')||$('#confirm_password').parent().next().hasClass('error')){
                $('#confirm_password').trigger('change');
            }
        }
        if($(this).is('#confirm_password')){
            if($(this).val()==$('#set_password').val()){
                $box_info.removeClass('error').addClass('success').find('span').html('');
            }
            else {
                $box_info.removeClass('success').addClass('error').find('span').html("密码不相同！");
            }
        }

    });
    $('#create_user').on('click',function () {
        $('#register_form .validate').trigger('blur');
        if($('#register_form .error').length>0){
            return false;
        }
        else {
            $(this).val('创建中...').attr('disabled','disabled');
            $.ajax({
                url:'php/register.php',
                type:'POST',
                data:{
                    'set_name':$('#set_name').val(),
                    'set_email':$('#set_email').val(),
                    'set_password':$('#set_password').val(),
                    'year':$('#year').val(),
                    'month':$('#month').val(),
                    'day':$('#day').val(),
                    'set_gender':$("input[name=gender]:checked").val()
                },
                success:function (responseText,status,xhr) {
                    if(responseText==1){
                       $('#register_form')[0].reset();
                       $('#register_form .validate_info').removeClass('success');
                       $('#create_user').val('创建账户').removeAttr('disabled');
                       $('.tips').addClass('success').show().find('span').val('创建成功！');
                       setTimeout(function () {
                           $('.tips').hide();
                           window.location.replace("home_page.php");
                       },1000);
                    }
                    else {
                        $('#create_user').val('创建账户').removeAttr('disabled');
                        $('.tips').removeClass('success').show().find('span').val('创建失败！');
                        setTimeout(function () {
                            $('.tips').hide();
                        },1000);
                    }
                },
                error:function (xhr,status,errorText) {
                    $('#create_user').val('创建账户').removeAttr('disabled');
                    $('.tips').removeClass('success').show().find('span').val('创建失败！');
                    setTimeout(function () {
                        $('.tips').hide();
                    },1000);
                }

            });
            return false;
        }
    });







});
$(document).ready(function(){
    // скрыть или отобразить ссылку "Наверх" при прокрутке страницы
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('.back-to-top').fadeIn();
        } else {
            $('.back-to-top').fadeOut();
        }
    });

    // прокрутка к началу страницы при клике по ссылке "Наверх"
    $('.back-to-top').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 500);
        return false;
    });


   $('.contacts.email').each(function(){
       let val = '<i class="fa fa-envelope"></i> <a href="mailto:' + $(this).attr('data-value') + '">' + $(this).attr('data-value') + '</a>';
       $(this).html(val);
   });

   $('.contacts.phone').each(function(){
       let val = '<i class="fas fa-phone-square"></i> <a href="tel:' + $(this).attr('data-value') + '">' + $(this).attr('data-value') + '</a>';
       $(this).html(val);
   });

});

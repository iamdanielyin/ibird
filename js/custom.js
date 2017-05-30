(function ($) {

    // Add smooth scrolling to all links in navbar
    $('.navbar a,a.btn-appoint, .quick-info li a, .overlay-detail a').on('click', function (event) {
        var hash = this.hash;
        if (!hash) return;
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 900, function () {
            window.location.hash = hash;
        });
    });

    //jQuery to collapse the navbar on scroll
    $(window).scroll(function () {
        if ($('.navbar-default').offset().top > 50) {
            $('.navbar-fixed-top').addClass('top-nav-collapse');
        } else {
            $('.navbar-fixed-top').removeClass('top-nav-collapse');
        }
    });

})(jQuery);
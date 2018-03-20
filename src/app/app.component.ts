import { Component } from '@angular/core';

declare var $;

function offcanvasNavToggle() {
  if (window.innerWidth <= 1024) {
    $('.ui').removeClass('ui-expand');
    $('.ui').addClass('ui-collapse')
  } else {
    $('.ui').removeClass('ui-collapse')
  }

  if (window.innerWidth > 1024) {
    $('.ui').removeClass('ui-expand');
  }
}

function offCanvasNavClick() {
  var toggler_icon = $('.nav-collapse i');

  $('.nav-collapse').click(() => {
    if ($('.ui').hasClass("ui-collapse")) {
      $('.ui').removeClass("ui-collapse").addClass("ui-expand");
      $('.main-content').css('right', '-170px');
      toggler_icon.removeClass('fa-bars').addClass('fa-2x fa-times');
      $('body').css('overflow', 'hidden');
    } else {
      $('.ui').removeClass("ui-expand").addClass("ui-collapse");
      $('.main-content').css('right', '0')
      toggler_icon.removeClass('fa-times').addClass('fa-bars');
      $('body').css('overflow', 'auto');
    }
  });
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    

    offcanvasNavToggle();
    offCanvasNavClick();

    $(window).resize(function () {
      offcanvasNavToggle();
    });
  }
}

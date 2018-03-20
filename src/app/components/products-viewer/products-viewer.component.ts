import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";
import { AlertComponent } from '../alert-modal/alert.component';
import { SingleProductService } from '../../services/single-product.service';

declare var $;
declare var Waypoint;

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

  $('.nav-collapse').click(function () {
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

/*Product Page*/
function fixNavPills() {
  var nav = $('.ui-product-nav');
  if(nav.offset()) {    
    var scrollTop = $(window).scrollTop(),
      elementOffset = nav.offset().top,
      distance = (elementOffset - scrollTop);

    if (scrollTop > distance) {
      nav.addClass('fixed');
      nav.css('top', '0');
    } else {
      nav.removeClass('fixed');
      nav.css('top', '100px');
    }
  }
}

function activeNavPills() {
  $('.ui-product-nav .nav-link').click(function () {
      $('.ui-product-nav .nav-link.active').removeClass('active');
      $(this).addClass('active');
  })
}

function activeAllProducts() {
  $('.product-ui-item .nav-link').click(function () {
    $('.ui-product-nav .nav-link.active').removeClass('active');
    $(this).addClass('active');
  })
}


function addSmoothScroll() {
  $(".ui-product-lists .nav-pills .nav-link").on('click', function (event) {

    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;

      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function () {
        window.location.hash = hash;
      });
    } // End if
  });
}

function scrollOnHover() {
  $(".arrow").hover(function () {
    var box = $(this).siblings('.ui-scoll-inner'),
      x, speed = 5000;
    if ($(this).hasClass("ui-arrow-right")) {
      x = box.width() + box.children().last().width();
      box.animate({
        scrollLeft: x,
      }, speed)
    } else {
      x = 0;
      box.animate({
        scrollLeft: x,
      }, speed)
    }
  }, function () {
    var box = $(this).siblings('.ui-scoll-inner');
    box.stop();
  })
}

function scrollMonitor() {

  var offset = $('.ui-product-nav .nav-link').height() + 100;

  var wp1 = new Waypoint.Inview({
    element: document.getElementById('listing-products'),
    handler: function (direction) {
      $('.ui-product-nav .nav-link.active').removeClass('active');
      $('#listing-link').addClass('active');
    }
  });

  var wp2 = new Waypoint.Inview({
    element: document.getElementById('prospect-products'),
    handler: function (direction) {
      $('.ui-product-nav .nav-link.active').removeClass('active');
      $('#prospect-link').addClass('active');
    }
  });

  var wp3 = new Waypoint.Inview({
    element: document.getElementById('branding-products'),
    handler: function (direction) {
      $('.ui-product-nav .nav-link.active').removeClass('active');
      $('#brand-link').addClass('active');
    }
  })

  var wp4 = new Waypoint.Inview({
    element: document.getElementById('all-products'),
    handler: function (direction) {
      $('.ui-product-nav .nav-link.active').removeClass('active');
      $('#all-products-link').addClass('active');
    }
  });


  $(".main .nav-pills .nav-link").on('click', function (event) {

    wp1.disable();
    wp2.disable();
    wp3.disable();

    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;

      $('html, body').animate({
        scrollTop: $(hash).offset().top - 70
      }, 800, function () {
        window.location.hash = hash;

        setTimeout(function () {
          wp1.enable();
          wp2.enable();
          wp3.enable();
        }, 100);

      });
    } // End if

  });

  $(".product-ui-item .nav-link").on('click', function (event) {
    wp4.disable();

    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;

      $('html, body').animate({
        scrollTop: $(hash).offset().top - 70
      }, 800, function () {
        window.location.hash = hash;

        setTimeout(function () {
          wp4.disable();
        }, 100);

      });
    } // End if

  });

}


@Component({
  selector: 'app-products-viewer',
  templateUrl: './products-viewer.component.html'
})

export class ProductsViewerComponent implements OnInit {
  public showAlert: boolean = false;
  
  constructor(private router: Router, private dialogService: DialogService, public spService: SingleProductService) {

  }

  ngOnInit() {}

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    activeNavPills();
    activeAllProducts();
    addSmoothScroll();
    scrollOnHover();

    $(window).scroll(function () {
      fixNavPills();
    });

    fixNavPills();
    scrollMonitor();
  }

  goToSinglePage = function (value, image) {    
    this.showAlert = true;
    this.spService.setCardType(value);
    this.spService.setDraftCard(undefined);
    this.dialogService.addDialog(AlertComponent, {
      cardType: value,
      originalImage: image
    }).subscribe((isConfirmed)=>{
      this.showAlert = false;
    });

  }
}

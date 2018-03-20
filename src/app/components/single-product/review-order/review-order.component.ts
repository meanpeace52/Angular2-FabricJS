import { Component, OnInit, OnChanges } from '@angular/core';
import { SingleProductService } from '../../../services/single-product.service';
import { Router } from '@angular/router';

declare var $;
declare var fabric;

var frontCanvas;
var backCanvas;
var allImage = {
  front: "",
  back: ""
};
var canvas_size = {
  width: 600,
  height: 343
}
var mainBodyWidth;
var mainBodyHeight;
var glossImg = '../../../../assets/images/glossy.png';
var glossImgObj;

function setFrontCanvas() {
  frontCanvas = new fabric.Canvas('front-canvas', {
    hoverCursor: 'pointer',
    selection: true,
    selectionBorderColor:'blue'
  });

  frontCanvas.setWidth(canvas_size.width);
  frontCanvas.setHeight(canvas_size.height);

  var front_image = localStorage.getItem('front');
  if(!front_image)
    return;

  frontCanvas.setBackgroundImage(front_image, frontCanvas.renderAll.bind(frontCanvas), {
    backgroundImageOpacity: 1,
    backgroundImageStrech: true,
    top: 0,
    left: 0,
    originX: 'left',
    originY: 'top',
    width: frontCanvas.width,
    height: frontCanvas.height,
  });

  frontCanvas.renderAll();

  frontCanvas.setZoom(frontCanvas.getZoom() * mainBodyWidth / 650);
  frontCanvas.setHeight(frontCanvas.getHeight() * mainBodyWidth / 650);
  frontCanvas.setWidth(frontCanvas.getWidth() * mainBodyWidth / 650);
  frontCanvas.renderAll();
  mainBodyHeight = $(".review-product-section .ui-main-body").height();
  if(frontCanvas.height > (mainBodyHeight - 260)) {
    var scale = (mainBodyHeight - 260) / frontCanvas.height
    frontCanvasResize(scale);
  }
}

function setBackCanvas() {
  backCanvas = new fabric.Canvas('back-canvas', {
    hoverCursor: 'pointer',
    selection: true,
    selectionBorderColor:'blue'
  });

  backCanvas.setWidth(canvas_size.width);
  backCanvas.setHeight(canvas_size.height);

  var back_image = localStorage.getItem('back');
  if(!back_image)
    return;

  backCanvas.setBackgroundImage(back_image, backCanvas.renderAll.bind(backCanvas), {
    backgroundImageOpacity: 1,
    backgroundImageStrech: true,
    top: 0,
    left: 0,
    originX: 'left',
    originY: 'top',
    width: backCanvas.width,
    height: backCanvas.height,
  });
  backCanvas.renderAll();

  backCanvas.setZoom(backCanvas.getZoom() * mainBodyWidth / 650);
  backCanvas.setHeight(backCanvas.getHeight() * mainBodyWidth / 650);
  backCanvas.setWidth(backCanvas.getWidth() * mainBodyWidth / 650);
  backCanvas.renderAll();

  if(backCanvas.height > mainBodyHeight) {
    var scale = (mainBodyHeight - 200) / backCanvas.height
    backCanvasResize(scale);
  }
}

function flipImages() {
  $('.ui-ranger').rangeslider({
    polyfill: false,
    // Callback function
    onInit: function () {
      $(".ui-front").css({
        'z-index': '1000',
        'opacity': '1',
        '-webkit-transform': "rotateY(0deg)",
        '-moz-transform': "rotateY(0deg)"
      });

      $(".ui-back").css({
        'z-index': '-1',
        'opacity': '0',
        '-webkit-transform': "rotateY(-180deg)",
        '-moz-transform': "rotateY(-180deg)"
      })
    },
    onSlide: function (position, value) {
      swipeImgLeft(value);
      swipeImgRight(value);
    }
  });
}

function swipeImgLeft(value) {
  if(value < 90) {
    $(".ui-front").css({
      'z-index': '1000',
      'opacity': '1',
      '-webkit-transform': "rotateY(" + (-value) + "deg)",
      '-moz-transform': "rotateY(" + (-value) + "deg)"
    });
  } else {
    $(".ui-front").css({
      'z-index': '-1',
      'opacity': '0',
      '-webkit-transform': "rotateY(" + (-value) + "deg)",
      '-moz-transform': "rotateY(" + (-value) + "deg)"
    });
  }
}

function swipeImgRight(value) {
  $(".ui-front").addClass("original");
  if(value > 89) {
    $(".ui-back").css({
      'z-index': '1000',
      'opacity': '1',
      '-webkit-transform': "rotateY(" + (180 - value) + "deg)",
      '-moz-transform': "rotateY(" + (180 - value) + "deg)"
    })
    $(".ui-back").addClass("original");
  } else {
    $(".ui-back").css({
      'z-index': '-1',
      'opacity': '0',
      '-webkit-transform': "rotateY(" + (180 - value) + "deg)",
      '-moz-transform': "rotateY(" + (180 - value) + "deg)"
    })
  }  
}

function getcanvasScale(width, height) {
  var SCALE_FACTOR = 0;
  SCALE_FACTOR = width / mainBodyWidth;
  mainBodyWidth = width;
  frontCanvasResize(SCALE_FACTOR);
  backCanvasResize(SCALE_FACTOR);
  setTimeout(() => {
    if(frontCanvas.height > (height - 270) && height > 270) {
      mainBodyHeight = height;
      SCALE_FACTOR = (height - 270) / frontCanvas.height;
      frontCanvasResize(SCALE_FACTOR);
      backCanvasResize(SCALE_FACTOR);
    } else if(frontCanvas.height > height && height <= 270) {
      mainBodyHeight = height;
      SCALE_FACTOR = (height) / frontCanvas.height;
      frontCanvasResize(SCALE_FACTOR);
      backCanvasResize(SCALE_FACTOR);
    }
    else if(mainBodyHeight < height) {
      SCALE_FACTOR = height / mainBodyHeight;
      mainBodyHeight = height;
      frontCanvasResize(SCALE_FACTOR);
      backCanvasResize(SCALE_FACTOR);
    }
  }, 100)
   
}

function frontCanvasResize(SCALE_FACTOR) {
  frontCanvas.setZoom(frontCanvas.getZoom() * SCALE_FACTOR);
  frontCanvas.setHeight(frontCanvas.getHeight() * SCALE_FACTOR);
  frontCanvas.setWidth(frontCanvas.getWidth() * SCALE_FACTOR);
  frontCanvas.renderAll();
}

function backCanvasResize(SCALE_FACTOR) {
  backCanvas.setZoom(backCanvas.getZoom() * SCALE_FACTOR);
  backCanvas.setHeight(backCanvas.getHeight() * SCALE_FACTOR);
  backCanvas.setWidth(backCanvas.getWidth() * SCALE_FACTOR);
  backCanvas.renderAll();
}


function getMainBodyWidth() {
  mainBodyWidth = $(".review-product-section .ui-rotator").width();
 // mainBodyHeight = $(".review-product-section .ui-rotator").height();
}

function getChangedMainBody() {
  var width = $(".review-product-section .ui-rotator").width();
  var height = $(".review-product-section .ui-main-body").height();
  getcanvasScale(width, height);
  // frontCanvasResize(width);
}

@Component({
  selector: 'review-order',
  templateUrl: './review-order.component.html'
})

export class ReviewOrderComponent implements OnInit {

  public borderStyle: string = 'square';
  public finishType: string = '';
  public paperType: string = 'original';
  public isChecked: boolean = false;
  public validate: boolean = true;
  public isGlossed: boolean = false;
  public isMatted: boolean = false;
  public cardType: string = '';


  constructor(private router: Router, public spService: SingleProductService) {
    this.cardType = this.spService.getCardType();
  }

  ngOnInit() {
    // setTimeout(() => {
      getMainBodyWidth();
      setFrontCanvas();
      setBackCanvas();
    // }, 200)
    
    flipImages();

    $(document).ready(function() {

      $(window).resize(function(){
        setTimeout(()=> {
          getChangedMainBody();
        }, 100)
      });

      $("#border-round").click(function() {
        $( ".ui-rotator .canvas" ).each(function() {
          $(this).css('border-radius', '20px');
        });
      })

      $("#border-square").on('click', function() {
        $( ".ui-rotator .canvas" ).each(function() {
          $(this).css('border-radius', '0');
        });
      })
    })
  }

  checkedVaidate() {
    this.isChecked = !this.isChecked;
    this.validate = true;
  }

  goToCartPage() {
    if(this.isChecked) {
      this.validate = true;
      this.router.navigate(['/cart']);
    } else {
      this.validate = false;
      this.isChecked = false;
    }    
  }

  setGlossEffect() {
    this.finishType = 'gloss';

    if(!this.isGlossed){
      fabric.Image.fromURL(glossImg, function(img) {
        glossImgObj = img.set({
          left: 0,
          top: 0,
          width: frontCanvas.width,
          height: frontCanvas.height,
          quality: 1
        });

        frontCanvas.add(glossImgObj);
        frontCanvas.renderAll();

        backCanvas.add(glossImgObj);
        backCanvas.renderAll();          
      });
     
      this.isGlossed = true;  
    } else {
      if(glossImgObj){
        frontCanvas.remove(glossImgObj);
        backCanvas.remove(glossImgObj);
      }

      this.isGlossed = false;
    } 
  }

  setMatteEffect() {
    this.finishType = 'matte';

    if(!this.isMatted) {
      $( "canvas" ).each(function() {
        $(this).addClass( "dotted" );
      });
      this.isMatted = true; 
    } else {
      $( "canvas" ).each(function() {
        $(this).removeClass( "dotted" );
      });
      this.isMatted = false;
    }
  }

}
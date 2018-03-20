import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SingleProductService } from '../../../services/single-product.service';

declare var $;
declare var fabric;

var canvas;
var currentBuilder = 'front-builder';
var frontState = [];
var backState = [];
var front_mods = 0;
var back_mods = 0;
var layoutPanel = "horizontal";
var sizePanel = "large";
var selectedFrontImgObj, selectedBackImgObj;
var frontImgDirection, backImgDirection;
var frontDataURL, backDataURL;
var cardType;
var originalImgObj;
var label = "";
var sku = "";
var userImg;
var userName;
var currentUser;
var draftCard;

var canvas_size = {
  large: {
    width: 800,
    height: 444
  },
  medium: {
    width: 480,
    height: 274
  },
  small: {
    width: 320,
    height: 183
  }
}

function initCanvas() {
  var width, height;

  canvas = new fabric.Canvas('canvas', {
    hoverCursor: 'pointer',
    selection: true,
    selectionBorderColor:'blue'
  });

  if(sizePanel == "small") {
    width = canvas_size.small.width;
    height = canvas_size.small.height;
  } else if(sizePanel == "medium") {
    width = canvas_size.medium.width;
    height = canvas_size.medium.height;
  } else {
    width = canvas_size.large.width;    
    height = canvas_size.large.height;
  }
  
  if(layoutPanel == "horizontal") {
    canvas.setWidth(width);
    canvas.setHeight(height);
  } else {
    canvas.setWidth(height);
    canvas.setHeight(width);
  }

  resizeCanvas();

  canvas.on(
    'object:modified', function () {
    updateModifications(true);
  },
    'object:added', function () {
    updateModifications(true);
  });

  canvas.renderAll();    
}

function updateModifications(savehistory) {  
  if (savehistory === true) {
    var myjson = JSON.stringify(canvas);
    if(currentBuilder == 'front-builder') {
        frontState.push(myjson);
        frontDataURL = canvas.toDataURL({format: 'png', quality: 1.0});
        localStorage.setItem('front', frontDataURL);
    } else {
        backState.push(myjson);
        backDataURL = canvas.toDataURL({format: 'png', quality: 1.0});
        localStorage.setItem('back', backDataURL);
    }
  }

}

function setBackgroundImg(image) {
  canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas), {
    backgroundImageOpacity: 1,
    backgroundImageStrech: true,
    top: 0,
    left: 0,
    originX: 'left',
    originY: 'top',
    width: canvas.width / canvas.getZoom(),
    height: canvas.height / canvas.getZoom(),
  });
  canvas.renderAll();
  // updateModifications(true);  
}

function reloadCardState(imageObj, direction) {
  if(!imageObj)
    return;

  if(currentBuilder == 'front-builder') {
      canvas.clear().renderAll();

      canvas.calcOffset();
      var canvas_width = JSON.parse(imageObj.frontState[imageObj.frontState.length - 1]).backgroundImage.width;
      var canvas_height = JSON.parse(imageObj.frontState[imageObj.frontState.length - 1]).backgroundImage.height;
      canvas.setWidth(canvas_width * canvas.getZoom());
      canvas.setHeight(canvas_height * canvas.getZoom());
      canvas.renderAll();

      selectedFrontImgObj = imageObj.original;
      canvas.loadFromJSON(imageObj.frontState[imageObj.frontState.length - 1]);
      frontImgDirection = direction;
  }else {
      canvas.clear().renderAll();

      canvas.calcOffset();
      var canvas_width = JSON.parse(imageObj.backState[imageObj.backState.length - 1]).backgroundImage.width;
      var canvas_height = JSON.parse(imageObj.backState[imageObj.backState.length - 1]).backgroundImage.height;
      canvas.setWidth(canvas_width * canvas.getZoom());
      canvas.setHeight(canvas_height * canvas.getZoom());
      canvas.renderAll();

      selectedFrontImgObj = imageObj.original;
      canvas.loadFromJSON(imageObj.backState[imageObj.backState.length - 1]);
      backImgDirection = direction;
  }
  
  setTimeout(()=> {
    updateModifications(true);
  }, 500);  
}

function setCanvas(imageObj, direction) {
  if(!imageObj)
    return;
  
  originalImgObj = imageObj;

  canvas.clear().renderAll(); 
  canvas.calcOffset();
  var canvas_width = imageObj.size[layoutPanel][sizePanel].width;
  var canvas_height = imageObj.size[layoutPanel][sizePanel].height;
 
  canvas.setWidth(canvas_width * canvas.getZoom());
  canvas.setHeight(canvas_height * canvas.getZoom());

  canvas.renderAll();

  if(currentBuilder == 'front-builder') {
      selectedFrontImgObj = imageObj;
      frontImgDirection = direction;
  }else {
      selectedBackImgObj = imageObj;
      backImgDirection = direction;
  }

  var backgroundImgUrl = imageObj.background[layoutPanel][direction];
  setBackgroundImg(backgroundImgUrl);
  addDataOnCanvas(imageObj, direction);
}

function addDataOnCanvas(selectedImageObj, imageDirection) {

  let imgObjAry = selectedImageObj.elements.filter(function(obj){
    if(obj.direction == imageDirection && obj.type == 'image')
      return obj;
  });
  
  let isLastImage = false;
  imgObjAry.forEach(function(element, index){      
      if( index == (imgObjAry.length - 1)){
        isLastImage = true;
      }
      
      if(element.id && element.id == 'userImg'){
        addDefaultImage(selectedImageObj, imageDirection, userImg, element.data[layoutPanel][sizePanel].left, element.data[layoutPanel][sizePanel].top, element.data[layoutPanel][sizePanel].width, element.data[layoutPanel][sizePanel].height, isLastImage);
      }else {
        addDefaultImage(selectedImageObj, imageDirection, element.src, element.data[layoutPanel][sizePanel].left, element.data[layoutPanel][sizePanel].top, element.data[layoutPanel][sizePanel].width, element.data[layoutPanel][sizePanel].height, isLastImage);
      }
  });

  canvas.renderAll();
}

function addDefaultText(content, left, top, fontSize, fontColor, fontFamily) {
  
  var textSample = new fabric.IText(content, {
    left: left,
    top: top,
    fontSize: fontSize,
    fontFamily: fontFamily,
    angle: 0,
    fill: fontColor,
    hasRotatingPoint: true,
    quality: 1
  });

  canvas.add(textSample);
  // updateModifications(true);
}

function addDefaultImage(selectedImageObj, imageDirection, url, left, top, width, height, isLastImage) {
  fabric.Image.fromURL(url, function(img) {
    var oImg = img.set({
      left: left,
      top: top,
      width: width,
      height: height,
      quality: 1
    });

    canvas.add(oImg);

    if(isLastImage){
      setTimeout(function() {
          // Add Texts after load all images.
          let txtObjAry = selectedImageObj.elements.filter(function(obj){
            if(obj.direction == imageDirection && obj.type == 'text')
              return obj;
          });

          txtObjAry.forEach(function(element){
              if(element.id && element.id == 'userName'){
                addDefaultText(userName, element.data[layoutPanel][sizePanel].left, element.data[layoutPanel][sizePanel].top, element.data[layoutPanel][sizePanel].fontSize, element.data[layoutPanel][sizePanel].fontColor, element.data[layoutPanel][sizePanel].fontFamily);
              }else if(element.id && element.id == 'businessAddress' && currentUser.businessAddress){
                addDefaultText(currentUser.businessAddress, element.data[layoutPanel][sizePanel].left, element.data[layoutPanel][sizePanel].top, element.data[layoutPanel][sizePanel].fontSize, element.data[layoutPanel][sizePanel].fontColor, element.data[layoutPanel][sizePanel].fontFamily);
              }else if(element.id && element.id == 'cellPhone' && currentUser.cellPhone){
                addDefaultText(currentUser.cellPhone, element.data[layoutPanel][sizePanel].left, element.data[layoutPanel][sizePanel].top, element.data[layoutPanel][sizePanel].fontSize, element.data[layoutPanel][sizePanel].fontColor, element.data[layoutPanel][sizePanel].fontFamily);
              }else if(element.id && element.id == 'telePhone' && currentUser.telePhone){
                addDefaultText(currentUser.telePhone, element.data[layoutPanel][sizePanel].left, element.data[layoutPanel][sizePanel].top, element.data[layoutPanel][sizePanel].fontSize, element.data[layoutPanel][sizePanel].fontColor, element.data[layoutPanel][sizePanel].fontFamily);
              }else if(element.id && element.id == 'email' && currentUser.email){
                addDefaultText(currentUser.email, element.data[layoutPanel][sizePanel].left, element.data[layoutPanel][sizePanel].top, element.data[layoutPanel][sizePanel].fontSize, element.data[layoutPanel][sizePanel].fontColor, element.data[layoutPanel][sizePanel].fontFamily);
              }else if(element.id && element.id == 'website' && currentUser.website){
                addDefaultText(currentUser.website, element.data[layoutPanel][sizePanel].left, element.data[layoutPanel][sizePanel].top, element.data[layoutPanel][sizePanel].fontSize, element.data[layoutPanel][sizePanel].fontColor, element.data[layoutPanel][sizePanel].fontFamily);
              }else{
                addDefaultText(element.content, element.data[layoutPanel][sizePanel].left, element.data[layoutPanel][sizePanel].top, element.data[layoutPanel][sizePanel].fontSize, element.data[layoutPanel][sizePanel].fontColor, element.data[layoutPanel][sizePanel].fontFamily);
              }
          });
          
          updateModifications(true);
      }, 500);
    }
  }, {crossOrigin: 'anonymous'});
}

var draftTimer;
var isNewDraft = false;
var currentDraft;

function getCurrentDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();
  var hours = today.getHours();
  var minutes = today.getMinutes();

  return (mm.toString() + dd.toString() + yyyy.toString() + "-" + hours.toString() + minutes.toString())
}

function saveDraft() {
  draftTimer = setInterval(() => {
    updateDrafts();
  }, 1000 * 10);
}

function updateDrafts() {
  var date = getCurrentDate();
  var savedDrafts = [];
  if(localStorage.getItem('savedDrafts')){
    let oldSavedDrafts = JSON.parse(localStorage.getItem('savedDrafts'));
    for (var i = 0; i < oldSavedDrafts.length; i++) {
        var draft = oldSavedDrafts[i];
        savedDrafts.push(draft);
    }
  }

  if(frontState.length > 0 || backState.length > 0) {
    if(isNewDraft){       
      var newDraft = {
        id: new Date().getTime(),
        frontState: frontState,
        frontImage: frontDataURL,
        backState: backState,
        backImage: backDataURL,
        label: label!= "" ? label : sku + "-" + date,
        cardType: cardType,
        original: originalImgObj
      }

      savedDrafts.push(newDraft);
      currentDraft = newDraft;
      isNewDraft = false;
    }else {
      if(draftCard)
        currentDraft = draftCard;

      savedDrafts.forEach(function(draft, index){
        if(draft.id == currentDraft.id){
          savedDrafts[index] = currentDraft = {
            id: draft.id,
            frontState: frontState,
            frontImage: frontDataURL,
            backState: backState,
            backImage: backDataURL,
            label: label!= "" ? label : sku + "-" + date,
            cardType: cardType,
            original: originalImgObj
          }
        }
      });
    }

    $.notify({
      message: 'Saved Design!'
    },{
      type: 'success',
      delay: 1000,
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      }
    });

    localStorage.setItem('savedDrafts', JSON.stringify(savedDrafts));
  }
}

function resizeCanvas() {
  var scale = 1;
  var containerWidth = $("#print-builder .ui-main-body").width();
  var containerHeight = $("#print-builder .ui-main-body").height();
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  
  if(canvasWidth < containerWidth && canvasHeight < containerHeight){
      scale = 1;
  }else if(canvasWidth > containerWidth && canvasHeight < containerHeight) {
      scale = containerWidth / canvas.width;
  }else if(canvasWidth < containerWidth && canvasHeight > containerHeight) {
      scale = containerHeight / canvas.height;
  }else if(canvasWidth > containerWidth && canvasHeight > containerHeight) {
    if( (canvasWidth - containerWidth) > (canvasHeight - containerHeight)){
      scale = containerWidth / canvasWidth;
    }else {
      scale = containerHeight / canvasHeight;
    }
  }

  canvas.setZoom(canvas.getZoom() * scale);
  canvas.setHeight(canvas.getHeight() * scale);
  canvas.setWidth(canvas.getWidth() * scale);
  canvas.renderAll();
}

@Component({
  selector: 'print-builder',
  templateUrl: './print-builder.component.html'
})

export class PrintBuilderComponent implements OnInit {  
  
  public colorId: string = 'white';
  public leftPanel: string = 'designs';
  public layoutPanel: string = 'horizontal';
  public sizePanel: string = 'large';
  public textAlign: string = 'center'
  public fontWeight: string = '';
  public currentBuilder: string = '';
  public isCollapse: boolean = false;
  public product_designs: any;
  public label: string = "";
  public cardType: string = "";
  public draftCard: any;
  public router: any;
  public hasLabel: boolean = false;

  @Input() ipage: string;
  @Output() collapseUpdate = new EventEmitter();

  constructor(public spService: SingleProductService, private _router: Router) {
    this.router = _router;
    this.product_designs = require("../../../../resources/data.json");
    this.currentBuilder = currentBuilder = 'front-builder';
    
    currentUser = JSON.parse(localStorage.getItem('user'));
    userImg = JSON.parse(localStorage.getItem('user')).photo;
    userName = JSON.parse(localStorage.getItem('user')).firstName+' '+JSON.parse(localStorage.getItem('user')).lastName;    
  }

  ngOnInit() {
    this.layoutPanel = layoutPanel= this.spService.getLayout();
    this.sizePanel = sizePanel = this.spService.getSizePanel();
    this.cardType = cardType = this.spService.getCardType();
    this.draftCard = draftCard = this.spService.getDraftCard();

    window.localStorage.removeItem('front');
    window.localStorage.removeItem('back');

    initCanvas();
   
    $(document).ready(function() {

      $(window).resize(function(){
        if(currentBuilder == 'front-builder' || currentBuilder =='back-builder'){
          resizeCanvas();
        }
      });

      $("#addText").click(function() {
        var textSample = new fabric.IText('Sample Text', {
          left: fabric.util.getRandomInt(0, canvas.width / 2),
          top: fabric.util.getRandomInt(0, canvas.height / 2),
          fontFamily: 'ProximaNovaRegular',
          fontSize: 24,
          angle: 0,
          fill: '#000000',
          hasRotatingPoint:true
        });       
        canvas.add(textSample);
        updateModifications(true);
      });

      $("#undo").click(function() {
        if(currentBuilder == 'front-builder'){
          if (front_mods < frontState.length) {
            canvas.clear().renderAll();
            canvas.loadFromJSON(frontState[frontState.length - 1 - front_mods - 1]);
            canvas.renderAll();
            front_mods += 1;
          }          
        }else {
          if (back_mods < backState.length) {
            canvas.clear().renderAll();
            canvas.loadFromJSON(backState[backState.length - 1 - back_mods - 1]);
            canvas.renderAll();
            back_mods += 1;
          } 
        }
      });

      $("#redo").click(function() {
        if(currentBuilder == 'front-builder'){
          if (front_mods > 0) {
            canvas.clear().renderAll();
            canvas.loadFromJSON(frontState[frontState.length - 1 - front_mods + 1]);
            canvas.renderAll();
            front_mods -= 1;
          }
        }else {
          if (back_mods > 0) {
            canvas.clear().renderAll();
            canvas.loadFromJSON(backState[backState.length - 1 - back_mods + 1]);
            canvas.renderAll();
            back_mods -= 1;
          }
        }
      });

      $("#ui-fonts").change(function() {
        var activeObject = canvas.getActiveObject();
        var font = $(this).val();
        if (activeObject && activeObject.type === 'i-text') {
          activeObject.fontFamily = font;       
          canvas.renderAll();
          updateModifications(true);
        }
      });

      $("#ui-font-size").change(function() {
        var activeObject = canvas.getActiveObject();
        var fontSize = $(this).val();
        if (activeObject && activeObject.type === 'i-text') {
          activeObject.fontSize = (activeObject.fontSize == fontSize ? fontSize : fontSize);        
          canvas.renderAll();
          updateModifications(true);
        }
      });

      $("#ui-font-color ul li").click(function() {
        var color = $(".color-selector span").css('backgroundColor');
        var activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'i-text') {
          activeObject.set({fill: color});
          canvas.renderAll();
          updateModifications(true);
        }
      });

      $("#bold").click(function(){
        var activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'i-text') {
          activeObject.fontWeight = (activeObject.fontWeight == 'bold' ? '' : 'bold');        
          canvas.renderAll();
          updateModifications(true);
        }
      });

      $("#italic").click(function() {
        var activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'i-text') {
          activeObject.fontStyle = (activeObject.fontStyle == 'italic' ? '' : 'italic');        
          canvas.renderAll();
          updateModifications(true);
        }
      });

      $("#align-left").click(function() {
        var activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'i-text') {
          activeObject.textAlign = (activeObject.textAlign == 'left' ? '' : 'left');        
          canvas.renderAll();
          updateModifications(true);
        }
      });

      $("#align-center").click(function() {
        var activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'i-text') {
          activeObject.textAlign = (activeObject.textAlign == 'center' ? '' : 'center');        
          canvas.renderAll();
          updateModifications(true);
        }
      });

      $("#align-right").click(function() {
        var activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'i-text') {
          activeObject.textAlign = (activeObject.textAlign == 'right' ? '' : 'right');        
          canvas.renderAll();
          updateModifications(true);
        }
      });

      $(".layouts").click(function() {
        
        if(layoutPanel == $(this).attr('id'))
          return;

        layoutPanel = $(this).attr('id');

        canvas.calcOffset();
        var canvas_width = JSON.parse(frontState[frontState.length - 1]).backgroundImage.width;
        var canvas_height = JSON.parse(frontState[frontState.length - 1]).backgroundImage.height;

        if(layoutPanel == 'horizontal'){
          canvas.setWidth(canvas_width);
          canvas.setHeight(canvas_height);
        }else {
          canvas.setWidth(canvas_height);
          canvas.setHeight(canvas_width);
        }
        
        canvas.renderAll();
        canvas.setZoom(1);
        resizeCanvas();

        if(currentBuilder == 'front-builder'){
          setCanvas(selectedFrontImgObj, frontImgDirection);
        }else {
          setCanvas(selectedBackImgObj, backImgDirection);
        }
      });

      $(".sizes").click(function() {
        sizePanel = $(this).attr('id');

        if(layoutPanel == 'horizontal'){
          canvas.setWidth(canvas_size[sizePanel].width);
          canvas.setHeight(canvas_size[sizePanel].height);
        }else {
          canvas.setWidth(canvas_size[sizePanel].height);
          canvas.setHeight(canvas_size[sizePanel].width);
        }

        if(currentBuilder == 'front-builder')
          setCanvas(selectedFrontImgObj, frontImgDirection);
        else
          setCanvas(selectedBackImgObj, backImgDirection);
      });


      $("#myFile").on("change", function(e) {
        var left = 30;
        var top = 30;  
        var width = 200;
        var height = 250;
        if(layoutPanel == 'horizontal') {
          if(sizePanel == "small") {
            left = 20;
            top = 20;
            width = 100;
            height = 150;
          } else if (sizePanel == "medium") {
            left = 30;
            top = 30;
            width = 160;
            height = 230;
          } else {
            left = 40;
            top = 40;
            width = 190;
            height = 250;
          }
        } else {
          if(sizePanel == "small") {
            left = 30;
            top = 30;
            width = 130;
            height = 190;
          } else if (sizePanel == "medium") {
            left = 50;
            top = 50;
            width = 210;
            height = 240;
          } else {
            left = 60;
            top = 60;
            width = 250;
            height = 320;
          }
          
        }
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (f) {
          var target: any = f.target;
          var data: string = target.result;
          fabric.Image.fromURL(data, function (img) {
            var oImg = img.set({
              left: left,
              top: top,
              angle: 0,
              width: width,
              height: height
            }).scale(0.9);
            canvas.add(oImg).renderAll();
            var a = canvas.setActiveObject(oImg);
            var dataURL = canvas.toDataURL({format: 'png', quality: 0.8});
            updateModifications(true);
          });
        };
        reader.readAsDataURL(file);
      });
    });
    
    // if(this.spService.getClearCanvas()) {
    //   selectedFrontImgObj = undefined;
    //   selectedBackImgObj = undefined;
    //   frontState = [];
    //   backState = [];
    // } else {
    //   currentBuilder = this.currentBuilder
      
    //   if(frontState.length > 0){
    //     setTimeout(()=> {
    //       canvas.loadFromJSON(frontState[frontState.length - 1]);
    //       frontDataURL = canvas.toDataURL({format: 'png', quality: 1.0});
    //       localStorage.setItem('front', frontDataURL);
    //     }, 500)
        
    //   }
    //   //  setCanvas(selectedFrontImgObj, frontImgDirection);
        
    // }

    if(this.router.url == '/single-product'){
      frontDataURL = '';
      backDataURL = '';

      if(draftCard){
        isNewDraft = false;
        this.label = label = draftCard.label;
        frontState = draftCard.frontState;
        backState = draftCard.backState;
        originalImgObj = draftCard.original;

        if(backState.length > 0){
          backDataURL = draftCard.backImage;
          localStorage.setItem('back', backDataURL);
        }

        if(frontState.length > 0){
          frontDataURL = draftCard.frontImage;
          localStorage.setItem('front', frontDataURL);
        }

        reloadCardState(draftCard, 'front');
      }else{
          isNewDraft = true;
          label = '';
          frontState = [];
          backState = [];
      }

      saveDraft();
    }
  }

  ngOnChanges(changes) {
    if(changes.ipage.currentValue != this.currentBuilder) {
      this.changeBuilder(changes);
    }
  }

  changeBuilder(changes) {
    this.leftPanel = 'designs';
    canvas.clear().renderAll();
 
    this.currentBuilder = currentBuilder = changes.ipage.currentValue;

    if(this.currentBuilder == 'front-builder'){
      if(frontState.length > 0) {
        if(this.draftCard)
          selectedFrontImgObj = this.draftCard.original;
        
        canvas.loadFromJSON(frontState[frontState.length - 1]);
      }
    }else if(this.currentBuilder == 'back-builder') {
      if(backState.length > 0) {
        if(this.draftCard)
          selectedBackImgObj = this.draftCard.original;
        
        canvas.loadFromJSON(backState[backState.length - 1]);
      }
    } 

    canvas.renderAll();
  }

  setInitCanvas(imageObj, direction) {
    canvas.clear().renderAll();
    
    if(this.draftCard) {
      reloadCardState(imageObj, direction);
    } else {
      this.spService.setCardName(imageObj.name);
      sku = imageObj.sku;
      setCanvas(imageObj, direction);
    }

    //this.spService.setselectedImageObj(value)
  }

  saveLabel() {
    if(this.label != ''){
      label = this.label;
      this.hasLabel = true;
    }
  }

  updateCollapse(){
    this.isCollapse = !this.isCollapse;
    this.collapseUpdate.emit(this.isCollapse);

    // Timer because the animation of collapse pane.
    setTimeout(() => {
      resizeCanvas();
    }, 400);    
  }

  zoomOut() {
    if( canvas.getZoom().toFixed(5) <= 0.7 ){
      return;
    }
    canvas.zoomToPoint(new fabric.Point(canvas.width / 2, canvas.height / 2), canvas.getZoom() / 1.1);
    canvas.renderAll();
  }

  zoomIn() {
    if( canvas.getZoom().toFixed(5) > 4) {
      return;
    }
    canvas.zoomToPoint(new fabric.Point(canvas.width / 2, canvas.height / 2), canvas.getZoom() * 1.1);
    canvas.renderAll();
  }

  ngOnDestroy() {
    console.log("switch router");
    clearInterval(draftTimer);

    updateDrafts();
  }
}
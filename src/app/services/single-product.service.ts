import {Injectable} from '@angular/core';
import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class SingleProductService {
  
  public item: any;
  public layout: string = "horizontal";
  public size: string = "large";
  public selectedImage: any;
  public cardType: string = "";
  public handleClearCanvas: boolean;
  public cardName: string = "";
  public cardInfo: any;
  public draftCard: any;

  constructor(private http: Http) {
    this.item = {
      frontImage: "",
      frontState: [],
      backImage: "",
      backState: []
    }
  }

  setValue(key, value) {
    this.item[key] = value
  }

  getValue() {
    localStorage.setItem('image', JSON.stringify(this.item))
    return this.item
  }

  setLayout(value) {
    this.layout = value
  }

  setSizePanel(value) {
    this.size = value
  }

  setCardType(value) {
    this.cardType = value
  }

  getLayout() {
    return this.layout
  }

  getSizePanel() {
    return this.size
  }

  getCardType() {
    return this.cardType
  }

  setSelectedImage(val) {
    this.selectedImage = val
  }

  getSelectedImage() {
    return this.selectedImage
  }

  clearCanvas(value) {
    this.handleClearCanvas = value
  }

  getClearCanvas() {
    return this.handleClearCanvas
  }

  setCardName(val) {
    this.cardName = val;
  }

  getCardName() {
    return this.cardName
  }

  setCardInfo(val) {
    this.cardInfo = val
  }

  getCardInfo() {
    return this.cardInfo
  }

  setDraftCard(val) {
    this.draftCard = val
  }

  getDraftCard() {
    return this.draftCard
  }

  uploadDatasource(payload): Observable<any[]> {
    let headers = new Headers();

    headers.append('Accept', 'application/json, text/plain,');
    let options = new RequestOptions({ headers: headers });


    return this.http.post(`API_UPLOAD_PATH`,payload, options)
      .map((res: Response) => {
        let data = res.json();
        return data;
      })
      .catch(error => Observable.throw(error))

  }
}

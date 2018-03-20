import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { SideNavbarComponent } from './components/side-navbar/side-navbar.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductsViewerComponent } from './components/products-viewer/products-viewer.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { SingleProductComponent } from './components/single-product/single-product.component';
import { PrintBuilderComponent } from './components/single-product/print-builder/print-builder.component';
import { ReviewOrderComponent } from './components/single-product/review-order/review-order.component';
import { TypeFamilyComponent } from './components/single-product/type-family/type-family.component';
import { SingleProductService } from './services/single-product.service';
import { SettingComponent } from './components/setting/setting.component';
import { AccountComponent } from './components/setting/account/account.component';
import { BillingComponent } from './components/setting/billing/billing.component';
import { ShippingComponent } from './components/setting/shipping/shipping.component';
import { CreditComponent } from './components/setting/credit/credit.component';
import { OtherComponent } from './components/setting/other/other.component';
import { CartComponent } from './components/cart/cart.component';
import { AlertComponent } from './components/alert-modal/alert.component';
import { SignupConfirmComponent } from './components/signup-confirm/signup-confirm.component';
import { CSVComponent } from './components/csv-upload/csv.component';
import { SavedDraftComponent } from './components/saved-draft/saved-draft.component';

const ROUTES = [{
  path: '',
  component: DashboardComponent
}, {
  path: 'products',
  component: ProductsViewerComponent
}, {
  path: 'thank-you',
  component: ThankYouComponent
}, {
  path: 'single-product',
  component: SingleProductComponent
}, {
  path: 'setting',
  component: SettingComponent
}, {
  path: 'cart',
  component: CartComponent
}, {
  path: 'saved-draft',
  component: SavedDraftComponent
}];

@NgModule({
  declarations: [
    AppComponent,
    SideNavbarComponent,
    TopBarComponent,
    DashboardComponent,
    ProductsViewerComponent,
    ThankYouComponent,
    SingleProductComponent,
    PrintBuilderComponent,
    ReviewOrderComponent,
    TypeFamilyComponent,
    SettingComponent,
    AccountComponent,
    BillingComponent,
    ShippingComponent,
    CreditComponent,
    OtherComponent,
    CartComponent,
    AlertComponent,
    SignupConfirmComponent,
    CSVComponent,
    SavedDraftComponent
  ],
  entryComponents: [AlertComponent, SignupConfirmComponent, CSVComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BootstrapModalModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [SingleProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }

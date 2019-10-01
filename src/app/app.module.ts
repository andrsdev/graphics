import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './components/footer/footer.component';


import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ColorPickerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

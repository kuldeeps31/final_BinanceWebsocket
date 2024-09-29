
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
    declarations:[

    ],
    imports: [
        CommonModule,
        BrowserModule,
        //socket config for root
        SocketIoModule.forRoot(config), 
      ],
      providers:[SocketIoModule]
})
export class AppModule {}
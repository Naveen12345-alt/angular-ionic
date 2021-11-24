import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { INTRO_KEY } from '@app/_helpers/intro.guard';
import { Storage } from '@capacitor/storage';
import SwiperCore, { Virtual } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

// install Swiper modules
SwiperCore.use([Virtual]);

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  constructor(private router: Router) {}

  ngOnInit() {}

  next() {
    this.swiper.swiperRef.slideNext(100);
  }

  async start() {
    await Storage.set({ key: INTRO_KEY, value: 'true' });
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}

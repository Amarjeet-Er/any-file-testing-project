import { Component } from '@angular/core';
import Swiper from 'swiper';

import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
SwiperCore.use([Autoplay, Pagination, Navigation]);
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  slider_data = [
    { img_url: 'https://upraise.io/wp-content/uploads/2019/12/Asset-1-1.png' },
    { img_url: 'https://www.datocms-assets.com/64859/1706288781-define-management-core-principles-unveiled-1706288781216.png?q=70&auto=format&w=1280' },
    { img_url: 'https://lifexchangesolutions.com/wp-content/uploads/2019/12/What-is-Management.jpg' },
    { img_url: 'https://www.simplilearn.com/ice9/free_resources_article_thumb/How_to_Become_Management_Consultant.jpg' },
  ]
}

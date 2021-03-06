import { Component } from '@angular/core';

import { MyWalletPage } from '../my-wallet/my-wallet';
import { MyTakitPage } from '../my-takit/my-takit';
import { HomePage } from '../home/home';
import { MorePage } from '../more/more';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = MyTakitPage;
  tab3Root: any = MyWalletPage;
  tab4Root: any = MorePage;

  constructor() {

  }
}

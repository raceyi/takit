import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FaqPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {

   questions=[{hidden:true,
               question:"캐쉬아이디를 어떻게 입력하나요?",answer:"스마트폰과 인터넷 뱅킹으로 계좌이체시 받는통장 표시내용에 캐쉬아이디를 입력하시면 됩니다. 은행마다 캐쉬아이디 입력방법이 틀립니다. <a href=\"http://www.takit.biz/cashId.html\">토스/주요은행 캐쉬아이디 입력방법</a>"},
             {hidden:true,
               question:"캐쉬아이디 입력을 잊어버렸어요",answer:"내지갑->충전버튼 선택-> \"캐쉬아이디 입력을 잊으셨나요? +\" 버튼 선택->직접 계좌이체한 정보를 입력하시고 입금확인하기 버튼을 눌러주세요. 계좌이체시 캐쉬아이디를 입력하지 않았을 경우 받는 통장 표시내용은 본인의 실명이 기재됩니다."},
             {hidden:true,
               question:"캐쉬아이디를 잘못 입력했어요",answer:"내지갑->충전버튼 선택-> \"캐쉬아이디 입력을 잊으셨나요? +\" 버튼 선택->계좌이체한 정보를 입력하실때 받는 통장 표시내용에 잘못 입력하신 캐쉬아이디를 입력하시고 입금확인하기 버튼을 눌러주세요."},
             {hidden:true,
               question:"고의적으로 남의 입금액을 자신의 캐쉬에 충전할 순 없나요?",answer:"캐쉬아이디를 입력하지 않으셨거나 실수로 다른 캐쉬아이디를 입력하셨을 경우에 대비해 고객님이 입금정보를 기재하시고 충전을 확인할수 있도록 하고 있습니다. 그러나 세번 시도에서 모두 실패하면 해당 방법의 캐쉬 충전 기능이 정지됩니다. 또한 법적으로 본인의 입금이 아닌 금액에 대해 충전확인을 수행할경우 사기죄로 민형사상 피소가 가능합니다. 타킷은 소송의 주체가 될수 있으며 이러한 사건이 발생할 경우 반듯이 법적인 대응을 할것입니다."},
             {hidden:true,
               question:"캐쉬 충전 확인 메시지를 받지 못했어요.",answer:"내지갑->거래내역 선택->구분에 확인버튼으로 나온 항목의 확인버튼을 클릭 하시면 충전 확인 메시지를 보실수 있습니다. 만약 5분이 지나도 확인 항목이 없다면 고객센터(0505-170-3636,help@takit.biz)에 연락부탁드립니다."},
             {hidden:true,
               question:"캐쉬 충전 확인 메시지에서 확인을 요청하지 않고 취소를 선택했어요.",answer:"캐쉬화면에서 거래내역 선택->구분에 확인버튼으로 나온 항목의 확인버튼을 클릭 하시면 충전 확인 메시지를 다시 보실수 있습니다."},
             {hidden:true,
               question:"본인명의 휴대폰이 없어요.",answer:"타킷은 보안을 위해 캐쉬아이디 설정시 본인확인 과정을 거치고 있습니다. 본인명의 휴대폰이 없을 경우 사용이 불가능합니다."},
             {hidden:true,
               question:"캐쉬비밀번호를 잊어버렸어요.",answer:"내지갑->설정버튼을 누르시면 휴대폰 본인인증 이후 비밀번호를 수정하실수 있습니다."},
             {hidden:true,
               question:"서비스 이용 가능한 나이는 어떻게 되나요?",answer:"만14세 이상부터 가능합니다"},
             {hidden:true,
               question:"핸드폰의 명의와 환불 계좌의 명의가 꼭 같아야만 환불가능한가요?",answer:"네 반드시 같아야만 합니다. 휴대폰 본인 인증으로 확인된 이름의 수정이 필요할 경우 고객센터(0505-170-3636,help@takit.biz)에 연락부탁드립니다."},
             {hidden:true,
               question:"ATM기로도 캐쉬 충전이 가능한가요?",answer:"아직 이부분 준비되지 않았습니다. 곧 준비하도록 하겠습니다."},
             {hidden:true,
               question: "타인의 입금이 저에게 충전 확인 메시지가 전달되었어요. 어떻게 해야 하나요?",answer:"타인의 충전 확인 메시지를 수신하셨을시에 상단 우측에 삭제 버튼을 눌러 진행해 주시기 바랍니다."},
             {hidden:true,
               question: "무료 결제수수료가 어떤 의미인가요?",answer:"고객님의 온라인 결제시 카드 결제 수수료는 3.2%, 은행자동인출은 450원,가상계좌는 300원의 수수료가 지불됩니다. 타킷캐쉬는 여러분의 캐쉬아이디 입력을 통해 외부수수료 없이 운영 됩니다. 상점주는 결제 수수료 없이 타킷 서비스 수수료 0.25%만을 지불하시면 됩니다."},
                
             ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad FaqPage');
  }

  showAnswerToggle(question){
    //console.log("question:"+JSON.stringify(question));
    question.hidden=(!question.hidden);
  }

  back(){
    this.navCtrl.pop();
  }
}

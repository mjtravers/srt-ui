import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { SolicitationService } from '../../solicitation.service';
import { SurveyService } from '../../../survey.service';
import { Solicitation } from '../../../shared/solicitation';

@Component({
  selector: 'app-help-us-improve',
  templateUrl: './help-us-improve.component.html',
  styleUrls: ['./help-us-improve.component.css']
})
export class HelpUsImproveComponent implements OnInit {

  /* ATTRIBUTES */

  public surveys;
  public surveyModel = [];
  public feedbackSent:boolean = false;

  solicitation: Solicitation;
  subscription: Subscription;
  solicitationID: String;
  type: String = 'feedback';
  public step1:Boolean = false;
  public step2:Boolean = false;
  public step3:Boolean = false;


   /* CONSTRUCTORS */

  /**
   * constructor
   * @param solicitationService
   * @param surveyService
   * @param router
   * @param route
   */
  constructor(
    private solicitationService: SolicitationService,
    private surveyService:SurveyService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  /**
   * lifecycle
   */
  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        var now = new Date().toLocaleDateString();
        this.solicitationID = params['id'];
        this.solicitationService.getSolicitation(this.solicitationID).subscribe(
          data => {
            data.parseStatus.forEach(element => {
                if (element.status == 'successfully parsed') element.status = 'Yes';
                else if (element.status == 'processing error')  element.status = 'No';
            });

            this.step1 = data.history.filter(function(e){
              return e['action'].indexOf('reviewed solicitation action requested summary') > -1;
            }).length > 0;
            this.step2 = data.history.filter(function(e){
              return e['action'].indexOf('sent email to POC') > -1;
            }).length > 0;
            this.step3 = data.history.filter(function(e){
              return e['action'].indexOf('provided feedback on the solicitation prediction result') > -1;
            }).length > 0;
            this.solicitation = data;

            var user = localStorage.getItem('firstName') + ' ' + localStorage.getItem('lastName');
            this.feedbackSent = this.solicitation.history.filter(function(e){return ((e['action'].indexOf('provided feedback on the solicitation prediction result') > -1) && (e['user'].indexOf(user) > -1))}).length > 0;

            this.getSurveys();
          },
          err => console.log(err)
        )
      })
  }

  /**
   * input percentage
   * @param survey
   * @param answer
   */
  inputPercent(survey, answer) {
    survey.Answer = answer;
    this.surveyModel[survey.ID] = answer;
  }

  /**
   * text area
   * @param survey
   * @param answer
   */
  textarea(survey, answer) {
    survey.Answer = answer;
    this.surveyModel[survey.ID] = answer;
  }

  /**
   * check box
   * @param survey
   * @param answer
   * @param checked
   */
  checkBox(survey, answer, checked) {
      if (checked)
      {
          if (survey.Type != 'multiple response')
          {
            survey.Answer = answer;
            this.surveyModel[survey.ID] = answer;
          }
          else {
            survey.Answer = (survey.Answer === '') ? answer : survey.Answer + ',' + answer;
            this.surveyModel[survey.ID] =  (survey.Answer === '') ? answer : survey.Answer + ',' + answer;
          }
      }
  }

  /**
   * get survey questions
   */
  getSurveys() {
      this.surveyService.getSurveys().subscribe(
        data => {
          this.surveys = data.sort(function(a,b){
            var anum = +a.ID;
            var bnum = +b.ID;
            if (anum> bnum) return 1;
            else return -1;
          });
          for (var i = 0; i < data.length; i++) {
            this.surveyModel.push('');
          }
        }
      )
  }

  /**
   * send out a feedback
   */
  feedback() {
      var now = new Date().toLocaleDateString();
      var user = localStorage.getItem('firstName') + ' ' + localStorage.getItem('lastName');
      var r = this.solicitation.history.push({'date': now, 'action': 'provided feedback on the solicitation prediction result', 'user': user , 'status' : ''});

      this.surveys.forEach(element => {
          if(this.solicitation.feedback == null)
          {
              this.solicitation.feedback = [{'questionID': element.ID, 'question': element.Question, 'note': element.Note, 'answer': element.Answer}];
          }
          else
          {
              this.solicitation.feedback.push({'questionID': element.ID, 'question': element.Question, 'note': element.Note, 'answer': element.Answer})
          }
      });

      this.solicitationService.updateHistory(this.solicitation)
      .subscribe(
        msg => {
          this.feedbackSent = true;
          this.step3 = true;
        },
        err => {
        });
  }

}

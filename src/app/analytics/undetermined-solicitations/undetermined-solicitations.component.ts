import { Component, OnInit, Input, ViewChild, Directive  } from '@angular/core';

import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { ChartsModule, Color } from 'ng2-charts/ng2-charts';

@Component({
  selector: 'app-undetermined-solicitations',
  templateUrl: './undetermined-solicitations.component.html',
  styleUrls: ['./undetermined-solicitations.component.css']
})
export class UndeterminedSolicitationsComponent implements OnInit {

  /* ATTRIBUTES */

  @Input() UndeterminedSolicitationChart;
  @ViewChild(BaseChartDirective) private baseChart;

  public hasValue = false;
  public pieChartLabels:string[] = ['Presolicitation', 'Other Undetermined', '0 Documents', 'Non-Machine Readable'];
  public pieChartData:any[] = [0, 0, 0, 0];

  public pieChartType:string = 'pie';
  public options:any = {
    cutoutPercentage: 0,
    legend: {
        display: true,
        position: 'bottom',
        onClick: function() {
        }
    },
    tooltips: {
        enabled: true,
        callbacks: {
            label :function(tooltipItem, data) {
              return  data.labels[tooltipItem.index] + ": " + data.datasets[0].data[tooltipItem.index] + " solicitation(s)"
            }
        }
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  colorsOverride: Array<Color> = [{
      backgroundColor: [ "#2C81C0", "#ff0000", "#e8e8e8", "#FFB300" ],
      hoverBackgroundColor: [ "#2C81C0", "#ff0000", "#e8e8e8", "#FFB300" ],
  }];

  public displayPresolicitation = "";
  public displayNonMachineReadable = "";
  public displayNoDocument = "";
  public displayOtherUndetermined= "";

  /* CONSTRUCTOR */

  /**
   * constructor
   */
  constructor(
  ) {}

  /**
   * lifecycle
   */
  ngOnInit() {
  }

  /**
   * lifecycle
   */
  ngOnChanges() {

    if (this.UndeterminedSolicitationChart && !this.hasValue) {
        var presolicitation = this.UndeterminedSolicitationChart.presolicitation;
        var undetermined = this.UndeterminedSolicitationChart.latestOtherUndetermined;
        var NonMachineReadable = this.UndeterminedSolicitationChart.latestNonMachineReadable;
        var NoDocument = this.UndeterminedSolicitationChart.latestNoDocument;
        var total = presolicitation + undetermined + NonMachineReadable + NoDocument;
        this.pieChartData = [presolicitation, undetermined, NonMachineReadable, NoDocument];

        this.displayPresolicitation = Math.round(presolicitation / total * 1000) / 10 + "%";
        this.displayNonMachineReadable = Math.round(NonMachineReadable / total * 1000) / 10 + "%";
        this.displayNoDocument = Math.round(NoDocument / total * 1000) / 10 + "%";
        this.displayOtherUndetermined = Math.round(undetermined / total * 1000) / 10 + "%";
        this.hasValue = true;
        this.forceChartRefresh();
    }
  }

  /**
   * refresh chart
   */
  forceChartRefresh() {
      setTimeout(() => {
          this.baseChart.refresh();
      }, 10);
  }

}

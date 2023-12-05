import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ChartDataItem } from '@app/models/chart-data.model';
import { EventBusService, EventMap } from '@app/services/event-bus/event-bus.service';
import { CommonUtil } from '@app/utils/common.util';
import { Chart, BarController, CategoryScale, BarElement, Tooltip} from 'chart.js';
import { Subject, takeUntil } from 'rxjs';

Chart.register(BarElement, CategoryScale, BarController, Tooltip);


@Component({
  selector: 'app-stacked-bar-line-chart',
  templateUrl: './stacked-bar-line-chart.component.html',
  styleUrls: ['./stacked-bar-line-chart.component.scss']
})
export class StackedBarLineChartComponent {

  destroy$ = new Subject<boolean>();
  chartContainerId = '';
  barChartData: ChartDataItem[] = [];
  barChart: Chart<'bar', number[], string> | undefined;

  @Input() data: ChartDataItem[] = [];
  constructor(private eventBus: EventBusService) { }

  ngOnInit() {
    console.log("### In ngOnInit")
    this.chartContainerId = CommonUtil.createUniqId('stacked_barline_chart_');

    this.eventBus
      .getEvent(EventMap.WindowResizedEvent)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.renderChart(this.barChartData));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngAfterViewInit() {
    if (this.data) {
      this.renderChart(this.data);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['data'] &&
      changes['data'].currentValue &&
      changes['data'].currentValue.length > 0
    ) {
      this.barChartData = changes['data'].currentValue;
      this.renderChart(this.barChartData);
    }
  }

  renderChart(chartData: ChartDataItem[] = []) {
    console.log("### In renderChart")
    if (!this.chartContainerId) {
      return;
    }
    const ctx = (document.getElementById(this.chartContainerId) as HTMLCanvasElement).getContext(
      '2d'
    );

    const dataValues = chartData.map((d) => d.value);
    const chartLabels = chartData.map((d) => d.name);
    const colors = chartData.map((d) => d.color);
    const footers = chartData.map((d) => d.footer);

    if (this.barChart) {
      this.barChart.destroy();
    }

    this.barChart = new Chart(ctx!, {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [
          {
            data: dataValues,
            backgroundColor: colors,
            borderWidth: 1
          }
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
        },
      },
    });

    this.barChart.update();
  }
}

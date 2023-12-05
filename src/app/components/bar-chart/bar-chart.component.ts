/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ChartDataItem } from '@app/models/chart-data.model';
import { EventBusService, EventMap } from '@app/services/event-bus/event-bus.service';
import { CommonUtil } from '@app/utils/common.util';
import { Chart, BarController, CategoryScale, BarElement, Tooltip} from 'chart.js';
import { Subject, takeUntil } from 'rxjs';

Chart.register(BarElement, CategoryScale, BarController, Tooltip);

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  destroy$ = new Subject<boolean>();
  chartContainerId = '';
  barChartData: ChartDataItem[] = [];
  barChart: Chart<'bar'|'line', number[], string> | undefined;

  @Input() data: ChartDataItem[] = [];
  constructor(private eventBus: EventBusService) { }

  ngOnInit() {
    this.chartContainerId = CommonUtil.createUniqId('bar_chart_');

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

    let cpuValues: number[] = [1, 2, 3, 4, 2, 9,7,7,9,10];
    let gpuValues: number[] = [10,9,8,7,6,5,4,3,2,1];
    let memoryValues: number[] = [5,5,5,5,5,6,6,6,6,6];
    let diskValues: number[] = [3,3,3,3,7,7,7,7,7,8];

    if (this.barChart) {
      this.barChart.destroy();
    }

    this.barChart = new Chart(ctx!, {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [
    // {
    //   label: 'Dataset 1',
    //   data: Utils.numbers(NUMBER_CFG),
    //   borderColor: Utils.CHART_COLORS.red,
    //   backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
    //   stack: 'combined',
    //   type: 'bar'
    // },
    // {
    //   label: 'Dataset 2',
    //   data: Utils.numbers(NUMBER_CFG),
    //   borderColor: Utils.CHART_COLORS.blue,
    //   backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
    //   stack: 'combined'
    // }
    // const CHART_COLORS = ['#4285f4', '#db4437', '#f4b400', '#0f9d58', '#ff6d00', '#3949ab', '#facc54', '#26bbf0', '#cc6164', '#60cea5'];
    
          {
            label: 'CPU',
            data: cpuValues,
            backgroundColor: '#4285f4',
            borderWidth: 1,
            order: 3
          },
          {
            label: 'memory',
            data: memoryValues,
            backgroundColor: '#db4437',
            borderWidth: 1,
            order: 3
          },
          {
            label: 'gpu',
            data: gpuValues,
            backgroundColor: '#f4b400',
            borderWidth: 1,
            order: 3
          },
          {
            label: 'disk',
            data: diskValues,
            backgroundColor: '#0f9d58',
            borderWidth: 1,
            order: 3
          }
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
          title: {
            display: false,
          },
          tooltip: {
            enabled: true,
            position: 'nearest',
            callbacks: {
              label: function(context) {
                let unit = context.parsed.y > 1 ? 'nodes' : 'node';
                return 'Total: ' + context.parsed.y + ' ' + unit;
              },
              footer: function(context) {
                return footers[context[0].dataIndex]
              }
            }
          },
        },
      },
    });

    this.barChart.update();
  }
}

import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { isPlatformBrowser } from '@angular/common';
import { DashboardDataService } from '../../service/dashboard/dashboard-data';
import { DashboardChartService } from '../../service/dashboard/dashboard-chart';
import { DashboardVisibilityService } from '../../service/dashboard/dashboard-visibility';
import Chart from 'chart.js/auto';
import { DashboardReportService } from '../../service/dashboard/dashboard-report';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements AfterViewInit, OnDestroy {

  statsData: any;
  workouts: any[] = [];
  activities: any[] = [];

  @ViewChild('workoutLineChart') private workoutLineChartRef!: ElementRef;
  @ViewChild('activityLineChart') private activityLineChartRef!: ElementRef;
  @ViewChild('workoutMonthChart') private workoutMonthChartRef!: ElementRef;
  @ViewChild('activityMonthChart') private activityMonthChartRef!: ElementRef;

  private workoutLineChart!: Chart;
  private activityLineChart!: Chart;
  private workoutMonthChart!: Chart;
  private activityMonthChart!: Chart;

  constructor(
    private dataService: DashboardDataService,
    private chartService: DashboardChartService,
    private visibility: DashboardVisibilityService,
    private reportService: DashboardReportService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  exportPdf() {
    this.reportService.generateStatsReport(this.statsData, this.workouts, this.activities);
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadStats();
      this.loadGraphStats();
      this.visibility.register(() => this.refreshCharts());
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.visibility.unregister();
    }
    this.destroyCharts();
  }

  private loadStats() {
    this.dataService.getStats().subscribe(res => this.statsData = res);
  }

  private loadGraphStats() {
    this.dataService.getGraphStats().subscribe(res => {
      this.workouts = res.workouts || res.Workouts || [];
      this.activities = res.activities || res.Activities || [];
      this.refreshCharts();
    });
  }

  private destroyCharts() {
    [this.workoutLineChart, this.activityLineChart, this.workoutMonthChart, this.activityMonthChart]
      .forEach(c => c?.destroy());
  }

  private refreshCharts() {
    this.destroyCharts();
    if (this.workoutLineChartRef?.nativeElement) {
      this.workoutLineChart = this.chartService.createWorkoutChart(this.workoutLineChartRef.nativeElement.getContext('2d'), this.workouts);
    }
    if (this.activityLineChartRef?.nativeElement) {
      this.activityLineChart = this.chartService.createActivityChart(this.activityLineChartRef.nativeElement.getContext('2d'), this.activities);
    }
    if (this.workoutMonthChartRef?.nativeElement) {
      this.workoutMonthChart = this.chartService.createMonthlyWorkoutChart(this.workoutMonthChartRef.nativeElement.getContext('2d'), this.workouts);
    }
    if (this.activityMonthChartRef?.nativeElement) {
      this.activityMonthChart = this.chartService.createMonthlyActivityChart(this.activityMonthChartRef.nativeElement.getContext('2d'), this.activities);
    }
  }
}

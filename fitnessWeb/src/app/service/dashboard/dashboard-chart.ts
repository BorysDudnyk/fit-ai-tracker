import { Injectable } from '@angular/core';
import Chart, { ChartConfiguration } from 'chart.js/auto';

@Injectable({ providedIn: 'root' })
export class DashboardChartService {

  createWorkoutChart(ctx: CanvasRenderingContext2D, data: any[]): Chart {
    return new Chart(ctx, this.getWorkoutChartConfig(data) as ChartConfiguration<'line'>);
  }

  createActivityChart(ctx: CanvasRenderingContext2D, data: any[]): Chart {
    return new Chart(ctx, this.getActivityChartConfig(data) as ChartConfiguration<'line'>);
  }

  createMonthlyWorkoutChart(ctx: CanvasRenderingContext2D, data: any[]): Chart {
    return new Chart(ctx, this.getMonthlyWorkoutChartConfig(data) as ChartConfiguration<'line'>);
  }

  createMonthlyActivityChart(ctx: CanvasRenderingContext2D, data: any[]): Chart {
    return new Chart(ctx, this.getMonthlyActivityChartConfig(data) as ChartConfiguration<'line'>);
  }

  private getWorkoutChartConfig(data: any[]) {
    const sorted = data.slice().sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7);
    return {
      type: 'line' as const,
      data: {
        labels: sorted.map(d => new Date(d.date).toLocaleDateString('uk-UA',{day:'2-digit',month:'2-digit'})),
        datasets: [
          { label: 'Спалено калорій', data: sorted.map(d=>d.caloriesBurned||0), borderColor: 'rgba(0,51,102,1)', fill: false },
          { label: 'Тривалість (хв)', data: sorted.map(d=>d.duration||0), borderColor: 'rgba(0,102,51,1)', fill: false }
        ]
      },
      options: { responsive: true, interaction: { mode: 'index', intersect: false } }
    };
  }

  private getActivityChartConfig(data: any[]) {
    const sorted = data.slice().sort((a,b)=> new Date(a.date).getTime()-new Date(b.date).getTime()).slice(-7);
    return {
      type: 'line' as const,
      data: {
        labels: sorted.map(d=> new Date(d.date).toLocaleDateString('uk-UA',{day:'2-digit',month:'2-digit'})),
        datasets: [
          { label:'Спалено калорій', data: sorted.map(d=>d.caloriesBurned||0), borderColor:'rgba(0,51,102,1)', fill:false },
          { label:'Кроки', data: sorted.map(d=>d.steps||0), borderColor:'rgba(0,102,51,1)', fill:false },
          { label:'Дистанція (км)', data: sorted.map(d=>d.distance||0), borderColor:'rgba(102,0,204,1)', fill:false }
        ]
      },
      options: { responsive:true, interaction:{mode:'index',intersect:false}}
    };
  }

  private getMonthlyWorkoutChartConfig(data: any[]) {
    const last30 = data.slice(-30);
    return {
      type:'line' as const,
      data: {
        labels: last30.map(d=> new Date(d.date).toLocaleDateString('uk-UA',{day:'2-digit',month:'2-digit'})),
        datasets: [
          { label:'Спалено калорій', data: last30.map(d=>d.caloriesBurned||0), borderColor:'rgba(0,51,102,1)', fill:false },
          { label:'Тривалість (хв)', data: last30.map(d=>d.duration||0), borderColor:'rgba(0,102,51,1)', fill:false }
        ]
      }
    };
  }

  private getMonthlyActivityChartConfig(data: any[]) {
    const last30 = data.slice(-30);
    return {
      type:'line' as const,
      data: {
        labels: last30.map(d=> new Date(d.date).toLocaleDateString('uk-UA',{day:'2-digit',month:'2-digit'})),
        datasets: [
          { label:'Спалено калорій', data: last30.map(d=>d.caloriesBurned||0), borderColor:'rgba(0,51,102,1)', fill:false },
          { label:'Кроки', data: last30.map(d=>d.steps||0), borderColor:'rgba(0,102,51,1)', fill:false },
          { label:'Дистанція (км)', data: last30.map(d=>d.distance||0), borderColor:'rgba(102,0,204,1)', fill:false }
        ]
      }
    };
  }
}

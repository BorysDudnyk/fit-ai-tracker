import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class DashboardReportService {

  constructor() {}

  generateStatsReport(
    statsData: any,
    lastWorkouts?: any[],
    lastActivities?: any[],
    monthlyWorkouts?: any[],
    monthlyActivities?: any[]
  ) {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    // --- Title ---
    doc.setFontSize(18);
    doc.text('Fitness Report', 105, 20, { align: 'center' });

    let currentY = 35;

    // --- Summary statistics ---
    doc.setFontSize(12);
    doc.text('Summary Statistics:', 14, currentY);
    currentY += 10;
    doc.text(`Calories burned: ${statsData?.totalCaloriesBurned || 0}`, 14, currentY);
    currentY += 10;
    doc.text(`Total distance: ${statsData?.distance || 0} km`, 14, currentY);
    currentY += 10;
    doc.text(`Steps: ${statsData?.steps || 0}`, 14, currentY);
    currentY += 10;
    doc.text(`Total time: ${statsData?.duration || 0} min`, 14, currentY);
    currentY += 10;
    doc.text(`Goals achieved: ${statsData?.achievedGoals || 0}`, 14, currentY);
    currentY += 10;
    doc.text(`Goals not achieved: ${statsData?.notAchievedGoals || 0}`, 14, currentY);
    currentY += 15;

    // --- Last Workouts Table ---
    if (lastWorkouts?.length) {
      doc.setFontSize(14);
      doc.text('Last Workouts', 105, currentY, { align: 'center' });
      currentY += 5;

      autoTable(doc, {
        startY: currentY,
        head: [['Date', 'Calories', 'Duration (min)']],
        body: lastWorkouts.map(w => [
          new Date(w.date).toLocaleDateString('en-GB'),
          String(w.caloriesBurned || 0),
          String(w.duration || 0)
        ]),
        theme: 'grid',
        headStyles: { fillColor: [0, 51, 102], textColor: 255 },
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 }
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    // --- Last Activities Table ---
    if (lastActivities?.length) {
      doc.setFontSize(14);
      doc.text('Last Activities', 105, currentY, { align: 'center' });
      currentY += 5;

      autoTable(doc, {
        startY: currentY,
        head: [['Date', 'Calories', 'Steps', 'Distance (km)']],
        body: lastActivities.map(a => [
          new Date(a.date).toLocaleDateString('en-GB'),
          String(a.caloriesBurned || 0),
          String(a.steps || 0),
          String(a.distance || 0)
        ]),
        theme: 'grid',
        headStyles: { fillColor: [0, 102, 51], textColor: 255 },
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 }
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    // --- Monthly Workouts Table ---
    if (monthlyWorkouts?.length) {
      doc.setFontSize(14);
      doc.text('Monthly Workouts', 105, currentY, { align: 'center' });
      currentY += 5;

      autoTable(doc, {
        startY: currentY,
        head: [['Date', 'Calories', 'Duration (min)']],
        body: monthlyWorkouts.map(w => [
          new Date(w.date).toLocaleDateString('en-GB'),
          String(w.caloriesBurned || 0),
          String(w.duration || 0)
        ]),
        theme: 'grid',
        headStyles: { fillColor: [0, 51, 102], textColor: 255 },
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 }
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    // --- Monthly Activities Table ---
    if (monthlyActivities?.length) {
      doc.setFontSize(14);
      doc.text('Monthly Activities', 105, currentY, { align: 'center' });
      currentY += 5;

      autoTable(doc, {
        startY: currentY,
        head: [['Date', 'Calories', 'Steps', 'Distance (km)']],
        body: monthlyActivities.map(a => [
          new Date(a.date).toLocaleDateString('en-GB'),
          String(a.caloriesBurned || 0),
          String(a.steps || 0),
          String(a.distance || 0)
        ]),
        theme: 'grid',
        headStyles: { fillColor: [0, 102, 51], textColor: 255 },
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 }
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    // --- Save PDF ---
    doc.save('fitness-report.pdf');
  }
}

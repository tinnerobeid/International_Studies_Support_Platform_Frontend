package com.example.ui;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

import com.github.mikephil.charting.charts.BarChart;
import com.github.mikephil.charting.charts.PieChart;
import com.github.mikephil.charting.data.BarData;
import com.github.mikephil.charting.data.BarDataSet;
import com.github.mikephil.charting.data.BarEntry;
import com.github.mikephil.charting.data.PieData;
import com.github.mikephil.charting.data.PieDataSet;
import com.github.mikephil.charting.data.PieEntry;
import com.github.mikephil.charting.utils.ColorTemplate;

import java.util.ArrayList;

public class ResultActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_result);

        BarChart chart = findViewById(R.id.barChart);

        ArrayList<BarEntry> barEntries = new ArrayList<>();
        barEntries.add(new BarEntry(1f, 85f));
        barEntries.add(new BarEntry(2f, 90f));
        barEntries.add(new BarEntry(3f, 96f));
        barEntries.add(new BarEntry(4f, 36f));

        BarDataSet barDataSet = new BarDataSet(barEntries, "Marks");
        barDataSet.setColors(ColorTemplate.MATERIAL_COLORS);
        chart.setData(new BarData(barDataSet));
        chart.animateY(1000);
        chart.invalidate();


        PieChart pieChart = findViewById(R.id.pieChart);

        ArrayList<PieEntry> pieEntries = new ArrayList<>();
        pieEntries.add(new PieEntry(85f, "Math"));
        pieEntries.add(new PieEntry(80f, "Pys"));
        pieEntries.add(new PieEntry(95f, "Chem"));

        PieDataSet pieDataSet = new PieDataSet(pieEntries, "Subjects");
        pieDataSet.setColors(ColorTemplate.JOYFUL_COLORS);
        
        PieData pieData = new PieData(pieDataSet);
        pieChart.setData(pieData);
        pieChart.setCenterText("Subject Distribution");
        pieChart.animateXY(1000, 1000);
        pieChart.invalidate();

    }
}

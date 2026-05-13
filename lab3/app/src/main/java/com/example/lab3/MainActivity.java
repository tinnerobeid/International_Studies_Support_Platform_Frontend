package com.example.lab3;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    EditText etName, etRoll;
    Button btnSubmit;
    TextView txtStatus;

    String savedName = "";
    String savedRoll = "";
    String savedStatus = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        etName = findViewById(R.id.etName);
        etRoll = findViewById(R.id.etRoll);
        btnSubmit = findViewById(R.id.btnSubmit);
        txtStatus = findViewById(R.id.txtStatus);

        if (savedInstanceState != null) {
            savedName = savedInstanceState.getString("name", "");
            savedRoll = savedInstanceState.getString("roll", "");
            savedStatus = savedInstanceState.getString("status", "");

            etName.setText(savedName);
            etRoll.setText(savedRoll);
            txtStatus.setText(savedStatus);
        }

        btnSubmit.setOnClickListener(v -> {
            String name = etName.getText().toString().trim();
            String roll = etRoll.getText().toString().trim();

            String result = "Student Name: " + name + "\nRoll Number: " + roll;
            txtStatus.setText(result);
        });
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);

        outState.putString("name", etName.getText().toString());
        outState.putString("roll", etRoll.getText().toString());
        outState.putString("status", txtStatus.getText().toString());
    }
}

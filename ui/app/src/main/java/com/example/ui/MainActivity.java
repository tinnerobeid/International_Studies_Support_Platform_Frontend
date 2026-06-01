package com.example.ui;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        Button statusBtn = findViewById(R.id.statusBtn);
        TextView txtStatus = findViewById(R.id.txtStatus);
        EditText inputName = findViewById(R.id.inputName);
        EditText inputPhone = findViewById(R.id.inputPhone);
        Button btnProfile = findViewById(R.id.btnProfile);
        CheckBox cb = findViewById(R.id.cbActive);
        Button btnResults = findViewById(R.id.btnResults);

        if (btnProfile != null) {
            btnProfile.setOnClickListener(v -> {
                String name = inputName.getText().toString();
                String phone = inputPhone.getText().toString();

                new AlertDialog.Builder(this)
                        .setTitle("Profile Information")
                        .setMessage("Name: " + name + "\nPhone: " + phone)
                        .setPositiveButton("OK", null)
                        .show();
            });
        }

        if (cb != null) {
            cb.setOnCheckedChangeListener((buttonView, isChecked) -> {
                if (isChecked) {
                    if (txtStatus != null) txtStatus.setText("Status: Active");
                } else {
                    if (txtStatus != null) txtStatus.setText("Status: Inactive");
                }
            });
        }

        if (statusBtn != null) {
            statusBtn.setOnClickListener(v -> {
                Toast.makeText(this, "Status button clicked", Toast.LENGTH_SHORT).show();
            });
        }

        if (btnResults != null) {
            btnResults.setOnClickListener(v -> {
                Intent intent = new Intent(MainActivity.this, ResultActivity.class);
                startActivity(intent);
            });
        }
    }
}

package com.example.assignment2;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import java.util.Locale;

public class MainActivity extends AppCompatActivity {

    private EditText num1, num2;
    private TextView result;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        num1 = findViewById(R.id.num1);
        num2 = findViewById(R.id.num2);
        result = findViewById(R.id.result);

        Button addButton = findViewById(R.id.addButton);
        Button subButton = findViewById(R.id.subButton);
        Button mulButton = findViewById(R.id.mulButton);
        Button divButton = findViewById(R.id.divButton);

        addButton.setOnClickListener(v -> calculate('+'));
        subButton.setOnClickListener(v -> calculate('-'));
        mulButton.setOnClickListener(v -> calculate('*'));
        divButton.setOnClickListener(v -> calculate('/'));
    }

    private void calculate(char operation) {
        String s1 = num1.getText().toString().trim();
        String s2 = num2.getText().toString().trim();

        if (s1.isEmpty() || s2.isEmpty()) {
            Toast.makeText(this, "Please enter both numbers", Toast.LENGTH_SHORT).show();
            return;
        }

        try {
            double number1 = Double.parseDouble(s1);
            double number2 = Double.parseDouble(s2);
            double answer = 0;

            switch (operation) {
                case '+':
                    answer = number1 + number2;
                    break;
                case '-':
                    answer = number1 - number2;
                    break;
                case '*':
                    answer = number1 * number2;
                    break;
                case '/':
                    if (number2 == 0) {
                        result.setText("Cannot divide by zero");
                        return;
                    }
                    answer = number1 / number2;
                    break;
            }

            result.setText(String.format(Locale.getDefault(), "Result = %.2f", answer));
        } catch (NumberFormatException e) {
            Toast.makeText(this, "Invalid input", Toast.LENGTH_SHORT).show();
        }
    }
}
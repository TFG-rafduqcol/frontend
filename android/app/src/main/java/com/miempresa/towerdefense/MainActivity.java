package com.miempresa.towerdefense;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.Toast;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginResult;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "TowerDefenseApp";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        try {
            Log.d(TAG, "Iniciando aplicación Tower Defense");
            super.onCreate(savedInstanceState);
            Log.d(TAG, "Configurando interfaz de usuario");

            // Ocultar la barra de estado y establecer modo pantalla completa
            getWindow().setFlags(
                WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN
            );

            // Ocultar la barra de navegación
            getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
                View.SYSTEM_UI_FLAG_FULLSCREEN
            );
            
            Log.d(TAG, "Configuración de UI completada");
        } catch (Exception e) {
            Log.e(TAG, "Error al iniciar la aplicación", e);
            Toast.makeText(this, "Error al iniciar: " + e.getMessage(), Toast.LENGTH_LONG).show();
        }
    }
    
    @Override
    public void onResume() {
        super.onResume();
        Log.d(TAG, "Aplicación resumida");
    }
    
    @Override
    public void onPause() {
        super.onPause();
        Log.d(TAG, "Aplicación pausada");
    }
    
    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "Aplicación destruida");
    }
}

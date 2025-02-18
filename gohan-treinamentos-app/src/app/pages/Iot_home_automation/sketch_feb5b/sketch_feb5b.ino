#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>

// Configurações WiFi
const char* ssid = "SUA_REDE";
const char* password = "SENHA";

// Definição dos pinos
#define BUTTON_PIN 5
#define ANALOG_PIN 36
#define LED_GREEN 21
#define LED_YELLOW 22
#define LED_RED 23

WebServer server(80);

// Variáveis de estado
float voltage = 0.0;
bool charging = false;
unsigned long lastUpdate = 0;
unsigned long lastBlink = 0;

// HTML + JavaScript
const char HTML[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
    <title>Monitor RC</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <h1>Tensão do Capacitor: <span id="voltage">0.00</span> V</h1>
    <canvas id="myChart" width="400" height="200"></canvas>
    <script>
        const ctx = document.getElementById('myChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Tensão (V)',
                    data: [],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1
                }]
            }
        });

        setInterval(async () => {
            const response = await fetch('/data');
            const data = await response.json();
            
            document.getElementById('voltage').textContent = data.voltage.toFixed(2);
            
            chart.data.labels.push('');
            chart.data.datasets[0].data.push(data.voltage);
            
            if (chart.data.labels.length > 20) {
                chart.data.labels.shift();
                chart.data.datasets[0].data.shift();
            }
            
            chart.update();
        }, 100);
    </script>
</body>
</html>
)rawliteral";

void handleRoot() {
    server.send(200, "text/html", HTML);
}

void handleData() {
    DynamicJsonDocument doc(128);
    doc["voltage"] = voltage;
    String json;
    serializeJson(doc, json);
    server.send(200, "application/json", json);
}

void updateLEDs() {
    unsigned long now = millis();
    
    if (charging) {
        if (voltage >= 3.0) {
            digitalWrite(LED_GREEN, HIGH);
            digitalWrite(LED_YELLOW, LOW);
        } else {
            if (now - lastBlink >= 500) {
                digitalWrite(LED_YELLOW, !digitalRead(LED_YELLOW));
                lastBlink = now;
            }
        }
        digitalWrite(LED_RED, LOW);
    } else {
        if (voltage <= 0.5) {
            digitalWrite(LED_RED, HIGH);
        } else {
            if (now - lastBlink >= 500) {
                digitalWrite(LED_RED, !digitalRead(LED_RED));
                lastBlink = now;
            }
        }
        digitalWrite(LED_GREEN, LOW);
        digitalWrite(LED_YELLOW, LOW);
    }
}

void setup() {
    // Configuração dos pinos
    pinMode(BUTTON_PIN, INPUT_PULLUP);
    pinMode(LED_GREEN, OUTPUT);
    pinMode(LED_YELLOW, OUTPUT);
    pinMode(LED_RED, OUTPUT);

    // Inicialização WiFi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) delay(1000);
    
    // Configuração do servidor
    server.on("/", handleRoot);
    server.on("/data", handleData);
    server.begin();
}

void loop() {
    server.handleClient();
    
    // Leitura do botão com debounce
    charging = !digitalRead(BUTTON_PIN);
    
    // Atualização da tensão
    if (millis() - lastUpdate >= 50) {
        voltage = analogRead(ANALOG_PIN) * 3.3 / 4095.0;
        lastUpdate = millis();
    }
    
    // Controle dos LEDs
    updateLEDs();
}
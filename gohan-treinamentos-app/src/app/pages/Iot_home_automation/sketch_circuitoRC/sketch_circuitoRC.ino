#include <WiFi.h>        // Biblioteca para conexão WiFi
#include <HTTPClient.h>   // Biblioteca para fazer requisições HTTP (para atualizações dinâmicas)
#include <ArduinoJson.h> // Biblioteca para formatar dados em JSON (para atualizações dinâmicas)

// Classe para monitorar o circuito RC e os LEDs
class RCCircuitMonitor {
private:
    // Definição dos pinos
    const int buttonPin;      // Pino digital para o botão
    const int analogPin;      // Pino analógico para a tensão do capacitor
    const int ledGreen;       // Pino para o LED verde
    const int ledYellow;      // Pino para o LED amarelo
    const int ledRed;         // Pino para o LED vermelho

    // Variáveis de estado
    float voltage;            // Tensão atual do capacitor
    bool buttonState;         // Estado atual do botão (pressionado ou não)
    unsigned long previousTime; // Variável para controlar o tempo para piscar os LEDs

    // Constantes
    const float MAX_VOLTAGE = 3.3;    // Tensão máxima do ESP32 (3.3V)
    const float CHARGE_THRESHOLD = 3.0;    // Limiar de tensão para o LED verde (carga completa)
    const float DISCHARGE_THRESHOLD = 0.5;  // Limiar de tensão para o LED vermelho (descarga completa)
    const unsigned long BLINK_INTERVAL = 500; // Intervalo de tempo (ms) para piscar os LEDs

public:
    // Construtor da classe
    RCCircuitMonitor(int btnPin, int anaPin, int greenPin, int yellowPin, int redPin)
        : buttonPin(btnPin), analogPin(anaPin), ledGreen(greenPin),
          ledYellow(yellowPin), ledRed(redPin), voltage(0),
          buttonState(false), previousTime(0) {}

    // Função para inicializar os pinos
    void begin() {
        pinMode(buttonPin, INPUT_PULLUP);  // Configura pino do botão com resistor pull-up interno
        pinMode(ledGreen, OUTPUT);         // Configura pinos dos LEDs como saída
        pinMode(ledYellow, OUTPUT);
        pinMode(ledRed, OUTPUT);
    }

    // Função principal para atualizar o monitoramento
    void update() {
        updateVoltage(); // Lê e atualiza a tensão do capacitor
        updateLEDs();    // Atualiza o estado dos LEDs
    }

    // Função para obter a tensão atual do capacitor
    float getVoltage() const {
        return voltage;
    }

private:
    // Função para ler e atualizar a tensão do capacitor
    void updateVoltage() {
        int rawValue = analogRead(analogPin);        // Lê o valor analógico do pino
        voltage = (rawValue * MAX_VOLTAGE) / 4095.0; // Converte para tensão (0-3.3V)
    }

    // Função para atualizar o estado dos LEDs
    void updateLEDs() {
        unsigned long currentTime = millis();       // Obtém o tempo atual (ms)
        buttonState = !digitalRead(buttonPin);    // Lê o estado do botão (invertido por causa do pull-up)

        if (buttonState) { // Botão pressionado (carregando)
            if (voltage >= CHARGE_THRESHOLD) {
                digitalWrite(ledGreen, HIGH);  // LED verde aceso (carga completa)
                digitalWrite(ledYellow, LOW); // LED amarelo apagado
            } else {
                // Pisca LED amarelo durante o carregamento
                if (currentTime - previousTime >= BLINK_INTERVAL) {
                    previousTime = currentTime;
                    digitalWrite(ledYellow, !digitalRead(ledYellow)); // Inverte o estado do LED
                }
                digitalWrite(ledGreen, LOW); // LED verde apagado
            }
            digitalWrite(ledRed, LOW); // LED vermelho apagado
        } else { // Botão não pressionado (descarregando)
            if (voltage <= DISCHARGE_THRESHOLD) {
                digitalWrite(ledRed, HIGH); // LED vermelho aceso (descarga completa)
            } else {
                // Pisca LED vermelho durante a descarga
                if (currentTime - previousTime >= BLINK_INTERVAL) {
                    previousTime = currentTime;
                    digitalWrite(ledRed, !digitalRead(ledRed)); // Inverte o estado do LED
                }
            }
            digitalWrite(ledGreen, LOW);   // LED verde apagado
            digitalWrite(ledYellow, LOW);  // LED amarelo apagado
        }
    }
};

// Credenciais WiFi (substitua pelas suas)
const char* ssid = "NOME_DA_SUA_REDE_WIFI";
const char* password = "SENHA_DA_SUA_REDE_WIFI";

// Cria o servidor web na porta 80
WebServer server(80);

// Cria o objeto para monitorar o circuito RC (pinos: Botão (D5), Analógico (VP/ADC0), LEDs (D21, D22, D23))
RCCircuitMonitor rcMonitor(5, 36, 21, 22, 23);

// Função para lidar com a página principal ("/")
void handleRoot() {
  String html = R"=====(
<!DOCTYPE html>
<html>
<head>
<title>Monitor RC</title>
<script>
function updateVoltage() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      document.getElementById("voltage").innerHTML = data.voltage + " V";
    }
  };
  xhttp.open("GET", "/data", true);
  xhttp.send();
}

setInterval(updateVoltage, 1000); // Atualiza a cada 1 segundo
</script>
</head>
<body>
<h1>Tensão do Capacitor:</h1>
<p id="voltage">Aguardando dados...</p>
</body>
</html>
)=====";
  server.send(200, "text/html", html);
}

// Função para fornecer os dados da tensão em formato JSON
void handleData() {
  DynamicJsonDocument doc(1024);
  doc["voltage"] = rcMonitor.getVoltage();
  String json;
  serializeJson(doc, json);

  server.send(200, "application/json", json);
}

void setup() {
  Serial.begin(115200);
  rcMonitor.begin();

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando ao WiFi...");
  }
  Serial.println("Conectado ao WiFi!");
  Serial.print("Endereço IP: ");
  Serial.println(WiFi.localIP()); // Imprime o endereço IP para acesso

  server.on("/", handleRoot);
  server.on("/data", handleData);
  server.begin();
}

void loop() {
  rcMonitor.update();
  server.handleClient(); // Lida com as requisições dos clientes web (essencial com WebServer)
}
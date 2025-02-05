// RCCircuitMonitor.h
class RCCircuitMonitor {
private:
    // Pin definitions
    const int buttonPin;      // Digital input for button
    const int analogPin;      // Analog input for capacitor voltage
    const int ledGreen;       // Output for green LED
    const int ledYellow;      // Output for yellow LED
    const int ledRed;         // Output for red LED
    
    // State variables
    float voltage;
    bool buttonState;
    unsigned long previousTime;
    
    // Constants
    const float MAX_VOLTAGE = 3.3;    // ESP32 operates at 3.3V
    const float CHARGE_THRESHOLD = 3.0;
    const float DISCHARGE_THRESHOLD = 0.5;
    const unsigned long BLINK_INTERVAL = 500; // LED blink interval in ms
    
    // Private methods
    void updateVoltage();
    void updateLEDs();
    
public:
    RCCircuitMonitor(int btnPin, int anaPin, int greenPin, int yellowPin, int redPin);
    void begin();
    void update();
    float getVoltage() const { return voltage; }
};

// RCCircuitMonitor.cpp
#include "RCCircuitMonitor.h"
#include <Arduino.h>

RCCircuitMonitor::RCCircuitMonitor(int btnPin, int anaPin, int greenPin, int yellowPin, int redPin)
    : buttonPin(btnPin), analogPin(anaPin), ledGreen(greenPin), 
      ledYellow(yellowPin), ledRed(redPin), voltage(0), 
      buttonState(false), previousTime(0) {}

void RCCircuitMonitor::begin() {
    pinMode(buttonPin, INPUT_PULLDOWN);
    pinMode(ledGreen, OUTPUT);
    pinMode(ledYellow, OUTPUT);
    pinMode(ledRed, OUTPUT);
}

void RCCircuitMonitor::updateVoltage() {
    // ESP32 ADC has 12-bit resolution (0-4095)
    int rawValue = analogRead(analogPin);
    voltage = (rawValue * MAX_VOLTAGE) / 4095.0;
}

void RCCircuitMonitor::updateLEDs() {
    unsigned long currentTime = millis();
    buttonState = digitalRead(buttonPin);
    
    if (buttonState) { // Charging
        if (voltage >= CHARGE_THRESHOLD) {
            digitalWrite(ledGreen, HIGH);
            digitalWrite(ledYellow, LOW);
        } else {
            if (currentTime - previousTime >= BLINK_INTERVAL) {
                previousTime = currentTime;
                digitalWrite(ledYellow, !digitalRead(ledYellow));
            }
            digitalWrite(ledGreen, LOW);
        }
        digitalWrite(ledRed, LOW);
    } else { // Discharging
        if (voltage <= DISCHARGE_THRESHOLD) {
            digitalWrite(ledRed, HIGH);
        } else {
            if (currentTime - previousTime >= BLINK_INTERVAL) {
                previousTime = currentTime;
                digitalWrite(ledRed, !digitalRead(ledRed));
            }
        }
        digitalWrite(ledGreen, LOW);
        digitalWrite(ledYellow, LOW);
    }
}

void RCCircuitMonitor::update() {
    updateVoltage();
    updateLEDs();
}

// WebServer.h
class RCWebServer {
private:
    WebServer server;
    RCCircuitMonitor& rcMonitor;
    
public:
    RCWebServer(RCCircuitMonitor& monitor);
    void begin(const char* ssid, const char* password);
    void handleClient();
    
private:
    void handleRoot();
    void handleData();
};

// main.ino
#include <WiFi.h>
#include <WebServer.h>
#include "RCCircuitMonitor.h"
#include "WebServer.h"

// Pin definitions
const int BUTTON_PIN = 12;
const int ANALOG_PIN = 36;  //! CHANGE here com a placa eletronica
const int LED_GREEN = 25;
const int LED_YELLOW = 26;
const int LED_RED = 27;

// WiFi credentials
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

RCCircuitMonitor rcMonitor(BUTTON_PIN, ANALOG_PIN, LED_GREEN, LED_YELLOW, LED_RED);
RCWebServer webServer(rcMonitor);

void setup() {
    Serial.begin(115200);
    rcMonitor.begin();
    webServer.begin(ssid, password);
}

void loop() {
    rcMonitor.update();
    webServer.handleClient();
}
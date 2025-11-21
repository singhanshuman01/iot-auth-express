#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

const int relayPin[2] = {D4, D5};
const char *ssid = "wifi_name";
const char *password = "wifi_password";
int32_t channel = 6;
const char *api_key = "567cc3bf97d674fb3a21c1b962e8a747c20c4cd3bb052e210e9e835d04ab15d9";
// const char *expressServerURL;

ESP8266WebServer server(80);
const char *headerKeys[] = {"X-api-key"};

typedef struct
{
    uint8_t stat;
    uint8_t uid;
} relayUsed;

relayUsed r[2] = {{0, 0}, {0, 0}};

const char *sendPage = "<html><head><title>Unauthorized</title></head><body><h1>You ain't authorized to make this request nigga!!</h1></body></html>";
bool auth()
{
    if (!server.hasHeader("X-api-key")){
        server.send(401, "text/html", sendPage);
        return false;
    }
    if (server.header("X-api-key") != api_key){
        server.send(403, "text/html", sendPage);
        return false;
    }
    return true;
}

void relayOn();
void relayOff();
void sendStatus(void);

void setup()
{
    Serial.begin(9600);
    pinMode(relayPin[0], OUTPUT);
    pinMode(relayPin[1], OUTPUT);
    digitalWrite(relayPin[0], LOW);
    digitalWrite(relayPin[1], LOW);

    // Connect to Wi-Fi
    WiFi.begin(ssid, password, channel);
    unsigned long startAttemptTime = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 20000)
    { // 20-second timeout
        delay(500);
        Serial.print(".");
    }
    if (WiFi.status() == WL_CONNECTED)
    {
        Serial.println("\nConnected to Wi-Fi!");
        Serial.print("ESP IP Address: ");
        Serial.println(WiFi.localIP());
    }
    else
    {
        Serial.println("\nFailed to connect to Wi-Fi!");
        return;
    }
    if (MDNS.begin("esp8266"))
        Serial.println("MDNS responder started");

    // Define routes
    server.collectHeaders(headerKeys, 1);
    server.on("/", home);
    server.on("/relay_on", HTTP_POST, relayOn);
    server.on("/relay_off", HTTP_POST, relayOff);
    server.on("/status", HTTP_GET, sendStatus);
    server.onNotFound(notfound);

    server.begin();
    Serial.println("Server started");
}

void loop()
{
    server.handleClient();
    MDNS.update();
}

void home()
{
    char page[400];
    sprintf(page, "<html>\
        <head>\
        <title>ESP HOME</title>\
        </head>\
        <body>\
        <h1> Hey, If you see this page, yeah esp web server works</h1>\
        </body>\
        </html>\
    ");
    server.send(200, "text/html", page);
}

void relayOn()
{
    if (!auth())
    {
        return;
    }
    if (!server.hasArg("relay") || !server.hasArg("uid"))
    {
        server.send(400, "application/json", "{\"error\":\"missing parameters\"}");
        return;
    }
    int relayNum = server.arg("relay").toInt();
    int uid = server.arg("uid").toInt();
    if (relayNum < 0 || relayNum > 1)
    {

        server.send(400, "application/json", "{\"error\":\"wrong relay pin\"}");
        return;
    }
    digitalWrite(relayPin[relayNum], HIGH);
    r[relayNum].stat = 1;
    r[relayNum].uid = uid;
    server.send(200, "application/json", "{\"status\": \"Charging\"}");
}
void relayOff()
{
    if(!auth()) return;
    if(!server.hasArg("relay")){
        server.send(400, "application/json", "{\"error\":\"missing relay param\"}");
        return;
    }
    int relayNum = server.arg("relay").toInt();
    if (relayNum == 0 || relayNum == 1)
    {
        digitalWrite(relayPin[relayNum], LOW);
        r[relayNum].stat = 0;
        r[relayNum].uid = NULL;
        server.send(200, "application/json", "{\"status\": \"IDLE\"}");
        return;
    }
    server.send(400, "application/json", "{\"error\":\"wrong relay pin\"}");
}
void sendStatus(void)
{
    if (!auth())return;
    String json = "{\"relay0\":{\"state\":\"";
    json += (r[0].stat == 1) ? "ACTIVE" : "IDLE";
    json += "\",\"uid\":" + String(r[0].uid) + "},";
    json += "\"relay1\":{\"state\":\"";
    json += (r[1].stat == 1) ? "ACTIVE" : "IDLE";
    json += "\",\"uid\":" + String(r[1].uid) + "}}";
    
    server.send(200, "application/json", json);
}

void notfound()
{
    String txt = "<html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>Document</title></head><body><h1>No such route nigga</h1></body></html>";
    server.send(404, "text/html", txt);
}
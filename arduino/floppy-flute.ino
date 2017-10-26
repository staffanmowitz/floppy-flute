int pushButton1 = 2;
int pushButton2 = 4;

int sensorPin = A0;   
int sensorValue = 0; 
float Vout=0;
float P=0;

void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
 
  pinMode(pushButton1, INPUT);
  pinMode(pushButton2, INPUT);
}

void loop() {
    int i=0;
    int sum=0;
    int offset=0;
    for(i=0;i<10;i++)
    {
         sensorValue = analogRead(sensorPin)-512;
         sum+=sensorValue;
    }
    offset=sum/10.0;
    while(1)
    {
       sensorValue = analogRead(sensorPin)-offset; 
       Vout=(5*sensorValue)/1024.0;
       P=Vout-2.5;
       
       Serial.print("Blow: " );
       Serial.print(P*1000);
       Serial.print(",");
       checkButtons();
       delay(1);
    }
}

void checkButtons() {
  int button1State = digitalRead(pushButton1);
  int button2State = digitalRead(pushButton2);

   if (button1State == 0 & button2State == 0) {
    Serial.println("Button: 0");
  }

  if (button1State == 1 & button2State == 1) {
    Serial.println("Button: 0");
  }

  if (button1State == 1 & button2State == 0) {
    Serial.println("Button: 1");
  }

  if (button1State == 0 & button2State == 1) {
    Serial.println("Button: -1");
  }
}


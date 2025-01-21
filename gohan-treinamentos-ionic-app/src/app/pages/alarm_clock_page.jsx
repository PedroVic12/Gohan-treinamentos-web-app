import React, { useEffect, useState, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
} from '@ionic/react';

function useUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const upload = async (input) => {
    try {
      setLoading(true);
      const response = await fetch(`${window.location.origin}/api/upload`, {
        method: 'POST',
        body: input,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return [upload, { loading, error }];
}

function AlarmeClockPage() {
  const [time, setTime] = useState("");
  const [alarms, setAlarms] = useState([]);
  const [upload, { loading }] = useUpload();
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
        const hoje =  new Date();
        const datalHora = hoje.toLocaleTimeString("pt-BR", {
            
        })

        console.log(hoje,datalHora)
      const date = new Date('2025-01-21T13:24:52-03:00'); // hora local fornecida
      const currentTime = date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTime(currentTime);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const playAlarm = (soundUrl) => {
    if (audioRef.current) {
      audioRef.current.src = soundUrl;
      audioRef.current.play();
    }
  };

  const handleSoundUpload = async (file) => {
    const { url, error } = await upload({ file });
    if (error) {
      setError(error);
      return null;
    }
    return url;
  };

  const addAlarm = async (hour, minute, second, file) => {
    const soundUrl = await handleSoundUpload(file);
    if (!soundUrl) return;

    const newAlarm = {
      id: Date.now(),
      time: `${hour}:${minute}:${second}`,
      soundUrl,
      isActive: true,
      soundName: file.name,
    };

    setAlarms((prev) => [...prev, newAlarm]);
  };

  const toggleAlarm = (id) => {
    setAlarms((prev) =>
      prev.map((alarm) =>
        alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm,
      ),
    );
  };

  const removeAlarm = (id) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
  };

  const stopAllAlarms = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonTitle>{time}</IonTitle>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel>Novo Alarme</IonLabel>
        </IonItem>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            addAlarm(
              formData.get("hour"),
              formData.get("minute"),
              formData.get("second"),
              formData.get("sound"),
            );
            e.target.reset();
          }}
        >
          <IonItem>
            <IonSelect name="hour" placeholder="Hora">
              {[...Array.from({ length: 24 })].map((_, i) => (
                <IonSelectOption key={i} value={i.toString().padStart(2, "0")}>
                  {i.toString().padStart(2, "0")}
                </IonSelectOption>
              ))}
            </IonSelect>
            <IonSelect name="minute" placeholder="Minuto">
              {[...Array.from({ length: 60 })].map((_, i) => (
                <IonSelectOption key={i} value={i.toString().padStart(2, "0")}>
                  {i.toString().padStart(2, "0")}
                </IonSelectOption>
              ))}
            </IonSelect>
            <IonSelect name="second" placeholder="Segundo">
              {[...Array.from({ length: 60 })].map((_, i) => (
                <IonSelectOption key={i} value={i.toString().padStart(2, "0")}>
                  {i.toString().padStart(2, "0")}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonInput
              type="file"
              name="sound"
              accept=".mp3"
              required
            />
          </IonItem>

          <IonButton type="submit" disabled={loading}>
            {loading ? "Carregando..." : "Adicionar Alarme"}
          </IonButton>
        </form>

        {alarms.map((alarm) => (
          <IonItem key={alarm.id}>
            <IonLabel>
              <h2>{alarm.time}</h2>
              <p>{alarm.soundName}</p>
            </IonLabel>
            <IonButton onClick={() => toggleAlarm(alarm.id)}>
              {alarm.isActive ? "Ativo" : "Inativo"}
            </IonButton>
            <IonButton onClick={() => removeAlarm(alarm.id)} color="danger">
              Remover
            </IonButton>
          </IonItem>
        ))}

        {error && <div className="error-message">{error}</div>}

        <audio ref={audioRef} />

        {alarms.length > 0 && (
          <IonButton onClick={stopAllAlarms} color="danger">
            Parar Todos os Alarmes
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  );
}

export default AlarmeClockPage;
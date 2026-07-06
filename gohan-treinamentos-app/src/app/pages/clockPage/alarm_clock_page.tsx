import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonToggle,
  IonIcon,
  IonList,
  IonListHeader,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from '@ionic/react';
import { trashOutline, volumeMuteOutline, volumeHighOutline } from 'ionicons/icons';
import {
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  ListItemSecondaryAction,
  Slide,
  Tabs,
  Tab,
  Card,
  CardContent,
  TextField,
  IconButton
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Helper to format remaining milliseconds to MM:SS
const formatPomoTime = (ms: number) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

function AlarmeClockPage() {
  const [activeTab, setActiveTab] = useState(0); // 0 = Pomodoro, 1 = Alarmes

  // --- ALARME CLOCK STATES ---
  const [time, setTime] = useState("");
  const [alarms, setAlarms] = useState<any[]>(() => {
    const storedAlarms = localStorage.getItem('alarms');
    return storedAlarms ? JSON.parse(storedAlarms) : [];
  });
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeAlarmId, setActiveAlarmId] = useState<number | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');

  // --- POMODORO STATES (PomoFocus-style with Background Persistence) ---
  const [pomoMode, setPomoMode] = useState<'work' | 'short' | 'long'>('work');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('gohan_pomo_settings');
    return saved ? JSON.parse(saved) : { work: 25, short: 5, long: 15 };
  });

  const [pomoIsRunning, setPomoIsRunning] = useState<boolean>(() => {
    return localStorage.getItem('gohan_pomo_running') === 'true';
  });

  const [pomoTimeLeft, setPomoTimeLeft] = useState<number>(() => {
    const savedTime = localStorage.getItem('gohan_pomo_time_left');
    if (savedTime) return parseInt(savedTime, 10);
    return 25 * 60 * 1000; // Default 25m in ms
  });

  const pomoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- ALARME METHODS ---
  const playAlarm = useCallback((soundUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = soundUrl;
      audioRef.current.play().catch(e => console.error("Falha ao tocar o áudio:", e));
    }
  }, []);

  const stopAllAlarms = useCallback((alarmId: number | null) => {
    setActiveAlarmId(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAlarms((prevAlarms: any[]) =>
        prevAlarms.map(alarm =>
          alarm.id === alarmId ? { ...alarm, isActive: false } : alarm
        )
      );
    }
  }, []);

  // Save settings
  useEffect(() => {
    localStorage.setItem('gohan_pomo_settings', JSON.stringify(settings));
  }, [settings]);

  // Sync mode duration to timeLeft when NOT running
  useEffect(() => {
    if (!pomoIsRunning) {
      const ms = settings[pomoMode] * 60 * 1000;
      setPomoTimeLeft(ms);
      localStorage.setItem('gohan_pomo_time_left', ms.toString());
    }
  }, [pomoMode, settings, pomoIsRunning]);

  // Persistent Pomodoro timer background synchronization logic
  useEffect(() => {
    localStorage.setItem('gohan_pomo_running', pomoIsRunning.toString());
    
    if (pomoIsRunning) {
      // Calculate/Set expiration timestamp
      let expireTime = parseInt(localStorage.getItem('gohan_pomo_expire_time') || '0', 10);
      if (!expireTime || expireTime <= Date.now()) {
        expireTime = Date.now() + pomoTimeLeft;
        localStorage.setItem('gohan_pomo_expire_time', expireTime.toString());
      }

      const updatePomo = () => {
        const left = Math.max(0, expireTime - Date.now());
        setPomoTimeLeft(left);
        localStorage.setItem('gohan_pomo_time_left', left.toString());

        if (left <= 0) {
          setPomoIsRunning(false);
          localStorage.removeItem('gohan_pomo_expire_time');
          
          // Play notification beep sound
          try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            osc.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
            osc.start();
            osc.stop(audioCtx.currentTime + 0.5);
          } catch (e) {
            console.log("Audio API blocked by browser");
          }
          
          alert(`⏰ Pomodoro [${pomoMode === 'work' ? 'Foco' : 'Descanso'}] concluído!`);
        }
      };

      updatePomo();
      pomoTimerRef.current = setInterval(updatePomo, 500);
    } else {
      if (pomoTimerRef.current) clearInterval(pomoTimerRef.current);
      localStorage.removeItem('gohan_pomo_expire_time');
      localStorage.setItem('gohan_pomo_time_left', pomoTimeLeft.toString());
    }

    return () => {
      if (pomoTimerRef.current) clearInterval(pomoTimerRef.current);
    };
  }, [pomoIsRunning]);

  // Clock time update & alarms listener
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setTime(currentTime);

      alarms.forEach((alarm: any) => {
        if (alarm.isActive && alarm.time === currentTime && alarm.id !== activeAlarmId) {
          setActiveAlarmId(alarm.id);
          playAlarm(alarm.soundUrl);
        }
      });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [alarms, activeAlarmId, playAlarm]);

  // Save alarms
  useEffect(() => {
    localStorage.setItem('alarms', JSON.stringify(alarms));
  }, [alarms]);

  const addAlarm = useCallback(async (hour: any, minute: any, file: any) => {
    if (!hour || !minute || !file) {
      setError("Por favor, selecione hora, minuto e um arquivo de som.");
      return;
    }

    const soundUrl = URL.createObjectURL(file);
    const newAlarm = {
      id: Date.now(),
      time: `${hour}:${minute}`,
      soundUrl,
      isActive: true,
      soundName: file.name,
    };

    setAlarms((prev: any[]) => [...prev, newAlarm]);
    setError(null);
    setSelectedFileName('');
  }, []);

  const toggleAlarm = useCallback((id: number) => {
    setAlarms((prev: any[]) =>
      prev.map((alarm) =>
        alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm,
      ),
    );
    setActiveAlarmId(null);
    stopAllAlarms(activeAlarmId);
  }, [stopAllAlarms, activeAlarmId]);

  const removeAlarm = useCallback((id: number) => {
    setAlarms((prev: any[]) => prev.filter((alarm) => alarm.id !== id));
    setActiveAlarmId(null);
    stopAllAlarms(activeAlarmId);
  }, [stopAllAlarms, activeAlarmId]);

  const handleStartPausePomo = () => {
    setPomoIsRunning(!pomoIsRunning);
  };

  const handleResetPomo = () => {
    setPomoIsRunning(false);
    const ms = settings[pomoMode] * 60 * 1000;
    setPomoTimeLeft(ms);
    localStorage.setItem('gohan_pomo_time_left', ms.toString());
    localStorage.removeItem('gohan_pomo_expire_time');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
              <Typography variant="h5" fontWeight="bold">{time}</Typography>
            </Box>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        
        {/* Navigation Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          centered
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab label="🎯 Foco Pomodoro" />
          <Tab label="⏰ Meus Alarmes" />
        </Tabs>

        <Container maxWidth="sm">
          {activeTab === 0 ? (
            // TAB 0: POMODORO TIMER
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, mt: 1 }}>
              
              {/* Pomodoro Mode Selection Buttons */}
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', width: '100%' }}>
                <Button
                  size="small"
                  variant={pomoMode === 'work' ? 'contained' : 'outlined'}
                  onClick={() => setPomoMode('work')}
                  sx={{ borderRadius: 4, px: 2, py: 0.5, fontWeight: 'bold' }}
                >
                  Foco
                </Button>
                <Button
                  size="small"
                  variant={pomoMode === 'short' ? 'contained' : 'outlined'}
                  onClick={() => setPomoMode('short')}
                  sx={{ borderRadius: 4, px: 2, py: 0.5, fontWeight: 'bold' }}
                >
                  Pausa Curta
                </Button>
                <Button
                  size="small"
                  variant={pomoMode === 'long' ? 'contained' : 'outlined'}
                  onClick={() => setPomoMode('long')}
                  sx={{ borderRadius: 4, px: 2, py: 0.5, fontWeight: 'bold' }}
                >
                  Pausa Longa
                </Button>
              </Box>

              {/* Big Timer Card */}
              <Card sx={{ width: '100%', borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center', p: 3, bgcolor: 'background.paper' }}>
                <CardContent>
                  <Typography variant="h2" fontWeight="black" color="primary" sx={{ mb: 2, letterSpacing: 2 }}>
                    {formatPomoTime(pomoTimeLeft)}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {pomoMode === 'work' ? 'Estudando' : 'Descansando'}
                  </Typography>

                  {/* Play/Pause/Reset Controls */}
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      color={pomoIsRunning ? 'warning' : 'primary'}
                      onClick={handleStartPausePomo}
                      startIcon={pomoIsRunning ? <PauseIcon /> : <PlayArrowIcon />}
                      sx={{ borderRadius: 3, fontWeight: 'bold', px: 3 }}
                    >
                      {pomoIsRunning ? 'Pausar' : 'Começar'}
                    </Button>
                    <IconButton color="error" onClick={handleResetPomo}>
                      <RefreshIcon />
                    </IconButton>
                    <IconButton color="inherit" onClick={() => setShowSettings(!showSettings)}>
                      <SettingsIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>

              {/* Settings Card */}
              {showSettings && (
                <Card sx={{ width: '100%', borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>⚙️ Customizar Tempos (Minutos)</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        type="number"
                        size="small"
                        label="Foco"
                        value={settings.work}
                        onChange={(e) => setSettings({ ...settings, work: Math.max(1, parseInt(e.target.value) || 1) })}
                      />
                      <TextField
                        type="number"
                        size="small"
                        label="P. Curta"
                        value={settings.short}
                        onChange={(e) => setSettings({ ...settings, short: Math.max(1, parseInt(e.target.value) || 1) })}
                      />
                      <TextField
                        type="number"
                        size="small"
                        label="P. Longa"
                        value={settings.long}
                        onChange={(e) => setSettings({ ...settings, long: Math.max(1, parseInt(e.target.value) || 1) })}
                      />
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Study Quote */}
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color="success" />
                <Typography variant="body2" color="text.secondary">
                  "O segredo para vencer o TDAH é focar em pequenos blocos de tempo."
                </Typography>
              </Box>

            </Box>
          ) : (
            // TAB 1: EXISTING ALARM CLOCK
            <Box>
              <Card sx={{ borderRadius: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    ⏰ Novo Alarme
                  </Typography>
                  <form
                    onSubmit={(e: any) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      addAlarm(
                        formData.get("hour"),
                        formData.get("minute"),
                        formData.get("sound"),
                      );
                      e.target.reset();
                      setSelectedFileName('');
                    }}
                  >
                    <Box display="flex" gap={2} alignItems="center" mb={2}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="hour-label">Hora</InputLabel>
                        <Select labelId="hour-label" id="hour-select" name="hour" label="Hora" defaultValue="08" required>
                          {[...Array.from({ length: 24 })].map((_, i) => (
                            <MenuItem key={i} value={i.toString().padStart(2, "0")}>
                              {i.toString().padStart(2, "0")}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="minute-label">Minuto</InputLabel>
                        <Select labelId="minute-label" id="minute-select" name="minute" label="Minuto" defaultValue="00" required>
                          {[...Array.from({ length: 60 })].map((_, i) => (
                            <MenuItem key={i} value={i.toString().padStart(2, "0")}>
                              {i.toString().padStart(2, "0")}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    <Box mb={2}>
                      <Button component="label" variant="outlined" fullWidth>
                        Selecionar Som do Alarme (.mp3)
                        <input
                          type="file"
                          name="sound"
                          accept=".mp3,audio/*"
                          required
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files ? e.target.files[0] : null;
                            setSelectedFileName(file ? file.name : '');
                          }}
                        />
                      </Button>
                      {selectedFileName && (
                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'success.main', mt: 1 }}>
                          Selecionado: {selectedFileName}
                        </Typography>
                      )}
                    </Box>

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ fontWeight: 'bold' }}>
                      Adicionar Alarme
                    </Button>
                    {error && <Typography color="error" align="center" sx={{ mt: 1 }}>{error}</Typography>}
                  </form>
                </CardContent>
              </Card>

              {/* Alarms list */}
              <IonList>
                <IonListHeader lines="full">
                  <IonLabel>Meus Alarmes</IonLabel>
                </IonListHeader>

                {alarms.map((alarm: any) => (
                  <Slide key={alarm.id} direction="up" in={true} mountOnEnter unmountOnExit>
                    <IonItemSliding>
                      <IonItem sx={{ borderLeft: '5px solid #3b82f6', mb: 1, borderRadius: 2 }}>
                        <IonLabel>
                          <Typography variant="h5" fontWeight="bold">{alarm.time}</Typography>
                          <Typography variant="caption" color="text.secondary">Som: {alarm.soundName}</Typography>
                        </IonLabel>
                        <ListItemSecondaryAction>
                          <IonToggle
                            checked={alarm.isActive}
                            onIonChange={() => toggleAlarm(alarm.id)}
                            slot="end"
                          />
                        </ListItemSecondaryAction>
                      </IonItem>
                      <IonItemOptions side="end">
                        <IonItemOption color="danger" onClick={() => removeAlarm(alarm.id)}>
                          <IonIcon icon={trashOutline} slot="icon-only" />
                        </IonItemOption>
                      </IonItemOptions>
                    </IonItemSliding>
                  </Slide>
                ))}
              </IonList>

              <audio ref={audioRef} />

              {alarms.length > 0 && activeAlarmId && (
                <Button
                  onClick={() => stopAllAlarms(activeAlarmId)}
                  variant="contained"
                  color="error"
                  startIcon={<IonIcon icon={volumeMuteOutline} />}
                  sx={{ mt: 2, fontWeight: 'bold' }}
                  fullWidth
                >
                  Parar Alarme
                </Button>
              )}
            </Box>
          )}
        </Container>

      </IonContent>
    </IonPage>
  );
}

export default AlarmeClockPage;

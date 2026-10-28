import React, { useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import type { WorkoutVideo, VideoCategory } from '../types/video.types';
import {
  clearAllGohanData,
  exportExcelWorkbook,
  exportJsonBackup,
  exportPdfPrintable,
  importExcelFile,
  importJsonBackup,
} from '../services/spreadsheet.service';

type Props = {
  videos: WorkoutVideo[];
  onVideosChange: (videos: WorkoutVideo[]) => void;
  onDataReloaded: () => void;
};

export const DataHubView: React.FC<Props> = ({ videos, onVideosChange, onDataReloaded }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'merge' | 'replace'>('merge');
  const [msg, setMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    title: '',
    youtubeUrl: '',
    category: 'push' as VideoCategory,
    label: 'Geral',
  });

  const handleFile = async (file: File) => {
    setBusy(true);
    setMsg(null);
    try {
      const isJson = file.name.toLowerCase().endsWith('.json');
      const result = isJson ? await importJsonBackup(file) : await importExcelFile(file, mode);
      if (result.ok) {
        setMsg({ type: 'success', text: result.summary });
        onDataReloaded();
      } else {
        setMsg({ type: 'error', text: result.error });
      }
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const addVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.youtubeUrl.trim()) return;
    const next: WorkoutVideo = {
      id: `v-${Date.now()}`,
      title: form.title.trim(),
      youtubeUrl: form.youtubeUrl.trim(),
      category: form.category,
      label: form.label.trim() || 'Geral',
    };
    onVideosChange([...videos, next]);
    setForm({ title: '', youtubeUrl: '', category: form.category, label: 'Geral' });
    setMsg({ type: 'success', text: 'Vídeo adicionado à biblioteca' });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" fontWeight="black" align="center" color="primary">
        Dados · Excel / PDF / Backup
      </Typography>

      {msg && (
        <Alert severity={msg.type} onClose={() => setMsg(null)}>
          {msg.text}
        </Alert>
      )}

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography fontWeight="bold" gutterBottom>
            Exportar
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button startIcon={<DownloadIcon />} variant="contained" onClick={exportExcelWorkbook} sx={{ minHeight: 48 }}>
              Excel (.xlsx) — treinos + fichas + vídeos
            </Button>
            <Button startIcon={<PictureAsPdfIcon />} variant="outlined" onClick={exportPdfPrintable} sx={{ minHeight: 48 }}>
              PDF (imprimir / salvar)
            </Button>
            <Button startIcon={<DownloadIcon />} variant="outlined" onClick={exportJsonBackup} sx={{ minHeight: 48 }}>
              Backup JSON completo
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography fontWeight="bold" gutterBottom>
            Importar planilhas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Abas sugeridas: <b>Exercicios</b> (category, treino, name, sets, reps, difficulty, youtubeUrl),{' '}
            <b>Fichas</b> (checklistName, item), <b>Videos</b> (title, category, label, youtubeUrl).
          </Typography>
          <RadioGroup row value={mode} onChange={(_, v) => setMode(v as 'merge' | 'replace')} sx={{ mb: 1 }}>
            <FormControlLabel value="merge" control={<Radio />} label="Mesclar" />
            <FormControlLabel value="replace" control={<Radio />} label="Substituir" />
          </RadioGroup>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
            }}
          />
          <Button
            startIcon={<UploadFileIcon />}
            variant="contained"
            color="secondary"
            fullWidth
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            sx={{ minHeight: 48 }}
          >
            {busy ? 'Importando…' : 'Escolher Excel / CSV / JSON'}
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography fontWeight="bold" gutterBottom>
            Form · novo vídeo
          </Typography>
          <Box component="form" onSubmit={addVideo} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField label="Título" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required fullWidth size="small" />
            <TextField label="YouTube URL" value={form.youtubeUrl} onChange={(e) => setForm((p) => ({ ...p, youtubeUrl: e.target.value }))} required fullWidth size="small" />
            <TextField
              label="Categoria (push, pull, legs, abs, mobility, hiit, tips)"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as VideoCategory }))}
              fullWidth
              size="small"
            />
            <TextField label="Label" value={form.label} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))} fullWidth size="small" />
            <Button type="submit" variant="contained" sx={{ minHeight: 44 }}>
              Salvar vídeo
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            Biblioteca: {videos.length} vídeos no localStorage
          </Typography>
        </CardContent>
      </Card>

      <Button
        startIcon={<RestartAltIcon />}
        color="error"
        variant="outlined"
        onClick={() => {
          if (confirm('Limpar dados Gohan do localStorage e recarregar padrões?')) {
            clearAllGohanData();
            window.location.reload();
          }
        }}
        sx={{ minHeight: 44 }}
      >
        Reset (recarregar app)
      </Button>
    </Box>
  );
};

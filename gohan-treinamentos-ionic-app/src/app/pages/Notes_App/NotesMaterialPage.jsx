import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonSearchbar, IonSelect, IonSelectOption } from '@ionic/react';
import { add } from 'ionicons/icons';
import Container from '@mui/material/Container';
import { Card, CardActionArea, CardContent, CardMedia, CardActions, Button, Typography, Grid, Chip, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles({
  media: {
    height: 140,
  },
});

function CustomCard({ note, onDelete, onEdit }) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardActionArea onClick={() => setExpanded(!expanded)}>
        <CardMedia
          className={classes.media}
          image={note.image}
          title={note.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {note.title}
          </Typography>
          {note.categories.map((category, index) => (
            <Chip key={index} label={category} clickable />
          ))}
          {expanded && (
            <Typography variant="body2" color="text.secondary">
              <ReactMarkdown>{note.body}</ReactMarkdown>
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={() => onEdit(note.id)}>
          Edit
        </Button>
        <Button size="small" color="primary" onClick={() => onDelete(note.id)}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

function NotesMaterialPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    setNotes(fetchNotes());
    setLoading(false);
  }, []);

  const fetchNotes = () => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  };

  const saveNotes = (notes) => {
    localStorage.setItem('notes', JSON.stringify(notes));
  };

  const addNewNote = () => {
    const newNote = {
      id: uuidv4(),
      title: 'New Note',
      categories: ['General'],
      body: 'This is a new note.',
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${Math.floor(Math.random() * 100) + 1}.png`,
    };
    const newNotes = [...notes, newNote];
    saveNotes(newNotes);
    setNotes(newNotes);
  };

  const editNote = (id) => {
    const updatedBody = prompt('Edit Note:', notes.find(note => note.id === id).body);
    if (updatedBody !== null) {
      const newNotes = notes.map(note => (note.id === id ? { ...note, body: updatedBody } : note));
      saveNotes(newNotes);
      setNotes(newNotes);
    }
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter(note => note.id !== id);
    saveNotes(newNotes);
    setNotes(newNotes);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory ? note.categories.includes(selectedCategory) : true)
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Notes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSearchbar value={searchQuery} onIonChange={e => setSearchQuery(e.detail.value)} />
        <IonSelect value={selectedCategory} placeholder="Select Category" onIonChange={e => setSelectedCategory(e.detail.value)}>
          <IonSelectOption value="">All</IonSelectOption>
          {Array.from(new Set(notes.flatMap(note => note.categories))).map((category, index) => (
            <IonSelectOption key={index} value={category}>{category}</IonSelectOption>
          ))}
        </IonSelect>
        <Container>
          <Grid container spacing={3}>
            {filteredNotes.map(note => (
              <Grid item md={4} sm={6} xs={12} key={note.id}>
                <CustomCard note={note} onDelete={deleteNote} onEdit={editNote} />
              </Grid>
            ))}
          </Grid>
        </Container>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={addNewNote}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}

export default NotesMaterialPage;
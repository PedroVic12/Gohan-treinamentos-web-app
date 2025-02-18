import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonSearchbar, IonSelect, IonSelectOption, IonModal, IonButton, IonLabel, IonItem, IonInput, IonTextarea } from '@ionic/react';
import { add } from 'ionicons/icons';
import Container from '@mui/material/Container';
import { Card, CardActionArea, CardContent, CardMedia, CardActions, Button, Typography, Grid, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';
import SidebarMenu from '../../widgets/side_menu';

const useStyles = makeStyles({
  media: {
    height: 140,
  },
});

function CustomCard({ note, onDelete, onEdit }) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  return (
    <Card onClick={() => setExpanded(!expanded)}>
      <CardActionArea>
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
        <Button size="small" color="primary" onClick={() => onEdit(note)}>
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
  const [showModal, setShowModal] = useState(false);
  const [newNote, setNewNote] = useState({ id: '', title: '', categories: [], body: '' });
  const [isEditing, setIsEditing] = useState(false);

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
    const noteToAdd = {
      ...newNote,
      id: uuidv4(),
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${Math.floor(Math.random() * 100) + 1}.png`,
    };
    const newNotes = [...notes, noteToAdd];
    saveNotes(newNotes);
    setNotes(newNotes);
    setShowModal(false);
    setNewNote({ id: '', title: '', categories: [], body: '' });
  };

  const editNote = () => {
    const updatedNotes = notes.map(note => (note.id === newNote.id ? newNote : note));
    saveNotes(updatedNotes);
    setNotes(updatedNotes);
    setShowModal(false);
    setNewNote({ id: '', title: '', categories: [], body: '' });
    setIsEditing(false);
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter(note => note.id !== id);
    saveNotes(newNotes);
    setNotes(newNotes);
  };

  const openEditModal = (note) => {
    setNewNote(note);
    setIsEditing(true);
    setShowModal(true);
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
                <CustomCard note={note} onDelete={deleteNote} onEdit={openEditModal} />
              </Grid>
            ))}
          </Grid>
        </Container>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{isEditing ? 'Edit Note' : 'Add New Note'}</IonTitle>
              <IonButton slot="end" onClick={() => setShowModal(false)}>Close</IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonItem>
              <IonLabel position="stacked">Title</IonLabel>
              <IonInput value={newNote.title} onIonChange={e => setNewNote({ ...newNote, title: e.detail.value })} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Categories</IonLabel>
              <IonSelect multiple value={newNote.categories} onIonChange={e => setNewNote({ ...newNote, categories: e.detail.value })}>
                <IonSelectOption value="Eng Eletrica">Eng Eletrica</IonSelectOption>
                <IonSelectOption value="Tecnologia">Tecnologia</IonSelectOption>
                <IonSelectOption value="Projetos">Projetos</IonSelectOption>
                <IonSelectOption value="Estudos">Estudos</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Body (Markdown)</IonLabel>
              <IonTextarea rows={6} value={newNote.body} onIonChange={e => setNewNote({ ...newNote, body: e.detail.value })} />
            </IonItem>
            <IonButton expand="full" onClick={isEditing ? editNote : addNewNote}>{isEditing ? 'Save Changes' : 'Save Note'}</IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
}

export default NotesMaterialPage;
import React from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonMenu,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonButtons,
    IonMenuButton,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonCard,
    IonCardContent,
    IonAvatar,
    IonSegment,
    IonSegmentButton,
    IonInput
} from '@ionic/react';
import {
    homeOutline,
    calendarOutline,
    schoolOutline,
    archiveOutline,
    settingsOutline,
    videocamOutline,
    ellipsisVertical,
    refreshOutline,
    alertCircleOutline
} from 'ionicons/icons';

const ClassroomPage = () => {
    const [selectedSegment, setSelectedSegment] = React.useState('mural');

    return (
        <>
            {/* Side Menu */}
            <IonMenu contentId="main-content">
                <IonContent>
                    <IonList>
                        <IonItem button>
                            <IonIcon icon={homeOutline} slot="start" />
                            <IonLabel>Início</IonLabel>
                        </IonItem>
                        <IonItem button>
                            <IonIcon icon={calendarOutline} slot="start" />
                            <IonLabel>Agenda</IonLabel>
                        </IonItem>
                        <IonItem button>
                            <IonIcon icon={schoolOutline} slot="start" />
                            <IonLabel>Minhas inscrições</IonLabel>
                        </IonItem>
                        <IonItem button>
                            <IonIcon icon={archiveOutline} slot="start" />
                            <IonLabel>Turmas arquivadas</IonLabel>
                        </IonItem>
                        <IonItem button>
                            <IonIcon icon={settingsOutline} slot="start" />
                            <IonLabel>Configurações</IonLabel>
                        </IonItem>
                    </IonList>
                </IonContent>
            </IonMenu>

            {/* Main Content */}
            <IonPage id="main-content">
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton></IonMenuButton>
                        </IonButtons>
                        <IonTitle>GFI00220 - ELETROMAGNETISMO I - A1</IonTitle>
                        <IonButtons slot="end">
                            <IonButton>
                                <IonIcon icon={ellipsisVertical} />
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>

                    <IonToolbar>
                        <IonSegment value={selectedSegment} onIonChange={e => setSelectedSegment(e.detail.value.toString())}>
                            <IonSegmentButton value="mural">
                                <IonLabel>Mural</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="atividades">
                                <IonLabel>Atividades</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="pessoas">
                                <IonLabel>Pessoas</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    {/* Banner Area */}
                    <div className="classroom-banner" style={{
                        background: '#FF7F50',
                        padding: '2rem',
                        color: 'white',
                        marginBottom: '1rem'
                    }}>
                        <h1>GFI00220 - ELETROMAGNETISMO I - A1</h1>
                        <p>2024 / 2º</p>
                    </div>

                    {/* Meeting Card */}
                    <IonGrid>
                        <IonRow>
                            <IonCol size="12" sizeMd="6">
                                <IonCard>
                                    <IonCardContent>
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol size="2">
                                                    <IonIcon
                                                        icon={videocamOutline}
                                                        style={{
                                                            fontSize: '24px',
                                                            color: '#4285f4'
                                                        }}
                                                    />
                                                </IonCol>
                                                <IonCol size="7">
                                                    <h3>Meet</h3>
                                                </IonCol>
                                                <IonCol size="3">
                                                    <IonButton expand="block" color="primary">
                                                        Participar
                                                    </IonButton>
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>

                            {/* Post Area */}
                            <IonCol size="12" sizeMd="6">
                                <IonCard>
                                    <IonCardContent>
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol size="2">
                                                    <IonAvatar>
                                                        <img src="/api/placeholder/40/40" alt="User avatar" />
                                                    </IonAvatar>
                                                </IonCol>
                                                <IonCol size="10">
                                                    <IonInput
                                                        placeholder="Escreva um aviso para sua turma"
                                                        className="custom-input"
                                                    />
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            </IonPage>
        </>
    );
};

export default ClassroomPage;
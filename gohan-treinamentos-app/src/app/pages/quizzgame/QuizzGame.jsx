import React, { useState } from 'react';
import { questionsByCategory } from './repository/questions';

import {
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  IonText,
  IonIcon
} from '@ionic/react';
import {
  arrowForward,
  arrowBack,
  checkmarkCircle,
  closeCircle,
  refresh
} from 'ionicons/icons';

const quizCategories = [
  {
    id: 'circuitos_digitais',
    title: 'Circuitos Digitais (P2 UFF)',
    description: 'Portas lógicas, flip-flops JK, contadores assíncronos e semáforos.',
    icon: '⚡'
  },
  {
    id: 'circuitos_eletricos',
    title: 'Circuitos Elétricos CC',
    description: 'Leis de Ohm, Kirchhoff, circuitos resistivos e divisores.',
    icon: '🔋'
  },
  {
    id: 'sistemas_potencia',
    title: 'Sistemas Elétricos de Potência (SEP)',
    description: 'Fluxo de potência, contingência N-1 e operação do SIN.',
    icon: '🏭'
  }
];

const QuestionHeader = ({ currentQuestion, totalQuestions, correctAnswers, difficulty, onBack }) => {
  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Fácil': return 'success';
      case 'Médio': return 'warning';
      case 'Difícil': return 'danger';
      default: return 'medium';
    }
  };

  return (
    <div className="ion-padding-bottom">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <IonButton fill="clear" onClick={onBack} style={{ '--color': 'var(--ion-color-dark)', margin: 0, padding: 0 }}>
          <IonIcon icon={arrowBack} slot="start" />
          Voltar
        </IonButton>
        <IonText color="primary">
          <h3 style={{ margin: 0 }}>Acertos: {correctAnswers}</h3>
        </IonText>
      </div>
      <div className="ion-justify-content-between ion-align-items-center" style={{ display: 'block', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
        <IonText>
          <h2>Questão {currentQuestion + 1} de {totalQuestions}</h2>
        </IonText>
        <IonText color={getDifficultyColor(difficulty)}>
          <h2>Dificuldade: {difficulty}</h2>
        </IonText>
      </div>
    </div>
  );
};

const QuestionCard = ({ question, options, handleAnswer, isAnswered, selectedAnswer, correctAnswer }) => (
  <IonCard style={{ backgroundColor: 'rgb(220,225,230)', borderRadius: '16px' }}>
    <IonCardContent>
      <IonText color="dark">
        <h1 className="ion-padding-bottom" style={{ fontSize: '1.25rem', lineHeight: '1.5', fontWeight: 'bold' }}>{question}</h1>
      </IonText>
      <div className="ion-padding-top">
        {Object.entries(options).map(([key, value]) => (
          <IonButton
            key={key}
            expand="block"
            color={
              isAnswered
                ? key === correctAnswer
                  ? 'success'
                  : key === selectedAnswer
                    ? 'danger'
                    : 'light'
                : 'light'
            }
            disabled={isAnswered}
            onClick={() => handleAnswer(key)}
            className="ion-margin-bottom"
            style={{ '--border-radius': '10px', textTransform: 'none', textAlign: 'left' }}
          >
            <strong className="ion-padding-end" style={{ color: 'black' }}>{key.toUpperCase()})</strong>
            <span style={{ color: 'black', whiteSpace: 'normal', display: 'inline-block' }}>{value}</span>
            {isAnswered && key === correctAnswer && (
              <IonIcon icon={checkmarkCircle} slot="end" color="success" />
            )}
            {isAnswered && key === selectedAnswer && key !== correctAnswer && (
              <IonIcon icon={closeCircle} slot="end" color="danger" />
            )}
          </IonButton>
        ))}
      </div>
    </IonCardContent>
  </IonCard>
);

const QuizGamePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const activeQuestions = selectedCategory ? questionsByCategory[selectedCategory] : [];

  const handleAnswer = (answer) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === activeQuestions[currentQuestion].correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < activeQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setCorrectAnswers(0);
    setShowResult(false);
    setIsAnswered(false);
  };

  const exitQuiz = () => {
    setSelectedCategory(null);
    resetQuiz();
  };

  // Se nenhuma categoria estiver selecionada, renderiza o menu de escolha de Quiz
  if (!selectedCategory) {
    return (
      <IonContent>
        <div className="ion-padding">
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <IonText color="primary">
              <h1 style={{ fontWeight: 'black', fontSize: '1.8rem' }}>Estudos UFF - Quizzes</h1>
            </IonText>
            <IonText color="medium">
              <p>Selecione uma disciplina para exercitar a mente e testar seus conhecimentos</p>
            </IonText>
          </div>

          {quizCategories.map(cat => (
            <IonCard key={cat.id} button onClick={() => setSelectedCategory(cat.id)} style={{ borderRadius: '16px', margin: '15px 0' }}>
              <IonCardContent style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px' }}>
                <div style={{ fontSize: '2.5rem' }}>{cat.icon}</div>
                <div>
                  <IonText color="dark">
                    <h3 style={{ margin: 0, fontWeight: 'bold' }}>{cat.title}</h3>
                  </IonText>
                  <IonText color="medium">
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>{cat.description}</p>
                  </IonText>
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    );
  }

  // Tela de Resultados do Quiz
  if (showResult) {
    const successRate = (correctAnswers / activeQuestions.length) * 100;
    return (
      <IonContent>
        <div className="ion-padding ion-text-center">
          <IonCard style={{ borderRadius: '20px', padding: '15px' }}>
            <IonCardContent>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🏆</div>
              <IonText color="dark">
                <h1>Resultado Final</h1>
              </IonText>
              <IonText color="medium">
                <p>Categoria: {quizCategories.find(c => c.id === selectedCategory)?.title}</p>
              </IonText>
              
              <div style={{ padding: '20px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', margin: '20px 0' }}>
                <IonText color="primary">
                  <h1 style={{ fontSize: '3.5rem', fontWeight: 'black', margin: 0 }}>
                    {correctAnswers} <span style={{ fontSize: '1.5rem', color: '#999' }}>/ {activeQuestions.length}</span>
                  </h1>
                </IonText>
                <IonText color="medium">
                  <p style={{ margin: 0 }}>Taxa de acerto: {Math.round(successRate)}%</p>
                </IonText>
              </div>

              <IonText color="dark">
                <p style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>
                  {successRate >= 80 
                    ? "Excelente! Você está preparado para gabaritar. Que a Força esteja com você!" 
                    : successRate >= 50 
                    ? "Bom progresso! Vale a pena revisar as questões incorretas." 
                    : "Recomendo refazer o simulado e revisar os tópicos base."}
                </p>
              </IonText>

              <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <IonButton expand="block" onClick={resetQuiz}>
                  <IonIcon icon={refresh} slot="start" />
                  Tentar Novamente
                </IonButton>
                <IonButton expand="block" fill="outline" onClick={exitQuiz}>
                  Outro Simulado
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    );
  }

  return (
    <IonContent>
      <div className="ion-padding">
        <QuestionHeader
          currentQuestion={currentQuestion}
          totalQuestions={activeQuestions.length}
          correctAnswers={correctAnswers}
          difficulty={activeQuestions[currentQuestion].difficulty}
          onBack={exitQuiz}
        />
        <QuestionCard
          question={activeQuestions[currentQuestion].question}
          options={activeQuestions[currentQuestion].options}
          handleAnswer={handleAnswer}
          isAnswered={isAnswered}
          selectedAnswer={selectedAnswer}
          correctAnswer={activeQuestions[currentQuestion].correctAnswer}
        />
        {isAnswered && (
          <IonButton
            expand="block"
            onClick={nextQuestion}
            className="ion-margin-top"
            style={{ '--border-radius': '10px' }}
          >
            {currentQuestion < activeQuestions.length - 1 ? (
              <>
                Próxima Questão
                <IonIcon icon={arrowForward} slot="end" />
              </>
            ) : (
              'Ver Resultado'
            )}
          </IonButton>
        )}
      </div>
    </IonContent>
  );
};

export default QuizGamePage;
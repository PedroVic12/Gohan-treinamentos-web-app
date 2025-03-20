import React, { useState } from 'react';

const CalisthenicsAppPreview = () => {
  // Estado para controlar a aba selecionada
  const [selectedTab, setSelectedTab] = useState('push');
  
  // Estado para controlar exercícios marcados
  const [checkedExercises, setCheckedExercises] = useState({});
  
  // Estado para modo de edição
  const [isEditing, setIsEditing] = useState(false);
  
  // Dados de exemplo para os exercícios
  const workouts = {
    pull: {
        '1': ["100 Pull ups - Chris Heria", "", "Normal"],
        '2': ["Skin the Cat + 100 Pull ups + Muscle Up", "", "Sayajin"]
    },
    push: {
        '1': ["100 Pull Ups - Next", "https://www.youtube.com/watch?v=X4XDkWOlQD8", "Normal"],
        '2': ["100 Push ups - Chris Heria", "https://www.youtube.com/watch?v=IYLxm0T6qls", "Sayajin"],
        '3': ["5 minutes 30x30", "", "Normal"],
        '4': ["Moves of the day - treino de peito", "https://www.youtube.com/watch?v=ypxmdLxCK7k&t=441s", "https://www.youtube.com/watch?v=1BpYbEi2QcI&t=703s", "https://www.youtube.com/watch?v=0cMXdZL9ESA"]
    },
    abs: {
        '1': ["Get ABS in 28 Days", "https://www.youtube.com/watch?v=TIMghHu6QFU", "Normal"],
        '2': ["DO THIS ABS WORKOUT EVERY DAY", "https://www.youtube.com/watch?v=xRXhpMsLaXo&t=285s", "https://www.youtube.com/watch?v=fpK5VZCwJPY", "Normal"]
    },
    legs: {
        '1': ["100 Squads a Day - Chris Heria", "https://www.youtube.com/watch?v=qLPrPVz4NzQ", "", "Normal"]
    },
  };
  
  // Dados de exemplo para o histórico de treinos
  const trainingLog = {
    '2025-03-15': { push: true, pull: true, legs: false, abs: true },
    '2025-03-16': { push: false, pull: true, legs: true, abs: false },
    '2025-03-17': { push: true, pull: false, legs: false, abs: true }
  };
  
  // Função para lidar com a marcação de exercícios
  const handleToggleCheck = (exerciseId, setIndex, checked) => {
    setCheckedExercises(prev => ({
      ...prev,
      [exerciseId]: {
        ...(prev[exerciseId] || {}),
        [setIndex]: checked
      }
    }));
  };
  
  // Renderiza a aba de exercícios
  const renderWorkoutTab = (category) => {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 capitalize">{category}</h2>
        
        <button 
          className="px-4 py-2 mb-4 bg-blue-500 hover:bg-blue-600 text-white rounded"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Concluir Edição' : 'Editar Treino'}
        </button>
        
        {workouts[category].map((exercise) => (
          <div key={exercise.id} className="bg-gray-800 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold">{exercise.name}</h3>
            <p className="text-sm text-gray-400">Sets: {exercise.sets} | Reps: {exercise.reps}</p>
            
            <div className="mt-3">
              {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                <label key={setIndex} className="flex items-center mr-4 mb-2">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5"
                    checked={checkedExercises[exercise.id]?.[setIndex] || false}
                    onChange={(e) => handleToggleCheck(exercise.id, setIndex, e.target.checked)}
                  />
                  <span className="ml-2">Set {setIndex + 1}</span>
                </label>
              ))}
            </div>
            
            {isEditing && (
              <button className="px-3 py-1 mt-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded">
                Excluir
              </button>
            )}
          </div>
        ))}
        
        {isEditing && (
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold">Adicionar Exercício</h3>
            <div className="mt-3 space-y-3">
              <input
                type="text"
                placeholder="Nome do exercício"
                className="w-full p-2 bg-gray-700 rounded"
              />
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Sets"
                  className="w-1/2 p-2 bg-gray-700 rounded"
                />
                <input
                  type="text"
                  placeholder="Reps"
                  className="w-1/2 p-2 bg-gray-700 rounded"
                />
              </div>
              <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded">
                Adicionar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Renderiza a aba de dashboard
  const renderDashboard = () => {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Registro de Treinos</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-800 rounded-lg">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-3 text-left">Data</th>
                <th className="p-3 text-center">Push</th>
                <th className="p-3 text-center">Pull</th>
                <th className="p-3 text-center">Legs</th>
                <th className="p-3 text-center">ABS</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(trainingLog).map(([date, log]) => (
                <tr key={date} className="border-b border-gray-700">
                  <td className="p-3">{date}</td>
                  <td className="p-3 text-center">{log.push ? '✅' : '❌'}</td>
                  <td className="p-3 text-center">{log.pull ? '✅' : '❌'}</td>
                  <td className="p-3 text-center">{log.legs ? '✅' : '❌'}</td>
                  <td className="p-3 text-center">{log.abs ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <h2 className="text-xl font-bold mt-8 mb-4">Volume de Treino</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-800 rounded-lg">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-3 text-left">Exercício</th>
                <th className="p-3 text-center">Sets</th>
                <th className="p-3 text-center">Reps</th>
                <th className="p-3 text-center">Volume</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(workouts).flatMap(([category, exercises]) =>
                exercises.map((exercise, index) => (
                  <tr key={`${category}-${index}`} className="border-b border-gray-700">
                    <td className="p-3">{exercise.name}</td>
                    <td className="p-3 text-center">{exercise.sets}</td>
                    <td className="p-3 text-center">{exercise.reps}</td>
                    <td className="p-3 text-center">
                      {!isNaN(Number(exercise.reps)) 
                        ? exercise.sets * Number(exercise.reps) 
                        : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  // Renderiza a aba de tutoriais
  const renderTutorials = () => {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Tutoriais</h2>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Mobilidade</h3>
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <h4 className="font-medium mb-2">Tutorial 1 - mobilidade</h4>
            <div className="w-full bg-gray-700 h-48 flex items-center justify-center">
              <p className="text-gray-400">YouTube Video Player</p>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Motivação</h3>
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <h4 className="font-medium mb-2">Tutorial 1 - motivacao</h4>
            <div className="w-full bg-gray-700 h-48 flex items-center justify-center">
              <p className="text-gray-400">YouTube Video Player</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Renderiza o temporizador de descanso
  const renderRestTimer = () => {
    return (
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">Timer de Descanso: 30s</h3>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
            Iniciar
          </button>
          <button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded">
            Resetar
          </button>
          <input
            type="number"
            defaultValue="30"
            className="w-24 p-2 bg-gray-700 rounded"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Calistenia Workout App</h1>
      
      {/* Tabs */}
      <div className="flex justify-center mb-6 bg-gray-800 rounded-lg overflow-hidden">
        <button 
          className={`px-4 py-2 ${selectedTab === 'tutorials' ? 'bg-blue-500' : 'bg-gray-700'}`}
          onClick={() => setSelectedTab('tutorials')}
        >
          Tutoriais
        </button>
        <button 
          className={`px-4 py-2 ${selectedTab === 'push' ? 'bg-blue-500' : 'bg-gray-700'}`}
          onClick={() => setSelectedTab('push')}
        >
          Push
        </button>
        <button 
          className={`px-4 py-2 ${selectedTab === 'pull' ? 'bg-blue-500' : 'bg-gray-700'}`}
          onClick={() => setSelectedTab('pull')}
        >
          Pull
        </button>
        <button 
          className={`px-4 py-2 ${selectedTab === 'legs' ? 'bg-blue-500' : 'bg-gray-700'}`}
          onClick={() => setSelectedTab('legs')}
        >
          Legs
        </button>
        <button 
          className={`px-4 py-2 ${selectedTab === 'abs' ? 'bg-blue-500' : 'bg-gray-700'}`}
          onClick={() => setSelectedTab('abs')}
        >
          ABS
        </button>
        <button 
          className={`px-4 py-2 ${selectedTab === 'dashboard' ? 'bg-blue-500' : 'bg-gray-700'}`}
          onClick={() => setSelectedTab('dashboard')}
        >
          Dashboard
        </button>
      </div>
      
      {/* Rest Timer */}
      {['push', 'pull', 'legs', 'abs'].includes(selectedTab) && renderRestTimer()}
      
      {/* Tab Content */}
      {selectedTab === 'tutorials' && renderTutorials()}
      {selectedTab === 'push' && renderWorkoutTab('push')}
      {selectedTab === 'pull' && renderWorkoutTab('pull')}
      {selectedTab === 'legs' && renderWorkoutTab('legs')}
      {selectedTab === 'abs' && renderWorkoutTab('abs')}
      {selectedTab === 'dashboard' && renderDashboard()}
    </div>
  );
};

export default CalisthenicsAppPreview;
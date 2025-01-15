"use client";
import React, { useState, useCallback } from "react";

function MainComponent() {
  const [exercises, setExercises] = useState([
    {
      id: 1,
      name: "Peito e Tríceps",
      items: [
        "Supino Reto 4x12",
        "Supino Inclinado 3x12",
        "Extensão de Tríceps 4x15",
        "Flexão de Braço 3x falha",
      ],
    },
    {
      id: 2,
      name: "Costas e Bíceps",
      items: [
        "Puxada na Frente 4x12",
        "Remada Baixa 4x12",
        "Rosca Direta 3x15",
        "Rosca Martelo 3x12",
      ],
    },
  ]);

  const [completedItems, setCompletedItems] = useState({});
  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalItems: 0,
    progress: 0,
  });

  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseItems, setNewExerciseItems] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCheck = useCallback(
    (exerciseId, itemIndex) => {
      setCompletedItems((prev) => {
        const key = `${exerciseId}-${itemIndex}`;
        const newState = { ...prev, [key]: !prev[key] };

        const completed = Object.values(newState).filter(Boolean).length;
        const total = exercises.reduce((acc, ex) => acc + ex.items.length, 0);

        setStats({
          totalCompleted: completed,
          totalItems: total,
          progress: Math.round((completed / total) * 100),
        });

        return newState;
      });
    },
    [exercises]
  );

  const handleAddExercise = () => {
    if (newExerciseName && newExerciseItems) {
      const newId = exercises.length + 1;
      const items = newExerciseItems.split(",").map((item) => item.trim());

      setExercises((prev) => [
        ...prev,
        {
          id: newId,
          name: newExerciseName,
          items: items,
        },
      ]);

      setNewExerciseName("");
      setNewExerciseItems("");
      setShowAddForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Treino do Dia</h2>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {showAddForm ? "Cancelar" : "Adicionar Treino"}
                </button>
              </div>

              {showAddForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    placeholder="Nome do treino"
                    className="w-full mb-2 p-2 border rounded"
                    value={newExerciseName}
                    onChange={(e) => setNewExerciseName(e.target.value)}
                  />
                  <textarea
                    placeholder="Exercícios (separados por vírgula)"
                    className="w-full mb-2 p-2 border rounded"
                    value={newExerciseItems}
                    onChange={(e) => setNewExerciseItems(e.target.value)}
                  />
                  <button
                    onClick={handleAddExercise}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Salvar Treino
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="border-b pb-4 last:border-b-0"
                  >
                    <h3 className="text-xl font-semibold mb-3">
                      {exercise.name}
                    </h3>
                    <div className="space-y-2">
                      {exercise.items.map((item, index) => {
                        const isChecked =
                          completedItems[`${exercise.id}-${index}`];
                        return (
                          <div
                            key={index}
                            className={`flex items-center p-2 rounded ${
                              isChecked ? "bg-green-100" : "bg-gray-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleCheck(exercise.id, index)}
                              className="h-5 w-5 text-blue-600"
                            />
                            <span className="ml-3">{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg">Progresso</span>
                    <span className="font-bold">{stats.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${stats.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">
                      {stats.totalCompleted}
                    </div>
                    <div className="text-sm text-gray-600">Completados</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-gray-600">
                      {stats.totalItems}
                    </div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
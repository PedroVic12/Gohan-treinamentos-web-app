import { digitalQuestions } from './questions_circuitos_digitais';
import { electricQuestions } from './questions_circuitos_eletricos';
import { sepQuestions } from './questions_sistemas_potencia';

export const questionsByCategory = {
  circuitos_digitais: digitalQuestions,
  circuitos_eletricos: electricQuestions,
  sistemas_potencia: sepQuestions
};

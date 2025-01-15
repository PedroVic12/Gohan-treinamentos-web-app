import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const CATEGORIES = {
  MATH: { name: 'Matemática', color: '#FF6B6B' },
  SCIENCE: { name: 'Ciências', color: '#4ECDC4' },
  HISTORY: { name: 'História', color: '#45B7D1' },
  LANGUAGES: { name: 'Idiomas', color: '#96CEB4' },
};

const SAMPLE_CARDS = [
  { id: '1', category: 'MATH', question: 'Quanto é 2 + 2?', answer: '4' },
  { id: '2', category: 'SCIENCE', question: 'Qual é o símbolo do Oxigênio?', answer: 'O' },
  { id: '3', category: 'HISTORY', question: 'Em que ano foi descoberto o Brasil?', answer: '1500' },
];

export default function FlashcardsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('MATH');
  const [showAnswer, setShowAnswer] = useState({});

  const toggleAnswer = (id) => {
    setShowAnswer(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryList}
      >
        {Object.entries(CATEGORIES).map(([key, category]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.categoryButton,
              { backgroundColor: category.color },
              selectedCategory === key && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(key)}
          >
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.cardList}>
        {SAMPLE_CARDS
          .filter(card => card.category === selectedCategory)
          .map(card => (
            <TouchableOpacity
              key={card.id}
              style={styles.card}
              onPress={() => toggleAnswer(card.id)}
            >
              <Text style={styles.question}>{card.question}</Text>
              {showAnswer[card.id] && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answer}>{card.answer}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  categoryList: {
    padding: 16,
  },
  categoryButton: {
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedCategory: {
    transform: [{ scale: 1.1 }],
  },
  categoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardList: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  answerContainer: {
    marginTop: 16,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  answer: {
    fontSize: 16,
    color: '#666',
  },
});
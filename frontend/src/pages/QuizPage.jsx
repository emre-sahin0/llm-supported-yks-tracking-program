import React from 'react';
import { useLocation } from 'react-router-dom';
import TopicQuiz from '../components/TopicQuiz';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const QuizPage = () => {
  const query = useQuery();
  const konuAdi = query.get('konu') || 'Konu Seçilmedi';

  return (
    <div style={{maxWidth: 700, margin: '40px auto'}}>
      <TopicQuiz konuAdi={konuAdi} />
    </div>
  );
};

export default QuizPage; 
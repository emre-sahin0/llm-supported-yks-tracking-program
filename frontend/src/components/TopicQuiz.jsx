import React, { useState } from 'react';
import axios from 'axios';

const TopicQuiz = ({ konuAdi, onFinish }) => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [step, setStep] = useState('start'); // start | quiz | result
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/ai-questions/generate_questions', { konu_adi: konuAdi });
      setQuestions(res.data.sorular);
      setUserAnswers(Array(res.data.sorular.length).fill(null));
      setStep('quiz');
    } catch (err) {
      setError('Sorular alınamadı.');
    }
    setLoading(false);
  };

  const handleAnswer = (qIdx, answer) => {
    const updated = [...userAnswers];
    updated[qIdx] = answer;
    setUserAnswers(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const correctAnswers = questions.map(q => q.dogru);
      const res = await axios.post('/api/ai-questions/evaluate_answers', {
        user_answers: userAnswers,
        correct_answers: correctAnswers
      });
      setResult(res.data);
      setStep('result');
      if (onFinish) onFinish(res.data);
    } catch (err) {
      setError('Değerlendirme sırasında hata oluştu.');
    }
    setLoading(false);
  };

  if (step === 'start') {
    return (
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'50vh'}}>
        <button
          onClick={fetchQuestions}
          disabled={loading}
          style={{
            padding:'18px 48px',
            fontSize:'1.3rem',
            borderRadius:12,
            background:'#22c55e',
            color:'#fff',
            border:'none',
            fontWeight:'bold',
            boxShadow:'0 2px 8px #0001',
            cursor:'pointer',
            marginBottom: 16
          }}
        >
          AI Quiz Başlat
        </button>
        {error && <div style={{color:'red', fontSize:'1.1rem', marginTop:8}}>{error}</div>}
      </div>
    );
  }

  if (step === 'quiz') {
    return (
      <div style={{maxWidth:700, margin:'40px auto', display:'flex', flexDirection:'column', alignItems:'center'}}>
        <h2 style={{fontSize:'2rem', fontWeight:'bold', marginBottom:24}}>{konuAdi} - AI Quiz</h2>
        {questions.map((q, idx) => (
          <div key={idx} style={{
            marginBottom: '2.5em',
            width:'100%',
            background:'#fff',
            borderRadius:16,
            boxShadow:'0 2px 12px #0001',
            padding:'24px 20px',
            border:'1.5px solid #e5e7eb'
          }}>
            <div style={{fontWeight:'bold', fontSize:'1.15rem', marginBottom:12}}>{idx+1}. {q.soru}</div>
            <div style={{display:'flex', flexWrap:'wrap', gap:'18px 32px'}}>
              {q.secenekler.map((opt, oidx) => (
                <label key={oidx} style={{
                  display:'flex', alignItems:'center',
                  fontSize:'1.08rem',
                  background:'#f3f4f6',
                  borderRadius:8,
                  padding:'8px 18px',
                  marginBottom:6,
                  cursor:'pointer',
                  minWidth:180
                }}>
                  <input
                    type="radio"
                    name={`q${idx}`}
                    value={opt[0]}
                    checked={userAnswers[idx] === opt[0]}
                    onChange={() => handleAnswer(idx, opt[0])}
                    style={{marginRight:10, accentColor:'#22c55e'}}
                  /> {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={handleSubmit}
          disabled={userAnswers.includes(null) || loading}
          style={{
            padding:'14px 38px',
            fontSize:'1.1rem',
            borderRadius:10,
            background:'#2563eb',
            color:'#fff',
            border:'none',
            fontWeight:'bold',
            boxShadow:'0 2px 8px #0001',
            cursor:'pointer',
            marginTop:8
          }}
        >
          Gönder
        </button>
        {error && <div style={{color:'red', fontSize:'1.1rem', marginTop:8}}>{error}</div>}
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'40vh'}}>
        <h2 style={{fontSize:'2rem', fontWeight:'bold', marginBottom:16}}>Sonuç</h2>
        <div style={{fontSize:'1.2rem', marginBottom:8}}>Doğru Sayısı: <b>{result.dogru_sayisi} / {result.toplam}</b></div>
        <div style={{
          fontWeight:'bold',
          fontSize:'1.5rem',
          color: result.feedback.includes('Çok iyisin') ? '#22c55e' : result.feedback.includes('Gayet iyi') ? '#eab308' : '#ef4444',
          background:'#f3f4f6',
          borderRadius:12,
          padding:'16px 32px',
          marginBottom:24,
          boxShadow:'0 2px 8px #0001'
        }}>{result.feedback}</div>
        <button onClick={() => setStep('start')} className="btn btn-secondary" style={{padding:'10px 24px', fontSize:'1rem', borderRadius:8, background:'#2563eb', color:'#fff', border:'none', cursor:'pointer'}}>Tekrar Dene</button>
      </div>
    );
  }

  return null;
};

export default TopicQuiz; 
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Card, CardContent, Grid, Divider } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AIConsultantPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchStudentData();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`/api/ai/students/${user.id}/data`);
      setStudentData(response.data);
    } catch (err) {
      setError('Öğrenci verileri yüklenirken bir hata oluştu.');
    }
  };

  const getAIAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/ai/analyze', {
        studentId: user.id,
        data: studentData
      });
      setAnalysis(response.data.recommendations);
    } catch (err) {
      setError('AI analizi sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = () => {
    if (!studentData?.recentActivity) return [];
    return Object.entries(studentData.recentActivity).map(([date, count]) => ({
      date,
      count
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AI Danışman
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Öğrenci Verileri */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Öğrenci Verileri
              </Typography>
              {studentData ? (
                <Box>
                  <Typography>Toplam Çözülen Soru: {studentData.totalQuestions}</Typography>
                  <Typography>Tamamlanan Konular: {studentData.completedTopics?.length || 0}</Typography>
                </Box>
              ) : (
                <Typography>Veriler yükleniyor veya bulunamadı.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Son 7 Günlük Aktivite Grafiği */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Son 7 Günlük Aktivite
              </Typography>
              <Box sx={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formatChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Analiz Butonu */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={getAIAnalysis}
              disabled={loading || !studentData}
              size="large"
            >
              {loading ? <CircularProgress size={24} /> : 'AI Analizi Al'}
            </Button>
          </Box>
        </Grid>

        {/* AI Analiz Sonuçları */}
        {analysis && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  AI Analizi
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography whiteSpace="pre-line">
                  {analysis}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AIConsultantPage; 
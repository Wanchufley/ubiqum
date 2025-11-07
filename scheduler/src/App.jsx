import React, { useState } from 'react';
import './App.css';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import {
  terms,
  getCourseTerm,
  getCourseNumber,
  hasConflict,
  addScheduleTimes
} from './utilities/times';
import CourseList from './components/CourseList.jsx';
import Course from './components/Course.jsx';

const Banner = ({ title }) => (
  <h1>{title}</h1>
);

const fetchSchedule = async () => {
  const url = 'https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php';
  const response = await fetch(url);
  if (!response.ok) throw response;
  return addScheduleTimes(await response.json());
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Main />
  </QueryClientProvider>
);

const Main = () => {
  const { data: schedule, isLoading, error } = useQuery({
    queryKey: ['schedule'],
    queryFn: fetchSchedule
  });

  if (error) return <h1>{error}</h1>;
  if (isLoading) return <h1>Loading the schedule...</h1>;

  return (
    <div className="container">
      <Banner title={schedule.title} />
      <CourseList courses={schedule.courses} />
    </div>
  );
};

export default App;

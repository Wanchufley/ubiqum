import React, { useState } from 'react';
import { useData } from './utilities/firebase.js';
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
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EditForm from './EditForm';

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
  const [schedule, isLoading, error] = useData('/courses');

  if (isLoading) return <h1>Loading the schedule...</h1>;
  if (error) return <h1>{error.message || 'Error loading data'}</h1>;
  if (!schedule) return <h1>No schedule data found</h1>;

  const processedSchedule = addScheduleTimes({ title: 'CS Courses', courses: schedule });

  return (
    <div className="container">
      <Banner title={processedSchedule.title} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CourseList courses={processedSchedule.courses} />} />
          <Route path="/edit" element={<EditForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

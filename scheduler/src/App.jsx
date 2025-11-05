import React, { useState } from 'react';
import './App.css';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

const Banner = ({ title }) => (
  <h1>{title}</h1>
);

const fetchSchedule = async () => {
  const url = 'https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php';
  const response = await fetch(url);
  if (!response.ok) throw response;
  return await response.json();
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Main />
  </QueryClientProvider>
);

const terms = { F: 'Fall', W: 'Winter', S: 'Spring' };

const getCourseTerm = code => (
  terms[code.charAt(0)]
);

const getCourseNumber = code => (
  code.slice(1)
);

const Course = ({ code, course }) => (
  <div className="course-list card m-2 p-2">
    <div className="card-body">
      <div className="card-title">{getCourseTerm(code)} CS {getCourseNumber(code)}</div>
      <div className="card-text">{course.title}</div>
    </div>
  </div>
);


const TermButton = ({ term, setTerm, checked }) => (
  <>
    <input type="radio" id={term} className="btn-check" autoComplete="off" checked={checked} onChange={() => setTerm(term)} />
    <label className="btn btn-success m-1 p-2" htmlFor={term}>
      {term}
    </label>
  </>
);

const TermSelector = ({ term, setTerm }) => (
  <div className="btn-group">
    {
      Object.values(terms)
        .map(value => <TermButton key={value} term={value} setTerm={setTerm} checked={value === term} />)
    }
  </div>
);

const CourseList = ({ courses }) => {
  const [term, setTerm] = useState('Fall');
  const termCourses = Object.entries(courses).filter(([code]) => term === getCourseTerm(code));
  return (
    <>
      <TermSelector term={term} setTerm={setTerm} />
      <div className="course-list">
        {termCourses.map(([code, course]) => <Course key={code} code={code} course={course} />)}
      </div>
    </>
  );
};

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

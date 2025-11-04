import React from "react";
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

const getCourseTerm = course => (
  terms[course.number.charAt(0)]
);

const getCourseNumber = course => (
  course.number.slice(1, 4)
);

const Course = ({ course }) => (
  <div className="course-list card m-2 p-2">
    <div className="card-body">
      <div className="card-title">{getCourseTerm(course)} CS {getCourseNumber(course)}</div>
      <div className="card-text">{course.title}</div>
    </div>
  </div>
);

const CourseList = ({ courses }) => (
  <div>
    {Object.values(courses).map(course =>
      <Course
        key={`${course.term}-${course.number}`}
        course={course}
      />
    )};
  </div>
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

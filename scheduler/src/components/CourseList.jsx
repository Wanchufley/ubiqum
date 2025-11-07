import React, { useState } from 'react';
import { terms, getCourseTerm, getCourseNumber, hasConflict } from '../utilities/times';
import '../App.css'; // optional, if you rely on shared CSS from App
import Course from './Course.jsx';

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
  const [selected, setSelected] = useState([]);
  const termCourses = Object.entries(courses).filter(([code]) => term === getCourseTerm(code));
  return (
    <>
      <TermSelector term={term} setTerm={setTerm} />
      <div className="course-list">
        {termCourses.map(([code, course]) => <Course key={code} code={code} course={course} selected={selected} setSelected={setSelected} />)}
      </div>
    </>
  );
};

export default CourseList;

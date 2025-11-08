import React from 'react';
import { getCourseTerm, getCourseNumber, hasConflict } from '../utilities/times';
import '../App.css'; // optional, if you rely on shared styles from App
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const toggle = (x, lst) => (
  lst.includes(x) ? lst.filter(y => y !== x) : [x, ...lst]
);

const Course = ({ code, course, selected, setSelected }) => {
  const navigate = useNavigate();
  const isSelected = selected.includes(course);
  const isDisabled = !isSelected && hasConflict(course, selected);
  const style = {
    backgroundColor: isDisabled ? 'lightgrey' : isSelected ? '#B0E5A4' : 'white'
  };

  return (
    <div className="course-list card m-2 p-2"
      style={style}
      onClick={isDisabled ? null : () => setSelected(toggle(course, selected))}
      onDoubleClick={() => navigate('/edit', { state: { ...course, id: code } })}>
      <div className="card-body">
        <div className="card-title">{getCourseTerm(code)} CS {getCourseNumber(code)}</div>
        <div className="card-text">{course.title}</div>
        <div className="card-text">{course.meets}</div>
      </div>
    </div>
  );
};

export default Course;

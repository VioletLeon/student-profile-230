import React, { useState, useEffect } from 'react';
import { act } from 'react-dom/test-utils';
import { getStudents } from '../Hooks/students';

export default function StudentsDisplay(props) {
  const [students, setStudents] = useState([]);
  const [activeStudents, setActiveStudent] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Load students
  useEffect(() => {
    async function getData() {
      const studentData = await getStudents();
      setStudents(studentData);
    }
    getData();
  }, []);

  return (
    <div>
      {!students ? (
        'Loading'
      ) : (
        <div className="mainContainer">
          <div className="searchBarContainer">
            <input
              type="text"
              name="name"
              placeholder="Search by name"
              className="searchBar"
              onChange={(event) =>
                setSearchInput(event.target.value.toLowerCase())
              }
            />
            <div className="searchBarContainer">
              <input
                type="text"
                name="name"
                placeholder="Search by tag"
                className="searchBar"
                onChange={(event) =>
                  setTagInput(event.target.value.toLowerCase())
                }
              />
            </div>
          </div>
          <div className="allStudentsContainer">
            {students
              .filter((student) => {
                const studentName = student.firstName + ' ' + student.lastName;
                const lowerCase = studentName.toLowerCase();

                if (searchInput === '') {
                  return student;
                } else {
                  if (lowerCase.includes(searchInput)) {
                    return student;
                  }
                }
              })
              .filter((student) => {
                const tags = student.tags;
                if (tagInput === '') {
                  return student;
                } else {
                  if (
                    tags.some((value) => value.toLowerCase().includes(tagInput))
                  ) {
                    return student;
                  }
                }
              })
              .map((student) => {
                if (!student.active && !student.tags) {
                  student['active'] = false;
                  student['tags'] = [];
                }
                return (
                  <div key={student.id} className="outerStudentContainer">
                    <div className="studentContainer">
                      <div className="studentImageDiv">
                        <img
                          className="studentImage"
                          src={student.pic}
                          alt="studentImage"
                        />
                      </div>
                      <div>
                        <h1 className="studentName">
                          {student.firstName + ' ' + student.lastName}
                        </h1>

                        <div className="studentInfo">
                          <span>Email: {student.email}</span>
                          <span>Company: {student.company}</span>
                          <span>Skill: {student.skill}</span>
                          <span>
                            {'Average: ' +
                              student.grades.reduce(function (sum, value) {
                                sum = parseInt(sum);
                                value = parseInt(value);
                                return sum + value;
                              }, 0) /
                                student.grades.length +
                              '%'}
                          </span>

                          {student.tags < 1 ? (
                            ''
                          ) : (
                            <div className="tagsMain">
                              {student['tags'].map((tag, index) => {
                                return (
                                  <div className="tagContainer" key={index}>
                                    <span className="tagText"> {tag} </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          <form
                            onSubmit={(event) => {
                              event.preventDefault();
                              student['tags'].push(event.target[0].value);
                              const copy = [...students];
                              setStudents(copy);
                              event.target[0].value = '';
                            }}
                          >
                            <input
                              type="text"
                              tag="tag"
                              placeholder="Add a tag"
                              className="tagInput"
                            />
                          </form>
                        </div>
                      </div>
                      <div className="buttonExpand">
                        {!activeStudents.includes(student.id) ? (
                          <button
                            className="btn"
                            onClick={() => {
                              setActiveStudent([...activeStudents, student.id]);
                            }}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        ) : (
                          <button
                            className="btn"
                            onClick={() => {
                              setActiveStudent(
                                activeStudents.filter(
                                  (studentid) => studentid !== student.id
                                )
                              );
                            }}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                        )}
                      </div>
                    </div>
                    {activeStudents.includes(student.id) ? (
                      <div className="gradesContainer">
                        {student.grades.map((grade, index) => {
                          return (
                            <span>
                              Test {index + 1}:{' '}
                              <span className="gradeText">{grade} %</span>
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <div />
                    )}
                    <hr />
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

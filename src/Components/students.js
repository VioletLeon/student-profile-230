import React, { useState, useEffect } from 'react';
import { getStudents } from '../Hooks/students';

export default function StudentsDisplay(props) {
  const [students, setStudents] = useState([]);
  const [activeStudents, setActiveStudent] = useState([]);
  const [searchInput, setSearchInput] = useState('');

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
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
          <div className="allStudentsContainer">
            {students
              .filter((student) => {
                const studentName = student.firstName + ' ' + student.lastName;

                if (searchInput === '') {
                  return student;
                } else {
                  if (studentName.includes(searchInput)) {
                    return student;
                  }
                }
              })
              .map((student) => {
                student['active'] = false;

                return (
                  <div className="outerStudentContainer">
                    <div className="studentContainer">
                      <div className="studentImageDiv">
                        <img
                          className="studentImage"
                          src={student.pic}
                          alt="studentImage"
                        />
                      </div>
                      <div>
                        <p>
                          <h1 className="studentName">
                            {student.firstName + ' ' + student.lastName}
                          </h1>
                        </p>
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
                            <i class="fas fa-plus"></i>
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
                            <i class="fas fa-minus"></i>
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

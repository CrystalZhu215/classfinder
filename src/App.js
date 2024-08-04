import './App.css';
import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

const config = require('./config.js')
const WS_URL = config.WS_URL;

function App() {
  const [toggle, setToggle] = useState(false);
  const [classes, setClasses] = useState([]);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [sunday, setSunday] = useState(false);
  const [monday, setMonday] = useState(false);
  const [tuesday, setTuesday] = useState(false);
  const [wednesday, setWednesday] = useState(false);
  const [thursday, setThursday] = useState(false);
  const [friday, setFriday] = useState(false);
  const [saturday, setSaturday] = useState(false);
  const [maxSeats, setMaxSeats] = useState(1);
  const [teacher, setTeacher] = useState("");

  const [showMeetings, setShowMeetings] = useState({});
  
  useEffect(() => { render() }, []);

  useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection created.');
    }
  });

  const render = async () => {
    let result = await fetch(
      'http://localhost:5000/loadClasses', {
      method: "post",
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    result = await result.json();
    if (result.status === 201) {
      setClasses(result.classes);
    } else if (result.status === 400) {

    }
  }

  const clearForm = () => {
    setName("");
    setStartDate(null);
    setEndDate(null);
    setStartTime("");
    setEndTime("");
    setSunday(false);
    setMonday(false);
    setTuesday(false);
    setWednesday(false);
    setThursday(false);
    setFriday(false);
    setSaturday(false);
    setMaxSeats(1);
    setTeacher("");
  }

  const createClass = async (e) => {
    e.preventDefault();
    const days = [sunday, monday, tuesday, wednesday, thursday, friday, saturday];
    let result = await fetch('http://localhost:5000/createClass', {
      method: "post",
      body: JSON.stringify({ name, teacher, startDate, endDate, startTime, endTime, days, maxSeats }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    result = await result.json();
    if (result.status === 200) {
      clearForm();
      setToggle(false);
      render();
    } else {
      alert("Something went wrong")
    }

  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const convertTime = (timeData) => {
    const timeString = String(timeData);
    let [timeHour, timeMinute] = timeString.split(':');
    const timeAM = String(Number(timeHour)) + ":" + timeMinute + " AM";
    const timePM = String(Number(timeHour) == 12 ? Number(timeHour) : Number(timeHour) - 12) + ":" + timeMinute + " PM";
    const time = Number(timeHour) < 12 ? timeAM : timePM;
    return time;
  }

  const earlierThan = (timeA, timeB) => {
    let [hourA, minuteA] = timeA.split(':');
    let [hourB, minuteB] = timeB.split(':');
    [hourA, minuteA, hourB, minuteB] = [Number(hourA), Number(minuteA), Number(hourB), Number(minuteB)];
    if (hourA < hourB || (hourA == hourB && minuteA < minuteB)) {
      return true;
    } else {
      return false;
    }
  }

  const datesEqual = (dateA, dateB) => {
    return dateA.getYear() === dateB.getYear() && dateA.getMonth() === dateB.getMonth() && dateA.getDate() === dateB.getDate();
  }

  return (
    <body class="menu">
      {!toggle && (
        <div class="row-menu">
          <button class="button-open-popup btn-menu" onClick={() => setToggle(!toggle)}>Create Class</button>
        </div>
      )}
      {!toggle && (
        <h2>Classes</h2>
      )}
      {toggle && (
        <div class="row overlay-container" id="popupOverlay">
          <div class="popup-box">
            <h2 class="form-title">New Class</h2>
            <form class="form-container">
              <label class="form-label"
                for="name">
                Name:
              </label>
              <input class="form-input" type="text"
                placeholder="Class name"
                id="name" name="name" required value={name} onChange={(e) => setName(e.target.value)}></input>
              <br />

              <label class="form-label" for="startDate">
                First day:
              </label>  
              <input class="form-input" type="date" id="startDate" name="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)}></input>
              <label class="form-label" for="endDate">
                Last day:
              </label>  
              <input class="form-input" type="date" id="endDate" name="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)}></input>
              <br />
              
              <label class="form-label">
                Time:
              </label>  
              <input class="form-input" type="time" id="startTime" name="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)}></input>
              <text> - </text>
              <input class="form-input" type="time" id="endTime" name="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)}></input>
              <br />
              
              <label class="form-label">
                Days: 
              </label>
              <br/> 

              <label class="form-label" for="monday">Monday</label>
              <input class="form-input" type="checkbox" id="monday" name="monday" value={monday} onClick={() => setMonday(!monday)}></input>
              &nbsp;
              &nbsp;
              <label class="form-label" for="tuesday">Tuesday</label>
              <input class="form-input" type="checkbox" id="tuesday" name="tuesday" value={tuesday} onClick={() => setTuesday(!tuesday)}></input>
              &nbsp;
              &nbsp;
              <label class="form-label" for="wednesday">Wednesday</label>
              <input class="form-input" type="checkbox" id="wednesday" name="wednesday" value={wednesday} onClick={() => setWednesday(!wednesday)}></input>
              &nbsp;
              &nbsp;
              <label class="form-label" for="thursday">Thursday</label>
              <input class="form-input" type="checkbox" id="thursday" name="thursday" value={thursday} onClick={() => setThursday(!thursday)}></input>
              &nbsp;
              &nbsp;
              <label class="form-label" for="friday">Friday</label>
              <input class="form-input" type="checkbox" id="friday" name="friday" value={friday} onClick={() => setFriday(!friday)}></input>
              &nbsp;
              &nbsp;
              <label class="form-label" for="saturday">Saturday</label>
              <input class="form-input" type="checkbox" id="saturday" name="saturday" value={saturday} onClick={() => setSaturday(!saturday)}></input>
              &nbsp;
              &nbsp;
              <label class="form-label" for="sunday">Sunday</label>
              <input class="form-input" type="checkbox" id="sunday" name="sunday" value={sunday} onClick={() => setSunday(!sunday)}></input>
              <br />
              
              <label class="form-label"
                for="size">
                Class size:
              </label>
              <input class="form-input" type="text"
                placeholder="Total class seats"
                id="size" name="size" required value={maxSeats} onChange={(e) => setMaxSeats(e.target.value)}></input>
              <br />

              <label class="form-label"
                for="teacher">
                Teacher:
              </label>
              <input class="form-input" type="text"
                placeholder="Assigned teacher"
                id="teacher" name="teacher" value={teacher} onChange={(e) => setTeacher(e.target.value)}></input>
              <br />
              
              <button class="btn-submit"
                type="submit" onClick={createClass}>
                Create
              </button>
            </form>
            <br />
            <button class="button-close-popup btn-menu" onClick={() => setToggle(!toggle)}>Close</button>
          </div>
        </div>
      )}
      {!toggle && (<div class="row-menu" id="classList">
        {
          classes.filter((data) => {
            const today = new Date();
            const endDate = new Date(data.endDate);
            return endDate >= today
          }).sort((a, b) => {
            const earliestMeeting = (data) => {
              let nextMeetingDate = null;
              let nextMeetingTime = null;
              for (var i = 0; i < data.meetings.length; i++) {
                const meetingDate = new Date(data.meetings[i].date);
                if (nextMeetingDate === null || meetingDate < nextMeetingDate) {
                  nextMeetingDate = meetingDate;
                  nextMeetingTime = String(data.meetings[i].startTime);
                }
              }
              return [nextMeetingDate, nextMeetingTime]
            }
            const [earliestMeetingDateA, earliestMeetingTimeA] = earliestMeeting(a);
            const [earliestMeetingDateB, earliestMeetingTimeB] = earliestMeeting(b);
            if (earliestMeetingDateA < earliestMeetingDateB || (datesEqual(earliestMeetingDateA, earliestMeetingDateB) && earlierThan(earliestMeetingTimeA, earliestMeetingTimeB))) {
              return -1;
            } else if (datesEqual(earliestMeetingDateA, earliestMeetingDateB) && earliestMeetingTimeB === earliestMeetingTimeA) {
              return 0;
            } else {
              return 1;
            }
          }).map((data) => {
            const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const classDays = [];

            for (var i = 0; i < daysOfWeek.length; i++) {
              if (data.days[i]) {
                classDays.push(daysOfWeek[i]);
              }
            }

            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);

            const startMonthIndex = startDate.getMonth();
            const endMonthIndex = endDate.getMonth();
            
            const startDay = startDate.getDate();
            const endDay = endDate.getDate();

            const startTime = convertTime(data.startTime);
            const endTime = convertTime(data.endTime);

            return (
              <div class="class-box">
                <div class="class">
                  <h3>{data.name}</h3>
                  <h4>{classDays.join(', ')}</h4>
                  <p>{startTime} - {endTime}</p>
                  <p>Starts: {months[startMonthIndex]} {startDay}, Ends: {months[endMonthIndex]} {endDay}</p>
                  <p>Taught by: {data.teacher ? data.teacher : 'Not yet assigned'}</p>

                  <div>
                    <button value={data._id} onClick={(e) => {
                      let toggles = showMeetings;
                      if (e.target.value in toggles) {
                        toggles[e.target.value] = !toggles[e.target.value];
                      } else {
                        toggles[e.target.value] = true;
                      }
                      setShowMeetings(toggles);
                      render();
                    }}>Show {data.meetings.length} meetings</button>
                    {showMeetings[data._id] && (<div>
                      {data.meetings.map((mtg) => {
                        const date = new Date(mtg.date);
                        return (
                          <p>{months[date.getMonth()]} {date.getDate()} &nbsp; {convertTime(mtg.startTime)} - {convertTime(mtg.endTime)}</p>
                        )
                      })}
                    </div>)}
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>)}
    </body>
  );
}

export default App;

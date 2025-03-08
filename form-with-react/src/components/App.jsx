import { useState } from 'react'
import { Input, TextArea } from './Inputs'
import { Button } from './Button'
import { format } from 'date-fns'
import '../styles/App.css'
import '../styles/index.css'

function App() {
  const [isFilled, setIsFilled] = useState(false);
  const [applicant, setApplicant] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    schoolName: '',
    studied: '',
    startedDateSchool: '',
    finishedDateSchool: '',
    companyName: '',
    positionTitle: '',
    responsabilities: '',
    startedDateJob: '',
    finishedDateJob: ''
  });

  function handleSubmit(e) {
    e.preventDefault();
    console.log('being clicked!', isFilled)
    return setIsFilled(true);
  };

  function handleDates(date) {
    if (date === '') {
      return date = '';
    } else {
      return format(new Date(date), 'MM/dd/yyyy');
    }
  };

  if (isFilled) {
    return (
      <>
        <p className='documentTitle'>CV Application</p>
        <h1 className='reviewApplication'>Review your Application</h1>

        <div className="reviewContainer">
          <section>
            <p><span>Full Name</span>: {applicant.fullName}</p>
            <p><span>Email</span>: {applicant.email}</p>
            <p><span>Phone Number</span>: {applicant.phoneNumber}</p>
          </section>

          <section>
            <p><span>School Name</span>: {applicant.schoolName}</p>
            <p><span>Title of Study</span>: {applicant.studied}</p>
            <p><span>Started Date</span>: {handleDates(applicant.startedDateSchool)}</p>
            <p><span>Finished Date</span>: {handleDates(applicant.finishedDateSchool)}</p>
          </section>

          <section>
            <p><span>Company Name</span>: {applicant.companyName}</p>
            <p><span>Position Title</span>: {applicant.positionTitle}</p>
            <p className='responsabilities'><span>Responsabilities</span>: {applicant.responsabilities}</p>
            <p><span>Started Date</span>: {handleDates(applicant.startedDateJob)}</p>
            <p><span>Finished Date</span>: {handleDates(applicant.finishedDateJob)}</p>
          </section>

        </div>
        <Button
          text='Edit'
          onClick={() => setIsFilled(false)}
        />
      </>
    )
  } else {
    return (
      <>
        <p className='documentTitle'>CV Application</p>
        <form
          onSubmit={handleSubmit}
        >
          <section>
            <h1>General Information</h1>
  
            <Input 
              label='Full Name'
              type='text'
              value={applicant.fullName}
              onChange={(e) => {
                const update = e.target.value;
                setApplicant({...applicant, fullName: update});
              }}
            />
  
            <Input 
              label='Email'
              type='email'
              value={applicant.email}
              onChange={(e) => {
                const update = e.target.value;
                setApplicant({...applicant, email: update});
              }}
            />
  
            <Input 
              label='Phone Number'
              type='number'
              value={applicant.phoneNumber}
              onChange={(e) => {
                const update = e.target.value;
                setApplicant({...applicant, phoneNumber: update});
              }}
            />
          </section>
  
          <section>
              <h1>Educational Experience</h1>
              
              <Input 
                label='School Name'
                type='text'
                value={applicant.schoolName}
                onChange={(e) => {
                  const update = e.target.value;
                  setApplicant({...applicant, schoolName: update});
                }}
              />
  
              <Input 
                label='Title of Study'
                type='text'
                value={applicant.studied}
                onChange={(e) => {
                  const update = e.target.value;
                  setApplicant({...applicant, studied: update});
                }}
              />
  
              <div className='datesWrapper'>
                <Input 
                  label='Started in'
                  type='date'
                  value={applicant.startedDateSchool}
                  onChange={(e) => {
                    const update = e.target.value;
                    setApplicant({...applicant, startedDateSchool: update});
                  }}
                />
  
                <Input 
                  label='Finished in'
                  type='date'
                  value={applicant.finishedDateSchool}
                  onChange={(e) => {
                    const update = e.target.value;
                    setApplicant({...applicant, finishedDateSchool: update});
                  }}
                />
              </div>
          </section>
  
          <section>
            <h1>Professional Experience</h1>
  
            <Input 
                label='Company Name'
                type='text'
                value={applicant.companyName}
                onChange={(e) => {
                  const update = e.target.value;
                  setApplicant({...applicant, companyName: update});
                }}
              />
  
              <Input 
                label='Position Title'
                type='text'
                value={applicant.positionTitle}
                onChange={(e) => {
                  const update = e.target.value;
                  setApplicant({...applicant, positionTitle: update});
                }}
              />
  
              <TextArea
                label='Professional responsabilities'
                value={applicant.responsabilities}
                onChange={(e) => {
                  const update = e.target.value;
                  setApplicant({...applicant, responsabilities: update});
                }}
                placeholder='At least 20 characters...'
              />
  
            <div className='datesWrapper'>
                <Input 
                  label='Started in'
                  type='date'
                  value={applicant.startedDateJob}
                  onChange={(e) => {
                    const update = e.target.value;
                    setApplicant({...applicant, startedDateJob: update});
                  }}
                />
  
                <Input 
                  label='Finished in'
                  type='date'
                  value={applicant.finishedDateJob}
                  onChange={(e) => {
                    const update = e.target.value;
                    setApplicant({...applicant, finishedDateJob: update});
                  }}
                />
              </div>
          </section>
          <Button
            text='Submit'
          />
        </form> 
      </>
    )
  }; // end of else
}

export default App

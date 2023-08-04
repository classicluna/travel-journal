import React from 'react';
const Journals = ({ journalEntries }) => {
  return (
    <div>
      <h1> Your Journal Entries </h1>
      <ul>
        {journalEntries.map((entry) => (
          <li key={entry.id}>{entry.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default Journals;

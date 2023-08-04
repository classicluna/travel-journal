import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = (changeJournalEntries) => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [editingEntryId, setEditingEntryId] = useState(null);
  const navigate = useNavigate();

  const fetchJournalEntries = async () => {
    const userId = auth.currentUser.uid;
    const entriesRef = firestore
      .collection('journalEntries')
      .where('userId', '==', userId);

    try {
      const snapshot = await entriesRef.get();
      const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJournalEntries(entries);
      //changeJournalEntries.changeJournalEntries(journalEntries);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((auth) => {
      unsub();
      if (auth) {
        fetchJournalEntries();
      } else {
        navigate('/sign-in');
      }
    });
  });

  const handleAddEntry = async (e) => {
    e.preventDefault();
    const userId = auth.currentUser.uid;

    try {
      await firestore
        .collection('journalEntries')
        .add({ content: newEntry, userId });
      setNewEntry('');
      fetchJournalEntries(); // Refresh the entries list
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (entryId) => {
    try {
      await firestore.collection('journalEntries').doc(entryId).delete();
      fetchJournalEntries(); // Refresh the entries list after deletion
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (entryId, content) => {
    setEditingEntryId(entryId);
    setNewEntry(content);
  };

  const handleCancelEdit = () => {
    setEditingEntryId(null);
    setNewEntry('');
  };

  const handleUpdateEntry = async (entryId) => {
    try {
      await firestore.collection('journalEntries').doc(entryId).update({
        content: newEntry,
      });
      setEditingEntryId(null);
      setNewEntry('');
      fetchJournalEntries(); // Refresh the entries list after update
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='dashboard-container'>
      <h2 className='dashboard-header'>Travel Journal Dashboard</h2>
      <form className='entry-form' onSubmit={handleAddEntry}>
        <textarea
          rows='4'
          placeholder='Write your journal entry...'
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
        />
        <button type='submit'>Add Entry</button>
      </form>
      <button className='dashboard-buttons' onClick={() => navigate('/')}>
        Go to Home
      </button>
      <button
        className='dashboard-buttons'
        onClick={() => navigate('/journals')}
      >
        View Journal Entries
      </button>
      <ul className='entry-list'>
        {journalEntries.map((entry) => (
          <div key={entry.id} className='entry'>
            {editingEntryId === entry.id ? (
              <div>
                <textarea
                  rows='4'
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                />
                <button onClick={() => handleUpdateEntry(entry.id)}>
                  Update Entry
                </button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <div>
                <li>{entry.content}</li>
                <button onClick={() => handleEdit(entry.id, entry.content)}>
                  Edit Entry
                </button>
                <button onClick={() => handleDelete(entry.id)}>
                  Delete Entry
                </button>
              </div>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

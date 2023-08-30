import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Journals.css';

const Journals = () => {
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

  useEffect(() => {
    console.log('fetching journal entries on journals page...');
    fetchJournalEntries();
  }, []);

  return (
    <div>
      <h1> Your Journal Entries </h1>
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
                <li>
                  {entry.date}: {entry.content}
                </li>
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
      <button onClick={() => navigate('/dashboard')}>
        Go back to Dashboard
      </button>
    </div>
  );
};

export default Journals;

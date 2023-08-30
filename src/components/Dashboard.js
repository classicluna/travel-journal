import React, { useState, useEffect } from 'react';
import { auth, firestore, storage } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setTimeout } from 'timers-promises';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';

const Dashboard = (changeJournalEntries) => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
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

  const warning = () => {
    console.log('Accessing dashboard without sign-in');
    toast.error('Please sign in before accessing the dashboard!', {
      position: 'top-center',
      autoClose: 5000,
      closeOnClick: true,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      toastId: 'error1',
    });
  };

  const pause = async () => {
    await setTimeout(5000);
    console.log('Waited 5s');
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((auth) => {
      unsub();
      if (auth) {
        console.log('refreshing journal entries thru useEffect hook');
        fetchJournalEntries();
      } else {
        warning();
        pause();
        navigate('/sign-in');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    const userId = auth.currentUser.uid;

    try {
      await handleImageUpload(selectedImageFile); // Pass the selected image file
      await firestore.collection('journalEntries').add({
        content: newEntry,
        date: selectedDate,
        userId,
        imageUrl: imageUrl,
      });
      setNewEntry('');
      setSelectedDate('');
      setSelectedImageFile(null);
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

  const handleImageUpload = async (file) => {
    const userId = auth.currentUser.uid;

    const storageRef = ref(storage, `images/${userId}/${file.name}`);

    try {
      uploadBytes(storageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          console.log(`returning url: ${url}`);
          setImageUrl(url);
        });
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
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
        <input
          type='date'
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <input
          type='file'
          accept='image/*'
          onChange={(e) => setSelectedImageFile(e.target.files[0])}
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
    </div>
  );
};

export default Dashboard;

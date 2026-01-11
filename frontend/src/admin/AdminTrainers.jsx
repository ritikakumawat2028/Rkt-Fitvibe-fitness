import React, { useEffect, useState } from 'react';
import { getTrainers, createTrainer, updateTrainer, deleteTrainer } from '../admin/adminApi';
import './AdminUsers.css';
import './AdminTrainers.css';
import defaultTrainerImg from '../assests/trainer.png';

const empty = { name: '', specialty: '', rate: '', image: '', rating: 4.8, experience: '' };

const AdminTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getTrainers();
      setTrainers(res.data || []);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (t) => { setEditing(t); setForm(t); setModalOpen(true); };
  const close = () => { setModalOpen(false); setEditing(null); };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) await updateTrainer(editing._id, form); else await createTrainer(form);
      await load();
      close();
    } catch (e2) {
      setError(e2.response?.data?.message || e2.message);
    }
  };

  const remove = async (id) => {
    try {
      await deleteTrainer(id);
      setTrainers((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    }
  };

  return (
    <div className="admin-trainers-page">
      <div className="users-header-controls card trainers-header">
        <h3 style={{ margin: 0 }}>Trainers</h3>
        <div className="header-buttons">
          <button className="control-button add-button" onClick={openAdd}>+ Add Trainer</button>
        </div>
      </div>

      <div className="users-table-container card">
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && (
          <table className="trainers-table">
            <thead>
              <tr>
                <th>Trainer</th><th>Specialty</th><th>Rate</th><th>Rating</th><th>Experience</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((t) => (
                <tr key={t._id}>
                  <td>
                    <div className="trainer-cell">
                      <img
                        src={t.image || defaultTrainerImg}
                        alt={t.name}
                        className="trainer-avatar"
                      />
                      <span className="trainer-name">{t.name}</span>
                    </div>
                  </td>
                  <td>{t.specialty}</td>
                  <td>{t.rate}</td>
                  <td>{t.rating}</td>
                  <td>{t.experience}</td>
                  <td className="trainer-actions" style={{display: "flex"}}>
                    <button onClick={() => openEdit(t)} className="control-button edit-button">
                      ✏ Edit
                    </button>
                    <button onClick={() => remove(t._id)} className="control-button delete-button">
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? 'Edit Trainer' : 'Add Trainer'}</h3>
            <form onSubmit={save} className="admin-form">
              <input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
              <input placeholder="Specialty" value={form.specialty} onChange={(e)=>setForm({...form,specialty:e.target.value})} required />
              <input placeholder="Rate" value={form.rate} onChange={(e)=>setForm({...form,rate:e.target.value})} />
              <input placeholder="Experience" value={form.experience} onChange={(e)=>setForm({...form,experience:e.target.value})} />
              <input placeholder="Image URL" value={form.image} onChange={(e)=>setForm({...form,image:e.target.value})} />
              <input type="number" step="0.1" placeholder="Rating" value={form.rating} onChange={(e)=>setForm({...form,rating:Number(e.target.value)})} />
              <div className="form-actions">
                <button type="submit" className="control-button add-button">Save</button>
                <button type="button" className="control-button" onClick={close}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrainers;
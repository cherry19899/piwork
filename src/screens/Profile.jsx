import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthContext } from '../contexts/AuthContext';
import { db, storage } from '../services/firebase';
import Button from '../components/Button';
import styles from './Profile.module.css';

export default function Profile() {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthContext();
  
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isEditingOpen, setIsEditingOpen] = useState(false);
  const [stats, setStats] = useState({ taskCount: 0, avgRating: 0, completedCount: 0 });
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: [],
    avatar: null
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const targetUserId = user_id || currentUser?.uid;
        if (!targetUserId) return;

        setIsOwnProfile(targetUserId === currentUser?.uid);

        // Get user profile
        const userDoc = await getDoc(doc(db, 'users', targetUserId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfileUser(userData);
          setFormData({
            name: userData.displayName || '',
            bio: userData.bio || '',
            skills: userData.skills || [],
            avatar: userData.photoURL || null
          });
        }

        // Get statistics
        const tasksSnap = await getDocs(query(
          collection(db, 'tasks'),
          where('creatorId', '==', targetUserId)
        ));
        const completedSnap = await getDocs(query(
          collection(db, 'tasks'),
          where('creatorId', '==', targetUserId),
          where('status', '==', 'completed')
        ));

        const ratings = [];
        tasksSnap.docs.forEach(doc => {
          if (doc.data().rating) ratings.push(doc.data().rating);
        });

        setStats({
          taskCount: tasksSnap.size,
          completedCount: completedSnap.size,
          avgRating: ratings.length > 0 ? (ratings.reduce((a, b) => a + b) / ratings.length).toFixed(1) : 0
        });

        setLoading(false);
      } catch (error) {
        console.error('Error loading profile:', error);
        setLoading(false);
      }
    };

    loadProfile();
  }, [user_id, currentUser?.uid]);

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Compress image to 500KB
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          height = (height * 512) / width;
          width = 512;
        } else {
          width = (width * 512) / height;
          height = 512;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          
          try {
            const storageRef = ref(storage, `avatars/${currentUser?.uid}`);
            await uploadBytes(storageRef, blob);
            const url = await getDownloadURL(storageRef);
            setFormData(prev => ({ ...prev, avatar: url }));
          } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Failed to upload avatar');
          }
        }, 'image/jpeg', 0.8);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Add skill
  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput]
      }));
      setSkillInput('');
    }
  };

  // Remove skill
  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!currentUser?.uid) return;
    
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        displayName: formData.name,
        bio: formData.bio,
        skills: formData.skills,
        ...(formData.avatar && { photoURL: formData.avatar })
      });

      alert('Profile updated successfully!');
      setIsEditingOpen(false);
      setProfileUser(prev => ({
        ...prev,
        displayName: formData.name,
        bio: formData.bio,
        skills: formData.skills,
        photoURL: formData.avatar
      }));
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Loading profile...</div></div>;
  }

  if (!profileUser) {
    return <div className={styles.container}><div className={styles.error}>User not found</div></div>;
  }

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>←</button>

      <div className={styles.header}>
        <img
          src={profileUser.photoURL || '/default-avatar.png'}
          alt={profileUser.displayName}
          className={styles.avatar}
        />
        <div className={styles.info}>
          <h1>{profileUser.displayName || 'Unnamed User'}</h1>
          <p className={styles.bio}>{profileUser.bio}</p>
        </div>

        {isOwnProfile && (
          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsEditingOpen(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.taskCount}</div>
          <div className={styles.statLabel}>Tasks Posted</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.completedCount}</div>
          <div className={styles.statLabel}>Completed</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.avgRating}</div>
          <div className={styles.statLabel}>Avg Rating</div>
        </div>
      </div>

      {profileUser.skills?.length > 0 && (
        <div className={styles.skills}>
          <h2>Skills</h2>
          <div className={styles.skillsList}>
            {profileUser.skills.map(skill => (
              <span key={skill} className={styles.skill}>{skill}</span>
            ))}
          </div>
        </div>
      )}

      {isEditingOpen && isOwnProfile && (
        <div className={styles.modalOverlay} onClick={() => setIsEditingOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Edit Profile</h2>
              <button onClick={() => setIsEditingOpen(false)} className={styles.closeBtn}>✕</button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label>Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className={styles.fileInput}
                />
                {formData.avatar && (
                  <img src={formData.avatar} alt="Preview" className={styles.avatarPreview} />
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={styles.input}
                  maxLength={50}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className={styles.textarea}
                  maxLength={500}
                  rows={4}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Skills</label>
                <div className={styles.skillsInput}>
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Add a skill and press Enter"
                    className={styles.input}
                  />
                  <Button variant="secondary" size="sm" onClick={addSkill} type="button">
                    Add
                  </Button>
                </div>
                <div className={styles.skillsList}>
                  {formData.skills.map(skill => (
                    <div key={skill} className={styles.skillTag}>
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)}>✕</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.modalFooter}>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setIsEditingOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSaveProfile}
                  loading={saving}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

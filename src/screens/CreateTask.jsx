import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { usePayments } from '../hooks/usePayments';
import { validateInput } from '../utils/validateInput';
import Button from '../components/Button';
import styles from './CreateTask.module.css';

const COMMISSION_PERCENTAGE = 0.05; // 5% commission

export default function CreateTask() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createTask } = useTasks();
  const { createPayment } = usePayments();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'writing',
    budget: '',
    deadline: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title || formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    // Description validation
    if (!formData.description || formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    // Budget validation
    const budget = parseFloat(formData.budget);
    if (!formData.budget || isNaN(budget) || budget <= 0) {
      newErrors.budget = 'Budget must be a number greater than 0';
    }

    // Deadline validation
    if (!formData.deadline) {
      newErrors.deadline = 'Please select a deadline';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today) {
        newErrors.deadline = 'Deadline cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const budget = parseFloat(formData.budget);
      const commission = budget * COMMISSION_PERCENTAGE;
      const totalAmount = budget + commission;

      // Step 1: Create payment for budget + commission
      const paymentId = await createPayment({
        amount: totalAmount,
        memo: `Task: ${formData.title}`,
      });

      if (!paymentId) {
        setErrors({ submit: 'Payment creation failed' });
        setLoading(false);
        return;
      }

      // Step 2: Create task in Firestore
      const taskId = await createTask({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget: budget,
        commission: commission,
        deadline: new Date(formData.deadline),
        status: 'open',
        creatorId: user.uid,
        creatorName: user.displayName || 'Anonymous',
        creatorAvatar: user.photoURL || '👤',
        paymentId: paymentId,
        createdAt: new Date(),
      });

      setSubmitted(true);
      setTimeout(() => {
        navigate(`/task/${taskId}`);
      }, 1500);
    } catch (error) {
      console.error('Error creating task:', error);
      setErrors({ submit: error.message || 'Failed to create task' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.container}>
        <div className={styles.success}>
          <h2>Task Created Successfully!</h2>
          <p>Redirecting to your task...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>Create a New Task</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Title Field */}
          <div className={styles.formGroup}>
            <label htmlFor="title">Task Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Write 5 product descriptions"
              maxLength={100}
              className={errors.title ? styles.errorInput : ''}
            />
            {errors.title && <span className={styles.error}>{errors.title}</span>}
            <span className={styles.charCount}>{formData.title.length}/100</span>
          </div>

          {/* Category Field */}
          <div className={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="writing">Writing</option>
              <option value="design">Design</option>
              <option value="development">Development</option>
              <option value="data">Data Entry</option>
              <option value="audio">Audio/Transcription</option>
              <option value="video">Video</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description Field */}
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of what needs to be done..."
              maxLength={1000}
              rows={6}
              className={errors.description ? styles.errorInput : ''}
            />
            {errors.description && (
              <span className={styles.error}>{errors.description}</span>
            )}
            <span className={styles.charCount}>{formData.description.length}/1000</span>
          </div>

          {/* Budget Field */}
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="budget">Budget (π)</label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="10"
                min="0"
                step="0.1"
                className={errors.budget ? styles.errorInput : ''}
              />
              {errors.budget && <span className={styles.error}>{errors.budget}</span>}
              {formData.budget && (
                <span className={styles.commission}>
                  + {(parseFloat(formData.budget) * COMMISSION_PERCENTAGE).toFixed(2)}π commission
                </span>
              )}
            </div>

            {/* Deadline Field */}
            <div className={styles.formGroup}>
              <label htmlFor="deadline">Deadline</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={errors.deadline ? styles.errorInput : ''}
              />
              {errors.deadline && <span className={styles.error}>{errors.deadline}</span>}
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}

          {/* Submit Button */}
          <div className={styles.buttonGroup}>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              loading={loading}
              disabled={loading}
              onClick={handleSubmit}
            >
              Create Task
            </Button>
          </div>

          {/* Info */}
          <div className={styles.info}>
            <p>
              You will be prompted to authorize a payment for {formData.budget || '0'}π +
              commission. Funds are held securely until the task is completed.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

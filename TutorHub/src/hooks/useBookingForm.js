// useBookingForm.js -- src/hooks/
import { useState, useCallback } from 'react';
const INITIAL_STATE = {
 subjectId: null,
 subjectName: '',
 teachingMode: 'Online', // 'Online' | 'InPerson'
 selectedDate: null, // Date object from react-datepicker
 selectedSlot: null, // { startTime, endTime, dayOfWeek }
 durationMinutes: 60, // 30 | 60 | 90 | 120
 studentNotes: '',
};
const STEPS = ['Details', 'Time Slot', 'Duration & Review'];
export const useBookingForm = () => {
 const [step, setStep] = useState(1); // 1, 2, or 3
 const [form, setForm] = useState(INITIAL_STATE);
 const [errors, setErrors] = useState({});
 const setField = useCallback((field, value) => {
 setForm(prev => ({ ...prev, [field]: value }));
 setErrors(prev => ({ ...prev, [field]: undefined })); // Clear error on change
 }, []);
 const validateStep = useCallback((currentStep) => {
 const errs = {};
 if (currentStep === 1) {
 if (!form.subjectId) errs.subjectId = 'Please select a subject';
 if (!form.selectedDate) errs.selectedDate = 'Please choose a date';
 // Date must be at least 2 hours in the future
 if (form.selectedDate) {
 const minDate = new Date(Date.now() + 2 * 60 * 60 * 1000);
 if (form.selectedDate < minDate)
 errs.selectedDate = 'Date must be at least 2 hours from now';
 }
 }
 if (currentStep === 2) {
 if (!form.selectedSlot) errs.selectedSlot = 'Please select a time slot';
 }
 setErrors(errs);
 return Object.keys(errs).length === 0;
 }, [form]);
 const nextStep = useCallback(() => {
 if (validateStep(step)) setStep(s => Math.min(s + 1, 3));
 }, [step, validateStep]);
 const prevStep = useCallback(() => {
 setStep(s => Math.max(s - 1, 1));
 setErrors({});
 }, []);
 const resetForm = useCallback(() => {
 setForm(INITIAL_STATE);
 setStep(1);
 setErrors({});
 }, []);
 return { step, form, errors, steps: STEPS, setField, nextStep, prevStep, resetForm };

};
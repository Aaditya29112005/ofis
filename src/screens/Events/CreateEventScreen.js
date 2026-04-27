import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ChevronDown, Calendar as CalendarIcon, Clock, MapPin, Users, Save } from 'lucide-react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';
import { useEventsStore } from '../../store/useEventsStore';

import FilterDropdown from '../../components/FilterDropdown';
import CalendarDatePicker from '../../components/Reception/CalendarDatePicker';
import SpeakerInputGroup from '../../components/Events/SpeakerInputGroup';



const CATEGORIES = [
  { label: 'Networking', value: 'Networking' },
  { label: 'Education', value: 'Education' },
  { label: 'Social', value: 'Social' },
  { label: 'Workshop', value: 'Workshop' },
];

const STATUS_OPTS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
];

const EventSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  startDate: Yup.string().required('Start date is required'),
  startTime: Yup.string().required('Start time is required'),
  endDate: Yup.string().required('End date is required').test('is-after', 'End date must be after start date', function(value) {
    const { startDate } = this.parent;
    return new Date(value) >= new Date(startDate);
  }),
  endTime: Yup.string().required('End time is required'),
  location: Yup.string().required('Location is required'),
  capacity: Yup.number().min(0, 'Capacity cannot be negative'),
});

const CreateEventScreen = ({ navigation, route }) => {
  const { isDark, colors } = useTheme();
  const { addEvent, updateEvent } = useEventsStore();
  const editMode = route.params?.edit || false;
  const initialEvent = route.params?.event;

  const [activePicker, setActivePicker] = useState(null); // { type: 'date'|'time', field: string }
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const initialValues = editMode ? {
    title: initialEvent.title,
    description: initialEvent.description,
    category: initialEvent.category,
    startDate: initialEvent.start.split('T')[0],
    startTime: initialEvent.start.split('T')[1].substring(0, 5),
    endDate: initialEvent.end.split('T')[0],
    endTime: initialEvent.end.split('T')[1].substring(0, 5),
    location: initialEvent.location,
    capacity: initialEvent.capacity || 0,
    status: initialEvent.status,
    speakers: initialEvent.speakers || [],
    mapsLink: initialEvent.mapsLink || '',
  } : {
    title: '',
    description: '',
    category: 'Networking',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endDate: new Date().toISOString().split('T')[0],
    endTime: '12:00',
    location: '',
    capacity: 0,
    status: 'draft',
    speakers: [],
    mapsLink: '',
  };

  const handleSubmit = (values) => {
    const eventData = {
      ...values,
      start: `${values.startDate}T${values.startTime}:00`,
      end: `${values.endDate}T${values.endTime}:00`,
    };

    if (editMode) {
      updateEvent(initialEvent.id, eventData);
      Alert.alert('Success', 'Event updated successfully');
    } else {
      addEvent(eventData);
      Alert.alert('Success', 'Event created successfully');
    }
    navigation.goBack();
  };

  const renderInput = (label, value, onChange, placeholder, error, multiline = false) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: isDark ? '#94A3B8' : '#6B7280' }]}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const renderPickerTrigger = (label, value, onPress, icon, error) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: isDark ? '#94A3B8' : '#6B7280' }]}>{label}</Text>
      <TouchableOpacity 
        style={[styles.pickerTrigger, { borderColor: colors.border, backgroundColor: colors.surface }]} 
        onPress={onPress}
      >
        <Text style={[styles.pickerValue, { color: value ? colors.text : colors.textMuted }]}>{value || 'Select'}</Text>
        {icon}
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>{editMode ? 'Edit Event' : 'Create Event'}</Text>
          <View style={{ width: 24 }} />
        </View>

        <Formik
          initialValues={initialValues}
          validationSchema={EventSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue, touched }) => (
            <>
              <ScrollView style={styles.form} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                
                {renderInput('Title *', values.title, handleChange('title'), 'Event Title', touched.title && errors.title)}
                
                {renderInput('Description *', values.description, handleChange('description'), 'Event details...', touched.description && errors.description, true)}

                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    {renderPickerTrigger('Category', values.category, () => setShowCategoryPicker(true), <ChevronDown size={18} color="#64748B" />, touched.category && errors.category)}
                  </View>
                  <View style={{ flex: 1 }}>
                    {renderPickerTrigger('Status', values.status, () => setShowStatusPicker(true), <ChevronDown size={18} color="#64748B" />, touched.status && errors.status)}
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    {renderPickerTrigger('Start Date', values.startDate, () => setActivePicker({ type: 'date', field: 'startDate' }), <CalendarIcon size={18} color="#64748B" />, touched.startDate && errors.startDate)}
                  </View>
                  <View style={{ flex: 1 }}>
                     {renderInput('Start Time', values.startTime, handleChange('startTime'), '10:00', touched.startTime && errors.startTime)}
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    {renderPickerTrigger('End Date', values.endDate, () => setActivePicker({ type: 'date', field: 'endDate' }), <CalendarIcon size={18} color="#64748B" />, touched.endDate && errors.endDate)}
                  </View>
                  <View style={{ flex: 1 }}>
                    {renderInput('End Time', values.endTime, handleChange('endTime'), '12:00', touched.endTime && errors.endTime)}
                  </View>
                </View>

                {renderInput('Location *', values.location, handleChange('location'), 'Full address', touched.location && errors.location)}
                
                {renderInput('Google Maps Link', values.mapsLink, handleChange('mapsLink'), 'https://maps.google.com/...')}

                {renderInput('Capacity (0 = Unlimted)', values.capacity.toString(), (val) => setFieldValue('capacity', val), '0', touched.capacity && errors.capacity)}

                <View style={styles.divider} />

                <SpeakerInputGroup 
                  speakers={values.speakers}
                  onAdd={() => setFieldValue('speakers', [...values.speakers, { name: '', bio: '', image: '' }])}
                  onRemove={(idx) => setFieldValue('speakers', values.speakers.filter((_, i) => i !== idx))}
                  onChange={(idx, field, val) => {
                    const newSpeakers = [...values.speakers];
                    newSpeakers[idx][field] = val;
                    setFieldValue('speakers', newSpeakers);
                  }}
                />

              </ScrollView>

              <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: colors.surface }]} onPress={() => navigation.goBack()}>
                   <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.saveBtn, { backgroundColor: '#f97316' }]} onPress={handleSubmit}>
                   <Save size={18} color="#FFF" />
                   <Text style={styles.saveBtnText}>{editMode ? 'Update' : 'Save Event'}</Text>
                </TouchableOpacity>
              </View>

              {/* Modals */}
              <CalendarDatePicker 
                visible={!!activePicker && activePicker.type === 'date'}
                onClose={() => setActivePicker(null)}
                onSelect={(date) => {
                  setFieldValue(activePicker.field, date);
                  setActivePicker(null);
                }}
                selectedDate={activePicker ? values[activePicker.field] : null}
              />

              <FilterDropdown 
                visible={showCategoryPicker}
                title="Select Category"
                options={CATEGORIES}
                selectedOption={CATEGORIES.find(c => c.value === values.category)}
                onClose={() => setShowCategoryPicker(false)}
                onSelect={(opt) => {
                  setFieldValue('category', opt.value);
                  setShowCategoryPicker(false);
                }}
              />

              <FilterDropdown 
                visible={showStatusPicker}
                title="Select Status"
                options={STATUS_OPTS}
                selectedOption={STATUS_OPTS.find(s => s.value === values.status)}
                onClose={() => setShowStatusPicker(false)}
                onSelect={(opt) => {
                  setFieldValue('status', opt.value);
                  setShowStatusPicker(false);
                }}
              />
            </>
          )}
        </Formik>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg },
  backBtn: { padding: 4 },
  title: { fontFamily: FONTS.bold, fontSize: 20 },
  form: { flex: 1, paddingHorizontal: SPACING.lg },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontFamily: FONTS.bold, fontSize: 13, marginBottom: 8, textTransform: 'uppercase' },
  input: { height: 52, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, fontFamily: FONTS.medium, fontSize: 15 },
  textArea: { height: 100, paddingTop: 12, textAlignVertical: 'top' },
  pickerTrigger: { height: 52, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pickerValue: { fontFamily: FONTS.medium, fontSize: 15 },
  errorText: { color: '#EF4444', fontFamily: FONTS.medium, fontSize: 11, marginTop: 4, marginLeft: 4 },
  row: { flexDirection: 'row', gap: 12 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 24 },
  footer: { padding: SPACING.lg, flexDirection: 'row', gap: 12, borderTopWidth: 1, paddingBottom: 32 },
  cancelBtn: { flex: 1, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelBtnText: { fontFamily: FONTS.bold, fontSize: 14 },
  saveBtn: { flex: 2, height: 52, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  saveBtnText: { fontFamily: FONTS.bold, fontSize: 14, color: '#FFF' },
});

export default CreateEventScreen;

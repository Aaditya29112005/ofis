import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../theme/colors';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';
import FilterDropdown from '../components/FilterDropdown';
import FileUpload from '../components/FileUpload';

const MOCK_CLIENTS = [
  { label: 'Acme Corp', value: 'Acme Corp' },
  { label: 'Startup Inc', value: 'Startup Inc' },
  { label: 'Internal Options', value: 'Internal' },
];

const MOCK_BUILDINGS = [
  { label: 'Alpha Tower', value: 'Alpha Tower' },
  { label: 'Beta Hub', value: 'Beta Hub' },
];

const MOCK_ASSIGNEES = [
  { label: 'John Technician', value: 'John Technician' },
  { label: 'Facilities Team', value: 'Facilities Team' },
  { label: 'Plumbing', value: 'Plumbing' },
];

const CATEGORY_MAP = {
  'Electricity': [{ label: 'Washroom', value: 'Washroom' }, { label: 'Balcony', value: 'Balcony' }, { label: 'Appliance', value: 'Appliance' }],
  'Cleaning': [{ label: 'Washroom', value: 'Washroom' }, { label: 'Cafeteria', value: 'Cafeteria' }, { label: 'Workspace', value: 'Workspace' }],
  'Wifi': [{ label: 'Connection Drop', value: 'Connection Drop' }, { label: 'Slow Speed', value: 'Slow Speed' }],
  'Pantry': [{ label: 'Supplies', value: 'Supplies' }, { label: 'Appliance', value: 'Appliance'}],
};

const CATEGORIES = Object.keys(CATEGORY_MAP).map(k => ({ label: k, value: k }));
const PRIORITIES = [
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
  { label: 'Urgent', value: 'Urgent' },
];
const STATUSES = [
  { label: 'Open', value: 'Open' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Resolved', value: 'Resolved' },
  { label: 'Closed', value: 'Closed' },
];

const FormSection = ({ title, children }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
};

const FieldLabel = ({ label, required }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.labelRow}>
      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
      {required && <Text style={[styles.required, { color: colors.error }]}> *</Text>}
    </View>
  );
};

const InputField = ({ placeholder, isTextArea, value, onChangeText, error }) => {
  const { colors, isDark } = useTheme();
  return (
    <View style={styles.fieldOuterContainer}>
      <View style={[
        styles.inputContainer, 
        isTextArea && styles.textAreaContainer, 
        { 
          backgroundColor: isDark ? colors.surfaceElevated : colors.surface,
          borderColor: error ? colors.error : colors.border,
        }
      ]}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.text }, isTextArea && styles.textArea]}
          multiline={isTextArea}
          numberOfLines={isTextArea ? 4 : 1}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      {error ? <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text> : null}
    </View>
  );
};

const DropdownSelector = ({ label, value, onPress, disabled, rightIcon = "chevron-down-outline" }) => {
  const { colors, isDark } = useTheme();
  return (
    <TouchableOpacity 
      style={[
        styles.dropdownContainer, 
        { 
          backgroundColor: disabled ? (isDark ? '#222' : '#f0f0f0') : (isDark ? colors.surfaceElevated : colors.surface),
          borderColor: value ? '#FF8A00' : colors.border,
          opacity: disabled ? 0.6 : 1
        }
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.dropdownText, { color: value ? colors.text : colors.textMuted }]}>
        {value || `Select ${label}`}
      </Text>
      <Icon name={rightIcon} size={18} color={value ? '#FF8A00' : '#A0A0A0'} />
    </TouchableOpacity>
  );
};

const CreateTicketScreen = ({ navigation }) => {
  const { colors } = useTheme();

  // Form State
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  
  const [priority, setPriority] = useState({ label: 'Medium', value: 'Medium' });
  const [status, setStatus] = useState({ label: 'Open', value: 'Open' });
  const [client, setClient] = useState(null);
  const [building, setBuilding] = useState(null);
  const [assignedTo, setAssignedTo] = useState(null);
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  
  const [attachments, setAttachments] = useState([]);

  // Errors
  const [errors, setErrors] = useState({});

  // Dropdown States
  const [filterType, setFilterType] = useState(null);

  // Dependent subcategories effect
  useEffect(() => {
    setSubcategory(null); // Reset subcategory when category changes
  }, [category]);

  const validate = () => {
    let newErrors = {};
    if (!subject.trim()) newErrors.subject = 'Subject is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = subject.trim() && description.trim() && category;

  const handleSubmit = () => {
    if (validate()) {
      // API call to create ticket
      console.log('Ticket Form Submitted:', { subject, description, priority, category, subcategory });
      navigation.goBack();
    }
  };

  const getDropdownData = () => {
    switch (filterType) {
      case 'priority': return { options: PRIORITIES, title: 'Priority', selected: priority, onSelect: setPriority };
      case 'status': return { options: STATUSES, title: 'Status', selected: status, onSelect: setStatus };
      case 'client': return { options: MOCK_CLIENTS, title: 'Client', selected: client, onSelect: setClient, searchable: true };
      case 'building': return { options: MOCK_BUILDINGS, title: 'Building', selected: building, onSelect: setBuilding };
      case 'assignedTo': return { options: MOCK_ASSIGNEES, title: 'Assignee', selected: assignedTo, onSelect: setAssignedTo, searchable: true };
      case 'category': return { options: CATEGORIES, title: 'Category', selected: category, onSelect: setCategory };
      case 'subcategory': return { 
        options: category ? CATEGORY_MAP[category.value] : [], 
        title: 'Subcategory', selected: subcategory, onSelect: setSubcategory 
      };
      default: return { options: [], title: '', selected: null, onSelect: () => {} };
    }
  };

  const { options, title, selected, onSelect, searchable } = getDropdownData();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back-outline" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>New Ticket</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollArea}>
        <FormSection title="Basic Info">
          <View style={styles.fieldWrapper}>
            <FieldLabel label="Subject" required />
            <InputField 
              placeholder="E.g., AC not working" 
              value={subject}
              onChangeText={(v) => { setSubject(v); setErrors(prev => ({...prev, subject: null}))}}
              error={errors.subject}
            />
          </View>
          <View style={styles.fieldWrapper}>
            <FieldLabel label="Description" required />
            <InputField 
              placeholder="Detailed description of the issue" 
              isTextArea
              value={description}
              onChangeText={(v) => { setDescription(v); setErrors(prev => ({...prev, description: null}))}}
              error={errors.description}
            />
          </View>
          <View style={styles.fieldWrapper}>
            <FieldLabel label="Priority" />
            <DropdownSelector 
              label="Priority" 
              value={priority?.label} 
              onPress={() => setFilterType('priority')} 
            />
          </View>
        </FormSection>

        <FormSection title="Category Details">
          <View style={styles.row}>
            <View style={[styles.fieldWrapper, { flex: 1, marginRight: SPACING.md }]}>
              <FieldLabel label="Category" required />
              <DropdownSelector 
                label="Category" 
                value={category?.label} 
                onPress={() => setFilterType('category')} 
              />
              {errors.category && <Text style={[styles.errorText, { color: colors.error }]}>{errors.category}</Text>}
            </View>
            <View style={[styles.fieldWrapper, { flex: 1 }]}>
              <FieldLabel label="Subcategory" />
              <DropdownSelector 
                label="Subcategory" 
                value={subcategory?.label} 
                onPress={() => setFilterType('subcategory')} 
                disabled={!category}
              />
            </View>
          </View>
        </FormSection>

        <FormSection title="Associations">
          <View style={styles.fieldWrapper}>
             <FieldLabel label="Client" />
             <DropdownSelector label="Client" value={client?.label} onPress={() => setFilterType('client')} rightIcon="information-circle-outline" />
          </View>
          <View style={styles.row}>
            <View style={[styles.fieldWrapper, { flex: 1, marginRight: SPACING.md }]}>
              <FieldLabel label="Building" />
              <DropdownSelector label="Building" value={building?.label} onPress={() => setFilterType('building')} rightIcon="information-circle-outline" />
            </View>
            <View style={[styles.fieldWrapper, { flex: 1 }]}>
              <FieldLabel label="Assigned To" />
              <DropdownSelector label="Assignee" value={assignedTo?.label} onPress={() => setFilterType('assignedTo')} rightIcon="information-circle-outline" />
            </View>
          </View>
          <View style={styles.fieldWrapper}>
             <FieldLabel label="Status" />
             <DropdownSelector label="Status" value={status?.label} onPress={() => setFilterType('status')} rightIcon="information-circle-outline" />
          </View>
        </FormSection>

        <FormSection title="Attachments">
          <FileUpload attachments={attachments} onUpdate={setAttachments} />
        </FormSection>

      </ScrollView>

      {/* Footer Action */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.submitBtn, { backgroundColor: isFormValid ? colors.primary : colors.textMuted }]}
          disabled={!isFormValid}
          onPress={handleSubmit}
        >
          <Text style={styles.submitBtnText}>Create Ticket</Text>
        </TouchableOpacity>
      </View>

      <FilterDropdown 
        visible={!!filterType}
        onClose={() => setFilterType(null)}
        options={options}
        title={title}
        selectedOption={selected}
        onSelect={onSelect}
        searchable={searchable}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
  },
  scrollArea: {
    padding: SPACING.md,
    paddingBottom: 100,
  },
  sectionContainer: {
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg, // 18
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
  },
  fieldWrapper: {
    marginBottom: SPACING.md,
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  fieldLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
  },
  required: {
    fontSize: FONT_SIZE.sm,
  },
  inputContainer: {
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  textAreaContainer: {
    height: 120,
    paddingVertical: 12,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  input: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.md,
    width: '100%',
  },
  textArea: {
    height: '100%',
    textAlignVertical: 'top',
  },
  dropdownContainer: {
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  dropdownText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.md,
  },
  errorText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
    marginLeft: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.md,
    paddingBottom: 30, // SafeArea spacing
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  submitBtn: {
    height: 52,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: '#FFFFFF',
  }
});

export default CreateTicketScreen;

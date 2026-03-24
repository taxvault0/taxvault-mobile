export const ENABLE_DEMO_LOGINS = true;

const createTaxProfile = ({
  employment = false,
  gigWork = false,
  selfEmployment = false,
  incorporatedBusiness = false,
} = {}) => ({
  employment,
  gigWork,
  selfEmployment,
  incorporatedBusiness,
});

const createProfile = ({
  name,
  userType = 'regular',
  taxProfile,
  maritalStatus = 'Single',
  spouseInfo = null,
  dependents = [],
  businessName,
  platforms = [],
}) => ({
  name,
  userType,
  taxProfile,
  maritalStatus,
  spouseInfo,
  dependents,
  platforms,
  ...(businessName ? { businessName } : {}),
});

const createDemoUser = ({
  id,
  title,
  email,
  password = 'demo1234',
  role = 'user',
  tone = 'blue',
  profile,
}) => ({
  id,
  title,
  email,
  password,
  role,
  tone,
  profile,
});

const INCOME_STATES = [
  {
    key: 'unemployed',
    label: 'Unemployed',
    userType: 'regular',
    taxProfile: createTaxProfile({}),
    platforms: [],
    businessName: '',
  },
  {
    key: 'employed',
    label: 'Employed',
    userType: 'employee',
    taxProfile: createTaxProfile({ employment: true }),
    platforms: [],
    businessName: '',
  },
  {
    key: 'self-employed',
    label: 'Self-Employed',
    userType: 'self-employed',
    taxProfile: createTaxProfile({ selfEmployment: true, gigWork: true }),
    platforms: ['Uber', 'DoorDash'],
    businessName: '',
  },
  {
    key: 'business',
    label: 'Business',
    userType: 'business',
    taxProfile: createTaxProfile({ incorporatedBusiness: true }),
    platforms: [],
    businessName: 'Demo Business Inc.',
  },
  {
    key: 'employed-self-employed',
    label: 'Employed + Self-Employed',
    userType: 'self-employed',
    taxProfile: createTaxProfile({ employment: true, selfEmployment: true, gigWork: true }),
    platforms: ['Uber'],
    businessName: '',
  },
  {
    key: 'employed-business',
    label: 'Employed + Business',
    userType: 'business',
    taxProfile: createTaxProfile({ employment: true, incorporatedBusiness: true }),
    platforms: [],
    businessName: 'Demo Business Inc.',
  },
  {
    key: 'self-employed-business',
    label: 'Self-Employed + Business',
    userType: 'business',
    taxProfile: createTaxProfile({
      selfEmployment: true,
      gigWork: true,
      incorporatedBusiness: true,
    }),
    platforms: ['DoorDash'],
    businessName: 'Demo Business Inc.',
  },
  {
    key: 'employed-self-employed-business',
    label: 'Employed + Self-Employed + Business',
    userType: 'business',
    taxProfile: createTaxProfile({
      employment: true,
      selfEmployment: true,
      gigWork: true,
      incorporatedBusiness: true,
    }),
    platforms: ['Uber', 'DoorDash'],
    businessName: 'Demo Business Inc.',
  },
];

const spouseInfoFromState = (state, index) => ({
  name: `Spouse ${index}`,
  incomeType: state.label,
  annualIncome:
    state.key === 'unemployed'
      ? '0'
      : state.key.includes('business')
      ? '90000'
      : state.key.includes('self-employed')
      ? '45000'
      : '65000',
  taxProfile: state.taxProfile,
});

const singleScenario = (state, index) =>
  createDemoUser({
    id: `u-${state.key}`,
    title: `U-${state.label}`,
    email: `u-${state.key}@demo.com`,
    profile: createProfile({
      name: `Demo User ${index}`,
      userType: state.userType,
      taxProfile: state.taxProfile,
      maritalStatus: 'Single',
      spouseInfo: null,
      dependents: [],
      businessName: state.businessName,
      platforms: state.platforms,
    }),
  });

const householdScenario = (userState, spouseState, index) =>
  createDemoUser({
    id: `u-${userState.key}-s-${spouseState.key}`,
    title: `U-${userState.label} + S-${spouseState.label}`,
    email: `u-${userState.key}-s-${spouseState.key}@demo.com`,
    profile: createProfile({
      name: `Demo Household ${index}`,
      userType: userState.userType,
      taxProfile: userState.taxProfile,
      maritalStatus: 'Married',
      spouseInfo: spouseInfoFromState(spouseState, index),
      dependents: [],
      businessName: userState.businessName,
      platforms: userState.platforms,
    }),
  });

const singleUsers = INCOME_STATES.map((state, index) => singleScenario(state, index + 1));

const householdUsers = INCOME_STATES.flatMap((userState, userIndex) =>
  INCOME_STATES.map((spouseState, spouseIndex) =>
    householdScenario(userState, spouseState, `${userIndex + 1}-${spouseIndex + 1}`)
  )
);

export const demoUsers = [...singleUsers, ...householdUsers];

export const toneMap = {
  blue: {
    bg: '#EFF6FF',
    border: '#BFDBFE',
    title: '#1D4ED8',
    text: '#1E3A8A',
    badgeBg: '#DBEAFE',
  },
  green: {
    bg: '#ECFDF5',
    border: '#A7F3D0',
    title: '#047857',
    text: '#065F46',
    badgeBg: '#D1FAE5',
  },
  amber: {
    bg: '#FFFBEB',
    border: '#FDE68A',
    title: '#B45309',
    text: '#92400E',
    badgeBg: '#FEF3C7',
  },
  purple: {
    bg: '#FAF5FF',
    border: '#D8B4FE',
    title: '#7E22CE',
    text: '#6B21A8',
    badgeBg: '#E9D5FF',
  },
  indigo: {
    bg: '#EEF2FF',
    border: '#C7D2FE',
    title: '#4338CA',
    text: '#3730A3',
    badgeBg: '#E0E7FF',
  },
  teal: {
    bg: '#F0FDFA',
    border: '#99F6E4',
    title: '#0F766E',
    text: '#115E59',
    badgeBg: '#CCFBF1',
  },
  rose: {
    bg: '#FFF1F2',
    border: '#FDA4AF',
    title: '#BE123C',
    text: '#9F1239',
    badgeBg: '#FFE4E6',
  },
  slate: {
    bg: '#F8FAFC',
    border: '#CBD5E1',
    title: '#334155',
    text: '#475569',
    badgeBg: '#E2E8F0',
  },
};

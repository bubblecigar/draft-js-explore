const map = {
  AMI: 'Acute Myocardial Infarction',
  CHD: 'Congenital Heart Disease',
  CHF: 'Congenital Heart Failure',
  AF: 'Atrial Flutter',
  Af: 'Atrial Fibrillation',
  VF: 'Ventricular Flutter',
  VT: 'Ventricular Tachycardia',
  CAD: 'Coronary Artery Disease',
  'H/T': 'Hypertension',
  RHD: 'Rheumatic Heart Disease',
  SLE: 'Systemic Lupus Erythematosus',
  DIC: 'Disseminated Intravascular Coagulation',
  COPD: 'Chronic Obstructive  Pulmonary  Disease',
  PE: 'Pulmonary Embolism ',
  SOB: 'short of breath',
  URI: 'Upper Respiratory Infection',
  ARF: 'Acute Renal Failure',
  'App.': 'Appendicitis',
  HHNK: 'Hyperglycemic Hyperosmolar Nonketolytic Coma',
  DM: 'diabetes mellitus',
  CP: 'Cerebral Palsy',
  IICP: 'Increased Intracranial Pressure',
  HIVD: 'Herniation of Intervertebral Disc',
  MS: 'Multiple Sclerosis',
  MG: 'Myasthenic Ggravis',
  RA: 'Rreumatoid Arthritis',
  BPH: 'benign prostatic hypertrophy',
  UTI: 'Urinary Tract Infection',
  NPC: 'Nasopharyngeal Carcinoma',
  CPS: 'Chronic paranasal sinusitis',
  RD: 'Retinal Detachment',
  IVF: 'In Vitro Fertilization',
  AFE: 'Amniotic Fluid Embolism',
  VD: 'Venereal Disease',
  PROM: 'Premature Rupture of  Membrane',
  RDS: 'Respiratory Distress Syndrome',
  SAH: 'Subarachnoid Hemorrhage',
  LE: 'Lupus erythematosus',
  TB: 'Tuberculosis',
  Ca: 'potassium',
  CPN: 'chronic pyelonephritis ',
  DOA: 'dead on arrival',
  DOE: 'dyspnea on exercise',
  AGN: 'Acute Glomerulenephritis',
  LP: 'Lumbar Puncture',
  THR: 'Total Hip Replacement',
  'D&C': 'Dilatation and Curettage',
  'D&E': 'Dilatation and Evacuation',
  EP: 'Episiotomy',
  CVP: 'central venous pressure',
  'B.T.': 'Transfusion',
  GCS: 'Glasgow Coma scale',
  ROM: 'Range of  Motion',
  PP: 'Postpartum',
  'C/S': 'Cesarean Section',
  NSD: 'Normal Spontaneous Delivery',
  AAD: 'against-advice discharge',
  BW: 'body  weight',
  CC: 'chief complaint',
  CO: 'cardiac output',
  CPR: 'cardiopulmonary resuscitation',
  BH: 'body height',
  OU: 'Oculus Uterque',
  OS: 'Oculus Sinister',
  OD: ' Oculus Dexter',
  'I&O': 'Intake and output'
}

const obj = {}
const sa = {}
Object.keys(map).forEach(
  _key => {
    const key = _key.toLowerCase()

    obj[key] = [map[_key]]
    if (!sa[key[0]]) {
      sa[key[0]] = []
    }
    sa[key[0]].push(map[_key])
  }
)

const suggestionMap = {
  lt: ['left', 'light', 'lot'],
  ...obj,
  ...sa
}

export default map

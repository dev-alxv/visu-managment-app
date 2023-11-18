
//// FILTER DATA
//////////////

export const statusFilterOptions = [
  { id: 1, name: 'NEW', style: 's-green' },
  { id: 2, name: 'TO_DO', style: 's-grey' },
  { id: 3, name: 'IN_PROGRESS', style: 's-blue' },
  { id: 4, name: 'CUSTOMER_REVIEW', style: 's-purple' },
  { id: 5, name: 'FEEDBACK_REVIEW', style: 's-d-blue' },
  { id: 6, name: 'APPROVED', style: 's-pink' },
  { id: 7, name: 'DONE', style: 's-yellow' }
  // { id: 1, name: "FP_DRAWING_DONE", style: "s-yellow" },
  // { id: 1, name: "FP_FURNISHING_DONE", style: "s-pink" },
  // { id: 1, name: "LOST", style: "s-red" }
];

export const serviceFilterOptions = [
  { id: 1, name: 'Furnished Floorplans', type: 'FLOORPLAN', style: 'b-d-blue' }
];


//// SELECTION DATA
/////////////////

export const serviceTypeSelectOptions: { color: string; name: string; value: 'FLOORPLAN' | 'FAKE_VISU_ORDER'; }[] = [
  { color: 'b-d-blue', name: 'Furnished Floorplan', value: 'FLOORPLAN' }
];

export const orderPrioritySelectOptions: { name: 'Highest priority' | 'High priority' | 'Medium priority' | 'Low priority' | 'Lowest priority'; color: string; }[] = [
  { name: "Highest priority", color: "b-red" },
  { name: "High priority", color: "b-orange" },
  { name: "Medium priority", color: "b-l-blue" },
  { name: "Low priority", color: "b-green" },
  { name: "Lowest priority", color: "b-grey" }
];

export const orderLibrarySelectOptions: { id: number; name: string; value: string; }[] = [
  { id: 1, name: 'Falk', value: 'FALK' },
  { id: 2, name: 'Bonava', value: 'BONAVA' },
  { id: 3, name: 'Sparkasse', value: 'SPARKASSE' }
  // { id: 3, name: 'Scandinavian', value: 'SCANDINAVIAN' },
  // { id: 4, name: 'Luxury', value: 'LUXURY' },
  // { id: 5, name: 'Modern', value: 'MODERN' },
];

export const orderStyleSelectOptions: { id: number; name: string }[] = [
  { id: 1, name: 'PRIMARY' },
  { id: 2, name: 'NEUTRAL' },
  { id: 3, name: 'BLACK_WHITE' },
  { id: 4, name: 'BLACK_WHITE_DEPOSITED' },
  { id: 5, name: 'BONAVA' }
];

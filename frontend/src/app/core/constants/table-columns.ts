export const TABLE_COLUMNS: Readonly<{
  users: string[];
  project: string[];
  vacation: string[];
}> = {
  users: ['name', 'status', 'location', 'project', 'startDate', 'actions'],
  project: ['title', 'category', 'location', 'startDate', 'status', 'actions'],
  vacation: ['user', 'type', 'daysAvailable', 'daysRequested', 'dateRange', 'status', 'actions'],
};

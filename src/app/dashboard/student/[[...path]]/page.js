// app/dashboard/student/[[...path]]/page.js
import StudentLayout from '../layout';

export default function StudentPage({ children }) {
  return <StudentLayout>{children}</StudentLayout>;
}
// components/features/lawyer/LawyerProfileCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaUserCircle, FaStar, FaBriefcase, FaMoneyBillWave } from 'react-icons/fa';

export default function LawyerProfileCard({ lawyer }) {
  return (
    <Card className="rounded-xl border border-primary shadow-lg p-6">
      <div className="flex items-center space-x-4">
        <FaUserCircle size={64} className="text-primary" />
        <div>
          <h3 className="text-2xl font-bold">{lawyer.name}</h3>
          <p className="text-muted-text">{lawyer.specialization}</p>
        </div>
      </div>
      
      <div className="mt-4 space-y-2 text-foreground">
        <div className="flex items-center space-x-2">
          <FaStar size={16} className="text-yellow-500" />
          <span>Rating: {lawyer.ratings || 'N/A'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaBriefcase size={16} />
          <span>Experience: {lawyer.yearsExperience || 'N/A'} years</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaMoneyBillWave size={16} />
          <span>Fees: {lawyer.fees || 'N/A'}</span>
        </div>
      </div>
      
      {/* A button to contact the lawyer or view full profile could go here */}
    </Card>
  );
}

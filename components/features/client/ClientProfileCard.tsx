// components/features/client/ClientProfileCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaUserCircle, FaEnvelope } from 'react-icons/fa';

export default function ClientProfileCard({ client }) {
  return (
    <Card className="rounded-xl border border-primary shadow-lg p-6">
      <div className="flex items-center space-x-4">
        <FaUserCircle size={64} className="text-primary" />
        <div>
          <h3 className="text-2xl font-bold">{client.name}</h3>
          <p className="text-muted-text">Client</p>
        </div>
      </div>
      
      <div className="mt-4 space-y-2 text-foreground">
        <div className="flex items-center space-x-2">
          <FaEnvelope size={16} />
          <span>{client.email}</span>
        </div>
      </div>
    </Card>
  );
}

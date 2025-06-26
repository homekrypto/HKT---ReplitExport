import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Mail } from 'lucide-react';

interface EmailDeliverabilityNoticeProps {
  email?: string;
}

export default function EmailDeliverabilityNotice({ email }: EmailDeliverabilityNoticeProps) {
  const isICloudEmail = email?.includes('@icloud.com') || email?.includes('@me.com') || email?.includes('@mac.com');
  
  if (!isICloudEmail) return null;

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800 dark:text-orange-200">
        <div className="space-y-2">
          <p className="font-medium">iCloud Email Delivery Notice</p>
          <p className="text-sm">
            Apple's mail servers may block verification emails due to strict security policies. 
            If you don't receive the verification email within 5 minutes:
          </p>
          <ul className="text-sm space-y-1 ml-4 list-disc">
            <li>Check your Spam/Junk folder</li>
            <li>Add support@homekrypto.com to your contacts</li>
            <li>Consider using Gmail, Outlook, or another email provider</li>
            <li>Contact support if the issue persists</li>
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
}